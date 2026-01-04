// ==UserScript==
// @name         Expand All Hidden Replies in a 4chan Thread with Keyboard Shortcut
// @version      0.4
// @description  Shows all replies in thread with a keyboard shortcut (press 'a'), excluding typing in textarea
// @author       Anon
// @match        https://boards.4chan.org/*/thread/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1165708
// @downloadURL https://update.greasyfork.org/scripts/492018/Expand%20All%20Hidden%20Replies%20in%20a%204chan%20Thread%20with%20Keyboard%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/492018/Expand%20All%20Hidden%20Replies%20in%20a%204chan%20Thread%20with%20Keyboard%20Shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to show all reply buttons
    function showAllReplyButtons() {
        // Select all reply buttons
        var replyButtons = document.querySelectorAll('.stub .show-reply-button');

        // Loop through each reply button
        replyButtons.forEach(function(button) {
            // Click the button
            button.click();
        });
    }

    // Function to handle keydown event
    function handleKeyDown(event) {
        // Check if the pressed key is 'a' and the active element is not an input or textarea
        if (event.key === 'a' && document.activeElement.tagName.toLowerCase() !== 'input' && document.activeElement.tagName.toLowerCase() !== 'textarea') {
            // Show all reply buttons
            showAllReplyButtons();

            // Prevent the default action of the 'a' key
            event.preventDefault();
        }
    }

    // Add keydown event listener to the document
    document.addEventListener('keydown', handleKeyDown);
})();