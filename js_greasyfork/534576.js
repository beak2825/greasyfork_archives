// ==UserScript==
// @name         Zed Live Chat
// @license GNU GPLv3
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Adds a live chat box to Zed City
// @author       chee
// @match        https://www.zed.city/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zed.city
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534576/Zed%20Live%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/534576/Zed%20Live%20Chat.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const styles = `
        #chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            height: 400px;
            min-width: 250px;
            min-height: 30px;
            background: #151619;
            color: #eee;
            font-size: 12px;
            border: 1px solid #3E4144;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            z-index: 9999;
            transition: height 0.3s ease;
            overflow: hidden;
        }
        .mention-highlight {
            background-color: #2a5d8a;
            color: #fff;
            font-weight: bold;
            padding: 0 3px;
            border-radius: 3px;
        }
        .badge {
            background: red;
            color: white;
            border-radius: 10px;
            padding: 0 6px;
            font-size: 10px;
            margin-left: 6px;
        }
        #chat-tabs {
            display: flex;
            background: #2b2b2b;
        }
        .chat-tab {
            flex: 1;
            text-align: center;
            padding: 8px 0;
            cursor: pointer;
            user-select: none;
            border-bottom: 2px solid transparent;
        }
        .chat-tab.active {
            border-bottom: 2px solid #00aaff;
            background: #393a3d;
        }
        #chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 8px;
            background: #111;
            word-wrap: break-word;
            overflow-x: hidden;
        }
        #chat-messages div {
            overflow-wrap: break-word;
            word-break: break-word;
        }
        #chat-input {
            display: flex;
            border-top: 1px solid #555;
            background: #3F4245;
        }
        #chat-input input {
            flex: 1;
            padding: 8px;
            border: none;
            background: #222;
            color: #eee;
            font-size: 12px;
            outline: none;
        }
        #chat-input button {
            background: #2C2D30;
            color: #fff;
            border: none;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 12px;
        }
        #chat-input button:hover {
            background: #393a3d;
        }
        #last-message-display {
            white-space: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 0px 30px 0px 10px;
            font-size: 12px;
            display: none;
            height: 30px;
            line-height: 30px;
            overflow-wrap: break-word;
            word-break: break-word;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // html for chat box
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    chatContainer.innerHTML = `
        <div id="chat-tabs">
            <div class="chat-tab active" id="tab-global">Global <span class="badge" id="badge-global" style="display:none;">0</span></div>
            <div class="chat-tab" id="tab-faction">Faction <span class="badge" id="badge-faction" style="display:none;">0</span></div>
        </div>
        <div id="last-message-display"></div>
        <div id="chat-messages"></div>
        <div id="chat-input">
            <input type="text" id="chat-message-input" placeholder="Type a message...">
            <button id="chat-send-btn">Send</button>
        </div>
    `;
    document.body.appendChild(chatContainer);

    const chatMessages = document.getElementById('chat-messages');
    const lastMessageDisplay = document.getElementById('last-message-display');
    const inputField = document.getElementById('chat-message-input');
    const sendButton = document.getElementById('chat-send-btn');
    const factionTab = document.getElementById('tab-faction');
    const globalTab = document.getElementById('tab-global');
    const chatTabs = document.getElementById('chat-tabs');

    // chat state
    let currentTab = "global";
    const chatHistory = { global: [], faction: [] };
    const chatUnreadCount = { global: 0, faction: 0 };

    // chat tabs logic
    factionTab.addEventListener('click', () => setActiveTab('faction'));
    globalTab.addEventListener('click', () => setActiveTab('global'));

    function setActiveTab(tab) {
        currentTab = tab;
        factionTab.classList.toggle('active', tab === 'faction');
        globalTab.classList.toggle('active', tab === 'global');

        chatUnreadCount[tab] = 0;
        updateBadge(tab);
        chatMessages.innerHTML = '';
        if (chatHistory[tab]) {
            for (const msg of chatHistory[tab]) {
                const processedMessage = processMessageText(msg.message);
                const messageElem = document.createElement('div');
                messageElem.innerHTML = `<strong>${msg.sender}:</strong> ${processedMessage}`;
                chatMessages.appendChild(messageElem);
                if (msg.timestamp) {
                    const timeElem = document.createElement('div');
                    timeElem.style.fontSize = '10px';
                    timeElem.style.color = '#888';
                    timeElem.style.marginBottom = '4px';
                    timeElem.textContent = new Date(msg.timestamp).toLocaleString();
                    chatMessages.appendChild(timeElem);
                }
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;
            updateLastMessageDisplay(tab);
        }
    }

    // html & logic for minimize button
    const minimizeBtn = document.createElement('button');
    minimizeBtn.innerHTML = '−';
    minimizeBtn.style.cssText = `
        position: absolute;
        top: 2px;
        right: 8px;
        background: #444;
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 2px 8px 2px 8px;
        cursor: pointer;
        z-index: 10000;
    `;
    chatContainer.appendChild(minimizeBtn);

    let isMinimized = false;
    minimizeBtn.onclick = () => {
        isMinimized = !isMinimized;
        chatContainer.style.height = isMinimized ? '30px' : '400px';
        chatTabs.style.display = isMinimized ? 'none' : 'flex';
        chatMessages.style.display = isMinimized ? 'none' : 'block';
        inputField.parentElement.style.display = isMinimized ? 'none' : 'flex';
        lastMessageDisplay.style.display = isMinimized ? 'block' : 'none';
        minimizeBtn.innerHTML = isMinimized ? '+' : '−';

        if (isMinimized) {
            updateLastMessageDisplay(currentTab);
        } else {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    };

    // chat notification logic
    const badgeGlobal = document.getElementById('badge-global');
    const badgeFaction = document.getElementById('badge-faction');

    // badge update
    function updateBadge(channel) {
        const badge = channel === 'global' ? badgeGlobal : badgeFaction;
        const count = chatUnreadCount[channel];
        badge.innerText = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }

    // small message display when minimized
    function updateLastMessageDisplay(tab) {
        if (chatHistory[tab] && chatHistory[tab].length > 0) {
            const lastMsg = chatHistory[tab][chatHistory[tab].length - 1];
            const processedMessage = processMessageText(lastMsg.message);
            lastMessageDisplay.innerHTML = `<strong>${lastMsg.sender}:</strong> ${processedMessage}`;
        } else {
            lastMessageDisplay.textContent = 'No messages yet';
        }
    }

    // highlight @mentions
    function processMessageText(messageText) {
        if (username) {
            const mentionPattern = new RegExp(`(@${username}\\b)`, 'gi');
            return messageText.replace(mentionPattern, '<span class="mention-highlight">$1</span>');
        }
        return messageText;
    }

    // display messages logic
    function displayMessage(sender, message, channel, timestamp = null) {
        if (!chatHistory[channel]) chatHistory[channel] = [];
        chatHistory[channel].push({ sender, message, timestamp });

        if (channel !== currentTab) {
            chatUnreadCount[channel]++;
            updateBadge(channel);
            return;
        }

        updateLastMessageDisplay(channel);
        const processedMessage = processMessageText(message);
        const messageElem = document.createElement('div');
        messageElem.innerHTML = `<strong>${sender}:</strong> ${processedMessage}`;
        chatMessages.appendChild(messageElem);

        if (timestamp) {
            const timeElem = document.createElement('div');
            timeElem.style.fontSize = '10px';
            timeElem.style.color = '#888';
            timeElem.style.marginBottom = '4px';
            timeElem.textContent = new Date(timestamp).toLocaleString();
            chatMessages.appendChild(timeElem);
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // websocket connection
    let socket = null;
    let username = null;
    let in_faction = null;

    function connectWebSocket() {
        const prod_url = 'wss://zed.chee-api.com/api/chat/ws'; // My server, its limited and can go down at any point.
        
        socket = new WebSocket(prod_url);

        socket.onopen = () => {
            console.log('[Live Chat Addon] Connected');
            displayMessage('System', 'Connected to chat server', 'global');

            if (username && in_faction !== null) {
                socket.send(JSON.stringify({
                    username: username,
                    in_faction: in_faction
                }));
                console.log(`[Live Chat Addon] Found user data: ${username}, faction: ${in_faction}`);
            } else {
                console.log('[Live Chat Addon] Missing user data on connection');
                displayMessage('System', 'Missing user data. Please refresh the page.', 'global');
            }
        };

        socket.onmessage = (event) => {
            //console.log('[Live Chat Addon] Received:', event.data);
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'message') {
                    displayMessage(data.sender, data.message, data.channel, data.timestamp);
                } else if (data.type === 'history' && Array.isArray(data.messages)) {
                    for (const msg of data.messages) {
                        displayMessage(msg.sender, msg.message, data.channel, msg.timestamp);
                    }
                }
            } catch (e) {
                console.log('[Live Chat Addon] Parsing plain text message:', event.data);
                const match = event.data.match(/^(GLOBAL|FACTION): ([^:]+): (.+)$/);
                if (match) {
                    const channel = match[1].toLowerCase();
                    const sender = match[2];
                    const message = match[3];
                    // displayMessage(sender, message, channel);
                } else {
                    displayMessage('System', event.data, 'global');
                }
            }
        };
        socket.onclose = () => {
            console.log('[Live Chat Addon] Disconnected');
            displayMessage('System', 'Disconnected from chat server. Reconnecting...', 'global');
            socket = null;
            setTimeout(connectWebSocket, 3000);
        };

        socket.onerror = (error) => {
            console.error('[Live Chat Addon] WebSocket error:', error);
            displayMessage('System', 'Connection error', 'global');
        };
    }

    sendButton.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = inputField.value.trim();
        if (!message) return;
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            displayMessage('System', 'Not connected to chat server', 'global');
            return;
        }
        let formattedMessage;
        if (currentTab === 'faction') {
            formattedMessage = `/faction ${message}`;
        } else {
            formattedMessage = message;
        }

        socket.send(formattedMessage);
        inputField.value = '';
    }

    function handleUserData(userData) {
        if (!userData || !userData.username || userData.in_faction === undefined) {
            console.log('[Live Chat Addon] Received incomplete user data');
            return false;
        }
        const isNewUser = username !== userData.username;
        const isNewFaction = in_faction !== userData.in_faction;
        username = userData.username;
        in_faction = userData.in_faction;

        const isSocketConnected = socket && socket.readyState === WebSocket.OPEN;

        console.log('[Live Chat Addon] User data received:', {
            username: username,
            in_faction: in_faction,
            isSocketConnected: isSocketConnected
        });

        if (!isSocketConnected) {
            connectWebSocket();
        } else if (isNewUser || isNewFaction) {
            displayMessage('System', 'User data changed, reconnecting...', 'global');
            socket.close();
        } else {
            console.log('[Live Chat Addon] User data verified, already connected');
        }
        return true;
    }

    window.addEventListener("xhrIntercepted", function(event) {
        const { url, response } = event.detail;
        if (url && url.includes("getStats") && response) {
            console.log('[Live Chat Addon] Received intercepted getStats data');
            handleUserData(response);
        }
    });

    function checkExistingData() {
        if (window.data && window.data.username && window.data.in_faction !== undefined) {
            console.log('[Live Chat Addon] Found existing user data in global variable');
            handleUserData(window.data);
            return true;
        }
        return false;
    }

    let initialCheckDone = checkExistingData();

    if (!initialCheckDone) {
        setTimeout(checkExistingData, 2);
    }

    window.retryChat = function() {
        if (checkExistingData()) {
            return "Found user data and updated connection";
        } else {
            return "No user data found yet, listening for next request";
        }
    };
    console.log('[Live Chat Addon] Initializing chat...');
})();
