// ==UserScript==
// @name         Twitch Auto Claim & Stream Bonus Helper
// @namespace    DomopremoScripts
// @version      2.0
// @description  Auto-claims channel points, sets low quality, mutes stream, reloads if frozen, and more — all toggleable via hotkey.
// @author       Domopremo
// @match        https://www.twitch.tv/*
// @icon         https://www.twitch.tv/favicon.ico
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544846/Twitch%20Auto%20Claim%20%20Stream%20Bonus%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/544846/Twitch%20Auto%20Claim%20%20Stream%20Bonus%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let enabled = true;

  const log = (...args) =>
    console.log('%c[Domopremo Twitch Helper]', 'color:#7fffd4;font-weight:bold;', ...args);

  log('✅ Script loaded. Press Ctrl+Shift+T to toggle on/off.');

  // ✅ Hotkey Toggle (Ctrl+Shift+T)
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyT') {
      enabled = !enabled;
      log(`Script ${enabled ? 'enabled' : 'disabled'}`);
    }
  });

  // ✅ Auto-Claim Channel Points
  function claimPoints() {
    if (!enabled) return;
    const btn = document.querySelector('button[aria-label="Claim Bonus"]');
    if (btn) {
      btn.click();
      log('🎁 Claimed channel points');
    }
  }

  // ✅ Auto-Mute Stream
  function muteStream() {
    if (!enabled) return;
    const muteBtn = document.querySelector('[data-a-target="player-mute-unmute-button"]');
    const isUnmuted = muteBtn?.getAttribute('aria-label')?.toLowerCase().includes('unmute');
    if (muteBtn && isUnmuted) {
      muteBtn.click();
      log('🔇 Muted stream');
    }
  }

  // ✅ Set Lowest Stream Quality (Smart Sort)
  function setLowestQuality() {
    if (!enabled) return;
    const settingsBtn = document.querySelector('[data-a-target="player-settings-button"]');
    if (!settingsBtn) return;

    settingsBtn.click();

    setTimeout(() => {
      const qualityMenuBtn = [...document.querySelectorAll('[role="menuitem"]')]
        .find(el => el.textContent.toLowerCase().includes('quality'));

      if (!qualityMenuBtn) {
        setTimeout(setLowestQuality, 2000); // retry
        return;
      }

      qualityMenuBtn.click();

      setTimeout(() => {
        const options = [...document.querySelectorAll('[role="menuitemradio"]')];
        if (options.length === 0) return;

        const sorted = options.sort((a, b) => {
          const resA = parseInt(a.textContent.match(/\d+/)?.[0] || '0', 10);
          const resB = parseInt(b.textContent.match(/\d+/)?.[0] || '0', 10);
          return resA - resB;
        });

        sorted[0]?.click();
        log('📉 Set to lowest quality');
      }, 400);
    }, 400);
  }

  // ✅ Detect Frozen Stream (reload if not playing)
  function detectFrozenStream() {
    if (!enabled) return;
    const video = document.querySelector('video');
    if (!video || video.paused) return;

    const current = video.currentTime;
    setTimeout(() => {
      if (video.currentTime === current && !video.paused) {
        log('🔁 Stream frozen — reloading...');
        location.reload();
      }
    }, 10000); // 10s delay
  }

  // ✅ Auto Fullscreen (Optional – uncomment if wanted)
  /*
  function enterFullscreen() {
    const fsBtn = document.querySelector('[data-a-target="player-fullscreen-button"]');
    if (fsBtn) {
      fsBtn.click();
      log('🖥 Entered fullscreen');
    }
  }
  */

  // ✅ MutationObserver for bonus button
  const observer = new MutationObserver(() => {
    claimPoints();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // ✅ Main loop
  function mainLoop() {
    claimPoints();
    muteStream();
    detectFrozenStream();
  }

  setInterval(mainLoop, 15000); // every 15s
  setTimeout(setLowestQuality, 5000); // run once after 5s
  // setTimeout(enterFullscreen, 8000); // optional

})();
