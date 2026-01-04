// ==UserScript==
// @name         Torn Chat Popout
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a popout button for Torn chat
// @author       Weav3r
// @match        https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/516930/Torn%20Chat%20Popout.user.js
// @updateURL https://update.greasyfork.org/scripts/516930/Torn%20Chat%20Popout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let popoutWindow = null;
    const POPOUT_KEY = 'torn_chat_popout_active';
    const POPOUT_CSS = `
        body { margin: 0; padding: 0; background: #1c1c1c; height: 100vh; overflow: hidden; }
        body > *:not(#chatRoot):not(script):not(link):not(style) { display: none !important; }
        #chatRoot { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; display: block !important; }
        #chat-popout-btn { display: none !important; }
    `;

    function toggleMainChat(show) {
        const chatRoot = document.querySelector('#chatRoot');
        if (chatRoot) chatRoot.style.display = show ? '' : 'none';
        localStorage.setItem(POPOUT_KEY, !show);
    }

    function createPopoutButton() {
        const button = document.createElement('button');
        button.id = 'chat-popout-btn';
        button.type = 'button';
        button.className = 'chat-list-button___d1Olw';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('viewBox', '0 0 22 24');
        svg.setAttribute('class', 'chat-app__footer-chat-list-icon___o_mD2');

        svg.innerHTML = `
            <defs>
                <linearGradient id="popout-default-blue" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0" stop-color="#8faeb4"/>
                    <stop offset="1" stop-color="#638c94"/>
                </linearGradient>
                <linearGradient id="popout-hover-blue" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0" stop-color="#eaf0f1"/>
                    <stop offset="1" stop-color="#7b9fa6"/>
                </linearGradient>
            </defs>
            <path d="M19 3h-7v2h4.6l-8.3 8.3 1.4 1.4L18 6.4V11h2V3z M5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7H5V5z" fill="url(#popout-default-blue)"/>
        `;

        button.appendChild(svg);
        button.addEventListener('click', createPopout);

        const path = svg.querySelector('path');
        button.addEventListener('mouseenter', () => path.setAttribute('fill', 'url(#popout-hover-blue)'));
        button.addEventListener('mouseleave', () => path.setAttribute('fill', 'url(#popout-default-blue)'));

        const chatListButton = document.querySelector('.chat-list-button___d1Olw');
        chatListButton?.parentNode?.insertBefore(button, chatListButton.nextSibling);
    }

    function createPopout() {
        if (popoutWindow?.closed === false) {
            popoutWindow.focus();
            return;
        }

        popoutWindow = window.open('https://www.torn.com', 'TornChat', 'width=400,height=600,resizable=yes');

        const waitForChat = setInterval(() => {
            if (popoutWindow.document.querySelector('#chatRoot')) {
                clearInterval(waitForChat);
                toggleMainChat(false);
                const style = document.createElement('style');
                style.textContent = POPOUT_CSS;
                popoutWindow.document.head.appendChild(style);
            }
        }, 100);

        const checkClosure = setInterval(() => {
            if (popoutWindow.closed) {
                toggleMainChat(true);
                clearInterval(checkClosure);
                popoutWindow = null;
            }
        }, 1000);
    }

    function init() {
        if (document.querySelector('#chatRoot') && !document.querySelector('#chat-popout-btn')) {
            createPopoutButton();
            if (localStorage.getItem(POPOUT_KEY) === 'true') toggleMainChat(false);
        }
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
        : init();

    new MutationObserver(init).observe(document.body, { childList: true, subtree: true });

    window.addEventListener('storage', e => {
        if (e.key === POPOUT_KEY) toggleMainChat(e.newValue === 'false');
    });
})();