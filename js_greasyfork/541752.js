// ==UserScript==
// @name         Drawaria Anti-Flood Message
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Disables the display of "draw-flood check triggered" messages in Drawaria.online.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541752/Drawaria%20Anti-Flood%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/541752/Drawaria%20Anti-Flood%20Message.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Part of the message text to identify the flood check messages
    const FLOOD_MESSAGE_PART = "draw-flood check triggered";

    // Function to set up the MutationObserver on the chatbox
    const setupChatboxObserver = () => {
        const chatbox = document.getElementById('chatbox_messages');

        if (chatbox) {
            console.log("Drawaria Anti-Flood: Chatbox found. Starting observer.");

            const observer = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(node => {
                            // Check if the added node is an element and contains the flood message text
                            if (node.nodeType === 1 && node.textContent.includes(FLOOD_MESSAGE_PART)) {
                                console.log("Drawaria Anti-Flood: Suppressing flood check message:", node.textContent);
                                node.remove(); // Remove the offending message from the DOM
                            }
                        });
                    }
                }
            });

            // Start observing the chatbox for child additions
            // The { childList: true } option means we only care about direct children being added or removed
            observer.observe(chatbox, { childList: true });

            // Initial cleanup: Remove any existing flood check messages that might be in the chatbox
            // This is useful if the script loads slightly after some messages have already appeared.
            Array.from(chatbox.children).forEach(child => {
                if (child.nodeType === 1 && child.textContent.includes(FLOOD_MESSAGE_PART)) {
                    console.log("Drawaria Anti-Flood: Cleaning existing flood check message:", child.textContent);
                    child.remove();
                }
            });

            return true; // Observer successfully set up
        }
        return false; // Chatbox element not found yet
    };

    // Attempt to set up the observer. If the chatbox isn't immediately available,
    // retry a few times with a short delay.
    const maxRetries = 20; // Try for up to 2 seconds (20 retries * 100ms interval)
    let retries = 0;
    const intervalId = setInterval(() => {
        if (setupChatboxObserver() || retries >= maxRetries) {
            clearInterval(intervalId); // Stop the interval once the observer is set up or max retries reached
            if (retries >= maxRetries) {
                console.error("Drawaria Anti-Flood: Chatbox element not found after multiple retries. The script may not function as expected.");
            }
        }
        retries++;
    }, 100); // Check every 100 milliseconds

})();