// ==UserScript==
// @name         Ocado auto-next when checking out (Robust SPA Fix)
// @namespace    http://tampermonkey.net/
// @version      2025-08-06
// @description  Automatically skip optional Ocado checkout steps (ads/gifts), including after SPA navigation and delayed render.
// @author.      pepepepepe
// @match        https://www.ocado.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526415/Ocado%20auto-next%20when%20checking%20out%20%28Robust%20SPA%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526415/Ocado%20auto-next%20when%20checking%20out%20%28Robust%20SPA%20Fix%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_TEXTS = [
        "Continue checkout",
        "No free gift"
    ];

    function clickMatchingElements() {
        const elements = document.querySelectorAll('a, button');
        let clicked = false;

        for (const el of elements) {
            const text = el.textContent?.trim();
            if (!text) continue;

            if (TARGET_TEXTS.some(target => text.includes(target))) {
                el.click();
                console.log(`✅ Clicked: "${text}"`);
                clicked = true;
            }
        }

        return clicked;
    }

    // Retry logic that waits for dynamic DOM rendering
    function waitAndClick(attempt = 0) {
        const maxAttempts = 30;
        const delay = 500; // ms

        if (clickMatchingElements()) {
            console.log("✅ Button found and clicked.");
            return;
        }

        if (attempt < maxAttempts) {
            setTimeout(() => waitAndClick(attempt + 1), delay);
        } else {
            console.warn("⚠️ Button not found after retries.");
        }
    }

    // Run on initial page load
    waitAndClick();

    // Detect SPA navigation
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log("🔄 URL changed:", lastUrl);
            waitAndClick();
        }
    }, 500);
})();
