// ==UserScript==
// @license MIT
// @name         Lennium
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Nothing else matters
// @author       dark2care
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543215/Lennium.user.js
// @updateURL https://update.greasyfork.org/scripts/543215/Lennium.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const codeGroups = {
    xxx: ["71.40.5", "71.40.4", "04-CP10", "ABC-999"],
    yyy: ["71.30.4", "10.21.17.S81"],
    zzz: ["25.12.2", "42.30.214", "59.2.9", "59.2.91", "59.2.9 Winter"]
  };

  const activeGroups = ["xxx", "yyy", "zzz"];

  const alreadyAlerted = new Set();

  function checkRow(group) {
    const cells = group.querySelectorAll('.rt-tr > div');
    if (cells.length >= 7) {
      const timestamp = cells[0].innerText.trim();
      const rawText = cells[6].innerText.trim().replace(/\u200B/g, ''); // прибираємо приховані символи

      for (const groupKey of activeGroups) {
        const codes = codeGroups[groupKey];
        for (const code of codes) {
          // Екранування спецсимволів для regex
          const escaped = code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          // Регекс для точного збігу з пробілами або початком/кінцем
          const regex = new RegExp(`(^|\\s)${escaped}(\\s|$)`, 'i');

          if (regex.test(rawText)) {
            const key = `${code}__${timestamp}`;
            if (!alreadyAlerted.has(key)) {
              alreadyAlerted.add(key);
              alert(`✅ Знайдено: [${groupKey}] ${code}`);
            }
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