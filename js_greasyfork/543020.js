// ==UserScript==
// @name         DeepCo Achievements
// @namespace    http://tampermonkey.net/
// @version      2025-07-20
// @description  (for dev analysis only) Auto claim achievements
// @author       Corns
// @match        https://deepco.app/achievements
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepco.app
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543020/DeepCo%20Achievements.user.js
// @updateURL https://update.greasyfork.org/scripts/543020/DeepCo%20Achievements.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const INTERVAL_MS = 1000;

  new MutationObserver((mutation, observer) => {
    const main = document.getElementById('main-panel');
    if (main) {
      console.log("[Achievements] Loaded");
      observer.disconnect();
      startLoop();
    }
  }).observe(document.body, { childList: true, subtree: true });

  function startLoop() {
    doAchievementTask();
    setInterval(() => {
      doAchievementTask();
    }, INTERVAL_MS);
  }

  function doAchievementTask() {
    checkTeamwork();
    clickFirstClaimRewardButton();
  }

  function checkTeamwork() {
    const found = [...document.querySelectorAll('div.locked')]
    .some(item => item.textContent.toLowerCase().includes('assist in processing'));

    localStorage.setItem('teamworkNeeded', found);
  }

  function clickFirstClaimRewardButton() {
    const buttons = document.querySelectorAll('button[type="submit"]');
    for (const button of buttons) {
      if (button.textContent.trim().startsWith('Claim Reward')) {
        // console.log(`[Claim] Clicking reward button: ${button.textContent.trim()}`);
        button.click();
        return;
      }
    }
    // nav to upgrades page if applicable
    if (navigateToUpgradesIfBadge()) {
      return;
    }
    window.location.href = '/';
  }

  function navigateToUpgradesIfBadge() {
    // Find the UPGRADES link with badge
    const upgradesLink = Array.from(document.querySelectorAll('a.badge')).find(a => a.textContent.includes('UPGRADES'));

    if (!upgradesLink) {
      // console.log('[Dig] No UPGRADES link with badge found.');
      return false;
    }

    // Parse current DC value from its text
    const match = upgradesLink.textContent.match(/\[DC\]\s*([\d.]+)/);
    const currentDC = match ? parseFloat(match[1]) : 0;

    // Load stored pending upgrade cost
    const pendingCost = parseFloat(localStorage.getItem('pendingUpgradeCost'));
    // console.log('[Dig] Retrieved pending upgrade cost:', pendingCost);

    if (pendingCost !== null && currentDC < pendingCost) {
      // console.log(`[Dig] Not enough DC (${currentDC}) for pending upgrade cost (${pendingCost}).`);
      return false; // Not enough, stay here
    }

    console.log(`[Achievements] Navigating to /upgrades. DC: ${currentDC} ≥ Pending: ${pendingCost}`);
    window.location.href = upgradesLink.href || '/upgrades';
    return true;
  }
})();