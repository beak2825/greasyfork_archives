// ==UserScript==
// @name         Drawaria Multi-Action Menu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a draggable menu with buttons to perform various actions using WebSockets.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536749/Drawaria%20Multi-Action%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/536749/Drawaria%20Multi-Action%20Menu.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const EL = (sel) => document.querySelector(sel);
    const ELL = (sel) => document.querySelectorAll(sel);

    // WebSocket Prototype Override
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (window.sockets.indexOf(this) === -1) {
            window.sockets.push(this);
            if (window.sockets.indexOf(this) === 0) {
                this.addEventListener('message', (event) => {
                    let message = String(event.data);
                    if (message.startsWith('42')) {
                        let payload = JSON.parse(message.slice(2));
                        handleMessage(payload);
                    }
                });
            }
        }
        return originalSend.call(this, ...args);
    };

    function handleMessage(payload) {
        if (payload[0] === 'bc_clientnotify' && payload[1] === 12) {
            console.log('Received client notify:', payload);
            // Handle the client notify message if needed
        }
    }

    // Add Stylesheet
    function CreateStylesheet() {
        let container = document.createElement('style');
        container.innerHTML = `
            .action-menu {
                position: absolute;
                top: 226.969px;
                left: 30px;
                display: flex;
                flex-direction: column;
                align-items: center;
                background: linear-gradient(135deg, #8e2de2, #4a00e0);
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                animation: fadeIn 0.5s ease-in-out;
            }
            .action-menu-header {
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
            }
            .action-menu-title {
                color: white;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .action-menu-toggle {
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-top: 15px solid white;
                margin-bottom: 10px;
            }
            .action-menu-content {
                display: none;
                flex-wrap: wrap;
                justify-content: center;
            }
            .action-button {
                margin: 10px;
                padding: 15px 20px;
                cursor: pointer;
                background: linear-gradient(135deg, #ffd700, #ffb90f);
                color: white;
                border: none;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .action-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
            }
            .draggable {
                cursor: move;
            }
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(container);
    }

    // Add Action Menu
    function addActionMenu() {
        let actionMenu = document.createElement('div');
        actionMenu.className = 'action-menu draggable';
        actionMenu.id = 'action-menu';

        let actionMenuHeader = document.createElement('div');
        actionMenuHeader.className = 'action-menu-header';
        actionMenuHeader.addEventListener('click', toggleMenu);

        let actionMenuTitle = document.createElement('div');
        actionMenuTitle.className = 'action-menu-title';
        actionMenuTitle.textContent = 'Multi-Action Menu';

        let actionMenuToggle = document.createElement('div');
        actionMenuToggle.className = 'action-menu-toggle';

        let actionMenuContent = document.createElement('div');
        actionMenuContent.className = 'action-menu-content';

        // Add buttons to the menu content
        addActionButtons(actionMenuContent);

        actionMenuHeader.appendChild(actionMenuTitle);
        actionMenuHeader.appendChild(actionMenuToggle);
        actionMenu.appendChild(actionMenuHeader);
        actionMenu.appendChild(actionMenuContent);

        document.body.appendChild(actionMenu);

        makeDraggable(actionMenu);
    }

    // Add Action Buttons
    function addActionButtons(container) {
        // Auto Join Room
        let autoJoinButton = document.createElement('button');
        autoJoinButton.className = 'action-button';
        autoJoinButton.textContent = 'Auto Join Room';
        autoJoinButton.addEventListener('click', autoJoinRoom);

        // Auto Invite Players
        let autoInviteButton = document.createElement('button');
        autoInviteButton.className = 'action-button';
        autoInviteButton.textContent = 'Auto Invite Players';
        autoInviteButton.addEventListener('click', autoInvitePlayers);

        // Quick Play
        let quickPlayButton = document.createElement('button');
        quickPlayButton.className = 'action-button';
        quickPlayButton.textContent = 'Quick Play';
        quickPlayButton.addEventListener('click', () => document.getElementById('quickplay').click());

        // Join Playground
        let joinPlaygroundButton = document.createElement('button');
        joinPlaygroundButton.className = 'action-button';
        joinPlaygroundButton.textContent = 'Join Playground';
        joinPlaygroundButton.addEventListener('click', () => document.getElementById('joinplayground').click());

        // Next Playground Room
        let nextPlaygroundButton = document.createElement('button');
        nextPlaygroundButton.className = 'action-button';
        nextPlaygroundButton.textContent = 'Next Playground Room';
        nextPlaygroundButton.addEventListener('click', () => document.getElementById('playgroundroom_next').click());

        // Show Room List
        let showRoomListButton = document.createElement('button');
        showRoomListButton.className = 'action-button';
        showRoomListButton.textContent = 'Show Room List';
        showRoomListButton.addEventListener('click', () => document.getElementById('showroomlist').click());

        // Create Room
        let createRoomButton = document.createElement('button');
        createRoomButton.className = 'action-button';
        createRoomButton.textContent = 'Create Room';
        createRoomButton.addEventListener('click', () => document.getElementById('createroom').click());

        // Auto Exit Room
        let autoExitButton = document.createElement('button');
        autoExitButton.className = 'action-button';
        autoExitButton.textContent = 'Auto Exit Room';
        autoExitButton.addEventListener('click', autoExitRoom);

        // Export Chat Messages
        let exportChatButton = document.createElement('button');
        exportChatButton.className = 'action-button';
        exportChatButton.textContent = 'Export Chat Messages';
        exportChatButton.addEventListener('click', exportChatMessages);

        // Auto Kick Button
        let autoKickButton = document.createElement('button');
        autoKickButton.className = 'action-button';
        autoKickButton.textContent = 'Auto Kick';
        autoKickButton.addEventListener('click', () => sendAction('autoKick'));


        // Add buttons to the container in a grid layout
        let gridContainer = document.createElement('div');
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
        gridContainer.style.gap = '10px';

        gridContainer.appendChild(autoJoinButton);
        gridContainer.appendChild(autoInviteButton);
        gridContainer.appendChild(quickPlayButton);
        gridContainer.appendChild(joinPlaygroundButton);
        gridContainer.appendChild(nextPlaygroundButton);
        gridContainer.appendChild(showRoomListButton);
        gridContainer.appendChild(createRoomButton);
        gridContainer.appendChild(autoExitButton);
        gridContainer.appendChild(exportChatButton);
        gridContainer.appendChild(autoKickButton); // Add the Auto Kick button


        container.appendChild(gridContainer);
    }

    // Toggle Menu Visibility
    function toggleMenu() {
        let content = document.querySelector('.action-menu-content');
        let toggle = document.querySelector('.action-menu-toggle');
        if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'flex';
            toggle.style.borderTop = '15px solid white';
        } else {
            content.style.display = 'none';
            toggle.style.borderTop = '15px solid white';
        }
    }

    // Function to auto join room
    const autoJoinRoom = () => {
        const joinButton = document.querySelector('#quickplay');
        if (joinButton) {
            joinButton.click();
            console.log('Automatically joined a room');
        } else {
            console.error('Join button not found');
        }
    };

    // Function to auto invite players
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

                // Send invitation to all players
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

    // Function to send an invitation to a player
    const sendInvitation = (playerId, inviteLink) => {
        const socket = window.sockets.find(socket => socket.room && socket.room.id === playerId);
        if (socket) {
            socket.send(JSON.stringify([42, 'snapchatmessage', playerId, inviteLink]));
        }
    };

    // Function to auto exit room
    const autoExitRoom = () => {
        const homeButton = document.querySelector('#homebutton');
        if (homeButton) {
            homeButton.click();
            console.log('Automatically exited room');
        } else {
            console.error('Home button not found');
        }
    };

    // Function to export chat messages
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

        // Create a blob with the messages and download it
        const blob = new Blob([exportedMessages.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat_messages.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Send Action via WebSocket
    function sendAction(actionType) {
        if (actionType === 'autoKick') {
            // This is a placeholder for sending the action.
            // You would need to determine the correct WebSocket message
            // structure for the "autoKick" action in Drawaria.online.
            // This is NOT a working auto-kick functionality, just an example
            // of how to trigger an action from the menu.
            console.log('Attempting to send autoKick action via WebSocket.');
            const socket = window.sockets[0]; // Assuming the first socket is the main game socket
            if (socket && socket.readyState === WebSocket.OPEN) {
                // Replace with the actual WebSocket message for auto-kicking a player.
                // This is highly dependent on the game's internal API.
                // Example (Likely Incorrect): socket.send(JSON.stringify(['42', 'kickplayer', {playerId: 'target_player_id'}]));
                console.warn("Auto Kick functionality is a placeholder. You need to implement the correct WebSocket message.");


                 // A very basic attempt to simulate joining a room to trigger a potential action
                 // (This is likely incorrect for auto-kicking and just for demonstration)
                if (window['___BOT'] && window['___BOT'].room && typeof window['___BOT'].room.join === 'function') {
                     window['___BOT'].room.join(''); // This will attempt to join an empty room ID, which might cause an error but serves as an example of interacting with game objects
                } else {
                    console.error("Cannot find window['___BOT'].room or join function. Auto Kick functionality cannot proceed with this simulation.");
                }

            } else {
                console.error('WebSocket not open or available to send autoKick action.');
            }
        }
    }


    // Make an element draggable
    function makeDraggable(element) {
        let isDragging = false;
        let offsetX, offsetY;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                element.style.left = `${e.clientX - offsetX}px`;
                element.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.cursor = 'grab';
        });
    }

    // Initialize
    function init() {
        window.sockets = [];
        CreateStylesheet();
        addActionMenu();

        // Define the server URL
        let serverurl = `wss://sv2.drawaria.online/socket.io/?sid1=s%3A11JLEUID6B8TEN3-RCEDSV1h8ZzvoF3a.99s79DOPC%2Fb2ajOJBEBNkhMT0Z1FSm8jzcCGzohk%2FeI&hostname=drawaria.online&EIO=3&transport=websocket`;

        // Check if the 'this.conn.serverconnect' function exists before calling it
        if (this.conn && typeof this.conn.serverconnect === 'function') {
             this.conn.serverconnect(serverurl);
        } else {
            console.error("Could not find 'this.conn.serverconnect'. WebSocket connection might not be established correctly by the script.");
             // As a fallback, you might try to manually create a WebSocket if the game structure allows:
             let socket = new WebSocket(serverurl);
             socket.onopen = function() {
                 console.log('WebSocket connection established (fallback).');
             };
             socket.onclose = function() {
                 console.log('WebSocket connection closed (fallback).');
             };
             socket.onerror = function(error) {
                 console.error('WebSocket error (fallback):', error);
             };
             window.sockets.push(socket);
        }
    };

    var nullify = (value = null) => {
        return value == null ? null : String().concat('"', value, '"');
    };

    init();
})();