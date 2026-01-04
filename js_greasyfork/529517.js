// ==UserScript==
// @name         DeepSeek - Chat title on tab title
// @namespace    http://tampermonkey.net/
// @version      2025-03-11
// @description  Chat title on tab title
// @author       jackiechan285
// @match        https://chat.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529517/DeepSeek%20-%20Chat%20title%20on%20tab%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/529517/DeepSeek%20-%20Chat%20title%20on%20tab%20title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class ChatTitleManager {
        constructor() {
            this.storage = new Map();
            this.currentChatId = null;
        }

        handleApiData(chatId, title) {
            if (!chatId || !title) return;

            this.storage.set(chatId, title);
            if (chatId === this.currentChatId) {
                this.updateTabTitle(title);
            }
        }

        setCurrentChat(chatId) {
            this.currentChatId = chatId;
            const cachedTitle = this.storage.get(chatId) || 'DeepSeek';
            this.updateTabTitle(cachedTitle);
        }

        updateTabTitle(title) {
            if (title && document.title !== title) {
                document.title = title;
            }
        }
    }

    const titleManager = new ChatTitleManager();

    function getChatIdFromPath() {
        const match = window.location.pathname.match(/\/chat\/[^/]+\/([^/]+)/);
        return match?.[1] || null;
    }

    function handleUrlChange() {
        titleManager.setCurrentChat(getChatIdFromPath());
    }

    function setupHistoryMonitoring() {
        const originalPushState = history.pushState.bind(history);
        const originalReplaceState = history.replaceState.bind(history);

        history.pushState = function(state, title, url) {
            originalPushState(state, title, url);
            window.dispatchEvent(new Event('urlchange'));
        };

        history.replaceState = function(state, title, url) {
            originalReplaceState(state, title, url);
            window.dispatchEvent(new Event('urlchange'));
        };

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('urlchange'));
        });

        window.addEventListener('urlchange', handleUrlChange);
    }

    function setupXHRInterceptor() {
        const originalSend = XMLHttpRequest.prototype.send;
        const originalOpen = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function(method, url) {
            this._method = method;
            this._requestUrl = url;
            return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function(data) {
            const xhr = this;
            const url = xhr._requestUrl;
            const method = xhr._method?.toUpperCase();

            if (method === 'POST' && url.includes('/api/v0/chat_session/update_title')) {
                try {
                    const payload = JSON.parse(data);
                    titleManager.handleApiData(payload?.chat_session_id, payload?.title);
                } catch (e) {}
            }

            xhr.addEventListener('readystatechange', function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        const bizData = response?.data?.biz_data;

                        if (url.includes('/api/v0/chat/history_messages')) {
                            titleManager.handleApiData(bizData?.chat_session?.id, bizData?.chat_session?.title);
                        }
                        else if (url.includes('/api/v0/chat_session/items')) {
                            const session = bizData?.chat_sessions?.[0];
                            titleManager.handleApiData(session?.chat_session_id, session?.item?.title);
                        }
                    } catch (e) {}
                }
            });

            return originalSend.apply(xhr, arguments);
        };
    }

    document.addEventListener('DOMContentLoaded', async function() {
        await new Promise(resolve => setTimeout(resolve, 10));
        handleUrlChange();
    });

    setupHistoryMonitoring();
    setupXHRInterceptor();
})();