// ==UserScript==
// @name         Drawaria Moderator Menu With Tools
// @namespace    drawaria.moderator.tool
// @version      3.0
// @description  Enhanced real-time moderator tool for Drawaria with additional features, custom chat messages, and improved visuals
// @author       YouTube And Minish
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524464/Drawaria%20Moderator%20Menu%20With%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/524464/Drawaria%20Moderator%20Menu%20With%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initialize data structures
    const bannedPlayers = new Set();
    const mutedPlayers = new Set();
    const reportedPlayers = [];
    const warnedPlayers = new Map();
    const suspiciousPlayers = new Set();

    // Style definitions
    const styles = `
        #moderatorMenuContainer {
            position: fixed;
            bottom: 60px;
            right: 10px;
            z-index: 1000;
            background-color: #333;
            border-radius: 5px;
            padding: 0;
            color: white;
            width: 250px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            cursor: move;
            font-family: Arial, sans-serif;
        }
        #moderatorMenuTitle {
            padding: 10px;
            background-color: #555;
            border-radius: 5px 5px 0 0;
            text-align: center;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #moderatorMenuContent {
            padding: 10px;
            display: none;
        }
        .menuButton {
            display: block;
            width: 100%;
            margin-bottom: 5px;
            padding: 10px;
            background-color: #444;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
            text-align: left;
        }
        .menuButton:hover {
            background-color: #666;
        }
        .menuButton i {
            margin-right: 10px;
        }
        .playerList {
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #555;
            border-radius: 5px;
            margin-top: 10px;
        }
        .playerListItem {
            padding: 5px;
            border-bottom: 1px solid #555;
        }
        .highlight {
            background-color: #ff9999;
        }
    `;

    // Create the moderator menu
    function createModeratorMenu() {
        const menuContainer = document.createElement('div');
        menuContainer.id = 'moderatorMenuContainer';
        document.body.appendChild(menuContainer);

        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);

        const menuTitle = document.createElement('div');
        menuTitle.id = 'moderatorMenuTitle';
        menuTitle.innerHTML = '<span>Moderator Menu</span><span id="toggleArrow">▼</span>';
        menuContainer.appendChild(menuTitle);

        const menuContent = document.createElement('div');
        menuContent.id = 'moderatorMenuContent';
        menuContainer.appendChild(menuContent);

        menuTitle.addEventListener('click', () => {
            menuContent.style.display = menuContent.style.display === 'none' ? 'block' : 'none';
            const toggleArrow = document.getElementById('toggleArrow');
            toggleArrow.innerText = menuContent.style.display === 'none' ? '▼' : '▲';
        });

        // Add buttons to the menu
        addMenuButton(menuContent, '<i class="fas fa-ban"></i> Ban Player', handleBanButtonClick);
        addMenuButton(menuContent, '<i class="fas fa-undo"></i> Unban Player', handleUnbanButtonClick);
        addMenuButton(menuContent, '<i class="fas fa-volume-mute"></i> Mute Player', handleMuteButtonClick);
        addMenuButton(menuContent, '<i class="fas fa-volume-up"></i> Unmute Player', handleUnmuteButtonClick);
        addMenuButton(menuContent, '<i class="fas fa-exclamation-triangle"></i> Warn Player', handleWarnButtonClick);
        addMenuButton(menuContent, '<i class="fas fa-flag"></i> Report Player', handleReportButtonClick);
        addMenuButton(menuContent, '<i class="fas fa-eye"></i> View Reports', handleViewReportsClick);
        addMenuButton(menuContent, '<i class="fas fa-users"></i> View Banned Players', handleViewBannedPlayersClick);
        addMenuButton(menuContent, '<i class="fas fa-microphone-alt-slash"></i> View Muted Players', handleViewMutedPlayersClick);
        addMenuButton(menuContent, '<i class="fas fa-user-times"></i> Kick Player', handleKickButtonClick);
        addMenuButton(menuContent, '<i class="fas fa-exclamation"></i> Highlight Suspicious', handleHighlightSuspiciousClick);

        // Create player lists
        createPlayerList(menuContent, 'bannedPlayersList', 'Banned Players');
        createPlayerList(menuContent, 'mutedPlayersList', 'Muted Players');
        createPlayerList(menuContent, 'warnedPlayersList', 'Warned Players');
        createPlayerList(menuContent, 'reportedPlayersList', 'Reported Players');
        createPlayerList(menuContent, 'suspiciousPlayersList', 'Suspicious Players');

        // Make the menu draggable
        makeDraggable(menuContainer);
    }

    // Add a button to the menu
    function addMenuButton(menu, text, onClick) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.className = 'menuButton';
        button.addEventListener('click', onClick);
        menu.appendChild(button);
    }

    // Create a player list
    function createPlayerList(menu, id, title) {
        const listTitle = document.createElement('h3');
        listTitle.textContent = title;
        menu.appendChild(listTitle);

        const listContainer = document.createElement('div');
        listContainer.id = id;
        listContainer.className = 'playerList';
        menu.appendChild(listContainer);
    }

    // Function to handle the "Ban" button click event
    function handleBanButtonClick() {
        const nickname = prompt("Enter the player's nickname to ban:");

        if (nickname) {
            bannedPlayers.add(nickname);
            addModeratorMessages(nickname, 'Ban');
            removePlayer(nickname);
            updatePlayerList();
            disableChatWithUser(nickname);
            broadcastBanMessage(nickname);
            updateBannedPlayersList();
        }
    }

    // Function to handle the "Unban" button click event
    function handleUnbanButtonClick() {
        const nickname = prompt("Enter the player's nickname to unban:");

        if (nickname) {
            if (bannedPlayers.has(nickname)) {
                bannedPlayers.delete(nickname);
                addModeratorMessages(nickname, 'Unban');
                updatePlayerList();
                enableChatWithUser(nickname);
                broadcastUnbanMessage(nickname);
                updateBannedPlayersList();
            } else {
                alert('Player is not banned.');
            }
        }
    }

    // Function to handle the "Mute" button click event
    function handleMuteButtonClick() {
        const nickname = prompt("Enter the player's nickname to mute:");

        if (nickname) {
            mutedPlayers.add(nickname);
            addModeratorMessages(nickname, 'Mute');
            disableChatWithUser(nickname);
            updateMutedPlayersList();
        }
    }

    // Function to handle the "Unmute" button click event
    function handleUnmuteButtonClick() {
        const nickname = prompt("Enter the player's nickname to unmute:");

        if (nickname) {
            if (mutedPlayers.has(nickname)) {
                mutedPlayers.delete(nickname);
                addModeratorMessages(nickname, 'Unmute');
                enableChatWithUser(nickname);
                updateMutedPlayersList();
            } else {
                alert('Player is not muted.');
            }
        }
    }

    // Function to handle the "Warn" button click event
    function handleWarnButtonClick() {
        const nickname = prompt("Enter the player's nickname to warn:");
        const reason = prompt("Enter the reason for the warning:");

        if (nickname && reason) {
            if (warnedPlayers.has(nickname)) {
                warnedPlayers.set(nickname, warnedPlayers.get(nickname) + 1);
            } else {
                warnedPlayers.set(nickname, 1);
            }
            addModeratorMessages(nickname, 'Warn', reason);
            updateWarnedPlayersList();
            if (warnedPlayers.get(nickname) >= 3) {
                if (confirm(`Player ${nickname} has 3 warnings. Do you want to ban them?`)) {
                    handleBanButtonClick(nickname);
                }
            }
        }
    }

    // Function to handle the "Report" button click event
    function handleReportButtonClick() {
        const nickname = prompt("Enter the player's nickname to report:");
        const reason = prompt("Enter the reason for the report:");

        if (nickname && reason) {
            reportedPlayers.push({ nickname, reason, timestamp: new Date() });
            addModeratorMessages(nickname, 'Report', reason);
            updateReportedPlayersList();
        }
    }

    // Function to handle the "View Reports" button click event
    function handleViewReportsClick() {
        const sortedReports = reportedPlayers.sort((a, b) => b.timestamp - a.timestamp);
        const reports = sortedReports.map(player => `${player.nickname}: ${player.reason} (at ${player.timestamp.toLocaleString()})`).join('\n');
        alert(reports || 'No reports available.');
    }

    // Function to handle the "View Banned Players" button click event
    function handleViewBannedPlayersClick() {
        const banned = Array.from(bannedPlayers).join('\n');
        alert(banned || 'No banned players.');
    }

    // Function to handle the "View Muted Players" button click event
    function handleViewMutedPlayersClick() {
        const muted = Array.from(mutedPlayers).join('\n');
        alert(muted || 'No muted players.');
    }

    // Function to handle the "Kick" button click event
    function handleKickButtonClick() {
        const nickname = prompt("Enter the player's nickname to kick:");

        if (nickname) {
            addModeratorMessages(nickname, 'Kick');
            removePlayer(nickname);
            updatePlayerList();
            broadcastKickMessage(nickname);
        }
    }

    // Function to handle the "Highlight Suspicious" button click event
    function handleHighlightSuspiciousClick() {
        const nickname = prompt("Enter the player's nickname to highlight as suspicious:");

        if (nickname) {
            suspiciousPlayers.add(nickname);
            highlightPlayer(nickname);
            updateSuspiciousPlayersList();
        }
    }

    // Function to add moderator messages with custom formatting
    function addModeratorMessages(nickname, action, additionalInfo = '') {
        const chatBox = document.getElementById('chatbox_messages');

        if (chatBox) {
            let messages = [];

            if (action === 'Ban') {
                messages = [
                    `<div class="chatmessage systemchatmessage5" data-ts="${Date.now()}">Moderator: Banned ${nickname}</div>`,
                    `<div class="chatmessage systemchatmessage7" data-ts="${Date.now()}">Complain about the moderator on Discord, on this channel: <a href="https://discord.gg/XeVKWWs" target="_blank">#report-a-moderator</a></div>`,
                    `<div class="chatmessage systemchatmessage" data-ts="${Date.now()}">Someone voted to ban from the room: ${nickname}</div>`,
                    `<div class="chatmessage systemchatmessage" data-ts="${Date.now()}">${nickname} has been banned from the room!</div>`,
                    `<div class="chatmessage systemchatmessage7" data-ts="${Date.now()}">${nickname} - player has left the room</div>`
                ];
            } else if (action === 'Unban') {
                messages = [
                    `<div class="chatmessage systemchatmessage5" data-ts="${Date.now()}">Moderator: Unbanned ${nickname}</div>`,
                    `<div class="chatmessage systemchatmessage" data-ts="${Date.now()}">${nickname} has been unbanned from the room!</div>`
                ];
            } else if (action === 'Mute') {
                messages = [
                    `<div class="chatmessage systemchatmessage5" data-ts="${Date.now()}">Moderator: Muted ${nickname}</div>`,
                    `<div class="chatmessage systemchatmessage" data-ts="${Date.now()}">${nickname} has been muted in the room!</div>`
                ];
            } else if (action === 'Unmute') {
                messages = [
                    `<div class="chatmessage systemchatmessage5" data-ts="${Date.now()}">Moderator: Unmuted ${nickname}</div>`,
                    `<div class="chatmessage systemchatmessage" data-ts="${Date.now()}">${nickname} has been unmuted in the room!</div>`
                ];
            } else if (action === 'Warn') {
                messages = [
                    `<div class="chatmessage systemchatmessage5" data-ts="${Date.now()}">Moderator: Warned ${nickname} for: ${additionalInfo}</div>`,
                    `<div class="chatmessage systemchatmessage" data-ts="${Date.now()}">${nickname} has been warned! (${warnedPlayers.get(nickname)}/3)</div>`
                ];
            } else if (action === 'Report') {
                messages = [
                    `<div class="chatmessage systemchatmessage5" data-ts="${Date.now()}">Moderator: Reported ${nickname}</div>`,
                    `<div class="chatmessage systemchatmessage" data-ts="${Date.now()}">${nickname} has been reported for: ${additionalInfo}</div>`
                ];
            } else if (action === 'Kick') {
                messages = [
                    `<div class="chatmessage systemchatmessage5" data-ts="${Date.now()}">Moderator: Kicked ${nickname}</div>`,
                    `<div class="chatmessage systemchatmessage" data-ts="${Date.now()}">${nickname} has been kicked from the room!</div>`
                ];
            }

            messages.forEach(message => {
                chatBox.innerHTML += message;
            });
        }
    }

    // Function to remove a player from the list
    function removePlayer(nickname) {
        const playerList = document.getElementById('playerlist');

        if (playerList) {
            const playerToRemove = Array.from(playerList.querySelectorAll('.playerlist-row')).find(player => {
                const nameElement = player.querySelector('.playerlist-name a');
                return nameElement && nameElement.textContent.trim() === nickname;
            });

            if (playerToRemove) {
                playerToRemove.remove();
            }
        }
    }

    // Function to update the player list
    function updatePlayerList() {
        const playerList = document.getElementById('playerlist');

        if (playerList) {
            Array.from(playerList.querySelectorAll('.playerlist-row')).forEach(player => {
                const nameElement = player.querySelector('.playerlist-name a');
                if (nameElement) {
                    const playerName = nameElement.textContent.trim();
                    if (bannedPlayers.has(playerName)) {
                        player.remove();
                    }
                }
            });
        }
    }

    // Function to sanitize nickname for use in CSS selectors
    function sanitizeNickname(nickname) {
        return nickname.replace(/[^a-zA-Z0-9]/g, '');
    }

    // Function to disable chat with the banned player
    function disableChatWithUser(nickname) {
        const sanitizedNickname = sanitizeNickname(nickname);
        const chatWithUser = document.querySelector(`.chat-with-${sanitizedNickname}`);

        if (chatWithUser) {
            chatWithUser.style.display = 'none';
        }
    }

    // Function to enable chat with the unbanned player
    function enableChatWithUser(nickname) {
        const sanitizedNickname = sanitizeNickname(nickname);
        const chatWithUser = document.querySelector(`.chat-with-${sanitizedNickname}`);

        if (chatWithUser) {
            chatWithUser.style.display = 'block';
        }
    }

    // Function to broadcast the ban message to all players
    function broadcastBanMessage(nickname) {
        if (window.myRoom.players && Array.isArray(window.myRoom.players)) {
            const message = JSON.stringify([
                "bc_uc_freedrawsession_changedroom",
                null,
                null,
                window.myRoom.players.filter(player => player.nickname !== nickname)
            ]);
            sendMessageToAll(`42${message}`);
        }
    }

    // Function to broadcast the unban message to all players
    function broadcastUnbanMessage(nickname) {
        if (window.myRoom.players && Array.isArray(window.myRoom.players)) {
            const message = JSON.stringify([
                "bc_uc_freedrawsession_changedroom",
                null,
                null,
                window.myRoom.players
            ]);
            sendMessageToAll(`42${message}`);
        }
    }

    // Function to broadcast the kick message to all players
    function broadcastKickMessage(nickname) {
        if (window.myRoom.players && Array.isArray(window.myRoom.players)) {
            const message = JSON.stringify([
                "bc_uc_freedrawsession_changedroom",
                null,
                null,
                window.myRoom.players.filter(player => player.nickname !== nickname)
            ]);
            sendMessageToAll(`42${message}`);
        }
    }

    // Function to update the banned players list
    function updateBannedPlayersList() {
        updatePlayerListContainer('bannedPlayersList', Array.from(bannedPlayers));
    }

    // Function to update the muted players list
    function updateMutedPlayersList() {
        updatePlayerListContainer('mutedPlayersList', Array.from(mutedPlayers));
    }

    // Function to update the warned players list
    function updateWarnedPlayersList() {
        const warnedList = Array.from(warnedPlayers).map(([name, count]) => `${name} (${count}/3)`);
        updatePlayerListContainer('warnedPlayersList', warnedList);
    }

    // Function to update the reported players list
    function updateReportedPlayersList() {
        const reportedList = reportedPlayers.map(player => `${player.nickname}: ${player.reason}`);
        updatePlayerListContainer('reportedPlayersList', reportedList);
    }

    // Function to update the suspicious players list
    function updateSuspiciousPlayersList() {
        updatePlayerListContainer('suspiciousPlayersList', Array.from(suspiciousPlayers));
    }

    // Generic function to update player list containers
    function updatePlayerListContainer(containerId, playerList) {
        const listContainer = document.getElementById(containerId);
        if (listContainer) {
            listContainer.innerHTML = '';
            playerList.forEach(player => {
                const playerItem = document.createElement('div');
                playerItem.textContent = player;
                playerItem.className = 'playerListItem';
                listContainer.appendChild(playerItem);
            });
        }
    }

    // Function to highlight a suspicious player
    function highlightPlayer(nickname) {
        const playerList = document.getElementById('playerlist');
        if (playerList) {
            const playerToHighlight = Array.from(playerList.querySelectorAll('.playerlist-row')).find(player => {
                const nameElement = player.querySelector('.playerlist-name a');
                return nameElement && nameElement.textContent.trim() === nickname;
            });

            if (playerToHighlight) {
                playerToHighlight.classList.add('highlight');
            }
        }
    }

    // WebSocket handling
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (window.sockets.indexOf(this) === -1) {
            window.sockets.push(this);

            if (window.sockets.indexOf(this) === 0) {
                this.addEventListener('message', handleIncomingMessage);
            }
        }

        return originalSend.call(this, ...args);
    };

    // Initialize
    createModeratorMenu();

    // Room & Socket Control
    window.myRoom = {
        players: []
    };
    window.sockets = [];

    // Ensure the WebSocket messages are correctly formatted and sent to all players
    function sendMessageToAll(message) {
        window.sockets.forEach(socket => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(message);
            }
        });
    }

    // Function to handle incoming WebSocket messages
    function handleIncomingMessage(event) {
        let message = String(event.data);

        if (message.startsWith('42')) {
            let payload = JSON.parse(message.slice(2));

            if (payload[0] == 'bc_uc_freedrawsession_changedroom' || payload[0] == 'mc_roomplayerschange') {
                window.myRoom.players = payload[3];
                updatePlayerList();
                updateBannedPlayersList();
                updateMutedPlayersList();
                updateWarnedPlayersList();
                updateReportedPlayersList();
                updateSuspiciousPlayersList();
            }
        } else if (message.startsWith('430')) {
            let configs = JSON.parse(message.slice(3))[0];
            window.myRoom.players = configs.players;
            window.myRoom.id = configs.roomid;
            updatePlayerList();
            updateBannedPlayersList();
            updateMutedPlayersList();
            updateWarnedPlayersList();
            updateReportedPlayersList();
            updateSuspiciousPlayersList();
        }
    }

    // Connect to the WebSocket server
    function connectToWebSocketServer() {
        const socket = new WebSocket('wss://sv3.drawaria.online/socket.io/?sid1=s%3A11JLEUID6B8TEN3-RCEDSV1h8ZzvoF3a.99s79DOPC%2Fb2ajOJBEBNkhMT0Z1FSm8jzcCGzohk%2FeI&hostname=drawaria.online&EIO=3&transport=websocket');

        socket.onopen = () => {
            console.log('WebSocket connection opened');
            window.sockets.push(socket);
            socket.addEventListener('message', handleIncomingMessage);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
            window.sockets = window.sockets.filter(s => s !== socket);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    // Connect to the WebSocket server
    connectToWebSocketServer();

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
                element.style.bottom = 'auto';
                element.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.cursor = 'move';
        });
    }

    // Add custom chat commands for moderators
    function addCustomChatCommands() {
        const originalSendChat = window.sendChat;
        window.sendChat = function(message) {
            if (message.startsWith('/')) {
                const [command, ...args] = message.slice(1).split(' ');
                handleChatCommand(command, args);
            } else {
                originalSendChat.call(this, message);
            }
        };
    }

    // Handle custom chat commands
    function handleChatCommand(command, args) {
        switch(command.toLowerCase()) {
            case 'ban':
                if (args.length > 0) {
                    handleBanButtonClick(args.join(' '));
                }
                break;
            case 'unban':
                if (args.length > 0) {
                    handleUnbanButtonClick(args.join(' '));
                }
                break;
            case 'mute':
                if (args.length > 0) {
                    handleMuteButtonClick(args.join(' '));
                }
                break;
            case 'unmute':
                if (args.length > 0) {
                    handleUnmuteButtonClick(args.join(' '));
                }
                break;
            case 'kick':
                if (args.length > 0) {
                    handleKickButtonClick(args.join(' '));
                }
                break;
            case 'warn':
                if (args.length > 1) {
                    handleWarnButtonClick(args[0], args.slice(1).join(' '));
                }
                break;
            case 'report':
                if (args.length > 1) {
                    handleReportButtonClick(args[0], args.slice(1).join(' '));
                }
                break;
            case 'highlight':
                if (args.length > 0) {
                    handleHighlightSuspiciousClick(args.join(' '));
                }
                break;
            default:
                addModeratorMessages('System', 'Unknown command', `Unknown command: /${command}`);
        }
    }

    // Initialize custom chat commands
    addCustomChatCommands();

})();
