// ==UserScript==
// @name         Udemy Speed Fix - UI Sync
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fixes Udemy bug: if UI shows 2x speed, ensure video plays at 2x after lecture change.
// @author       Ameer Jamal
// @match        https://*.udemy.com/course/*/learn/lecture/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538236/Udemy%20Speed%20Fix%20-%20UI%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/538236/Udemy%20Speed%20Fix%20-%20UI%20Sync.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === CONFIG ===
    const ACTION_DELAY_MS = 1000;

    // === STATE ===
    let initialLoadCheckDone = false;

    function log(message) {
        console.log("[Udemy Speed Fix v1.1] " + message);
    }

    function extractSpeedFromElement(el) {
        if (!el) return null;
        const text = el.textContent.trim();
        const match = text.match(/^([0-9]\.?[0-9]*)x$/);
        if (match) {
            const value = parseFloat(match[1]);
            return isNaN(value) ? null : { text, value };
        }
        return null;
    }

    function findSpeedFromButton() {
        const speedButton = document.querySelector('button[data-purpose="playback-rate-button"]');
        if (!speedButton) return null;

        const innerSpan = speedButton.querySelector('span');
        return extractSpeedFromElement(innerSpan) || extractSpeedFromElement(speedButton);
    }

    function findSpeedFromControlBars() {
        const controlBarSelectors = [
            'div[class*="control-bar--control-bar--"]',
            'div[data-purpose="video-controls"]'
        ];
        for (const selector of controlBarSelectors) {
            const bar = document.querySelector(selector);
            if (!bar) continue;
            const buttons = bar.querySelectorAll('button');
            for (const btn of buttons) {
                const info = extractSpeedFromElement(btn);
                if (info) return info;
            }
        }
        return null;
    }

    function getCurrentDisplayedSpeedInfo() {
        const fromButton = findSpeedFromButton();
        if (fromButton) {
            log(`Found speed via playback-rate-button: ${fromButton.text}`);
            return fromButton;
        }
        const fromBar = findSpeedFromControlBars();
        if (fromBar) {
            log(`Found speed via control bar: ${fromBar.text}`);
            return fromBar;
        }
        log("Could not find current speed display element.");
        return null;
    }

    function applySpeedFix() {
        log("Attempting to apply speed fix...");
        const videoElement = document.querySelector('video');

        if (!videoElement) {
            log("No video element found on the page.");
            return;
        }

        const displayedSpeedInfo = getCurrentDisplayedSpeedInfo();

        if (displayedSpeedInfo && typeof displayedSpeedInfo.value === 'number' && !isNaN(displayedSpeedInfo.value)) {
            if (videoElement.playbackRate !== displayedSpeedInfo.value) {
                log(`Mismatch! UI shows ${displayedSpeedInfo.text}, video playbackRate is ${videoElement.playbackRate}. Setting to ${displayedSpeedInfo.value}.`);
                videoElement.playbackRate = displayedSpeedInfo.value;
            } else {
                log(`UI shows ${displayedSpeedInfo.text}, and video playbackRate is already correct.`);
            }
        } else {
            log("Could not determine a valid displayed speed from UI.");
        }
    }

    function observeUrlChange(callback) {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                callback();
            }
        }).observe(document, { subtree: true, childList: true });
    }

    function runInitialSpeedFix() {
        if (document.readyState === 'complete') {
            if (!initialLoadCheckDone) {
                log("Document complete. Performing initial speed check.");
                setTimeout(applySpeedFix, ACTION_DELAY_MS);
                initialLoadCheckDone = true;
            }
        } else {
            setTimeout(runInitialSpeedFix, 500);
        }
    }

    observeUrlChange(() => {
        log(`URL changed to ${window.location.href}`);
        setTimeout(applySpeedFix, ACTION_DELAY_MS);
    });

    log("Script loaded. Monitoring for SPA URL changes.");
    runInitialSpeedFix();
})();
