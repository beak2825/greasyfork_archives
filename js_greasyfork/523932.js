// ==UserScript==
// @name         Frozen Bot V1
// @namespace    tampermonkey.net 
// @version      1.0
// @description  Frozen bot script for gartic
// @match        *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @match        *://gartic.io/?bot*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523932/Frozen%20Bot%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/523932/Frozen%20Bot%20V1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        Rooms: [],
        userAgents: ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36", "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"],
        proxies: ["https://www.blockaway.net/"],
        playerName: "",
        roomCode: "",
        delayBetweenEntries: 1000,
        reexecutionDelay: 1900,
        randomAvatar: false,
        selectedAvatar: 0,
        settings: {
            nickName: "",
            roomCode: "",
            avatarId: 0
        }
    };

    let wsList = [];
    let isRunning = false;
    let messageInterval;
    let mainInterval;
    let afkIntervals = [];
    let isAfkPaused = false;
    let roomusers = [];
    let kickedUsers = new Set();
    let userListUpdateInterval;

    const drawCommands = [
        '[6,"11"]',
        '[5,"x000000"]',
        '[3,0,0,767,448]',
        '[5,"x26C9FF"]',
        '[2,245,64,249,67,257,75,260,81,262,89,264,96,263,105,260,114,255,121,249,127,242,132,242,132]',
        '[2,231,69,237,67,247,67,259,66,270,67,274,67]',
        '[2,311,89,311,90,309,98,308,107,307,112,306,120]',
        '[2,312,71,320,68,328,67,332,67]',
        '[2,337,119,337,119,341,114,348,106,353,99,361,88,368,80,372,74,373,73,374,72,374,73,372,77,371,85,369,97,368,107,369,115]',
        '[2,369,115,371,120,374,120,380,116,387,109,396,101,408,87,422,75,443,55,452,49]',
        '[2,217,192,217,192,218,194,221,200,224,205,226,211,227,217,229,224,230,229,231,234,231,237,232,240,232,242,233,244,233,244,233,244]',
        '[2,233,244,235,241,241,233,248,222,257,210,267,197,275,187,279,182,280,180,280,181,280,181]',
        '[2,282,190,282,190,282,192,284,198,285,206,285,214,287,221,287,228,288,236,288,242,289,246,290,249,290,250,291,250,293,248,296,241]',
        '[2,355,203,355,203,349,211,344,220,344,229,344,236,347,241,352,242,360,240,369,236,378,230,385,223,390,215,391,210,392,204,389,198]',
        '[2,296,241,304,230,312,217,321,205,328,195,332,188,334,185,337,182]',
        '[2,418,196,418,196,417,198,414,208,413,218,414,228,421,234,429,237,440,236,450,231,458,224,465,216,468,207,470,198,465,194,458,192]',
        '[2,458,192,449,192,441,194,438,196,438,196]',
        '[2,389,198,384,194,378,192,373,191,367,194,360,198]'
    ];

    window.toggleBot = toggleBot;
    window.sendMessage = sendMessage;
    window.exitFromRooms = exitFromRooms;
    window.autoDraw = autoDraw;
    window.toggleRandomAvatar = toggleRandomAvatar;
    window.updateAvatarPreview = updateAvatarPreview;
    window.applySettings = applySettings;
    window.sendReport = sendReport;


    function loadSettings() {
        const savedSettings = localStorage.getItem('frozenBotSettings');
        if(savedSettings) {
            config.settings = JSON.parse(savedSettings);
            document.querySelector('.bot-nick').value = config.settings.nickName;
            document.querySelector('.room-input').value = config.settings.roomCode;
            document.querySelector('.avatar-input').value = config.settings.avatarId;
            updateAvatarPreview(config.settings.avatarId);
            updateRoomCode();
        }
    }

    function updateUserList() {
        const userListElement = document.querySelector('.user-list');
        const botNick = document.querySelector('.bot-nick').value.trim();
        userListElement.innerHTML = '';
        const addedUsers = new Set();

        wsList.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send('42[32]');
            }
        });

        roomusers.forEach(user => {
            if (user.nick && 
                user.nick !== "Jinwoo" && 
                !addedUsers.has(user.id) && 
                !user.nick.replace(/\s+/g, '').includes(botNick.replace(/\s+/g, ''))) {
                const button = document.createElement('button');
                button.className = 'user-button';
                button.textContent = user.nick;
                button.onclick = () => kickUser(user.id, user.nick);
                userListElement.appendChild(button);
                addedUsers.add(user.id);
            }
        });
    }

    function kickUser(userId, userNick) {
        if (!kickedUsers.has(userId)) {
            wsList.forEach(ws => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(`42[11,${ws.id},"siktirgit ${userNick}"]`);
                    setTimeout(() => {
                        ws.send(`42[45,${ws.id},["${userId}",true]]`);
                        ws.send(`42[45,${ws.id},["${userId}",false]]`);
                    }, 100);
                }
            });
            kickedUsers.add(userId);
            updateUserList();
        }
    }

    function applySettings() {
        config.settings.nickName = document.querySelector('.bot-nick').value;
        config.settings.roomCode = document.querySelector('.room-input').value;
        config.settings.avatarId = parseInt(document.querySelector('.avatar-input').value) || 0;
        localStorage.setItem('frozenBotSettings', JSON.stringify(config.settings));
        updateRoomCode();
    }

    function generateInvisibleChar() {
        const invisibleChars = ['\u200B', '\u200C', '\u200D', '\u2061', '\u2062', '\u2063', '\u2064', '\u2066', '\u17b4', '\u17b5', '\u2068', '\u2069'];
        return invisibleChars[Math.floor(Math.random() * invisibleChars.length)];
    }

    function addInvisibleCharsToMessage(message) {
        let result = '';
        for (let i = 0; i < message.length; i++) {
            result += message[i] + generateInvisibleChar();
        }
        return result;
    }

    function getRandomName() {
        let name = document.querySelector('.bot-nick').value.trim();
        let result = '';
        for (let i = 0; i < name.length; i++) {
            result += name[i] + generateInvisibleChar();
        }
        result += generateInvisibleChar();
        return result.trim();
    }

    function setRandomPlayerName() {
        config.playerName = getRandomName();
    }

    function updateRoomCode() {
        const roomInput = document.querySelector('.room-input');
        const roomCode = roomInput.value.trim();
        if(roomCode) {
            config.Rooms = [roomCode];
            config.settings.roomCode = roomCode;
        }
    }

    function autoDraw() {
        isAfkPaused = true;
        setTimeout(() => { isAfkPaused = false; }, 7000);
        
        wsList.forEach(ws => {
            if(ws.readyState === WebSocket.OPEN) {
                ws.send(`42[34,${ws.id}]`);
                let index = 0;
                const drawInterval = setInterval(() => {
                    if(index < drawCommands.length) {
                        ws.send(`42[10,${ws.id},${drawCommands[index]}]`);
                        index++;
                    } else {
                        clearInterval(drawInterval);
                    }
                }, 50);
            }
        });
    }

    function exitFromRooms() {
        wsList.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(`42[11,${ws.id},"bb"]`);
                setTimeout(() => {
                    ws.send(`42[24,${ws.id}]`);
                }, 100);
            }
        });
        wsList = [];
        roomusers = [];
        updateUserList();
        kickedUsers.clear();
        document.querySelector('.bot-counter').textContent = 'Bots: 0';
    }

    function sendReport() {
        wsList.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(`42[35,${ws.id}]`);
            }
        });
    }

    async function enterRoom(roomCode) {
        setRandomPlayerName();
        try {
            const logoutResponse = await fetch("/logout");
            if (!logoutResponse.ok) throw new Error('Logout failed');

            const roomResponse = await fetch("https://gartic.io/server?check=1&v3=1&room=" + roomCode);
            if (!roomResponse.ok) throw new Error('Room check failed');

            const roomText = await roomResponse.text();
            const server = roomText.split("//")[1].split(".")[0];
            const ccode = roomText.split("c=")[1];

            const ws = new WebSocket('wss://' + server + '.gartic.io/socket.io/?c=' + ccode + '&EIO=3&transport=websocket');
            wsList.push(ws);

            ws.onopen = () => {
                let botData = {
                    v: 20000,
                    nick: getRandomName(),
                    avatar: config.randomAvatar ? Math.floor(Math.random() * 36) : config.selectedAvatar,
                    platform: 0,
                    sala: roomCode.slice(-4)
                };
                ws.send(`42[3,${JSON.stringify(botData)}]`);
            };

            ws.onmessage = (msg) => {
                if (msg.data.indexOf('42["5"') !== -1) {
                    let objlist = JSON.parse('["5"' + msg.data.split('42["5"')[1]);
                    ws.id = objlist[2];
                    roomusers = objlist[5];
                    updateUserList();
                    updateBotCounter();
                    startAntiAfk(ws.id);
                    setTimeout(() => {
                        ws.send(`42[11,${ws.id},"sa"]`);
                    }, 10);
                }
                if (msg.data.indexOf('42["23"') !== -1) {
                    let user = JSON.parse("{" + msg.data.split("{")[1].split("}")[0] + "}");
                    if (!roomusers.some(existingUser => existingUser.id === user.id)) {
                        roomusers.push(user);
                        updateUserList();
                    }
                }
                if (msg.data.indexOf('42["24"') !== -1) {
                    let userId = msg.data.split(",")[1].split('"')[1];
                    roomusers = roomusers.filter(u => u.id !== userId);
                    updateUserList();
                }
                if (msg.data.indexOf('42["33"') !== -1) {
                    try {
                        let userList = JSON.parse(msg.data.split('42["33",')[1]);
                        roomusers = userList;
                        updateUserList();
                    } catch(e) {
                        console.error(e);
                    }
                }
            };
        } catch (error) {
            console.error(error);
        }
    }

    function startAntiAfk(botId) {
        const interval = setInterval(() => {
            if (!isAfkPaused) {
                wsList.forEach(ws => {
                    if (ws.readyState === WebSocket.OPEN && ws.id === botId) {
                        ws.send(`42[25,${botId}]`);
                    }
                });
            }
        }, 5000);
        afkIntervals.push(interval);
    }

    function updateBotCounter() {
        let botCounter = document.querySelector('.bot-counter');
        let currentBots = parseInt(botCounter.textContent.split(': ')[1]);
        botCounter.textContent = `Bots: ${currentBots + 1}`;
    }

    function toggleRandomAvatar() {
        const switch_elem = document.querySelector('.avatar-switch input');
        const avatar_input = document.querySelector('.avatar-input');
        config.randomAvatar = switch_elem.checked;
        avatar_input.disabled = config.randomAvatar;
        if(config.randomAvatar) {
            avatar_input.value = '';
            updateAvatarPreview('');
        }
    }

    function updateAvatarPreview(value) {
        const preview = document.querySelector('.avatar-preview');
        const numValue = parseInt(value);
        if(numValue >= 0 && numValue <= 36) {
            preview.src = `https://gartic.io/static/images/avatar/svg/${numValue}.svg`;
            preview.style.display = 'inline';
            config.selectedAvatar = numValue;
            config.settings.avatarId = numValue;
        } else {
            preview.style.display = 'none';
        }
    }

    function sendMessage() {
        const messageInput = document.querySelector('.message-input');
        const message = messageInput.value;
        if (message && wsList.length > 0) {
            const firstBot = wsList[0];
            if (firstBot && firstBot.readyState === WebSocket.OPEN) {
                firstBot.send(`42[11,${firstBot.id},"${addInvisibleCharsToMessage(message)}"]`);
            }
        }
    }

    function toggleBot() {
        const toggleButton = document.querySelector('.toggle-button');
        isRunning = !isRunning;
        toggleButton.textContent = isRunning ? 'Stop Bots' : 'Start Bots';
        toggleButton.style.backgroundColor = isRunning ? '#ff4444' : '#4CAF50';

        if (isRunning) {
            enterAllRooms();
            mainInterval = setInterval(enterAllRooms, config.reexecutionDelay);
        } else {
            clearInterval(mainInterval);
        }
    }

    async function enterAllRooms() {
        if (!isRunning) return;
        for (const roomCode of config.Rooms) {
            await enterRoom(roomCode);
            await new Promise(resolve => setTimeout(resolve, config.delayBetweenEntries));
        }
    }

    function createGUI() {
        const css = `
            .frozen-bot {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #0c1d3b 0%, #1a3b7c 100%);
                padding: 20px;
                color: #fff;
                font-family: 'Arial', sans-serif;
                z-index: 9999;
                overflow-y: auto;
            }

            .bot-container {
                max-width: 1200px;
                margin: 0 auto;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                padding: 20px;
            }

            .control-panel, .user-panel {
                background: rgba(255, 255, 255, 0.1);
                padding: 20px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
            }

            .frozen-bot input {
                width: 100%;
                padding: 12px;
                margin: 8px 0;
                border: none;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.15);
                color: #fff;
                font-size: 16px;
            }

            .frozen-bot button {
                width: 100%;
                padding: 12px;
                margin: 8px 0;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-size: 16px;
                transition: all 0.3s ease;
            }

            .user-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 10px;
                max-height: 600px;
                overflow-y: auto;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }

            .user-button {
                background: linear-gradient(135deg, #1a3b7c 0%, #0c1d3b 100%);
                color: #89CFF0;
                padding: 10px;
                border-radius: 8px;
                font-size: 14px;
                text-align: center;
                margin: 0;
            }

            h2 {
                color: #89CFF0;
                text-align: center;
                margin-bottom: 15px;
                text-shadow: 0 0 10px rgba(137, 207, 240, 0.5);
            }

            .toggle-button { background: #4CAF50; color: white; }
            .send-button { background: #2196F3; color: white; }
            .exit-button { background: #f44336; color: white; }
            .report-button { background: #E91E63; color: white; }
            .draw-button { background: #9C27B0; color: white; }
            .apply-button { background: #FF9800; color: white; }

            .bot-counter {
                text-align: center;
                margin: 10px 0;
                font-size: 1.2em;
                color: #89CFF0;
            }

            .avatar-container {
                display: flex;
                align-items: center;
                margin: 10px 0;
                gap: 10px;
            }

            .avatar-input { width: 60px !important; }

            .avatar-switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 34px;
            }

            .avatar-preview {
                width: 30px;
                height: 30px;
                display: none;
            }

            .avatar-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 34px;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }

            input:checked + .slider { background-color: #2196F3; }
            input:checked + .slider:before { transform: translateX(26px); }
        `;

        const html = `
            <div class="frozen-bot">
                <div class="bot-container">
                    <div class="control-panel">
                        <h2>❄️ Frozen Bot Control Panel ❄️</h2>
                        <div class="bot-counter">Bots: 0</div>
                        <input type="text" class="room-input" placeholder="Enter Room Code..." oninput="updateRoomCode()">
                        <input type="text" class="message-input" placeholder="Enter message...">
                        <button class="send-button" onclick="window.sendMessage()">Send Message</button>
                        <input type="text" class="bot-nick" placeholder="Bot Nick...">
                        <div class="avatar-container">
                            <input type="number" class="avatar-input" placeholder="Avatar" min="0" max="36" oninput="window.updateAvatarPreview(this.value)">
                            <label class="avatar-switch">
                                <input type="checkbox" onchange="window.toggleRandomAvatar()">
                                <span class="slider"></span>
                            </label>
                            <span style="color: #89CFF0;">Random Avatar</span>
                            <img class="avatar-preview">
                        </div>
                        <button class="apply-button" onclick="window.applySettings()">Apply Settings</button>
                        <button class="toggle-button" onclick="window.toggleBot()">Start Bots</button>
                        <button class="exit-button" onclick="window.exitFromRooms()">Exit Room</button>
                        <button class="report-button" onclick="window.sendReport()">Report</button>
                        <button class="draw-button" onclick="window.autoDraw()">AUTO DRAW</button>
                    </div>
                    <div class="user-panel">
                        <h2>👥 User List</h2>
                        <div class="user-list"></div>
                    </div>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);
    }

    function init() {
        createGUI();
        loadSettings();
        userListUpdateInterval = setInterval(updateUserList, 100);
    }

    init();
})();