// ==UserScript==
// @name         NEAU CHAT GLOBAL
// @namespace    http://tampermonkey.net/
// @version      1.10001201320
// @description  Bubble Chat Message By Desc
// @author       Desc
// @match        *://*/*
// @exclude      https://sad3d3.000webhostapp.com/*
// @exclude      *://*.ngrok-free.app/*
// @exclude      *://*facebook.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472391/NEAU%20CHAT%20GLOBAL.user.js
// @updateURL https://update.greasyfork.org/scripts/472391/NEAU%20CHAT%20GLOBAL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const chatUrl = 'https://sad3d3.000webhostapp.com/';
    const chatContainerSelector = '#chat-container';

    const chatBubble = document.createElement('div');
    chatBubble.innerHTML = '<img src="https://i.imgur.com/fttjnho.png" style="width: 100%; height: 100%;">';
    chatBubble.setAttribute('style', `
        position: fixed;
        top: 20px;
        left: 170px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: transform 0.3s, opacity 0.3s; /* Agregado: efecto de desvanecimiento */
        z-index: 9999;
    `);
    document.body.appendChild(chatBubble);

    const chatWindow = document.createElement('div');
    chatWindow.setAttribute('style', `
        position: fixed;
        bottom: 30px;
        right: 20px;
        width: 400px;
        height: 470px;
        background-color: #ffffff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
        transform: scale(0);
        opacity: 0; /* Agregado: efecto de desvanecimiento */
        transition: transform 0.3s, opacity 0.3s; /* Agregado: efecto de desvanecimiento */
        z-index: 9999;
    `);
    document.body.appendChild(chatWindow);

    let isAltKeyPressed = false;
    let chatVisible = false;
    let bubbleVisible = true;

    const closeChat = () => {
        chatVisible = false;
        chatWindow.style.transform = 'scale(0)';
        chatWindow.style.opacity = 0;
    };

    const openChat = () => {
        chatVisible = true;
        chatWindow.style.transform = 'scale(1)';
        chatWindow.style.opacity = 1;
    };

    const toggleBubble = () => {
    bubbleVisible = !bubbleVisible;
    if (bubbleVisible) {
        chatBubble.style.opacity = '1';
        chatBubble.style.display = 'block';
    } else {
        chatBubble.style.opacity = '0';
        setTimeout(() => {
            chatBubble.style.display = 'none';
        }, 300); // Ajusta la duración del desvanecimiento según sea necesario
    }
};

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Alt' && !isAltKeyPressed) {
            isAltKeyPressed = true;
        }
        if (event.key === 'x' && isAltKeyPressed) {
            toggleBubble();
        }
        if (event.key === 'c' && isAltKeyPressed) {
            if (chatVisible) {
                closeChat();
            } else {
                openChat();
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Alt') {
            isAltKeyPressed = false;
        }
    });

    chatBubble.addEventListener('mousedown', (event) => {
        event.stopPropagation();
        if (chatVisible) {
            closeChat();
        } else {
            openChat();
        }
    });

    chatBubble.addEventListener('mouseenter', () => {
        if (!chatVisible) {
            chatWindow.style.transform = 'scale(1)';
            chatWindow.style.opacity = 1;
        }
    });

    chatBubble.addEventListener('mouseleave', () => {
        if (!chatVisible) {
            chatWindow.style.transform = 'scale(0)';
            chatWindow.style.opacity = 0;
        }
    });

    const closeButton = document.createElement('div');
    closeButton.innerHTML = '&#10006;';
    closeButton.setAttribute('style', `
        position: absolute;
        right: 10px;
        font-size: 18px;
        cursor: pointer;
    `);
    chatWindow.appendChild(closeButton);

    closeButton.addEventListener('click', closeChat);

    const chatIframe = document.createElement('iframe');
    chatIframe.src = chatUrl;
    chatIframe.setAttribute('style', `
        width: 100%;
        height: 100%;
        border: none;
    `);
    chatWindow.appendChild(chatIframe);

    document.addEventListener('mousedown', (event) => {
        if (event.target !== chatBubble && event.target !== chatWindow) {
            closeChat();
        }
    });
})();