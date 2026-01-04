// ==UserScript==
// @name         Google Sheets Character Count
// @namespace    http://tampermonkey.net/
// @version      2025-05-02
// @description  Fuck Google API and <canvas> in particular
// @author       Firefret
// @match        https://docs.google.com/spreadsheets/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534714/Google%20Sheets%20Character%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/534714/Google%20Sheets%20Character%20Count.meta.js
// ==/UserScript==

(function () {
  let menu;
  let counter;
  let container = document.getElementById("waffle-grid-container");
  setTimeout(function(){menu = document.getElementById("docs-menubar");
    counter = menu.lastElementChild.previousElementSibling;}, 10000)
  container.addEventListener("click", function getCharCount(event) {
    event.preventDefault();
    async function safelyGetCopiedCellValue() {
      const originalClipboard = await navigator.clipboard.readText();
      document.execCommand("copy");
      await new Promise((r) => setTimeout(r, 100)); // may need tuning
      const cellContent = await navigator.clipboard.readText();
      await navigator.clipboard.writeText(originalClipboard);
      return cellContent;
    }

    safelyGetCopiedCellValue().then((value) => {
      counter.innerText = value.length;
    });
  })
})();
