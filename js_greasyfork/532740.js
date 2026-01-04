// ==UserScript==
// @name         YouTube Auto Cinema Mode
// @namespace    https://github.com/nullstreak
// @version      1.6.2
// @description  Switches YouTube player to Default view or Theater view depending on viewport size.
// @author       Gemini 2.5 Pro, nullstreak
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/532740/YouTube%20Auto%20Cinema%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/532740/YouTube%20Auto%20Cinema%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCREEN_WIDTH_THRESHOLD_PERCENT = 84;
    const DEBOUNCE_DELAY_MS = 250;
    const ENABLE_LOGGING = false;

    function log(message) {
        if (ENABLE_LOGGING) {
            console.log(`YT Smart Player Size: ${message}`);
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function checkAndToggleViewMode() {
        const watchFlexy = document.querySelector('ytd-watch-flexy.watch-root-element');
        const sizeButton = document.querySelector('.ytp-size-button');

        if (!watchFlexy || !sizeButton) {
            log('Required elements not found yet.');
            return;
        }

        const isInFullscreen = watchFlexy.hasAttribute('fullscreen');
        if (isInFullscreen) {
            log('In Fullscreen mode, skipping view mode toggle.');
            return;
        }

        const viewportWidth = window.innerWidth;
        const screenWidth = window.screen.width;
        const thresholdWidth = screenWidth * (SCREEN_WIDTH_THRESHOLD_PERCENT / 100);
        const isInTheaterMode = watchFlexy.hasAttribute('theater');

        log(`Check. Viewport: ${viewportWidth}, Threshold (${SCREEN_WIDTH_THRESHOLD_PERCENT}%): ${thresholdWidth.toFixed(0)}, InTheater: ${isInTheaterMode}, InFullscreen: ${isInFullscreen}`);

        if (viewportWidth > thresholdWidth) { // Should be Default
            if (isInTheaterMode) {
                log(`ACTION: Switching TO Default Mode.`);
                sizeButton.click();
            } else {
                log(`STATUS: Already IN Default Mode.`);
            }
        } else { // Should be Theater
            if (!isInTheaterMode) {
                log(`ACTION: Switching TO Theater Mode.`);
                sizeButton.click();
            } else {
                log(`STATUS: Already IN Theater Mode.`);
            }
        }
    }

    const debouncedCheck = debounce(checkAndToggleViewMode, DEBOUNCE_DELAY_MS);

    function initialize() {
        let checkInterval = null;
        let initTimeout = null;

        const tryInit = () => {
            const watchFlexy = document.querySelector('ytd-watch-flexy.watch-root-element');
            const sizeButton = document.querySelector('.ytp-size-button');

            if (watchFlexy && sizeButton) {
                if (checkInterval) clearInterval(checkInterval);
                if (initTimeout) clearTimeout(initTimeout);
                checkInterval = null;
                initTimeout = null;

                log('Initializing...');
                setTimeout(checkAndToggleViewMode, 200); // Initial check
                window.addEventListener('resize', debouncedCheck);
                log('Ready and listening for resize.');
                return true;
            }
            return false;
        };

        if (!tryInit()) {
             log('Elements not found immediately. Waiting...');
             checkInterval = setInterval(() => {
                 if (tryInit()) {
                     /* handled in tryInit */
                 } else {
                      log('Still waiting for elements...');
                 }
             }, 500);

             initTimeout = setTimeout(() => {
                 if (checkInterval) {
                     clearInterval(checkInterval);
                     checkInterval = null;
                     log('Initialization timed out.');
                 }
                 initTimeout = null;
             }, 20000);
        }
    }

    log("Script loaded. Starting initialization.");
    setTimeout(initialize, 100);

})();