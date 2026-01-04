// ==UserScript==
// @name         Rumble Live Chat Blocker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide messages from specific users in Rumble live chat with a block user menu
// @author       CynicalPhantom
// @match        https://rumble.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532873/Rumble%20Live%20Chat%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/532873/Rumble%20Live%20Chat%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to load blocked users from localStorage
    function loadBlockedUsers() {
        const storedBlockedUsers = localStorage.getItem('blockedUsers');
        return storedBlockedUsers ? JSON.parse(storedBlockedUsers) : [];
    }

    // Function to save blocked users to localStorage
    function saveBlockedUsers(blockedUsers) {
        localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
    }

    // Load blocked users from localStorage
    const blockedUsers = loadBlockedUsers();

    // Function to update message visibility
    function updateMessageVisibility() {
        const chatMessages = document.querySelectorAll('.chat-history--row');
        const usernameSelector = '.chat-history--username';

        chatMessages.forEach(message => {
            const usernameElement = message.querySelector(usernameSelector);
            if (usernameElement) {
                const username = usernameElement.textContent.trim();
                message.style.display = blockedUsers.includes(username) ? 'none' : '';
            }
        });
    }

    // Function to add the menu button and dropdown
    function addBlockUserMenu() {
        // Create the icon button
        const menuButton = document.createElement('button');
        menuButton.textContent = '⚙️';
        menuButton.style.position = 'fixed';
        menuButton.style.bottom = '10px';
        menuButton.style.left = '10px';
        menuButton.style.zIndex = '999999';
        menuButton.style.padding = '8px';
        menuButton.style.width = '32px';
        menuButton.style.height = '32px';
        menuButton.style.backgroundColor = '#333';
        menuButton.style.color = '#fff';
        menuButton.style.border = 'none';
        menuButton.style.borderRadius = '5px';
        menuButton.style.cursor = 'pointer';
        menuButton.style.fontSize = '16px';
        menuButton.style.display = 'flex';
        menuButton.style.alignItems = 'center';
        menuButton.style.justifyContent = 'center';

        // Create the dropdown menu (initially hidden)
        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.bottom = '50px';
        menu.style.left = '10px';
        menu.style.zIndex = '999999';
        menu.style.backgroundColor = '#333';
        menu.style.color = '#fff';
        menu.style.borderRadius = '5px';
        menu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        menu.style.display = 'none';
        menu.style.flexDirection = 'column';
        menu.style.padding = '5px 0';

        // Block User menu item
        const blockItem = document.createElement('div');
        blockItem.textContent = 'Block User';
        blockItem.style.padding = '8px 15px';
        blockItem.style.cursor = 'pointer';
        blockItem.style.whiteSpace = 'nowrap';
        blockItem.style.fontSize = '14px';
        blockItem.addEventListener('click', () => {
            menu.style.display = 'none';
            const input = prompt('Enter the username to block:');
            if (input) {
                const trimmedInput = input.trim();
                if (!blockedUsers.includes(trimmedInput)) {
                    blockedUsers.push(trimmedInput);
                    saveBlockedUsers(blockedUsers);
                    updateMessageVisibility();
                } else {
                    alert('User is already blocked.');
                }
            }
        });

        // Unblock User menu item
        const unblockItem = document.createElement('div');
        unblockItem.textContent = 'Unblock User';
        unblockItem.style.padding = '8px 15px';
        unblockItem.style.cursor = 'pointer';
        unblockItem.style.whiteSpace = 'nowrap';
        unblockItem.style.fontSize = '14px';
        unblockItem.addEventListener('click', () => {
            menu.style.display = 'none';
            if (blockedUsers.length === 0) {
                alert('No users are blocked.');
                return;
            }
            showUnblockPopup();
        });

        // Add menu items to menu
        menu.appendChild(blockItem);
        menu.appendChild(unblockItem);

        // Toggle menu visibility on button click
        menuButton.addEventListener('click', () => {
            menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!menuButton.contains(event.target) && !menu.contains(event.target)) {
                menu.style.display = 'none';
            }
        });

        // Append button and menu to the page
        document.body.appendChild(menuButton);
        document.body.appendChild(menu);
    }

    // Function to create and show the unblock popup
    function showUnblockPopup() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '999998';

        // Create popup
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#333';
        popup.style.color = '#fff';
        popup.style.padding = '20px';
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '999999';
        popup.style.maxWidth = '400px';
        popup.style.width = '90%';
        popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';

        // Popup title
        const title = document.createElement('h3');
        title.textContent = 'Select a user to unblock';
        title.style.margin = '0 0 10px 0';
        title.style.fontSize = '16px';

        // User list container
        const userList = document.createElement('div');
        userList.style.maxHeight = '200px';
        userList.style.overflowY = 'auto';
        userList.style.backgroundColor = '#444';
        userList.style.borderRadius = '3px';
        userList.style.padding = '5px';

        // Populate user list
        blockedUsers.forEach((user, index) => {
            const userItem = document.createElement('div');
            userItem.textContent = `${index}: ${user}`;
            userItem.style.padding = '8px';
            userItem.style.cursor = 'pointer';
            userItem.style.borderBottom = '1px solid #555';
            userItem.addEventListener('click', () => {
                const unblockedUser = blockedUsers.splice(index, 1)[0];
                saveBlockedUsers(blockedUsers);
                alert(`User ${unblockedUser} has been unblocked.`);
                updateMessageVisibility();
                document.body.removeChild(popup);
                document.body.removeChild(overlay);
            });
            userList.appendChild(userItem);
        });

        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginTop = '15px';
        closeButton.style.padding = '8px 15px';
        closeButton.style.backgroundColor = '#555';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '3px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(popup);
            document.body.removeChild(overlay);
        });

        // Append elements to popup
        popup.appendChild(title);
        popup.appendChild(userList);
        popup.appendChild(closeButton);

        // Append popup and overlay to body
        document.body.appendChild(overlay);
        document.body.appendChild(popup);
    }

    // Run the function initially
    updateMessageVisibility();

    // Set up a MutationObserver to handle new messages
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                updateMessageVisibility();
            }
        });
    });

    // Start observing the chat container
    const chatContainer = document.querySelector('.chat-history');
    if (chatContainer) {
        observer.observe(chatContainer, { childList: true, subtree: true });
    }

    // Add the menu button and dropdown
    addBlockUserMenu();
})();