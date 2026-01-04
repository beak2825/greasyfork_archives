// ==UserScript==
// @license MIT
// @name         Notice 1.0.1
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  nothing else matters
// @author       dark2care
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540884/Notice%20101.user.js
// @updateURL https://update.greasyfork.org/scripts/540884/Notice%20101.meta.js
// ==/UserScript==
 
(function () {
  'use strict';

  const numericCodeGroups = {
    xxx: ["71.40.5", "71.40.4"],
    yyy: ["71.30.4"],
    zzz: ["10.21.17"]
  };

  const exactCodeGroups = {
    xxx: ["04-CP10", "ABC-999"],
    yyy: ["10.21.17.S81"]
  };

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

      for (const [groupName, codeList] of Object.entries(exactCodeGroups)) {
        if (codeList.includes(rawText) && !alreadyAlerted.has(exactKey)) {
          alreadyAlerted.add(exactKey);
          alert(`ок (${groupName})`);
          return;
        }
      }

      if (numericPart) {
        for (const [groupName, codeList] of Object.entries(numericCodeGroups)) {
          if (codeList.includes(numericPart) && !alreadyAlerted.has(numericKey)) {
            alreadyAlerted.add(numericKey);
            alert(`ок (${groupName})`);
            return;
          }
        }
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
  }, 15 * 60 * 1000);

  waitForTable();
})();