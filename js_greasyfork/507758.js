// ==UserScript==
// @name         Disable scrolling when tapping on space button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Disable scrolling with space when not in input fields
// @author       MasterMe
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507758/Disable%20scrolling%20when%20tapping%20on%20space%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/507758/Disable%20scrolling%20when%20tapping%20on%20space%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the target is an input field or a content-editable element
    function isInputField(element) {
        return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.isContentEditable;
    }

    // Event listener for keydown
    document.addEventListener('keydown', function(e) {
        // If the space key is pressed
        if (e.code === 'Space') {
            const activeElement = document.activeElement;

            if (isInputField(activeElement)) {
                // If in input field, allow the space key to function normally
                return;
            } else {
                // Prevent spacebar from scrolling the page if not in an input field
                e.preventDefault();
            }
        }
    }, false);

    // Additional event listener for keypress to ensure no scrolling
    document.addEventListener('keypress', function(e) {
        if (e.code === 'Space') {
            const activeElement = document.activeElement;

            if (!isInputField(activeElement)) {
                e.preventDefault();
            }
        }
    }, false);
})();
