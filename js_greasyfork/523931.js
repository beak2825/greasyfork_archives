// ==UserScript==
// @name         Gartic Enhanced UI Pro
// @namespace    http://tampermonkey.net/
// @version      2024.1.2
// @description  Enhanced UI for Gartic.io with Advanced Features
// @author       Akira
// @match        https://gartic.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523931/Gartic%20Enhanced%20UI%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/523931/Gartic%20Enhanced%20UI%20Pro.meta.js
// ==/UserScript==

if(window.location.href.includes("?ww")) {
    document.head.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                margin: 0;
                background: #0f0f1a;
                font-family: 'Poppins', sans-serif;
                color: #fff;
                overflow-x: hidden;
                width: 100vw;
                height: 100vh;
            }

            #app-container {
                width: 100vw;
                height: 100vh;
                overflow-y: auto;
                background: linear-gradient(135deg, #0f0f1a, #1a1a2e);
                padding: 20px;
            }

            .top-bar {
                position: sticky;
                top: 0;
                background: rgba(15, 15, 26, 0.95);
                padding: 15px;
                backdrop-filter: blur(10px);
                border-bottom: 1px solid rgba(108, 92, 231, 0.2);
                z-index: 1000;
                margin: -20px -20px 20px -20px;
            }

            .search-box {
                max-width: 600px;
                margin: 15px auto;
                position: relative;
            }

            .search-input {
                width: 100%;
                padding: 12px 20px;
                border-radius: 12px;
                border: 2px solid #6c5ce7;
                background: rgba(26, 26, 46, 0.8);
                color: #fff;
                font-size: 16px;
                transition: all 0.3s ease;
            }

            .search-input:focus {
                outline: none;
                border-color: #a55eea;
                box-shadow: 0 0 15px rgba(108, 92, 231, 0.3);
            }

            .filters-panel {
                background: rgba(26, 26, 46, 0.9);
                padding: 15px;
                border-radius: 12px;
                margin: 10px 0;
                display: flex;
                gap: 20px;
                flex-wrap: wrap;
                align-items: center;
            }

            .filter-group {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .filter-checkbox {
                appearance: none;
                width: 20px;
                height: 20px;
                border: 2px solid #6c5ce7;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                transition: all 0.3s ease;
            }

            .filter-checkbox:checked {
                background: #6c5ce7;
            }

            .filter-checkbox:checked::after {
                content: "✓";
                position: absolute;
                color: white;
                font-size: 14px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .stats-panel {
                background: rgba(26, 26, 46, 0.9);
                padding: 20px;
                border-radius: 12px;
                margin: 10px 0;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 20px;
            }

            .stat-item {
                text-align: center;
            }

            .stat-value {
                font-size: 24px;
                font-weight: 600;
                color: #6c5ce7;
                margin-bottom: 5px;
            }

            .stat-label {
                font-size: 14px;
                color: rgba(255,255,255,0.7);
            }

            .sort-options {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .sort-select {
                background: rgba(26, 26, 46, 0.8);
                border: 1px solid #6c5ce7;
                color: white;
                padding: 8px;
                border-radius: 8px;
                cursor: pointer;
            }

            .sort-select option {
                background: #1a1a2e;
            }

            .rooms-container {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .room-block {
                background: rgba(26, 26, 46, 0.8);
                border-radius: 15px;
                padding: 20px;
                border: 1px solid rgba(108, 92, 231, 0.2);
                transition: all 0.3s ease;
            }

            .room-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(108, 92, 231, 0.2);
            }

            .room-title {
                font-size: 1.2em;
                font-weight: 600;
                color: #6c5ce7;
            }

            .room-stats {
                display: flex;
                gap: 15px;
                font-size: 0.9em;
            }

            .players-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
            }

            .player-card {
                background: rgba(15, 15, 26, 0.8);
                border-radius: 12px;
                padding: 15px;
                text-align: center;
                transition: all 0.3s ease;
                border: 1px solid rgba(108, 92, 231, 0.1);
            }

            .player-card:hover {
                transform: translateY(-5px);
                border-color: #6c5ce7;
                box-shadow: 0 5px 15px rgba(108, 92, 231, 0.2);
            }

            .player-avatar {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                margin: 0 auto 10px auto;
                border: 3px solid #6c5ce7;
                transition: all 0.3s ease;
            }

            .player-card:hover .player-avatar {
                border-color: #a55eea;
                transform: scale(1.05);
            }

            .player-name {
                font-weight: 600;
                margin: 5px 0;
                color: #fff;
            }

            .player-points {
                background: rgba(108, 92, 231, 0.2);
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 0.9em;
                color: #6c5ce7;
                display: inline-block;
                margin: 5px 0;
            }

            .player-links {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-top: 10px;
            }

            .room-link, .viewer-link {
                padding: 8px 15px;
                border-radius: 8px;
                text-decoration: none;
                transition: all 0.3s ease;
                font-size: 0.9em;
            }

            .room-link {
                background: linear-gradient(45deg, #6c5ce7, #a55eea);
                color: #fff;
            }

            .viewer-link {
                background: rgba(108, 92, 231, 0.1);
                color: #6c5ce7;
            }

            .room-link:hover, .viewer-link:hover {
                transform: translateY(-2px);
                filter: brightness(1.1);
            }

            .refresh-button {
                background: linear-gradient(45deg, #6c5ce7, #a55eea);
                border: none;
                padding: 8px 20px;
                border-radius: 8px;
                color: #fff;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9em;
            }

            .refresh-button:hover {
                transform: scale(1.05);
                box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);
            }

            .creator-tag {
                position: fixed;
                bottom: 10px;
                right: 10px;
                font-size: 12px;
                color: rgba(255,255,255,0.3);
                z-index: 1000;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .player-card {
                animation: fadeIn 0.5s ease-out forwards;
            }
        </style>
    `;

    document.body.innerHTML = `
        <div id="app-container">
            <div class="top-bar">
                <div class="search-box">
                    <input type="text" class="search-input" placeholder="Search players..." onkeyup="filterPlayers(this.value)">
                </div>
                <div class="filters-panel">
                    <div class="filter-group">
                        <input type="checkbox" id="avatarOnly" class="filter-checkbox" onchange="applyFilters()">
                        <label for="avatarOnly">Show Avatar Users Only</label>
                    </div>
                    <div class="filter-group">
                        <input type="checkbox" id="customProfileOnly" class="filter-checkbox" onchange="applyFilters()">
                        <label for="customProfileOnly">Show Custom Profile Users Only</label>
                    </div>
                    <div class="sort-options">
                        <label>Sort by:</label>
                        <select class="sort-select" onchange="sortPlayers(this.value)">
                            <option value="points">Points (High to Low)</option>
                            <option value="name">Name (A-Z)</option>
                            <option value="room">Room</option>
                        </select>
                    </div>
                </div>
                <div class="stats-panel">
                    <div class="stat-item">
                        <div class="stat-value" id="totalPlayers">0</div>
                        <div class="stat-label">Total Players</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="totalRooms">0</div>
                        <div class="stat-label">Active Rooms</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="avatarUsers">0</div>
                        <div class="stat-label">Avatar Users</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="customProfileUsers">0</div>
                        <div class="stat-label">Custom Profile Users</div>
                    </div>
                </div>
            </div>
            <div class="rooms-container"></div>
            <div class="creator-tag">Made By Akira</div>
        </div>
    `;

    let roomData = new Map();
    let updateTimers = new Map();

    function updateUI() {
        const container = document.querySelector('.rooms-container');
        container.innerHTML = '';

        roomData.forEach((players, roomCode) => {
            const roomBlock = document.createElement('div');
            roomBlock.className = 'room-block';
            roomBlock.innerHTML = `
                <div class="room-header">
                    <div class="room-title">Room: ${roomCode}</div>
                    <div class="room-stats">
                        <span>${players.length} Players</span>
                        <button class="refresh-button" onclick="refreshRoom('${roomCode}')">
                            Refresh
                        </button>
                    </div>
                </div>
                <div class="players-grid" id="room-${roomCode}">
                    ${players.map(user => createPlayerCard(user)).join('')}
                </div>
            `;
            container.appendChild(roomBlock);
        });
        updateStats();
    }

    function createPlayerCard(user) {
        const avatarSrc = user.foto || `https://gartic.io/static/images/avatar/svg/${user.avatar}.svg`;
        return `
            <div class="player-card" data-player-name="${user.nick.toLowerCase()}">
                <img class="player-avatar" src="${avatarSrc}" alt="${user.nick}" title="${user.id}">
                <div class="player-name">${user.nick}</div>
                <div class="player-points">${user.points}p</div>
                <div class="player-links">
                    <a href="${user.room}" target="_blank" class="room-link">Join Room</a>
                    <a href="${user.room}/viewer" target="_blank" class="viewer-link">View Only</a>
                </div>
            </div>
        `;
    }

    window.filterPlayers = function(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        document.querySelectorAll('.player-card').forEach(card => {
            const playerName = card.dataset.playerName;
            card.style.display = playerName.includes(searchTerm) ? 'block' : 'none';
        });
    };

    window.applyFilters = function() {
        const avatarOnly = document.getElementById('avatarOnly').checked;
        const customProfileOnly = document.getElementById('customProfileOnly').checked;
        
        document.querySelectorAll('.player-card').forEach(card => {
            const avatarSrc = card.querySelector('.player-avatar').src;
            const isAvatarUser = avatarSrc.includes('/static/images/avatar/svg/');
            
            let show = true;
            if (avatarOnly && !isAvatarUser) show = false;
            if (customProfileOnly && isAvatarUser) show = false;
            
            card.style.display = show ? 'block' : 'none';
        });
        
        updateStats();
    };

    window.sortPlayers = function(criteria) {
        roomData.forEach((players, roomCode) => {
            const sortedPlayers = [...players].sort((a, b) => {
                switch(criteria) {
                    case 'points':
                        return b.points - a.points;
                    case 'name':
                        return a.nick.localeCompare(b.nick);
                    case 'room':
                        return a.room.localeCompare(b.room);
                    default:
                        return 0;
                }
            });
            roomData.set(roomCode, sortedPlayers);
        });
        updateUI();
    };

    window.refreshRoom = function(roomCode) {
        getData(roomCode);
    };

    function updateStats() {
        const totalPlayers = Array.from(roomData.values()).reduce((acc, curr) => acc + curr.length, 0);
        const totalRooms = roomData.size;
        
        let avatarUsers = 0;
        let customProfileUsers = 0;
        
        roomData.forEach(players => {
            players.forEach(player => {
                if (player.foto) {
                    customProfileUsers++;
                } else {
                    avatarUsers++;
                }
            });
        });
        
        document.getElementById('totalPlayers').textContent = totalPlayers;
        document.getElementById('totalRooms').textContent = totalRooms;
        document.getElementById('avatarUsers').textContent = avatarUsers;
        document.getElementById('customProfileUsers').textContent = customProfileUsers;
    }

    function getData(roomCode) {
        if (updateTimers.has(roomCode)) {
            clearTimeout(updateTimers.get(roomCode));
        }

        const players = [];
        ['01', '02', '03', '04', '05', '06'].forEach(server => {
            const ws = new WebSocket(`wss://server${server}.gartic.io/socket.io/?EIO=3&transport=websocket`);
            
            ws.onopen = () => {
                ws.send(`42[12,{"v":20000,"platform":0,"sala":"${roomCode.slice(-4)}"}]`);
            };
            
            ws.onmessage = (msg) => {
                if(msg.data[4] == "5") {
                    const data = JSON.parse(msg.data.slice(2));
                    if(data[0] == 5) {
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
                        });
                        roomData.set(roomCode, players);
                        updateUI();
                        ws.close();
                    }
                }
            };
        });

        updateTimers.set(roomCode, setTimeout(() => getData(roomCode), 5000));
    }

    function fetchRooms() {
        fetch("https://gartic.io/req/list?search=&language[]=8")
            .then(x => x.json())
            .then(x => {
                x.forEach(room => {
                    if(room.quant > 0) {
                        getData(room.code);
                    }
                });
            });
        setTimeout(fetchRooms, 5000);
    }

    fetchRooms();
}