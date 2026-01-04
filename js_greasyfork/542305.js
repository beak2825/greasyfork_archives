// ==UserScript==
// @license MIT
// @name         Notice 1.1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  test
// @author       dark2care
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542305/Notice%2011.user.js
// @updateURL https://update.greasyfork.org/scripts/542305/Notice%2011.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // ✅ Групи кодів (числові та буквено-числові)
  const codeGroups = {
    xxx: ["42.30.214", "04-CP10", "ABC-999"],
    yyy: ["71.30.4", "10.21.17.S81"],
    zzz: ["22.3.15"]
  };

  // ✅ Увімкнені групи — тільки з цих будуть спрацьовування
  const activeGroups = ["xxx", "yyy"];

  // ✅ Кеш знайдених вже кодів з таймстемпом
  const alreadyAlerted = new Set();

  // 🔍 Витягує всі кодоподібні фрагменти з тексту
  function extractAllPossibleCodes(text) {
    const pattern = /\b[\w\-\.]{4,}\b/g; // Літери, цифри, крапки, дефіси
    return text.match(pattern) || [];
  }

  function checkRow(group) {
    const cells = group.querySelectorAll('.rt-tr > div');
    if (cells.length >= 7) {
      const timestamp = cells[0].innerText.trim();
      const rawText = cells[6].innerText.trim();

      const parts = extractAllPossibleCodes(rawText);

      for (const part of parts) {
        const key = `${part}__${timestamp}`;

        for (const [groupName, codeList] of Object.entries(codeGroups)) {
          if (!activeGroups.includes(groupName)) continue;

          if (codeList.includes(part) && !alreadyAlerted.has(key)) {
            alreadyAlerted.add(key);
            alert(`ок (${groupName})`);
          }
        }
      }
    }
  }

  function observeTable(tbody) {
    const observer = new MutationObserver(() => {
      const groups = tbody.querySelectorAll('.rt-tr-group');
      groups.forEach(checkRow);
    });

    observer.observe(tbody, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });

    console.log("🟢 Спостерігач активний");
  }

  function waitForTable() {
    const tbody = document.querySelector('.comp-panel .ReactTable .rt-table .rt-tbody');
    if (tbody) {
      observeTable(tbody);
    } else {
      setTimeout(waitForTable, 1000);
    }
  }

  // 🔄 Очищення кешу сповіщень кожні 15 хв
  setInterval(() => {
    alreadyAlerted.clear();
    console.log("♻️ Очищено alreadyAlerted");
  }, 15 * 60 * 1000);

  waitForTable();
})();