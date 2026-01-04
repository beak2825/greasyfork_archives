// ==UserScript==
// @name         Drawaria Colorful Chat
// @namespace    http://tampermonkey.net/
// @version      Final 2024 Script
// @description  Allows you to write colors in Drawaria chat
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @connect      https://drawaria.online/socket.io/socket.io.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522435/Drawaria%20Colorful%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/522435/Drawaria%20Colorful%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para agregar el botón de color
    function addColorButton() {
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.id = 'colorPicker';
        colorPicker.style.marginLeft = '10px';
        colorPicker.style.cursor = 'pointer';

        const chatInput = document.getElementById('chatbox_textinput');
        chatInput.parentNode.insertBefore(colorPicker, chatInput.nextSibling);

        colorPicker.addEventListener('input', function() {
            const color = colorPicker.value;
            chatInput.style.color = color;
            chatInput.dataset.color = color;
        });
    }

    // Función para observar cambios en el DOM y agregar el botón de color
    function observeDOMChanges() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.id === 'chatbox_textinput') {
                            addColorButton();
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Agregar el botón de color si el campo de chat ya está presente
    const chatInput = document.getElementById('chatbox_textinput');
    if (chatInput) {
        addColorButton();
    } else {
        observeDOMChanges();
    }

    // Interceptar el envío del mensaje y añadir el estilo de color
    const originalSendMessage = window.sendChatMessage;
    window.sendChatMessage = function(message) {
        const color = document.getElementById('colorPicker').value;
        if (color) {
            message = `<span style="color: ${color};">${message}</span>`;
        }
        originalSendMessage(message);
    };

    // Observar cambios en el chatbox_messages y aplicar el estilo de color
    const chatboxMessages = document.getElementById('chatbox_messages');
    if (chatboxMessages) {
        const chatObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.classList.contains('chatmessage')) {
                            const messageText = node.querySelector('.playerchatmessage-text');
                            if (messageText) {
                                const color = document.getElementById('colorPicker').value;
                                messageText.style.color = color;
                            }
                        }
                    });
                }
            });
        });

        chatObserver.observe(chatboxMessages, {
            childList: true,
            subtree: true
        });
    }
})();
