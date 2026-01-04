// ==UserScript==
// @name         Reddit Auto 18+ Confirmation 
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Automatically clicks the "Yes, I'm over 18" button on Reddit with retry logic
// @author       LoopFix
// @match        https://www.reddit.com/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @downloadURL https://update.greasyfork.org/scripts/495835/Reddit%20Auto%2018%2B%20Confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/495835/Reddit%20Auto%2018%2B%20Confirmation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_SELECTOR = "body > shreddit-app > div.h-screen.absolute.flex.items-center.top-0.w-100 > div > div > div > confirm-over-18 > button";
    const RETRY_INTERVAL_MS = 500;
    let retryLimit = 30; // Stop after 30 attempts (15 seconds)

    function tryClickOver18Button() {
        const button = document.querySelector(TARGET_SELECTOR);
        if (button) {
            console.log("✅ Found the over 18 button. Clicking it...");
            button.click();
            clearInterval(intervalId);
        } else {
            console.log("⏳ Over 18 button not found, retrying...");
            retryLimit--;
            if (retryLimit <= 0) {
                console.warn("❌ Stopped retrying: Over 18 button not found after multiple attempts.");
                clearInterval(intervalId);
            }
        }
    }

    const intervalId = setInterval(tryClickOver18Button, RETRY_INTERVAL_MS);
})();
