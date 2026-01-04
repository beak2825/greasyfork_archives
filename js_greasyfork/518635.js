// ==UserScript==
// @name         Lolz Transparent Chat
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Убирает фон у чата лолзтим.
// @match        https://lzt.market/*
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518635/Lolz%20Transparent%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/518635/Lolz%20Transparent%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const blurEnabled = true; // Установите true для включения размытия или false для его отключения

    const applyStylesToChat = (chatElement) => {
        if (chatElement) {
            chatElement.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
            chatElement.style.backdropFilter = blurEnabled ? 'blur(8px)' : 'none';
            chatElement.style.border = '1px solid rgba(255, 255, 255, 0.2)';

            const childElements = chatElement.querySelectorAll('*');
            childElements.forEach(el => {
                el.style.setProperty('background-color', 'transparent', 'important');
                el.style.border = 'none';
            });

            const taggedMessageBlocks = chatElement.querySelectorAll('.chat2-message-tagged.lztng-4kgdqr .chat2-message-block.lztng-4kgdqr');
            taggedMessageBlocks.forEach(block => {
                block.style.setProperty('background', 'transparent', 'important');
                block.style.setProperty('border', '2px solid rgb(0, 150, 0)', 'important');
                block.style.borderRadius = '10px';
                block.style.padding = '4px';
            });

            const messageBlocks = chatElement.querySelectorAll('.chat2-message-block');
            messageBlocks.forEach(block => {
                if (!block.closest('.chat2-message-tagged')) {
                    block.style.setProperty('background-color', 'transparent', 'important');
                    block.style.setProperty('border', '1px solid rgba(128, 128, 128, 0.5)', 'important');
                    block.style.borderRadius = '5px';
                }
            });

            const messageHeaders = chatElement.querySelectorAll('.chat2-message-header');
            messageHeaders.forEach(header => {
                header.style.setProperty('background-color', 'transparent', 'important');
                header.style.border = 'none';
            });

            const messageTexts = chatElement.querySelectorAll('.chat2-message-text');
            messageTexts.forEach(text => {
                text.style.setProperty('background-color', 'transparent', 'important');
                text.style.border = 'none';
            });

            addTextAfterNick('ВПН', ' @GodlikeGL');
        }
    };

    const addTextAfterNick = (nick, additionalText) => {
        const nickElements = document.querySelectorAll('span');
        nickElements.forEach(nickElement => {
            if (nickElement.textContent === nick) {
                if (!nickElement.nextSibling || nickElement.nextSibling.textContent !== additionalText) {
                    const additionalTextNode = document.createElement('span');
                    additionalTextNode.textContent = additionalText;
                    additionalTextNode.style.color = 'rgba(255, 255, 255, 0.8)';
                    additionalTextNode.style.marginLeft = '4px';
                    nickElement.parentNode.insertBefore(additionalTextNode, nickElement.nextSibling);
                }
            }
        });
    };

    const createRainbowText = (nickElement) => {
        if (!nickElement.classList.contains('rainbow-applied')) {
            nickElement.style.backgroundImage = 'linear-gradient(90deg, red, orange, yellow, green, cyan, blue, violet)';
            nickElement.style.webkitBackgroundClip = 'text';
            nickElement.style.webkitTextFillColor = 'transparent';
            nickElement.style.fontWeight = 'bold';
            nickElement.style.fontSize = '16px';
            nickElement.style.animation = 'rainbow 3s linear infinite';
            nickElement.classList.add('rainbow-applied');
        }
    };

    const applyRainbowNick = () => {
        const nickElements = document.querySelectorAll('span');
        nickElements.forEach(nickElement => {
            if (nickElement.textContent === 'Маркет') {
                createRainbowText(nickElement);
            }
        });
    };

    const initializeChatStyling = () => {
        const chatElement = document.querySelector('[class^="chat2-floating"]');

        if (chatElement) {
            applyStylesToChat(chatElement);

            const observer = new MutationObserver(() => {
                applyStylesToChat(chatElement);
                applyRainbowNick();
            });

            observer.observe(chatElement, {
                childList: true,
                subtree: true
            });
        } else {
            setTimeout(initializeChatStyling, 300);
        }

        applyRainbowNick();
    };

    const addRainbowAnimationStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { background-position: 0% 50%; }
                100% { background-position: 100% 50%; }
            }
        `;
        document.head.appendChild(style);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addRainbowAnimationStyles();
            initializeChatStyling();
        });
    } else {
        addRainbowAnimationStyles();
        initializeChatStyling();
    }
})();
