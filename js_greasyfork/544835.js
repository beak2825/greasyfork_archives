// ==UserScript==
// @name         Marvel Snap Daily Free Credits Auto-Claim
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Smooth-scrolls to the daily free credits button and auto-clicks it
// @author       Felegz (https://github.com/Felegz)
// @license      MIT
// @match        https://shop.marvelsnap.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544835/Marvel%20Snap%20Daily%20Free%20Credits%20Auto-Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/544835/Marvel%20Snap%20Daily%20Free%20Credits%20Auto-Claim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_ID = 'buy-button-dailyfree100credits';
    const CHECK_INTERVAL = 2000; // Interval between checks in milliseconds

    // Function to scroll into view and attempt to click the button
    function tryClaim() {
        const btn = document.getElementById(BUTTON_ID);
        if (!btn) {
            console.log('[AutoClaim] Button not yet in DOM, retrying in', CHECK_INTERVAL, 'ms');
            return;
        }

        // Scroll to the button only once
        if (!btn.dataset.scrolled) {
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            btn.dataset.scrolled = 'true';
            console.log('[AutoClaim] Scrolled to the button');
        }

        // If the button is enabled, click it
        if (!btn.disabled) {
            btn.click();
            console.log('[AutoClaim] Bonus claimed automatically!');
            clearInterval(intervalId);
        } else {
            console.log('[AutoClaim] Button still disabled, retrying in', CHECK_INTERVAL, 'ms');
        }
    }

    // Wait for full page load
    window.addEventListener('load', () => {
        // Start periodic checking
        intervalId = setInterval(tryClaim, CHECK_INTERVAL);
    });
})();
