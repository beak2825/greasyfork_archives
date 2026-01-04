// ==UserScript==
// @name         SoundCloud Cooldown (Tooltip Version)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Long-Press-Hold play/pause 2s for 2h countdown. Music stops when timer ends.
// @author       moony
// @icon         https://soundcloud.com/favicon.ico
// @match        *://soundcloud.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543467/SoundCloud%20Cooldown%20%28Tooltip%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543467/SoundCloud%20Cooldown%20%28Tooltip%20Version%29.meta.js
// ==/UserScript==

(function() { 'use strict';
    const HOLD_MS = 2000, COUNTDOWN_S = 10 * 6 * 120; // ((10s) * 6 = 1m) * 120 = 2 hour
    let playBtn, holdTimer, ticker, blockClick;

    const setupButton = button => {
        if (!button || button._timer) return; // prevent double attachment
        playBtn = button, playBtn._timer = 1;
        const clearHold = () => clearTimeout(holdTimer);
        const startHold = () => {
            if (ticker) return; blockClick = false, clearHold(); // blockClick prevents unwanted click after hold
            holdTimer = setTimeout(() => { let secs = COUNTDOWN_S;
                blockClick = true, playBtn._saved = [playBtn.title || '', playBtn.getAttribute('aria-label') || '']; // store original tooltip
                ticker = setInterval(() => {
                    ['title','aria-label'].forEach(attr => playBtn.setAttribute(attr, `${secs/60|0}m ${secs%60}s`)); // update countdown display
                    if (!--secs) clearInterval(ticker), ticker = null, playBtn.setAttribute('title', playBtn._saved[0]),
                        playBtn.setAttribute('aria-label', playBtn._saved[1]),
                        playBtn.classList.contains('playing') && playBtn.click(); // only click if playing (prevents double-toggle)
                }, 1000);
            }, HOLD_MS);
        };

        playBtn.addEventListener('mousedown', startHold);
        playBtn.addEventListener('mouseup', clearHold);
        playBtn.addEventListener('mouseleave', clearHold); // ↓ capture phase (true) intercepts click before SoundCloud handlers
        playBtn.addEventListener('click', evt => blockClick && (evt.preventDefault(), evt.stopPropagation(), blockClick = false), true);
    }; // MutationObserver needed - SoundCloud recreates DOM on navigation
    new MutationObserver(() => { const button = document.querySelector('.playControl.sc-button-play'); button && button !== playBtn && setupButton(button);
                               }).observe(document.body, {childList: true, subtree: true});

    setupButton(document.querySelector('.playControl.sc-button-play'));
})();