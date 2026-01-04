// ==UserScript==
// @name         Nyaa Filters
// @namespace    npm/vite-plugin-monkey
// @version      0.1.0
// @author       pacexy <pacexy@gmail.com>
// @description  Add custom filters for nyaa.si
// @license      MIT
// @icon         https://nyaa.si/static/favicon.png
// @homepage     https://github.com/pacexy/userscript-nyaa-filters#readme
// @homepageURL  https://github.com/pacexy/userscript-nyaa-filters#readme
// @source       https://github.com/pacexy/userscript-nyaa-filters.git
// @supportURL   https://github.com/pacexy/userscript-nyaa-filters/issues
// @match        https://nyaa.si/*
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/518276/Nyaa%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/518276/Nyaa%20Filters.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" #nyaa-filters{margin-bottom:20px}#nyaa-filters input{width:60px;margin-left:10px}#nyaa-filters input::-webkit-inner-spin-button{-webkit-appearance:none} ");

(function () {
  'use strict';

  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  function filterFileSize(tr, options) {
    var _a;
    const td = tr.querySelector("td:nth-child(4)");
    if (!td) return;
    const filesize = (_a = td.textContent) == null ? void 0 : _a.trim();
    if (!filesize) return;
    const parsedFileSize = parseFileSize(filesize);
    return (options.min === void 0 || parsedFileSize >= options.min) && (options.max === void 0 || parsedFileSize <= options.max);
  }
  function parseFileSize(str) {
    const [value, unit] = str.split(" ");
    return parseFloat(value) * (unit === "GiB" ? 1024 : 1);
  }
  const trs = document.querySelectorAll(
    "table.torrent-list tr"
  );
  const container = document.querySelector("body > div.container");
  if (container) {
    const root = document.createElement("div");
    root.id = "nyaa-filters";
    container.prepend(root);
    const label = document.createElement("label");
    label.textContent = "File Size (MB):";
    root.appendChild(label);
    const minInput = createFileSizeInput("min");
    root.appendChild(minInput);
    const maxInput = createFileSizeInput("max");
    root.appendChild(maxInput);
    update();
  }
  _GM_registerMenuCommand("Clear Data", clear);
  function update() {
    const min = _GM_getValue("filesize.min");
    const max = _GM_getValue("filesize.max");
    Array.from(trs).forEach((tr) => {
      if (filterFileSize(tr, { min, max })) {
        tr.style.opacity = "";
      } else {
        tr.style.opacity = "0.5";
      }
    });
  }
  function createFileSizeInput(key) {
    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = key;
    input.value = _GM_getValue(`filesize.${key}`);
    input.addEventListener("input", () => {
      const value = input.value ? parseFloat(input.value) : void 0;
      _GM_setValue(`filesize.${key}`, value);
      update();
    });
    return input;
  }
  function clear() {
    _GM_deleteValue("filesize.min");
    _GM_deleteValue("filesize.max");
    update();
  }

})();