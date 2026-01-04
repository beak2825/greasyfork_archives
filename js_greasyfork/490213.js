// ==UserScript==
// @name        YouTube - Enable Live Chat By Default
// @namespace   Violentmonkey Scripts
// @description Automatically changes the chat view to Live Chat when it loads. (Works with chat replays, too.)
// @match       https://www.youtube.com/live_chat*
// @include     https://*youtube.*/live_chat*
// @include     https://www.youtube.*/live_chat*
// @include     https://www.youtube.*/live_chat
// @grant       none
// @version     1.0.1
// @author      Jupiter Liar
// @license     CC BY
// @description 3/18/2024, 4:00:00 PM
// @downloadURL https://update.greasyfork.org/scripts/490213/YouTube%20-%20Enable%20Live%20Chat%20By%20Default.user.js
// @updateURL https://update.greasyfork.org/scripts/490213/YouTube%20-%20Enable%20Live%20Chat%20By%20Default.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var maxAttempts = 400;
    var currentAttempt = 0;

    // Function to switch chat mode to "Live Chat"
    function changeToLiveChat(liveChatSelector) {
        //console.log("Live chat selector found.");
        // Check if the live chat selector exists
        if (liveChatSelector) {
            // Click the tp-yt-paper-button to switch to "Live Chat" mode
            var paperButton = liveChatSelector.querySelector('tp-yt-paper-button');
            if (paperButton) {
                paperButton.click();
                //console.log("Attempting to switch to Live Chat mode...");
                checkPaperMenuItems();
            } else {
                //console.log("tp-yt-paper-button not found within live chat selector.");
            }
        }
    }

    // Function to click on the appropriate paper item in the paper menu
    function checkPaperMenuItems() {
        var paperMenuItems = document.querySelectorAll('tp-yt-paper-item');
        var foundLiveChat = false;
        var foundUnselected = false;

        paperMenuItems.forEach(function(item) {
            var text = item.innerText.toLowerCase();
            if (text.includes("live chat")) {
                item.click();
                //console.log("Clicked on paper item with 'Live chat'.");
                foundLiveChat = true;
            } else {
                var parentAnchor = item.closest('a');
                if (parentAnchor && parentAnchor.getAttribute('aria-selected') === "false") {
                    item.click();
                    //console.log("Clicked on unselected paper item.");
                    foundUnselected = true;
                }
            }
        });

        if (!foundLiveChat && !foundUnselected) {
            //console.log("Unable to find appropriate paper menu item.");
        }
    }

    // Function to check if the page contains the live chat selector
    function checkLiveChatSelector() {
        //console.log("Attempting to run Live Chat changer script.");
        var liveChatSelector = document.querySelector('#live-chat-view-selector-sub-menu');
        if (liveChatSelector) {
            changeToLiveChat(liveChatSelector);
        }
    }

    // Execute when the page and its resources are fully loaded
    window.onload = checkLiveChatSelector;
})();