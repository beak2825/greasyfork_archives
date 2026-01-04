// ==UserScript==
// @name         Claude.ai Chat Exporter (Updated)
// @description  Adds "Export Chat" button to Claude.ai (current as of Sonnet 3.7)
// @version      1.1
// @author       Merlin McKean 
// @namespace    
// @match        https://claude.ai/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528320/Claudeai%20Chat%20Exporter%20%28Updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528320/Claudeai%20Chat%20Exporter%20%28Updated%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_BASE_URL = 'https://claude.ai/api';

    // Updated function to make API requests with new headers
    function apiRequest(method, endpoint, data = null) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                url: `${API_BASE_URL}${endpoint}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // Add any required authentication headers here
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

    // Function to get the organization ID - updated for new API
    async function getOrganizationId() {
        try {
            const organizations = await apiRequest('GET', '/organizations');
            return organizations[0]?.uuid;
        } catch (error) {
            console.error('Error getting organization ID:', error);
            throw error;
        }
    }

    // Updated function to get conversation history
    async function getConversationHistory(orgId, chatId) {
        return await apiRequest('GET', `/organizations/${orgId}/chat_conversations/${chatId}`);
    }

    // Function to download data as a file
    function downloadData(data, filename, format) {
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
        }, 100);
    }

    // Updated function to convert conversation data to TXT format
    function convertToTxtFormat(data) {
        let txtContent = `Chat Title: ${data.name}\nDate: ${new Date().toISOString()}\n\n`;
        data.chat_messages.forEach((message) => {
            const sender = message.sender === 'human' ? 'User' : 'Claude';
            txtContent += `${sender}:\n${message.text}\n\n`;
        });
        return txtContent.trim();
    }

    // Updated function to create a modern-styled button
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            padding: 10px 20px;
            background-color: #4a5568;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            z-index: 9999;
            font-family: system-ui, -apple-system, sans-serif;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#2d3748';
        });

        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#4a5568';
        });

        button.addEventListener('click', onClick);
        document.body.appendChild(button);
        return button;
    }

    // Updated function to initialize the export functionality
    async function initExportFunctionality() {
        const currentUrl = window.location.href;
        const chatIdMatch = currentUrl.match(/\/chat\/([a-f0-9-]+)/);

        if (chatIdMatch) {
            const chatId = chatIdMatch[1];
            try {
                const orgId = await getOrganizationId();
                const button = createButton('Export Chat', async () => {
                    const format = prompt('Enter export format (json or txt):', 'json');
                    if (format === 'json' || format === 'txt') {
                        try {
                            const chatData = await getConversationHistory(orgId, chatId);
                            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                            const filename = `claude-chat_${timestamp}.${format}`;
                            downloadData(chatData, filename, format);
                            alert(`Chat exported successfully in ${format.toUpperCase()} format!`);
                        } catch (error) {
                            alert('Error exporting chat. Please try again.');
                            console.error('Export error:', error);
                        }
                    } else {
                        alert('Invalid format. Please enter either "json" or "txt".');
                    }
                });
            } catch (error) {
                console.error('Error initializing export functionality:', error);
            }
        }
    }

    // Function to observe URL changes
    function observeUrlChanges() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                initExportFunctionality();
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // Initialize the script when the page is ready
    function init() {
        initExportFunctionality();
        observeUrlChanges();
    }

    // Start the script when the DOM is fully loaded
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();