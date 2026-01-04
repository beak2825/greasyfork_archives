// ==UserScript==
// @name         Drawaria AutoRooms + ChatExporter
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Enhance your Drawaria.online with rooms joiner automation.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523069/Drawaria%20AutoRooms%20%2B%20ChatExporter.user.js
// @updateURL https://update.greasyfork.org/scripts/523069/Drawaria%20AutoRooms%20%2B%20ChatExporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crear la interfaz de usuario
    const createUI = () => {
        const interfaceDiv = document.createElement('div');
        interfaceDiv.id = 'drawaria-tools';
        interfaceDiv.style.position = 'fixed';
        interfaceDiv.style.top = '500.977px';
        interfaceDiv.style.left = '30px';
        interfaceDiv.style.right = '1300px';
        interfaceDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        interfaceDiv.style.padding = '15px';
        interfaceDiv.style.borderRadius = '10px';
        interfaceDiv.style.color = '#fff';
        interfaceDiv.style.zIndex = '9999'; // Asegura que esté por encima de otros elementos
        interfaceDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        interfaceDiv.style.width = '250px';
        interfaceDiv.style.cursor = 'move';

        const title = document.createElement('h3');
        title.textContent = 'AutoRoom Tools';
        title.style.margin = '0';
        title.style.paddingBottom = '10px';
        title.style.borderBottom = '1px solid #555';
        interfaceDiv.appendChild(title);

        // Menú de automatización
        const automationMenu = document.createElement('select');
        automationMenu.id = 'automation-menu';
        automationMenu.style.width = '100%';
        automationMenu.style.padding = '8px';
        automationMenu.style.marginTop = '10px';
        automationMenu.style.borderRadius = '5px';
        automationMenu.style.border = '1px solid #555';
        automationMenu.style.backgroundColor = '#333';
        automationMenu.style.color = '#fff';
        automationMenu.innerHTML = `
            <option value="auto-join">Auto Join Room</option>
            <option value="auto-invite">Auto Invite Players</option>
            <option value="quickplay">Quick Play</option>
            <option value="joinplayground">Join Playground</option>
            <option value="playgroundroom_next">Next Playground Room</option>
            <option value="showroomlist">Show Room List</option>
            <option value="createroom">Create Room</option>
            <option value="auto-exit-room">Auto Exit Room</option>
            <option value="export-chat">Export Chat Messages</option>
        `;
        interfaceDiv.appendChild(automationMenu);

        // Botón para ejecutar la automatización
        const automateButton = document.createElement('button');
        automateButton.textContent = 'Automate';
        automateButton.style.marginTop = '15px';
        automateButton.style.width = '100%';
        automateButton.style.padding = '10px';
        automateButton.style.border = 'none';
        automateButton.style.borderRadius = '5px';
        automateButton.style.backgroundColor = '#ffc107';
        automateButton.style.color = '#212529';
        automateButton.style.fontWeight = 'bold';
        automateButton.style.cursor = 'pointer';
        automateButton.addEventListener('click', () => {
            const selectedAutomation = automationMenu.value;
            executeAutomation(selectedAutomation);
        });
        interfaceDiv.appendChild(automateButton);

        // Hacer el menú arrastrable
        let isDragging = false;
        let offsetX, offsetY;

        interfaceDiv.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - interfaceDiv.getBoundingClientRect().left;
            offsetY = e.clientY - interfaceDiv.getBoundingClientRect().top;
            interfaceDiv.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                interfaceDiv.style.left = `${e.clientX - offsetX}px`;
                interfaceDiv.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            interfaceDiv.style.cursor = 'move';
        });

        // Agregar la interfaz al cuerpo del documento
        document.body.appendChild(interfaceDiv);
    };

    // Ejecutar automatización
    const executeAutomation = (automation) => {
        switch (automation) {
            case 'auto-join':
                console.log('Auto Join Room selected');
                autoJoinRoom();
                break;
            case 'auto-invite':
                console.log('Auto Invite Players selected');
                autoInvitePlayers();
                break;
            case 'quickplay':
                console.log('Quick Play clicked');
                document.getElementById('quickplay').click();
                break;
            case 'joinplayground':
                console.log('Join Playground clicked');
                document.getElementById('joinplayground').click();
                break;
            case 'playgroundroom_next':
                console.log('Next Playground Room clicked');
                document.getElementById('playgroundroom_next').click();
                break;
            case 'showroomlist':
                console.log('Show Room List clicked');
                document.getElementById('showroomlist').click();
                break;
            case 'createroom':
                console.log('Create Room clicked');
                document.getElementById('createroom').click();
                break;
            case 'auto-exit-room':
                console.log('Auto Exit Room selected');
                autoExitRoom();
                break;
            case 'export-chat':
                console.log('Export Chat Messages selected');
                exportChatMessages();
                break;
            default:
                console.log('Unknown automation selected');
        }
    };

    // Función para unirse automáticamente a una sala
    const autoJoinRoom = () => {
        const joinButton = document.querySelector('#quickplay');
        if (joinButton) {
            joinButton.click();
            console.log('Automatically joined a room');
        } else {
            console.error('Join button not found');
        }
    };

    // Función para invitar automáticamente a otros jugadores
    const autoInvitePlayers = () => {
        const inviteButton = document.querySelector('#invurl');
        if (inviteButton) {
            inviteButton.click();
            const inviteLink = inviteButton.value;
            const chatInput = document.querySelector('#chatbox_textinput');
            const sendButton = document.querySelector('#chatbox_sendbutton');

            if (chatInput && sendButton) {
                const alertMessage = `Invitation Link: ${inviteLink}`;
                chatInput.value = alertMessage;
                sendButton.click();
                console.log('Automatically invited players');

                // Enviar invitación a todos los jugadores
                const roomListBody = document.querySelector('#roomlist > div.roomlist-body');
                if (roomListBody) {
                    const roomItems = roomListBody.querySelectorAll('div.roomlist-item');
                    roomItems.forEach(roomItem => {
                        const playerCount = roomItem.querySelector('.roomlist-playercount').textContent;
                        if (playerCount > 0) {
                            const playerId = roomItem.getAttribute('data-roomid');
                            sendInvitation(playerId, inviteLink);
                        }
                    });
                }
            } else {
                console.error('Chat input or send button not found');
            }
        } else {
            console.error('Invite button not found');
        }
    };

    // Función para enviar una invitación a un jugador
    const sendInvitation = (playerId, inviteLink) => {
        const socket = sockets.find(socket => socket.room.id === playerId);
        if (socket) {
            socket.send(JSON.stringify([42, 'snapchatmessage', playerId, inviteLink]));
        }
    };

    // Función para salir automáticamente de una sala
    const autoExitRoom = () => {
        const homeButton = document.querySelector('#homebutton');
        if (homeButton) {
            homeButton.click();
            console.log('Automatically exited room');
        } else {
            console.error('Home button not found');
        }
    };

    // Función para exportar mensajes
    const exportChatMessages = () => {
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
    };

    // Inicializar la interfaz de usuario
    createUI();

    // WebSocket setup
    const sockets = [];
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        let socket = this;
        if (sockets.indexOf(socket) === -1) {
            sockets.push(socket);
        }
        socket.addEventListener("close", function () {
            const pos = sockets.indexOf(socket);
            if (~pos) sockets.splice(pos, 1);
        });
        return originalSend.call(socket, ...args);
    };
})();
