// ==UserScript==
// @name         Force Google Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically and resiliently enables dark mode on Google, handling multiple UI versions and DOM changes.
// @author       HappySmacky3453
// @license      MIT
// @match        https://www.google.*/
// @match        https://www.google.*/#*
// @match        https://www.google.*/search*
// @match        https://www.google.*/preferences*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539001/Force%20Google%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/539001/Force%20Google%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration ---
    const LOG_PREFIX = '🌙 [Force Google Dark Mode]:';
    const TIMEOUT_MS = 10000;
    const CLICK_DELAY_MS = 50; // A small delay to ensure element listeners are attached.

    // --- Selectors & Heuristics ---
    const SELECTORS = {
        MENU_ITEM_REGEX: /dark theme: off|light theme|appearance: (device|light|default)/i,
    };
    const DARK_MODE_COLOR_HEURISTIC = 'rgb(32, 33, 36)';

    // --- State ---
    let observer;
    let timeoutId;

    /**
     * Checks if dark mode is already enabled using multiple reliable methods.
     * @returns {boolean}
     */
    const isDarkModeAlreadyOn = () => {
        const html = document.documentElement;
        if (html.hasAttribute('dark')) return true;
        if (html.getAttribute('data-darkreader-scheme') === 'dark') return true;

        const metaTheme = document.querySelector('meta[name="color-scheme"]');
        if (metaTheme?.content.includes('dark')) return true;

        if (document.body && getComputedStyle(document.body).backgroundColor === DARK_MODE_COLOR_HEURISTIC) return true;

        return false;
    };

    /**
     * Attempts to find and click a dark mode toggle element.
     * @returns {boolean} True if a toggle was found.
     */
    const tryToEnableDarkMode = () => {
        if (isDarkModeAlreadyOn()) {
            console.log(LOG_PREFIX, '✅ Dark mode is already active. Cleaning up.');
            cleanUp();
            return true;
        }

        let elementToClick = null;

        // Strategy 1: Find the main menu item toggle.
        const menuToggle = [...document.querySelectorAll('[role="menuitem"]')]
            .find(el => SELECTORS.MENU_ITEM_REGEX.test(el.textContent));
        if (menuToggle) {
            elementToClick = menuToggle;
        }

        // Strategy 2: Find the radio button on the preferences page.
        if (!elementToClick) {
            const radioToggle = [...document.querySelectorAll('g-radio-button')]
                .find(btn =>
                    btn.closest('[role="radiogroup"]') &&
                    /dark/i.test(btn.textContent || btn.getAttribute('aria-label') || '')
                );
            if (radioToggle && radioToggle.getAttribute('aria-checked') !== 'true') {
                elementToClick = radioToggle;
            }
        }

        if (elementToClick) {
            console.log(LOG_PREFIX, 'Found toggle element. Attempting to click...', elementToClick);
            try {
                // Use a short delay for stability on dynamic pages.
                setTimeout(() => {
                    elementToClick.click();
                    console.log(LOG_PREFIX, '✅ Successfully triggered dark mode toggle.');
                }, CLICK_DELAY_MS);
                // Once we find and trigger the element, we don't need to search again on this pass.
                // The next mutation will confirm success via isDarkModeAlreadyOn().
                return true;
            } catch (err) {
                console.error(LOG_PREFIX, '⚠️ Failed to click dark mode toggle:', err);
            }
        }

        return false;
    };

    /**
     * Stops observing DOM changes and clears the safety timeout.
     */
    const cleanUp = () => {
        if (observer) {
            observer.disconnect();
            observer = null; // Allow garbage collection
            console.log(LOG_PREFIX, 'Observer disconnected.');
        }
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    // --- Execution ---
    if (window.top !== window.self) return; // Don't run on iframes

    console.log(LOG_PREFIX, 'Script starting.');

    // Initial attempt. If it succeeds immediately, the script will clean up and exit.
    if (tryToEnableDarkMode()) {
        // The check inside tryToEnableDarkMode() will call cleanUp() if already on.
        return;
    }

    // If not immediately found/active, observe for changes.
    observer = new MutationObserver(tryToEnableDarkMode); // Pass function reference directly
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    // Set a timeout to prevent the script from running forever.
    timeoutId = setTimeout(() => {
        if (observer) { // Only log timeout if observer is still active
            console.log(LOG_PREFIX, `⏱️ Timed out after ${TIMEOUT_MS / 1000}s. Toggle not found.`);
            cleanUp();
        }
    }, TIMEOUT_MS);
})();