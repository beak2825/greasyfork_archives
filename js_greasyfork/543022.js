// ==UserScript==
// @name         DeepCo Recursion
// @namespace    https://deepco.app/
// @version      2025-07-20
// @description  (for dev analysis only) Auto recurse
// @author       Corns
// @match        https://deepco.app/dig
// @match        https://deepco.app/recursion
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepco.app
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543022/DeepCo%20Recursion.user.js
// @updateURL https://update.greasyfork.org/scripts/543022/DeepCo%20Recursion.meta.js
// ==/UserScript==

(function() {
  'use strict';

  new MutationObserver((mutation, observer) => {
    const main = document.getElementById('main-panel');
    if (main) {
      console.log("[AutoRecursion] Loaded");
      observer.disconnect();
      if (window.location.pathname.includes('/dig')) {
        observeRecursion();
      } else {
        recurse();
      }
    }
  }).observe(document.body, { childList: true, subtree: true });

  function recurse() {
    // clear stored data
    localStorage.removeItem('pendingUpgradeCost');
    localStorage.setItem('targetLevel', 1);
    localStorage.removeItem('teamworkNeeded');
    localStorage.removeItem('upgrades');
    // hit the recurse button
    const recursionForm = document.querySelector('form[action="/recursion/perform"]');

    if (recursionForm) {
      recursionForm.submit();
      console.log('[AutoRecursion] Protocol initiated immediately!');
    }
  }

  function observeRecursion() {
    const header = document.getElementById('recursion-header');
    const recursionLink = header.firstElementChild;
    if (!recursionLink) return;

    const infoText = document.createElement("span");
    infoText.textContent = 'RC_Goal:' + localStorage.getItem('pendingRCCost');
    header.after(infoText);

    if (checkRecursion(recursionLink)) return; // check immediately on page load

    new MutationObserver((mutationsList, observer) => {
      if (checkRecursion(recursionLink)) {
        // observer.disconnect();
      }
    }).observe(header, { attributes: true, childList: true });
  }

  function checkRecursion(recursionLink) {
    // Load stored pending upgrade cost
    const pendingRCCost = parseFloat(localStorage.getItem('pendingRCCost'));

    // Parse current RC
    const upgradesLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('UPGRADES'));
    const match2 = upgradesLink.textContent.match(/\[RC\]\s*([\d,.]+)/);
    const currRC = match2 ? parseFloat(match2[1].replace(/,/g, '')) : 0;

    // Parse potential RC gain from recursing
    const match = recursionLink.textContent.match(/\[\+([\d.]+)\s*RC\]/);
    const recursionGain = match ? parseFloat(match[1]) : 0;

    // nav if we have enough money
    if (recursionGain > 0 && currRC + recursionGain >= pendingRCCost) {
      console.log(`[Dig] Navigating to /recursion. RC: ${currRC + recursionGain} ≥ Pending: ${pendingRCCost}`);
      window.location.href = recursionLink.href || '/recursion';
      return true;
    }
    return false;
  }
})();