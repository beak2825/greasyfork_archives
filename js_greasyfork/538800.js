// ==UserScript==
// @name         Grok Think Shortcut
// @namespace    nisc
// @version      2025.06.09-A
// @description  Activate Grok Thinking mode with Ctrl+Cmd+T (macOS) or Ctrl+Alt+T (Windows/Linux)
// @homepageURL  https://github.com/nisc/grok-userscripts/
// @author       nisc
// @match        https://grok.com/*
// @icon         https://grok.com/favicon.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538800/Grok%20Think%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/538800/Grok%20Think%20Shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Configuration object containing all constants used in the script
     * KEYS: Keyboard shortcut configuration
     * BUTTON: Settings for finding the target button
     */
    const CONFIG = {
        KEYS: {
            KEY: 't',
            REQUIRES_SHIFT: false,
            REQUIRES_ALT: false,
            REQUIRES_CTRL: true
        },
        BUTTON: {
            TEXT: 'Think'
        }
    };

    /**
     * Handles keyboard shortcut for toggling Think mode
     *
     * Shortcut behavior:
     * - Windows/Linux: Ctrl + Shift + D
     * - macOS: Cmd + Shift + D
     *
     * The handler will:
     * 1. Check if the correct key combination is pressed
     * 2. Prevent default browser behavior
     * 3. Find and click the Think button if it exists
     */
    function handleThinkShortcut(event) {
        // Check if it's the right key combination
        const isMac = navigator.userAgent.includes('Mac');
        const isModifierPressed = isMac ? event.metaKey : event.ctrlKey;

        if (event.key.toLowerCase() === CONFIG.KEYS.KEY &&
            isModifierPressed &&
            event.shiftKey === CONFIG.KEYS.REQUIRES_SHIFT &&
            event.altKey === CONFIG.KEYS.REQUIRES_ALT &&
            event.ctrlKey === CONFIG.KEYS.REQUIRES_CTRL) {

            // Stop any default browser behavior
            event.preventDefault();
            event.stopPropagation();

            // Find and click the Think button
            const thinkButton = Array.from(document.querySelectorAll('button'))
                .find(button => button.textContent.trim() === CONFIG.BUTTON.TEXT);

            if (thinkButton) {
                thinkButton.click();
            }
        }
    }

    // Listen for keyboard shortcuts anywhere on the page
    document.addEventListener('keydown', handleThinkShortcut);
})();
