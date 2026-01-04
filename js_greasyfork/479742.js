// ==UserScript==
// @name         easyNext yt
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Double-click left/right button to play next or previous video on YouTube, double right-click to go back in history.
// @author       mohdsafran
// @match        https://www.youtube.com/*
// @match        https://www.youtube.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479742/easyNext%20yt.user.js
// @updateURL https://update.greasyfork.org/scripts/479742/easyNext%20yt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Counter for double-right-click functionality
    var contextMenuClickCount = 0;
    var leftClickButton, rightClickButton;

    // Check for buttons and set event listeners
    function checkForButtons() {
        leftClickButton = document.querySelector('.ytp-next-button.ytp-button');

        if (leftClickButton) {
            setEventListeners();
            resetContextMenuClickCount();
        } else {
            setTimeout(checkForButtons, 1000);
        }
    }

    // Set event listeners for double-click and double-right-click actions
    function setEventListeners() {
        // Function to handle double-right-click (context menu)
        function handleContextMenu() {
            contextMenuClickCount++;

            // Perform action on double-right-click
            if (contextMenuClickCount === 2) {
                contextMenuClickCount = 0;
                window.history.back(); // Navigate back in history
            }
        }

        // Event listener for double-click on the document
        document.addEventListener('dblclick', function(event) {
            leftClickButton.click(); // Trigger left button click action
        });

        // Event listener for context menu (right-click)
        document.addEventListener('contextmenu', handleContextMenu);
    }

    // Reset the context menu click count at regular intervals
    function resetContextMenuClickCount() {
        setInterval(function() {
            contextMenuClickCount = 0;
        }, 1000); // Resets count every second
    }

    // Start checking for buttons
    checkForButtons();
})();