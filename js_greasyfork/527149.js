// ==UserScript==
// @name         Download Full Chat History as HTML file
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Export entire chat history as an HTML file
// @author       Clawberry+ChatGPT
// @match        https://xoul.ai/*
// @grant        GM_xmlhttpRequest
// @connect      api.xoul.ai
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527149/Download%20Full%20Chat%20History%20as%20HTML%20file.user.js
// @updateURL https://update.greasyfork.org/scripts/527149/Download%20Full%20Chat%20History%20as%20HTML%20file.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement('button');
    button.innerText = 'Download full chat';
    button.style.position = 'fixed';
    button.style.bottom = '60px';
    button.style.right = '18px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = '#404040';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    button.addEventListener('click', async () => {
        const conversationId = window.location.pathname.split('/').pop();
        const detailsUrl = `https://api.xoul.ai/api/v1/conversation/details?conversation_id=${conversationId}`;

        try {
            const details = await fetchJson(detailsUrl);
            const assistantName = details.xouls?.[0]?.name || 'assistant';
            const userName = details.personas?.[0]?.name || 'user';

            let allMessages = [];
            let cursor = null;

            // Fetch all messages using cursor pagination
            do {
                const historyUrl = `https://api.xoul.ai/api/v1/chat/history?conversation_id=${conversationId}` + (cursor ? `&cursor=${cursor}` : '');
                const history = await fetchJson(historyUrl);
                if (history.length > 0) {
                    allMessages = allMessages.concat(history);
                    cursor = history[history.length - 1].id; // Set cursor to the last message's ID
                } else {
                    cursor = null;
                }
            } while (cursor);

            allMessages.reverse(); // Ensure chronological order

            const firstTimestamp = new Date(allMessages[0].timestamp);
            const formattedTimestamp = `${firstTimestamp.getFullYear()}-${String(firstTimestamp.getMonth() + 1).padStart(2, '0')}-${String(firstTimestamp.getDate()).padStart(2, '0')}_${String(firstTimestamp.getHours()).padStart(2, '0')}-${String(firstTimestamp.getMinutes()).padStart(2, '0')}-${String(firstTimestamp.getSeconds()).padStart(2, '0')}`;

            let chatHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Chat History</title>
                <style>
                    body { font-family: Roboto, sans-serif; background-color: #1e1e1e; color: #f5f5f5; padding: 20px; }
                    .chat-container { display: flex; flex-direction: column; gap: 10px; }
                    .chat-bubble { padding: 10px; border-radius: 10px; max-width: 60%; margin-bottom: 10px; line-height: 1.4; }
                    .assistant { background-color: #333; color: #fff; align-self: flex-start; }
                    .user { background-color: #555; color: #fff; align-self: flex-end; }
                    .timestamp { font-size: 0.8em; color: #aaa; }
                </style>
            </head>
            <body>
                <div class="chat-container">
            `;

            allMessages.forEach(entry => {
                const role = entry.role === 'assistant' ? assistantName : userName;
                const isAssistant = entry.role === 'assistant';
                const formattedContent = entry.content.replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n/g, '<br><br>');
                chatHtml += `
                <div class="chat-bubble ${isAssistant ? 'assistant' : 'user'}">
                    <strong>${role}</strong><br>
                    <span class="timestamp">${new Date(entry.timestamp).toLocaleString()}</span><br>
                    ${formattedContent}
                </div>
                `;
            });

            chatHtml += `
                </div>
            </body>
            </html>
            `;

            const filename = `${assistantName}_${formattedTimestamp}.html`;
            const blob = new Blob([chatHtml], { type: 'text/html' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        } catch (error) {
            alert('Error fetching chat history: ' + error.message);
        }
    });

    function fetchJson(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                responseType: 'json',
                onload: response => resolve(response.response),
                onerror: error => reject(error)
            });
        });
    }
})();
