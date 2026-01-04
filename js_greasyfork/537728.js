// ==UserScript==
// @name          AI Chat Shortcuts (New Chat & Search History)
// @namespace     AI.Chat.Shortcuts
// @version       2.1
// @description   Adds shortcuts: Ctrl+Shift+O for new chat, and Ctrl+/ to open conversation search in Gemini AI.
// @author        3xploiton3
// @match         https://gemini.google.com/*
// @match         https://chat.deepseek.com/*
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/537728/AI%20Chat%20Shortcuts%20%28New%20Chat%20%20Search%20History%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537728/AI%20Chat%20Shortcuts%20%28New%20Chat%20%20Search%20History%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        // Abaikan shortcut jika fokus sedang di dalam elemen input untuk menghindari konflik pengetikan.
        const isEditing = event.target.isContentEditable || ['INPUT', 'TEXTAREA'].includes(event.target.tagName);
        if (isEditing && event.key !== '/') {
            return;
        }

        let shortcutUsed = null;
        let actionType = null;

        // --- Shortcut untuk Chat Baru (hanya Ctrl+Shift+O yang tersisa) ---
        if (event.ctrlKey && event.shiftKey && !event.altKey && event.code === 'KeyO') {
            shortcutUsed = 'Ctrl+Shift+O';
            actionType = 'newChat';
        }
        // --- Shortcut untuk membuka Pencarian Riwayat (Ctrl + /) ---
        else if (event.ctrlKey && !event.altKey && !event.shiftKey && event.key === '/') {
            shortcutUsed = 'Ctrl+/';
            actionType = 'searchHistory';
        }

        if (actionType) {
            event.preventDefault();
            event.stopPropagation(); // Mencegah event "bubble up" yang bisa memicu aksi lain
            const currentHost = window.location.host;

            if (currentHost.includes('gemini.google.com')) {
                if (actionType === 'newChat') {
                    handleNewChat(currentHost, shortcutUsed);
                } else if (actionType === 'searchHistory') {
                    handleSearchHistory(currentHost, shortcutUsed);
                }
            } else if (currentHost.includes('chat.deepseek.com') && actionType === 'newChat') {
                handleNewChat(currentHost, shortcutUsed);
            }
        }
    });

    function handleNewChat(currentHost, shortcutUsed) {
        let newChatButton = null;
        const selectors = currentHost.includes('gemini.google.com') ? [
            'button[data-test-id="expanded-button"][aria-label="New chat"]', 'button[data-test-id="expanded-button"][aria-label="Buat obrolan baru"]', 'button[aria-label="New chat"]', 'button[aria-label="Buat obrolan baru"]', '.mat-mdc-tooltip-trigger.new-chat-button', 'button[aria-label^="New chat"]', 'button[aria-label^="Buat obrolan baru"]'
        ] : [
            'div.c7dddcde', 'div[class*="new-chat"]', 'button[aria-label*="New Chat"]', 'div:has(> svg[width="28"][height="28"])'
        ];
        for (const selector of selectors) {
            newChatButton = document.querySelector(selector);
            if (newChatButton) break;
        }
        if (newChatButton) {
            if (!newChatButton.disabled) {
                newChatButton.click();
                console.log(`[Shortcut] New chat created via ${shortcutUsed}.`);
            } else {
                console.warn(`[Shortcut] "New chat" button found but is disabled.`);
            }
        } else {
            console.warn(`[Shortcut] "New chat" button not found.`);
        }
    }

    function handleSearchHistory(currentHost, shortcutUsed) {
        let searchButton = null;
        const selectors = [
            'button.search-button',
            'button[aria-label="Search"]',
            'button[aria-label="Cari"]',
            'search-nav-button button'
        ];

        for (const selector of selectors) {
            searchButton = document.querySelector(selector);
            if (searchButton) break;
        }

        if (searchButton) {
            searchButton.click();
            console.log(`[Shortcut] Search history button clicked via ${shortcutUsed}.`);
        } else {
            console.warn(`[Shortcut] Could not find the search history button.`);
        }
    }
})();