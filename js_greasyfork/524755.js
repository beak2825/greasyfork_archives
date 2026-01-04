// ==UserScript==
// @name         InDriver Chat History Extractor auto
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract chat history from InDriver support chat
// @author       Ahmed Esslaoui
// @match        https://support-frontend.console3.com/*
// @icon         https://www.svgrepo.com/download/434313/chat.svg
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/524755/InDriver%20Chat%20History%20Extractor%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/524755/InDriver%20Chat%20History%20Extractor%20auto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store the bearer token globally
    let bearerToken = '';

    // Function to extract bearer token from requests
    function setupNetworkInterceptor() {
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);

            // Clone the response to read headers without consuming the response
            const clonedResponse = response.clone();

            // Check if the request has an authorization header
            const authHeader = args[1]?.headers?.authorization || args[1]?.headers?.Authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const newToken = authHeader.split(' ')[1];
                if (newToken !== bearerToken) {
                    console.log('🔑 Updated bearer token');
                    bearerToken = newToken;
                }
            }

            return response;
        };

        // Also intercept XHR requests
        const XHR = XMLHttpRequest.prototype;
        const originalOpen = XHR.open;
        const originalSetRequestHeader = XHR.setRequestHeader;

        XHR.open = function() {
            this._requestHeaders = {};
            return originalOpen.apply(this, arguments);
        };

        XHR.setRequestHeader = function(header, value) {
            this._requestHeaders[header.toLowerCase()] = value;
            if (header.toLowerCase() === 'authorization' && value.startsWith('Bearer ')) {
                const newToken = value.split(' ')[1];
                if (newToken !== bearerToken) {
                    console.log('🔑 Updated bearer token from XHR');
                    bearerToken = newToken;
                }
            }
            return originalSetRequestHeader.apply(this, arguments);
        };
    }

    // Helper function to get current bearer token
    function getBearerToken() {
        return bearerToken;
    }

    async function getOldestUuid(requestId) {
        const searchUrl = 'https://sc-cf.euce1.indriverapp.com/api/support-frontend/v1/chat/search';
        const headers = {
            'accept': 'application/json',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'authorization': `Bearer ${getBearerToken()}`
        };

        const payload = {
            query: requestId,
            type: "request_id"
        };

        console.log('🔍 Making getOldestUuid API call:');
        console.log('URL:', searchUrl);
        console.log('Headers:', JSON.stringify(headers, null, 2));
        console.log('Payload:', JSON.stringify(payload, null, 2));

        try {
            const response = await fetch(searchUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log('✅ getOldestUuid Response:', JSON.stringify(data, null, 2));

            if (data.requests && data.requests.length > 0) {
                const result = {
                    end_message_id: data.requests[0].end_message_id,
                    start_message_id: data.requests[0].start_message_id,
                    chat_id: data.requests[0].chat_id
                };
                console.log('📝 Extracted data:', JSON.stringify(result, null, 2));
                return result;
            }
            throw new Error('No request found');
        } catch (error) {
            console.error('❌ Error getting oldest UUID:', error);
            throw error;
        }
    }

    async function getChatHistory(chatId, oldestUuid, startMessageId) {
        const historyUrl = `https://cht-cf.euce1.indriverapp.com/api/chat/v1/chats/${chatId}/history/?oldest_uuid=${encodeURIComponent(oldestUuid)}`;
        const headers = {
            'accept': 'application/json',
            'accept-language': 'en-US,en;q=0.9',
            'authorization': `Bearer ${getBearerToken()}`
        };

        console.log('🔍 Making getChatHistory API call:');
        console.log('URL:', historyUrl);
        console.log('Headers:', JSON.stringify(headers, null, 2));

        try {
            const response = await fetch(historyUrl, {
                method: 'GET',
                headers: headers
            });

            const data = await response.json();
            console.log('✅ getChatHistory Response:', JSON.stringify(data, null, 2));

            const formattedData = formatChatHistory(data.messages, startMessageId);
            console.log('📝 Formatted chat history:', JSON.stringify(formattedData, null, 2));
            return formattedData;
        } catch (error) {
            console.error('❌ Error getting chat history:', error);
            throw error;
        }
    }

    function formatChatHistory(messages, startMessageId) {
        // First sort all messages by creation time in ascending order (oldest to newest)
        const sortedMessages = messages.sort((a, b) =>
            new Date(a.created_at) - new Date(b.created_at)
        );

        // Find the index of the start message in the sorted array
        const startIndex = sortedMessages.findIndex(msg => msg.uuid === startMessageId);

        // If start message is found, slice from that point onwards
        // If not found, return all messages
        const relevantMessages = startIndex !== -1 ?
            sortedMessages.slice(startIndex) : sortedMessages;

        // Format messages into the desired structure
        return relevantMessages.map(msg => ({
            timestamp: msg.created_at,
            sender: msg.user_id === 0 ? 'Agent' : 'User',
            type: msg.type,
            content: msg.type === 'text' ? msg.data.text :
                    msg.type === 'image' ? `[Image: ${msg.data.file_uuid}]` :
                    msg.type === 'system' ? `[System: ${msg.data.text}]` :
                    JSON.stringify(msg.data),
            status: msg.status
        }));
    }

    async function processMultipleRequests(requestIds) {
        const allChats = [];
        const requests = requestIds.split('\n').filter(id => id.trim()); // Split by newline and remove empty lines

        for (const requestId of requests) {
            console.log(`Processing request ID: ${requestId.trim()}`);
            const result = await getOldestUuid(requestId.trim());
            if (result) {
                const chatHistory = await getChatHistory(result.chat_id, result.end_message_id, result.start_message_id);
                if (chatHistory) {
                    allChats.push({
                        requestId: requestId.trim(),
                        chatHistory
                    });
                }
            }
        }

        // Download all chats as a single JSON file
        if (allChats.length > 0) {
            const blob = new Blob([JSON.stringify(allChats, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chat_histories_${new Date().toISOString()}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    }

    async function extractChatHistory() {
        const requestIds = prompt("Enter request ID(s). For multiple IDs, enter one per line:");
        if (!requestIds) return;

        if (requestIds.includes('\n')) {
            await processMultipleRequests(requestIds);
        } else {
            // Original single request flow
            const requestId = requestIds.trim();
            console.log('🚀 Starting chat history extraction for request ID:', requestId);
            try {
                const result = await getOldestUuid(requestId);
                if (result) {
                    const chatHistory = await getChatHistory(result.chat_id, result.end_message_id, result.start_message_id);
                    console.log('💾 Downloading chat history...');
                    const jsonStr = JSON.stringify(chatHistory, null, 2);
                    const blob = new Blob([jsonStr], { type: 'application/json' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `chat_history_${new Date().toISOString()}.json`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    console.log('✨ Chat history extraction completed successfully!');
                }
            } catch (error) {
                console.error('❌ Error in chat history extraction:', error);
                alert('Error extracting chat history: ' + error.message);
            }
        }
    }

    // Add button to the page
    function addExtractButton() {
        const button = document.createElement('button');
        button.textContent = 'Extract Chat History';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', extractChatHistory);

        document.body.appendChild(button);
    }

    // Initialize the script
    window.addEventListener('load', () => {
        setupNetworkInterceptor();
        addExtractButton();
    });
})();
