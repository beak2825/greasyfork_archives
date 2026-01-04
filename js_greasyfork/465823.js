// ==UserScript==
// @name         LZT transparent chat
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Данное расширение делает прозрачный фон чата
// @author       ChatGPT , aff
// @match        *https://zelenka.guru/*
// @match        *https://lolz.live/*
// @match        *https://lzt.market/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465823/LZT%20transparent%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/465823/LZT%20transparent%20chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const applyStylesToChat = (chatElement) => {
        chatElement.style.setProperty('background-color', 'rgba(27, 27, 27, 0.3)', 'important');
    };

    const initializeChatStyling = () => {
        const messagesElement = document.querySelector('.chat2-messages.lztng-content-background.lztng-9fdbg4');
        if (messagesElement) {
            applyStylesToChat(messagesElement);
        }

        const chatElement = document.querySelector('[class^="chat2-floating"]');
        if (chatElement) {
            chatElement.style.setProperty('background-color', 'rgba(27, 27, 27, 0.3)', 'important');
            chatElement.style.setProperty('border', '0px solid #363636', 'important');
        }

        const headerElement = document.querySelector('[class^="chat2-header"]');
        if (headerElement) {
            applyStylesToChat(headerElement);
        }

        const buttonElement = document.querySelector('.chat2-button.chat2-button-close.lztng-1u76jgu');
        if (buttonElement) {
            applyStylesToChat(buttonElement);
        }

        const messageBlockElements = document.querySelectorAll('.chat2-message-block.lztng-c9cwn9');
        messageBlockElements.forEach(block => {
            block.style.setProperty('background-color', 'rgba(27, 27, 27, 0.5)', 'important');
            block.style.setProperty('border', '0px solid rgba(27, 27, 27, 0.5)', 'important');
            block.style.borderRadius = '5px';
        });

        // Убираем border для помеченных блоков сообщений
        const taggedMessageBlocks = document.querySelectorAll('.chat2-message-tagged .chat2-message-block');
        taggedMessageBlocks.forEach(block => {
            block.style.setProperty('background', 'rgba(27, 27, 27, 0.5)', 'important');
            block.style.removeProperty('border');
            block.style.borderRadius = '10px';
            block.style.padding = '4px';
        });

        const gradientBlocks = document.querySelectorAll('.chat2-message-tagged.lztng-c9cwn9 .chat2-message-block:where(.lztng-c9cwn9)');
        gradientBlocks.forEach(block => {
            block.style.setProperty('background', 'linear-gradient(90deg, rgb(0 0 0 / 20%) 0%, rgb(18, 76, 50) 100%)', 'important');
        });

        const messageHeaders = document.querySelectorAll('.chat2-message-header');
        messageHeaders.forEach(header => {
            header.style.setProperty('background-color', 'rgba(27, 27, 255, 0)', 'important');
            header.style.border = 'none';
        });

        const messageTexts = document.querySelectorAll('.chat2-message-text');
        messageTexts.forEach(text => {
            text.style.setProperty('background-color', 'rgba(27, 255, 27, 0)', 'important');
            text.style.border = 'none';
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

