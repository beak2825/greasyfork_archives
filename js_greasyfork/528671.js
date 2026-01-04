// ==UserScript==
// @name         Chat User Blocker for Collaborate
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Blocks messages from specific users on Collaborate chat panels
// @author      Lejafurigon
// @match      https://au.bbcollab.com/*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528671/Chat%20User%20Blocker%20for%20Collaborate.user.js
// @updateURL https://update.greasyfork.org/scripts/528671/Chat%20User%20Blocker%20for%20Collaborate.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // List of usernames to block
    const BLOCKED_USERS = [
        "INSERT USER HERE",
    ];

    // Key for storing blocked message IDs in storage
    const STORAGE_KEY = 'bb_chat_blocker_removed_ids';

    // Clear any existing stored IDs to prevent incorrect filtering
    // If the script is misbehaving, this ensures a clean start
    localStorage.removeItem(STORAGE_KEY);

    // Process an individual message
    function processMessage(item) {
        let nameElement = item.querySelector('.participant-name');
        if (!nameElement) return;

        const username = nameElement.textContent.trim();

        // ONLY remove messages from users in the BLOCKED_USERS list
        // No stored IDs to avoid false positives
        if (BLOCKED_USERS.includes(username)) {
            item.remove();
            console.log(`Blocked message from: ${username}`);
        }
    }

    // Process all messages in the container
    function processAllMessages() {
        document.querySelectorAll('.chat-history__activity-item').forEach(item => {
            processMessage(item);
        });
    }

    // Set up the mutation observer to watch for new messages and DOM changes
    function setupObserver() {
        // Watch for changes to the chat history list
        const chatHistoryContainer = document.getElementById('chat-channel-history');
        if (chatHistoryContainer) {
            const observer = new MutationObserver((mutations) => {
                // Check each added node to see if it's a message that should be blocked
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(node => {
                            // Only process element nodes that are message items
                            if (node.nodeType === 1 && node.classList &&
                                node.classList.contains('chat-history__activity-item')) {
                                processMessage(node);
                            }
                        });
                    }
                });
            });

            observer.observe(chatHistoryContainer, { childList: true, subtree: true });
            console.log("MutationObserver started for chat history");
        }

        // Also watch for the entire panel being added/removed
        const contentObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    // If panel section is added to DOM
                    if (document.querySelector('.panel-content') &&
                        document.getElementById('chat-channel-history')) {
                        console.log("Chat panel detected - processing messages");
                        processAllMessages();
                    }
                }
            });
        });

        // Observe the body for changes, to catch when the panel is added/removed
        contentObserver.observe(document.body, { childList: true, subtree: true });
        console.log("Content observer started for panel changes");
    }

    // Initialize the blocker functionality
    function initializeBlocker() {
        // Initial processing of existing messages
        if (document.getElementById('chat-channel-history')) {
            processAllMessages();
            setupObserver();
            console.log("Chat blocker initialized");
        } else {
            // If chat container isn't found yet, wait and retry
            setTimeout(initializeBlocker, 1000);
            console.log("Waiting for chat panel to load...");
        }

        // Set up event listeners for page visibility/focus changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && document.getElementById('chat-channel-history')) {
                console.log("Page visibility changed, reprocessing messages");
                processAllMessages();
            }
        });

        window.addEventListener('focus', () => {
            if (document.getElementById('chat-channel-history')) {
                console.log("Window focus event, reprocessing messages");
                processAllMessages();
            }
        });
    }

    // Create a persistent checker that runs periodically
    function setupPeriodicChecker() {
        setInterval(() => {
            if (document.getElementById('chat-channel-history')) {
                processAllMessages();
            }
        }, 3000);
    }

    // Start the process
    initializeBlocker();
    setupPeriodicChecker();

    // Add a special event handler for Angular-based applications
    window.addEventListener('hashchange', () => {
        setTimeout(() => {
            if (document.getElementById('chat-channel-history')) {
                console.log("Hash change detected, reprocessing messages");
                processAllMessages();
            }
        }, 1000);
    });
})();