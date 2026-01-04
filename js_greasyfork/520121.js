// ==UserScript==
// @name         GeoGuessr Mode and Leaderboard Sync
// @namespace    http://tampermonkey.net/
// @version      5.8
// @description  Sync the leaderboard switch with the selected game mode.
// @match        https://www.geoguessr.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520121/GeoGuessr%20Mode%20and%20Leaderboard%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/520121/GeoGuessr%20Mode%20and%20Leaderboard%20Sync.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let lastURL = window.location.href;
  let observer;
  let lastSyncedMode = '';

  // Reads the active mode name from the top mode buttons
  function getActiveModeText() {
    const activeModeLabel = document.querySelector(
      '.play-setting-button_root__AfG8z.play-setting-button_selected__A0_ik label'
    );
    return activeModeLabel ? activeModeLabel.textContent.trim() : null;
  }

  // Clicks the corresponding leaderboard switch button
  function simulateClickOnSwitch(labelText) {
    if (!labelText) return;

    // Leaderboard buttons share this label class
    const allSwitches = Array.from(document.querySelectorAll('.switch_label__KrnMF'));

    // Direct match first (e.g., "No move", "NMPZ")
    let targetSwitch = allSwitches.find(
      (el) => el.textContent.trim().toLowerCase() === labelText.trim().toLowerCase()
    );

    // Special case: Mode shows "Moving", leaderboard button says "Move"
    if (!targetSwitch && labelText.trim().toLowerCase() === 'moving') {
      targetSwitch = allSwitches.find(
        (el) => el.textContent.trim().toLowerCase() === 'move'
      );
    }

    if (targetSwitch) {
      targetSwitch.click();
    } else {
      // Silent fail in production; uncomment for debugging
      // console.warn('Leaderboard switch not found for:', labelText);
    }
  }

  function checkAndSyncLeaderboard() {
    if (!window.location.href.includes('/maps/')) return;

    const activeModeText = getActiveModeText();
    if (!activeModeText) return;

    if (activeModeText !== lastSyncedMode) {
      lastSyncedMode = activeModeText;
      simulateClickOnSwitch(activeModeText);
    }
  }

  function setupObserver() {
    observer = new MutationObserver((mutations) => {
      if (mutations.some((m) => m.addedNodes.length || m.attributeName)) {
        checkAndSyncLeaderboard();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }

  function monitorUrlChanges() {
    setInterval(() => {
      const currentURL = window.location.href;
      if (currentURL !== lastURL) {
        lastURL = currentURL;
        if (currentURL.includes('/maps/')) {
          lastSyncedMode = '';
          checkAndSyncLeaderboard();
        }
      }
    }, 1000);
  }

  // Re-check after clicking a mode button
  document.addEventListener('click', (event) => {
    if (event.target.closest('.play-setting-button_root__AfG8z')) {
      setTimeout(checkAndSyncLeaderboard, 60);
    }
  });

  window.addEventListener('load', () => {
    if (window.location.href.includes('/maps/')) {
      setupObserver();
      checkAndSyncLeaderboard();
      monitorUrlChanges();
    }
  });
})();
