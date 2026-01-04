// ==UserScript==
// @name         Grok Return from Uploaded Files View via ESC
// @namespace    nisc
// @version      2025.06.08-A
// @description  When on grok.com/files, ESC takes user back
// @homepageURL  https://github.com/nisc/grok-userscripts/
// @author       nisc
// @match        https://grok.com/files
// @icon         https://grok.com/images/favicon-light.png
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538669/Grok%20Return%20from%20Uploaded%20Files%20View%20via%20ESC.user.js
// @updateURL https://update.greasyfork.org/scripts/538669/Grok%20Return%20from%20Uploaded%20Files%20View%20via%20ESC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Configuration object containing all constants used in the script
     * KEYS: Keyboard key mappings for navigation
     * NAVIGATION: Default URL to return to when no history exists
     */
    const CONFIG = {
        KEYS: {
            ESCAPE: 'Escape'
        },
        NAVIGATION: {
            DEFAULT_URL: 'https://grok.com'
        }
    };

    /**
     * Handles the ESC key press event
     *
     * Behavior:
     * 1. When ESC is pressed, prevents default browser behavior
     * 2. Checks browser history length:
     *    - If history exists (length >= 2), goes back one page
     *    - If no history (length < 2), redirects to grok.com
     *
     * Note: History length < 2 means we can't go back (current page is the only one)
     */
    function handleEscapeKey(event) {
        if (event.key === CONFIG.KEYS.ESCAPE) {
            event.preventDefault();  // Stop browser's default ESC behavior

            if (window.history.length < 2) {
                // No previous page exists, go to home page
                window.open(CONFIG.NAVIGATION.DEFAULT_URL, '_self');
            } else {
                // Previous page exists, go back to it
                window.history.back();
            }
        }
    }

    // Listen for ESC key press anywhere on the page
    document.addEventListener('keydown', handleEscapeKey);
})();