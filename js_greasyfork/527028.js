// ==UserScript==
// @name         Remove Demos From Steam While Browsing
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove demo panels only if they contain the "Free Demo" indicator
// @match        https://store.steampowered.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527028/Remove%20Demos%20From%20Steam%20While%20Browsing.user.js
// @updateURL https://update.greasyfork.org/scripts/527028/Remove%20Demos%20From%20Steam%20While%20Browsing.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function removeFreeDemoPanels() {
    // Find all candidate demo panel containers.
    const panels = document.querySelectorAll('div._1_P15GG6AKyF_NMX2j4-Mu.Panel.Focusable');
    panels.forEach(panel => {
      // Look for a child element with the Free Demo indicator.
      const freeDemoIndicator = panel.querySelector('div._3j4dI1yA7cRfCvK8h406OB');
      if (freeDemoIndicator && freeDemoIndicator.textContent.trim() === "Free Demo") {
        panel.remove();
        console.log("Removed Free Demo panel:", panel);
      }
    });
  }

  // Run on initial page load.
  window.addEventListener('load', removeFreeDemoPanels);

  // Observe DOM mutations in case panels are added dynamically.
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        removeFreeDemoPanels();
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
