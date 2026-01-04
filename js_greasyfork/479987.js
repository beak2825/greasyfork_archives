// ==UserScript==
// @name        Click Message Input on Right Arrow Key
// @namespace   https://greasyfork.org/en/users/1200587-trilla-g
// @match       *://*.kick.com/*
// @grant       none
// @version     2.1
// @license     MIT
// @author      Trilla_G
// @description This script focuses and clicks the "Message Input" button on the sidebar when the right arrow key is pressed.
// @downloadURL https://update.greasyfork.org/scripts/479987/Click%20Message%20Input%20on%20Right%20Arrow%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/479987/Click%20Message%20Input%20on%20Right%20Arrow%20Key.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        // Check if the right arrow key is pressed
        if (event.key === 'ArrowRight') {
            clickMessageInput();
        }
    });

    function clickMessageInput() {
        // Target the message input element
        let messageInputButton = document.querySelector('.editor-input');

        if (messageInputButton) {
            // Ensure the element is focused before clicking
            messageInputButton.focus();  // Focus the input field
            messageInputButton.click();  // Click the input field
        }
    }
})();

