// ==UserScript==
// @name         TornChatColumnReorder
// @namespace    http://tampermonkey.net/
// @version      V1.5
// @description  Reorders columns in a stacking 3*n grid, instead of horizontally
// @author       LordTaz
// @match        https://www.torn.com/*
// @icon        https://www.google.com/s2/favicons?sz=32&domain=duckopedia.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536533/TornChatColumnReorder.user.js
// @updateURL https://update.greasyfork.org/scripts/536533/TornChatColumnReorder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function stackChats() {
        const allChats = [...document.querySelectorAll('.item___ydsFW, .stacked-chat')];

        allChats.forEach(chat => {
            chat.classList.add('item___ydsFW');
            chat.classList.remove('stacked-chat');
            Object.assign(chat.style, {
                left: '', top: '', bottom: '', right: '', transform: '', position: '',
            });
        });

        const chats = [...document.querySelectorAll('.item___ydsFW')];
        const getTitle = el => el.querySelector('.headingH1___RwTDm')?.innerText.trim() || '';

        const ordered = chats.sort((a, b) => {
            const t = txt => (txt === 'Trade' ? 0 : txt === 'Faction' ? 1 : 2);
            return t(getTitle(a)) - t(getTitle(b));
        });

        const columns = 3;
        const spacing = 5;
        const bottomPadding = 38;

        const chatWidth = ordered[0]?.offsetWidth || 300;
        const chatHeight = ordered[0]?.offsetHeight || 400;

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        const originX = screenW - chatWidth - spacing - 15;
        const originY = screenH - chatHeight - spacing - bottomPadding;

        ordered.forEach((chat, index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);

            const x = originX - col * (chatWidth + spacing);
            const y = originY - row * (chatHeight + spacing);

            chat.classList.remove('item___ydsFW');
            chat.classList.add('stacked-chat');
            Object.assign(chat.style, {
                position: 'fixed',
                left: `${x}px`,
                top: `${y}px`,
                zIndex: 9999,
            });
        });
    }

    if (!document.getElementById('chat-stacker-style')) {
        const style = document.createElement('style');
        style.id = 'chat-stacker-style';
        style.textContent = `
        .stacked-chat {
            position: fixed !important;
            transform: none !important;
            bottom: auto !important;
            right: auto !important;
        }
        `;
        document.head.appendChild(style);
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if ([...mutation.addedNodes, ...mutation.removedNodes].some(n =>
                    n.nodeType === 1 && (n.classList?.contains('item___ydsFW') || n.classList?.contains('stacked-chat'))
                )) {
                setTimeout(stackChats, 100);
                break;
            }
        }
    });

    const container = document.querySelector('#react-root') || document.body;
    observer.observe(container, { childList: true, subtree: true });

    stackChats();
    const applyZIndexToMessageCount = () => {
        document.querySelectorAll('[class^="messageCount_"]').forEach(el => {
            el.style.setProperty('z-index', '10000', 'important');
        });
    };

    const messageCountObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if ([...mutation.addedNodes].some(node =>
                                              node.nodeType === 1 &&
                                              node.querySelector?.('[class^="messageCount_"]')
                                             )) {
                applyZIndexToMessageCount();
            }
        }
    });

    messageCountObserver.observe(document.body, { childList: true, subtree: true });
    applyZIndexToMessageCount();

    setInterval(applyZIndexToMessageCount, 500);

    window.addEventListener('resize', () => {
        setTimeout(stackChats, 100); // Delay helps in some dynamic layouts
    });

})();