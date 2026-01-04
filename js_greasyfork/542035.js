// ==UserScript==
// @name         MWI Rainbow Chat
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Please Don't Use this...
// @author       SilkyPanda
// @license      CC-BY-NC-SA-4.0
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542035/MWI%20Rainbow%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/542035/MWI%20Rainbow%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const rainbowStyle = `
        .mwi-rainbow-text {
            background-image: linear-gradient(
                to right,
                #FF00FF, #00FFFF, #00FF00, #FFFF00, #FF7F50, #FF4500,
                #FF1493, #ADFF2F, #00FA9A, #00BFFF, #1E90FF, #DA70D6,
                #FF69B4, #FFA500, #FF00FF, #00FFFF, #00FF00
            );

            animation: mwi-rainbow-flow 10s ease-in-out infinite;
            background-size: 400% 100%;

            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
        }

        @keyframes mwi-rainbow-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;

    /**
     * @param {HTMLElement} messageElement The chat message element to process.
     */
    function processChatMessage(messageElement) {
        if (messageElement.dataset.rainbowified) return;
        messageElement.dataset.rainbowified = 'true';

        const playerNameSpan = messageElement.querySelector('div[class^="CharacterName_name"] > span');
        if (playerNameSpan) {
            playerNameSpan.classList.add('mwi-rainbow-text');
        }

        const messageTextSpan = messageElement.querySelector(':scope > span:last-of-type');
        if (messageTextSpan) {
            Array.from(messageTextSpan.childNodes).forEach(child => {
                if (child.nodeType === Node.ELEMENT_NODE && (child.tagName === 'A' || child.tagName === 'SPAN')) {
                    child.classList.add('mwi-rainbow-text');
                } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== '') {
                    const wrapperSpan = document.createElement('span');
                    wrapperSpan.className = 'mwi-rainbow-text';
                    wrapperSpan.textContent = child.textContent;
                    child.replaceWith(wrapperSpan);
                }
            });
        }
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches('[class^="ChatMessage_chatMessage"]')) {
                        processChatMessage(node);
                    }
                    node.querySelectorAll('[class^="ChatMessage_chatMessage"]').forEach(processChatMessage);
                }
            }
        }
    });

    function initialize() {
        GM_addStyle(rainbowStyle);

        document.querySelectorAll('[class^="ChatMessage_chatMessage"]').forEach(processChatMessage);

        observer.observe(document.body, { childList: true, subtree: true });

        console.log('MWI Rainbow Chat (Universal) is now active. Enjoy the lag-free colors on all tabs!');
    }

    console.log('MWI Rainbow Chat v7.0 (Universal Tabs) loaded!');
    setTimeout(initialize, 1000);

})();