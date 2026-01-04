// ==UserScript==
// @name         Drawaria Chat Exporter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Export chat messages from drawaria.online
// @author       You
// @match        https://drawaria.online/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522962/Drawaria%20Chat%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/522962/Drawaria%20Chat%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Estilos para el menú
    const menuStyle = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #fff;
        border: 1px solid #ccc;
        padding: 10px;
        z-index: 1000;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        border-radius: 5px;
    `;

    const buttonStyle = `
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 12px;
    `;

    // HTML del menú
    const menuHTML = `
        <div id="chatExporterMenu" style="${menuStyle}">
            <h3>Chat Exporter</h3>
            <button id="exportChatButton" style="${buttonStyle}">Exportar Chat</button>
        </div>
    `;

    // Crear el menú y agregarlo al documento
    const menu = document.createElement('div');
    menu.innerHTML = menuHTML;
    document.body.appendChild(menu);

    // Función para exportar mensajes
    function exportChatMessages() {
        const chatbox = document.getElementById('chatbox_messages');
        const messages = chatbox.querySelectorAll('div.chatmessage');
        let exportedMessages = [];

        messages.forEach(message => {
            if (message.classList.contains('systemchatmessage')) {
                exportedMessages.push(`[System] ${message.textContent}`);
            } else if (message.classList.contains('playerchatmessage-highlightable')) {
                const playerName = message.querySelector('.playerchatmessage-name')?.textContent || 'Unknown';
                const playerMessage = message.querySelector('.playerchatmessage-text')?.textContent || '';
                exportedMessages.push(`${playerName}: ${playerMessage}`);
            }
        });

        // Crear un blob con los mensajes y descargarlo
        const blob = new Blob([exportedMessages.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat_messages.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Agregar evento al botón de exportar
    document.getElementById('exportChatButton').addEventListener('click', exportChatMessages);

})();
