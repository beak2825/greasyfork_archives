// ==UserScript==
// @name         Powerline.io Low Graphics Mode
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically set low graphics mode for Powerline.io
// @match        https://powerline.io/*
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519124/Powerlineio%20Low%20Graphics%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/519124/Powerlineio%20Low%20Graphics%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set low graphics mode
    function setLowGraphicsMode() {
        // Check if we've already attempted to set low graphics mode
        if (localStorage.getItem('lq_script_run') !== 'true') {
            try {
                // Set low graphics mode
                localStorage.setItem('lq', 'true');

                // Mark that the script has run
                localStorage.setItem('lq_script_run', 'true');

                // Optional: Log confirmation
                console.log('Low Graphics Mode enabled for Powerline.io');

                // Reload the page to apply changes
                window.location.reload();
            } catch (error) {
                console.error('Error setting low graphics mode:', error);
            }
        } else {
            // Remove the flag to allow future runs if needed
            localStorage.removeItem('lq_script_run');
            console.log('Low Graphics Mode script has already run');
        }
    }

    // Run the function when the script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setLowGraphicsMode);
    } else {
        setLowGraphicsMode();
    }
})();