// ==UserScript==
// @name         ChatGPT Conversation Exporter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a button to export ChatGPT conversations as a text file with deduplication, and clear dividers.
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @icon         https://chat.openai.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527488/ChatGPT%20Conversation%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/527488/ChatGPT%20Conversation%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the Export button
    function createExportButton() {
        // Check if the button already exists
        if (document.getElementById('export-conversation-button')) return;

        // Create the Export button
        const exportButton = document.createElement('button');
        exportButton.id = 'export-conversation-button';
        exportButton.innerText = 'Export Conversation';
        exportButton.style.position = 'fixed';
        exportButton.style.bottom = '100px';
        exportButton.style.right = '20px';
        exportButton.style.padding = '10px 20px';
        exportButton.style.backgroundColor = '#4CAF50';
        exportButton.style.color = 'white';
        exportButton.style.border = 'none';
        exportButton.style.borderRadius = '5px';
        exportButton.style.cursor = 'pointer';
        exportButton.style.zIndex = '1000';

        // Add hover effect
        exportButton.addEventListener('mouseover', function() {
            exportButton.style.backgroundColor = '#45a049';
        });
        exportButton.addEventListener('mouseout', function() {
            exportButton.style.backgroundColor = '#4CAF50';
        });

        // Add click event listener to the button
        exportButton.addEventListener('click', function() {
            // Array to hold conversation messages
            let conversation = [];
            // Divider between messages
            const divider = "\n____________________\n\n";

            // Select all message containers (update selector if ChatGPT changes its UI)
            const messageContainers = document.querySelectorAll('div[data-message-author-role]')

            for (let container of messageContainers) {
                let role = container.dataset.messageAuthorRole;

                // Extract/build the message text
                let messageLine = `${role}`;

                messageLine += `:\n${container.textContent}`;

                conversation.push(messageLine);
            }

            // Join messages using the divider
            const conversationText = conversation.join(divider);

            // Create a blob from the conversation text and trigger download
            const blob = new Blob([conversationText], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'ChatGPT_Conversation.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        // Append the button to the document body
        document.body.appendChild(exportButton);
    }

    // Function to ensure the export button remains in the DOM
    function ensureExportButton() {
        if (!document.getElementById('export-conversation-button')) {
            createExportButton();
        }
    }

    // Check every second to ensure the button is still present
    setInterval(ensureExportButton, 1000);
    // Initial creation
    createExportButton();

})();
