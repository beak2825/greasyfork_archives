// ==UserScript==
// @name         Claude.ai Ultimate Chat Exporter
// @description  Adds "Export All Chats" and "Export Chat" buttons to Claude.ai
// @version      1.0
// @author       Geo Anima
// @namespace    https://github.com/GeoAnima/claude.ai-ultimate-chat-exporter
// @match        https://claude.ai/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490399/Claudeai%20Ultimate%20Chat%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/490399/Claudeai%20Ultimate%20Chat%20Exporter.meta.js
// ==/UserScript==

/*
NOTES:
- This project is a fork of "Export Claude.Ai" (https://github.com/TheAlanK/export-claude), licensed under the MIT license.
- The "Export All Chats" option can only be accessed from the https://claude.ai/chats URL.
- When saving, the user is prompted for json and txt format options.
*/

(function () {
    'use strict';

    const API_BASE_URL = 'https://claude.ai/api';

    // Function to make API requests
    function apiRequest(method, endpoint, data = null, headers = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                url: `${API_BASE_URL}${endpoint}`,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                data: data ? JSON.stringify(data) : null,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(new Error(`API request failed with status ${response.status}`));
                    }
                },
                onerror: (error) => {
                    reject(error);
                },
            });
        });
    }

    // Function to get the organization ID
    async function getOrganizationId() {
        const organizations = await apiRequest('GET', '/organizations');
        return organizations[0].uuid;
    }

    // Function to get all conversations
    async function getAllConversations(orgId) {
        return await apiRequest('GET', `/organizations/${orgId}/chat_conversations`);
    }

    // Function to get conversation history
    async function getConversationHistory(orgId, chatId) {
        return await apiRequest('GET', `/organizations/${orgId}/chat_conversations/${chatId}`);
    }

    // Function to download data as a file
    function downloadData(data, filename, format) {
        return new Promise((resolve, reject) => {
            let content = '';
            if (format === 'json') {
                content = JSON.stringify(data, null, 2);
            } else if (format === 'txt') {
                content = convertToTxtFormat(data);
            }
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                resolve();
            }, 100);
        });
    }

    // Function to convert conversation data to TXT format
    function convertToTxtFormat(data) {
        let txtContent = '';
        data.chat_messages.forEach((message) => {
            const sender = message.sender === 'human' ? 'User' : 'Claude';
            txtContent += `${sender}:\n${message.text}\n\n`;
        });
        return txtContent.trim();
    }

    // Function to export a single chat
    async function exportChat(orgId, chatId, format, showAlert = true) {
        try {
            const chatData = await getConversationHistory(orgId, chatId);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `${chatData.name}_${timestamp}.${format}`;
            await downloadData(chatData, filename, format);
            if (showAlert) {
                alert(`Chat exported successfully in ${format.toUpperCase()} format!`);
            }
        } catch (error) {
            alert('Error exporting chat. Please try again later.');
        }
    }

    // Function to export all chats
    async function exportAllChats(format) {
        try {
            const orgId = await getOrganizationId();
            const conversations = await getAllConversations(orgId);
            for (const conversation of conversations) {
                await exportChat(orgId, conversation.uuid, format, false);
            }
            alert(`All chats exported successfully in ${format.toUpperCase()} format!`);
        } catch (error) {
            alert('Error exporting all chats. Please try again later.');
        }
    }

    // Function to create a button
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            z-index: 9999;
        `;
        button.addEventListener('click', onClick);
        document.body.appendChild(button);
    }

    // Function to remove existing export buttons
    function removeExportButtons() {
        const existingButtons = document.querySelectorAll('button[style*="position: fixed"]');
        existingButtons.forEach((button) => {
            button.remove();
        });
    }

    // Function to initialize the export functionality
    async function initExportFunctionality() {
        removeExportButtons();
        const currentUrl = window.location.href;
        if (currentUrl.includes('/chat/')) {
            const urlParts = currentUrl.split('/');
            const chatId = urlParts[urlParts.length - 1];
            const orgId = await getOrganizationId();
            createButton('Export Chat', async () => {
                const format = prompt('Enter the export format (json or txt):', 'json');
                if (format === 'json' || format === 'txt') {
                    await exportChat(orgId, chatId, format);
                } else {
                    alert('Invalid export format. Please enter either "json" or "txt".');
                }
            });
        } else if (currentUrl.includes('/chats')) {
            createButton('Export All Chats', async () => {
                const format = prompt('Enter the export format (json or txt):', 'json');
                if (format === 'json' || format === 'txt') {
                    await exportAllChats(format);
                } else {
                    alert('Invalid export format. Please enter either "json" or "txt".');
                }
            });
        }
    }

    // Function to observe changes in the URL
    function observeUrlChanges(callback) {
        let lastUrl = location.href;
        const observer = new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                callback();
            }
        });
        const config = { subtree: true, childList: true };
        observer.observe(document, config);
    }

    // Function to observe changes in the DOM
    function observeDOMChanges(selector, callback) {
        const observer = new MutationObserver((mutations) => {
            const element = document.querySelector(selector);
            if (element) {
                if (document.readyState === 'complete') {
                    observer.disconnect();
                    callback();
                }
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    }

    // Function to initialize the script
    async function init() {
        await initExportFunctionality();
        // Observe URL changes and reinitialize export functionality
        observeUrlChanges(async () => {
            await initExportFunctionality();
        });
    }

    // Wait for the desired element to be present in the DOM before initializing the script
    observeDOMChanges('.grecaptcha-badge', init);
})();
