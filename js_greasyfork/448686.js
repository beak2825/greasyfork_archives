// ==UserScript==
// @name        Expand Table
// @namespace   http://tampermonkey.net/
// @license     MIT
// @version     2.0.1
// @description Expand financial tables on Stock Unlock
// @author      captainsalt
// @match       https://stockunlock.com/*
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/448686/Expand%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/448686/Expand%20Table.meta.js
// ==/UserScript==

const observer = new MutationObserver(() => {
  const financialTable = document.querySelector(".MuiTableContainer-root.css-1kez2ew");

  if (financialTable) {
    financialTable.style.height = "auto";
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
