// ==UserScript==
// @name         Remove Paywall - The Local SE
// @namespace    Violentmonkey Scripts
// @match        https://www.thelocal.se/*
// @grant        none
// @version      1.1
// @license MIT
// @author       Jackson Mafra
// @description  Removes paywall popups from The Local SE
// @downloadURL https://update.greasyfork.org/scripts/527351/Remove%20Paywall%20-%20The%20Local%20SE.user.js
// @updateURL https://update.greasyfork.org/scripts/527351/Remove%20Paywall%20-%20The%20Local%20SE.meta.js
// ==/UserScript==

(() => {
  function removePaywall() {
    document.querySelector('.tp-modal')?.remove();
    document.querySelector('.tp-backdrop.tp-active')?.remove();
    document.body?.classList.remove('tp-modal-open');
  }

  // Run the function once at start
  removePaywall();

  // Observe for dynamically injected elements
  const observer = new MutationObserver(() => removePaywall());
  observer.observe(document.body, { childList: true, subtree: true });

  console.log("Paywall remover script loaded.");
})();