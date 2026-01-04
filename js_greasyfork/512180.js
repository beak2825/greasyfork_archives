// ==UserScript==
// @name         Caption Swear Word Warning
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display a warning when captions contain swear words like [__], [_], [___], [____].
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512180/Caption%20Swear%20Word%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/512180/Caption%20Swear%20Word%20Warning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of placeholder patterns for bad words
    const badWordPatterns = /\[__\]|\[_\]|\[___\]|\[____\]/g;

    // Function to check for bad words in the captions
    function checkForBadWords() {
        // Get the text content of the page (or specific caption container)
        let pageContent = document.body.innerText || "";

        // Check if any bad words are found
        if (badWordPatterns.test(pageContent)) {
            // If bad words are found, display a warning
            showWarning();
        }
    }

    // Function to display a warning modal
    function showWarning() {
        // Create a modal for the warning
        let modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.color = 'white';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '9999';

        // Warning message
        let warningMessage = document.createElement('h2');
        warningMessage.innerText = 'This content contains swear words!';
        modal.appendChild(warningMessage);

        // Continue button
        let continueButton = document.createElement('button');
        continueButton.innerText = 'Continue';
        continueButton.style.margin = '10px';
        continueButton.style.padding = '10px';
        continueButton.style.fontSize = '16px';
        continueButton.addEventListener('click', function() {
            modal.remove(); // Remove the warning if the user chooses to continue
        });
        modal.appendChild(continueButton);

        // Go back button
        let goBackButton = document.createElement('button');
        goBackButton.innerText = 'Go Back';
        goBackButton.style.margin = '10px';
        goBackButton.style.padding = '10px';
        goBackButton.style.fontSize = '16px';
        goBackButton.addEventListener('click', function() {
            history.back(); // Go back to the previous page
        });
        modal.appendChild(goBackButton);

        // Append the modal to the body
        document.body.appendChild(modal);
    }

    // Run the check when the page loads
    window.onload = checkForBadWords;
})();
