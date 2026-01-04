// ==UserScript==
// @name         Gartic Anonimbiri Bot Panel
// @name:tr      Gartic Anonimbiri Bot Paneli
// @namespace    http://tampermonkey.net/
// @version      2025-04-28
// @description  Advanced bot control panel for gartic.io with cute anime theme, player list and spam features
// @description:tr Sevimli anime teması, oyuncu listesi ve spam özellikleri ile gartic.io için gelişmiş bot kontrol paneli
// @author       anonimbiri
// @license      MIT
// @match        https://gartic.io/anonimbiri
// @icon         https://cdn.jsdelivr.net/gh/Gartic-Developers/Kawaii-Helper@refs/heads/main/Assets/kawaii-logo.png
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/538944/Gartic%20Anonimbiri%20Bot%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/538944/Gartic%20Anonimbiri%20Bot%20Panel.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Custom console logging
    const log = (msg, error = false) => {
        console.log(`%c[anonimbiri] ${msg}`, `color:${error ? '#ff5555' : '#55ff55'};font-weight:bold;font-family:monospace;background:#222;padding:2px 4px;border-radius:3px`);
    };
 
    // Delete garticio cookie on page load
    GM_cookie.delete({ name: 'garticio' }, (error) => {
        log(error ? '✖ garticio çerezi silinirken hata oluştu!' : '✔ garticio çerezi başarıyla silindi!');
    });
    GM_cookie.delete({ name: 'cf_clearance' }, (error) => {
        log(error ? '✖ garticio çerezi silinirken hata oluştu!' : '✔ garticio çerezi başarıyla silindi!');
    });
 
    // Replace page with cute anime theme
    document.documentElement.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;700&display=swap');
 
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
 
            body {
                margin: 0;
                background: linear-gradient(135deg, #ffcef3, #a6c1ff);
                color: #6e2252;
                font-family: 'Quicksand', sans-serif;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
                overflow: auto;
            }
 
            .hearts {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
            }
 
            .heart {
                position: absolute;
                width: 10px;
                height: 10px;
                background-color: rgba(255, 182, 193, 0.7);
                transform: rotate(45deg);
                animation: float 15s infinite linear;
            }
 
            .heart::before, .heart::after {
                content: '';
                position: absolute;
                width: 10px;
                height: 10px;
                background-color: rgba(255, 182, 193, 0.7);
                border-radius: 50%;
            }
 
            .heart::before {
                top: -5px;
                left: 0;
            }
 
            .heart::after {
                top: 0;
                left: -5px;
            }
 
            @keyframes float {
                0% { transform: rotate(45deg) translateY(0) translateX(0); opacity: 1; }
                100% { transform: rotate(45deg) translateY(-100vh) translateX(100vw); opacity: 0; }
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
                background: rgba(255, 255, 255, 0.9);
                padding: 25px;
                border-radius: 24px;
                box-shadow: 0 10px 30px rgba(122, 137, 247, 0.5);
                width: 320px;
                text-align: center;
                position: relative;
                border: 3px solid #a6c1ff;
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
                background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                transform: rotate(45deg);
                animation: shine 3s infinite;
            }
 
            @keyframes shine {
                0% { transform: translateX(-100%) rotate(45deg); }
                100% { transform: translateX(100%) rotate(45deg); }
            }
 
            h3 {
                color: #7a6ed9;
                margin: 0 0 20px;
                font-size: 22px;
                font-weight: 700;
                text-shadow: 0 2px 4px rgba(122, 110, 217, 0.2);
                position: relative;
                display: inline-block;
            }
 
            h3::after {
                content: '';
                position: absolute;
                bottom: -6px;
                left: 0;
                width: 100%;
                height: 3px;
                background: linear-gradient(90deg, transparent, #a6c1ff, transparent);
            }
 
            .input-group {
                margin: 15px 0;
                position: relative;
            }
 
            label {
                display: block;
                text-align: left;
                margin-bottom: 6px;
                color: #7a6ed9;
                font-weight: 500;
                font-size: 14px;
            }
 
            input, select {
                width: 100%;
                padding: 10px 15px;
                border: 2px solid #c4d3ff;
                border-radius: 12px;
                background: #fff;
                color: #7a6ed9;
                font-family: 'Quicksand', sans-serif;
                font-size: 15px;
                transition: all 0.3s;
                font-weight: 500;
            }
 
            input:focus, select:focus {
                border-color: #7a6ed9;
                box-shadow: 0 0 0 3px rgba(122, 110, 217, 0.2);
                outline: none;
            }
 
            input::placeholder, select::placeholder {
                color: #c4d3ff;
            }
 
            button {
                background: linear-gradient(45deg, #7a6ed9, #a6c1ff);
                border: none;
                padding: 12px 20px;
                margin-top: 15px;
                border-radius: 12px;
                color: white;
                font-weight: 700;
                font-size: 16px;
                font-family: 'Quicksand', sans-serif;
                cursor: pointer;
                transition: all 0.3s;
                width: 100%;
                box-shadow: 0 4px 10px rgba(122, 110, 217, 0.3);
            }
 
            button:disabled {
                background: linear-gradient(45deg, #aaaaaa, #cccccc);
                cursor: not-allowed;
                box-shadow: none;
            }
 
            button:hover:not(:disabled) {
                background: linear-gradient(45deg, #6659c8, #8aa3f7);
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(122, 110, 217, 0.4);
            }
 
            button:active:not(:disabled) {
                transform: translateY(1px);
                box-shadow: 0 2px 5px rgba(122, 110, 217, 0.4);
            }
 
            .status {
                margin-top: 15px;
                padding: 10px;
                border-radius: 12px;
                background: rgba(245, 249, 255, 0.8);
                max-height: 120px;
                overflow-y: auto;
                font-size: 13px;
                text-align: left;
                color: #5d5393;
                border: 1px solid #d4e1ff;
            }
 
            .status::-webkit-scrollbar {
                width: 6px;
            }
 
            .status::-webkit-scrollbar-track {
                background: #d4e1ff;
                border-radius: 10px;
            }
 
            .status::-webkit-scrollbar-thumb {
                background: #a6c1ff;
                border-radius: 10px;
            }
 
            .kawaii-text {
                font-size: 12px;
                color: #7a6ed9;
                margin-top: 15px;
                font-weight: 500;
            }
 
            /* Player list styles */
            .player-panel {
                background: rgba(255, 255, 255, 0.9);
                padding: 25px;
                border-radius: 24px;
                box-shadow: 0 10px 30px rgba(122, 137, 247, 0.5);
                width: 320px;
                position: relative;
                border: 3px solid #a6c1ff;
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
                background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                transform: rotate(45deg);
                animation: shine 3s infinite;
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
                background: #d4e1ff;
                border-radius: 10px;
            }
 
            .player-list::-webkit-scrollbar-thumb {
                background: #a6c1ff;
                border-radius: 10px;
            }
 
            .player-item {
                display: flex;
                align-items: center;
                padding: 8px 12px;
                margin-bottom: 8px;
                background: rgba(245, 249, 255, 0.8);
                border-radius: 10px;
                border: 1px solid #d4e1ff;
                transition: all 0.2s;
            }
 
            .player-item:hover {
                background: rgba(216, 230, 255, 0.8);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(122, 110, 217, 0.2);
            }
 
            .player-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                margin-right: 12px;
                background-size: cover;
                background-position: center;
                border: 2px solid #a6c1ff;
                flex-shrink: 0;
            }
 
            .player-info {
                flex-grow: 1;
                text-align: left;
            }
 
            .player-name {
                font-weight: 700;
                color: #7a6ed9;
                font-size: 15px;
                display: block;
            }
 
            .player-stats {
                display: flex;
                gap: 10px;
                font-size: 12px;
                color: #5d5393;
            }
 
            .player-actions {
                display: flex;
                gap: 5px;
            }
 
            .kick-btn, .report-btn {
                background: linear-gradient(45deg, #7a6ed9, #a6c1ff);
                border: none;
                padding: 5px 10px;
                border-radius: 8px;
                color: white;
                font-weight: 700;
                font-size: 12px;
                font-family: 'Quicksand', sans-serif;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 2px 5px rgba(122, 110, 217, 0.3);
                margin-left: 5px;
            }
 
            .kick-btn:hover, .report-btn:hover {
                background: linear-gradient(45deg, #6659c8, #8aa3f7);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(122, 110, 217, 0.4);
            }
 
            .room-info {
                text-align: left;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px dashed #d4e1ff;
            }
 
            .room-code {
                font-weight: 700;
                color: #7a6ed9;
                font-size: 16px;
            }
 
            .room-theme {
                font-size: 14px;
                color: #5d5393;
                margin-top: 5px;
            }
 
            .empty-list {
                text-align: center;
                padding: 20px;
                color: #5d5393;
                font-style: italic;
            }
 
            .anime-mascot {
                position: fixed;
                bottom: 10px;
                right: 10px;
                width: 180px;
                height: 180px;
                background-size: contain;
                background-repeat: no-repeat;
                opacity: 0.9;
                pointer-events: none;
                z-index: 10;
            }
 
            .spam-panel {
                flex: 1;
                min-width: 320px;
            }
        </style>
 
        <div class="hearts" id="hearts"></div>
 
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
                    <input type="number" id="botCount" min="1" value="5">
                </div>
                <div class="input-group">
                    <label>Oda Kodu:</label>
                    <input type="text" id="roomCode" placeholder="Örn. 32v1sA">
                </div>
                <button id="startBots">Botları Başlat</button>
                <div class="status" id="statusLog">Durum: Botlar hazır, başlatmak için butona tıklayın...</div>
                <div class="kawaii-text">✧･ﾟ: *✧･ﾟ:* Cute Gartic Bots *:･ﾟ✧*:･ﾟ✧</div>
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
                <button id="reportDrawing" style="background: linear-gradient(45deg, #ff5555, #a6c1ff);">Çizimi Raporla</button>
                <div class="status" id="spamStatus">Durum: Spam kapalı</div>
            </div>
        </div>
 
        <div class="anime-mascot" style="background-image: url('https://cdn.jsdelivr.net/gh/Gartic-Developers/Kawaii-Helper@refs/heads/main/Assets/kawaii-logo.png');"></div>
    `;
 
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
    let token, sala, botCount, roomCode, roomId;
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
    let botChoices = new Map(); // Store bot choices (word)
 
    // Invisible characters list
    const invisibleChars = ['\u200B', '\u200C', '\u200D', '\u2061', '\u2062', '\u2063', '\u2064', '\u2066', '\u17b4', '\u17b5', '\u2068', '\u2069'];
 
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
            startBotsButton.style.background = 'linear-gradient(45deg, #ff5555, #ff9dc4)';
            startBotsButton.disabled = false;
        } else {
            startBotsButton.textContent = 'Botları Başlat';
            startBotsButton.style.background = 'linear-gradient(45deg, #7a6ed9, #a6c1ff)';
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
        document.getElementById('startSpam').style.background = 'linear-gradient(45deg, #ff5555, #a6c1ff)';
 
        spamLog(`Spam başlatıldı: "${spamTextBase}" (${spamChannel === "answers" ? "Cevaplar" : "Sohbet"} kanalı)`);
 
        const commandCode = spamChannel === "answers" ? "13" : "11";
 
        clearInterval(spamInterval);
        spamInterval = setInterval(() => {
            socketList.forEach((socket, index) => {
                if (socket.readyState === WebSocket.OPEN && socket.playerId) {
                    // Add invisible character to each message
                    const spamText = insertInvisibleChar(spamTextBase);
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
        document.getElementById('startSpam').style.background = 'linear-gradient(45deg, #7a6ed9, #a6c1ff)';
        spamLog("Spam durduruldu.");
    }
 
    // Clean room code function
    function cleanRoomCode(input) {
        if (!input) return input;
        // Remove URL parts and extract room code
        const match = input.match(/([A-Za-z0-9]{6})(?:\/viewer)?$/);
        return match ? match[1] : input;
    }
 
    // Start bots function
    function startBots() {
        botCount = parseInt(document.getElementById('botCount').value) || 5;
        roomCode = cleanRoomCode(document.getElementById('roomCode').value.trim());
        roomId = roomCode;
        botsCreated = 0;
        botQueue = Array.from({ length: botCount }, (_, i) => i);
        isCreatingBot = false;
 
        if (!roomCode) return alert('Lütfen bir oda kodu girin!');
 
        log(`Starting ${botCount} bots for room ${roomCode}`);
        statusLog(`${botCount} bot başlatılıyor... Oda: ${roomCode}`);
 
        document.getElementById('roomCodeDisplay').textContent = `Oda: ${roomCode}`;
        updateButtonState(true); // Disable button and show loading
 
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
            }
        });
    }
 
    // Create next bot from queue
    function createNextBot() {
        if (botQueue.length === 0 || isCreatingBot) {
            updateButtonState(); // Update button state when bot creation stops
            return;
        }
 
        isCreatingBot = true;
        const index = botQueue.shift();
        createIframe(index);
    }
 
    // Create iframe for bot
    function createIframe(index) {
        statusLog(`Bot ${index + 1} oluşturuluyor...`);
 
        const iframe = document.createElement('iframe');
        iframe.src = `https://gartic.io/${roomCode}`;
        iframe.style = 'display:none';
        document.body.appendChild(iframe);
        currentIframe = iframe;
 
        iframe.onload = () => {
            const iw = iframe.contentWindow;
            const id = iframe.contentDocument;
 
            setTimeout(() => {
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
 
                GM_cookie.delete({ name: 'garticio' }, (error) => {
                    log(error ? `Bot ${index}: Cookie deletion error` : `Bot ${index}: Cookie deleted`);
                });
                GM_cookie.delete({ name: 'cf_clearance' }, (error) => {
                    log(error ? '✖ garticio çerezi silinirken hata oluştu!' : '✔ garticio çerezi başarıyla silindi!');
                });
 
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
                                        websocketUrl = `wss://${server}/socket.io/?c=${cParam}&EIO=3&transport=websocket`;
                                        log(`WebSocket URL constructed: ${websocketUrl}`);
                                        statusLog(`WebSocket URL oluşturuldu: ${websocketUrl}`);
                                        createBotSocket(index, websocketUrl, index === 0);
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
            }, 1500);
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
        return cleanNick === 'anonimbiri' || cleanNick === 'AnonimBiri';
    }
 
    // Create WebSocket for bot
    function createBotSocket(index, wsUrl, isFirstBot = false) {
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
                const baseNick = isFirstBot ? 'AnonimBiri' : 'anonimbiri';
                const nick = insertInvisibleChar(baseNick);
                ws.send(`42[3,{"v":20000,"token":"${token}","nick":"${nick}","avatar":"","platform":0,"sala":"${sala}"}]`);
                log(`Bot ${index}: Joined as ${nick}`);
                statusLog(`Bot ${index + 1}: "${nick}" olarak katıldı`);
            }
 
            if (e.data === '42["6",3]') {
                const errorMessage = 'Hata 3 - Oda dolu, daha fazla bot eklenemez';
                log(`Bot ${index}: ${errorMessage}`, true);
                statusLog(`Bot ${index + 1}: ${errorMessage}`);
                botQueue = []; // Stop creating new bots
                cleanupIframe();
                isCreatingBot = false;
                updateButtonState(); // Update button to "Delete All Bots" if any bots exist
                return;
            }
 
            if (e.data === '42["6",4]') {
                const errorMessage = `oyunda gözüküyorsun eğer yan sekmede oyunda iseniz oyundan çıkıp izleyici moda geçin.\nizleyici link: https://gartic.io/${roomCode}/viewer`;
                alert(errorMessage);
                log(`Bot ${index}: Error 4 - ${errorMessage}`, true);
                statusLog(`Bot ${index + 1}: Hata 4 - ${errorMessage}`);
                botQueue = []; // Stop creating new bots
                cleanupIframe();
                isCreatingBot = false;
                updateButtonState(); // Update button to "Delete All Bots" if any bots exist
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
                    log(`Bot ${index}: Bot created, total created: ${botsCreated}/${botCount}`);
 
                    if (botsCreated >= botCount) {
                        updateButtonState(); // Update to "Delete All Bots"
                        statusLog(`Tüm botlar (${botCount}) başarıyla başlatıldı! ✨`);
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
 
                            // Store the choice (word) for this bot
                            botChoices.set(ws.playerId, choice);
 
                            log(`Bot ${index}: Received options ${options.join(' vs ')}, chose ${choice} (${choiceIndex})`);
 
                            setTimeout(() => {
                                if (ws.readyState === WebSocket.OPEN && ws.playerId) {
                                    ws.send(`42[34,${ws.playerId},${choiceIndex}]`);
                                    log(`Bot ${index}: Sent choice ${choiceIndex} for ${choice}`);
                                } else {
                                    log(`Bot ${index}: Socket closed or no playerId, cannot send choice`, true);
                                }
                            }, 8000);
                        } catch (e) {
                            log(`Bot ${index}: Error parsing 16 message: ${e}`, true);
                        }
                    }
 
                    if (e.data.startsWith('42["34",')) {
                        try {
                            if (ws.readyState === WebSocket.OPEN && ws.playerId) {
                                // Send original 42[30] messages
                                ws.send(`42[30,${ws.playerId}]`);
                                ws.send(`42[30,${ws.playerId}]`);
                                ws.send(`42[30,${ws.playerId}]`);
                                ws.send(`42[30,${ws.playerId}]`);
 
                                // Send choice to all bots except self
                                const choice = botChoices.get(ws.playerId);
                                if (choice) {
                                    socketList.forEach((otherSocket) => {
                                        if (otherSocket !== ws && otherSocket.readyState === WebSocket.OPEN && otherSocket.playerId) {
                                            otherSocket.send(`42[13,${otherSocket.playerId},"${choice}"]`);
                                            log(`Bot ${index}: Sent choice ${choice} to bot ${otherSocket.playerId}`);
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
 
    // Kick player function
    function kickPlayer(playerId) {
        if (socketList.length === 0) {
            statusLog("Kick işlemi için aktif bağlantı bulunamadı!");
            return;
        }
 
        if (playerId) {
            socketList.forEach((socket, index) => {
                if (socket.readyState === WebSocket.OPEN && socket.playerId) {
                    socket.send(`42[45,${socket.playerId},["${playerId}",true]]`);
                    log(`Kick request sent for player ${playerId} from socket ${index} with playerId ${socket.playerId}`);
                    statusLog(`Oyuncu kick işlemi gönderildi: ${playerId} (Soket ${index + 1})`);
                }
            });
        } else {
            log("Kick failed: Missing player ID", true);
            statusLog("Kick başarısız: Oyuncu ID eksik");
        }
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
            return player.foto;
        } else if (player.avatar !== undefined && player.avatar !== null) {
            return `https://gartic.io/static/images/avatar/svg/${player.avatar}.svg`;
        } else {
            return 'https://gartic.io/static/images/avatar/svg/0.svg';
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
 
    // Initialize animations and effects
    function initAnimations() {
        const heartsContainer = document.querySelector('.hearts');
        let heartsHTML = '';
 
        for (let i = 0; i < 20; i++) {
            heartsHTML += `<div class="heart" style="
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                opacity: ${0.3 + Math.random() * 0.7};
                transform: scale(${0.5 + Math.random() * 1.5}) rotate(45deg);
                animation-duration: ${10 + Math.random() * 20}s;
                animation-delay: ${Math.random() * 10}s;
            "></div>`;
        }
 
        heartsContainer.innerHTML = heartsHTML;
    }
 
    // Run initialization
    initAnimations();
 
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
    log("Gartic Anonimbiri Bot Panel v2025-04-20 başlatıldı");
    statusLog("Bot paneli aktif! Botları başlatmak için üstteki butona tıklayın.");
})();