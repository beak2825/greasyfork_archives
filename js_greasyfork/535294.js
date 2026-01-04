// ==UserScript==
// @name         SPIDER BOT V2 with Anonimbiri Features
// @name:tr      SPIDER BOT V2 ve Anonimbiri Özellikleri
// @namespace    http://tampermonkey.net/
// @version      2025-05-08
// @description  SPIDER BOT V2 with Anonimbiri's gangster-themed interface, player list, and spam features for gartic.io, without proxy
// @description:tr SPIDER BOT V2, Anonimbiri'nin gangster temalı arayüzü, oyuncu listesi ve spam özellikleriyle gartic.io için, proxy olmadan
// @author       leader script & anonimbiri
// @license      MIT
// @match        https://gartic.io/*
// @icon         https://i.imgur.com/8zK9mX3.png
// @grant        GM_cookie
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/535294/SPIDER%20BOT%20V2%20with%20Anonimbiri%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/535294/SPIDER%20BOT%20V2%20with%20Anonimbiri%20Features.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Anonimbiri'den çerez silme fonksiyonu
    const deleteCookies = async () => {
        return new Promise((resolve, reject) => {
            GM_cookie.delete({ name: 'garticio' }, (error) => {
                console.log(error ? '✖ garticio çerezi silinirken hata!' : '✔ garticio çerezi silindi!');
                if (error) reject(error);
            });
            GM_cookie.delete({ name: 'cf_clearance' }, (error) => {
                console.log(error ? '✖ cf_clearance çerezi silinirken hata!' : '✔ cf_clearance çerezi silindi!');
                if (error) reject(error);
                resolve();
            });
        });
    };

    // SPIDER BOT V2'den görünmez karakterler ve rnext fonksiyonu
    const invisibleChars = ['\u200B', '\u200C', '\u200D', '\u2061', '\u2062', '\u2063', '\u2064', '\u2066', '\u17b4', '\u17b5', '\u2068', '\u2069'];
    function rnext(kelime) {
        const hd = kelime.split('');
        const hu = hd.length;
        const yh = [];
        let charCount = 0;
        for (let i = 0; i < hu; i++) {
            yh.push(hd[i]);
            charCount++;
            if (charCount < 18 && i < hu - 1) {
                const invisibleChar = invisibleChars[Math.floor(Math.random() * invisibleChars.length)];
                yh.push(invisibleChar);
                charCount++;
            }
            if (charCount >= 18) break;
        }
        return yh.join('');
    }

    // Anonimbiri'den bildirim fonksiyonu
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

    // Anonimbiri'den ayarları kaydetme/yükleme
    const elements = {
        autoKickCheckbox: null,
        noKickCooldownCheckbox: null,
        chatBypassCensorship: null,
        startBotsButton: null
    };

    const saveSettings = () => {
        localStorage.setItem('autoKick', elements.autoKickCheckbox.checked);
        localStorage.setItem('noKickCooldown', elements.noKickCooldownCheckbox.checked);
        localStorage.setItem('chatBypassCensorship', elements.chatBypassCensorship.checked);
        localStorage.setItem('avatar', localStorage.getItem('avatar') || '17');
        localStorage.setItem('botnick', localStorage.getItem('botnick') || '0');
        localStorage.setItem('nick', localStorage.getItem('nick') || 'Spider bot');
    };

    const loadSettings = () => {
        elements.autoKickCheckbox.checked = localStorage.getItem('autoKick') === 'true';
        elements.noKickCooldownCheckbox.checked = localStorage.getItem('noKickCooldown') === 'true';
        elements.chatBypassCensorship.checked = localStorage.getItem('chatBypassCensorship') === 'true';
    };

    // Global değişkenler (SPIDER BOT V2'den)
    let token, sala, roomCode, roomId;
    let websocketUrl = null;
    let playerList = [], socketList = [], botsCreated = 0, botQueue = [];
    let isCreatingBot = false, currentIframe = null, spamInterval = null, isSpamming = false;
    let botChoices = new Map(), lastKickTime = 0, lastKickBotIndex = -1;
    let botc = 0, readyc = 0, botsidvalue = [], customkickitems = JSON.parse(localStorage.getItem('customkick') || '[]');
    let roomusers = [], wsObj = null;

    // Arayüz (Anonimbiri'nin gangster temalı arayüzü, SPIDER BOT V2 özellikleri eklendi, proxy kaldırıldı)
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
                width: 100%;
            }
            button:hover:not(:disabled) {
                background: linear-gradient(45deg, #ff8c00, #ffa500);
                transform: translateY(-2px);
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
            .player-panel {
                background: rgba(30, 30, 30, 0.9);
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
                width: 320px;
                border: 2px solid #ff4500;
            }
            .player-list {
                overflow-y: auto;
                max-height: 250px;
                margin-top: 10px;
            }
            .player-item {
                display: flex;
                align-items: center;
                padding: 8px 12px;
                margin-bottom: 8px;
                background: rgba(34, 34, 34, 0.8);
                border-radius: 8px;
                border: 1px solid #ff4500;
            }
            .player-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                margin-right: 12px;
                background-size: cover;
                background-position: center;
                border: 2px solid #ff4500;
            }
            .player-name {
                font-weight: 700;
                color: #ff4500;
                font-size: 15px;
            }
            .kick-btn {
                background: linear-gradient(45deg, #ff4500, #ff8c00);
                padding: 5px 10px;
                border-radius: 8px;
                color: #000;
                font-size: 12px;
                cursor: pointer;
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
            .avatar-list {
                display: none;
                max-height: 300px;
                overflow-y: scroll;
            }
        </style>

        <img style="position: fixed; top: 183px; left: 73px; z-index: 9999;" src="https://i.ibb.co/WV1Ctxf/Sans-titre-1.jpg">
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
                <h3>Gartic Bot Kontrol</h3>
                <div class="input-group">
                    <label>Oda Kodu:</label>
                    <input type="text" id="roomCode" placeholder="Örn. 32v1sA">
                    <button id="viewer">Viewer</button>
                </div>
                <div class="input-group">
                    <label>Bot Sayısı:</label>
                    <input type="number" id="botCount" min="1" value="10">
                </div>
                <div class="input-group">
                    <label>Bot Nick:</label>
                    <input type="text" id="botNick" value="${localStorage.getItem('nick') || 'Spider bot'}">
                </div>
                <div class="input-group">
                    <label>Bot Avatar:</label>
                    <button id="chooseAvatar">Avatar Seç</button>
                    <div class="avatar-list" id="avatarList">
                        ${Array.from({length: 37}, (_, i) => `
                            <button class="avatar-btn"><img src="https://gartic.io/static/images/avatar/svg/${i}.svg" onclick="selectAvatar(${i})"></button>
                        `).join('')}
                    </div>
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
                <button id="jump">Atla</button>
                <button id="acceptDraw">Çizimi Kabul Et</button>
                <button id="exit">Çık</button>
                <div class="status" id="statusLog">Durum: Botlar hazır...</div>
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
                <button id="reportDrawing">Çizimi Raporla</button>
                <div class="status" id="spamStatus">Durum: Spam kapalı</div>
            </div>

            <div class="panel">
                <h3>Ek Özellikler</h3>
                <div class="input-group">
                    <label>Custom Kick Listesi:</label>
                    <input type="text" id="kickListInput" placeholder="Kullanıcı adı">
                    <button id="addKick">Ekle</button>
                    <button id="clearKickList">Listeyi Temizle</button>
                </div>
                <div id="kickListDisplay"></div>
            </div>
        </div>
    `;

    // Elemanları bağla (Anonimbiri'den)
    elements.autoKickCheckbox = document.getElementById('autoKickCheckbox');
    elements.noKickCooldownCheckbox = document.getElementById('noKickCooldownCheckbox');
    elements.chatBypassCensorship = document.getElementById('chatBypassCensorship');
    elements.startBotsButton = document.getElementById('startBots');

    // Durum logları (Anonimbiri'den)
    const statusLog = (msg) => {
        const logEl = document.getElementById('statusLog');
        logEl.innerHTML += `<div>→ ${msg}</div>`;
        logEl.scrollTop = logEl.scrollHeight;
    };

    const spamLog = (msg) => {
        const logEl = document.getElementById('spamStatus');
        logEl.innerHTML += `<div>→ ${msg}</div>`;
        logEl.scrollTop = logEl.scrollHeight;
    };

    // SPIDER BOT V2'den WebSocket yönetimi (proxy kaldırıldı)
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        if (!wsObj) wsObj = this;
        return originalSend.apply(this, arguments);
    };

    function cleanupIframe() {
        if (currentIframe) {
            currentIframe.remove();
            currentIframe = null;
            statusLog('Iframe kaldırıldı');
        }
    }

    function selectAvatar(avatarId) {
        localStorage.setItem('avatar', avatarId);
        document.getElementById('avatarList').style.display = 'none';
        statusLog(`Avatar seçildi: ${avatarId}`);
    }

    function connect() {
        roomCode = document.getElementById('roomCode').value.trim().match(/([A-Za-z0-9]{6})(?:\/viewer)?$/)?.[1];
        if (!roomCode) {
            showNotification('Geçerli bir oda kodu girin!', 1000);
            return;
        }
        botc = parseInt(document.getElementById('botCount').value) || 10;
        botQueue = Array.from({ length: botc }, (_, i) => i);
        socketList = [];
        deleteCookies().then(() => createNextBot());
    }

    function createNextBot() {
        if (botQueue.length === 0 || isCreatingBot) {
            elements.startBotsButton.textContent = 'Botları Başlat';
            elements.startBotsButton.disabled = false;
            return;
        }
        isCreatingBot = true;
        const index = botQueue.shift();
        createIframe(index);
    }

    async function createIframe(index) {
        await deleteCookies();
        statusLog(`Bot ${index + 1} oluşturuluyor...`);
        const iframe = document.createElement('iframe');
        iframe.src = `https://gartic.io/${roomCode}?t=${Date.now()}`;
        iframe.style.display = 'none';
        iframe.sandbox = 'allow-scripts allow-same-origin';
        document.body.appendChild(iframe);
        currentIframe = iframe;

        iframe.onload = async () => {
            const iw = iframe.contentWindow;
            const id = iframe.contentDocument;
            await deleteCookies();

            setTimeout(() => {
                const playButton = id.querySelector('.ic-playHome');
                if (playButton) {
                    playButton.click();
                    statusLog(`Bot ${index + 1}: Oyun butonuna tıklandı`);
                } else {
                    statusLog(`Bot ${index + 1}: Oyun butonu bulunamadı`);
                    cleanupIframe();
                    isCreatingBot = false;
                    botsCreated++;
                    createNextBot();
                    return;
                }

                const originalXHROpen = iw.XMLHttpRequest.prototype.open;
                iw.XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
                    if (url.includes('server?check=')) this.isServerCheck = true;
                    return originalXHROpen.apply(this, arguments);
                };

                const originalXHRSend = iw.XMLHttpRequest.prototype.send;
                iw.XMLHttpRequest.prototype.send = function(body) {
                    if (this.isServerCheck) {
                        this.addEventListener('readystatechange', function() {
                            if (this.readyState === 4 && this.status === 200) {
                                const response = this.responseText;
                                const match = response.match(/(https:\/\/[^?]+)\?c=([^&]+)/);
                                if (match) {
                                    const server = match[1].replace('https://', '');
                                    const cParam = match[2];
                                    websocketUrl = `wss://${server}/socket.io/?c=${cParam}&EIO=3&transport=websocket&t=${Date.now()}`;
                                    statusLog(`WebSocket URL: ${websocketUrl}`);
                                    createBotSocket(index, websocketUrl);
                                } else {
                                    statusLog(`WebSocket URL ayrıştırma hatası`);
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

                const originalWSSend = iw.WebSocket.prototype.send;
                iw.WebSocket.prototype.send = function(data) {
                    if (typeof data === 'string' && data.startsWith('42[3,{')) {
                        try {
                            const parsed = JSON.parse(data.substring(2));
                            if (parsed[1]?.token) {
                                token = parsed[1].token;
                                sala = parsed[1].sala || roomCode;
                                roomId = sala;
                                statusLog(`Bot ${index + 1}: Token alındı`);
                                document.getElementById('roomCodeDisplay').textContent = `Oda: ${sala}`;
                                return;
                            }
                        } catch (e) {
                            statusLog(`Bot ${index + 1}: JSON ayrıştırma hatası`);
                            cleanupIframe();
                            isCreatingBot = false;
                            botsCreated++;
                            createNextBot();
                        }
                    }
                    return originalWSSend.apply(this, arguments);
                };
            }, 400);
        };

        iframe.onerror = () => {
            statusLog(`Bot ${index + 1}: Iframe yükleme hatası`);
            cleanupIframe();
            isCreatingBot = false;
            botsCreated++;
            createNextBot();
        };
    }

    function createBotSocket(index, wsUrl) {
        if (!wsUrl) {
            statusLog(`Bot ${index + 1}: WebSocket URL bulunamadı`);
            cleanupIframe();
            isCreatingBot = false;
            botsCreated++;
            createNextBot();
            return;
        }

        const ws = new WebSocket(wsUrl);
        ws.index = index;
        socketList.push(ws);

        ws.onopen = () => {
            statusLog(`Bot ${index + 1}: Bağlantı açıldı`);
        };

        ws.onmessage = (e) => {
            if (e.data === '40') {
                const baseNick = document.getElementById('botNick').value || 'Spider bot';
                const botnick = localStorage.getItem('botnick') || '0';
                let nick = baseNick;
                const avatar = localStorage.getItem('avatar') || '17';
                if (botnick === '0') nick = rnext(baseNick);
                if (botnick === '1') nick = rnext(baseNick);
                if (botnick === '2') nick = baseNick + Math.ceil(Math.random() * 10000 + 1);
                if (botnick === '3') nick = baseNick + Math.ceil(Math.random() * 10000 + 1);
                ws.nick = nick;
                ws.send(`42[3,{"v":20000,"token":"${token}","nick":"${nick}","foto":"https://i.imgur.com/qL9YfQS.jpeg","avatar":"${avatar}","platform":0,"sala":"${sala}"}]`);
                statusLog(`Bot ${index + 1}: "${nick}" olarak katıldı`);
            }

            if (e.data.startsWith('42["5",')) {
                try {
                    const parsed = JSON.parse(e.data.substring(2));
                    ws.playerId = parsed[2];
                    ws.send(`42[46,${ws.playerId}]`);
                    botsidvalue.push(parsed[1]);
                    GM_setValue('botsidvalue', parsed[1]);
                    playerList = parsed[5].filter(p => !p.nick.includes('Spider'));
                    updatePlayerListUI();
                    document.getElementById('roomTheme').textContent = `Tema: ${parsed[4].tema || '-'}`;
                    cleanupIframe();
                    isCreatingBot = false;
                    botsCreated++;
                    botc++;
                    if (botsCreated >= botc) {
                        statusLog(`Tüm botlar (${botc}) başlatıldı!`);
                    }
                    createNextBot();
                } catch (e) {
                    statusLog(`Bot ${index + 1}: Veri ayrıştırma hatası`);
                    cleanupIframe();
                    isCreatingBot = false;
                    botsCreated++;
                    createNextBot();
                }
            }

            if (e.data.startsWith('42["23",') && elements.autoKickCheckbox.checked) {
                const parsed = JSON.parse(e.data.substring(2));
                if (!parsed[1].nick.includes('Spider')) {
                    kickPlayer(parsed[1].id);
                    statusLog(`Otomatik kick: ${parsed[1].nick}`);
                }
            }

            if (e.data.startsWith('42["16",')) {
                try {
                    const parsed = JSON.parse(e.data.substring(2));
                    const options = [parsed[1], parsed[3]];
                    const choiceIndex = Math.floor(Math.random() * 2);
                    botChoices.set(ws.playerId, options[choiceIndex]);
                    setTimeout(() => {
                        if (ws.readyState === WebSocket.OPEN && ws.playerId) {
                            ws.send(`42[34,${ws.playerId},${choiceIndex}]`);
                        }
                    }, 3000);
                } catch (e) {
                    statusLog(`Bot ${index + 1}: Seçim ayrıştırma hatası`);
                }
            }
        };

        ws.onerror = () => {
            statusLog(`Bot ${index + 1}: Bağlantı hatası`);
            socketList = socketList.filter(s => s !== ws);
            cleanupIframe();
            isCreatingBot = false;
            botsCreated++;
            createNextBot();
        };

        ws.onclose = () => {
            statusLog(`Bot ${index + 1}: Bağlantı kapandı`);
            socketList = socketList.filter(s => s !== ws);
            cleanupIframe();
            isCreatingBot = false;
            createNextBot();
        };
    }

    // Oyuncu listesi güncelleme (Anonimbiri'den)
    function updatePlayerListUI() {
        const playerListElement = document.getElementById('playerList');
        if (!playerList || playerList.length === 0) {
            playerListElement.innerHTML = `<div class="empty-list">Henüz oyuncu bilgisi yok...</div>`;
            return;
        }

        let html = '';
        playerList.forEach(player => {
            const avatarUrl = player.foto || `https://gartic.io/static/images/avatar/svg/${player.avatar || 0}.svg`;
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

    // Kick fonksiyonu (Anonimbiri'den)
    function kickPlayer(playerId) {
        if (socketList.length === 0) {
            statusLog("Kick işlemi için aktif bağlantı yok!");
            return;
        }

        const currentTime = Date.now();
        const cooldown = 2000;
        if (!elements.noKickCooldownCheckbox.checked && currentTime - lastKickTime < cooldown) {
            statusLog(`Kick için bekleme: ${((cooldown - (currentTime - lastKickTime)) / 1000).toFixed(1)} saniye`);
            return;
        }

        lastKickBotIndex = (lastKickBotIndex + 1) % socketList.length;
        const socket = socketList[lastKickBotIndex];

        if (socket.readyState === WebSocket.OPEN && socket.playerId) {
            socket.send(`42[45,${socket.playerId},["${playerId}",true]]`);
            statusLog(`Kick gönderildi: ${playerId} (${socket.nick})`);
        } else {
            statusLog(`Kick başarısız: Soket ${lastKickBotIndex + 1} açık değil`);
            kickPlayer(playerId);
        }
        lastKickTime = currentTime;
    }

    // Spam fonksiyonu (Anonimbiri'den)
    function startSpam() {
        if (socketList.length === 0) {
            spamLog("Spam için aktif bot yok!");
            return;
        }

        const spamTextBase = document.getElementById('spamText').value.trim();
        const spamChannel = document.getElementById('spamChannel').value;
        const spamIntervalValue = parseInt(document.getElementById('spamInterval').value) || 1000;

        if (!spamTextBase) {
            spamLog("Spam metni girin!");
            return;
        }

        isSpamming = true;
        document.getElementById('startSpam').textContent = 'Spam Durdur';
        document.getElementById('startSpam').style.background = 'linear-gradient(45deg, #ff5555, #ff8c00)';
        spamLog(`Spam başlatıldı: "${spamTextBase}" (${spamChannel})`);

        const commandCode = spamChannel === "answers" ? "13" : "11";
        clearInterval(spamInterval);
        spamInterval = setInterval(() => {
            socketList.forEach((socket, index) => {
                if (socket.readyState === WebSocket.OPEN && socket.playerId) {
                    const spamText = elements.chatBypassCensorship.checked ? rnext(spamTextBase) : spamTextBase;
                    socket.send(`42[${commandCode},${socket.playerId},"${spamText}"]`);
                    spamLog(`Spam gönderildi: ${spamText} (Bot ${index + 1})`);
                }
            });
        }, spamIntervalValue);
    }

    function stopSpam() {
        clearInterval(spamInterval);
        isSpamming = false;
        document.getElementById('startSpam').textContent = 'Spam Başlat';
        document.getElementById('startSpam').style.background = 'linear-gradient(45deg, #ff4500, #ff8c00)';
        spamLog("Spam durduruldu.");
    }

    // Custom kick listesi (SPIDER BOT V2'den)
    function updateKickList() {
        const kickListDisplay = document.getElementById('kickListDisplay');
        kickListDisplay.innerHTML = customkickitems.map(item => `
            <div>${item} <button onclick="removeKick('${item}')">Kaldır</button></div>
        `).join('');
    }

    function addKick() {
        const kickInput = document.getElementById('kickListInput').value.trim();
        if (kickInput && !customkickitems.includes(kickInput)) {
            customkickitems.push(kickInput);
            localStorage.setItem('customkick', JSON.stringify(customkickitems));
            updateKickList();
            statusLog(`Kick listesine eklendi: ${kickInput}`);
        }
    }

    function removeKick(item) {
        customkickitems = customkickitems.filter(i => i !== item);
        localStorage.setItem('customkick', JSON.stringify(customkickitems));
        updateKickList();
        statusLog(`Kick listesinden kaldırıldı: ${item}`);
    }

    function clearKickList() {
        customkickitems = [];
        localStorage.setItem('customkick', JSON.stringify(customkickitems));
        updateKickList();
        statusLog("Kick listesi temizlendi");
    }

    // Olay dinleyicileri
    elements.startBotsButton.addEventListener('click', () => {
        if (elements.startBotsButton.textContent === 'Botları Başlat') {
            connect();
            elements.startBotsButton.textContent = 'Tüm Botları Sil';
            elements.startBotsButton.style.background = 'linear-gradient(45deg, #ff5555, #ff8c00)';
        } else {
            socketList.forEach((socket, index) => {
                if (socket.readyState === WebSocket.OPEN && socket.playerId) {
                    socket.send(`42[24,${socket.playerId}]`);
                    socket.close();
                }
            });
            socketList = [];
            elements.startBotsButton.textContent = 'Botları Başlat';
            elements.startBotsButton.style.background = 'linear-gradient(45deg, #ff4500, #ff8c00)';
            statusLog("Tüm botlar silindi");
        }
    });

    document.getElementById('viewer').addEventListener('click', () => {
        const link = document.getElementById('roomCode').value.trim();
        if (link) {
            GM_openInTab(`${link}/viewer`, { active: true });
        }
    });

    document.getElementById('chooseAvatar').addEventListener('click', () => {
        const avatarList = document.getElementById('avatarList');
        avatarList.style.display = avatarList.style.display === 'block' ? 'none' : 'block';
    });

    document.getElementById('startSpam').addEventListener('click', () => {
        if (document.getElementById('startSpam').textContent === 'Spam Başlat') {
            startSpam();
        } else {
            stopSpam();
        }
    });

    document.getElementById('reportDrawing').addEventListener('click', () => {
        socketList.forEach((socket, index) => {
            if (socket.readyState === WebSocket.OPEN && socket.playerId) {
                socket.send(`42[35,${socket.playerId}]`);
                statusLog(`Çizim raporlandı (Bot ${index + 1})`);
            }
        });
    });

    document.getElementById('jump').addEventListener('click', () => {
        socketList.forEach((socket, index) => {
            if (socket.readyState === WebSocket.OPEN && socket.playerId) {
                socket.send(`42[30,${socket.playerId}]`);
                statusLog(`Atlama komutu gönderildi (Bot ${index + 1})`);
            }
        });
    });

    document.getElementById('acceptDraw').addEventListener('click', () => {
        socketList.forEach((socket, index) => {
            if (socket.readyState === WebSocket.OPEN && socket.playerId) {
                socket.send(`42[29,${socket.playerId}]`);
                statusLog(`Çizim kabul edildi (Bot ${index + 1})`);
            }
        });
    });

    document.getElementById('exit').addEventListener('click', () => {
        socketList.forEach((socket, index) => {
            if (socket.readyState === WebSocket.OPEN && socket.playerId) {
                socket.send(`42[24,${socket.playerId}]`);
                socket.close();
                statusLog(`Çıkış komutu gönderildi (Bot ${index + 1})`);
            }
        });
        socketList = [];
    });

    document.getElementById('addKick').addEventListener('click', addKick);
    document.getElementById('clearKickList').addEventListener('click', clearKickList);

    elements.autoKickCheckbox.addEventListener('change', () => {
        showNotification(`Otomatik Kick: ${elements.autoKickCheckbox.checked ? 'Açık' : 'Kapalı'}`, 2000);
        saveSettings();
    });

    elements.noKickCooldownCheckbox.addEventListener('change', () => {
        showNotification(`Kick Bekleme Süresi: ${elements.noKickCooldownCheckbox.checked ? 'Kaldırıldı' : 'Açık'}`, 2000);
        saveSettings();
    });

    elements.chatBypassCensorship.addEventListener('change', () => {
        showNotification(`Sohbet Sansürü: ${elements.chatBypassCensorship.checked ? 'Atlanıyor' : 'Açık'}`, 2000);
        saveSettings();
    });

    // SPIDER BOT V2'nin periyodik mesajları
    setInterval(() => {
        socketList.forEach((socket, index) => {
            if (socket.readyState === WebSocket.OPEN && socket.playerId) {
                socket.send(`42[42,${socket.playerId}]`);
            }
        });
    }, 2000);

    // Başlat
    loadSettings();
    updateKickList();
    statusLog("SPIDER BOT V2 ve Anonimbiri paneli aktif!");
})();