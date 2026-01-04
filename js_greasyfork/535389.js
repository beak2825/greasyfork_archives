// ==UserScript==
// @name         YouTube Live Chat Highlighter Icon (Robust Persistence, Single User Highlight)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Persistent highlighter icon for YouTube Live Chat, single-user toggle, robust to chat mode switches (GreasyFork logic)
// @match        https://www.youtube.com/live_chat*
// @license 	 MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535389/YouTube%20Live%20Chat%20Highlighter%20Icon%20%28Robust%20Persistence%2C%20Single%20User%20Highlight%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535389/YouTube%20Live%20Chat%20Highlighter%20Icon%20%28Robust%20Persistence%2C%20Single%20User%20Highlight%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Style ---
    const style = document.createElement('style');
    style.textContent = `
        .highlight-icon {
            margin-left: 4px;
            vertical-align: middle;
            cursor: pointer;
            opacity: 0.7;
            user-select: none;
            font-size: 1em;
            padding: 0 2px;
        }
        .highlight-icon.active {
            opacity: 1;
            filter: drop-shadow(0 0 3px #ffe500);
        }
        yt-live-chat-text-message-renderer.highlighted-message {
            background-color: #ffe500 !important;
        }
        yt-live-chat-text-message-renderer.highlighted-message #message {
            color: #111 !important;
            font-weight: bold !important;
        }
    `;
    document.head.appendChild(style);

    let highlightedUser = null;

    function insertIcon(msg) {
        if (msg.querySelector('.highlight-icon')) return;
        const author = msg.querySelector('#author-name');
        if (!author) return;
        const icon = document.createElement('span');
        icon.className = 'highlight-icon';
        icon.textContent = '🖊️';
        author.after(icon);
    }

    function getUsername(msg) {
        const author = msg.querySelector('#author-name');
        return author ? author.textContent.trim() : null;
    }

    function setAuthorStyle(author, highlighted) {
        if (!author) return;
        if (highlighted) {
            author.style.setProperty('color', '#111', 'important');
            author.style.setProperty('font-weight', 'bold', 'important');
            author.style.setProperty('text-shadow', 'none', 'important');
            Array.from(author.querySelectorAll('span')).forEach(child => {
                child.style.setProperty('color', '#111', 'important');
            });
        } else {
            author.style.removeProperty('color');
            author.style.removeProperty('font-weight');
            author.style.removeProperty('text-shadow');
            Array.from(author.querySelectorAll('span')).forEach(child => {
                child.style.removeProperty('color');
            });
        }
    }

    function setTimestampStyle(timestamp, highlighted) {
        if (!timestamp) return;
        if (highlighted) {
            timestamp.style.setProperty('color', '#111', 'important');
            timestamp.style.setProperty('font-weight', 'bold', 'important');
            timestamp.style.setProperty('text-shadow', 'none', 'important');
        } else {
            timestamp.style.removeProperty('color');
            timestamp.style.removeProperty('font-weight');
            timestamp.style.removeProperty('text-shadow');
        }
    }

    function updateAllMessages() {
        document.querySelectorAll('yt-live-chat-text-message-renderer').forEach(msg => {
            insertIcon(msg);
            const username = getUsername(msg);
            const author = msg.querySelector('#author-name');
            const timestamp = msg.querySelector('#timestamp');
            if (username && highlightedUser === username) {
                msg.classList.add('highlighted-message');
                const icon = msg.querySelector('.highlight-icon');
                if (icon) icon.classList.add('active');
                setAuthorStyle(author, true);
                setTimestampStyle(timestamp, true);
            } else {
                msg.classList.remove('highlighted-message');
                const icon = msg.querySelector('.highlight-icon');
                if (icon) icon.classList.remove('active');
                setAuthorStyle(author, false);
                setTimestampStyle(timestamp, false);
            }
        });
    }

    document.addEventListener('click', e => {
        const icon = e.target.closest('.highlight-icon');
        if (!icon) return;
        const msg = icon.closest('yt-live-chat-text-message-renderer');
        if (!msg) return;
        const username = getUsername(msg);
        if (!username) return;
        if (highlightedUser === username) {
            highlightedUser = null;
        } else {
            highlightedUser = username;
        }
        updateAllMessages();
    });

    // --- Core: Robust observer for chat container replacement ---
    function observeChatContainer() {
        let lastItems = null;
        let msgObserver = null;

        function attachMsgObserver(chatItems) {
            if (msgObserver) msgObserver.disconnect();
            if (!chatItems) return;
            msgObserver = new MutationObserver(updateAllMessages);
            msgObserver.observe(chatItems, {childList: true});
            updateAllMessages();
        }

        function check() {
            const containerParent = document.querySelector('yt-live-chat-item-list-renderer');
            if (!containerParent) return setTimeout(check, 1000);
            const chatItems = containerParent.querySelector('#items');
            if (chatItems !== lastItems) {
                lastItems = chatItems;
                attachMsgObserver(chatItems);
            }
            setTimeout(check, 500); // Keep checking for replacement
        }
        check();
    }

    observeChatContainer();

})();
