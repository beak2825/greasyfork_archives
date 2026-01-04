// ==UserScript==
// @name         SnapTagger (Improved)
// @namespace    http://tampermonkey.net/
// @version      0.3 // Increment version for the change
// @description  Tag and save Snapchat chats seamlessly using localStorage.
// @author       You & Gemini
// @license      MIT // Added MIT License
// @match        https://web.snapchat.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue // Optional: For clearing data if needed
// @downloadURL https://update.greasyfork.org/scripts/533869/SnapTagger%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533869/SnapTagger%20%28Improved%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Constants ---
    const STORAGE_KEY = 'snapTaggerData'; // Key for localStorage
    // IMPORTANT: These selectors might change if Snapchat updates their website.
    // You may need to inspect the elements on web.snapchat.com and update these.
    const SNAP_ICON_SELECTOR = 'svg[aria-label="Snapchat"]'; // Try targeting the SVG element more specifically
    const CHAT_HEADER_SELECTOR = '[data-testid="conversation-header-title"]'; // Selector for the chat header element containing the friend's name

    // --- State ---
    let uiInjected = false;

    // --- Styling ---
    // Use GM_addStyle for CSS to keep it separate and potentially more maintainable
    GM_addStyle(`
        .snaptagger-container {
            position: relative;
            cursor: pointer;
            display: inline-block; /* Adjust display as needed */
            vertical-align: middle; /* Align with other header items */
        }
        .snaptagger-menu {
            position: absolute;
            top: 100%; /* Position below the icon */
            right: 0;
            background-color: #2f2f2f; /* Slightly lighter dark grey */
            border: 1px solid #555; /* Softer border */
            border-radius: 8px; /* Match Snapchat's rounding */
            padding: 12px;
            z-index: 10000; /* Ensure it's on top */
            display: none; /* Hidden by default */
            color: #ffffff;
            font-size: 14px;
            min-width: 180px; /* Give it some width */
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* Add subtle shadow */
            font-family: "Inter", sans-serif; /* Try to match font */
        }
        .snaptagger-menu.visible {
            display: block;
        }
        .snaptagger-title {
            font-weight: 600;
            margin-bottom: 10px;
            color: #eee; /* Lighter title color */
            border-bottom: 1px solid #444;
            padding-bottom: 6px;
        }
        .snaptagger-button {
            display: block;
            width: 100%;
            background-color: #4a4a4a; /* Button background */
            color: #ffffff;
            border: none;
            padding: 8px 12px;
            margin-bottom: 6px;
            border-radius: 6px;
            cursor: pointer;
            text-align: left;
            font-size: 13px;
            transition: background-color 0.2s ease;
        }
        .snaptagger-button:hover {
            background-color: #5c5c5c; /* Slightly lighter on hover */
        }
        .snaptagger-button:last-child {
            margin-bottom: 0;
        }
        .snaptagger-feedback {
            font-size: 12px;
            color: #999;
            margin-top: 8px;
            text-align: center;
            min-height: 15px; /* Reserve space */
        }
    `);

    // --- Utility Functions ---

    /**
     * Gets the currently tagged data from storage.
     * @returns {Array<Object>} An array of tag objects or an empty array.
     */
    function getStoredTags() {
        // Use GM_getValue for Tampermonkey/Greasemonkey storage (more robust than raw localStorage)
        return GM_getValue(STORAGE_KEY, []); // Default to empty array if nothing stored
    }

    /**
     * Saves the tagged data to storage.
     * @param {Array<Object>} tags - The array of tag objects to save.
     */
    function saveTags(tags) {
        GM_setValue(STORAGE_KEY, tags);
    }

    /**
     * Gets the name of the currently open chat.
     * @returns {string | null} The chat name or null if not found.
     */
    function getCurrentChatName() {
        // This selector might need adjustment based on Snapchat's current structure
        const headerElement = document.querySelector(CHAT_HEADER_SELECTOR);
        return headerElement ? headerElement.textContent.trim() : null;
    }

    /**
     * Shows temporary feedback message in the menu.
     * @param {string} message - The message to display.
     */
    function showFeedback(message) {
        const feedbackEl = document.getElementById('snaptagger-feedback');
        if (feedbackEl) {
            feedbackEl.textContent = message;
            setTimeout(() => {
                if (feedbackEl.textContent === message) { // Only clear if it's the same message
                     feedbackEl.textContent = '';
                }
            }, 2500); // Clear after 2.5 seconds
        }
    }


    // --- Core Logic ---

    /**
     * Tags the currently open chat conversation.
     */
    function tagCurrentChat() {
        const chatName = getCurrentChatName();
        if (!chatName) {
            showFeedback("Error: Couldn't find chat name.");
            console.error("SnapTagger: Could not find chat header element with selector:", CHAT_HEADER_SELECTOR);
            return;
        }

        const tag = prompt(`Enter a tag for the chat with "${chatName}":`);
        if (tag === null || tag.trim() === '') {
            showFeedback("Tagging cancelled.");
            return; // User cancelled or entered empty tag
        }

        const newTagEntry = {
            chatName: chatName,
            tag: tag.trim(),
            timestamp: new Date().toISOString(),
            // Future: Add specific messages here if needed
            // messages: getSelectedMessages() // Placeholder for more advanced functionality
        };

        try {
            const currentTags = getStoredTags();
            currentTags.push(newTagEntry);
            saveTags(currentTags);
            console.log("SnapTagger: Chat tagged:", newTagEntry);
            showFeedback(`Tagged "${chatName}" as "${tag.trim()}"`);
        } catch (error) {
            console.error("SnapTagger: Error saving tag:", error);
            showFeedback("Error saving tag.");
            alert("SnapTagger Error: Could not save tag to storage. Storage might be full or disabled.\n\n" + error);
        }
    }

    /**
     * Exports the stored tags as a JSON file.
     */
    function exportTaggedChats() {
        try {
            const tags = getStoredTags();
            if (tags.length === 0) {
                showFeedback("No tags to export.");
                return;
            }

            const jsonData = JSON.stringify(tags, null, 2); // Pretty print JSON
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            a.download = `snaptagger_export_${timestamp}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Clean up

            showFeedback("Tags exported successfully!");
            console.log("SnapTagger: Exported tags.", tags);

        } catch (error) {
            console.error("SnapTagger: Error exporting tags:", error);
             showFeedback("Error during export.");
            alert("SnapTagger Error: Could not export tags.\n\n" + error);
        }
    }

    /**
     * Injects the SnapTagger UI elements into the page.
     * @param {Element} iconElement - The Snapchat icon element to replace/wrap.
     */
    function injectUI(iconElement) {
        if (uiInjected) return; // Prevent multiple injections

        // --- Create Container ---
        const container = document.createElement('div');
        container.className = 'snaptagger-container';

        // --- Clone Icon ---
        // Cloning helps maintain the original icon's appearance and any associated listeners
        const clonedIcon = iconElement.cloneNode(true);
        container.appendChild(clonedIcon);

        // --- Create Dropdown Menu ---
        const menu = document.createElement('div');
        menu.className = 'snaptagger-menu'; // Use class for styling
        menu.id = 'snaptagger-menu'; // Add ID for easier selection
        menu.innerHTML = `
            <div class="snaptagger-title">📌 SnapTagger</div>
            <button id="snaptagger-tag-chat" class="snaptagger-button">Tag this chat</button>
            <button id="snaptagger-export-chat" class="snaptagger-button">Export tagged chats</button>
            <div id="snaptagger-feedback" class="snaptagger-feedback"></div>
        `;
        container.appendChild(menu);

        // --- Replace Original Icon ---
        // Replace the original icon with our container that includes the icon and menu
        iconElement.parentNode.replaceChild(container, iconElement);
        uiInjected = true; // Mark UI as injected
        console.log("SnapTagger: UI Injected.");

        // --- Add Event Listeners ---

        // Toggle dropdown visibility
        container.addEventListener('click', (event) => {
            // Prevent clicks on buttons inside the menu from closing it immediately
            if (!menu.contains(event.target) || event.target === container || event.target === clonedIcon) {
                 menu.classList.toggle('visible');
            }
        });

        // Close dropdown if clicking outside
        document.addEventListener('click', (event) => {
            if (!container.contains(event.target) && menu.classList.contains('visible')) {
                menu.classList.remove('visible');
            }
        });

        // Button actions
        document.getElementById('snaptagger-tag-chat').addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent container click listener from firing
            tagCurrentChat();
            // Optionally close menu after action:
            // menu.classList.remove('visible');
        });

        document.getElementById('snaptagger-export-chat').addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent container click listener from firing
            exportTaggedChats();
            // Optionally close menu after action:
             menu.classList.remove('visible');
        });
    }

    // --- Initialization ---

    // Use MutationObserver for potentially better performance and reliability than setInterval
    const observer = new MutationObserver((mutationsList, obs) => {
        const snapIcon = document.querySelector(SNAP_ICON_SELECTOR);
        if (snapIcon && !uiInjected) {
            console.log("SnapTagger: Snapchat icon found. Injecting UI.");
            // Small delay to ensure surrounding elements are likely stable
            setTimeout(() => injectUI(snapIcon), 500);
            obs.disconnect(); // Stop observing once the icon is found and UI is injected
        }
        // Add a timeout safeguard in case the observer fails or the element never appears
        // setTimeout(() => {
        //     if (!uiInjected) {
        //         console.warn("SnapTagger: Timed out waiting for icon. Script might not work.");
        //         obs.disconnect();
        //     }
        // }, 15000); // Stop trying after 15 seconds
    });

    // Start observing the document body for added nodes
    console.log("SnapTagger: Initializing observer...");
    observer.observe(document.body, { childList: true, subtree: true });

    // Fallback using setInterval (less ideal but can work)
    // const checkInterval = 2000; // Check every 2 seconds
    // const maxAttempts = 10; // Try for 20 seconds
    // let attempts = 0;
    // const fallbackInterval = setInterval(() => {
    //     if (uiInjected) {
    //         clearInterval(fallbackInterval);
    //         return;
    //     }
    //     attempts++;
    //     const snapIcon = document.querySelector(SNAP_ICON_SELECTOR);
    //     if (snapIcon) {
    //         console.log("SnapTagger (Fallback): Snapchat icon found. Injecting UI.");
    //         clearInterval(fallbackInterval);
    //         injectUI(snapIcon);
    //     } else if (attempts >= maxAttempts) {
    //         clearInterval(fallbackInterval);
    //         console.warn(`SnapTagger (Fallback): Could not find Snapchat icon (${SNAP_ICON_SELECTOR}) after ${maxAttempts} attempts. Script may not work.`);
    //     }
    // }, checkInterval);


})();
