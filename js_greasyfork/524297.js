// ==UserScript==
// @name         GarticPro v3.0
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Gartic.io Enhanced Experience
// @author       ProDev
// @match        https://gartic.io/?Pro*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/524297/GarticPro%20v30.user.js
// @updateURL https://update.greasyfork.org/scripts/524297/GarticPro%20v30.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STYLE = `
    :root {
        --primary: #6c5ce7;
        --primary-dark: #5849e0;
        --accent: #a55eea;
        --background: rgba(15,15,26,0.95);
        --surface: rgba(26,26,46,0.98);
        --surface-light: rgba(36,36,68,0.95);
        --text: #ffffff;
        --text-secondary: rgba(255,255,255,0.7);
        --border: rgba(108,92,231,0.2);
        --shadow: 0 4px 20px rgba(0,0,0,0.25);
        --shadow-lg: 0 8px 30px rgba(0,0,0,0.3);
        --gradient: linear-gradient(45deg, var(--primary), var(--accent));
    }

    #garticpro {
        position: fixed;
        top: 20px;
        left: 20px;
        width: 95%;
        max-width: 400px;
        background: var(--surface);
        border-radius: 15px;
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        backdrop-filter: blur(10px);
        border: 1px solid var(--border);
        overflow: hidden;
        transform: translateX(-420px);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
        animation: fadeIn 0.5s ease forwards;
    }

    #garticpro.active {
        transform: translateX(0);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .gp-header {
        background: var(--gradient);
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .gp-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .gp-logo {
        width: 32px;
        height: 32px;
        background: rgba(255,255,255,0.2);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
    }

    .gp-name {
        font-weight: 600;
        font-size: 1rem;
        color: var(--text);
    }

    .gp-version {
        font-size: 0.75rem;
        opacity: 0.8;
    }

    .gp-toggle {
        position: fixed;
        top: 20px;
        left: 20px;
        width: 48px;
        height: 48px;
        background: var(--surface);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: var(--shadow);
        border: 1px solid var(--border);
        transition: all 0.3s ease;
        z-index: 10000;
    }

    .gp-toggle:hover {
        transform: scale(1.05);
        background: var(--surface-light);
    }

    .gp-content {
        padding: 1rem;
    }

    .gp-stats {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }

    .gp-stat {
        background: var(--surface-light);
        padding: 0.75rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
    }

    .gp-stat-icon {
        width: 32px;
        height: 32px;
        background: var(--primary);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
    }

    .gp-stat-info {
        flex: 1;
    }

    .gp-stat-value {
        font-size: 1rem;
        font-weight: 600;
    }

    .gp-stat-label {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    .gp-tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        padding: 0.25rem;
        background: var(--surface-light);
        border-radius: 10px;
    }

    .gp-tab {
        flex: 1;
        padding: 0.5rem;
        border: none;
        background: none;
        color: var(--text);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
    }

    .gp-tab.active {
        background: var(--primary);
    }

    .gp-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-height: 400px;
        overflow-y: auto;
        padding-right: 0.5rem;
    }

    .gp-room, .gp-player {
        background: var(--surface-light);
        padding: 0.75rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
    }

    .gp-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        overflow: hidden;
    }

    .gp-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .gp-info {
        flex: 1;
    }

    .gp-name {
        font-weight: 600;
        font-size: 0.875rem;
        margin-bottom: 0.25rem;
    }

    .gp-stats {
        font-size: 0.75rem;
        color: var(--text-secondary);
        display: flex;
        gap: 0.5rem;
    }

    .gp-actions {
        display: flex;
        gap: 0.5rem;
    }

    .gp-action {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.1);
        border: none;
        color: var(--text);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    `;

    class GarticPro {
        constructor() {
            this.players = new Map();
            this.rooms = new Map();
            this.activeTab = 'players';
            this.initialized = false;
        }

        init() {
            this.createUI();
            this.fetchRoomData();
            this.setupEventListeners();
            this.startUpdateCycle();
            this.initialized = true;
        }

        createUI() {
            GM_addStyle(STYLE);

            const container = document.createElement('div');
            container.id = 'garticpro';
            container.innerHTML = `
                <div class="gp-header">
                    <div class="gp-title">
                        <div class="gp-logo">
                            <i class="fas fa-dragon"></i>
                        </div>
                        <div>
                            <div class="gp-name">GarticPro</div>
                            <div class="gp-version">v3.0</div>
                        </div>
                    </div>
                </div>
                <div class="gp-content">
                    <div class="gp-stats">
                        <div class="gp-stat">
                            <div class="gp-stat-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="gp-stat-info">
                                <div class="gp-stat-value" id="gp-player-count">0</div>
                                <div class="gp-stat-label">Players</div>
                            </div>
                        </div>
                        <div class="gp-stat">
                            <div class="gp-stat-icon">
                                <i class="fas fa-door-open"></i>
                            </div>
                            <div class="gp-stat-info">
                                <div class="gp-stat-value" id="gp-room-count">0</div>
                                <div class="gp-stat-label">Rooms</div>
                            </div>
                        </div>
                    </div>
                    <div class="gp-tabs">
                        <button class="gp-tab active" data-tab="players">
                            <i class="fas fa-users"></i> Players
                        </button>
                        <button class="gp-tab" data-tab="rooms">
                            <i class="fas fa-door-open"></i> Rooms
                        </button>
                    </div>
                    <div class="gp-list gp-players" id="gp-player-list"></div>
                    <div class="gp-list gp-rooms" id="gp-room-list" style="display: none;"></div>
                </div>
            `;

            const toggle = document.createElement('div');
            toggle.className = 'gp-toggle';
            toggle.innerHTML = '<i class="fas fa-dragon"></i>';
            toggle.onclick = () => container.classList.toggle('active');

            document.body.appendChild(container);
            document.body.appendChild(toggle);

            const loadFontAwesome = () => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
                document.head.appendChild(link);
            };

            loadFontAwesome();
        }

        fetchRoomData() {
            fetch("https://gartic.io/req/list?search=&language[]=8")
                .then(response => response.json())
                .then(data => {
                    data.forEach(room => {
                        if (room.quant > 0) {
                            this.getData(room.code);
                        }
                    });
                });
            setTimeout(() => this.fetchRoomData(), 5000);
        }

        getData(roomCode) {
            const players = [];
            ['01', '02', '03', '04', '05', '06'].forEach(server => {
                const ws = new WebSocket(`wss://server${server}.gartic.io/socket.io/?EIO=3&transport=websocket`);
                
                ws.onopen = () => {
                    ws.send(`42[12,{"v":20000,"platform":0,"sala":"${roomCode.slice(-4)}"}]`);
                };

                ws.onmessage = (msg) => {
                    if (msg.data.startsWith('42')) {
                        const data = JSON.parse(msg.data.slice(2));
                        if (data[0] == 5) {
                            data[5].forEach(user => {
                                players.push({
                                    points: user.pontos,
                                    victory: user.vitorias,
                                    id: user.id,
                                    avatar: user.avatar,
                                    room: `https://gartic.io/${roomCode}`,
                                    nick: user.nick,
                                    foto: user.foto
                                });
                                this.players.set(user.id, {
                                    points: user.pontos,
                                    victory: user.vitorias,
                                    id: user.id,
                                    avatar: user.avatar,
                                    room: `https://gartic.io/${roomCode}`,
                                    nick: user.nick,
                                    foto: user.foto
                                });
                            });
                            this.rooms.set(roomCode, {
                                code: roomCode,
                                players: players.length,
                                language: data[1],
                                timestamp: Date.now(),
                                playersData: players
                            });
                            this.updatePlayerList();
                            this.updateRoomList();
                            this.updateStats();
                            ws.close();
                        }
                    }
                };
            });
        }

        updatePlayerList() {
            const container = document.getElementById('gp-player-list');
            if (!container || this.activeTab !== 'players') return;

            const players = Array.from(this.players.values())
                .sort((a, b) => b.points - a.points);

            container.innerHTML = players.map(player => `
                <div class="gp-player" data-id="${player.id}">
                    <div class="gp-avatar">
                        <img src="${player.foto || `https://gartic.io/static/images/avatar/svg/${player.avatar}.svg`}" alt="${player.nick}">
                    </div>
                    <div class="gp-info">
                        <div class="gp-name">${player.nick}</div>
                        <div class="gp-stats">
                            <div>
                                <i class="fas fa-star"></i> ${player.points.toLocaleString()}
                            </div>
                            <div>
                                <i class="fas fa-door-open"></i> ${player.room}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        updateRoomList() {
            const container = document.getElementById('gp-room-list');
            if (!container || this.activeTab !== 'rooms') return;

            const rooms = Array.from(this.rooms.values())
                .sort((a, b) => b.players - a.players);

            container.innerHTML = rooms.map(room => `
                <div class="gp-room" data-code="${room.code}">
                    <div class="gp-info">
                        <div class="gp-name">Room: ${room.code}</div>
                        <div class="gp-stats">
                            <div>
                                <i class="fas fa-users"></i> ${room.players} Players
                            </div>
                            <div>
                                <i class="fas fa-globe"></i> ${room.language.toUpperCase()}
                            </div>
                        </div>
                    </div>
                    <div class="gp-actions">
                        <button class="gp-action" onclick="window.open('https://gartic.io/${room.code}/viewer', '_blank')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        updateStats() {
            const playerCount = document.getElementById('gp-player-count');
            const roomCount = document.getElementById('gp-room-count');

            if (playerCount) {
                playerCount.textContent = this.players.size;
            }
            if (roomCount) {
                roomCount.textContent = this.rooms.size;
            }
        }

        setupEventListeners() {
            document.querySelectorAll('.gp-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    document.querySelectorAll('.gp-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    this.activeTab = tab.dataset.tab;
                    if (this.activeTab === 'rooms') {
                        document.getElementById('gp-player-list').style.display = 'none';
                        document.getElementById('gp-room-list').style.display = 'block';
                        this.updateRoomList();
                    } else {
                        document.getElementById('gp-room-list').style.display = 'none';
                        document.getElementById('gp-player-list').style.display = 'block';
                        this.updatePlayerList();
                    }
                });
            });
        }

        startUpdateCycle() {
            setInterval(() => {
                this.cleanupOldData();
                if (this.activeTab === 'players') {
                    this.updatePlayerList();
                } else {
                    this.updateRoomList();
                }
                this.updateStats();
            }, 5000);
        }

        cleanupOldData() {
            const now = Date.now();
            for (const [id, player] of this.players) {
                if (now - player.lastSeen > 30000) {
                    this.players.delete(id);
                }
            }
            for (const [code, room] of this.rooms) {
                if (now - room.timestamp > 30000) {
                    this.rooms.delete(code);
                }
            }
        }
    }

    if (window.top === window.self) {
        const app = new GarticPro();
        window.garticPro = app;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => app.init());
        } else {
            app.init();
        }
    }
})();