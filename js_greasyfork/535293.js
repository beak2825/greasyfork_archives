// ==UserScript==
// @name         Gartic Anonimbiri Bot Panel
// @name:tr      Gartic Anonimbiri Bot Paneli
// @namespace    http://tampermonkey.net/
// @version      2025-05-08
// @description  Advanced bot control panel for gartic.io with gangster theme, player list and spam features
// @description:tr Gangster teması, oyuncu listesi ve spam özellikleri ile gartic.io için gelişmiş bot kontrol paneli
// @author       anonimbiri
// @license      MIT
// @match        https://gartic.io/anonimbiri
// @icon         https://i.imgur.com/8zK9mX3.png
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/535293/Gartic%20Anonimbiri%20Bot%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/535293/Gartic%20Anonimbiri%20Bot%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Özel avatar URL'si
    const customAvatarUrl = 'https://i.imgur.com/qL9YfQS.jpeg';

    // Custom console logging
    const log = (msg, error = false) => {
        console.log(`%c[semih] ${msg}`, `color:${error ? '#ff5555' : '#ff4500'};font-weight:bold;font-family:monospace;background:#222;padding:2px 4px;border-radius:3px`);
    };

    // Çerez silme fonksiyonu (asenkron)
    const deleteCookies = async () => {
        return new Promise((resolve, reject) => {
            GM_cookie.delete({ name: 'garticio' }, (error) => {
                log(error ? '✖ garticio çerezi silinirken hata oluştu!' : '✔ garticio çerezi başarıyla silindi!');
                if (error) reject(error);
            });
            GM_cookie.delete({ name: 'cf_clearance' }, (error) => {
                log(error ? '✖ cf_clearance çerezi silinirken hata oluştu!' : '✔ cf_clearance çerezi başarıyla silindi!');
                if (error) reject(error);
                resolve();
            });
        });
    };

    // Sayfa yüklendiğinde çerezleri sil
    deleteCookies().catch((err) => log(`Çerez silme hatası: ${err}`, true));

    // Settings elements
    const elements = {
        autoKickCheckbox: null,
        noKickCooldownCheckbox: null,
        chatBypassCensorship: null
    };

    // Notification function
    const showNotification = (msg, duration) => {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.right = '10px';
        notification.style.padding = '10px';
        notification.style.background = '#222';
        notification.style.color = '#ff4500';
        notification.style.borderRadius = '5px';
        notification.style.border = '1px solid #ff4500';
        notification.textContent = msg;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), duration);
    };

    // Save settings to localStorage
    const saveSettings = () => {
        localStorage.setItem('autoKick', elements.autoKickCheckbox.checked);
        localStorage.setItem('noKickCooldown', elements.noKickCooldownCheckbox.checked);
        localStorage.setItem('chatBypassCensorship', elements.chatBypassCensorship.checked);
    };

    // Load settings from localStorage
    const loadSettings = () => {
        elements.autoKickCheckbox.checked = localStorage.getItem('autoKick') === 'true';
        elements.noKickCooldownCheckbox.checked = localStorage.getItem('noKickCooldown') === 'true';
        elements.chatBypassCensorship.checked = localStorage.getItem('chatBypassCensorship') === 'true';
    };

    // Replace page with gangster theme (orijinal stil korunuyor)
    document.documentElement.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap');

            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            body {
                margin: 0;
                background: url('https://imgur.com/yDnuDNo') no-repeat center center fixed;
                background-size: cover;
                color: #ffffff;
                font-family: 'Roboto Condensed', sans-serif;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
                overflow: auto;
                position: relative;
            }

            body::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: -1;
            }

            .container {
                display: flex;
                max-width: 1200px;
                width: 100%;
                gap: 20px;
                flex-wrap: wrap;
                justify-content: center;
                align-items: flex-start;
            }

            .panel {
                background: rgba(30, 30, 30, 0.9);
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
                width: 320px;
                text-align: center;
                position: relative;
                border: 2px solid #ff4500;
                overflow: hidden;
                flex-shrink: 0;
                min-height: 400px;
            }

            .panel::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(255, 69, 0, 0.2), transparent);
                transform: rotate(45deg);
                animation: shine 4s infinite;
            }

            @keyframes shine {
                0% { transform: translateX(-100%) rotate(45deg); }
                100% { transform: translateX(100%) rotate(45deg); }
            }

            h3 {
                color: #ff4500;
                margin: 0 0 20px;
                font-size: 24px;
                font-weight: 700;
                text-transform: uppercase;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                position: relative;
            }

            h3::after {
                content: '';
                position: absolute;
                bottom: -6px;
                left: 0;
                width: 100%;
                height: 3px;
                background: linear-gradient(90deg, transparent, #ff4500, transparent);
            }

            .input-group {
                margin: 15px 0;
                position: relative;
            }

            label {
                display: block;
                text-align: left;
                margin-bottom: 6px;
                color: #ff4500;
                font-weight: 700;
                font-size: 14px;
                text-transform: uppercase;
            }

            input, select {
                width: 100%;
                padding: 10px 15px;
                border: 2px solid #ff4500;
                border-radius: 8px;
                background: #222;
                color: #fff;
                font-family: 'Roboto Condensed', sans-serif;
                font-size: 15px;
                transition: all 0.3s;
            }

            input:focus, select:focus {
                border-color: #ff8c00;
                box-shadow: 0 0 0 3px rgba(255, 69, 0, 0.3);
                outline: none;
            }

            input::placeholder, select::placeholder {
                color: #666;
            }

            button {
                background: linear-gradient(45deg, #ff4500, #ff8c00);
                border: none;
                padding: 12px 20px;
                margin-top: 15px;
                border-radius: 8px;
                color: #000;
                font-weight: 700;
                font-size: 16px;
                font-family: 'Roboto Condensed', sans-serif;
                cursor: pointer;
                transition: all 0.3s;
                width: 100%;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
                text-transform: uppercase;
            }

            button:disabled {
                background: linear-gradient(45deg, #666, #888);
                cursor: not-allowed;
                box-shadow: none;
            }

            button:hover:not(:disabled) {
                background: linear-gradient(45deg, #ff8c00, #ffa500);
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(255, 69, 0, 0.5);
            }

            button:active:not(:disabled) {
                transform: translateY(1px);
                box-shadow: 0 2px 5px rgba(255, 69, 0, 0.5);
            }

            .status {
                margin-top: 15px;
                padding: 10px;
                border-radius: 8px;
                background: rgba(34, 34, 34, 0.8);
                max-height: 120px;
                overflow-y: auto;
                font-size: 13px;
                text-align: left;
                color: #ccc;
                border: 1px solid #ff4500;
            }

            .status::-webkit-scrollbar {
                width: 6px;
            }

            .status::-webkit-scrollbar-track {
                background: #222;
                border-radius: 10px;
            }

            .status::-webkit-scrollbar-thumb {
                background: #ff4500;
                border-radius: 10px;
            }

            .player-panel {
                background: rgba(30, 30, 30, 0.9);
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
                width: 320px;
                position: relative;
                border: 2px solid #ff4500;
                overflow: hidden;
                flex-shrink: 0;
                min-height: 400px;
            }

            .player-panel::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(255, 69, 0, 0.2), transparent);
                transform: rotate(45deg);
                animation: shine 4s infinite;
            }

            .player-list {
                overflow-y: auto;
                max-height: 250px;
                margin-top: 10px;
            }

            .player-list::-webkit-scrollbar {
                width: 6px;
            }

            .player-list::-webkit-scrollbar-track {
                background: #222;
                border-radius: 10px;
            }

            .player-list::-webkit-scrollbar-thumb {
                background: #ff4500;
                border-radius: 10px;
            }

            .player-item {
                display: flex;
                align-items: center;
                padding: 8px 12px;
                margin-bottom: 8px;
                background: rgba(34, 34, 34, 0.8);
                border-radius: 8px;
                border: 1px solid #ff4500;
                transition: all 0.2s;
            }

            .player-item:hover {
                background: rgba(50, 50, 50, 0.8);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(255, 69, 0, 0.3);
            }

            .player-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                margin-right: 12px;
                background-size: cover;
                background-position: center;
                border: 2px solid #ff4500;
                flex-shrink: 0;
            }

            .player-info {
                flex-grow: 1;
                text-align: left;
            }

            .player-name {
                font-weight: 700;
                color: #ff4500;
                font-size: 15px;
                display: block;
            }

            .player-stats {
                display: flex;
                gap: 10px;
                font-size: 12px;
                color: #ccc;
            }

            .kick-btn {
                background: linear-gradient(45deg, #ff4500, #ff8c00);
                border: none;
                padding: 5px 10px;
                border-radius: 8px;
                color: #000;
                font-weight: 700;
                font-size: 12px;
                font-family: 'Roboto Condensed', sans-serif;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 2px 5px rgba(255, 69, 0, 0.3);
                margin-left: 5px;
                text-transform: uppercase;
            }

            .kick-btn:hover {
                background: linear-gradient(45deg, #ff8c00, #ffa500);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(255, 69, 0, 0.4);
            }

            .room-info {
                text-align: left;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px dashed #ff4500;
            }

            .room-code {
                font-weight: 700;
                color: #ff4500;
                font-size: 16px;
            }

            .room-theme {
                font-size: 14px;
                color: #ccc;
                margin-top: 5px;
            }

            .empty-list {
                text-align: center;
                padding: 20px;
                color: #ccc;
                font-style: italic;
            }

            .spam-panel {
                flex: 1;
                min-width: 320px;
            }

            .checkbox-group {
                margin: 15px 0;
                text-align: left;
            }

            .checkbox-group label {
                display: inline-block;
                margin-left: 8px;
                font-size: 14px;
                color: #ff4500;
                text-transform: none;
            }

            .checkbox-group input[type="checkbox"] {
                width: auto;
                vertical-align: middle;
                accent-color: #ff4500;
            }
        </style>

        <div class="container">
            <div class="panel player-panel">
                <h3>Odadaki Oyuncular</h3>
                <div class="room-info">
                    <div class="room-code" id="roomCodeDisplay">Oda: Henüz bağlanılmadı</div>
                    <div class="room-theme" id="roomTheme">Tema: -</div>
                </div>
                <div class="player-list" id="playerList">
                    <div class="empty-list">Henüz oyuncu bilgisi yok...</div>
                </div>
            </div>

            <div class="panel">
                <h3>Gartic Bot Control</h3>
                <div class="input-group">
                    <label>Bot Sayısı:</label>
                    <input type="number" id="botCount" min="1" value="10" disabled>
                </div>
                <div class="input-group">
                    <label>Oda Kodu:</label>
                    <input type="text" id="roomCode" placeholder="Örn. 32v1sA">
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="autoKickCheckbox">
                    <label for="autoKickCheckbox">Otomatik Kick</label>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="noKickCooldownCheckbox">
                    <label for="noKickCooldownCheckbox">Kick Bekleme Süresini Kaldır</label>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="chatBypassCensorship">
                    <label for="chatBypassCensorship">Sohbet Sansürünü Atla</label>
                </div>
                <button id="startBots">Botları Başlat</button>
                <div class="status" id="statusLog">Durum: Botlar hazır, başlatmak için butona tıklayın...</div>
            </div>

            <div class="panel spam-panel">
                <h3>Bot Spam Kontrol</h3>
                <div class="input-group">
                    <label>Spam Metni:</label>
                    <input type="text" id="spamText" placeholder="Gönderilecek mesaj">
                </div>
                <div class="input-group">
                    <label>Spam Kanalı:</label>
                    <select id="spamChannel">
                        <option value="answers">Cevaplar (42[13])</option>
                        <option value="chat">Sohbet (42[11])</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Spam Aralığı (ms):</label>
                    <input type="number" id="spamInterval" min="100" value="1000">
                </div>
                <button id="startSpam">Spam Başlat</button>
                <button id="reportDrawing" style="background: linear-gradient(45deg, #ff5555, #ff8c00);">Çizimi Raporla</button>
                <div class="status" id="spamStatus">Durum: Spam kapalı</div>
            </div>
        </div>
    `;

    // Assign elements after DOM is created
    elements.autoKickCheckbox = document.getElementById('autoKickCheckbox');
    elements.noKickCooldownCheckbox = document.getElementById('noKickCooldownCheckbox');
    elements.chatBypassCensorship = document.getElementById('chatBypassCensorship');

    // Status log function
    const statusLog = (msg) => {
        const logEl = document.getElementById('statusLog');
        logEl.innerHTML += `<div>→ ${msg}</div>`;
        logEl.scrollTop = logEl.scrollHeight;
    };

    // Spam status log function
    const spamLog = (msg) => {
        const logEl = document.getElementById('spamStatus');
        logEl.innerHTML += `<div>→ ${msg}</div>`;
        logEl.scrollTop = logEl.scrollHeight;
    };

    // Global variables
    let token, sala, roomCode, roomId;
    let websocketUrl = null;
    let playerList = [];
    let socketList = [];
    let botsCreated = 0;
    let botQueue = [];
    let isCreatingBot = false;
    let currentIframe = null;
    let spamInterval = null;
    let isSpamming = false;
    const startBotsButton = document.getElementById('startBots');
    let botChoices = new Map();
    let lastKickTime = 0;
    let lastKickBotIndex = -1; // Son kick yapan botun indeksi

    // Invisible characters list
    const invisibleChars = ['\u200B', '\u200C', '\u200D', '\u2061', '\u2062', '\u2063', '\u2064', '\u2066', '\u17b4', '\u17b5', '\u2068', '\u2069'];

    // Nick list for 10 bots
    const nickList = ['semih1', 'semih2', 'semih3', 'semih4', 'semih5', 'semih6', 'semih7', 'semih8', 'semih9', 'semih10'];

    // Function to insert a random invisible character at a random position
    function insertInvisibleChar(text) {
        const randomChar = invisibleChars[Math.floor(Math.random() * invisibleChars.length)];
        const insertPos = Math.floor(Math.random() * (text.length + 1));
        return text.slice(0, insertPos) + randomChar + text.slice(insertPos);
    }

    // Function to update startBotsButton state
    function updateButtonState(isLoading = false) {
        if (isLoading) {
            startBotsButton.textContent = 'Oluşturuluyor...';
            startBotsButton.disabled = true;
        } else if (socketList.length > 0) {
            startBotsButton.textContent = 'Tüm Botları Sil';
            startBotsButton.style.background = 'linear-gradient(45deg, #ff5555, #ff8c00)';
            startBotsButton.disabled = false;
        } else {
            startBotsButton.textContent = 'Botları Başlat';
            startBotsButton.style.background = 'linear-gradient(45deg, #ff4500, #ff8c00)';
            startBotsButton.disabled = false;
        }
    }

    // Attach event listeners
    startBotsButton.addEventListener('click', () => {
        if (startBotsButton.textContent === 'Botları Başlat') {
            startBots();
        } else if (startBotsButton.textContent === 'Tüm Botları Sil') {
            deleteAllBots();
        }
    });

    document.getElementById('startSpam').addEventListener('click', () => {
        const startSpamButton = document.getElementById('startSpam');
        if (startSpamButton.textContent === 'Spam Başlat') {
            startSpam();
        } else {
            stopSpam();
        }
    });

    document.getElementById('reportDrawing').addEventListener('click', () => {
        reportDrawing();
    });

    elements.autoKickCheckbox.addEventListener('change', () => {
        showNotification(`Auto Kick: ${elements.autoKickCheckbox.checked ? 'Enabled' : 'Disabled'}`, 2000);
        saveSettings();
    });

    elements.noKickCooldownCheckbox.addEventListener('change', () => {
        showNotification(`No Kick Cooldown: ${elements.noKickCooldownCheckbox.checked ? 'Enabled' : 'Disabled'}`, 2000);
        saveSettings();
    });

    elements.chatBypassCensorship.addEventListener('change', () => {
        showNotification(`Chat Bypass Censorship: ${elements.chatBypassCensorship.checked ? 'Enabled' : 'Disabled'}`, 2000);
        saveSettings();
    });

    // Start spam function
    function startSpam() {
        if (socketList.length === 0) {
            spamLog("Spam için aktif bot bulunamadı!");
            return;
        }

        const spamTextBase = document.getElementById('spamText').value.trim();
        const spamChannel = document.getElementById('spamChannel').value;
        const spamIntervalValue = parseInt(document.getElementById('spamInterval').value) || 1000;

        if (!spamTextBase) {
            spamLog("Lütfen bir spam metni girin!");
            return;
        }

        isSpamming = true;
        document.getElementById('startSpam').textContent = 'Spam Durdur';
        document.getElementById('startSpam').style.background = 'linear-gradient(45deg, #ff5555, #ff8c00)';

        spamLog(`Spam başlatıldı: "${spamTextBase}" (${spamChannel === "answers" ? "Cevaplar" : "Sohbet"} kanalı)`);

        const commandCode = spamChannel === "answers" ? "13" : "11";

        clearInterval(spamInterval);
        spamInterval = setInterval(() => {
            socketList.forEach((socket, index) => {
                if (socket.readyState === WebSocket.OPEN && socket.playerId) {
                    const spamText = elements.chatBypassCensorship.checked ? insertInvisibleChar(spamTextBase) : spamTextBase;
                    socket.send(`42[${commandCode},${socket.playerId},"${spamText}"]`);
                    log(`Spam message sent from socket ${index} (${commandCode}): ${spamText}`);
                }
            });
        }, spamIntervalValue);
    }

    // Stop spam function
    function stopSpam() {
        clearInterval(spamInterval);
        isSpamming = false;
        document.getElementById('startSpam').textContent = 'Spam Başlat';
        document.getElementById('startSpam').style.background = 'linear-gradient(45deg, #ff4500, #ff8c00)';
        spamLog("Spam durduruldu.");
    }

    // Clean room code function
    function cleanRoomCode(input) {
        if (!input) return input;
        const match = input.match(/([A-Za-z0-9]{6})(?:\/viewer)?$/);
        return match ? match[1] : input;
    }

    // Start bots function
    async function startBots() {
        const botCount = 10; // Fixed to 10 bots
        roomCode = cleanRoomCode(document.getElementById('roomCode').value.trim());
        roomId = roomCode;
        botsCreated = 0;
        botQueue = Array.from({ length: botCount }, (_, i) => i);
        isCreatingBot = false;
        socketList = []; // Clear existing sockets
        websocketUrl = null; // Reset websocket URL

        if (!roomCode) {
            showNotification('Lütfen bir oda kodu girin!', 1000);
            return;
        }

        log(`Starting ${botCount} bots for room ${roomCode}`);
        statusLog(`${botCount} bot başlatılıyor... Oda: ${roomCode}`);

        document.getElementById('roomCodeDisplay').textContent = `Oda: ${roomCode}`;
        updateButtonState(true);

        // Çerezleri sil
        await deleteCookies();

        createNextBot();
        startPeriodicMessage();
    }

    // Function to delete all bots
    function deleteAllBots() {
        if (socketList.length === 0) {
            statusLog("Silinecek aktif bot bulunamadı!");
            updateButtonState();
            return;
        }

        if (isSpamming) {
            stopSpam();
        }

        socketList.forEach((socket, index) => {
            if (socket.readyState === WebSocket.OPEN && socket.playerId) {
                socket.send(`42[24,${socket.playerId}]`);
                log(`Sent leave command for socket ${index} with playerId ${socket.playerId}`);
                statusLog(`Bot ${index + 1} ayrılma komutu gönderildi: ${socket.playerId}`);
                socket.close();
            }
        });
        socketList = [];
        updateButtonState();
    }

    // Create next bot from queue
    function createNextBot() {
        if (botQueue.length === 0 || isCreatingBot) {
            updateButtonState();
            return;
        }

        isCreatingBot = true;
        const index = botQueue.shift();
        createIframe(index);
    }

    // Create iframe for bot
    async function createIframe(index) {
        statusLog(`Bot ${index + 1} oluşturuluyor...`);

        // Çerezleri iframe oluşturmadan önce sil
        await deleteCookies();

        const iframe = document.createElement('iframe');
        iframe.src = `https://gartic.io/${roomCode}?t=${Date.now()}`; // Add timestamp to avoid caching
        iframe.style = 'display:none';
        iframe.sandbox = 'allow-scripts allow-same-origin'; // Ensure isolation
        document.body.appendChild(iframe);
        currentIframe = iframe;

        iframe.onload = async () => {
            const iw = iframe.contentWindow;
            const id = iframe.contentDocument;

            // Iframe içinde çerezleri tekrar sil
            await deleteCookies();

            setTimeout(async () => {
                const playButton = id.querySelector('.ic-playHome');
                if (playButton) {
                    playButton.click();
                    log(`Bot ${index}: Clicked ic-playHome`);
                    statusLog(`Bot ${index + 1}: Oyun butonuna tıklandı`);
                } else {
                    log(`Bot ${index}: Play button not found`, true);
                    statusLog(`Bot ${index + 1}: Oyun butonu bulunamadı`);
                    cleanupIframe();
                    isCreatingBot = false;
                    botsCreated++;
                    createNextBot();
                    return;
                }

                const originalXHROpen = iw.XMLHttpRequest.prototype.open;
                iw.XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
                    if (url.includes('server?check=')) {
                        this.isServerCheck = true;
                    }
                    return originalXHROpen.apply(this, arguments);
                };

                const originalXHRSend = iw.XMLHttpRequest.prototype.send;
                iw.XMLHttpRequest.prototype.send = function(body) {
                    if (this.isServerCheck) {
                        this.addEventListener('readystatechange', function() {
                            if (this.readyState === 4 && this.status === 200) {
                                try {
                                    const response = this.responseText;
                                    const match = response.match(/(https:\/\/[^?]+)\?c=([^&]+)/);
                                    if (match) {
                                        const server = match[1].replace('https://', '');
                                        const cParam = match[2];
                                        websocketUrl = `wss://${server}/socket.io/?c=${cParam}&EIO=3&transport=websocket&t=${Date.now()}`;
                                        log(`WebSocket URL constructed: ${websocketUrl}`);
                                        statusLog(`WebSocket URL oluşturuldu: ${websocketUrl}`);
                                        createBotSocket(index, websocketUrl);
                                    } else {
                                        log(`WebSocket URL parsing failed for response: ${response}`, true);
                                        statusLog(`WebSocket URL ayrıştırma hatası: ${response}`);
                                        cleanupIframe();
                                        isCreatingBot = false;
                                        botsCreated++;
                                        createNextBot();
                                    }
                                } catch (e) {
                                    log(`Error processing server check response: ${e}`, true);
                                    statusLog(`Sunucu kontrol yanıtı işlenirken hata: ${e}`);
                                    cleanupIframe();
                                    isCreatingBot = false;
                                    botsCreated++;
                                    createNextBot();
                                }
                            }
                        });
                    }
                    return originalXHRSend.apply(this, arguments);
                };

                const originalSend = iw.WebSocket.prototype.send;
                iw.WebSocket.prototype.send = function(data) {
                    if (typeof data === 'string' && data.startsWith('42[3,{')) {
                        try {
                            const parsed = JSON.parse(data.substring(2));
                            if (parsed[1]?.token) {
                                token = parsed[1].token;
                                sala = parsed[1].sala || roomCode;
                                roomId = sala;
                                log(`Bot ${index}: Token=${token}, Sala=${sala}`);
                                statusLog(`Bot ${index + 1}: Kimlik bilgileri alındı`);
                                document.getElementById('roomCodeDisplay').textContent = `Oda: ${sala}`;
                                return;
                            }
                        } catch (e) {
                            log(`Bot ${index}: JSON parse error`, true);
                            statusLog(`Bot ${index + 1}: JSON ayrıştırma hatası`);
                            cleanupIframe();
                            isCreatingBot = false;
                            botsCreated++;
                            createNextBot();
                        }
                    }
                    return originalSend.apply(this, arguments);
                };
            }, 400); // Increased timeout to avoid session conflicts
        };

        iframe.onerror = () => {
            log(`Bot ${index}: Iframe loading error`, true);
            statusLog(`Bot ${index + 1}: Iframe yükleme hatası`);
            cleanupIframe();
            isCreatingBot = false;
            botsCreated++;
            createNextBot();
        };
    }

    // Iframe cleanup function
    function cleanupIframe() {
        if (currentIframe) {
            currentIframe.remove();
            currentIframe = null;
            log('Iframe removed');
            statusLog('Iframe kaldırıldı');
        }
    }

    // Function to check if a player is a bot
    function isBot(player) {
        if (!player.nick) return false;
        const cleanNick = player.nick.replace(/[\u200B-\u200D\u2061-\u2069\u17b4-\u17b5]/g, '');
        return nickList.includes(cleanNick);
    }

    // Create WebSocket for bot
    function createBotSocket(index, wsUrl) {
        if (!wsUrl) {
            log(`Bot ${index}: WebSocket URL not available`, true);
            statusLog(`Bot ${index + 1}: WebSocket URL bulunamadı`);
            cleanupIframe();
            isCreatingBot = false;
            botsCreated++;
            createNextBot();
            return;
        }

        statusLog(`Bot ${index + 1}: Oyun sunucusuna bağlanıyor...`);
        const ws = new WebSocket(wsUrl);
        ws.index = index;
        socketList.push(ws);

        ws.onopen = () => {
            log(`Bot ${index}: WebSocket connection opened`);
            statusLog(`Bot ${index + 1}: Bağlantı açıldı`);
        };

        ws.onmessage = (e) => {
            if (e.data === '40') {
                const baseNick = nickList[index % nickList.length];
                const nick = elements.chatBypassCensorship.checked ? insertInvisibleChar(baseNick) : baseNick;
                const randomAvatar = Math.floor(Math.random() * 10);
                ws.nick = nick; // Store the nickname in the socket object
                ws.send(`42[3,{"v":20000,"token":"${token}","nick":"${nick}","foto":"${customAvatarUrl}","avatar":"${randomAvatar}","platform":0,"sala":"${sala}"}]`);
                log(`Bot ${index}: Joined as ${nick} with avatar ${customAvatarUrl}`);
                statusLog(`Bot ${index + 1}: "${nick}" olarak avatar ${customAvatarUrl} ile katıldı`);
            }

            if (e.data === '42["6",3]') {
                const errorMessage = 'Hata 3 - Oda dolu, daha fazla bot eklenemez';
                log(`Bot ${index}: ${errorMessage}`, true);
                statusLog(`Bot ${index + 1}: ${errorMessage}`);
                botQueue = [];
                cleanupIframe();
                isCreatingBot = false;
                updateButtonState();
                return;
            }

            if (e.data === '42["6",4]') {
                const errorMessage = 'Hata 4 - Oyunda gözüküyorsun, başka bir sekmede oynuyor olabilirsin';
                log(`Bot ${index}: ${errorMessage}`, true);
                statusLog(`Bot ${index + 1}: ${errorMessage}`);
                cleanupIframe();
                isCreatingBot = false;
                botsCreated++;
                createNextBot();
                return;
            }

            if (e.data.startsWith('42["5",')) {
                try {
                    const parsed = JSON.parse(e.data.substring(2));
                    const playerId = parsed[2];
                    ws.send(`42[46,${playerId}]`);
                    log(`Bot ${index}: Player ID = ${playerId}`);
                    statusLog(`Bot ${index + 1}: Aktif ve hazır`);
                    ws.playerId = playerId;

                    if (parsed[2] && Array.isArray(parsed[5])) {
                        const roomInfo = parsed[4];
                        const newPlayers = parsed[5].filter(player => !isBot(player));
                        playerList = updatePlayerListNoDuplicates(newPlayers);
                        document.getElementById('roomTheme').textContent = `Tema: ${roomInfo.tema || '-'}`;
                        updatePlayerListUI();
                    }

                    cleanupIframe();
                    isCreatingBot = false;
                    botsCreated++;
                    log(`Bot ${index}: Bot created, total created: ${botsCreated}/10`);

                    if (botsCreated >= 10) {
                        updateButtonState();
                        statusLog(`Tüm botlar (10) başarıyla başlatıldı! 💥`);
                    }

                    createNextBot();
                } catch (e) {
                    log(`Bot ${index}: Error parsing response: ${e}`, true);
                    statusLog(`Bot ${index + 1}: Oyun verisi ayrıştırma hatası`);
                    cleanupIframe();
                    isCreatingBot = false;
                    botsCreated++;
                    createNextBot();
                }
            }

            if (e.data === '42["6",null]') {
                log(`Bot ${index}: Leave confirmed, removing socket`);
                statusLog(`Bot ${index + 1}: Ayrılma onaylandı, soket kaldırılıyor`);
                socketList = socketList.filter(s => s !== ws);
                if (ws.readyState === WebSocket.OPEN) {
                    ws.close();
                }
                updateButtonState();
            }

            if (typeof e.data === 'string') {
                try {
                    if (e.data.startsWith('42["23",')) {
                        const parsed = JSON.parse(e.data.substring(2));
                        if (parsed[1] && parsed[1].id && !isBot(parsed[1])) {
                            const newPlayer = parsed[1];
                            if (!playerList.some(p => String(p.id) === String(newPlayer.id))) {
                                playerList.push(newPlayer);
                                updatePlayerListUI();
                                log(`New player joined: ${newPlayer.nick}`);
                                statusLog(`Yeni oyuncu: ${newPlayer.nick}`);

                                if (elements.autoKickCheckbox.checked) {
                                    kickPlayer(newPlayer.id);
                                    statusLog(`Otomatik kick: ${newPlayer.nick} (${newPlayer.id})`);
                                }
                            }
                        }
                    }

                    if (e.data.startsWith('42["24",')) {
                        const parsed = JSON.parse(e.data.substring(2));
                        const leftPlayerId = parsed[1];
                        playerList = playerList.filter(p => String(p.id) !== String(leftPlayerId));
                        updatePlayerListUI();
                        log(`Player left: ${leftPlayerId}`);
                        statusLog(`Oyuncu ayrıldı: ID ${leftPlayerId}`);
                    }

                    if (e.data.startsWith('42["16",')) {
                        try {
                            const parsed = JSON.parse(e.data.substring(2));
                            const options = [parsed[1], parsed[3]];
                            const choiceIndex = Math.floor(Math.random() * 2);
                            const choice = options[choiceIndex];
                            botChoices.set(ws.playerId, choice);
                            log(`Bot ${index}: Received options ${options.join(' vs ')}, chose ${choice} (${choiceIndex})`);

                            setTimeout(() => {
                                if (ws.readyState === WebSocket.OPEN && ws.playerId) {
                                    ws.send(`42[34,${ws.playerId},${choiceIndex}]`);
                                    log(`Bot ${index}: Sent choice ${choiceIndex} for ${choice}`);
                                } else {
                                    log(`Bot ${index}: Socket closed or no playerId, cannot send choice`, true);
                                }
                            }, 3000);
                        } catch (e) {
                            log(`Bot ${index}: Error parsing 16 message: ${e}`, true);
                        }
                    }

                    if (e.data.startsWith('42["34",')) {
                        try {
                            if (ws.readyState === WebSocket.OPEN && ws.playerId) {
                                ws.send(`42[30,${ws.playerId}]`);
                                ws.send(`42[30,${ws.playerId}]`);
                                ws.send(`42[30,${ws.playerId}]`);
                                ws.send(`42[30,${ws.playerId}]`);

                                const choice = botChoices.get(ws.playerId);
                                if (choice) {
                                    socketList.forEach((otherSocket) => {
                                        if (otherSocket !== ws && otherSocket.readyState === WebSocket.OPEN && otherSocket.playerId) {
                                            const messageText = elements.chatBypassCensorship.checked ? insertInvisibleChar(choice) : choice;
                                            otherSocket.send(`42[13,${otherSocket.playerId},"${messageText}"]`);
                                            log(`Bot ${index}: Sent choice ${messageText} to bot ${otherSocket.playerId}`);
                                        }
                                    });
                                }

                                log(`Bot ${index}: Received 34 message, sent 42[30,${ws.playerId}]`);
                            } else {
                                log(`Bot ${index}: Socket closed or no playerId, cannot send 30 message`, true);
                            }
                        } catch (e) {
                            log(`Bot ${index}: Error processing 34 message: ${e}`, true);
                        }
                    }
                } catch (e) {
                    log(`Bot ${index}: Error parsing player update: ${e}`, true);
                }
            }
        };

        ws.onerror = () => {
            log(`Bot ${index}: WebSocket error`, true);
            statusLog(`Bot ${index + 1}: Bağlantı hatası`);
            socketList = socketList.filter(s => s !== ws);
            cleanupIframe();
            isCreatingBot = false;
            botsCreated++;
            createNextBot();
        };

        ws.onclose = () => {
            log(`Bot ${index}: WebSocket closed`);
            statusLog(`Bot ${index + 1}: Bağlantı kapandı`);
            socketList = socketList.filter(s => s !== ws);
            cleanupIframe();
            isCreatingBot = false;
            createNextBot();
        };
    }

    // Function to update player list without duplicates
    function updatePlayerListNoDuplicates(newPlayers) {
        const existingIds = new Set(playerList.map(p => String(p.id)));
        const updatedList = [...playerList];

        newPlayers.forEach(player => {
            if (!existingIds.has(String(player.id))) {
                updatedList.push(player);
                existingIds.add(String(player.id));
            }
        });

        return updatedList;
    }

    // Update player list from data
    function updatePlayerList(players) {
        if (players && Array.isArray(players)) {
            const filteredPlayers = players.filter(player => !isBot(player));
            playerList = updatePlayerListNoDuplicates(filteredPlayers);
            updatePlayerListUI();
        }
    }

    // Update player list UI
    function updatePlayerListUI() {
        const playerListElement = document.getElementById('playerList');

        if (!playerList || playerList.length === 0) {
            playerListElement.innerHTML = `<div class="empty-list">Henüz oyuncu bilgisi yok...</div>`;
            return;
        }

        let html = '';
        playerList.forEach(player => {
            let avatarUrl = getAvatarUrl(player);
            // Mobil cihazlarda foto alanını yoksay
            const isMobile = /Mobi|Android/i.test(navigator.userAgent);
            if (isMobile && player.foto) {
                avatarUrl = `https://gartic.io/static/images/avatar/svg/${player.avatar || 0}.svg`;
            }

            html += `
                <div class="player-item" data-id="${player.id}">
                    <div class="player-avatar" style="background-image: url('${avatarUrl}')"></div>
                    <div class="player-info">
                        <span class="player-name">${player.nick}</span>
                        <div class="player-stats">
                            <span>Puan: ${player.pontos || 0}</span>
                            <span>Galibiyetler: ${player.vitorias || 0}</span>
                        </div>
                    </div>
                    <button class="kick-btn" data-id="${player.id}">Kick</button>
                </div>
            `;
        });

        playerListElement.innerHTML = html;

        document.querySelectorAll('.kick-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const playerId = this.getAttribute('data-id');
                kickPlayer(playerId);
            });
        });
    }

    // Kick player function (Güncellendi)
    function kickPlayer(playerId) {
        if (socketList.length === 0) {
            statusLog("Kick işlemi için aktif bağlantı bulunamadı!");
            return;
        }

        if (!playerId) {
            log("Kick failed: Missing player ID", true);
            statusLog("Kick başarısız: Oyuncu ID eksik");
            return;
        }

        const currentTime = Date.now();
        const cooldown = 2000; // 2 saniye bekleme süresi
        if (!elements.noKickCooldownCheckbox.checked && currentTime - lastKickTime < cooldown) {
            statusLog(`Kick işlemi için bekleme süresi: ${((cooldown - (currentTime - lastKickTime)) / 1000).toFixed(1)} saniye`);
            return;
        }

        // Bir sonraki botu seç (döngüsel olarak)
        lastKickBotIndex = (lastKickBotIndex + 1) % socketList.length;
        const socket = socketList[lastKickBotIndex];

        if (socket.readyState === WebSocket.OPEN && socket.playerId) {
            socket.send(`42[45,${socket.playerId},["${playerId}",true]]`);
            log(`Kick request sent for player ${playerId} from socket ${lastKickBotIndex} (${socket.nick}) with playerId ${socket.playerId}`);
            statusLog(`Oyuncu kick işlemi gönderildi: ${playerId} (${socket.nick})`);
        } else {
            log(`Kick failed: Socket ${lastKickBotIndex} is not open or has no playerId`, true);
            statusLog(`Kick başarısız: Soket ${lastKickBotIndex + 1} açık değil veya oyuncu ID'si yok`);
            // Eğer bu bot çalışmıyorsa, bir sonraki botu dene
            kickPlayer(playerId);
        }

        lastKickTime = currentTime;
    }

    // Report drawing function
    function reportDrawing() {
        if (socketList.length === 0) {
            statusLog("Raporlama işlemi için aktif bağlantı bulunamadı!");
            return;
        }

        socketList.forEach((socket, index) => {
            if (socket.readyState === WebSocket.OPEN && socket.playerId) {
                socket.send(`42[35,${socket.playerId}]`);
                log(`Report drawing request sent from socket ${index} with playerId ${socket.playerId}`);
                statusLog(`Çizim raporlama işlemi gönderildi (Soket ${index + 1})`);
            }
        });
    }

    // Add avatar URL helper function
    function getAvatarUrl(player) {
        if (player.foto) {
            return player.foto; // Tarayıcıda özel avatar
        } else if (player.avatar !== undefined && player.avatar !== null) {
            return `https://gartic.io/static/images/avatar/svg/${player.avatar}.svg`; // Varsayılan SVG avatar
        } else {
            return 'https://gartic.io/static/images/avatar/svg/0.svg'; // Yedek avatar
        }
    }

    // Periodic message sender
    function startPeriodicMessage() {
        setInterval(() => {
            socketList.forEach((socket, index) => {
                if (socket.readyState === WebSocket.OPEN && socket.playerId) {
                    socket.send(`42[42,${socket.playerId}]`);
                    log(`Sent periodic message from socket ${index} with playerId ${socket.playerId}`);
                }
            });
        }, 2000);
    }

    // Initialize
    loadSettings();

    // Add room code input value extraction from URL
    (function extractRoomCodeFromUrl() {
        const url = window.location.href;
        if (url) {
            const urlParts = url.split('/');
            if (urlParts.length > 0) {
                const lastPart = urlParts[urlParts.length - 1];
                if (lastPart && lastPart !== 'anonimbiri') {
                    const cleanedCode = cleanRoomCode(lastPart);
                    document.getElementById('roomCode').value = cleanedCode;
                    log(`Room code extracted from URL: ${cleanedCode}`);
                    statusLog(`URL'den oda kodu çıkarıldı: ${cleanedCode}`);
                }
            }
        }
    })();

    // Log startup message
    log("Gartic Anonimbiri Bot Panel v2025-05-08 başlatıldı");
    statusLog("Bot paneli aktif! Botları başlatmak için üstteki butona tıklayın.");
})();