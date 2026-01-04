// ==UserScript==
// @name GarticFlix V1 Elite
// @namespace http://tampermonkey.net/
// @version v.11.0
// @description Ultimate Gartic Experience
// @author Akíra & ygn
// @match https://gartic.io/*
// @icon https://www.google.com/s2/favicons?domain=gartic.io
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/503448/GarticFlix%20V1%20Elite.user.js
// @updateURL https://update.greasyfork.org/scripts/503448/GarticFlix%20V1%20Elite.meta.js
// ==/UserScript==

if (window.location.href.indexOf("?L") !== -1) {
    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        
        :root {
            --bg-primary: #0f172a;
            --bg-secondary: #1e293b;
            --accent: #6366f1;
            --accent-hover: #4f46e5;
            --text: #e2e8f0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Outfit', sans-serif;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }

        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }

        .container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: var(--bg-primary);
            color: var(--text);
            overflow-y: auto;
            z-index: 9999;
            padding: 20px;
        }

        .header {
            background: linear-gradient(135deg, var(--accent), var(--accent-hover));
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            margin-bottom: 20px;
            position: relative;
            overflow: hidden;
            animation: float 6s ease-in-out infinite;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: shimmer 2s infinite;
        }

        .header h1 {
            font-size: 28px;
            font-weight: 700;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            margin: 0;
        }

        .controls {
            background: var(--bg-secondary);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            animation: fadeIn 0.5s ease-out;
        }

        .control-input {
            width: 100%;
            padding: 12px;
            background: rgba(255,255,255,0.1);
            border: 2px solid var(--accent);
            border-radius: 10px;
            color: var(--text);
            font-size: 16px;
            transition: all 0.3s ease;
        }

        .control-input:focus {
            outline: none;
            border-color: var(--accent-hover);
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .stat-card {
            background: var(--bg-secondary);
            padding: 15px;
            border-radius: 10px;
            text-align: center;
        }

        .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: var(--accent);
        }

        .stat-label {
            font-size: 14px;
            opacity: 0.8;
            margin-top: 5px;
        }

        .rooms-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            animation: fadeIn 0.6s ease-out;
        }

        .room-card {
            background: var(--bg-secondary);
            border-radius: 15px;
            padding: 20px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .room-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .room-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(99, 102, 241, 0.2);
        }

        .room-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--accent);
        }

        .room-stats {
            font-size: 14px;
            opacity: 0.8;
        }

        .room-actions {
            display: flex;
            gap: 10px;
        }

        .btn {
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            flex: 1;
            font-size: 14px;
        }

        .btn-primary {
            background: var(--accent);
            color: white;
        }

        .btn-primary:hover {
            background: var(--accent-hover);
            transform: translateY(-2px);
        }

        .btn-secondary {
            background: transparent;
            border: 2px solid var(--accent);
            color: var(--accent);
        }

        .btn-secondary:hover {
            background: var(--accent);
            color: white;
        }

        .users-grid {
            display: none;
            grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
            gap: 10px;
            margin-top: 15px;
            padding: 15px;
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
            animation: fadeIn 0.3s ease-out;
        }

        .user-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid var(--accent);
        }

        .user-avatar:hover {
            transform: scale(1.1);
            border-color: var(--accent-hover);
        }

        .nickname-tooltip {
            position: absolute;
            background: var(--accent);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        @media (max-width: 768px) {
            .controls {
                grid-template-columns: 1fr;
            }
            
            .rooms-grid {
                grid-template-columns: 1fr;
            }
        }
    `;

    document.head.innerHTML = `<style>${styles}</style>`;






















    const mainContainer = document.createElement("div");
    mainContainer.className = "container";
    mainContainer.innerHTML = `
        <div class="header">
            <h1>GarticFlix Elite</h1>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-value" id="totalRooms">0</div>
                <div class="stat-label">Aktif Odalar</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="totalPlayers">0</div>
                <div class="stat-label">Toplam Oyuncu</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="onlineUsers">0</div>
                <div class="stat-label">Çevrimiçi</div>
            </div>
        </div>

        <div class="controls">
            <input type="text" class="control-input" placeholder="Oda veya Oyuncu Ara..." onkeyup="window.filterRooms(this.value)">
            
            <select class="control-input theme-select" onchange="window.updateRooms()">
                <option value="">Tüm Temalar</option>
                <option value="1">Genel</option>
                <option value="28">Anime</option>
                <option value="30">Diğer</option>
                <option value="12">Oyunlar</option>
                <option value="24">Youtuber</option>
                <option value="11">LoL</option>
                <option value="2">Hayvanlar</option>
                <option value="31">Minecraft</option>
                <option value="4">Yiyecekler</option>
                <option value="9">Animasyon</option>
                <option value="35">Naruto</option>
                <option value="16">Bayraklar</option>
                <option value="10">Şarkılar</option>
                <option value="17">Futbol</option>
                <option value="26">Logo</option>
                <option value="5">Fiiller</option>
                <option value="33">FNAF</option>
                <option value="3">Nesneler</option>
                <option value="6">Ülkeler</option>
                <option value="7">Markalar</option>
                <option value="8">Filmler</option>
            </select>

            <select class="control-input lang-select" onchange="window.updateRooms()">
                <option value="8">Türkçe</option>
                <option value="2">English</option>
                <option value="3">Español</option>
                <option value="1">Português</option>
                <option value="7">Русский</option>
                <option value="13">Tiếng Việt</option>
                <option value="15">日本語</option>
                <option value="20">한국어</option>
                <option value="23">Azərbaycanca</option>
                <option value="45">Bahasa Indonesia</option>
                <option value="11">Čeština</option>
                <option value="14">Deutsch</option>
                <option value="4">Français</option>
                <option value="6">Italiano</option>
                <option value="44">Magyar</option>
                <option value="18">Nederlands</option>
                <option value="10">Polski</option>
                <option value="58">Română</option>
                <option value="22">Slovenčina</option>
                <option value="21">български език</option>
                <option value="40">עברית</option>
                <option value="19">العربية</option>
                <option value="34">فارسی</option>
                <option value="12">ภาษาไทย</option>
                <option value="16">中文 (简化字)</option>
                <option value="9">中文 (臺灣)</option>
                <option value="17">中文 (香港)</option>
            </select>
        </div>

        <div class="rooms-grid"></div>
    `;

    document.body.appendChild(mainContainer);

    let roomsData = [];
    let filteredRooms = [];

    function createRoomCard(room) {
        const card = document.createElement('div');
        card.className = 'room-card';
        card.innerHTML = `
            <div class="room-header">
                <div class="room-title">#${room.code}</div>
                <div class="room-stats">${room.quant}/${room.max} Oyuncu</div>
            </div>
            <div class="room-actions">
                <button class="btn btn-primary" onclick="window.joinRoom('${room.code}')">Katıl</button>
                <button class="btn btn-secondary" onclick="window.watchRoom('${room.code}')">İzle</button>
                <button class="btn btn-primary" onclick="window.showUsers('${room.code}')">Kullanıcılar</button>
            </div>
            <div class="users-grid" id="users-${room.code}"></div>
        `;
        return card;
    }

    window.filterRooms = (query) => {
        query = query.toLowerCase();
        filteredRooms = roomsData.filter(room => 
            room.code.toLowerCase().includes(query) ||
            (room.players && room.players.some(player => 
                player.nick.toLowerCase().includes(query)
            ))
        );
        updateRoomsDisplay();
    };

    window.updateRooms = () => {
        const theme = document.querySelector('.theme-select').value;
        const lang = document.querySelector('.lang-select').value;
        
        let url = `https://gartic.io/req/list?language[]=${lang}`;
        if (theme) url += `&subject[]=${theme}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                roomsData = data;
                filteredRooms = data;
                updateRoomsDisplay();
                updateStats();
            });
    };

    function updateStats() {
        document.getElementById('totalRooms').textContent = roomsData.length;
        const totalPlayers = roomsData.reduce((acc, room) => acc + room.quant, 0);
        document.getElementById('totalPlayers').textContent = totalPlayers;
        document.getElementById('onlineUsers').textContent = totalPlayers + Math.floor(Math.random() * 100);
    }















    function updateRoomsDisplay() {
        const container = document.querySelector('.rooms-grid');
        container.innerHTML = '';
        filteredRooms.forEach(room => {
            container.appendChild(createRoomCard(room));
        });
    }

    window.joinRoom = (code) => {
        window.open(`https://gartic.io/${code}`, '_blank');
    };

    window.watchRoom = (code) => {
        window.open(`https://gartic.io/${code}/viewer`, '_blank');
    };

    window.showUsers = (roomCode) => {
        const usersGrid = document.getElementById(`users-${roomCode}`);
        const isVisible = usersGrid.style.display === 'grid';
        
        if (!isVisible) {
            usersGrid.style.display = 'grid';
            loadRoomUsers(roomCode);
        } else {
            usersGrid.style.display = 'none';
        }
    };

    function loadRoomUsers(roomCode) {
        const usersGrid = document.getElementById(`users-${roomCode}`);
        usersGrid.innerHTML = '';

        const servers = ['01', '02', '03', '04', '05', '06'];
        let connectedServer = false;

        function tryNextServer(index) {
            if (index >= servers.length || connectedServer) return;

            const ws = new WebSocket(`wss://server${servers[index]}.gartic.io/socket.io/?EIO=3&transport=websocket`);
            
            ws.onopen = () => {
                ws.send(`42[12,{"v":20000,"platform":0,"sala":"${roomCode.slice(-4)}"}]`);
            };

            ws.onmessage = (msg) => {
                if (msg.data.startsWith('42[5,')) {
                    try {
                        const data = JSON.parse(msg.data.slice(2));
                        if (data[0] === 5 && Array.isArray(data[5])) {
                            connectedServer = true;
                            displayUsers(data[5], usersGrid);
                            ws.close();
                        }
                    } catch (e) {
                        console.error('JSON parse error:', e);
                    }
                }
            };

            ws.onerror = () => {
                tryNextServer(index + 1);
            };

            ws.onclose = () => {
                if (!connectedServer) {
                    tryNextServer(index + 1);
                }
            };
        }

        tryNextServer(0);
    }

    function displayUsers(users, container) {
        users.forEach(user => {
            const userContainer = document.createElement('div');
            userContainer.style.position = 'relative';
            
            const avatar = document.createElement('img');
            avatar.className = 'user-avatar';
            avatar.src = user.foto || `https://gartic.io/static/images/avatar/svg/${user.avatar}.svg`;
            avatar.setAttribute('data-nick', user.nick);
            avatar.setAttribute('data-points', user.pontos || 0);
            
            avatar.addEventListener('mouseenter', showTooltip);
            avatar.addEventListener('mouseleave', hideTooltip);
            
            userContainer.appendChild(avatar);
            container.appendChild(userContainer);
        });
    }

    function showTooltip(event) {
        const avatar = event.target;
        const nick = avatar.getAttribute('data-nick');
        const points = avatar.getAttribute('data-points');

        const tooltip = document.createElement('div');
        tooltip.className = 'nickname-tooltip';
        tooltip.innerHTML = `
            <div>${nick}</div>
            <div style="font-size: 11px">${points} puan</div>
        `;

        const rect = avatar.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = `${rect.left + rect.width/2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.transform = 'translate(-50%, -100%)';
        tooltip.style.opacity = '1';

        document.body.appendChild(tooltip);
        avatar.tooltip = tooltip;
    }

    function hideTooltip(event) {
        const tooltip = event.target.tooltip;
        if (tooltip) {
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.remove(), 200);
        }
    }

    
    window.updateRooms();
    setInterval(window.updateRooms, 5000);

    
    function handleResize() {
        const container = document.querySelector('.container');
        container.style.height = `${window.innerHeight}px`;
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    
    let updateTimeout;
    window.filterRooms = (query) => {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
            query = query.toLowerCase();
            filteredRooms = roomsData.filter(room => 
                room.code.toLowerCase().includes(query)
            );
            updateRoomsDisplay();
        }, 300);
    };
}