// ==UserScript==
// @name         Discord Chat Exporter - Auto-Scroll with Date Filter & HTML Export (v2.1 - Includes Replies)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Passively captures chat messages on load, including replies. User can input a start date, then auto-scrolls Discord chat to capture older messages, exporting them as HTML.
// @author       Kumara
// @match        *://*.discord.com/*
// @match        *://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539261/Discord%20Chat%20Exporter%20-%20Auto-Scroll%20with%20Date%20Filter%20%20HTML%20Export%20%28v21%20-%20Includes%20Replies%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539261/Discord%20Chat%20Exporter%20-%20Auto-Scroll%20with%20Date%20Filter%20%20HTML%20Export%20%28v21%20-%20Includes%20Replies%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Discord Chat Exporter] Script loaded. Version 2.1 (Includes Replies).');

    // --- Configuration ---
    const LOG_TO_CONSOLE = true;
    const HTML_FILENAME_PREFIX = 'discord_chat_';
    const MAX_MESSAGES_TO_EXPORT = 100000;
    const UI_BUTTON_ID = 'tampermonkey-export-button';
    const SCROLL_DELAY_MS = 2500;
    const MAX_SCROLL_ATTEMPTS = 200;
    const API_MESSAGES_URL_REGEX = /api\/v\d+\/channels\/(\d+)\/messages/;
    const URL_CHANNEL_PATH_REGEX = /^\/channels\/\d+\/(\d+)$/;
    const CHAT_SCROLL_ELEMENT_SELECTOR = 'div[class*="scroller_"][role="group"][data-jump-section="global"]';

    // --- Global State ---
    let isAutoScrolling = false;
    let startDateFilter = null;
    let accumulatedMessages = new Map();
    let currentChannelId = null;

    // --- Utility Functions ---
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function getOldestAccumulatedMessage() {
        if (accumulatedMessages.size === 0) return null;
        let oldest = null;
        for (const msg of accumulatedMessages.values()) {
            if (!oldest || new Date(msg.timestamp).getTime() < new Date(oldest.timestamp).getTime()) {
                oldest = msg;
            }
        }
        return oldest;
    }

    function escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function resetState() {
        isAutoScrolling = false;
        startDateFilter = null;
        // Do NOT clear accumulatedMessages here, allow user to start another export from the same collection
        currentChannelId = null;
        const button = document.getElementById(UI_BUTTON_ID);
        if (button) {
            button.textContent = 'Start Auto-Export Chat';
            button.style.backgroundColor = '#7289da';
        }
        console.log('[Discord Chat Exporter] State reset for new export.');
    }

    // --- HTML Formatting and Download ---
    function formatDiscordMessages(messagesArray, channelId) {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Discord Chat Export - Channel ${channelId}</title>
                <style>
                    body { font-family: sans-serif; background-color: #36393f; color: #dcddde; margin: 20px; }
                    .chat-container { max-width: 800px; margin: 0 auto; background-color: #303136; padding: 15px; border-radius: 8px; }
                    h1, p { text-align: center; }
                    hr { border-color: #2a2c30; margin: 20px 0; }
                    .message { margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #2a2c30; }
                    .message:last-child { border-bottom: none; }
                    .message-header { display: flex; align-items: center; margin-bottom: 5px; }
                    .avatar { width: 32px; height: 32px; border-radius: 50%; margin-right: 10px; }
                    .author-name { color: #fff; font-weight: bold; margin-right: 8px; }
                    .timestamp { font-size: 0.8em; color: #72767d; }
                    .message-content { line-height: 1.5; word-wrap: break-word; }
                    .referenced-message { margin-bottom: 8px; padding: 8px; background-color: #2a2c30; border-radius: 4px; border-left: 2px solid #7289da; display: flex; align-items: center; font-size: 0.9em; }
                    .referenced-content { opacity: 0.8; font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                    .attachment-link { display: block; margin-top: 5px; color: #00b0f4; text-decoration: none; }
                    .attachment-link:hover { text-decoration: underline; }
                    .embed { background-color: #2f3136; border-left: 4px solid #7289da; padding: 10px; margin-top: 10px; border-radius: 4px; }
                    .code-block { background-color: #2f3136; padding: 8px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; word-break: break-all; overflow-x: auto;}
                </style>
            </head>
            <body>
                <div class="chat-container">
                    <h1>Discord Chat Export</h1>
                    <p>Channel ID: ${channelId}</p>
                    <p>Exported from: ${startDateFilter ? startDateFilter.toLocaleDateString() : 'Beginning'} to ${new Date().toLocaleDateString('en-HK')} (HKT)</p>
                    <p>Total messages: ${messagesArray.length}</p>
                    <hr>
        `;

        const sortedMessages = messagesArray.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const messagesToExport = sortedMessages.slice(0, MAX_MESSAGES_TO_EXPORT);

        if (messagesToExport.length === 0) {
            html += `<p style="text-align: center; color: #72767d;">No messages to display in this capture for the selected date range.</p>`;
        } else if (messagesToExport.length < sortedMessages.length) {
            html += `<p style="text-align: center; color: #f04747;">Warning: Displaying only the first ${MAX_MESSAGES_TO_EXPORT} messages. Increase 'MAX_MESSAGES_TO_EXPORT' in script config for more.</p>`;
        }

        messagesToExport.forEach(msg => {
            const author = msg.author || {};
            const username = author.username || 'Unknown User';
            const discriminator = author.discriminator && author.discriminator !== "0" ? `#${author.discriminator}` : "";
            const globalName = author.global_name ? ` (${author.global_name})` : '';
            const avatarUrl = author.avatar ? `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png?size=32` : 'https://discord.com/assets/f7e02ad661a37c152a259b3602195f32.svg';
            const timestamp = msg.timestamp ? new Date(msg.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' }) : 'N/A';
            let content = msg.content || '';

            content = escapeHTML(content);
            content = content.replace(/```(\w+)?\n([\s\S]+?)\n```/g, '<pre class="code-block"><code>$2</code></pre>');
            content = content.replace(/`(.*?)`/g, '<code>$1</code>');
            content = content.replace(/&lt;@!?(\d+)&gt;/g, '<span style="color:#7289da;">@User($1)</span>');
            content = content.replace(/&lt;#(\d+)&gt;/g, '<span style="color:#7289da;">#Channel($1)</span>');
            content = content.replace(/&lt;@&amp;(\d+)&gt;/g, '<span style="color:#7289da;">@Role($1)</span>');

            html += `<div class="message">`;

            // --- ADDED: Display referenced message (reply) ---
            if (msg.referenced_message) {
                const refAuthor = msg.referenced_message.author || {};
                const refUsername = refAuthor.username || 'Original author not available';
                const refAvatarUrl = refAuthor.avatar ? `https://cdn.discordapp.com/avatars/${refAuthor.id}/${refAuthor.avatar}.png?size=32` : 'https://discord.com/assets/f7e02ad661a37c152a259b3602195f32.svg';
                const refContentSnippet = escapeHTML(msg.referenced_message.content || '...').substring(0, 100);

                html += `
                    <div class="referenced-message">
                        <img class="avatar" src="${refAvatarUrl}" alt="${refUsername} avatar" style="width:16px; height:16px; margin-right:5px;">
                        <span class="author-name" style="font-size:0.9em;">${refUsername}</span>
                        <div class="referenced-content">${refContentSnippet}</div>
                    </div>
                `;
            }

            html += `
                    <div class="message-header">
                        <img class="avatar" src="${avatarUrl}" alt="${username} avatar">
                        <span class="author-name">${username}${discriminator}${globalName}</span>
                        <span class="timestamp">${timestamp}</span>
                    </div>
                    <div class="message-content">${content.replace(/\n/g, '<br>')}</div>
            `;

            if (msg.attachments && msg.attachments.length > 0) {
                msg.attachments.forEach(att => {
                    html += `<a class="attachment-link" href="${att.url}" target="_blank">Attachment: ${att.filename} (${(att.size / 1024 / 1024).toFixed(2)} MB)</a>`;
                });
            }

            if (msg.embeds && msg.embeds.length > 0) {
                msg.embeds.forEach(embed => {
                    html += `<div class="embed"><strong>Embed:</strong> ${embed.title || ''} - ${embed.description || ''} <a href="${embed.url || '#'}" target="_blank">Link</a></div>`;
                });
            }
            html += `</div>`; // Close .message
        });

        html += `
                </div>
            </body>
            </html>
        `;
        return html;
    }

    function downloadHtmlFile(htmlContent, filename) {
        try {
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error('[Discord Chat Exporter] Error downloading HTML file:', e);
            alert('Error exporting chat.');
        }
    }

    async function exportCollectedMessages() {
        const channelIdForExport = currentChannelId || 'unknown_channel';
        const messagesToExportArray = [...accumulatedMessages.values()];
        const htmlContent = formatDiscordMessages(messagesToExportArray, channelIdForExport);
        const dateStamp = new Date().toISOString().split('T')[0];
        const filename = `${HTML_FILENAME_PREFIX}${channelIdForExport}_${dateStamp}.html`;
        downloadHtmlFile(htmlContent, filename);
        resetState();
    }

    // --- Main UI and Logic ---
    function injectUI() {
        if (document.getElementById(UI_BUTTON_ID)) return;
        const button = document.createElement('button');
        button.id = UI_BUTTON_ID;
        button.textContent = 'Start Auto-Export Chat';
        Object.assign(button.style, {
            position: 'fixed', bottom: '20px', right: '20px', zIndex: '99999',
            backgroundColor: '#7289da', color: 'white', border: 'none',
            padding: '10px 15px', borderRadius: '5px', cursor: 'pointer',
            fontSize: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
        });
        button.addEventListener('click', handleExportButtonClick);
        document.body.appendChild(button);
    }

    async function handleExportButtonClick() {
        const button = document.getElementById(UI_BUTTON_ID);
        if (!button) return;

        if (!isAutoScrolling) {
            const dateInput = prompt('Enter start date for export (YYYY-MM-DD).\n\n' +
                                     'The script will scroll backwards to fetch messages from your current view.\n' +
                                     'Make sure you are in the correct channel before starting!');
            if (!dateInput) return alert('Export cancelled.');

            const parsedDate = new Date(dateInput);
            if (isNaN(parsedDate.getTime()) || parsedDate.getFullYear() < 2015) {
                return alert('Invalid date format. Please use प्रदीप-MM-DD (e.g., 2023-01-15).');
            }

            startDateFilter = parsedDate;
            isAutoScrolling = true;

            const urlMatch = window.location.pathname.match(URL_CHANNEL_PATH_REGEX);
            if (urlMatch && urlMatch[1]) {
                currentChannelId = urlMatch[1];
                button.textContent = `Scrolling... (${accumulatedMessages.size})`;
                button.style.backgroundColor = '#e74c3c';
                startAutoScroll();
            } else {
                button.textContent = `Finding Channel...`;
                button.style.backgroundColor = '#f39c12';
                alert('Could not find channel ID. Auto-scrolling will start once a message API call is detected.');
            }
        } else {
            isAutoScrolling = false;
            button.textContent = 'Processing...';
            button.style.backgroundColor = '#f39c12';

            const totalMessages = accumulatedMessages.size;
            if (totalMessages === 0) {
                alert('No messages were captured.');
                resetState();
                return;
            }
            await exportCollectedMessages();
            alert(`Export complete! Downloaded ${totalMessages} messages.`);
        }
    }

    async function startAutoScroll() {
        if (!currentChannelId || !startDateFilter || !isAutoScrolling) {
            console.log('[Exporter] Auto-scroll conditions not met. Aborting.');
            return;
        }

        const chatElement = document.querySelector(CHAT_SCROLL_ELEMENT_SELECTOR);
        if (!chatElement) {
            alert('CRITICAL ERROR: Could not find the Discord chat scroll area. The script cannot continue. This is likely because of a Discord UI update. Please check the CHAT_SCROLL_ELEMENT_SELECTOR in the script.');
            resetState();
            return;
        }
        console.log('[Exporter] Found chat scroll element:', chatElement);

        let lastMessageCount = 0, scrollAttemptCount = 0, stopConditionMet = false;
        await sleep(SCROLL_DELAY_MS);

        while (isAutoScrolling && accumulatedMessages.size < MAX_MESSAGES_TO_EXPORT && !stopConditionMet) {
            scrollAttemptCount++;
            lastMessageCount = accumulatedMessages.size;

            console.log(`[Exporter DBG] Loop iteration ${scrollAttemptCount}. Scrolling to top...`);
            chatElement.scrollTo(0, 0); // Use .scrollTo() for robustness

            console.log(`[Exporter DBG] Waiting for ${SCROLL_DELAY_MS}ms for messages to load...`);
            await sleep(SCROLL_DELAY_MS);
            console.log(`[Exporter DBG] Wait finished. Current accumulated message count: ${accumulatedMessages.size}`);

            const oldestMessage = getOldestAccumulatedMessage();
            if (oldestMessage && new Date(oldestMessage.timestamp).getTime() < startDateFilter.getTime()) {
                console.log('[Exporter] Stop condition met: Reached desired start date.');
                stopConditionMet = true;
            } else if (accumulatedMessages.size === lastMessageCount && scrollAttemptCount > 5) {
                console.warn('[Exporter] Stop condition met: No new messages found after several attempts.');
                alert('Auto-scroll stopped: No new messages found. This may mean the start of the channel history was reached before the target date. Exporting collected messages.');
                stopConditionMet = true;
            } else if (scrollAttemptCount >= MAX_SCROLL_ATTEMPTS) {
                console.warn('[Exporter] Stop condition met: Reached max scroll attempts.');
                alert('Auto-scroll stopped: Reached max attempts. Exporting collected messages.');
                stopConditionMet = true;
            }

            if (stopConditionMet) {
                isAutoScrolling = false;
            } else {
                const button = document.getElementById(UI_BUTTON_ID);
                if (button) button.textContent = `Scrolling... (${accumulatedMessages.size})`;
            }
        }

        if (isAutoScrolling) { // If still true, it means max message limit was reached
            alert(`Auto-scroll stopped: Maximum message limit (${MAX_MESSAGES_TO_EXPORT}) collected.`);
        }
        await exportCollectedMessages();
    }


    // --- ROBUST NETWORK INTERCEPTION ---
    function processInterceptedResponse(responseText, url) {
        const match = url.match(API_MESSAGES_URL_REGEX);
        if (!match) return;

        // Part 1: Always collect messages passively
        try {
            const messages = JSON.parse(responseText);
            if (!Array.isArray(messages)) return;

            let newMessagesAdded = 0;
            messages.forEach(msg => {
                if (!accumulatedMessages.has(msg.id)) {
                    accumulatedMessages.set(msg.id, msg);
                    newMessagesAdded++;
                }
            });

            if (newMessagesAdded > 0 && LOG_TO_CONSOLE) {
                const status = isAutoScrolling ? "Active" : "Passive";
                console.log(`[Exporter][${status}] Added ${newMessagesAdded} new messages. Total: ${accumulatedMessages.size}`);
            }
        } catch (e) {
            console.error('[Exporter] Error parsing or adding messages:', e);
            return;
        }

        // Part 2: Active logic, only runs when auto-scrolling is enabled
        if (!isAutoScrolling || !startDateFilter) {
            return; // Not in active export mode, so we're done
        }

        const interceptedChannelId = match[1];

        if (currentChannelId === null) {
            currentChannelId = interceptedChannelId;
            console.log(`[Discord Chat Exporter] Channel ID (${currentChannelId}) set via interception. Starting scroll.`);
            const button = document.getElementById(UI_BUTTON_ID);
            if (button) button.textContent = `Scrolling... (${accumulatedMessages.size})`;
            startAutoScroll();
        } else if (currentChannelId !== interceptedChannelId) {
            console.warn(`Channel changed from ${currentChannelId} to ${interceptedChannelId}. Stopping.`);
            alert('Channel changed! Export process stopped.');
            isAutoScrolling = false;
            setTimeout(() => exportCollectedMessages(), 500);
        }
    }


    // Intercept Fetch
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        return originalFetch.apply(this, arguments).then(response => {
            const requestUrl = typeof url === 'string' ? url : url.url;
            if (String(requestUrl).match(API_MESSAGES_URL_REGEX)) {
                console.log(`[Exporter DBG] Intercepted Fetch: ${requestUrl}`);
                const clonedResponse = response.clone();
                clonedResponse.text().then(responseText => {
                    processInterceptedResponse(responseText, requestUrl);
                });
            }
            return response;
        });
    };

    // Intercept XMLHttpRequest
    const originalXHRopen = XMLHttpRequest.prototype.open;
    const originalXHRsend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalXHRopen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', function() {
            if (this._url && String(this._url).match(API_MESSAGES_URL_REGEX)) {
                console.log(`[Exporter DBG] Intercepted XHR Load: ${this._url}`);
                processInterceptedResponse(this.responseText, this._url);
            }
        });
        return originalXHRsend.apply(this, arguments);
    };


    // --- Initialize UI when Discord page loads ---
    const uiInjectorObserver = new MutationObserver((mutations, obs) => {
        if (document.querySelector('#app-mount')) {
            injectUI();
            obs.disconnect();
        }
    });
    uiInjectorObserver.observe(document.body, { childList: true, subtree: true });

})();
