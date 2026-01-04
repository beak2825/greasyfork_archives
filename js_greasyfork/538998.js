// ==UserScript==
// @name         Chat History Viewer for Twitch
// @namespace    https://github.com/TimFinitor/twitch-chat-history
// @version      1.0.1
// @description  Show user chat history with Alt+Click on usernames
// @author       TimFinitor
// @match        https://*.twitch.tv/*
// @icon         https://www.twitch.tv/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/538998/Chat%20History%20Viewer%20for%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/538998/Chat%20History%20Viewer%20for%20Twitch.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    const CONFIG = {
        enableLogging: false,
        maxHistoryEntries: 100,
        duplicateThresholdMs: 5000,
        captureEmotes: true,
        shortcutKey: 'alt',
        enableFFZIntegration: true
    };
    
    const log = (...args) => {
        if (CONFIG.enableLogging) {
            console.log('[Chat History]', ...args);
        }
    };
    
    const chatHistory = new Map();
    const interceptedSockets = new WeakSet();
    
    function interceptWebSocket() {
        const originalWebSocket = window.WebSocket;
    
        window.WebSocket = function(...args) {
            const ws = new originalWebSocket(...args);
    
            if (args[0] && (
                args[0].includes('pubsub-edge') ||
                args[0].includes('irc-ws') ||
                args[0].includes('chat')
            ) && !interceptedSockets.has(ws)) {
    
                interceptedSockets.add(ws);
                log('Intercepted WebSocket:', args[0]);
    
                const originalOnMessage = ws.onmessage;
                ws.onmessage = function(event) {
                    try {
                        if (args[0].includes('pubsub-edge')) {
                            handlePubSubMessage(event);
                        }
                        else if (args[0].includes('irc-ws') || args[0].includes('chat')) {
                            handleIRCMessage(event);
                        }
                    } catch (error) {
                        log('Message processing error (ignored):', error.message);
                    }
    
                    if (originalOnMessage) {
                        try {
                            originalOnMessage.call(this, event);
                        } catch (error) {
                            log('Original handler error (ignored):', error.message);
                        }
                    }
                };
    
                const originalOnError = ws.onerror;
                ws.onerror = function(error) {
                    log('WebSocket error (passing through):', error);
                    if (originalOnError) {
                        originalOnError.call(this, error);
                    }
                };
            }
    
            return ws;
        };
    
        Object.setPrototypeOf(window.WebSocket, originalWebSocket);
        Object.defineProperty(window.WebSocket, 'prototype', {
            value: originalWebSocket.prototype,
            writable: false
        });
    }
    
    function handlePubSubMessage(event) {
        try {
            const data = JSON.parse(event.data);
            if (data.data && data.data.message) {
                const messageData = JSON.parse(data.data.message);
                if (messageData.type === 'MESSAGE') {
                    processChatMessage(messageData);
                }
            }
        } catch (e) {
        }
    }
    
    function handleIRCMessage(event) {
        try {
            if (typeof event.data === 'string' && event.data.includes('PRIVMSG')) {
                processIRCMessage(event.data);
            }
        } catch (e) {
        }
    }
    
    function processIRCMessage(ircMessage) {
        try {
            const privmsgMatch = ircMessage.match(/^@([^:]*):([^!]+)[^:]*PRIVMSG #[^:]*:(.*)$/);
            if (!privmsgMatch) return;
    
            const [, tags, username, message] = privmsgMatch;
    
            const tagMap = {};
            if (tags) {
                tags.split(';').forEach(tag => {
                    const [key, value] = tag.split('=');
                    if (key) tagMap[key] = value || '';
                });
            }
    
            const displayName = tagMap['display-name'] || username;
            const color = tagMap.color || '#9147FF';
    
            addToHistory(username, {
                text: message.trim(),
                timestamp: Date.now(),
                color: color,
                displayName: displayName,
                badges: tagMap.badges || '',
                source: 'IRC'
            });
    
            log(`IRC Message from ${displayName}: ${message.trim()}`);
        } catch (error) {
            log('IRC parsing error (ignored):', error.message);
        }
    }
    
    function processChatMessage(messageData) {
        try {
            if (!messageData.data || !messageData.data.user_name) return;
    
            const username = messageData.data.user_name;
            const displayName = messageData.data.display_name || username;
            const message = messageData.data.body || '';
            const color = messageData.data.user_color || '#9147FF';
    
            addToHistory(username, {
                text: message,
                timestamp: Date.now(),
                color: color,
                displayName: displayName,
                source: 'PubSub'
            });
    
            log(`PubSub Message from ${displayName}: ${message}`);
        } catch (error) {
            log('PubSub parsing error (ignored):', error.message);
        }
    }
    
    function extractMessageWithEmotes(messageElement) {
        if (!messageElement || !CONFIG.captureEmotes) {
            return messageElement?.textContent?.trim() || '';
        }
    
        try {
            let messageText = '';
            const walker = document.createTreeWalker(
                messageElement,
                NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
                {
                    acceptNode: function(node) {
                        if (node.nodeType === Node.TEXT_NODE) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const tagName = node.tagName.toLowerCase();
                            const className = node.className || '';
    
                            if (tagName === 'img' ||
                                className.includes('emote') ||
                                className.includes('emoji') ||
                                node.hasAttribute('data-emote-name') ||
                                node.hasAttribute('alt')) {
                                return NodeFilter.FILTER_ACCEPT;
                            }
    
                            if (className.includes('seventv') ||
                                className.includes('bttv') ||
                                className.includes('ffz') ||
                                className.includes('chat-emote') ||
                                node.dataset.emoteName ||
                                node.title) {
                                return NodeFilter.FILTER_ACCEPT;
                            }
                        }
                        return NodeFilter.FILTER_SKIP;
                    }
                }
            );
    
            let node;
            while (node = walker.nextNode()) {
                if (node.nodeType === Node.TEXT_NODE) {
                    messageText += node.textContent;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const emoteName =
                        node.dataset.emoteName ||
                        node.getAttribute('data-emote-name') ||
                        node.getAttribute('alt') ||
                        node.getAttribute('title') ||
                        node.textContent?.trim();
    
                    if (emoteName && emoteName.length > 0 && emoteName.length < 50) {
                        messageText += emoteName;
                    } else {
                        messageText += node.textContent || '';
                    }
                }
            }
    
            return messageText.trim();
        } catch (error) {
            log('Emote extraction error, falling back to text:', error.message);
            return messageElement.textContent?.trim() || '';
        }
    }
    
    function setupDOMObserver() {
        let observerSetup = false;
    
        function trySetupObserver() {
            const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-list, [data-test-selector="chat-scrollable-area__message-container"]');
    
            if (!chatContainer && !observerSetup) {
                setTimeout(trySetupObserver, 1000);
                return;
            }
    
            if (observerSetup) return;
            observerSetup = true;
    
            log('Setting up DOM observer for chat messages');
    
            const observer = new MutationObserver((mutations) => {
                try {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                extractAndProcessMessage(node);
                                addClickHandlers(node);
                            }
                        });
                    });
                } catch (error) {
                    log('DOM observer error (ignored):', error.message);
                }
            });
    
            if (chatContainer) {
                observer.observe(chatContainer, { childList: true, subtree: true });
    
                try {
                    const existingMessages = chatContainer.querySelectorAll('[data-test-selector="chat-line-message"], .chat-line__message');
                    existingMessages.forEach(msg => {
                        extractAndProcessMessage(msg);
                        addClickHandlers(msg);
                    });
                } catch (error) {
                    log('Processing existing messages error (ignored):', error.message);
                }
            }
    
            const docObserver = new MutationObserver(() => {
                try {
                    if (!document.querySelector('.chat-history-handlers-added')) {
                        addClickHandlersToAllMessages();
                    }
                } catch (error) {
                    log('Document observer error (ignored):', error.message);
                }
            });
    
            docObserver.observe(document.body, { childList: true, subtree: true });
        }
    
        trySetupObserver();
    }
    
    function setupGlobalClickHandler() {
        document.addEventListener('click', (e) => {
            if (isFeatureDisabledInFFZ()) return;

            if (!checkShortcut(e)) return;

            let target = e.target;
            let attempts = 0;

            while (target && attempts < 5) {
                const username = extractUsernameFromElement(target);
                if (username && username.length > 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    showUserHistory(username, target);
                    return;
                }

                const isUsernameElement = target.className && (
                    target.className.includes('username') ||
                    target.className.includes('author') ||
                    target.className.includes('name') ||
                    target.className.includes('seventv') ||
                    target.className.includes('bttv') ||
                    target.className.includes('ffz')
                ) || target.getAttribute('data-username') ||
                   (target.tagName === 'SPAN' && target.style.color &&
                    target.textContent && target.textContent.trim().length < 30 &&
                    !target.textContent.includes(' '));

                if (isUsernameElement) {
                    const username = extractUsernameFromElement(target);
                    if (username) {
                        e.preventDefault();
                        e.stopPropagation();
                        showUserHistory(username, target);
                        return;
                    }
                }

                target = target.parentElement;
                attempts++;
            }
        }, true);
    }
    
    function extractAndProcessMessage(element) {
        try {
            if (!element.querySelector) return;
    
            let usernameEl = element.querySelector('[data-test-selector="chat-author-name"]') ||
                             element.querySelector('.chatAuthor, .chat-author') ||
                             element.querySelector('[class*="author"]') ||
                             element.querySelector('span[style*="color"]:first-child');
    
            let messageEl = element.querySelector('[data-test-selector="chat-line-message-body"]') ||
                            element.querySelector('.message, .chat-line__message-body') ||
                            element.querySelector('[class*="message-body"]') ||
                            element.querySelector('[class*="message"]');
    
            if (!usernameEl || !messageEl) {
                const textContent = element.textContent || '';
                const messageMatch = textContent.match(/^([^:]+):\s*(.+)$/);
                if (messageMatch) {
                    const [, username, message] = messageMatch;
                    if (username && message && username.length < 30) {
                        addToHistory(username.trim(), {
                            text: message.trim(),
                            timestamp: Date.now(),
                            color: '#9147FF',
                            displayName: username.trim(),
                            source: 'DOM-fallback'
                        });
                        log(`Extracted from text: ${username.trim()}: ${message.trim()}`);
                    }
                }
                return;
            }
    
            const username = usernameEl.textContent.trim();
    
            const messageText = extractMessageWithEmotes(messageEl);
    
            if (!username || !messageText) return;
    
            let color = '#9147FF';
            const coloredEl = usernameEl.closest('[style*="color"]') || usernameEl;
            if (coloredEl.style.color) {
                color = coloredEl.style.color;
            }
    
            addToHistory(username, {
                text: messageText,
                timestamp: Date.now(),
                color: color,
                displayName: username,
                source: 'DOM-enhanced'
            });
    
            log(`DOM extracted (enhanced): ${username}: ${messageText}`);
        } catch (error) {
            log('Message extraction error (ignored):', error.message);
        }
    }
    
    function addToHistory(username, messageData) {
        try {
            if (!username || !messageData.text) return;
    
            const lowerUsername = username.toLowerCase();
    
            if (!chatHistory.has(lowerUsername)) {
                chatHistory.set(lowerUsername, []);
            }
    
            const userHistory = chatHistory.get(lowerUsername);
    
            const now = Date.now();
            const isDuplicate = userHistory.some(existingMsg =>
                existingMsg.text === messageData.text &&
                Math.abs(existingMsg.timestamp - now) < CONFIG.duplicateThresholdMs
            );
    
            if (isDuplicate) {
                log(`Duplicate message ignored for ${username}: ${messageData.text}`);
                return;
            }
    
            userHistory.push(messageData);
    
            if (userHistory.length > CONFIG.maxHistoryEntries) {
                userHistory.shift();
            }
    
            log(`Added message for ${username} (${userHistory.length} total): ${messageData.text}`);

            const modal = document.getElementById('chat-history-modal');
            if (modal && modal.style.display === 'block' && modal.dataset.currentUser === lowerUsername) {
                const content = document.getElementById('history-content');
                const noMessagesNode = content.querySelector('div[style*="text-align: center"]');
                if (noMessagesNode) {
                    content.innerHTML = '';
                }

                content.insertAdjacentHTML('afterbegin', createMessageHTML(messageData, true));

                const messagesToShow = 50;
                while (content.children.length > messagesToShow) {
                    content.removeChild(content.lastElementChild);
                }
            }
        } catch (error) {
            log('History storage error (ignored):', error.message);
        }
    }
    
    function createMessageHTML(msg, isNew = false) {
        const time = new Date(msg.timestamp).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    
        const messageText = escapeHtml(msg.text || '[Empty Message]');
        const entryClass = isNew ? 'chat-message new-entry' : 'chat-message';
        
        return `
            <div class="${entryClass}">
                <div class="message-content">
                    <div class="message-text">${messageText}</div>
                    <div class="message-timestamp">${time}</div>
                </div>
            </div>
        `;
    }
    
    function addClickHandlersToAllMessages() {
        try {
            const messages = document.querySelectorAll('[data-test-selector="chat-line-message"], .chat-line__message');
            messages.forEach(addClickHandlers);
    
            document.body.classList.add('chat-history-handlers-added');
        } catch (error) {
            log('Adding click handlers error (ignored):', error.message);
        }
    }
    
    function addClickHandlers(messageElement) {
        try {
            if (!messageElement.querySelector) return;
    
            const usernameElements = messageElement.querySelectorAll(`
                [data-test-selector="chat-author-name"],
                .chatAuthor, .chat-author,
                [class*="author"],
                [class*="username"],
                [class*="name"],
                .seventv-chat-username,
                .bttv-username,
                .ffz-username,
                [data-username],
                [title*="@"],
                span[style*="color"]:first-of-type,
                a[href*="/"]:first-of-type
            `);
    
            const additionalElements = messageElement.querySelectorAll('span, a, div');
            additionalElements.forEach(el => {
                const text = el.textContent?.trim();
                const isUsernameLink = el.href && el.href.includes('twitch.tv/');
                const hasUsernameClass = el.className && (
                    el.className.includes('username') ||
                    el.className.includes('author') ||
                    el.className.includes('name')
                );
                const isFirstColoredSpan = el.tagName === 'SPAN' &&
                                         el.style.color &&
                                         el.parentElement?.firstElementChild === el;
    
                if ((isUsernameLink || hasUsernameClass || isFirstColoredSpan) &&
                    text && text.length < 30 && !text.includes(' ')) {
                    if (!Array.from(usernameElements).includes(el)) {
                        usernameElements.push ? usernameElements.push(el) : null;
                    }
                }
            });
    
            const elementsArray = Array.from(usernameElements);
    
            elementsArray.forEach(usernameEl => {
                if (usernameEl.dataset.historyHandlerAdded) return;
    
                usernameEl.style.cursor = 'pointer';
                const shortcutText = CONFIG.shortcutKey.charAt(0).toUpperCase() + CONFIG.shortcutKey.slice(1);
                usernameEl.title = `${shortcutText} + Click for history`;
    
                usernameEl.addEventListener('click', (e) => {
                    if (checkShortcut(e)) {
                        e.preventDefault();
                        e.stopPropagation();
    
                        let username = extractUsernameFromElement(usernameEl);
                        if (username) {
                            showUserHistory(username, usernameEl);
                        }
                    }
                });
    
                usernameEl.dataset.historyHandlerAdded = 'true';
            });
        } catch (error) {
            log('Click handler error (ignored):', error.message);
        }
    }
    
    function createHistoryModal() {
        if (document.getElementById('chat-history-modal')) return;

        const modalHTML = `
            <div id="chat-history-modal" style="display: none; position: fixed; z-index: 9999; background: #111; width: 320px; border-radius: 6px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); overflow: hidden; resize: both;">
                <div id="modal-header" style="padding: 10px 12px; background: #222; color: white; cursor: move; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333;">
                    <h3 id="history-modal-title" style="margin: 0; font-size: 14px; font-weight: normal; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"></h3>
                    <button id="close-history-modal" style="background: transparent; border: none; color: #aaa; font-size: 16px; cursor: pointer; padding: 0; line-height: 1; transition: color 0.2s;">&times;</button>
                </div>
                <div id="history-content" style="padding: 8px; max-height: 320px; overflow-y: auto; background: #111; color: #eee;">
                    <p style="text-align: center; color: #777;">Loading...</p>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const closeButton = document.getElementById('close-history-modal');
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.color = '#fff';
        });
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.color = '#aaa';
        });
        
        closeButton.addEventListener('click', () => {
            document.getElementById('chat-history-modal').style.display = 'none';
        });

        const modal = document.getElementById('chat-history-modal');
        const header = document.getElementById('modal-header');
        
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - modal.getBoundingClientRect().left;
            offsetY = e.clientY - modal.getBoundingClientRect().top;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            modal.style.left = `${x}px`;
            modal.style.top = `${y}px`;
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        const historyContent = document.getElementById('history-content');
        historyContent.style.scrollbarWidth = 'thin';
        historyContent.style.scrollbarColor = '#444 #222';
    }
    
    function showUserHistory(username, clickedElement) {
        try {
            if (window.FrankerFaceZ && 
                window.FrankerFaceZ.get && 
                window.FrankerFaceZ.get().resolve && 
                window.FrankerFaceZ.get().resolve('site.chat') &&
                window.FrankerFaceZ.get().resolve('site.chat').settings &&
                window.FrankerFaceZ.get().resolve('site.chat').settings.get('chat_history.enabled') === false) {
                return;
            }

            const modal = document.getElementById('chat-history-modal');
            if (!modal) {
                createHistoryModal();
                setTimeout(() => showUserHistory(username, clickedElement), 100);
                return;
            }

            modal.dataset.currentUser = username.toLowerCase();

            const title = document.getElementById('history-modal-title');
            const content = document.getElementById('history-content');

            title.textContent = `${username} chat history`;

            const userHistory = chatHistory.get(username.toLowerCase()) || [];

            log(`Showing history for ${username}: ${userHistory.length} messages`);

            if (userHistory.length === 0) {
                content.innerHTML = `
                    <div style="text-align: center; padding: 30px 10px;">
                        <p style="color: #777; margin: 0;">No messages yet</p>
                    </div>
                `;
            } else {
                const messagesToShow = Math.min(50, userHistory.length);
        
                const messagesHTML = userHistory
                    .slice(-messagesToShow)
                    .reverse()
                    .map(msg => createMessageHTML(msg))
                    .join('');
        
                content.innerHTML = messagesHTML;
            }

            if (clickedElement && clickedElement.getBoundingClientRect) {
                const rect = clickedElement.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const modalWidth = 320;
                
                if (rect.right + modalWidth + 10 < viewportWidth) {
                    modal.style.left = `${rect.right + 10}px`;
                } else {
                    modal.style.left = `${Math.max(10, rect.left - modalWidth - 10)}px`;
                }
                
                modal.style.top = `${rect.top}px`;
            } else {
                modal.style.left = '20px';
                modal.style.top = '100px';
            }

            modal.style.display = 'block';
            content.scrollTop = 0;
        } catch (error) {
            log('Show history error:', error.message);
        }
    }
    
    function showUsernamePrompt() {
        try {
            const username = prompt('Enter username for Chat History:');
            if (username && username.trim()) {
                showUserHistory(username.trim());
            }
        } catch (error) {
            log('Username prompt error:', error.message);
        }
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
    
    function checkShortcut(event) {
        if (isFeatureDisabledInFFZ()) return false;
        
        switch (CONFIG.shortcutKey) {
            case 'ctrl': return event.ctrlKey;
            case 'shift': return event.shiftKey;
            case 'alt':
            default: return event.altKey;
        }
    }
    
    function isFeatureDisabledInFFZ() {
        return window.FrankerFaceZ && 
               window.FrankerFaceZ.get && 
               window.FrankerFaceZ.get().resolve && 
               window.FrankerFaceZ.get().resolve('site.chat') &&
               window.FrankerFaceZ.get().resolve('site.chat').settings &&
               window.FrankerFaceZ.get().resolve('site.chat').settings.get('chat_history.enabled') === false;
    }
    
    function extractUsernameFromElement(element) {
        try {
            let username = element.textContent?.trim();

            if (!username || username.length === 0) {
                username = element.getAttribute('data-username') ||
                          element.getAttribute('title')?.replace('@', '') ||
                          element.getAttribute('alt') ||
                          element.href?.split('/').pop();
            }

            if (username) {
                username = username.replace(/^@/, '');
                username = username.replace(/[:,\s].*$/, '');

                if (username.length > 0 && username.length <= 25 &&
                    /^[a-zA-Z0-9_]+$/.test(username)) {
                    return username;
                }
            }

            let parent = element.parentElement;
            let attempts = 0;
            while (parent && attempts < 3) {
                const parentText = parent.textContent?.trim();
                if (parentText) {
                    const match = parentText.match(/^([a-zA-Z0-9_]{1,25}):/);
                    if (match) {
                        return match[1];
                    }
                }
                parent = parent.parentElement;
                attempts++;
            }

            return null;
        } catch (error) {
            log('Username extraction error:', error.message);
            return element.textContent?.trim() || null;
        }
    }
    
    function updateTooltips() {
        const shortcutText = CONFIG.shortcutKey.charAt(0).toUpperCase() + CONFIG.shortcutKey.slice(1);
        document.querySelectorAll('[data-history-handler-added="true"]').forEach(el => {
            el.title = `${shortcutText} + Click for history`;
        });
    }
    
    function setupFFZIntegration() {
        if (!CONFIG.enableFFZIntegration) return;

        const checkFFZ = setInterval(() => {
            if (window.FrankerFaceZ) {
                clearInterval(checkFFZ);
                try {
                    const ffz = window.FrankerFaceZ.get();
                    if (!ffz || !ffz.resolve || !ffz.resolve('site.chat')) {
                        log('FrankerFaceZ chat module not found');
                        return;
                    }

                    const chatModule = ffz.resolve('site.chat');

                    if (chatModule.settings.get('chat_history.enabled') !== undefined) {
                        log('FFZ settings already registered');
                        syncFFZSettingsToConfig(chatModule);
                        return;
                    }

                    chatModule.settings.add('chat_history.enabled', {
                        default: true,
                        ui: {
                            path: 'Chat > Behavior >> Chat History',
                            title: 'Enable Chat History',
                            description: 'Show user chat history with configurable shortcuts',
                            component: 'setting-check-box'
                        },
                        changed: (val) => {
                            if (!val) {
                                if (document.getElementById('chat-history-modal')) {
                                    document.getElementById('chat-history-modal').style.display = 'none';
                                }
                            }
                        }
                    });

                    chatModule.settings.add('chat_history.shortcut', {
                        default: CONFIG.shortcutKey,
                        ui: {
                            path: 'Chat > Behavior >> Chat History',
                            title: 'History Shortcut Key',
                            description: 'Key to hold while clicking username',
                            component: 'setting-select-box',
                            data: [
                                { value: 'alt', title: 'Alt + Click' },
                                { value: 'ctrl', title: 'Ctrl + Click' },
                                { value: 'shift', title: 'Shift + Click' }
                            ]
                        },
                        changed: (val) => {
                            CONFIG.shortcutKey = val;
                            updateTooltips();
                        }
                    });

                    chatModule.settings.add('chat_history.max_entries', {
                        default: CONFIG.maxHistoryEntries,
                        ui: {
                            path: 'Chat > Behavior >> Chat History',
                            title: 'Maximum History Size',
                            description: 'Maximum number of messages to store per user',
                            component: 'setting-select-box',
                            data: [
                                { value: 50, title: '50 messages' },
                                { value: 100, title: '100 messages' },
                                { value: 200, title: '200 messages' },
                                { value: 300, title: '300 messages' }
                            ]
                        },
                        changed: (val) => {
                            CONFIG.maxHistoryEntries = val;
                            for (const [username, history] of chatHistory.entries()) {
                                if (history.length > CONFIG.maxHistoryEntries) {
                                    chatHistory.set(username, history.slice(-CONFIG.maxHistoryEntries));
                                }
                            }
                        }
                    });

                    syncFFZSettingsToConfig(chatModule);
                    
                    log('✅ FFZ integration enabled');
                } catch (error) {
                    log('FFZ integration error:', error.message);
                }
            }
        }, 1000);

        setTimeout(() => clearInterval(checkFFZ), 30000);
    }
    
    function syncFFZSettingsToConfig(chatModule) {
        try {
            if (chatModule && chatModule.settings) {
                const shortcutKey = chatModule.settings.get('chat_history.shortcut');
                const maxEntries = chatModule.settings.get('chat_history.max_entries');
                
                if (shortcutKey !== undefined) CONFIG.shortcutKey = shortcutKey;
                if (maxEntries !== undefined) CONFIG.maxHistoryEntries = maxEntries;
                
                log('Synced FFZ settings to CONFIG');
            }
        } catch (error) {
            log('Error syncing FFZ settings:', error.message);
        }
    }
    
    document.addEventListener('keydown', (e) => {
        try {
            if (e.ctrlKey && e.key === 'h') {
                e.preventDefault();
                showUsernamePrompt();
            }
        } catch (error) {
            log('Keyboard shortcut error:', error.message);
        }
    });
    
    function injectModalStyles() {
        const css = `
            #chat-history-modal .chat-message {
                margin-bottom: 6px;
                padding: 8px;
                background: #181818;
                border-radius: 4px;
                transition: background-color 0.2s ease;
            }
            #chat-history-modal .chat-message:hover {
                background-color: #222;
            }
            #chat-history-modal .message-content {
                display: flex;
                align-items: center;
            }
            #chat-history-modal .message-text {
                flex: 1;
                color: #ddd;
                line-height: 1.4;
                word-wrap: break-word;
                font-size: 13px;
            }
            #chat-history-modal .message-timestamp {
                margin-left: 8px;
                font-size: 11px;
                color: #666;
                white-space: nowrap;
            }
            #chat-history-modal .chat-message.new-entry {
                animation: fadeInHighlight 1.5s ease-out forwards;
            }
            @keyframes fadeInHighlight {
                0% {
                    opacity: 0;
                    transform: translateY(-10px);
                    background-color: #31313c;
                }
                30% {
                    opacity: 1;
                    transform: translateY(0);
                    background-color: #31313c;
                }
                100% {
                    background-color: #181818;
                }
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    function init() {
        try {
            log('🚀 Chat History Viewer starting...');
            injectModalStyles();
            setTimeout(createHistoryModal, 500);
            setTimeout(interceptWebSocket, 1000);
            setTimeout(setupDOMObserver, 1500);
            setTimeout(addClickHandlersToAllMessages, 3000);
            setTimeout(setupGlobalClickHandler, 2000);
            setTimeout(setupFFZIntegration, 4000);
            
            log('✅ Chat History Viewer initialized');
        } catch (error) {
            log('Initialization error:', error.message);
        }
    }
    
    let currentUrl = location.href;
    const navObserver = new MutationObserver(() => {
        try {
            if (currentUrl !== location.href) {
                currentUrl = location.href;
                log('📍 Page navigation detected, reinitializing...');
                setTimeout(() => {
                    setupDOMObserver();
                    addClickHandlersToAllMessages();
                }, 2000);
            }
        } catch (error) {
            log('Navigation observer error:', error.message);
        }
    });
    
    navObserver.observe(document, { subtree: true, childList: true });
    
    init();
})();
