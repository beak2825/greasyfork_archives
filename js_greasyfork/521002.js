// ==UserScript==
// @name        Xoul AI Notepad
// @namespace   Xoul AI
// @match       https://xoul.ai/*
// @grant       none
// @license     MIT
// @version     1.0
// @description Adds a notepad functionality, specific to each chat
// @icon        https://i.imgur.com/REqi6Iw.png
// @author       LuxTallis
// @downloadURL https://update.greasyfork.org/scripts/521002/Xoul%20AI%20Notepad.user.js
// @updateURL https://update.greasyfork.org/scripts/521002/Xoul%20AI%20Notepad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentChatKey = null;
    let currentNotepad = null;
    let buttonAdded = false; // Track if the button has been added

    // Create a style element and append it to the head to avoid CSP issues
    const style = document.createElement('style');
    style.textContent = `
        .notepad {
            position: fixed;
            top: 0;
            right: 0;
            width: 300px;
            height: calc(100vh - 10px);
            background-color: #0a0a0a;
            color: #ffffff;
            padding: 10px;
            box-shadow: 0 0 0px rgba(0, 0, 0, 0.5);
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
            z-index: 10000;
            overflow-y: auto;
        }
        .toggle-button {
            position: relative;
            background-color: #4a4a4a;
            color: #ffffff;
            border: none;
            padding: 10px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // Function to get the current chat ID from the URL
    function getChatId() {
        const url = window.location.href;
        const chatId = url.match(/\/chats\/([a-f0-9\-]+)/);
        return chatId ? chatId[1] : null;
    }

    // Function to initialize or reinitialize the notepad
    function initializeNotepad() {
        const chatKey = getChatId();
        if (!chatKey || chatKey === currentChatKey) return; // Don't reinitialize if the chat ID is the same

        currentChatKey = chatKey;

        // If a notepad already exists, remove it
        if (currentNotepad) {
            currentNotepad.remove();
        }

        // Create the notepad container
        currentNotepad = document.createElement('div');
        currentNotepad.className = 'notepad';
        currentNotepad.contentEditable = true; // Make it editable

        // Load saved content from localStorage based on the chat ID
        const savedContent = localStorage.getItem(`notepadContent-${chatKey}`);
        currentNotepad.textContent = savedContent ? savedContent : 'Start typing...'; // Default text

        // Event listener to save content on each change
        currentNotepad.addEventListener('input', () => {
            localStorage.setItem(`notepadContent-${chatKey}`, currentNotepad.textContent);
        });

        // Add the notepad to the page
        document.body.appendChild(currentNotepad);
    }

    // Add the new button under a given element
    function addButtonUnder(targetElement) {
        // Check if the button already exists, to avoid duplicates
        if (!document.querySelector('#newButton')) {
            const button = document.createElement('button');
            button.id = 'newButton'; // Add an ID to easily reference and avoid duplicates
            button.textContent = '◙';
            button.style.cssText = 'margin: 10px 0; padding: 5px 10px; background-color: #28a74500; color: white; border: none; border-radius: 5px; cursor: pointer; display: block;';

            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from propagating to the document
                if (!currentNotepad) {
                    initializeNotepad();
                }
                // Toggle the notepad visibility
                if (currentNotepad.style.transform === 'translateX(100%)') {
                    currentNotepad.style.transform = 'translateX(0%)'; // Open the notepad
                } else {
                    currentNotepad.style.transform = 'translateX(100%)'; // Close the notepad
                }
            });

            targetElement.insertAdjacentElement('afterend', button);
        }
    }

    // Wait for an element to load and execute the callback when it's found
    function waitForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                callback(element);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Main function to decide where to place the new button
    function placeButton() {
        const firstButton = document.querySelector('#customButton');
        if (firstButton) {
            // If the first button exists, place the new button below it
            addButtonUnder(firstButton);
        } else {
            // If the first button doesn't exist, place the new button under the fallback element
            waitForElement('a.Sidebar_link__0EvG_:nth-child(6)', addButtonUnder);
        }
    }

    // Use MutationObserver to recheck the DOM periodically
    const observer = new MutationObserver(placeButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // Observer to detect URL changes and update the notepad accordingly
    const urlObserver = new MutationObserver(() => {
        const chatId = getChatId();
        if (chatId !== currentChatKey) {
            initializeNotepad();
        }
    });
    urlObserver.observe(document, { childList: true, subtree: true });

    // Close notepad when clicking outside of it
    function closeNotepadOnClickOutside(event) {
        if (currentNotepad && !currentNotepad.contains(event.target)) {
            currentNotepad.style.transform = 'translateX(100%)'; // Close the notepad
        }
    }

    // Attach the click event listener to the document to detect clicks outside
    document.addEventListener('click', closeNotepadOnClickOutside);

    // Initial call to place the button when the page is loaded
    placeButton();
})();
