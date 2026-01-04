// ==UserScript==
// @name         Rumble Unique Chatters and Number of Messages for Live Streams
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Displays the number of unique chatters and messages in Rumble live streams.
// @match        https://rumble.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/510995/Rumble%20Unique%20Chatters%20and%20Number%20of%20Messages%20for%20Live%20Streams.user.js
// @updateURL https://update.greasyfork.org/scripts/510995/Rumble%20Unique%20Chatters%20and%20Number%20of%20Messages%20for%20Live%20Streams.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Utility function to wait for a specific element to appear in the DOM.
     * @param {string} selector - CSS selector of the target element.
     * @param {number} timeout - Maximum time to wait in milliseconds.
     * @returns {Promise<Element>} - Resolves with the found element or rejects on timeout.
     */
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                return resolve(element);
            }

            const observer = new MutationObserver(() => {
                const elem = document.querySelector(selector);
                if (elem) {
                    observer.disconnect();
                    resolve(elem);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            // Timeout after specified milliseconds
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    async function init() {
        try {
            // Check if the live info element exists
            const liveInfoSelector = "div.video-header-live-info";
            try {
                const liveInfoElement = await waitForElement(liveInfoSelector, 5000);
            } catch (error) {
                console.warn("[Chat User Monitor] Live info element not found within 5 seconds. Exiting script.");
                return; // Exit the script if the live info element is not found
            }

            // Wait for the chat box element to be available
            const chatBoxSelector = "#chat-history-list";
            const chatBox = await waitForElement(chatBoxSelector);

            // Wait for the chat controls container to append the user count display
            const chatControlsSelector = "form#chat-message-form > div.chat-message-form-section.chat-message-form-section-justify-between > div.chat--rant-row:nth-of-type(1)";
            const chatControlsContainer = await waitForElement(chatControlsSelector);

            // Initialize Sets to track unique users and messages
            const seenUsers = new Set();
            const seenMessages = new Set();

            // Create a container for displaying the user count with SVG
            const userCountDisplay = document.createElement("div");
            userCountDisplay.id = "user-count-container";
            userCountDisplay.classList.add("video-category-tag");
            userCountDisplay.title = "Number of unique users in the chat";

            // Insert the user SVG icon
            const userIconContainer = document.createElement("div");
            userIconContainer.innerHTML = `
                <svg width="20px" height="20px" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"/>
                    <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z"/>
                </svg>
            `;
            userIconContainer.style.marginRight = "8px";

            // Create the user count element
            const userCountElement = document.createElement("span");
            userCountElement.id = "seen-users-count";
            userCountElement.textContent = "0";
            userCountElement.style.fontSize = "12px";

            // Append SVG and user count to the container
            userCountDisplay.appendChild(userIconContainer);
            userCountDisplay.appendChild(userCountElement);

            // Append the container to the chat controls container
            chatControlsContainer.appendChild(userCountDisplay);

            // Create a container for displaying the message count with SVG
            const messageCountDisplay = document.createElement("div");
            messageCountDisplay.id = "message-count-container";
            messageCountDisplay.style.display = "flex";
            messageCountDisplay.style.alignItems = "center";
            messageCountDisplay.style.marginLeft = "16px";
            messageCountDisplay.title = "Number of messages in the chat";

            // Insert the message SVG icon
            const messageIconContainer = document.createElement("div");
            messageIconContainer.innerHTML = `
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21C9.9675 21 3.00463 21 3.00463 21C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3C16.9745 3 21.0039 7.02944 21.0039 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            messageIconContainer.style.marginRight = "8px";

            // Create the message count element
            const messageCountElement = document.createElement("span");
            messageCountElement.id = "seen-messages-count";
            messageCountElement.textContent = "0";
            messageCountElement.style.fontSize = "12px";

            // Append SVG and message count to the message container
            messageCountDisplay.appendChild(messageIconContainer);
            messageCountDisplay.appendChild(messageCountElement);

            // Append the message count container to the user count container
            userCountDisplay.appendChild(messageCountDisplay);

            /**
             * Updates the displayed counts of users and messages.
             */
            const updateCounts = () => {
                userCountElement.textContent = seenUsers.size;
                messageCountElement.textContent = seenMessages.size;
            };

            /**
             * Observes the chat box for new messages and users.
             */
            const observeChat = () => {
                const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('chat-history--row')) {
                                try {
                                    const messageId = node.getAttribute("data-message-id");
                                    const userId = node.getAttribute("data-message-user-id");

                                    // Track unique messages
                                    if (messageId && !seenMessages.has(messageId)) {
                                        seenMessages.add(messageId);
                                    }

                                    // Track unique users
                                    if (userId && !seenUsers.has(userId)) {
                                        seenUsers.add(userId);
                                    }

                                    // Update the displayed counts
                                    updateCounts();
                                } catch (error) {
                                    console.error("[Chat User Monitor] Error processing message:", error);
                                }
                            }
                        });
                    });
                });

                observer.observe(chatBox, { childList: true });
            };

            // Start observing the chat
            observeChat();

        } catch (error) {
            console.error("[Chat User Monitor] Initialization failed:", error);
        }
    }

    // Start the initialization process
    init();

})();
