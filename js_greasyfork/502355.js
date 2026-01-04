// ==UserScript==
// @name         GaiaOnline - AviChat Mod Suite
// @namespace    https://greasyfork.org/en/users/1265537-kloob
// @version      1.3.1
// @description  Adds QoL improvements for moderating AviChat.
// @author       kloob
// @match        https://dashboard.getstream.io/app/1298352/moderation/*
// @match        https://www.gaiaonline.com/avichat/
// @exclude      https://dashboard.getstream.io/app/1298352/moderation/channel-explorer
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502355/GaiaOnline%20-%20AviChat%20Mod%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/502355/GaiaOnline%20-%20AviChat%20Mod%20Suite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const contextLogs = [];
    let individualMode = true; // Default mode

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert hours from 24-hour format to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12;

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
    }

    function processMessage(message) {
        // Get the content of the message
        const messageContent = message.querySelector('.str-chat__message-text-inner')?.innerText;

        // Find the closest .sc-fyPSjY.hkREZa div to get the username and timestamp
        const parentDiv = message.closest('.sc-fyPSjY.hkREZa');
        if (parentDiv) {
            const username = parentDiv.querySelector('.str-chat__message-simple-name')?.innerText;
            const timestamp = parentDiv.querySelector('time')?.getAttribute('title');

            // Check if this message is a reply by looking for the quoted message class
            const quotedMessage = parentDiv.querySelector('.str-chat__quoted-message-preview .quoted-message');
            const quotedContent = quotedMessage ? quotedMessage.querySelector('.str-chat__quoted-message-bubble').innerText : '';

            const formattedContent = quotedContent
                ? `Reply to Message: [${quotedContent}] ${messageContent.replace(quotedContent, '').trim()}`
                : messageContent;

            // Store the message content, username, and timestamp
            const contextLog = {
                content: formattedContent,
                username: username,
                timestamp: formatTimestamp(timestamp) // Use formatted timestamp
            };

            // Add to contextLogs array
            contextLogs.push(contextLog);

            // Sort the array by timestamp (oldest to most recent)
            contextLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            // Log the new entry and sorted array
            console.log('New entry added:', contextLog);
            console.log('Current context logs:', contextLogs);

            // Update copy button state
            updateCopyButtonState();
        } else {
            console.error('Failed to find parent div for message:', message);
        }
    }

    function selectContextMessages(message) {
        const allMessages = Array.from(document.querySelectorAll('.str-chat__message'));
        const index = allMessages.indexOf(message);
        if (index === -1) {
            console.error('Message not found in allMessages:', message);
            return;
        }

        // Clear existing context logs
        contextLogs.length = 0;

        // Select previous 15 messages and following 15 messages
        const start = Math.max(0, index - 15);
        const end = Math.min(allMessages.length, index + 22);

        console.log('Selecting messages from index', start, 'to', end); // Debugging

        for (let i = start; i < end; i++) {
            const msg = allMessages[i];
            processMessage(msg);
        }
    }

    function addCheckboxes() {
        // Only add checkboxes if we are not on the AviChat page
        if (window.location.href.includes('https://www.gaiaonline.com/avichat/')) {
            return;
        }

        const messages = document.querySelectorAll('.str-chat__message-text:not(.checkbox-added)');
        messages.forEach((message) => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.marginRight = '10px';
            checkbox.classList.add('message-checkbox');
            message.prepend(checkbox);
            message.classList.add('checkbox-added');

            checkbox.addEventListener('click', function() {
                if (checkbox.checked) {
                    if (individualMode) {
                        processMessage(message.closest('.str-chat__message'));
                    } else {
                        selectContextMessages(message.closest('.str-chat__message'));
                    }
                }
                updateCopyButtonState(); // Update the copy button state based on contextLogs
            });
        });
    }

    // Function to update the copy button state
    function updateCopyButtonState() {
        const copyButton = document.querySelector('#copyButton');
        if (copyButton) {
            copyButton.disabled = contextLogs.length === 0;
            copyButton.style.backgroundColor = contextLogs.length === 0 ? '#b0b0b0' : '#007bff'; // Change color based on state
        }
    }

    // Function to copy selected messages to the clipboard
    function copyToClipboard() {
        // Format messages as "Username @ Timestamp: Message"
        const selectedMessages = contextLogs.map(log => `[b]${log.username}[/b] at ${log.timestamp}: ${log.content}`).join('\n');
        navigator.clipboard.writeText(selectedMessages).then(() => {
            console.log('Copied to clipboard:', selectedMessages);
        }).catch(err => {
            console.error('Error copying to clipboard:', err);
        });
    }

    // Function to clear the context logs
    function clearContextLogs() {
        contextLogs.length = 0;  // Clear the array
        console.log('Context logs cleared');
        updateCopyButtonState(); // Update the copy button state based on contextLogs

        // Uncheck all checkboxes
        document.querySelectorAll('.message-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    // Add the "Copy Selected Messages", "Clear Selected Messages", and "Toggle Mode" buttons
    function addButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '10px';
        buttonContainer.style.right = '10px';
        buttonContainer.style.zIndex = '9999';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '5px';
        document.body.appendChild(buttonContainer);

        const buttonStyle = `
            padding: 10px;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin: 0;
            display: block;
            width: 200px;
            text-align: center;
        `;

        const copyButton = document.createElement('button');
        copyButton.innerText = 'Copy Selected Messages';
        copyButton.id = 'copyButton';
        copyButton.style = buttonStyle;
        copyButton.style.backgroundColor = '#b0b0b0'; // Initially gray
        copyButton.disabled = true; // Initially disabled
        copyButton.addEventListener('click', copyToClipboard);
        buttonContainer.appendChild(copyButton);

        const clearButton = document.createElement('button');
        clearButton.innerText = 'Clear Selected Messages';
        clearButton.style = buttonStyle;
        clearButton.style.backgroundColor = '#dc3545'; // Red color for clear
        clearButton.addEventListener('click', clearContextLogs);
        buttonContainer.appendChild(clearButton);

        const toggleModeButton = document.createElement('button');
        toggleModeButton.innerText = 'Switch to Context Mode'; // Set initial text
        toggleModeButton.style = buttonStyle;
        toggleModeButton.style.backgroundColor = '#28a745'; // Green color for toggle mode
        toggleModeButton.addEventListener('click', function() {
            individualMode = !individualMode;
            toggleModeButton.innerText = individualMode ? 'Switch to Context Mode' : 'Switch to Individual Mode';
            console.log('Mode toggled. Current mode:', individualMode ? 'Individual' : 'Context');
            clearContextLogs(); // Clear the array and uncheck checkboxes when switching modes
        });
        buttonContainer.appendChild(toggleModeButton);
    }

    // Function to add "Moderate AviChat" button on the specific URL
    function addModerateAviChatButton() {
        const button = document.createElement('button');
        button.innerText = 'Moderate AviChat';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';

        button.addEventListener('click', () => {
            console.log('Moderate AviChat button clicked');
            // Add additional functionality here if needed
        });

        document.body.appendChild(button);
    }

    // Add buttons based on URL
    if (window.location.href.includes('https://www.gaiaonline.com/avichat/')) {
        addModerateAviChatButton();
    } else {
        addButton();
        // Set an interval to add checkboxes every few seconds if they don't appear immediately
        setInterval(addCheckboxes, 3000);
    }
})();
