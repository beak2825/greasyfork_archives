// ==UserScript==
// @name        Modules
// @namespace   CCAU
// @description Automate course copies
// @match       https://*.instructure.com/courses/*/modules
// @version     0.1.0
// @author      CIDT
// @grant       none
// @license     BSD-3-Clause
// @downloadURL https://update.greasyfork.org/scripts/496015/Modules.user.js
// @updateURL https://update.greasyfork.org/scripts/496015/Modules.meta.js
// ==/UserScript==
"use strict";
(() => {
  // out/utils.js
  function addButton(name, fn, sel) {
    const bar = document.querySelector(sel);
    const btn = document.createElement("a");
    btn.textContent = name;
    btn.classList.add("btn");
    btn.setAttribute("tabindex", "0");
    btn.addEventListener("click", fn, false);
    bar?.insertAdjacentElement("afterbegin", btn);
    bar?.insertAdjacentHTML("afterbegin", "&nbsp;");
  }
  function clickButton(sel) {
    const element = document.querySelector(sel);
    const btn = element;
    btn?.click();
  }
  function getChild(element, indices) {
    let cur = element;
    indices.forEach((i_) => {
      const children = cur?.children;
      const len = children.length;
      const i = i_ >= 0 ? i_ : len + i_;
      len > i ? cur = children[i] : null;
    });
    return cur;
  }
  function indexOf(name, skip = 0) {
    return moduleList().findIndex((m, i) => i >= skip && m.title.toLowerCase() === name.toLowerCase());
  }
  function lenientIndexOf(name, skip = 0) {
    return moduleList().findIndex((m, i) => i >= skip && lenientName(m.title) === lenientName(name));
  }
  function lenientName(name) {
    const ln = name.toLowerCase();
    const rgx = /^(week|module|unit) \d{1,2}(?=.?)/;
    const matches = ln.match(rgx);
    const result = matches ? matches[0] : null;
    if (ln.includes("start here")) {
      return "START HERE";
    }
    if (!result) {
      return null;
    }
    return "Week " + result.split(" ")[1];
  }
  function log(msg) {
    console.log("[CCAU] " + msg);
  }
  function moduleList() {
    const sel = ".collapse_module_link";
    const mods = Array.from(document.querySelectorAll(sel));
    return mods;
  }
  function openMenu(idx, btnIdx) {
    const mods = moduleList();
    const hpe = mods[idx].parentElement;
    const btn = getChild(hpe, [5, 0, btnIdx]);
    btn?.click();
  }
  function overrideConfirm() {
    const orig = window.confirm;
    window.confirm = () => true;
    return orig;
  }
  function restoreConfirm(orig) {
    window.confirm = orig;
  }

  // out/date_headers/utils.js
  function actOnDates(idc, fn) {
    const rows = document.querySelectorAll(".ig-row");
    const len = rows.length;
    for (let i = 0; i < len; i++) {
      const rowItem = rows[i];
      const label = getChild(rowItem, [2, 0]);
      const btn = getChild(rowItem, idc);
      const nm = label?.innerText || "";
      const rgx = /^\*?[a-z]{3,12} \d{1,2} - [a-z]{0,12} ?\d{1,2}\*?$/;
      if (!rgx.test(nm.toLowerCase())) {
        continue;
      }
      btn?.click();
      fn(nm);
    }
  }

  // out/date_headers/del.js
  function clickDelete(nm) {
    log(`Removing date header: ${nm}`);
    const nodes = document.querySelectorAll(".ui-kyle-menu");
    const menus = Array.from(nodes).map((e) => e);
    const len = menus.length;
    for (let i = 0; i < len; i++) {
      if (menus[i].getAttribute("aria-hidden") !== "false") {
        continue;
      }
      const miLen = menus[i].children.length;
      const btn = getChild(menus[i], [miLen - 1, 0]);
      btn?.click();
    }
  }
  function removeOldDates() {
    const orig = overrideConfirm();
    actOnDates([3, 2, 1, -1, 0], clickDelete);
    restoreConfirm(orig);
  }

  // out/env.js
  var CORS_PROXY = "https://api.allorigins.win/get?url=";
  var DATA_URL = "https://text.is/ccau_data/raw";

  // out/date_headers/modal.js
  function createModal(div) {
    const container = document.createElement("div");
    const content = document.createElement("div");
    container.className = "ccau_modal";
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.zIndex = "1000";
    content.classList.add("ccau_modal_content");
    content.classList.add("ui-dialog");
    content.classList.add("ui-widget");
    content.classList.add("ui-widget-content");
    content.classList.add("ui-corner-all");
    content.classList.add("ui-dialog-buttons");
    content.style.padding = "20px";
    content.style.textAlign = "center";
    document.body.appendChild(container);
    container.appendChild(content);
    content.appendChild(div);
    return container;
  }
  function semesterButtons() {
    const cached = localStorage.getItem("ccau_data") ?? "{}";
    const data = JSON.parse(cached);
    const semesters = Object.keys(data["dates"]);
    return semesters.map((sem) => {
      const button = document.createElement("button");
      button.textContent = sem;
      button.classList.add("ccau_semester_button");
      button.classList.add("btn");
      button.style.margin = "5px";
      return button;
    });
  }
  function termButtons(semester) {
    const data = JSON.parse(localStorage.getItem("ccau_data") || "{}");
    const terms = Object.keys(data["ranges"][semester]);
    return terms.map((term) => {
      const button = document.createElement("button");
      button.textContent = term;
      button.classList.add("ccau_term_button");
      button.classList.add("btn");
      button.style.margin = "5px";
      return button;
    });
  }
  function replaceButtons(semester) {
    const sel = ".ccau_semester_button";
    const buttons = Array.from(document.querySelectorAll(sel));
    buttons.forEach((button) => button.remove());
    const newButtons = termButtons(semester);
    const modal = document.querySelector(".ccau_modal_content");
    if (!modal) {
      throw new Error("Can't add buttons to null modal");
    }
    newButtons.forEach((button) => modal.appendChild(button));
  }
  async function showModal() {
    const div = document.createElement("div");
    const buttons = semesterButtons();
    const label = document.createElement("div");
    label.textContent = "Which semester is this course?";
    div.appendChild(label);
    let semester = null;
    let term = null;
    return new Promise((resolve) => {
      const tCallback = (btn) => {
        btn.addEventListener("click", () => {
          term = btn.textContent;
          resolve([semester, term]);
          modal.remove();
        });
      };
      const sCallback = (btn) => {
        btn.addEventListener("click", () => {
          semester = btn.textContent;
          replaceButtons(semester || "");
          Array.from(document.querySelectorAll(".ccau_term_button")).map((e) => e).forEach(tCallback);
        });
        div.appendChild(btn);
      };
      buttons.forEach(sCallback);
      const modal = createModal(div);
    });
  }

  // out/date_headers/update.js
  function update() {
    const day = 1e3 * 60 * 60 * 24;
    const now = Date.now();
    const last = Number(localStorage.getItem("ccau_data_ts")) ?? 0;
    if (now - last < day) {
      return;
    }
    fetch(CORS_PROXY + encodeURIComponent(DATA_URL)).then((response) => response.json()).then((data) => {
      localStorage.setItem("ccau_data", data["contents"]);
      localStorage.setItem("ccau_data_ts", now.toString());
    });
  }
  function getRawDates(sem) {
    const data = JSON.parse(localStorage.getItem("ccau_data") || "{}");
    const dates = data["dates"][sem];
    if (!dates) {
      log(`No dates found for ${sem}`);
      return null;
    }
    return dates;
  }
  function getDateRange(sem, term) {
    const data = JSON.parse(localStorage.getItem("ccau_data") || "{}");
    const ret = data["ranges"][sem][term];
    if (!ret) {
      log(`No range found for ${sem} ${term}`);
      return null;
    }
    return ret;
  }
  function datesInRange(dates, range) {
    return range.split(",").flatMap((r) => {
      const nums = r.split("-").map(Number);
      const start = nums[0];
      const end = nums[1];
      return dates.slice(start - 1, end || start);
    });
  }
  function mapToWeeks(dates) {
    const dict = {};
    for (let i = 0; i < dates.length; i++) {
      dict[`Week ${i + 1}`] = dates[i];
    }
    return dict;
  }
  async function getDates() {
    return new Promise((resolve) => {
      update();
      showModal().then(async ([sem, term]) => {
        if (!sem || !term) {
          resolve({});
          return;
        }
        const rawDates = getRawDates(sem);
        const range = getDateRange(sem, term);
        if (!rawDates || !range) {
          resolve({});
          return;
        }
        const dates = datesInRange(rawDates, range);
        resolve(mapToWeeks(dates));
      });
    });
  }

  // out/date_headers/add.js
  function defaultToSubheader() {
    const sel = "#add_module_item_select";
    const element = document.querySelector(sel);
    const select = element;
    const options = Array.from(select.options);
    options?.forEach((opt) => opt.value = "context_module_sub_header");
  }
  function publish() {
    actOnDates([3, 1, 0], (_) => {
    });
  }
  function setInput(sel, val) {
    const element = document.querySelector(sel);
    const textBox = element;
    textBox.value = val;
  }
  async function addDates() {
    removeOldDates();
    defaultToSubheader();
    const dates = await getDates();
    const mods = moduleList();
    const endIdx_ = indexOf("START HERE", 1);
    const endIdx = endIdx_ === -1 ? mods.length : endIdx_;
    for (let i = 0; i < endIdx; i++) {
      const title = mods[i].title;
      const name = lenientName(title);
      if (!name || !dates[name]) {
        log(`No date found for ${name ?? title}`);
        continue;
      }
      openMenu(indexOf(name), 2);
      setInput("#sub_header_title", dates[name]);
      clickButton(".add_item_button");
    }
    setTimeout(publish, 1500);
  }
  function dateButton() {
    addButton("Add Dates", addDates, ".header-bar-right__buttons");
  }

  // out/modules/utils.js
  function isEmpty(idx) {
    const mods = moduleList();
    const mod = mods[idx].parentElement?.parentElement;
    return getChild(mod, [2, 0])?.children.length === 0;
  }
  function getReactHandler(obj) {
    const sel = "__reactEventHandler";
    const keys = Object.keys(obj);
    const key = keys.find((k) => k.startsWith(sel));
    return key;
  }

  // out/modules/del.js
  function clickDelete2() {
    const sel = ".ui-kyle-menu";
    const menus = Array.from(document.querySelectorAll(sel));
    const len = menus.length;
    for (let i = 0; i < len; i++) {
      if (menus[i].getAttribute("aria-hidden") !== "false") {
        continue;
      }
      const menuItem = menus[i];
      const btn = getChild(menuItem, [4, 0]);
      btn?.click();
    }
  }
  function removeEmpty() {
    const orig = overrideConfirm();
    const mods = moduleList();
    const len = mods.length;
    for (let i = 0; i < len - 1; i++) {
      if (!isEmpty(i)) {
        continue;
      }
      openMenu(i, 3);
      clickDelete2();
    }
    restoreConfirm(orig);
  }
  function deleteButton() {
    addButton("Remove Empty", removeEmpty, ".header-bar-right__buttons");
  }

  // out/modules/mov.js
  function clickMoveContents() {
    const sel = ".ui-kyle-menu";
    const menus = Array.from(document.querySelectorAll(sel));
    const len = menus.length;
    for (let i = 0; i < len; i++) {
      if (menus[i].getAttribute("aria-hidden") !== "false") {
        continue;
      }
      const menuItem = menus[i];
      const btn = getChild(menuItem, [2, 0]);
      btn?.click();
    }
  }
  function selectDestination(name) {
    const form = document.querySelector(".move-select-form");
    const options = Array.from(form?.options ?? []);
    const len = options.length;
    if (!form) {
      throw new Error("Could not find .move-select-form");
    }
    for (let i = 0; i < len; i++) {
      const opt = options[i];
      const handlerName = getReactHandler(form);
      const handler = form[handlerName ?? ""];
      const fakeObj = { target: { value: opt.value } };
      if (opt.text !== name) {
        continue;
      }
      form.selectedIndex = i;
      form.value = options[i].value;
      handler.onChange(fakeObj);
      return true;
    }
    return false;
  }
  function moveAll() {
    const startIdx = lenientIndexOf("START HERE", 1);
    const mods = moduleList();
    const len = mods.length;
    if (startIdx === -1) {
      throw new Error("START HERE not found, add it and reload");
    }
    for (let i = startIdx; i < len; i++) {
      const title = mods[i].title;
      const name = lenientName(title);
      const idx = indexOf(title, startIdx);
      if (!name || isEmpty(i)) {
        continue;
      }
      openMenu(idx, 3);
      clickMoveContents();
      if (!selectDestination(name)) {
        throw new Error(`No destination selected for ${name}`);
      }
      clickButton("#move-item-tray-submit-button");
    }
  }
  function moveButton() {
    addButton("Auto-Move", moveAll, ".header-bar-right__buttons");
  }

  // out/index.js
  function main() {
    if (!document.querySelector("#global_nav_accounts_link")) {
      throw new Error("Only admins can use this script");
    }
    dateButton();
    deleteButton();
    moveButton();
  }
  main();
})();
