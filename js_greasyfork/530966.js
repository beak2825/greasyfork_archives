// ==UserScript==
    // @name         HookX Client
    // @namespace    http://tampermonkey.net/
    // @version      5.3
    // @description  Enhanced Sploop.io client with legal mods including custom crosshair and account management
    // @author       hooder
    // @match        https://sploop.io/*
    // @grant        none
    // @require      https://update.greasyfork.org/scripts/130/10066/Portable%20MD5%20Function.js
// @downloadURL https://update.greasyfork.org/scripts/530966/HookX%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/530966/HookX%20Client.meta.js
    // ==/UserScript==

    (function() {
        'use strict';

        function addStyle(css) {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
            return style;
        }

        function makeDraggable(element) {
            let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
            element.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                if (!isDragging) return;
                e.preventDefault();
                mouseX = e.clientX;
                mouseY = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e.preventDefault();
                posX = mouseX - e.clientX;
                posY = mouseY - e.clientY;
                mouseX = e.clientX;
                mouseY = e.clientY;
                const newTop = element.offsetTop - posY;
                const newLeft = element.offsetLeft - posX;
                element.style.top = Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight)) + "px";
                element.style.left = Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth)) + "px";
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        let isDragging = false;
        let menuVisible = true;
        let currentTheme = 'green';
        let pulseSpeed = 1.5;
        let spinSpeed = 3.1;

        addStyle(`
            .hookx-menu {
                position: fixed;
                top: 50px;
                left: 50px;
                width: 480px;
                height: 500px;
                background: linear-gradient(135deg, #1a3c34, #1a1a1a);
                border: 2px solid #4caf50;
                border-radius: 15px;
                color: #e0e0e0;
                font-family: 'Segoe UI', Arial, sans-serif;
                z-index: 10000;
                padding: 15px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
                overflow-y: auto;
                display: flex;
                flex-direction: column;
            }
            .hookx-menu h2 {
                margin: 0 0 10px 0;
                text-align: center;
                color: #a5d6a7;
                cursor: move;
                font-size: 24px;
                font-weight: 600;
            }
            .tab-buttons {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-bottom: 15px;
            }
            .tab-button {
                background: #4caf50;
                border: none;
                padding: 8px 20px;
                color: #ffffff;
                cursor: pointer;
                border-radius: 8px;
                transition: all 0.3s;
                font-size: 14px;
            }
            .tab-button:hover {
                background: #a5d6a7;
                color: #1a1a1a;
            }
            .tab-content {
                display: none;
                flex-grow: 1;
            }
            .tab-content.active {
                display: block;
            }
            .mod-toggle {
                margin: 10px 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 5px 10px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 5px;
                font-size: 14px;
            }
            .move-mods-btn {
                background: #4caf50;
                border: none;
                padding: 10px 20px;
                color: #ffffff;
                cursor: pointer;
                border-radius: 8px;
                margin-top: 15px;
                width: 150px;
                align-self: center;
                transition: all 0.3s;
                font-size: 14px;
            }
            .move-mods-btn:hover {
                background: #a5d6a7;
                color: #1a1a1a;
            }
            .mod-ui {
                position: fixed;
                padding: 10px;
                color: #e0e0e0;
                z-index: 1000;
                display: none;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                background: rgba(26, 26, 26, 0.8);
                font-size: 14px;
            }
            .keystrokes-ui, .pulse-effect-ui, .crosshair-ui {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .keystrokes-ui div {
                display: flex;
                justify-content: center;
                gap: 5px;
            }
            .keystroke-key {
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid #e0e0e0;
                border-radius: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.1s;
            }
            .keystroke-key.active {
                background: rgba(255, 255, 255, 0.8);
                color: #000;
            }
            .arraylist-container {
                width: auto;
                max-width: 200px;
                background: rgba(26, 26, 26, 0.7);
                border-radius: 5px;
                padding: 5px;
            }
            .arraylist-item {
                padding: 3px 8px;
                background: rgba(255, 255, 255, 0.1);
                margin: 2px 0;
                border-radius: 3px;
                transition: all 0.2s;
                font-size: 12px;
            }
            .arraylist-item:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            .player-list {
                position: fixed;
                top: 50px;
                left: 50px;
                width: 300px;
                max-height: 500px;
                background: linear-gradient(135deg, #1a3c34, #1a1a1a);
                border: 2px solid #4caf50;
                border-radius: 15px;
                padding: 15px;
                color: #e0e0e0;
                font-family: 'Segoe UI', Arial, sans-serif;
                overflow-y: auto;
                z-index: 9999;
                display: none;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
            }
            .player-list::-webkit-scrollbar {
                width: 8px;
            }
            .player-list::-webkit-scrollbar-thumb {
                background: #4caf50;
                border-radius: 4px;
            }
            .player-name {
                margin: 5px 0;
                font-size: 16px;
                opacity: 0;
                transition: opacity 0.5s;
            }
            .join-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(26, 26, 26, 0.7);
                color: #e0e0e0;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                opacity: 0;
                transition: opacity 0.5s;
                z-index: 10001;
            }
            .theme-buttons-container {
                position: fixed;
                top: 10%;
                left: 5%;
                display: none;
                flex-direction: column;
                gap: 10px;
            }
            .theme-button {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid #4caf50;
                transition: transform 0.3s;
            }
            .theme-button:hover {
                transform: scale(1.1);
            }
            .pink-button { background: linear-gradient(135deg, #f8bbd0, #ec407a); }
            .light-orange-button { background: linear-gradient(135deg, #ffcc80, #ff9800); }
            .skye-blue-button { background: linear-gradient(135deg, #81d4fa, #0288d1); }
            .green-button { background: linear-gradient(135deg, #a5d6a7, #4caf50); }
            .purple-button { background: linear-gradient(135deg, #d1c4e9, #7e57c2); }
            .neon-button { background: linear-gradient(135deg, #80deea, #26a69a); }
            .red-button { background: linear-gradient(135deg, #ef9a9a, #e53935); }
            .yellow-button { background: linear-gradient(135deg, #fff59d, #fbc02d); }
            .account-form {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-bottom: 15px;
            }
            .account-form input {
                padding: 8px;
                background: #333;
                color: #e0e0e0;
                border: 1px solid #4caf50;
                border-radius: 5px;
                font-size: 14px;
            }
            .account-form button {
                background: #4caf50;
                border: none;
                padding: 8px;
                color: #ffffff;
                cursor: pointer;
                border-radius: 5px;
                font-size: 14px;
            }
            .account-form button:hover {
                background: #a5d6a7;
                color: #1a1a1a;
            }
            .account-list {
                overflow-y: auto;
                flex-grow: 1;
                margin-top: 10px;
            }
            .account-card {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px;
                margin: 5px 0;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 5px;
                font-size: 14px;
            }
            .account-buttons {
                display: flex;
                gap: 10px;
            }
            .acc-btn {
                padding: 5px 15px;
                border: none;
                border-radius: 5px;
                color: #ffffff;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 12px;
            }
            .acc-btn-switch {
                background: #4caf50;
            }
            .acc-btn-switch:hover {
                background: #a5d6a7;
                color: #1a1a1a;
            }
            .acc-btn-remove {
                background: #d32f2f;
            }
            .acc-btn-remove:hover {
                background: #ef5350;
            }
            @keyframes screenPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            @keyframes hitFade {
                0% { opacity: 1; transform: rotate(45deg) scale(1); }
                100% { opacity: 0; transform: rotate(45deg) scale(1.2); }
            }
            @keyframes swingFade {
                0% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(2); }
            }
            .crosshair {
                position: fixed;
                z-index: 99999;
                pointer-events: none;
                display: none;
                transform: translate(-50%, -50%);
                will-change: transform;
            }
            .crosshair.dot {
                border-radius: 50%;
            }
            .crosshair.cross, .crosshair.xcross {
                width: 20px;
                height: 20px;
            }
            .crosshair.cross::before, .crosshair.cross::after,
            .crosshair.xcross::before, .crosshair.xcross::after {
                content: '';
                position: absolute;
                background-color: currentColor;
            }
            .crosshair.cross::before {
                top: 50%;
                left: 0;
                width: 100%;
                height: 2px;
                transform: translateY(-50%);
            }
            .crosshair.cross::after {
                top: 0;
                left: 50%;
                width: 2px;
                height: 100%;
                transform: translateX(-50%);
            }
            .crosshair.xcross::before {
                left: 50%;
                top: 0;
                width: 2px;
                height: 100%;
                transform: rotate(45deg);
            }
            .crosshair.xcross::after {
                left: 50%;
                top: 0;
                width: 2px;
                height: 100%;
                transform: rotate(-45deg);
            }
            .crosshair.spike {
                background-image: url("https://sploop.io/img/entity/hard_spike.png");
                background-size: cover;
            }
            .crosshair.square {
                border: 2px solid;
            }
            .crosshair.triangle {
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-bottom: 18px solid currentColor;
            }
            body.hide-cursor * {
                cursor: none !important;
            }
            .crosshair-select, .crosshair-color, .hookx-select, .hookx-color, .hookx-range {
                margin: 5px 0;
                width: 100%;
                padding: 5px;
                background: #333;
                color: #e0e0e0;
                border: 1px solid #4caf50;
                border-radius: 4px;
                font-size: 12px;
            }
            .hookx-label {
                font-size: 12px;
                color: #4caf50;
                margin: 5px 0 2px;
            }
            .hookx-range {
                -webkit-appearance: none;
                appearance: none;
                height: 5px;
                background: #444;
                outline: none;
            }
            .hookx-range::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 15px;
                height: 15px;
                background: #4caf50;
                cursor: pointer;
                border-radius: 50%;
            }
            #watermark {
                position: fixed;
                top: 50%;
                left: 10px;
                transform: translateY(-50%);
                color: rgba(255, 255, 255, 0.1);
                font-size: 24px;
                font-family: 'Segoe UI', sans-serif;
                pointer-events: none;
                z-index: 100001;
                user-select: none;
            }
        `);

        const themes = {
            green: { background: `linear-gradient(135deg, #1a3c34, #1a1a1a)`, border: `#4caf50`, button: `#4caf50` },
            blue: { background: `linear-gradient(135deg, #0d47a1, #1a1a1a)`, border: `#2196f3`, button: `#2196f3` },
            red: { background: `linear-gradient(135deg, #b71c1c, #1a1a1a)`, border: `#d32f2f`, button: `#d32f2f` },
            purple: { background: `linear-gradient(135deg, #4a148c, #1a1a1a)`, border: `#7e57c2`, button: `#7e57c2` },
            orange: { background: `linear-gradient(135deg, #e65100, #1a1a1a)`, border: `#ff9800`, button: `#ff9800` },
            cyan: { background: `linear-gradient(135deg, #006064, #1a1a1a)`, border: `#26a69a`, button: `#26a69a` },
            pink: { background: `linear-gradient(135deg, #ad1457, #1a1a1a)`, border: `#ec407a`, button: `#ec407a` },
            yellow: { background: `linear-gradient(135deg, #f57f17, #1a1a1a)`, border: `#fbc02d`, button: `#fbc02d` },
            neon: { background: `linear-gradient(135deg, #00b8d4, #1a1a1a)`, border: `#00e5ff`, button: `#00e5ff` },
            dark: { background: `linear-gradient(135deg, #212121, #1a1a1a)`, border: `#424242`, button: `#424242` },
            forest: { background: `linear-gradient(135deg, #2e7d32, #1a1a1a)`, border: `#66bb6a`, button: `#66bb6a` },
            ocean: { background: `linear-gradient(135deg, #01579b, #1a1a1a)`, border: `#29b6f6`, button: `#29b6f6` }
        };

        function applyTheme(element, theme) {
            element.style.background = themes[theme].background;
            element.style.border = `2px solid ${themes[theme].border}`;
            if (element.className.includes('tab-button') || element.className.includes('move-mods-btn') || element.className.includes('acc-btn')) {
                element.style.background = themes[theme].button;
            }
        }

        const menu = document.createElement('div');
        menu.className = 'hookx-menu';
        menu.innerHTML = `
            <h2>HookX Client</h2>
            <div class="tab-buttons">
                <button class="tab-button" data-tab="visual">Visual</button>
                <button class="tab-button" data-tab="utility">Utility</button>
                <button class="tab-button" data-tab="combat">Combat</button>
                <button class="tab-button" data-tab="players">Players</button>
                <button class="tab-button" data-tab="accounts">Accounts</button>
            </div>
            <div id="visual-tab" class="tab-content">
                <div class="mod-toggle"><input type="checkbox" id="menuThemeMod"> Menu Theme</div>
                <div class="mod-toggle"><input type="checkbox" id="arrayListMod"> ArrayList</div>
                <div class="mod-toggle"><input type="checkbox" id="zoomMod"> Zoom</div>
                <div class="mod-toggle"><input type="checkbox" id="nightVisionMod"> Night Vision</div>
                <div class="mod-toggle"><input type="checkbox" id="spinningSpikesMod"> Spike Spin Mod</div>
                <div class="mod-toggle"><input type="checkbox" id="pulseEffectMod"> Pulse Effect</div>
            </div>
            <div id="utility-tab" class="tab-content">
                <div class="mod-toggle"><input type="checkbox" id="fpsMod"> FPS</div>
                <div class="mod-toggle"><input type="checkbox" id="cpsMod"> CPS</div>
                <div class="mod-toggle"><input type="checkbox" id="fpsBoosterMod"> FPS Booster</div>
                <div class="mod-toggle"><input type="checkbox" id="pingMod"> Ping</div>
                <div class="mod-toggle"><input type="checkbox" id="keystrokesMod"> Keystrokes</div>
                <div class="mod-toggle"><input type="checkbox" id="coordinatesMod"> Coordinates</div>
                <div class="mod-toggle"><input type="checkbox" id="timerMod"> Timer</div>
            </div>
            <div id="combat-tab" class="tab-content">
                <div class="mod-toggle"><input type="checkbox" id="hitMarkersMod"> Hit Markers</div>
                <div class="mod-toggle"><input type="checkbox" id="rangeIndicatorMod"> Range Indicator</div>
                <div class="mod-toggle"><input type="checkbox" id="crosshairMod"> Custom Crosshair</div>
                <div class="mod-toggle"><input type="checkbox" id="swingAnimationMod"> Swing Animation</div>
            </div>
            <div id="players-tab" class="tab-content">
                <p>Player list is displayed here. Toggle with ; key.</p>
                <p>Made by blubby, edited by hooder</p>
            </div>
            <div id="accounts-tab" class="tab-content">
                <div class="account-form">
                    <input type="text" id="account-email" placeholder="Email">
                    <input type="password" id="account-password" placeholder="Password">
                    <button id="add-account-btn">Add Account</button>
                </div>
                <div class="account-list" id="account-list"></div>
            </div>
            <button class="move-mods-btn">Move Mods</button>
        `;
        document.body.appendChild(menu);
        makeDraggable(menu);
        applyTheme(menu, currentTheme);

        const watermark = document.createElement('div');
        watermark.id = 'watermark';
        watermark.textContent = 'hooder';
        document.body.appendChild(watermark);

        const tabButtons = menu.querySelectorAll('.tab-button');
        const tabContents = menu.querySelectorAll('.tab-content');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabContents.forEach(content => content.classList.remove('active'));
                menu.querySelector(`#${button.dataset.tab}-tab`).classList.add('active');
            });
            applyTheme(button, currentTheme);
        });
        menu.querySelector('#visual-tab').classList.add('active');

        const moveModsBtn = menu.querySelector('.move-mods-btn');
        moveModsBtn.addEventListener('click', () => {
            isDragging = !isDragging;
            moveModsBtn.textContent = isDragging ? 'Stop Moving' : 'Move Mods';
        });
        applyTheme(moveModsBtn, currentTheme);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Shift' && e.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
                menuVisible = !menuVisible;
                menu.style.display = menuVisible ? 'flex' : 'none';
            }
        });

        const playerList = document.createElement('div');
        playerList.className = 'player-list';
        document.body.appendChild(playerList);
        const playerNames = new Set();

        function addPlayerName(name) {
            if (!playerNames.has(name)) {
                const playerNameElement = document.createElement('div');
                playerNameElement.textContent = name;
                playerNameElement.className = 'player-name';
                playerList.appendChild(playerNameElement);
                playerNames.add(name);
                setTimeout(() => playerNameElement.style.opacity = '1', 100);
                displayJoinNotification(name);
            }
        }

        function displayJoinNotification(name) {
            const notification = document.createElement('div');
            notification.textContent = `${name} has joined!`;
            notification.className = 'join-notification';
            document.body.appendChild(notification);
            setTimeout(() => notification.style.opacity = '1', 100);
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 500);
            }, 3000);
        }

        WebSocket.prototype.realSend = WebSocket.prototype.send;
        WebSocket.prototype.send = function(data) {
            this.realSend(data);
            this.addEventListener('message', handleWebSocketMessages);
        };

        function handleWebSocketMessages(event) {
            try {
                const messageData = JSON.parse(event.data);
                if (messageData[0] === 33) {
                    playerList.innerHTML = '';
                    playerNames.clear();
                    const players = messageData[3];
                    if (players.length === 0) addPlayerName("Server Joined");
                    else players.forEach(player => addPlayerName(player[1]));
                } else if (messageData[0] === 32 || messageData[0] === 35) {
                    addPlayerName(messageData[2]);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        }

        let displayToggled = false;
        document.addEventListener('keydown', (e) => {
            if (e.key === ';') {
                displayToggled = !displayToggled;
                playerList.style.display = displayToggled ? 'block' : 'none';
                themeButtonsContainer.style.display = displayToggled ? 'flex' : 'none';
            }
        });

        const themeButtonsContainer = document.createElement('div');
        themeButtonsContainer.className = 'theme-buttons-container';
        const pinkButton = createThemeButton('pink-button', () => setTheme('#f8bbd0', '#ec407a', '#ec407a'));
        const orangeButton = createThemeButton('light-orange-button', () => setTheme('#ffcc80', '#ff9800', '#ff9800'));
        const blueButton = createThemeButton('skye-blue-button', () => setTheme('#81d4fa', '#0288d1', '#0288d1'));
        const greenButton = createThemeButton('green-button', () => setTheme('#a5d6a7', '#4caf50', '#4caf50'));
        const purpleButton = createThemeButton('purple-button', () => setTheme('#d1c4e9', '#7e57c2', '#7e57c2'));
        const neonButton = createThemeButton('neon-button', () => setTheme('#80deea', '#26a69a', '#26a69a'));
        const redButton = createThemeButton('red-button', () => setTheme('#ef9a9a', '#e53935', '#e53935'));
        const yellowButton = createThemeButton('yellow-button', () => setTheme('#fff59d', '#fbc02d', '#fbc02d'));
        themeButtonsContainer.append(pinkButton, orangeButton, blueButton, greenButton, purpleButton, neonButton, redButton, yellowButton);
        document.body.appendChild(themeButtonsContainer);

        function createThemeButton(className, onClick) {
            const button = document.createElement('div');
            button.className = `theme-button ${className}`;
            button.onclick = onClick;
            return button;
        }

        function setTheme(start, end, border) {
            playerList.style.background = `linear-gradient(135deg, ${start}, ${end})`;
            playerList.style.borderColor = border;
            playerList.querySelectorAll('.player-name').forEach(name => name.style.color = '#e0e0e0');
        }

        const accountList = menu.querySelector('#account-list');
        const addAccBtn = menu.querySelector('#add-account-btn');
        const emailInput = menu.querySelector('#account-email');
        const passInput = menu.querySelector('#account-password');

        let userpass = [];
        function createAccountCard(data) {
            const card = document.createElement('div');
            card.className = 'account-card';
            card.id = data.randomString;
            card.innerHTML = `
                <span>${data.name} (Score: ${data.score})</span>
                <div class="account-buttons">
                    <button class="acc-btn acc-btn-switch">Switch</button>
                    <button class="acc-btn acc-btn-remove">Remove</button>
                </div>
            `;
            const switchBtn = card.querySelector('.acc-btn-switch');
            const removeBtn = card.querySelector('.acc-btn-remove');
            applyTheme(switchBtn, currentTheme);
            applyTheme(removeBtn, currentTheme);
            switchBtn.addEventListener('click', () => {
                const loginBtn = document.getElementById('login');
                const logoutBtn = document.getElementById('logout');
                const gameEmailInput = document.getElementById('enter-mail');
                const gamePassInput = document.getElementById('enter-password');
                logoutBtn.click();
                gameEmailInput.value = data.email;
                gamePassInput.value = data.password;
                loginBtn.click();
            });
            removeBtn.addEventListener('click', () => {
                const storedData = JSON.parse(localStorage.getItem('cards') || '[]');
                const index = storedData.findIndex(item => item.randomString === data.randomString);
                storedData.splice(index, 1);
                localStorage.setItem('cards', JSON.stringify(storedData));
                card.remove();
            });
            return card;
        }

        function displayAccounts() {
            accountList.innerHTML = '';
            const storedData = JSON.parse(localStorage.getItem('cards') || '[]');
            storedData.forEach(data => accountList.appendChild(createAccountCard(data)));
        }

        addAccBtn.addEventListener('click', () => {
            const email = emailInput.value;
            const password = passInput.value;
            if (email && password) {
                fetch(`https://account.sploop.io:443/login?mail=${email}&hash=${hex_md5(password)}`)
                    .then(response => response.json())
                    .then(json => {
                        if (json.error) {
                            alert('Invalid Account');
                            return;
                        }
                        const storedData = JSON.parse(localStorage.getItem('cards') || '[]');
                        const randomString = Math.random().toString(36).substring(2, 12);
                        const newData = { name: json.nickname, email, password, score: json.score, randomString };
                        storedData.push(newData);
                        localStorage.setItem('cards', JSON.stringify(storedData));
                        accountList.appendChild(createAccountCard(newData));
                        emailInput.value = '';
                        passInput.value = '';
                    })
                    .catch(() => alert('Error adding account'));
            } else {
                alert('Please enter both email and password');
            }
        });

        const logo = document.createElement('div');
        logo.style = `
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            color: #a5d6a7;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 20px;
            z-index: 1000;
            cursor: move;
        `;
        logo.textContent = 'HookX Client';
        document.body.appendChild(logo);
        makeDraggable(logo);

        // Spinning Spikes Mod with Adjustable Speed
        const spinningSpikesUI = document.createElement('div');
        spinningSpikesUI.className = 'mod-ui';
        spinningSpikesUI.style.top = '10px';
        spinningSpikesUI.style.left = '150px';
        spinningSpikesUI.innerHTML = `
            <label>Spin Speed:</label>
            <input type="range" id="spinSpeedSlider" min="0.5" max="10" step="0.1" value="${spinSpeed}">
        `;
        document.body.appendChild(spinningSpikesUI);
        makeDraggable(spinningSpikesUI);
        applyTheme(spinningSpikesUI, currentTheme);

        const spinSpeedSlider = spinningSpikesUI.querySelector('#spinSpeedSlider');
        spinSpeedSlider.addEventListener('input', (e) => {
            spinSpeed = parseFloat(e.target.value);
        });

        function initSpinningSpikes() {
            const gameCanvas = document.getElementById('game-canvas');
            if (!gameCanvas) {
                console.log('Waiting for game canvas...');
                setTimeout(initSpinningSpikes, 500);
                return;
            }

            const ctx2D = gameCanvas.getContext('2d');
            const ctxWebGL = gameCanvas.getContext('webgl') || gameCanvas.getContext('experimental-webgl');
            console.log('Canvas context - 2D:', !!ctx2D, 'WebGL:', !!ctxWebGL);

            if (!ctx2D && ctxWebGL) {
                console.log('WebGL detected; 2D spinning spikes mod may not work. Attempting overlay fallback.');
                initOverlayFallback(gameCanvas);
                return;
            }

            if (!ctx2D) {
                console.log('No rendering context found; spikes mod cannot initialize.');
                return;
            }

            console.log('Spinning Spikes initialized on canvas (2D):', gameCanvas.id);

            const spikeUrls = new Set([
                "https://sploop.io/img/entity/spike.png?v=1923912",
                "https://sploop.io/img/entity/hard_spike.png?v=1923912",
                "https://sploop.io/img/entity/big_spike.png?v=1923912"
            ]);

            const spikeUpdate = (ctx, img, x, y, width, height, rotation) => {
                ctx.save();
                ctx.translate(x + width / 2, y + height / 2);
                ctx.rotate(rotation);
                ogdraw.call(ctx, img, -width / 2, -height / 2, width, height);
                ctx.restore();
            };

            const ogdraw = CanvasRenderingContext2D.prototype.drawImage;
            CanvasRenderingContext2D.prototype.drawImage = function(img, ...args) {
                const isSpinningEnabled = document.getElementById('spinningSpikesMod')?.checked || false;
                if (this.canvas && this.canvas.id === "game-canvas" && img instanceof HTMLImageElement && spikeUrls.has(img.src) && isSpinningEnabled) {
                    console.log('Spike detected:', img.src, 'Args:', args);
                    let x, y, width, height;
                    if (args.length === 2) {
                        [x, y] = args;
                        width = img.width;
                        height = img.height;
                    } else if (args.length === 4) {
                        [x, y, width, height] = args;
                    } else if (args.length === 8) {
                        [, , , , x, y, width, height] = args;
                    } else {
                        console.log('Unsupported drawImage call:', args);
                        return ogdraw.apply(this, [img, ...args]);
                    }
                    this.globalAlpha = 0;
                    ogdraw.apply(this, [img, ...args]);
                    this.globalAlpha = 1;
                    const rotation = (performance.now() / 1000 * spinSpeed) % (2 * Math.PI);
                    spikeUpdate(this, img, x, y, width, height, rotation);
                } else {
                    return ogdraw.apply(this, [img, ...args]);
                }
            };
        }

        function initOverlayFallback(canvas) {
            console.log('Overlay fallback not implemented yet; spikes will not spin.');
        }

        setTimeout(() => {
            initSpinningSpikes();
            console.log('Spike Spin Mod initialization attempted');
        }, 4000);

        const pulseEffectUI = document.createElement('div');
        pulseEffectUI.className = 'mod-ui pulse-effect-ui';
        pulseEffectUI.style.top = '60px';
        pulseEffectUI.style.left = '150px';
        pulseEffectUI.innerHTML = `
            <label>Pulse Speed (seconds): </label>
            <input type="range" id="pulseSpeedSlider" min="0.5" max="3" step="0.1" value="${pulseSpeed}">
        `;
        document.body.appendChild(pulseEffectUI);
        makeDraggable(pulseEffectUI);
        applyTheme(pulseEffectUI, currentTheme);

        const pulseSpeedSlider = pulseEffectUI.querySelector('#pulseSpeedSlider');
        pulseSpeedSlider.addEventListener('input', (e) => {
            pulseSpeed = parseFloat(e.target.value);
            updateCanvasEffects();
        });

        // Crosshair Mod
        const crosshairUI = document.createElement('div');
        crosshairUI.className = 'mod-ui crosshair-ui';
        crosshairUI.style.top = '460px';
        crosshairUI.style.left = '10px';
        crosshairUI.innerHTML = `
            <label><input type="checkbox" id="toggleCrosshair"> Enable Crosshair</label>
            <select id="crosshairStyle" class="hookx-select">
                <option value="dot">Dot</option>
                <option value="cross">Cross</option>
                <option value="spike">Spike</option>
                <option value="square">Square</option>
                <option value="triangle">Triangle</option>
                <option value="xcross">X Cross</option>
            </select>
            <input type="color" id="crosshairColor" class="hookx-color" value="#4caf50">
            <div class="hookx-label">Crosshair Size</div>
            <input type="range" id="crosshairSize" class="hookx-range" min="5" max="50" value="12">
            <div class="hookx-label">Opacity</div>
            <input type="range" id="crosshairOpacity" class="hookx-range" min="0.1" max="1" step="0.1" value="1">
            <div class="hookx-label">Offset</div>
            <input type="range" id="crosshairOffset" class="hookx-range" min="0" max="20" value="0">
        `;
        document.body.appendChild(crosshairUI);
        makeDraggable(crosshairUI);
        applyTheme(crosshairUI, currentTheme);

        let crosshair = document.createElement('div');
        crosshair.className = 'crosshair dot';
        document.body.appendChild(crosshair);

        const toggleCrosshair = crosshairUI.querySelector('#toggleCrosshair');
        const crosshairStyleSelect = crosshairUI.querySelector('#crosshairStyle');
        const crosshairColorPicker = crosshairUI.querySelector('#crosshairColor');
        const sizeSlider = crosshairUI.querySelector('#crosshairSize');
        const opacitySlider = crosshairUI.querySelector('#crosshairOpacity');
        const offsetSlider = crosshairUI.querySelector('#crosshairOffset');

        function loadSettings() {
            const savedCrosshair = localStorage.getItem('crosshair') || 'dot';
            const savedColor = localStorage.getItem('crosshairColor') || '#4caf50';
            const savedSize = localStorage.getItem('crosshairSize') || 12;
            const savedOpacity = localStorage.getItem('crosshairOpacity') || 1;
            const savedOffset = localStorage.getItem('crosshairOffset') || 0;
            const savedToggle = JSON.parse(localStorage.getItem('toggleCrosshair')) || false;

            crosshairStyleSelect.value = savedCrosshair;
            crosshairColorPicker.value = savedColor;
            sizeSlider.value = savedSize;
            opacitySlider.value = savedOpacity;
            offsetSlider.value = savedOffset;
            toggleCrosshair.checked = savedToggle;

            setCrosshairStyle(savedCrosshair);
            crosshairColorPicker.dispatchEvent(new Event('input'));
            sizeSlider.dispatchEvent(new Event('input'));
            opacitySlider.dispatchEvent(new Event('input'));
            offsetSlider.dispatchEvent(new Event('input'));
            toggleCrosshair.dispatchEvent(new Event('change'));
        }

        function saveSettings() {
            localStorage.setItem('crosshair', crosshairStyleSelect.value);
            localStorage.setItem('crosshairColor', crosshairColorPicker.value);
            localStorage.setItem('crosshairSize', sizeSlider.value);
            localStorage.setItem('crosshairOpacity', opacitySlider.value);
            localStorage.setItem('crosshairOffset', offsetSlider.value);
            localStorage.setItem('toggleCrosshair', JSON.stringify(toggleCrosshair.checked));
        }

        function setCrosshairStyle(styleName) {
            const newCrosshair = document.createElement('div');
            newCrosshair.className = `crosshair ${styleName}`;
            const size = parseInt(sizeSlider.value);
            if (styleName === 'triangle') {
                newCrosshair.style.borderLeftWidth = `${size / 2}px`;
                newCrosshair.style.borderRightWidth = `${size / 2}px`;
                newCrosshair.style.borderBottomWidth = `${size * 0.9}px`;
                newCrosshair.style.borderLeftColor = 'transparent';
                newCrosshair.style.borderRightColor = 'transparent';
                newCrosshair.style.borderBottomColor = crosshairColorPicker.value;
            } else {
                newCrosshair.style.width = `${size}px`;
                newCrosshair.style.height = `${size}px`;
            }
            document.body.replaceChild(newCrosshair, crosshair);
            crosshair = newCrosshair;
            updateCrosshairColor();
            if (toggleCrosshair.checked) crosshair.style.display = 'block';
        }

        function updateCrosshairColor() {
            const color = crosshairColorPicker.value;
            crosshair.style.color = color;
            crosshair.style.opacity = parseFloat(opacitySlider.value);
            crosshair.style.backgroundColor = '';
            crosshair.style.borderColor = '';
            if (crosshair.classList.contains('dot')) {
                crosshair.style.backgroundColor = color;
            } else if (crosshair.classList.contains('square')) {
                crosshair.style.borderColor = color;
            } else if (crosshair.classList.contains('triangle')) {
                crosshair.style.borderBottomColor = color;
            }
        }

        function moveCrosshair(e) {
            const offset = parseInt(offsetSlider.value);
            crosshair.style.left = `${e.clientX + offset}px`;
            crosshair.style.top = `${e.clientY + offset}px`;
        }

        toggleCrosshair.addEventListener('change', () => {
            if (toggleCrosshair.checked) {
                crosshair.style.display = 'block';
                document.body.classList.add('hide-cursor');
                document.addEventListener('mousemove', moveCrosshair);
            } else {
                crosshair.style.display = 'none';
                document.body.classList.remove('hide-cursor');
                document.removeEventListener('mousemove', moveCrosshair);
            }
            saveSettings();
        });

        crosshairStyleSelect.addEventListener('change', () => {
            setCrosshairStyle(crosshairStyleSelect.value);
            saveSettings();
        });
        crosshairColorPicker.addEventListener('input', () => {
            updateCrosshairColor();
            saveSettings();
        });
        sizeSlider.addEventListener('input', () => {
            setCrosshairStyle(crosshairStyleSelect.value);
            saveSettings();
        });
        opacitySlider.addEventListener('input', () => {
            updateCrosshairColor();
            saveSettings();
        });
        offsetSlider.addEventListener('input', () => {
            moveCrosshair({ clientX: crosshair.offsetLeft, clientY: crosshair.offsetTop });
            saveSettings();
        });

        function updateCanvasEffects() {
            const canvas = document.getElementById('game-canvas');
            if (!canvas) return;

            const zoomLevel = document.getElementById('zoomLevel')?.value || 1;
            canvas.style.transform = `scale(${zoomLevel})`;
            canvas.style.transformOrigin = 'center center';

            const isPulseEnabled = document.getElementById('pulseEffectMod')?.checked;
            canvas.style.animation = isPulseEnabled ? `screenPulse ${pulseSpeed}s infinite ease-in-out` : 'none';

            const isFpsBoostEnabled = document.getElementById('fpsBoosterMod')?.checked;
            const isNightVisionEnabled = document.getElementById('nightVisionMod')?.checked;
            let filter = '';
            if (isNightVisionEnabled) filter += ' brightness(1.5)';
            canvas.style.filter = filter.trim();
        }

        const fpsUI = document.createElement('div');
        fpsUI.className = 'mod-ui';
        fpsUI.style.top = '60px';
        fpsUI.style.left = '10px';
        document.body.appendChild(fpsUI);
        makeDraggable(fpsUI);
        applyTheme(fpsUI, currentTheme);
        let lastTime = performance.now();
        function updateFPS() {
            const now = performance.now();
            const fps = Math.round(1000 / (now - lastTime));
            fpsUI.textContent = `FPS: ${fps}`;
            lastTime = now;
            requestAnimationFrame(updateFPS);
        }

        const cpsUI = document.createElement('div');
        cpsUI.className = 'mod-ui';
        cpsUI.style.top = '110px';
        cpsUI.style.left = '10px';
        document.body.appendChild(cpsUI);
        makeDraggable(cpsUI);
        applyTheme(cpsUI, currentTheme);
        let clickTimes = [];
        document.addEventListener('mousedown', () => clickTimes.push(Date.now()));
        setInterval(() => {
            const now = Date.now();
            clickTimes = clickTimes.filter(time => now - time < 1000);
            cpsUI.textContent = `CPS: ${clickTimes.length}`;
        }, 500);

        const fpsBoosterUI = document.createElement('div');
        fpsBoosterUI.className = 'mod-ui';
        fpsBoosterUI.style.top = '160px';
        fpsBoosterUI.style.left = '10px';
        document.body.appendChild(fpsBoosterUI);
        makeDraggable(fpsBoosterUI);
        applyTheme(fpsBoosterUI, currentTheme);
        function toggleFPSBooster(on) {
            const canvas = document.getElementById('game-canvas');
            if (on) {
                canvas.style.imageRendering = 'pixelated';
                document.body.style.background = '#000';
                fpsBoosterUI.textContent = 'FPS Booster: ON';
            } else {
                canvas.style.imageRendering = 'auto';
                document.body.style.background = '#1a1a1a';
                fpsBoosterUI.textContent = 'FPS Booster: OFF';
            }
            updateCanvasEffects();
        }

        const pingUI = document.createElement('div');
        pingUI.className = 'mod-ui';
        pingUI.style.top = '210px';
        pingUI.style.left = '10px';
        document.body.appendChild(pingUI);
        makeDraggable(pingUI);
        applyTheme(pingUI, currentTheme);
        function updatePing() {
            const start = performance.now();
            fetch('https://sploop.io/').then(() => {
                pingUI.textContent = `Ping: ${Math.round(performance.now() - start)}ms`;
            }).catch(() => pingUI.textContent = 'Ping: N/A');
        }

        const keystrokesUI = document.createElement('div');
        keystrokesUI.className = 'mod-ui keystrokes-ui';
        keystrokesUI.style.top = '260px';
        keystrokesUI.style.left = '10px';
        keystrokesUI.innerHTML = `
            <div><div class="keystroke-key" id="keyW">W</div></div>
            <div>
                <div class="keystroke-key" id="keyA">A</div>
                <div class="keystroke-key" id="keyS">S</div>
                <div class="keystroke-key" id="keyD">D</div>
            </div>
            <div><div class="keystroke-key" id="keySpace"> </div></div>
            <div>
                <div class="keystroke-key" id="keyLMB">LMB</div>
                <div class="keystroke-key" id="keyRMB">RMB</div>
            </div>
        `;
        document.body.appendChild(keystrokesUI);
        makeDraggable(keystrokesUI);
        applyTheme(keystrokesUI, currentTheme);
        const keyElements = {
            w: keystrokesUI.querySelector('#keyW'),
            a: keystrokesUI.querySelector('#keyA'),
            s: keystrokesUI.querySelector('#keyS'),
            d: keystrokesUI.querySelector('#keyD'),
            space: keystrokesUI.querySelector('#keySpace'),
            lmb: keystrokesUI.querySelector('#keyLMB'),
            rmb: keystrokesUI.querySelector('#keyRMB')
        };
        document.addEventListener('keydown', (e) => {
            if (!keystrokesMod.checked) return;
            switch (e.key.toLowerCase()) {
                case 'w': keyElements.w.classList.add('active'); break;
                case 'a': keyElements.a.classList.add('active'); break;
                case 's': keyElements.s.classList.add('active'); break;
                case 'd': keyElements.d.classList.add('active'); break;
                case ' ': keyElements.space.classList.add('active'); break;
            }
        });
        document.addEventListener('keyup', (e) => {
            if (!keystrokesMod.checked) return;
            switch (e.key.toLowerCase()) {
                case 'w': keyElements.w.classList.remove('active'); break;
                case 'a': keyElements.a.classList.remove('active'); break;
                case 's': keyElements.s.classList.remove('active'); break;
                case 'd': keyElements.d.classList.remove('active'); break;
                case ' ': keyElements.space.classList.remove('active'); break;
            }
        });
        document.addEventListener('mousedown', (e) => {
            if (!keystrokesMod.checked) return;
            if (e.button === 0) keyElements.lmb.classList.add('active');
            if (e.button === 2) keyElements.rmb.classList.add('active');
        });
        document.addEventListener('mouseup', (e) => {
            if (!keystrokesMod.checked) return;
            if (e.button === 0) keyElements.lmb.classList.remove('active');
            if (e.button === 2) keyElements.rmb.classList.remove('active');
        });

        const menuThemeUI = document.createElement('div');
        menuThemeUI.className = 'mod-ui';
        menuThemeUI.style.top = '10px';
        menuThemeUI.style.left = '150px';
        menuThemeUI.innerHTML = `
            <label>Menu Theme: </label>
            <select id="themeSelect">
                <option value="green">Green</option>
                <option value="blue">Blue</option>
                <option value="red">Red</option>
                <option value="purple">Purple</option>
                <option value="orange">Orange</option>
                <option value="cyan">Cyan</option>
                <option value="pink">Pink</option>
                <option value="yellow">Yellow</option>
                <option value="neon">Neon</option>
                <option value="dark">Dark</option>
                <option value="forest">Forest</option>
                <option value="ocean">Ocean</option>
            </select>
        `;
        document.body.appendChild(menuThemeUI);
        makeDraggable(menuThemeUI);
        applyTheme(menuThemeUI, currentTheme);

        const themeSelectMenu = menuThemeUI.querySelector('#themeSelect');
        themeSelectMenu.addEventListener('change', (e) => {
            currentTheme = e.target.value;
            applyTheme(menu, currentTheme);
            tabButtons.forEach(btn => applyTheme(btn, currentTheme));
            applyTheme(moveModsBtn, currentTheme);
            applyTheme(fpsUI, currentTheme);
            applyTheme(cpsUI, currentTheme);
            applyTheme(menuThemeUI, currentTheme);
            applyTheme(arrayListUI, currentTheme);
            applyTheme(hitMarkersUI, currentTheme);
            applyTheme(rangeIndicatorUI, currentTheme);
            applyTheme(crosshairUI, currentTheme);
            applyTheme(fpsBoosterUI, currentTheme);
            applyTheme(swingAnimationUI, currentTheme);
            applyTheme(pingUI, currentTheme);
            applyTheme(keystrokesUI, currentTheme);
            applyTheme(zoomUI, currentTheme);
            applyTheme(nightVisionUI, currentTheme);
            applyTheme(coordinatesUI, currentTheme);
            applyTheme(timerUI, currentTheme);
            applyTheme(playerList, currentTheme);
            applyTheme(pulseEffectUI, currentTheme);
            applyTheme(spinningSpikesUI, currentTheme);
            accountList.querySelectorAll('.acc-btn').forEach(btn => applyTheme(btn, currentTheme));
        });

        const arrayListUI = document.createElement('div');
        arrayListUI.className = 'mod-ui arraylist-container';
        arrayListUI.style.top = '10px';
        arrayListUI.style.right = '10px';
        document.body.appendChild(arrayListUI);
        makeDraggable(arrayListUI);
        applyTheme(arrayListUI, currentTheme);

        function updateArrayList() {
            const activeMods = [];
            if (fpsMod.checked) activeMods.push('FPS');
            if (cpsMod.checked) activeMods.push('CPS');
            if (menuThemeMod.checked) activeMods.push('Menu Theme');
            if (arrayListMod.checked) activeMods.push('ArrayList');
            if (hitMarkersMod.checked) activeMods.push('Hit Markers');
            if (rangeIndicatorMod.checked) activeMods.push('Range Indicator');
            if (crosshairMod.checked) activeMods.push('Custom Crosshair');
            if (fpsBoosterMod.checked) activeMods.push('FPS Booster');
            if (swingAnimationMod.checked) activeMods.push('Swing Animation');
            if (pingMod.checked) activeMods.push('Ping');
            if (keystrokesMod.checked) activeMods.push('Keystrokes');
            if (zoomMod.checked) activeMods.push('Zoom');
            if (nightVisionMod.checked) activeMods.push('Night Vision');
            if (coordinatesMod.checked) activeMods.push('Coordinates');
            if (timerMod.checked) activeMods.push('Timer');
            if (spinningSpikesMod.checked) activeMods.push('Spike Spin Mod');
            if (pulseEffectMod.checked) activeMods.push('Pulse Effect');
            activeMods.sort();
            arrayListUI.innerHTML = activeMods.map(mod => `<div class="arraylist-item">${mod}</div>`).join('');
        }

        const hitMarkersUI = document.createElement('div');
        hitMarkersUI.className = 'mod-ui';
        hitMarkersUI.style.top = '360px';
        hitMarkersUI.style.left = '10px';
        document.body.appendChild(hitMarkersUI);
        makeDraggable(hitMarkersUI);
        applyTheme(hitMarkersUI, currentTheme);
        document.addEventListener('mousedown', (e) => {
            if (!hitMarkersMod.checked || e.button !== 0) return;
            const marker = document.createElement('div');
            marker.style = `
                position: fixed;
                top: ${e.clientY - 5}px;
                left: ${e.clientX - 5}px;
                width: 10px;
                height: 10px;
                background: transparent;
                border: 2px solid #4caf50;
                border-radius: 0;
                transform: rotate(45deg);
                z-index: 1000;
                animation: hitFade 0.5s ease-out forwards;
                pointer-events: none;
            `;
            document.body.appendChild(marker);
            setTimeout(() => marker.remove(), 500);
        });

        const rangeIndicatorUI = document.createElement('div');
        rangeIndicatorUI.className = 'mod-ui';
        rangeIndicatorUI.style.top = '410px';
        rangeIndicatorUI.style.left = '10px';
        rangeIndicatorUI.innerHTML = `
            <label>Range: </label>
            <input type="range" id="rangeSize" min="50" max="200" value="100">
        `;
        document.body.appendChild(rangeIndicatorUI);
        makeDraggable(rangeIndicatorUI);
        applyTheme(rangeIndicatorUI, currentTheme);
        const rangeCircle = document.createElement('div');
        rangeCircle.style = `
            position: fixed;
            border: 2px solid #4caf50;
            border-radius: 50%;
            z-index: 999;
            pointer-events: none;
            display: none;
        `;
        document.body.appendChild(rangeCircle);
        document.addEventListener('mousemove', (e) => {
            if (!rangeIndicatorMod.checked) return;
            const size = rangeIndicatorUI.querySelector('#rangeSize').value;
            rangeCircle.style.width = `${size}px`;
            rangeCircle.style.height = `${size}px`;
            rangeCircle.style.top = `${e.clientY - size / 2}px`;
            rangeCircle.style.left = `${e.clientX - size / 2}px`;
            rangeCircle.style.display = 'block';
        });

        const swingAnimationUI = document.createElement('div');
        swingAnimationUI.className = 'mod-ui';
        swingAnimationUI.style.top = '510px';
        swingAnimationUI.style.left = '10px';
        document.body.appendChild(swingAnimationUI);
        makeDraggable(swingAnimationUI);
        applyTheme(swingAnimationUI, currentTheme);
        document.addEventListener('mousedown', (e) => {
            if (!swingAnimationMod.checked || e.button !== 0) return;
            const swing = document.createElement('div');
            swing.style = `
                position: fixed;
                top: ${e.clientY - 30}px;
                left: ${e.clientX - 30}px;
                width: 60px;
                height: 60px;
                background: rgba(76, 175, 80, 0.3);
                border: none;
                border-radius: 50%;
                z-index: 1000;
                animation: swingFade 0.7s ease-out forwards;
                pointer-events: none;
            `;
            document.body.appendChild(swing);
            setTimeout(() => swing.remove(), 700);
        });

        const zoomUI = document.createElement('div');
        zoomUI.className = 'mod-ui';
        zoomUI.style.top = '110px';
        zoomUI.style.left = '150px';
        zoomUI.innerHTML = `
            <label>Zoom: </label>
            <input type="range" id="zoomLevel" min="0.5" max="2" step="0.1" value="1">
        `;
        document.body.appendChild(zoomUI);
        makeDraggable(zoomUI);
        applyTheme(zoomUI, currentTheme);
        const zoomLevel = zoomUI.querySelector('#zoomLevel');
        zoomLevel.addEventListener('input', () => updateCanvasEffects());

        const nightVisionUI = document.createElement('div');
        nightVisionUI.className = 'mod-ui';
        nightVisionUI.style.top = '160px';
        nightVisionUI.style.left = '150px';
        nightVisionUI.textContent = 'Night Vision: OFF';
        document.body.appendChild(nightVisionUI);
        makeDraggable(nightVisionUI);
        applyTheme(nightVisionUI, currentTheme);
        function toggleNightVision(on) {
            nightVisionUI.textContent = `Night Vision: ${on ? 'ON' : 'OFF'}`;
            updateCanvasEffects();
        }

        let playerPos = { x: 0, y: 0 };

        const coordinatesUI = document.createElement('div');
        coordinatesUI.className = 'mod-ui';
        coordinatesUI.style.top = '310px';
        coordinatesUI.style.left = '10px';
        coordinatesUI.textContent = 'X: 0, Y: 0';
        document.body.appendChild(coordinatesUI);
        makeDraggable(coordinatesUI);
        applyTheme(coordinatesUI, currentTheme);
        function updateCoordinates() {
            if (!coordinatesMod.checked) return;
            coordinatesUI.textContent = `X: ${Math.round(playerPos.x)}, Y: ${Math.round(playerPos.y)}`;
        }
        setInterval(updateCoordinates, 100);

        const timerUI = document.createElement('div');
        timerUI.className = 'mod-ui';
        timerUI.style.top = '360px';
        timerUI.style.left = '10px';
        timerUI.textContent = 'Time: 00:00';
        document.body.appendChild(timerUI);
        makeDraggable(timerUI);
        applyTheme(timerUI, currentTheme);
        let startTime = Date.now();
        function updateTimer() {
            if (!timerMod.checked) return;
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
            const seconds = String(elapsed % 60).padStart(2, '0');
            timerUI.textContent = `Time: ${minutes}:${seconds}`;
        }
        setInterval(updateTimer, 1000);

        const fpsMod = menu.querySelector('#fpsMod');
        const cpsMod = menu.querySelector('#cpsMod');
        const menuThemeMod = menu.querySelector('#menuThemeMod');
        const arrayListMod = menu.querySelector('#arrayListMod');
        const hitMarkersMod = menu.querySelector('#hitMarkersMod');
        const rangeIndicatorMod = menu.querySelector('#rangeIndicatorMod');
        const crosshairMod = menu.querySelector('#crosshairMod');
        const fpsBoosterMod = menu.querySelector('#fpsBoosterMod');
        const swingAnimationMod = menu.querySelector('#swingAnimationMod');
        const pingMod = menu.querySelector('#pingMod');
        const keystrokesMod = menu.querySelector('#keystrokesMod');
        const zoomMod = menu.querySelector('#zoomMod');
        const nightVisionMod = menu.querySelector('#nightVisionMod');
        const coordinatesMod = menu.querySelector('#coordinatesMod');
        const timerMod = menu.querySelector('#timerMod');
        const spinningSpikesMod = menu.querySelector('#spinningSpikesMod');
        const pulseEffectMod = menu.querySelector('#pulseEffectMod');

        const modUIs = {
            fps: fpsUI,
            cps: cpsUI,
            menuTheme: menuThemeUI,
            arrayList: arrayListUI,
            hitMarkers: hitMarkersUI,
            rangeIndicator: rangeIndicatorUI,
            crosshair: crosshairUI,
            fpsBooster: fpsBoosterUI,
            swingAnimation: swingAnimationUI,
            ping: pingUI,
            keystrokes: keystrokesUI,
            zoom: zoomUI,
            nightVision: nightVisionUI,
            coordinates: coordinatesUI,
            timer: timerUI,
            spinningSpikes: spinningSpikesUI,
            pulseEffect: pulseEffectUI
        };

        function initializeModUIs() {
            Object.keys(modUIs).forEach(mod => {
                const checkbox = menu.querySelector(`#${mod}Mod`);
                modUIs[mod].style.display = checkbox.checked ? 'block' : 'none';
                if (mod === 'rangeIndicator' && checkbox.checked) rangeCircle.style.display = 'block';
                if (mod === 'crosshair' && checkbox.checked) toggleCrosshair.checked = true;
                if (mod === 'fps' && checkbox.checked) requestAnimationFrame(updateFPS);
                if (mod === 'ping' && checkbox.checked) setInterval(updatePing, 2000);
                if (mod === 'fpsBooster' && checkbox.checked) toggleFPSBooster(true);
                if (mod === 'nightVision' && checkbox.checked) toggleNightVision(true);
                if (mod === 'timer' && checkbox.checked) startTime = Date.now();
            });
            updateCanvasEffects();
            updateArrayList();
            displayAccounts();
            loadSettings();
        }

        function forceCanvasRedraw() {
            const canvas = document.getElementById('game-canvas');
            if (canvas) {
                console.log('Forcing canvas redraw');
                canvas.style.opacity = '0.99';
                requestAnimationFrame(() => {
                    canvas.style.opacity = '1';
                });
            }
        }

        fpsMod.addEventListener('change', () => {
            modUIs.fps.style.display = fpsMod.checked ? 'block' : 'none';
            if (fpsMod.checked) requestAnimationFrame(updateFPS);
            updateArrayList();
        });
        cpsMod.addEventListener('change', () => {
            modUIs.cps.style.display = cpsMod.checked ? 'block' : 'none';
            updateArrayList();
        });
        menuThemeMod.addEventListener('change', () => {
            modUIs.menuTheme.style.display = menuThemeMod.checked ? 'block' : 'none';
            updateArrayList();
        });
        arrayListMod.addEventListener('change', () => {
            modUIs.arrayList.style.display = arrayListMod.checked ? 'block' : 'none';
            updateArrayList();
        });
        hitMarkersMod.addEventListener('change', () => {
            modUIs.hitMarkers.style.display = hitMarkersMod.checked ? 'block' : 'none';
            updateArrayList();
        });
        rangeIndicatorMod.addEventListener('change', () => {
            modUIs.rangeIndicator.style.display = rangeIndicatorMod.checked ? 'block' : 'none';
            rangeCircle.style.display = rangeIndicatorMod.checked ? 'block' : 'none';
            updateArrayList();
        });
        crosshairMod.addEventListener('change', () => {
            modUIs.crosshair.style.display = crosshairMod.checked ? 'block' : 'none';
            toggleCrosshair.checked = crosshairMod.checked;
            toggleCrosshair.dispatchEvent(new Event('change'));
            updateArrayList();
        });
        fpsBoosterMod.addEventListener('change', () => {
            modUIs.fpsBooster.style.display = fpsBoosterMod.checked ? 'block' : 'none';
            toggleFPSBooster(fpsBoosterMod.checked);
            updateArrayList();
        });
        swingAnimationMod.addEventListener('change', () => {
            modUIs.swingAnimation.style.display = swingAnimationMod.checked ? 'block' : 'none';
            updateArrayList();
        });
        pingMod.addEventListener('change', () => {
            modUIs.ping.style.display = pingMod.checked ? 'block' : 'none';
            if (pingMod.checked) setInterval(updatePing, 2000);
            updateArrayList();
        });
        keystrokesMod.addEventListener('change', () => {
            modUIs.keystrokes.style.display = keystrokesMod.checked ? 'block' : 'none';
            updateArrayList();
        });
        zoomMod.addEventListener('change', () => {
            modUIs.zoom.style.display = zoomMod.checked ? 'block' : 'none';
            if (!zoomMod.checked) zoomLevel.value = 1;
            updateCanvasEffects();
            updateArrayList();
        });
        nightVisionMod.addEventListener('change', () => {
            modUIs.nightVision.style.display = nightVisionMod.checked ? 'block' : 'none';
            toggleNightVision(nightVisionMod.checked);
            updateArrayList();
        });
        coordinatesMod.addEventListener('change', () => {
            modUIs.coordinates.style.display = coordinatesMod.checked ? 'block' : 'none';
            updateArrayList();
        });
        timerMod.addEventListener('change', () => {
            modUIs.timer.style.display = timerMod.checked ? 'block' : 'none';
            if (timerMod.checked) startTime = Date.now();
            updateArrayList();
        });
        spinningSpikesMod.addEventListener('change', () => {
            modUIs.spinningSpikes.style.display = spinningSpikesMod.checked ? 'block' : 'none';
            updateArrayList();
            forceCanvasRedraw();
        });
        pulseEffectMod.addEventListener('change', () => {
            modUIs.pulseEffect.style.display = pulseEffectMod.checked ? 'block' : 'none';
            updateCanvasEffects();
            updateArrayList();
        });

        initializeModUIs();
    })();