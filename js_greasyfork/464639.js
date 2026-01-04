// ==UserScript==
// @name         ChatGPT Message Counter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Count messages sent within 3 hours (dynamic window) on ChatGPT website
// @author       ChatGPT
// @match        https://chat.openai.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464639/ChatGPT%20Message%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/464639/ChatGPT%20Message%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const DYNAMIC_WINDOW_MS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    const MAX_MESSAGES = 25; // Maximum messages allowed in dynamic window

    // Message timestamps queue
    let messageTimestamps = [];

    // Update or add the element that displays the message count
    function updateMessageCount() {
        const messageCount = messageTimestamps.length;
        let counterElement = document.getElementById('message-counter');
        if (!counterElement) {
            // Create counter element
            counterElement = document.createElement('div');
            counterElement.id = 'message-counter';
            counterElement.style.position = 'fixed';
            counterElement.style.bottom = '10px';
            counterElement.style.left = '10px';
            counterElement.style.fontSize = 'small';
            document.body.appendChild(counterElement);
        }
        counterElement.textContent = `Messages: ${messageCount}/${MAX_MESSAGES}`;
    }

    // Remove expired messages from the queue based on dynamic window
    function removeExpiredMessages() {
        const currentTime = Date.now();
        messageTimestamps = messageTimestamps.filter(timestamp => currentTime - timestamp <= DYNAMIC_WINDOW_MS);
    }

    // Monitor the message box for new messages
    // Using the class selector for the message input box
    document.querySelector('.m-0.w-full.resize-none').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            // Add the current timestamp to the queue
            messageTimestamps.push(Date.now());
            // Remove expired messages from the queue
            removeExpiredMessages();
            // Update the message count display
            updateMessageCount();
        }
    });

    // Initialize the message count display
    updateMessageCount();
})();
