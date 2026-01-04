// ==UserScript==
// @license MIT
// @name         Notice
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  nothing else matters
// @author       dark2care
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540679/Notice.user.js
// @updateURL https://update.greasyfork.org/scripts/540679/Notice.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
 
  const numericCodes = ["71.40.5", "71.40.4", "71.30.4"];
 
  const exactCodes = ["04-CP10", "10.21.17.S81"];
 
  const alreadyAlerted = new Set();
 
  function extractNumericCode(text) {
    const match = text.match(/\d{1,2}\.\d{1,2}(?:\.\d{1,2})?/);
    return match ? match[0] : null;
  }
 
  function checkRow(group) {
    const cells = group.querySelectorAll('.rt-tr > div');
    if (cells.length >= 7) {
      const timestamp = cells[0].innerText.trim();
      const rawText = cells[6].innerText.trim();
 
      const numericPart = extractNumericCode(rawText);
      const exactKey = `${rawText}__${timestamp}`;
      const numericKey = numericPart ? `${numericPart}__${timestamp}` : null;
 
      const isExactMatch = exactCodes.includes(rawText);
      const isNumericMatch = numericPart && numericCodes.includes(numericPart);
 
      if (isExactMatch && !alreadyAlerted.has(exactKey)) {
        alreadyAlerted.add(exactKey);
        alert("ок");
      }
 
      if (isNumericMatch && !alreadyAlerted.has(numericKey)) {
        alreadyAlerted.add(numericKey);
        alert("ок");
      }
    }
  }
 
  function observeTable(tbody) {
    const observer = new MutationObserver(() => {
      const groups = tbody.querySelectorAll('.rt-tr-group');
      groups.forEach(group => checkRow(group));
    });
 
    observer.observe(tbody, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
 
    console.log("🟢 Спостерігач активний (2 масиви)");
  }
 
  function waitForTable() {
    const tbody = document.querySelector('.comp-panel .ReactTable .rt-table .rt-tbody');
    if (tbody) {
      observeTable(tbody);
    } else {
      setTimeout(waitForTable, 1000);
    }
  }
 
  setInterval(() => {
    alreadyAlerted.clear();
    console.log("♻️ Очищено alreadyAlerted");
  }, 15 * 60 * 1000);
 
  waitForTable();
})();