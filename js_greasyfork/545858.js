// ==UserScript==
// @name         Claude AI with Date
// @namespace    http://tampermonkey.net/
// @version      3.2
// @license      MIT
// @description  Shows timestamps for Claude conversation messages
// @author       Baseline Claude Sonnet 4, enhanced by Baseline ChatGPT-5, debugged by Wayne L. "Grasshopper" Pendley's "Syntactico" persona, who is sourced from ChatGPT-4o
// @match        https://claude.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545858/Claude%20AI%20with%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/545858/Claude%20AI%20with%20Date.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const CONFIG = {
        messageSelector: '.group\\/conversation-turn, .font-claude-response, [data-testid="user-message"]',
        timestampClass: 'claude-timestamp',
        storageKey: 'claudeTimestamps',
        observerDelay: 750
    };

    let timestampData = new Map();

    // Load existing timestamp data
    function loadTimestampData() {
        try {
            const stored = localStorage.getItem(CONFIG.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                timestampData = new Map(Object.entries(parsed));
            }
        } catch (e) {
            console.warn('Failed to load timestamp data:', e);
        }
    }

    // Save timestamp data
    function saveTimestampData() {
        try {
            const obj = Object.fromEntries(timestampData);
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(obj));
        } catch (e) {
            console.warn('Failed to save timestamp data:', e);
        }
    }

    // Inject CSS styles with !important to override Claude's styles
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .${CONFIG.timestampClass} {
                font-size: 15px !important;
                color: #555 !important;
                opacity: 1 !important;
                margin-bottom: 8px !important;
                margin-top: 4px !important;
                font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace !important;
                display: block !important;
                line-height: 1.4 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Create timestamp element
    function createTimestamp(date) {
        const timestamp = document.createElement('div');
        timestamp.className = CONFIG.timestampClass;
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        timestamp.textContent = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
        return timestamp;
    }

    // Generate message hash for identification
    function generateMessageHash(element) {
        const textContent = element.textContent?.trim() || '';
        const position = Array.from(element.parentNode?.children || []).indexOf(element);
        return `${textContent.substring(0, 50)}_${position}`;
    }

    // Process messages and add timestamps
    function processMessages() {
        const messages = document.querySelectorAll(CONFIG.messageSelector);

        messages.forEach(message => {
            if (message.querySelector(`.${CONFIG.timestampClass}`)) return;

            const hash = generateMessageHash(message);
            let timestamp;

            if (timestampData.has(hash)) {
                timestamp = new Date(timestampData.get(hash));
            } else {
                timestamp = new Date();
                timestampData.set(hash, timestamp.toISOString());
                saveTimestampData();
            }

            const isClaude = message.classList.contains('font-claude-response');
            const isUser = message.getAttribute('data-testid') === 'user-message';

            if (isClaude || isUser) {
                const timestampElement = createTimestamp(timestamp);
                const firstChild = message.firstElementChild;
                if (firstChild) {
                    message.insertBefore(timestampElement, firstChild);
                } else {
                    message.prepend(timestampElement);
                }
            }
        });
    }

    // Intercept network requests to capture real timestamps
    function interceptNetworkData() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            return originalFetch.apply(this, args).then(response => {
                if (response.url.includes('/chat_conversations/') || 
                    response.url.includes('/messages')) {
                    const clonedResponse = response.clone();
                    clonedResponse.json().then(data => {
                        extractTimestampsFromResponse(data);
                    }).catch(() => {});
                }
                return response;
            });
        };
    }

    // Extract timestamps from API responses
    function extractTimestampsFromResponse(data) {
        if (!data) return;
        const messages = data.messages || data.chat_messages || [];

        messages.forEach(msg => {
            if (msg.created_at || msg.timestamp) {
                const timestamp = new Date(msg.created_at || msg.timestamp);
                const content = msg.content || msg.text || '';
                const hash = `${content.substring(0, 50)}_`;
                for (const [key, value] of timestampData.entries()) {
                    if (key.startsWith(hash)) {
                        timestampData.set(key, timestamp.toISOString());
                        break;
                    }
                }
            }
        });

        saveTimestampData();
        setTimeout(processMessages, 100);
    }

    // Setup mutation observer
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (
                            node.nodeType === 1 &&
                            (node.matches?.(CONFIG.messageSelector) ||
                             node.querySelector?.(CONFIG.messageSelector))
                        ) {
                            shouldProcess = true;
                            break;
                        }
                    }
                }
            });
            if (shouldProcess) {
                setTimeout(processMessages, CONFIG.observerDelay);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        return observer;
    }

    // Initialize the script
    function init() {
        console.log('Claude Timestamp Revealer: Initializing...');
        loadTimestampData();
        injectStyles();
        interceptNetworkData();
        setTimeout(processMessages, 1000);
        setupObserver();
        setInterval(processMessages, 10000);
        console.log('Claude Timestamp Revealer: Ready');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
})();
