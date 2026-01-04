// ==UserScript==
// @name        Netflix Subtitle Clipboard Auto-Copy
// @namespace   Violentmonkey Scripts
// @match       *://www.netflix.com/*
// @grant       GM_setClipboard
// @version     1.3
// @author      harrisonmg
// @description 2/29/2024, 8:34:39 AM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/488615/Netflix%20Subtitle%20Clipboard%20Auto-Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/488615/Netflix%20Subtitle%20Clipboard%20Auto-Copy.meta.js
// ==/UserScript==

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    for (const node of mutation.addedNodes) {
      if (node.className == "player-timedtext-text-container") {
        const text = node.innerText.replaceAll("\n", "");
        GM_setClipboard(text);
      }
    }
  })
});

observer.observe(document, { subtree: true, childList: true });
