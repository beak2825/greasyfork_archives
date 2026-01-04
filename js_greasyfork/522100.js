// ==UserScript==
// @name         ChatGPT DOM Cleanup
// @namespace    ChatGPT Tools by Vishanka
// @version      1.6
// @description  Cleans up the DOM of ChatGPT chats to the last 20 messages.
// @author       Vishanka
// @license      Proprietary
// @match        https://chatgpt.com/*
// @grant        none
// @supportURL   https://greasyfork.org/scripts/522100-chatgpt-dom-cleanup
// @downloadURL https://update.greasyfork.org/scripts/522100/ChatGPT%20DOM%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/522100/ChatGPT%20DOM%20Cleanup.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Configuration
    const MAX_VISIBLE_MESSAGES = 20; // Number of messages to keep in the DOM

    // Function to clean up the conversation DOM
    function cleanUpMessages() {
        const messageElements = document.querySelectorAll('[data-testid^="conversation-turn"]');
        console.log(`Found ${messageElements.length} messages in the DOM.`);

        // If there are more messages than allowed, remove the oldest ones
        if (messageElements.length > MAX_VISIBLE_MESSAGES) {
            const excessMessages = Array.from(messageElements).slice(0, messageElements.length - MAX_VISIBLE_MESSAGES);
            excessMessages.forEach(el => el.remove());
            console.log(`Removed ${excessMessages.length} old messages.`);
        } else {
            console.log('No messages need to be removed.');
        }
    }

    // Function to manage cleanup intervals
    function manageIntervals() {
        const intervals = [
            { duration: 10000, interval: 2000 }, // First 10 seconds: 2-second interval
            { duration: 15000, interval: 3000 }, // Next 15 seconds: 3-second interval
            { duration: 10000, interval: 5000 }, // Next 10 seconds: 5-second interval
        ];

        let elapsedTime = 0;
        let currentTimeout;

        function scheduleNextInterval(index) {
            if (index < intervals.length) {
                const { duration, interval } = intervals[index];
                console.log(`Starting interval of ${interval}ms for ${duration}ms.`);

                currentTimeout = setTimeout(() => {
                    elapsedTime += duration;
                    scheduleNextInterval(index + 1);
                }, duration);

                const intervalId = setInterval(cleanUpMessages, interval);
                setTimeout(() => clearInterval(intervalId), duration);
            } else {
                console.log('Switching to final 30-second interval.');
                setInterval(cleanUpMessages, 30000); // Final 30-second interval
            }
        }

        scheduleNextInterval(0);
    }

    // Wait for the page to fully load
    window.addEventListener('load', () => {
        console.log('Page fully loaded. Starting initialization...');
        manageIntervals();
    });

})();
