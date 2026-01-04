// ==UserScript==
// @name         Enable pasting
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enables pasting in Human or Not game
// @author       suggestingpain
// @match        https://*.humanornot.ai/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494641/Enable%20pasting.user.js
// @updateURL https://update.greasyfork.org/scripts/494641/Enable%20pasting.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle pasting text
    function handlePaste(event) {
        // Prevent default paste behavior
        event.preventDefault();

        // Get text from clipboard
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData('text');

        // Insert pasted text into the contentEditable div
        const div = event.target;
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(pastedText));
        }
    }

    // Function to check for new contentEditable divs
    function checkForNewDivs() {
        const divs = document.querySelectorAll('div[contentEditable="true"]:not(.handled)');
        divs.forEach(div => {
            div.classList.add('handled');
            div.addEventListener('paste', handlePaste);
        });
    }

    // Polling function to periodically check for new contentEditable divs
    function pollForNewDivs() {
        setInterval(checkForNewDivs, 100);
    }

    // Start polling for new divs
    pollForNewDivs();
})();
