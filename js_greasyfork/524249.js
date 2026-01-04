// ==UserScript==
// @name         Close Hotkey
// @namespace    Violentmonkey Scripts
// @version      2.0
// @description  Closes the current tab when a specific key or key combination is pressed
// @author       Mineverse Tutorials
// @match        *://*/*
// @grant        none
// @license      CC BY-NC
// @downloadURL https://update.greasyfork.org/scripts/524249/Close%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/524249/Close%20Hotkey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === User Configurable Settings ===

    // The key to press for closing the tab (case-sensitive)
    // Examples: "a", "Enter", "Escape", "Control", "Shift", "Alt", "F1", "F2", ..., "F12"
    const keyToPress = "Control";

    // The location of the key on the keyboard
    // Options: 
    // - KeyboardEvent.DOM_KEY_LOCATION_STANDARD (for most keys)
    // - KeyboardEvent.DOM_KEY_LOCATION_LEFT (for keys on the left side)
    // - KeyboardEvent.DOM_KEY_LOCATION_RIGHT (for keys on the right side)
    // - KeyboardEvent.DOM_KEY_LOCATION_NUMPAD (for keys on the numeric keypad)
    const keyLocation = KeyboardEvent.DOM_KEY_LOCATION_RIGHT;

    // Set to true if the key needs to be double-tapped to close the tab
    const doubleTap = false;

    // Set to true if the key is an F key (e.g., F1, F2, ... F12)
    const isFKey = false;

    // === End of User Configurable Settings ===

    let lastKeyTime = 0;

    window.addEventListener('keydown', function(event) {
        if (isFKey && !/^F\d{1,2}$/.test(keyToPress)) {
            return; // Skip if not an F key and isFKey is true
        }
        if (event.key === keyToPress && event.location === keyLocation) {
            const currentTime = Date.now();
            if (doubleTap) {
                if (currentTime - lastKeyTime < 500) {
                    window.close(); // Close if double-tapped within 500ms
                }
                lastKeyTime = currentTime;
            } else {
                window.close(); // Close on single press
            }
        }
    });
})();
