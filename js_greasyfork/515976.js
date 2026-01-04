// ==UserScript==
// @name        Cache les objets "vendu" et "achat en cours" sur leboncoin.fr
// @namespace   Tampermonkey Scripts
// @match       https://www.leboncoin.fr/recherche*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=leboncoin.fr
// @grant       none
// @version     1.1
// @author      SuperWaper
// @description 05/11/2024 22:00:00
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/515976/Cache%20les%20objets%20%22vendu%22%20et%20%22achat%20en%20cours%22%20sur%20leboncoinfr.user.js
// @updateURL https://update.greasyfork.org/scripts/515976/Cache%20les%20objets%20%22vendu%22%20et%20%22achat%20en%20cours%22%20sur%20leboncoinfr.meta.js
// ==/UserScript==

const observer = new MutationObserver((mutations) => {
  const spans = document.querySelectorAll('span');
  for (const span of spans) {
    // Check one or other pellets
    if (span.textContent.includes("Achat en cours") || span.textContent.includes("Vendu")) {
      // Catch container div
      let o = span.closest('[data-test-id="adcard-outlined"]'); // Container name

      // If element exist, hide it
      if (o) {
        o.style.display = "none";
      }
    }
  }
});

// Observer for all document changes
observer.observe(document.body, { childList: true, subtree: true });