// ==UserScript==
// @name         X Reply Bot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reply to a specific X post 100 times
// @author       Your Name
// @match        https://x.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538209/X%20Reply%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/538209/X%20Reply%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const postUrl = "https://x.com/Pell_yukkuri/status/1923927780817093113";
    const replyCount = 100;
    const replyText = "消えろ"; // Your reply text here

    let repliedCount = 0;

    // Function to navigate to the post and open the reply box
    function openReplyBox() {
        if (window.location.href !== postUrl) {
            window.location.href = postUrl;
            // Wait for the page to load and the reply button to be available
            waitForElement('[data-testid="reply"]', function(replyButton) {
                replyButton.click();
                // Wait for the reply text area to be available
                waitForElement('[data-testid="tweetTextarea_0"]', function(textarea) {
                    typeReply(textarea);
                });
            });
        } else {
            // If already on the post page, try to open the reply box directly
            waitForElement('[data-testid="reply"]', function(replyButton) {
                replyButton.click();
                // Wait for the reply text area to be available
                waitForElement('[data-testid="tweetTextarea_0"]', function(textarea) {
                    typeReply(textarea);
                });
            });
        }
    }

    // Function to type the reply text
    function typeReply(textarea) {
        textarea.focus();
        document.execCommand('insertText', false, replyText);

        // Wait for the Tweet button to become enabled
        waitForElement('[data-testid="tweetButton"]', function(tweetButton) {
            if (!tweetButton.disabled) {
                tweetButton.click();
                repliedCount++;
                console.log(`Replied ${repliedCount}/${replyCount}`);
                if (repliedCount < replyCount) {
                    // Wait a bit before attempting the next reply to avoid rate limits
                    setTimeout(openReplyBox, Math.random() * 5000 + 2000); // Random delay between 2 and 7 seconds
                } else {
                    console.log("Finished sending replies.");
                }
            } else {
                // If the button is still disabled, try again after a short delay
                setTimeout(() => typeReply(textarea), 500);
            }
        });
    }

    // Helper function to wait for an element to appear
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    // Start the process
    if (window.location.href === postUrl || window.location.href.startsWith("https://x.com/")) {
         // If already on the post page or any X page, start opening the reply box
        openReplyBox();
    }


})();
