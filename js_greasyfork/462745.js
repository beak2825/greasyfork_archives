// ==UserScript==
// @name        SimsFinds Cleaner
// @namespace   lousando
// @license     MIT
// @match       https://www.simsfinds.com/*
// @grant       none
// @version     1.0
// @author      lousando
// @description Makes SimsFinds a more pleasent visit
// @run-at      document-start
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/462745/SimsFinds%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/462745/SimsFinds%20Cleaner.meta.js
// ==/UserScript==

const meta = document.createElement("meta");
meta.setAttribute("content", "0cd4b4d4f19265b3f05ec9ac29dd8dcb")
document.head.appendChild(meta);

document.addEventListener('DOMContentLoaded', () => {
     VM.observe(document.body, () => {
      Array.from(document.querySelectorAll("a[target='_blank']"))?.forEach(l => l.removeAttribute("target"));
    });

    document.querySelector("._bt-download")?.addEventListener("click", () => {
      window.open(document.querySelector("._bt-download._r3ady").getAttribute("href"));
    });
});
