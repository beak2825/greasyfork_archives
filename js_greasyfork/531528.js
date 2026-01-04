// ==UserScript==
// @name         LolzBlurChat
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Прозрачно-размытый фон чата
// @author       Zequd
// @match        *https://zelenka.guru/*
// @match        *https://lolz.live/*
// @match        *https://lzt.market/*
// @grant        GM_addStyle
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @downloadURL https://update.greasyfork.org/scripts/531528/LolzBlurChat.user.js
// @updateURL https://update.greasyfork.org/scripts/531528/LolzBlurChat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const applyStylesToChat = (chatElement) => {
        chatElement.style.setProperty('background-color', 'rgba(27, 27, 27, 0.2)', 'important');
        chatElement.style.setProperty('backdrop-filter', 'blur(10px)', 'important');
        chatElement.style.setProperty('-webkit-backdrop-filter', 'blur(10px)', 'important');
    };

    const initializeChatStyling = () => {
        const messagesElement = document.querySelector('.chat2-messages.lztng-content-background.lztng-m81to2');
        if (messagesElement) {
            applyStylesToChat(messagesElement);
        }

        const chatElement = document.querySelector('[class^="chat2-floating"]');
        if (chatElement) {
            chatElement.style.setProperty('background-color', 'rgba(27, 27, 27, 0.2)', 'important');
            chatElement.style.setProperty('backdrop-filter', 'blur(10px)', 'important');
            chatElement.style.setProperty('-webkit-backdrop-filter', 'blur(10px)', 'important');
            chatElement.style.setProperty('border', '0px solid #363636', 'important');
        }

        const headerElement = document.querySelector('[class^="chat2-header"]');
        if (headerElement) {
            applyStylesToChat(headerElement);
        }

        const buttonElement = document.querySelector('.chat2-button.chat2-button-close');
        if (buttonElement) {
            applyStylesToChat(buttonElement);
        }

        const messageBlockElements = document.querySelectorAll('.chat2-message-block.lztng-primary-darker');
        messageBlockElements.forEach(block => {
            block.style.setProperty('background-color', 'rgba(27, 27, 27, 0.2)', 'important');
            block.style.setProperty('backdrop-filter', 'blur(10px)', 'important');
            block.style.setProperty('-webkit-backdrop-filter', 'blur(10px)', 'important');
            block.style.borderRadius = '5px';
        });
    };

    const observer = new MutationObserver(() => {
        initializeChatStyling();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    initializeChatStyling();
})();
