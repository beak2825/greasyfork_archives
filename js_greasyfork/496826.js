// ==UserScript==
// @name         Remove Pandabuy Risk Reminder 
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Removes the Pandabuy risk reminder pop-up and overlay, restores scrolling
// @author       nawid 
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496826/Remove%20Pandabuy%20Risk%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/496826/Remove%20Pandabuy%20Risk%20Reminder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the risk reminder pop-up and overlay
    function removeElements() {
        // Select the pop-up element using its class
        var riskReminder = document.querySelector('.el-dialog__wrapper');
        if (riskReminder) {
            // Remove the pop-up element from the DOM
            riskReminder.parentNode.removeChild(riskReminder);
        }

        // Select the overlay element using its class
        var overlay = document.querySelector('.v-modal');
        if (overlay) {
            // Remove the overlay element from the DOM
            overlay.parentNode.removeChild(overlay);
        }

        // Restore scrolling on the body
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    }

    // Run the function to remove the pop-up and overlay
    removeElements();

    // Also, monitor for new pop-ups and overlays and remove them
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                removeElements();
            }
        });
    });

    // Configure the observer to watch for changes in the body element
    observer.observe(document.body, { childList: true, subtree: true });
})();
