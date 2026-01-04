// ==UserScript==
// @name         YT LIVE CHAT NEW TAB BUTTON
// @icon         https://static-00.iconduck.com/assets.00/youtube-chat-icon-468x512-k45kpail.png
// @name:pl      Przycisk Live Chat YouTube
// @namespace    https://tampermonkey.net/
// @version      1.1
// @license      MIT
// @description  Adds a live chat button that opens chat in new window
// @description:pl Dodaje przycisk czatu na żywo otwierający okno czatu w nowym oknie przeglądarki
// @author       「❗■ ͜ʖ■ ꍏռꪮռʏꪑꪮꪊsɨꀘꍟའའꪮ 」
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://youtu.be/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526427/YT%20LIVE%20CHAT%20NEW%20TAB%20BUTTON.user.js
// @updateURL https://update.greasyfork.org/scripts/526427/YT%20LIVE%20CHAT%20NEW%20TAB%20BUTTON.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const translations = {
        'pl': {
            buttonText: '💭 Czat na żywo',
            windowTitle: 'CHAT NA ŻYWO'
        },
        'en': {
            buttonText: '💭 Live Chat',
            windowTitle: 'LIVE CHAT'
        }
    };

    function getLanguage() {
        const htmlLang = document.documentElement.lang;
        if (htmlLang && htmlLang.startsWith('pl')) return 'pl';
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang && browserLang.startsWith('pl')) return 'pl';
        return 'en';
    }

    function getText(key) {
        const lang = getLanguage();
        return translations[lang]?.[key] || translations['en'][key];
    }

    function getVideoId() {
        const url = new URL(window.location.href);
        
        if (url.hostname.includes('youtube.com')) {
            return url.searchParams.get('v') || url.pathname.split('/').pop();
        }
        
        if (url.hostname === 'youtu.be') {
            return url.pathname.substring(1);
        }
        
        return null;
    }

    function addLiveChatButton() {
        // Checking if we are on the right page
        if (window.location.hostname === 'youtu.be' && 
            (!window.location.pathname || window.location.pathname === '/')) return;
        if (window.location.hostname.includes('youtube.com') && 
            !window.location.pathname.includes('/watch')) return;
        
        // Prevent button from being added multiple times
        if (document.getElementById('ferroLiveChatBtn')) return;

        const liveChatBtn = document.createElement('button');
        liveChatBtn.id = 'ferroLiveChatBtn';
        liveChatBtn.innerHTML = getText('buttonText');
        liveChatBtn.style.cssText = `
            background-color: #cc0000;
            color: white;
            border: none;
            border-radius: 2px;
            padding: 8px 16px;
            margin: 8px;
            cursor: pointer;
            font-family: Roboto, Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
            z-index: 1000;
        `;

        liveChatBtn.onmouseover = function() {
            this.style.backgroundColor = '#990000';
        };
        liveChatBtn.onmouseout = function() {
            this.style.backgroundColor = '#cc0000';
        };
        liveChatBtn.onclick = function() {
            const videoId = getVideoId();
            if (videoId) {
                const chatUrl = `https://www.youtube.com/live_chat?v=${videoId}`;
                window.open(chatUrl, getText('windowTitle'), 'width=400,height=600,resizable=yes,scrollbars=yes');
            }
        };

        // Multiple attempts to find a container for a button
        const possibleContainers = [
            document.querySelector('#top-level-buttons-computed'),
            document.querySelector('.slim-video-action-bar-actions'),
            document.querySelector('#actions.ytd-video-primary-info-renderer'),
            document.querySelector('ytd-menu-renderer.ytd-video-primary-info-renderer')
        ];

        const actionButtons = possibleContainers.find(container => container);
        
        if (actionButtons) {
            actionButtons.appendChild(liveChatBtn);
        }
    }

    // Listening for page change events
    window.addEventListener('load', addLiveChatButton);
    window.addEventListener('yt-navigate-finish', addLiveChatButton);

    // Emergency interval
    const checkInterval = setInterval(() => {
        const possibleContainers = [
            document.querySelector('#top-level-buttons-computed'),
            document.querySelector('.slim-video-action-bar-actions'),
            document.querySelector('#actions.ytd-video-primary-info-renderer'),
            document.querySelector('ytd-menu-renderer.ytd-video-primary-info-renderer')
        ];

        const actionButtons = possibleContainers.find(container => container);
        
        if (actionButtons) {
            addLiveChatButton();
            clearInterval(checkInterval);
        }
    }, 1000);

    // Interval time limit
    setTimeout(() => clearInterval(checkInterval), 10000);
})();