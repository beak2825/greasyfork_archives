// ==UserScript==
// @name         Google AI Studio Auto System Instructions
// @namespace    https://greasyfork.org/en/users/1462159-altron
// @version      1.0
// @description  Automatically fill system instructions for new chats in Google AI Studio
// @author       Sonnet 3.7
// @match        https://aistudio.google.com/app/prompts/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533998/Google%20AI%20Studio%20Auto%20System%20Instructions.user.js
// @updateURL https://update.greasyfork.org/scripts/533998/Google%20AI%20Studio%20Auto%20System%20Instructions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const DEFAULT_SYSTEM_INSTRUCTIONS = "You are a helpful, harmless, and honest AI assistant. Answer concisely and accurately.";
    const STORAGE_KEY = "ai_studio_visited_chats";
    const CHECK_INTERVAL_MS = 1000;
    const MAX_RETRIES = 10;
    const RETRY_DELAY_MS = 500;

    // Get the current chat ID from the URL
    function getCurrentChatId() {
        const match = window.location.href.match(/\/app\/prompts\/([^\/]+)/);
        return match ? match[1] : null;
    }

    // Check if this is a new chat
    function isNewChat(chatId) {
        if (!chatId) return false;

        // Get previously visited chats from localStorage
        const visitedChats = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

        // If this chat ID is not in the list, it's new
        if (!visitedChats.includes(chatId)) {
            // Add this chat ID to the list and save
            visitedChats.push(chatId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(visitedChats));
            return true;
        }

        return false;
    }

    // Set system instructions with retry mechanism
    async function setSystemInstructions(retryCount = 0) {
        try {
            // Click the button to show system instructions
            const toolbarButton = document.querySelector('div.toolbar-container > div:nth-child(2) > button');
            if (!toolbarButton) {
                if (retryCount < MAX_RETRIES) {
                    setTimeout(() => setSystemInstructions(retryCount + 1), RETRY_DELAY_MS);
                }
                return;
            }

            toolbarButton.click();

            // Wait for the textarea to become available
            setTimeout(async () => {
                const textarea = document.querySelector('textarea[aria-label="System instructions"]');

                if (!textarea) {
                    // Some models don't support system instructions
                    // Close the panel if it's open
                    toolbarButton.click();
                    return;
                }

                // Only set instructions if the field is empty
                if (textarea.value.trim() === '') {
                    textarea.value = DEFAULT_SYSTEM_INSTRUCTIONS;

                    // Trigger input event to ensure the UI updates
                    const event = new Event('input', { bubbles: true });
                    textarea.dispatchEvent(event);

                    // Wait a bit to ensure the value is applied
                    await new Promise(resolve => setTimeout(resolve, 300));
                }

                // Close the panel
                toolbarButton.click();
            }, 500);

        } catch (error) {
            console.error("Error setting system instructions:", error);
            if (retryCount < MAX_RETRIES) {
                setTimeout(() => setSystemInstructions(retryCount + 1), RETRY_DELAY_MS);
            }
        }
    }

    // Main function to check for new chats and set instructions
    function checkAndSetInstructions() {
        const chatId = getCurrentChatId();
        if (isNewChat(chatId)) {
            setSystemInstructions();
        }
    }

    // Set up a MutationObserver to detect URL changes
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(checkAndSetInstructions, 1000); // Wait for page to load
        }
    });

    observer.observe(document, { subtree: true, childList: true });

    // Also check when the script first runs
    setTimeout(checkAndSetInstructions, 1000);

    // Periodically check in case the observer misses something
    setInterval(checkAndSetInstructions, CHECK_INTERVAL_MS);
})();