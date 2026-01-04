// ==UserScript==
// @name         Doobie's Torn City Chat Popout (Chat 3.0 ONLY)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a popout button for Torn chat. After clicking Boots up Window you can drag around and use on other sites/windows. To get your chat back in Torn, Close the chat!
// @author       Doobiesuckin with Base from Weav3r - Updated for Chat 3.0
// @match        https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/518038/Doobie%27s%20Torn%20City%20Chat%20Popout%20%28Chat%2030%20ONLY%29.user.js
// @updateURL https://update.greasyfork.org/scripts/518038/Doobie%27s%20Torn%20City%20Chat%20Popout%20%28Chat%2030%20ONLY%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    if (window.opener) return;
    let popoutWindow = null;
    let hasInitialized = false;
    const DEFAULT_WIDTH = 400, DEFAULT_HEIGHT = 600;
    const POPOUT_CSS = `
        body { margin: 0; padding: 0; background: #1c1c1c; height: 100vh; overflow: hidden; }
        body > *:not(#chatRoot):not(script):not(link):not(style) { display: none !important; }
        #chatRoot { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; display: block !important; }
    `;
    function saveWindowSize(width, height) {
        try { localStorage.setItem('popoutWindowSize', JSON.stringify({ width, height })); }
        catch (error) { console.error('Failed to save window size', error); }
    }
    function getSavedWindowSize() {
        try { return JSON.parse(localStorage.getItem('popoutWindowSize')) || { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }; }
        catch (error) { return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }; }
    }
    function createButton() {
        const existing = document.querySelector('#chat-popout-btn');
        if (existing) existing.remove();
        const button = document.createElement('button');
        button.id = 'chat-popout-btn';
        button.type = 'button';
        const existingButton = document.querySelector('button[class*="root__"]');
        if (existingButton) {
            button.className = existingButton.className;
        }
        button.style.cssText = `
            display: inline-block !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            width: 40px !important;
            height: 40px !important;
            max-width: 40px !important;
            max-height: 40px !important;
            min-width: 40px !important;
            min-height: 40px !important;
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            flex-shrink: 0 !important;
            overflow: hidden !important;
            vertical-align: middle !important;
        `;
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24" style="width: 20px; height: 20px; display: block; margin: auto;">
            <defs>
                <linearGradient id="popout-gradient-default" x1="0.5" x2="0.5" y2="1">
                    <stop offset="0" stop-color="#8faeb4"/>
                    <stop offset="1" stop-color="#638c94"/>
                </linearGradient>
                <linearGradient id="popout-gradient-hover" x1="0.5" x2="0.5" y2="1">
                    <stop offset="0" stop-color="#eaf0f1"/>
                    <stop offset="1" stop-color="#7b9fa6"/>
                </linearGradient>
            </defs>
            <path d="M19 3h-7v2h4.6l-8.3 8.3 1.4 1.4L18 6.4V11h2V3z M5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7H5V5z" fill="url(#popout-gradient-default)"/>
        </svg>`;
        button.title = 'Pop out chat';
        button.addEventListener('click', openPopout);
        const path = button.querySelector('path');
        button.addEventListener('mouseenter', () => path.setAttribute('fill', 'url(#popout-gradient-hover)'));
        button.addEventListener('mouseleave', () => path.setAttribute('fill', 'url(#popout-gradient-default)'));
        const targetButton = document.querySelector('button[id*="notes"], button[id*="people"], button[id*="settings"]') ||
                           document.querySelector('button[class*="root__"]');
        if (targetButton && targetButton.parentNode) {
            targetButton.parentNode.appendChild(button);
            console.log('[Chat Popout] Button created');
            return true;
        }
        return false;
    }
    function openPopout() {
        if (popoutWindow && !popoutWindow.closed) {
            popoutWindow.focus();
            return;
        }
        const { width, height } = getSavedWindowSize();
        popoutWindow = window.open('https://www.torn.com', 'TornChat', `width=${width},height=${height},resizable=yes`);
        if (!popoutWindow) return;
        const applyInitialStyling = () => {
            try {
                const style = document.createElement('style');
                style.textContent = `
                    body { margin: 0; padding: 0; background: #1c1c1c !important; height: 100vh; overflow: hidden; }
                    body > *:not(script):not(link):not(style) { display: none !important; }
                `;
                popoutWindow.document.head.appendChild(style);
            } catch (e) {}
        };
        setTimeout(applyInitialStyling, 100);
        let loadAttempts = 0;
        const checkLoad = setInterval(() => {
            try {
                const chatRoot = popoutWindow.document.querySelector('#chatRoot');
                if (chatRoot) {
                    clearInterval(checkLoad);
                    const style = document.createElement('style');
                    style.textContent = POPOUT_CSS;
                    popoutWindow.document.head.appendChild(style);
                    chatRoot.style.display = 'block';
                    chatRoot.style.position = 'fixed';
                    chatRoot.style.top = '0';
                    chatRoot.style.left = '0';
                    chatRoot.style.width = '100%';
                    chatRoot.style.height = '100%';
                    chatRoot.style.zIndex = '9999';
                    console.log('[Chat Popout] Chat styling applied');
                    popoutWindow.addEventListener('resize', () => {
                        saveWindowSize(popoutWindow.innerWidth, popoutWindow.innerHeight);
                    });
                }
            } catch (e) {}
            if (++loadAttempts > 50) {
                clearInterval(checkLoad);
                console.warn('[Chat Popout] Timeout waiting for popout to load');
            }
        }, 200);
        const checkClose = setInterval(() => {
            if (popoutWindow.closed) {
                clearInterval(checkClose);
                popoutWindow = null;
                console.log('[Chat Popout] Popout closed');
            }
        }, 1000);
    }
    function forceReset() {
        if (popoutWindow && !popoutWindow.closed) {
            popoutWindow.close();
        }
        popoutWindow = null;
        hasInitialized = false;
        const button = document.querySelector('#chat-popout-btn');
        if (button) button.remove();
        setTimeout(tryInit, 1000);
        console.log('[Chat Popout] Force reset complete');
    }
    function tryInit() {
        if (hasInitialized) return;
        const chatRoot = document.querySelector('#chatRoot');
        if (!chatRoot) return;
        if (!document.querySelector('#chat-popout-btn')) {
            if (createButton()) {
                hasInitialized = true;
                console.log('[Chat Popout] Initialized successfully');
            }
        }
    }
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            forceReset();
        }
    });
    setTimeout(tryInit, 2000);
    setTimeout(tryInit, 5000);
    setTimeout(tryInit, 10000);
    console.log('[Chat Popout] Script loaded');
})();

//Made with love by Doobiesuckin