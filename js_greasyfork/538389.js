// ==UserScript==
// @name         Reply to X Post with Interval
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reply to all replies of a specific X post with a 0.001-second interval.
// @author       Your Name
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538389/Reply%20to%20X%20Post%20with%20Interval.user.js
// @updateURL https://update.greasyfork.org/scripts/538389/Reply%20to%20X%20Post%20with%20Interval.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // !!! IMPORTANT !!!
    // This script interacts with X (formerly Twitter) and could violate their terms of service.
    // Use with extreme caution and at your own risk.
    // Automating interactions can lead to your account being suspended or banned.
    // This script is provided for educational purposes only and should not be used in production.
    // You will need to manually identify the elements for replies and the reply button,
    // as X's structure changes frequently.

    // Replace with the URL of the specific post you want to reply to replies of
    const targetPostUrl = "https://x.com/Pell_yukkuri/status/1923927780817093113";

    // The message you want to reply with
    const replyMessage = "消えろ";

    // Interval between replies in milliseconds (0.001 seconds = 1 millisecond)
    const replyInterval = 1;

    // Function to find all reply elements on the page
    // This is a placeholder and needs to be updated based on X's current HTML structure
    function getReplyElements() {
        // You need to inspect the X page to find the correct CSS selectors for replies.
        // Look for the elements that contain individual replies to the target post.
        // Example (this is likely incorrect and needs to be updated):
        return document.querySelectorAll('article[data-testid="tweet"]');
    }

    // Function to find the reply button within a given reply element
    // This is a placeholder and needs to be updated based on X's current HTML structure
    function findReplyButton(replyElement) {
         // You need to inspect the X page to find the correct CSS selector for the reply button.
         // Look for the button within a reply element that opens the reply composer.
         // Example (this is likely incorrect and needs to be updated):
        return replyElement.querySelector('div[data-testid="reply"]');
    }

    // Function to type the reply message into the composer
    // This is a placeholder and needs to be updated based on X's current HTML structure
    function typeReplyMessage(replyMessage) {
        // You need to inspect the X page to find the correct CSS selector for the reply composer textarea.
        // Example (this is likely incorrect and needs to be updated):
        const composer = document.querySelector('div[data-testid="tweetTextarea_0"]');
        if (composer) {
            composer.focus();
            document.execCommand('insertText', false, replyMessage);
            return true;
        }
        return false;
    }

     // Function to click the send/reply button in the composer
    // This is a placeholder and needs to be updated based on X's current HTML structure
    function clickSendButton() {
         // You need to inspect the X page to find the correct CSS selector for the send/reply button.
         // Example (this is likely incorrect and needs to be updated):
        const sendButton = document.querySelector('div[data-testid="tweetButton"]');
        if (sendButton) {
            sendButton.click();
            return true;
        }
        return false;
    }


    // Main function to iterate through replies and send replies
    async function replyToReplies() {
        if (window.location.href.startsWith(targetPostUrl)) {
            console.log("Starting reply process...");
            const replyElements = getReplyElements();
            console.log(`Found ${replyElements.length} potential reply elements.`);

            for (let i = 0; i < replyElements.length; i++) {
                const replyElement = replyElements[i];
                const replyButton = findReplyButton(replyElement);

                if (replyButton) {
                    console.log(`Clicking reply button for element ${i}...`);
                    replyButton.click();

                    // Wait a short time for the reply composer to appear
                    await new Promise(resolve => setTimeout(resolve, 500));

                    console.log("Typing reply message...");
                    const typed = typeReplyMessage(replyMessage);

                    if (typed) {
                        // Wait a short time for the message to be processed
                         await new Promise(resolve => setTimeout(resolve, 500));

                        console.log("Clicking send button...");
                        const sent = clickSendButton();

                        if (sent) {
                            console.log(`Replied to element ${i}. Waiting for next reply...`);
                            // Wait for the specified interval before the next reply
                            await new Promise(resolve => setTimeout(resolve, replyInterval));
                        } else {
                             console.error(`Could not find send button for element ${i}. Skipping.`);
                             // Close the composer if possible (needs implementation)
                             // This is a placeholder and needs to be updated
                             // Example (this is likely incorrect):
                            const closeButton = document.querySelector('div[aria-label="Close"]');
                            if (closeButton) closeButton.click();
                        }
                    } else {
                        console.error(`Could not find reply composer for element ${i}. Skipping.`);
                         // Close the composer if possible (needs implementation)
                         // This is a placeholder and needs to be updated
                         // Example (this is likely incorrect):
                        const closeButton = document.querySelector('div[aria-label="Close"]');
                         if (closeButton) closeButton.click();
                    }

                     // Wait a short time for the composer to close/process
                     await new Promise(resolve => setTimeout(resolve, 500));

                } else {
                    console.log(`No reply button found for element ${i}. Skipping.`);
                }
            }
            console.log("Reply process finished.");
        } else {
            console.log("Not on the target post page. Script not running.");
        }
    }

    // You might want to trigger the script manually or on a specific event.
    // For simplicity, let's run it after the page loads and you are on the target URL.
    // A better approach would be to observe DOM changes or add a button.
    window.addEventListener('load', () => {
        // Add a small delay after load to ensure elements are rendered
        setTimeout(() => {
            replyToReplies();
        }, 2000); // Adjust delay as needed
    });

    // Alternatively, you could add a button to the page to start the process
    // This requires finding a suitable place in X's DOM to insert the button
    // and adding event listeners. This is more complex due to X's dynamic nature.


})();