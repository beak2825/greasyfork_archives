// ==UserScript==
// @name         Fake Robux Display Mobile-Friendly
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change visible Robux amount on Roblox mobile site (just for fun)
// @author       You
// @match        https://m.roblox.com/*
// @match        https://www.roblox.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541013/Fake%20Robux%20Display%20Mobile-Friendly.user.js
// @updateURL https://update.greasyfork.org/scripts/541013/Fake%20Robux%20Display%20Mobile-Friendly.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetAmount = '13M+';

    // Try selectors for desktop and mobile
    const selectors = [
        '#nav-robux-amount',        // Desktop
        '.nav-robux-amount',        // Alternative desktop class
        '.robux-balance',           // Hypothetical mobile class - adjust after inspection
        '.mobile-robux-amount'      // Hypothetical mobile class - adjust after inspection
    ];

    function setFakeRobux() {
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el && el.textContent.trim() !== targetAmount) {
                el.textContent = targetAmount;
                // Optional: console log for debug
                // console.log(`Updated Robux display at selector: ${selector}`);
            }
        }
    }

    // Run every 1 second for 20 seconds
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(() => {
        setFakeRobux();
        attempts++;
        if (attempts >= maxAttempts) clearInterval(interval);
    }, 1000);

    // Observe mutations as backup
    const observer = new MutationObserver(() => setFakeRobux());
    observer.observe(document.body, { childList: true, subtree: true });
})();
