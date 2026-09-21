"use strict";

/* =========================================================
   Ariyo & Sons Pharmacy
   ---------------------------------------------------------
   1. EDIT THE SETTINGS BELOW (phone, WhatsApp, address, hours)
   2. EDIT THE PRODUCT LIST (names, prices, categories)
   Everything else works on its own.
   ========================================================= */

/* ---------- 1. SETTINGS ---------- */
const CONFIG = {
  name: "Ariyo & Sons Pharmacy",
  phoneDisplay: "+234 903 679 3927",      // shown on the page and used for tap-to-call
  whatsapp: "2349036793927",              // international format, digits only. Change if your WhatsApp number is different
  email: "ariyoandsonpharmacy@gmail.com",
  address: "Ayede–Okeoffin Road, opposite First ECWA Church, behind Kabba Township Stadium, Kogi State, Nigeria",
  currency: "\u20A6",                     // Naira sign
  // Opening hours in 24-hour time. 0 = Sunday ... 6 = Saturday. Use null for closed.
  hours: {
    0: ["12:00", "18:00"],
    1: ["08:00", "20:00"],
    2: ["08:00", "20:00"],
    3: ["08:00", "20:00"],
    4: ["08:00", "20:00"],
    5: ["08:00", "20:00"],
    6: ["08:00", "20:00"]
  }
};

/* ---------- 2. PRODUCTS ----------
   id      : unique, no spaces
   cat     : pain | cold | stomach | vitamins | firstaid | baby | rx
   form    : tablet | syrup | sachet | device | cream
   rx      : true if a prescription is needed
   price   : in Naira (sample prices, replace with yours)
*/
const CATEGORIES = [
  { id: "all",      label: "All" },
  { id: "pain",     label: "Pain and fever" },
  { id: "cold",     label: "Cold and allergy" },
  { id: "stomach",  label: "Stomach" },
  { id: "vitamins", label: "Vitamins" },
  { id: "firstaid", label: "First aid and devices" },
  { id: "baby",     label: "Baby and mother" },
  { id: "rx",       label: "Prescription" }
];

const PRODUCTS = [
  { id: "para500",   name: "Paracetamol 500mg",            detail: "Pack of 20 tablets",        cat: "pain",     form: "tablet", price: 500 },
  { id: "ibu400",    name: "Ibuprofen 400mg",              detail: "Pack of 10 tablets",        cat: "pain",     form: "tablet", price: 600 },
  { id: "diclogel",  name: "Diclofenac gel 1%",            detail: "50 g tube",                 cat: "pain",     form: "cream",  price: 1800 },
  { id: "lorat10",   name: "Loratadine 10mg",              detail: "Pack of 10 tablets",        cat: "cold",     form: "tablet", price: 900 },
  { id: "coughsyr",  name: "Cough syrup, adult",           detail: "100 ml bottle",             cat: "cold",     form: "syrup",  price: 1500 },
  { id: "ors5",      name: "Oral rehydration salts",       detail: "Pack of 5 sachets",         cat: "stomach",  form: "sachet", price: 1000 },
  { id: "antacid",   name: "Antacid chewable tablets",     detail: "Pack of 24 tablets",        cat: "stomach",  form: "tablet", price: 800 },
  { id: "vitc",      name: "Vitamin C 1000mg",             detail: "10 effervescent tablets",   cat: "vitamins", form: "tablet", price: 2500 },
  { id: "multivit",  name: "Multivitamin",                 detail: "Pack of 30 tablets",        cat: "vitamins", form: "tablet", price: 3500 },
  { id: "thermo",    name: "Digital thermometer",          detail: "1 piece",                   cat: "firstaid", form: "device", price: 2500 },
  { id: "plasters",  name: "Adhesive plasters",            detail: "Pack of 20",                cat: "firstaid", form: "sachet", price: 700 },
  { id: "sanitiser", name: "Hand sanitiser",               detail: "250 ml bottle",             cat: "firstaid", form: "syrup",  price: 1500 },
  { id: "folic400",  name: "Folic acid 400mcg",            detail: "Pack of 30 tablets",        cat: "baby",     form: "tablet", price: 1200 },
  { id: "rashcream", name: "Baby nappy rash cream",        detail: "50 g tube",                 cat: "baby",     form: "cream",  price: 2200 },
  { id: "amox500",   name: "Amoxicillin 500mg",            detail: "Pack of 15 capsules",       cat: "rx",       form: "tablet", price: 3000, rx: true },
  { id: "act",       name: "Malaria treatment (ACT)",      detail: "Adult course",              cat: "rx",       form: "tablet", price: 2500, rx: true }
];

/* =========================================================
   Below this line you normally do not need to change anything.
   ========================================================= */

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HOURS_ORDER = [1, 2, 3, 4, 5, 6, 0];

const ICONS = {
  tablet: '<svg viewBox="0 0 24 24" aria-hidden="true"><g transform="rotate(-40 12 12)"><rect x="2.5" y="8.5" width="19" height="7" rx="3.5"/><path d="M12 8.5v7"/></g></svg>',
  syrup:  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6v3l1.5 2v11a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V8L9 6z"/><path d="M7.5 13h9"/></svg>',
  sachet: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M5 7h14M9 12h6M9 15h4"/></svg>',
  device: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/><path d="M12 9v7"/></svg>',
  cream:  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10l-1 4H8z"/><path d="M8 8h8l-.5 12h-7z"/></svg>'
};

/* ---------- Helpers ---------- */
const money = (n) => CONFIG.currency + Number(n).toLocaleString("en-NG");

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
));

function loadStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function saveStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
}

let toastTimer;
function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 4500);
}

function whatsappNumber() {
  const digits = CONFIG.whatsapp.replace(/\D/g, "");
  return /^\d{10,15}$/.test(digits) && !/x/i.test(CONFIG.whatsapp) ? digits : null;
}

function openWhatsApp(text) {
  const num = whatsappNumber();
  if (!num) {
    toast("Set the pharmacy WhatsApp number in script.js (CONFIG.whatsapp) first.");
    return false;
  }
  window.open("https://wa.me/" + num + "?text=" + encodeURIComponent(text), "_blank", "noopener");
  return true;
}

function validateForm(form) {
  let firstBad = null;
  $$("input[required], textarea[required]", form).forEach((field) => {
    const bad = !field.value.trim();
    field.classList.toggle("invalid", bad);
    if (bad && !firstBad) firstBad = field;
  });
  if (firstBad) {
    firstBad.focus();
    toast("Please fill in the highlighted fields.");
    return false;
  }
  return true;
}

function bindDelivery(form) {
  const select = $("select[name='method']", form);
  const wrap = $(".js-address", form);
  const textarea = $("textarea[name='address']", form);
  if (!select || !wrap) return;
  const update = () => {
    const delivery = select.value === "delivery";
    wrap.hidden = !delivery;
    textarea.required = delivery;
    if (!delivery) textarea.classList.remove("invalid");
  };
  select.addEventListener("change", update);
  update();
}

/* ---------- Settings applied to the page ---------- */
function applyConfig() {
  $$("[data-cfg]").forEach((n) => { if (CONFIG[n.dataset.cfg]) n.textContent = CONFIG[n.dataset.cfg]; });
  $$("[data-cfg-tel]").forEach((a) => { a.href = "tel:" + CONFIG.phoneDisplay.replace(/[^\d+]/g, ""); });
  $$("[data-cfg-mail]").forEach((a) => { a.href = "mailto:" + CONFIG.email; });
  $$("[data-cfg-map]").forEach((a) => {
    a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.name + " " + CONFIG.address);
  });
  $("#year").textContent = new Date().getFullYear();
}

/* ---------- Opening hours ---------- */
const toMinutes = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
function fmtTime(t) {
  let [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return h + (m ? ":" + String(m).padStart(2, "0") : ":00") + " " + suffix;
}

function pharmacyStatus(now = new Date()) {
  const day = now.getDay();
  const today = CONFIG.hours[day];
  const mins = now.getHours() * 60 + now.getMinutes();

  if (today) {
    const open = toMinutes(today[0]);
    const close = toMinutes(today[1]);
    if (mins >= open && mins < close) return { open: true, text: "Open now, closes " + fmtTime(today[1]) };
    if (mins < open) return { open: false, text: "Closed now, opens today at " + fmtTime(today[0]) };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const h = CONFIG.hours[d];
    if (h) {
      const label = i === 1 ? "tomorrow" : DAY_NAMES[d];
      return { open: false, text: "Closed now, opens " + label + " at " + fmtTime(h[0]) };
    }
  }
  return { open: false, text: "Closed" };
}

function renderStatus() {
  const s = pharmacyStatus();
  $("#status-text").textContent = s.text;
  const dot = $("#status-dot");
  dot.classList.toggle("open", s.open);
  dot.classList.toggle("closed", !s.open);
}

function renderHours() {
  const todayIndex = new Date().getDay();
  $("#hours-list").innerHTML = HOURS_ORDER.map((d) => {
    const h = CONFIG.hours[d];
    return '<tr class="' + (d === todayIndex ? "today" : "") + '"><th scope="row">' + DAY_NAMES[d] +
      "</th><td>" + (h ? fmtTime(h[0]) + " to " + fmtTime(h[1]) : "Closed") + "</td></tr>";
  }).join("");
}

/* ---------- Shop ---------- */
let activeCat = "all";
let searchTerm = "";

function renderChips() {
  $("#chips").innerHTML = CATEGORIES.map((c) =>
    '<button class="chip" type="button" data-cat="' + c.id + '" aria-pressed="' + (c.id === activeCat) + '">' + c.label + "</button>"
  ).join("");
}

function renderShelf() {
  const q = searchTerm.trim().toLowerCase();
  const list = PRODUCTS.filter((p) =>
    (activeCat === "all" || p.cat === activeCat) &&
    (!q || (p.name + " " + p.detail).toLowerCase().includes(q))
  );

  $("#shelf").innerHTML = list.map((p) =>
    '<li class="item">' +
      '<span class="item-icon">' + ICONS[p.form] + "</span>" +
      '<div class="item-info"><h3>' + esc(p.name) + "</h3><p>" + esc(p.detail) +
        (p.rx ? ' <span class="rx-tag">Prescription needed</span>' : "") + "</p></div>" +
      '<div class="item-buy"><span class="price">' + money(p.price) + "</span>" +
        '<button class="btn btn-green btn-sm" type="button" data-add="' + p.id + '" aria-label="Add ' + esc(p.name) + ' to my order">Add</button></div>' +
    "</li>"
  ).join("");

  $("#result-count").textContent = list.length ? list.length + (list.length === 1 ? " item" : " items") : "";
  $("#empty").hidden = list.length > 0;
}

/* ---------- Cart ---------- */
let cart = loadStore("ariyo_cart", {});
Object.keys(cart).forEach((id) => {
  if (!PRODUCTS.some((p) => p.id === id) || !(cart[id] > 0)) delete cart[id];
});

const findProduct = (id) => PRODUCTS.find((p) => p.id === id);
const cartIds = () => Object.keys(cart);
const cartCount = () => cartIds().reduce((sum, id) => sum + cart[id], 0);
const cartTotal = () => cartIds().reduce((sum, id) => sum + cart[id] * findProduct(id).price, 0);

function saveCart() {
  saveStore("ariyo_cart", cart);
  renderCart();
}

function renderCart() {
  const ids = cartIds();
  $("#cart-count").textContent = cartCount();
  $("#cart-empty").hidden = ids.length > 0;
  $("#checkout-send").disabled = ids.length === 0;
  $("#cart-total").textContent = money(cartTotal());
  $("#cart-note").hidden = !ids.some((id) => findProduct(id).rx);

  $("#cart-items").innerHTML = ids.map((id) => {
    const p = findProduct(id);
    return '<li class="cart-line">' +
      "<div><h3>" + esc(p.name) + "</h3><p>" + esc(p.detail) + (p.rx ? " (prescription needed)" : "") + "</p></div>" +
      '<span class="line-price">' + money(p.price * cart[id]) + "</span>" +
      '<div class="qty" role="group" aria-label="Quantity of ' + esc(p.name) + '">' +
        '<button type="button" data-qty="dec" data-id="' + id + '" aria-label="Remove one">&minus;</button>' +
        "<span>" + cart[id] + "</span>" +
        '<button type="button" data-qty="inc" data-id="' + id + '" aria-label="Add one">+</button>' +
      "</div>" +
      '<button class="remove" type="button" data-qty="remove" data-id="' + id + '">Remove</button>' +
    "</li>";
  }).join("");
}

function addToCart(id, button) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  if (button) {
    const original = button.textContent;
    button.textContent = "Added";
    setTimeout(() => { button.textContent = original; }, 900);
  }
}

let lastFocus = null;
const INERT_TARGETS = [".site-header", "main", ".site-footer", "#wa-float"];

function openCart() {
  lastFocus = document.activeElement;
  INERT_TARGETS.forEach((s) => { const el = $(s); if (el) el.inert = true; });
  $("#cart").classList.add("open");
  $("#cart").setAttribute("aria-hidden", "false");
  $("#overlay").classList.add("show");
  document.body.classList.add("no-scroll");
  $("#cart-close").focus();
}

function closeCart() {
  $("#cart").classList.remove("open");
  $("#cart").setAttribute("aria-hidden", "true");
  $("#overlay").classList.remove("show");
  document.body.classList.remove("no-scroll");
  INERT_TARGETS.forEach((s) => { const el = $(s); if (el) el.inert = false; });
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
}

function buildOrderMessage(form) {
  const data = new FormData(form);
  const lines = ["Hello " + CONFIG.name + ", I would like to order:", ""];
  cartIds().forEach((id, i) => {
    const p = findProduct(id);
    lines.push((i + 1) + ". " + p.name + " (" + p.detail + ") x" + cart[id] + " = " + money(p.price * cart[id]) + (p.rx ? " [prescription needed]" : ""));
  });
  lines.push("", "Estimated total: " + money(cartTotal()), "");
  lines.push("Name: " + data.get("name").trim());
  lines.push("Phone: " + data.get("phone").trim());
  if (data.get("method") === "delivery") {
    lines.push("Delivery to: " + (data.get("address") || "").trim());
  } else {
    lines.push("I will collect in store.");
  }
  if (cartIds().some((id) => findProduct(id).rx)) {
    lines.push("", "I will send a photo of my prescription in this chat.");
  }
  return lines.join("\n");
}

/* ---------- Prescription form ---------- */
function buildPrescriptionMessage(form) {
  const data = new FormData(form);
  const lines = ["Hello " + CONFIG.name + ", I would like to send a prescription.", ""];
  lines.push("Name: " + data.get("name").trim());
  lines.push("Phone: " + data.get("phone").trim());
  if (data.get("method") === "delivery") {
    lines.push("Please deliver to: " + (data.get("address") || "").trim());
  } else {
    lines.push("I will collect in store.");
  }
  const details = (data.get("details") || "").trim();
  if (details) lines.push("Notes: " + details);
  lines.push("", "I am attaching a photo of the prescription now.");
  return lines.join("\n");
}

/* ---------- Refill reminders ---------- */
let refills = loadStore("ariyo_refills", []);
if (!Array.isArray(refills)) refills = [];

const DAY_MS = 86400000;
function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function isoToday() {
  const t = new Date();
  return t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
}

function refillInfo(r) {
  const due = new Date(parseDate(r.start).getTime() + r.days * DAY_MS);
  const diff = Math.round((startOfDay(due) - startOfDay(new Date())) / DAY_MS);
  const dateText = due.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  if (diff < 0)  return { cls: "late", text: "Refill was due " + Math.abs(diff) + (Math.abs(diff) === 1 ? " day" : " days") + " ago (" + dateText + ")" };
  if (diff === 0) return { cls: "due",  text: "Refill is due today" };
  if (diff <= 5) return { cls: "due",  text: "Refill due in " + diff + (diff === 1 ? " day" : " days") + " (" + dateText + ")" };
  return { cls: "ok", text: "Refill due in " + diff + " days (" + dateText + ")" };
}

function renderRefills() {
  $("#refill-empty").hidden = refills.length > 0;
  $("#refill-list").innerHTML = refills.map((r) => {
    const info = refillInfo(r);
    return '<li class="' + info.cls + '">' +
      '<p class="refill-name">' + esc(r.med) + "</p>" +
      '<p class="refill-when">' + info.text + "</p>" +
      '<div class="refill-actions">' +
        '<button class="btn btn-green btn-sm" type="button" data-refill-ask="' + r.id + '">Ask for refill</button>' +
        '<button class="btn btn-ghost btn-sm" type="button" data-refill-del="' + r.id + '">Remove</button>' +
      "</div></li>";
  }).join("");
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  renderStatus();
  renderHours();
  setInterval(renderStatus, 60000);

  renderChips();
  renderShelf();
  renderCart();
  renderRefills();

  /* Mobile menu */
  const nav = $("#nav");
  const navToggle = $("#nav-toggle");
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    }
  });

  /* Shop */
  $("#chips").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    activeCat = btn.dataset.cat;
    renderChips();
    renderShelf();
  });
  $("#shop-search").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderShelf();
  });
  $("#shelf").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (btn) addToCart(btn.dataset.add, btn);
  });
  $("#empty-ask").addEventListener("click", () => {
    const what = searchTerm.trim();
    openWhatsApp("Hello " + CONFIG.name + ", do you have " + (what || "this medicine") + " in stock?");
  });

  /* Cart drawer */
  $("#cart-open").addEventListener("click", openCart);
  $("#cart-close").addEventListener("click", closeCart);
  $("#overlay").addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $("#cart").classList.contains("open")) closeCart();
  });

  $("#cart-items").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-qty]");
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.qty === "inc") cart[id] += 1;
    if (btn.dataset.qty === "dec") cart[id] -= 1;
    if (btn.dataset.qty === "remove" || cart[id] <= 0) delete cart[id];
    saveCart();
  });

  $("#clear-cart").addEventListener("click", () => {
    if (!cartIds().length) return;
    cart = {};
    saveCart();
    toast("Your order has been cleared.");
  });

  const checkout = $("#checkout");
  bindDelivery(checkout);
  checkout.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!cartIds().length) return;
    if (!validateForm(checkout)) return;
    if (openWhatsApp(buildOrderMessage(checkout))) {
      toast("WhatsApp is opening. Send the message to place your order request.");
    }
  });

  /* Prescription */
  const rxForm = $("#rx-form");
  bindDelivery(rxForm);
  rxForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(rxForm)) return;
    if (openWhatsApp(buildPrescriptionMessage(rxForm))) {
      toast("WhatsApp is opening. Attach a photo of your prescription in the chat.");
    }
  });

  /* Refill reminders */
  const refillForm = $("#refill-form");
  $("#rf-start").value = isoToday();
  refillForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(refillForm)) return;
    const data = new FormData(refillForm);
    const days = Math.min(365, Math.max(1, parseInt(data.get("days"), 10) || 30));
    refills.push({
      id: String(Date.now()),
      med: data.get("med").trim(),
      start: data.get("start") || isoToday(),
      days
    });
    saveStore("ariyo_refills", refills);
    renderRefills();
    refillForm.reset();
    $("#rf-start").value = isoToday();
    $("#rf-days").value = 30;
    toast("Reminder saved on this device.");
  });

  $("#refill-list").addEventListener("click", (e) => {
    const del = e.target.closest("[data-refill-del]");
    const ask = e.target.closest("[data-refill-ask]");
    if (del) {
      refills = refills.filter((r) => r.id !== del.dataset.refillDel);
      saveStore("ariyo_refills", refills);
      renderRefills();
    }
    if (ask) {
      const r = refills.find((x) => x.id === ask.dataset.refillAsk);
      if (r) openWhatsApp("Hello " + CONFIG.name + ", I would like to refill: " + r.med + ".");
    }
  });

  /* Floating WhatsApp button */
  $("#wa-float").addEventListener("click", (e) => {
    e.preventDefault();
    openWhatsApp("Hello " + CONFIG.name + ", I have a question.");
  });
});
