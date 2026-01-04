// ==UserScript==
// @name         Sploop.io Chat Log
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Registra el chat de Sploop.io
// @author       DaRK
// @match        https://sploop.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481916/Sploopio%20Chat%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/481916/Sploopio%20Chat%20Log.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Estilos para el cuadro de registro de chat
    const styles = `
        position: fixed;
        top: 0;
        left: 0;
        padding: 10px;
        background-color: rgba(255, 255, 255, 0.7);
        border: 1px solid #ccc;
        z-index: 9999;
        width: 100%;
        text-align: center;
    `;

    // Estilos para la esquina superior derecha
    const cornerStyles = `
        position: fixed;
        top: 0;
        right: 0;
        padding: 10px;
        font-size: 12px;
    `;

    // Cuadro de registro de chat
    const chatLogBox = document.createElement('div');
    chatLogBox.style.cssText = styles;
    chatLogBox.innerText = 'Chat Log!';

    // Esquina superior derecha
    const cornerBox = document.createElement('div');
    cornerBox.style.cssText = cornerStyles;
    cornerBox.innerText = 'by DaRK :)';

    // Interceptar y registrar mensajes del chat
    function logChatMessage(username, message) {
        console.log(`${username}: ${message}`);
        // Puedes personalizar esto para enviar los mensajes a tu servidor o hacer otras acciones.
    }

    // Escuchar eventos del chat
    function watchChat() {
        const chatElement = document.getElementById('chat'); // Ajusta esto según la estructura HTML del chat de Sploop.io

        if (chatElement) {
            chatElement.addEventListener('DOMNodeInserted', (event) => {
                if (event.target && event.target.className === 'message') {
                    const usernameElement = event.target.querySelector('.name');
                    const messageElement = event.target.querySelector('.text');

                    if (usernameElement && messageElement) {
                        const username = usernameElement.textContent.trim();
                        const message = messageElement.textContent.trim();
                        logChatMessage(username, message);
                    }
                }
            });
        }
    }

    // Iniciar la observación del chat
    watchChat();

    // Agregar cuadro de registro de chat y esquina superior derecha al cuerpo del documento
    document.body.appendChild(chatLogBox);
    document.body.appendChild(cornerBox);
})();
