// ==UserScript==
// @name         Emulation's Slither Client
// @namespace    http://slither.com/io
// @version      2.6
// @description  Enhanced Slither.io mod with new features, fixed bot AI, professional UI, and immersive loading screen.
// @author       Emulation12
// @match        http://slither.com/io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543023/Emulation%27s%20Slither%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/543023/Emulation%27s%20Slither%20Client.meta.js
// ==/UserScript==   */

/* Utility Functions */
const savePreference = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const loadPreference = (key, def) => JSON.parse(localStorage.getItem(key)) ?? def;

/* State Variables */
let IsBotActive = loadPreference('IsBotActive', true);
let isSpeedBoost = loadPreference('isSpeedBoost', false);
let showEnemyLines = loadPreference('showEnemyLines', true);
let showDangerBar = loadPreference('showDangerBar', true);
let showPlayerGlow = loadPreference('showPlayerGlow', false);
let autoRespawn = loadPreference('autoRespawn', false);
let aggressiveMode = loadPreference('aggressiveMode', false);
let defensiveMode = loadPreference('defensiveMode', false);
let speedModulation = loadPreference('speedModulation', false);
let autoZoom = loadPreference('autoZoom', false);
let enemyTrap = loadPreference('enemyTrap', false);
let showSpeedCooldown = loadPreference('showSpeedCooldown', true);
let showScoreTracker = loadPreference('showScoreTracker', true);
let customColors = loadPreference('customColors', false);
let autoDodge = loadPreference('autoDodge', false);
let menuVisible = false;
let favoriteMods = loadPreference('favoriteMods', []);
let activeTab = 'favorites-tab';
let isMinimized = false;
let targetFood = null;
let targetFoodTimestamp = 0;
let blacklistedFoods = {};
let criticDanger = false;
let lastSpeedBoost = 0;
let speedBoostCooldown = 3000; // 3 seconds cooldown
window.zoomMultiplier = loadPreference('zoomMultiplier', 1.0);
let customLineColor = loadPreference('customLineColor', '#ff0000');
let customMinimapColor = loadPreference('customMinimapColor', '#00ff88');

/* Mod Configuration */
const mods = [
    { id: 'bot', name: 'Bot', category: 'Bot', state: () => IsBotActive, toggle: (state) => { IsBotActive = state; state ? startFoodBot() : stopFoodBot(); savePreference('IsBotActive', state); } },
    { id: 'speedBoost', name: 'Speed Boost', category: 'Bot', state: () => isSpeedBoost, toggle: (state) => { if (Date.now() - lastSpeedBoost > speedBoostCooldown) { isSpeedBoost = state; window.setAcceleration?.(state ? 1 : 0); if (state) lastSpeedBoost = Date.now(); savePreference('isSpeedBoost', state); } } },
    { id: 'autoRespawn', name: 'Auto Respawn', category: 'Bot', state: () => autoRespawn, toggle: (state) => { autoRespawn = state; savePreference('autoRespawn', state); } },
    { id: 'aggressiveMode', name: 'Aggressive Mode', category: 'Bot', state: () => aggressiveMode, toggle: (state) => { aggressiveMode = state; defensiveMode = state ? false : defensiveMode; savePreference('aggressiveMode', state); savePreference('defensiveMode', defensiveMode); refreshTabs(); } },
    { id: 'defensiveMode', name: 'Defensive Mode', category: 'Bot', state: () => defensiveMode, toggle: (state) => { defensiveMode = state; aggressiveMode = state ? false : aggressiveMode; savePreference('defensiveMode', state); savePreference('aggressiveMode', aggressiveMode); refreshTabs(); } },
    { id: 'speedModulation', name: 'Speed Modulation', category: 'Bot', state: () => speedModulation, toggle: (state) => { speedModulation = state; savePreference('speedModulation', state); } },
    { id: 'autoZoom', name: 'Auto Zoom', category: 'Bot', state: () => autoZoom, toggle: (state) => { autoZoom = state; savePreference('autoZoom', state); } },
    { id: 'enemyTrap', name: 'Enemy Trap', category: 'Bot', state: () => enemyTrap, toggle: (state) => { enemyTrap = state; savePreference('enemyTrap', state); } },
    { id: 'autoDodge', name: 'Auto Dodge', category: 'Bot', state: () => autoDodge, toggle: (state) => { autoDodge = state; savePreference('autoDodge', state); } },
    { id: 'enemyLines', name: 'Enemy Lines', category: 'Visuals', state: () => showEnemyLines, toggle: (state) => { showEnemyLines = state; savePreference('showEnemyLines', state); } },
    { id: 'dangerBar', name: 'Danger Bar', category: 'Visuals', state: () => showDangerBar, toggle: (state) => { showDangerBar = state; savePreference('showDangerBar', state); } },
    { id: 'playerGlow', name: 'Player Glow', category: 'Visuals', state: () => showPlayerGlow, toggle: (state) => { showPlayerGlow = state; savePreference('showPlayerGlow', state); } },
    { id: 'showSpeedCooldown', name: 'Speed Cooldown', category: 'Visuals', state: () => showSpeedCooldown, toggle: (state) => { showSpeedCooldown = state; savePreference('showSpeedCooldown', state); } },
    { id: 'showScoreTracker', name: 'Score Tracker', category: 'Visuals', state: () => showScoreTracker, toggle: (state) => { showScoreTracker = state; savePreference('showScoreTracker', state); } },
    { id: 'customColors', name: 'Custom Colors', category: 'Visuals', state: () => customColors, toggle: (state) => { customColors = state; savePreference('customColors', state); } }
];

/* SVG Icons */
const icons = {
    Favorites: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    Bot: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15v5m-3-8h6m-8-4h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2zm-3 4h2m14 0h2"/></svg>`,
    Visuals: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    FavoriteOn: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`,
    FavoriteOff: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
};

/* Zoom Control */
window.updateZoom = () => { window.gsc = window.zoomMultiplier; };
window.adjustZoom = (amount) => {
    window.zoomMultiplier = Math.max(0.2, Math.min(3.0, window.zoomMultiplier + amount));
    window.updateZoom();
    savePreference('zoomMultiplier', window.zoomMultiplier);
};
window.recursiveZoomUpdate = () => {
    window.updateZoom();
    requestAnimationFrame(window.recursiveZoomUpdate);
};
window.recursiveZoomUpdate();

/* Mouse Position */
window.mousePos = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => { window.mousePos = { x: e.clientX, y: e.clientY }; });
window.botTargetPos = null;

/* Loading Screen */
(function setupLoadingScreen() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitch { 0% { transform: translate(0); } 20% { transform: translate(-2px, 2px); } 40% { transform: translate(-2px, -2px); } 60% { transform: translate(2px, 2px); } 80% { transform: translate(2px, -2px); } 100% { transform: translate(0); } }
        @keyframes matrix { 0% { opacity: 0; transform: translateY(20px); } 50% { opacity: 1; } 100% { opacity: 0; transform: translateY(-20px); } }
        #bot-loading-screen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 10001; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Courier New', monospace; color: #00ff88; overflow: hidden; }
        #bot-loading-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        #bot-loading-content { z-index: 1; text-align: center; }
        #bot-loading-text { font-size: 24px; margin-bottom: 20px; animation: glitch 0.5s infinite alternate; }
        #bot-loading-bar { width: 300px; height: 20px; background: #222; border: 2px solid #00ff88; border-radius: 5px; overflow: hidden; }
        #bot-loading-fill { height: 100%; background: linear-gradient(90deg, #00ff88, #00cc66); width: 0%; transition: width 0.5s ease; }
    `;
    document.head.appendChild(style);

    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'bot-loading-screen';
    document.body.appendChild(loadingScreen);

    const canvas = document.createElement('canvas');
    canvas.id = 'bot-loading-canvas';
    loadingScreen.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

    const content = document.createElement('div');
    content.id = 'bot-loading-content';
    loadingScreen.appendChild(content);

    const loadingText = document.createElement('div');
    loadingText.id = 'bot-loading-text';
    loadingText.textContent = 'Initializing Slither Client...';
    content.appendChild(loadingText);

    const loadingBar = document.createElement('div');
    loadingBar.id = 'bot-loading-bar';
    const loadingFill = document.createElement('div');
    loadingFill.id = 'bot-loading-fill';
    loadingBar.appendChild(loadingFill);
    content.appendChild(loadingBar);

    const ctx = canvas.getContext('2d');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(0);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff88';
        ctx.font = `${fontSize}px 'Courier New'`;
        drops.forEach((y, i) => {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, y * fontSize);
            if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }

    const particles = Array(100).fill().map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1
    }));

    function drawParticles() {
        ctx.fillStyle = 'rgba(0, 255, 136, 0.5)';
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
    }

    function animateLoading() {
        drawMatrix();
        drawParticles();
        requestAnimationFrame(animateLoading);
    }
    animateLoading();

    const components = [
        { name: 'Core Systems', duration: 600 },
        { name: 'Bot AI', duration: 500 },
        { name: 'Visuals', duration: 400 },
        { name: 'UI', duration: 500 }
    ];

    let index = 0, progress = 0;
    function loadNextComponent() {
        if (index >= components.length) {
            loadingScreen.style.display = 'none';
            initializeUI();
            return;
        }
        loadingText.textContent = `[${index + 1}/${components.length}] Loading ${components[index].name}...`;
        progress += 100 / components.length;
        loadingFill.style.width = `${progress}%`;
        setTimeout(loadNextComponent, components[index].duration);
        index++;
    }
    loadNextComponent();
})();

/* Mod Menu UI */
function initializeUI() {
    const style = document.createElement('style');
    style.textContent = `
        #bot-overlay-container { position: fixed; top: 50px; left: 50px; background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-radius: 12px; z-index: 10000; font-family: 'Roboto', Arial, sans-serif; color: #e0e0e0; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7); width: 320px; height: 450px; resize: both; min-width: 280px; min-height: 350px; max-width: 600px; max-height: 700px; overflow: hidden; }
        #bot-overlay-container.minimized { width: 60px; height: 40px; overflow: hidden; }
        #bot-header { background: #111; padding: 10px; font-size: 16px; font-weight: bold; text-align: center; cursor: move; border-bottom: 1px solid #444; display: flex; justify-content: space-between; align-items: center; }
        #bot-sidebar { width: 50px; background: #222; height: 100%; float: left; border-right: 1px solid #444; }
        #bot-sidebar.collapsed { width: 0; overflow: hidden; }
        #bot-content-container { width: calc(100% - 50px); height: 100%; float: left; padding: 10px; overflow-y: auto; background: #1a1a1a; }
        #bot-content-container::-webkit-scrollbar { width: 6px; }
        #bot-content-container::-webkit-scrollbar-track { background: #333; }
        #bot-content-container::-webkit-scrollbar-thumb { background: #00ff88; border-radius: 3px; }
        .tab-button { width: 100%; padding: 10px; background: #222; color: #e0e0e0; border: none; text-align: center; font-size: 13px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; }
        .tab-button:hover { background: #2a2a2a; }
        .tab-button.active { background: #333; color: #00ff88; }
        .mod-container { display: flex; align-items: center; margin: 5px 0; }
        .mod-button { flex: 1; padding: 6px; background: #ff4d4d; color: #000; border: none; border-radius: 4px; cursor: pointer; transition: all 0.2s ease; font-size: 13px; }
        .mod-button.on { background: #00ff88; }
        .mod-button:hover { filter: brightness(1.2); }
        .favorite-button { padding: 6px; background: #444; color: #e0e0e0; border: none; border-radius: 4px; margin-left: 5px; cursor: pointer; transition: all 0.2s ease; }
        .favorite-button.on { background: #ffd700; color: #000; }
        #bot-search-bar { width: 100%; padding: 6px; margin-bottom: 8px; background: #333; border: 1px solid #444; color: #e0e0e0; border-radius: 4px; font-size: 13px; }
        #bot-danger-bar { position: fixed; top: 50%; right: 10px; width: 15px; height: 150px; background: #333; border-radius: 8px; z-index: 9999; overflow: hidden; transform: translateY(-50%); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); }
        #bot-danger-fill { width: 100%; height: 0%; background: green; transition: height 0.3s ease, background 0.3s ease; }
        #bot-speed-cooldown { position: fixed; bottom: 20px; left: 20px; width: 100px; height: 10px; background: #333; border-radius: 5px; z-index: 9999; overflow: hidden; }
        #bot-speed-cooldown-fill { height: 100%; background: #00ff88; width: 0%; transition: width 0.3s ease; }
        #bot-color-picker { margin: 10px 0; }
    `;
    document.head.appendChild(style);

    const tailwindLink = document.createElement('link');
    tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    tailwindLink.rel = 'stylesheet';
    document.head.appendChild(tailwindLink);

    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const overlayContainer = document.createElement('div');
    overlayContainer.id = 'bot-overlay-container';
    document.body.appendChild(overlayContainer);

    let isDragging = false, xOffset = loadPreference('menuX', 50), yOffset = loadPreference('menuY', 50);
    overlayContainer.style.left = `${xOffset}px`;
    overlayContainer.style.top = `${yOffset}px`;

    const header = document.createElement('div');
    header.id = 'bot-header';
    header.innerHTML = `<span>Slither Client</span><span id="active-tab" class="text-sm text-gray-400">Favorites</span><button id="minimize-btn" class="text-gray-400 hover:text-gray-100">${isMinimized ? '+' : '-'}</button>`;
    overlayContainer.appendChild(header);

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        xOffset = e.clientX - parseFloat(overlayContainer.style.left);
        yOffset = e.clientY - parseFloat(overlayContainer.style.top);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            overlayContainer.style.left = `${e.clientX - xOffset}px`;
            overlayContainer.style.top = `${e.clientY - yOffset}px`;
            savePreference('menuX', e.clientX - xOffset);
            savePreference('menuY', e.clientY - yOffset);
        }
    });

    document.addEventListener('mouseup', () => { isDragging = false; });

    const sidebar = document.createElement('div');
    sidebar.id = 'bot-sidebar';
    overlayContainer.appendChild(sidebar);

    const contentContainer = document.createElement('div');
    contentContainer.id = 'bot-content-container';
    overlayContainer.appendChild(contentContainer);

    const tabs = [
        { id: 'favorites-tab', name: 'Favorites', icon: icons.Favorites },
        { id: 'bot-tab', name: 'Bot', icon: icons.Bot },
        { id: 'visuals-tab', name: 'Visuals', icon: icons.Visuals }
    ];

    tabs.forEach(tab => {
        const tabButton = document.createElement('button');
        tabButton.innerHTML = `${tab.icon} ${tab.name}`;
        tabButton.className = `tab-button ${tab.id === activeTab ? 'active' : ''}`;
        tabButton.onclick = () => {
            activeTab = tab.id;
            document.getElementById('active-tab').textContent = tab.name;
            tabs.forEach(t => {
                document.getElementById(t.id).style.display = t.id === tab.id ? 'block' : 'none';
                sidebar.querySelectorAll('.tab-button').forEach(btn => {
                    btn.className = `tab-button ${btn.innerText.includes(t.name) && t.id === tab.id ? 'active' : ''}`;
                });
            });
            refreshTabs();
        };
        sidebar.appendChild(tabButton);

        const tabContent = document.createElement('div');
        tabContent.id = tab.id;
        tabContent.style.display = tab.id === activeTab ? 'block' : 'none';
        contentContainer.appendChild(tabContent);
    });

    const searchBar = document.createElement('input');
    searchBar.id = 'bot-search-bar';
    searchBar.type = 'text';
    searchBar.placeholder = 'Search mods...';
    contentContainer.appendChild(searchBar);

    searchBar.oninput = () => {
        const query = searchBar.value.toLowerCase();
        mods.forEach(mod => {
            const modElement = document.getElementById(`mod-${mod.id}`);
            if (modElement) modElement.style.display = mod.name.toLowerCase().includes(query) ? 'flex' : 'none';
        });
    };

    if (customColors) {
        const colorPicker = document.createElement('div');
        colorPicker.id = 'bot-color-picker';
        colorPicker.innerHTML = `
            <label class="block text-sm mb-1">Line Color: <input type="color" id="line-color" value="${customLineColor}"></label>
            <label class="block text-sm mb-1">Minimap Color: <input type="color" id="minimap-color" value="${customMinimapColor}"></label>
        `;
        contentContainer.appendChild(colorPicker);

        document.getElementById('line-color').addEventListener('input', (e) => {
            customLineColor = e.target.value;
            savePreference('customLineColor', customLineColor);
        });
        document.getElementById('minimap-color').addEventListener('input', (e) => {
            customMinimapColor = e.target.value;
            savePreference('customMinimapColor', customMinimapColor);
        });
    }

    const minimizeBtn = header.querySelector('#minimize-btn');
    minimizeBtn.onclick = () => {
        isMinimized = !isMinimized;
        overlayContainer.className = isMinimized ? 'minimized' : '';
        minimizeBtn.textContent = isMinimized ? '+' : '-';
        contentContainer.style.display = isMinimized ? 'none' : 'block';
        sidebar.className = `bg-gray-800 ${isMinimized ? 'collapsed' : ''}`;
    };

    function refreshTabs() {
        const favoritesTab = document.getElementById('favorites-tab');
        const botTab = document.getElementById('bot-tab');
        const visualsTab = document.getElementById('visuals-tab');

        favoritesTab.innerHTML = botTab.innerHTML = visualsTab.innerHTML = '';

        const filteredMods = favoriteMods.length > 0 ? mods.filter(mod => favoriteMods.includes(mod.id)) : [];
        if (filteredMods.length === 0 && activeTab === 'favorites-tab') {
            favoritesTab.innerHTML = '<div class="text-gray-500 text-center p-5">No favorite mods yet.</div>';
        } else {
            filteredMods.forEach(mod => favoritesTab.appendChild(createModToggle(mod)));
        }

        mods.filter(m => m.category === 'Bot').forEach(mod => botTab.appendChild(createModToggle(mod)));
        mods.filter(m => m.category === 'Visuals').forEach(mod => visualsTab.appendChild(createModToggle(mod)));
    }

    function createModToggle(mod) {
        const container = document.createElement('div');
        container.id = `mod-${mod.id}`;
        container.className = 'mod-container';

        const button = document.createElement('button');
        button.textContent = `${mod.name}: ${mod.state() ? 'ON' : 'OFF'}`;
        button.className = `mod-button ${mod.state() ? 'on' : ''}`;
        button.onclick = () => {
            const newState = !mod.state();
            mod.toggle(newState);
            button.textContent = `${mod.name}: ${newState ? 'ON' : 'OFF'}`;
            button.className = `mod-button ${newState ? 'on' : ''}`;
            document.querySelectorAll(`#mod-${mod.id} .mod-button`).forEach(btn => {
                btn.textContent = `${mod.name}: ${newState ? 'ON' : 'OFF'}`;
                btn.className = `mod-button ${newState ? 'on' : ''}`;
            });
        };

        const favoriteButton = document.createElement('button');
        favoriteButton.innerHTML = favoriteMods.includes(mod.id) ? icons.FavoriteOn : icons.FavoriteOff;
        favoriteButton.className = `favorite-button ${favoriteMods.includes(mod.id) ? 'on' : ''}`;
        favoriteButton.onclick = () => {
            favoriteMods = favoriteMods.includes(mod.id) ? favoriteMods.filter(id => id !== mod.id) : [...favoriteMods, mod.id];
            savePreference('favoriteMods', favoriteMods);
            favoriteButton.innerHTML = favoriteMods.includes(mod.id) ? icons.FavoriteOn : icons.FavoriteOff;
            favoriteButton.className = `favorite-button ${favoriteMods.includes(mod.id) ? 'on' : ''}`;
            refreshTabs();
        };

        container.appendChild(button);
        container.appendChild(favoriteButton);
        return container;
    }

    const dangerBar = document.createElement('div');
    dangerBar.id = 'bot-danger-bar';
    dangerBar.innerHTML = '<div id="bot-danger-fill"></div>';
    document.body.appendChild(dangerBar);

    const speedCooldown = document.createElement('div');
    speedCooldown.id = 'bot-speed-cooldown';
    speedCooldown.innerHTML = '<div id="bot-speed-cooldown-fill"></div>';
    document.body.appendChild(speedCooldown);

    document.addEventListener('keydown', (e) => {
        if (e.key === ';') {
            menuVisible = !menuVisible;
            overlayContainer.style.display = menuVisible && !isMinimized ? 'block' : 'none';
        }
    });

    refreshTabs();
}

/* Minimap and Visuals */
(function setupMinimap() {
    const minimap = document.createElement('canvas');
    minimap.id = 'bot-minimap';
    minimap.width = 200;
    minimap.height = 200;
    minimap.style.cssText = `position: fixed; bottom: 10px; right: 40px; z-index: 9999; border: 2px solid ${customColors ? customMinimapColor : '#00ff88'}; border-radius: 8px; background: rgba(0, 0, 0, 0.6); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);`;
    document.body.appendChild(minimap);

    function updateMinimap() {
        const ctx = minimap.getContext('2d');
        ctx.clearRect(0, 0, minimap.width, minimap.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, minimap.width, minimap.height);

        if (window.slither?.xx !== undefined) {
            const scale = 0.015, centerX = minimap.width / 2, centerY = minimap.height / 2;

            ctx.fillStyle = customColors ? customMinimapColor : 'green';
            ctx.beginPath();
            ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
            ctx.fill();
            if (showPlayerGlow) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = customColors ? customMinimapColor : 'green';
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            if (Array.isArray(window.slithers)) {
                window.slithers.forEach(e => {
                    if (!e || e.xx === window.slither.xx || typeof e.xx !== 'number') return;
                    const dx = (e.xx - window.slither.xx) * scale;
                    const dy = (e.yy - window.slither.yy) * scale;
                    if (Math.abs(dx) < centerX && Math.abs(dy) < centerY) {
                        ctx.fillStyle = 'red';
                        ctx.beginPath();
                        ctx.arc(centerX + dx, centerY + dy, 4, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                });
            }

            if (Array.isArray(window.foods)) {
                window.foods.forEach(f => {
                    if (!f || typeof f.xx !== 'number') return;
                    const dx = (f.xx - window.slither.xx) * scale;
                    const dy = (f.yy - window.slither.yy) * scale;
                    if (Math.abs(dx) < centerX && Math.abs(dy) < centerY) {
                        ctx.fillStyle = 'cyan';
                        ctx.beginPath();
                        ctx.arc(centerX + dx, centerY + dy, 3, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                });
            }

            if (showScoreTracker && window.slither?.l) {
                ctx.fillStyle = '#fff';
                ctx.font = '12px Roboto';
                ctx.fillText(`Score: ${Math.floor(window.slither.l)}`, 10, 20);
                ctx.fillText(`Rank: ${window.rank || 'N/A'}`, 10, 35);
            }
        }
        requestAnimationFrame(updateMinimap);
    }
    updateMinimap();
})();

/* World to Screen Conversion */
const worldToScreen = (xx, yy) => ({
    x: (xx - window.view_xx) * window.gsc + window.mww2,
    y: (yy - window.view_yy) * window.gsc + window.mhh2
});

/* Enemy Processing */
function getEnemyBodyPoints(enemy) {
    const points = [];
    if (enemy?.pts) {
        for (const segment of enemy.pts) {
            if (segment.fxs && segment.fys) {
                for (let i = 0; i < segment.fxs.length; i += Math.max(1, Math.floor(segment.fxs.length / 5))) {
                    const x = segment.xx + segment.fxs[i];
                    const y = segment.yy + segment.fys[i];
                    if (isFinite(x) && isFinite(y)) points.push({ xx: x, yy: y });
                }
            }
        }
    }
    return points;
}

function DangerColor(start, end) {
    const dist = Math.hypot(end.x - start.x, end.y - start.y);
    const dangerRatio = Math.max(0, Math.min(1, (700 - dist) / (700 - 300)));
    const r = Math.floor(255 * dangerRatio), g = Math.floor(255 * (1 - dangerRatio));
    return customColors ? customLineColor : `rgba(${r},${g},0,0.8)`;
}

/* Enemy Lines */
(function updateEnemyLines() {
    let canvas, ctx;
    function initCanvas() {
        canvas = document.createElement('canvas');
        canvas.id = 'bot-line-overlay';
        canvas.style.cssText = `position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9998;`;
        document.body.appendChild(canvas);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        ctx = canvas.getContext('2d');
    }

    function update() {
        if (!canvas) initCanvas();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (showEnemyLines && window.slither?.xx !== undefined && Array.isArray(window.slithers)) {
            const selfScreen = worldToScreen(window.slither.xx, window.slither.yy);
            const enemies = window.slithers.filter(e => e && typeof e.xx === 'number' && e.xx !== window.slither.xx).slice(0, 5);
            enemies.forEach(enemy => {
                const bodyPoints = getEnemyBodyPoints(enemy);
                let minDist = Infinity, minPoint = null;
                bodyPoints.forEach(p => {
                    const screenPoint = worldToScreen(p.xx, p.yy);
                    const dist = Math.hypot(screenPoint.x - selfScreen.x, screenPoint.y - selfScreen.y);
                    if (dist < minDist && dist > 0) {
                        minDist = dist;
                        minPoint = screenPoint;
                    }
                });
                if (minPoint) {
                    ctx.beginPath();
                    ctx.moveTo(selfScreen.x, selfScreen.y);
                    ctx.lineTo(minPoint.x, minPoint.y);
                    ctx.strokeStyle = DangerColor(selfScreen, minPoint);
                    ctx.lineWidth = 3;
                    ctx.stroke();
                }
            });
        }
        requestAnimationFrame(update);
    }
    update();
})();

/* Speed Cooldown Indicator */
(function updateSpeedCooldown() {
    function update() {
        if (showSpeedCooldown) {
            const cooldownProgress = Math.min((Date.now() - lastSpeedBoost) / speedBoostCooldown, 1);
            const fill = document.getElementById('bot-speed-cooldown-fill');
            if (fill) fill.style.width = `${cooldownProgress * 100}%`;
        }
        requestAnimationFrame(update);
    }
    update();
})();

/* A* Pathfinding */
function aStarPathfinding(start, goal, obstacles) {
    const gridSize = 50, gridWidth = Math.ceil(10000 / gridSize), gridHeight = Math.ceil(10000 / gridSize);
    const openSet = new Set([`${Math.floor(start.x / gridSize)},${Math.floor(start.y / gridSize)}`]);
    const closedSet = new Set();
    const cameFrom = new Map();
    const gScore = new Map([[openSet.values().next().value, 0]]);
    const fScore = new Map([[openSet.values().next().value, Math.hypot(goal.x - start.x, goal.y - start.y)]]);

    function getNeighbors(node) {
        const [x, y] = node.split(',').map(Number);
        const directions = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
        return directions.map(([dx, dy]) => ({ x: x + dx, y: y + dy }))
            .filter(n => n.x >= 0 && n.x < gridWidth && n.y >= 0 && n.y < gridHeight);
    }

    function isObstacle(node) {
        const nodeX = node.x * gridSize + gridSize / 2, nodeY = node.y * gridSize + gridSize / 2;
        return obstacles.some(o => Math.hypot(o.point.xx - nodeX, o.point.yy - nodeY) < 200);
    }

    while (openSet.size) {
        let current = [...openSet].reduce((a, b) => (fScore.get(a) || Infinity) < (fScore.get(b) || Infinity) ? a : b);
        const [cx, cy] = current.split(',').map(Number);
        const currentNode = { x: cx, y: cy };

        if (cx === Math.floor(goal.x / gridSize) && cy === Math.floor(goal.y / gridSize)) {
            const path = [];
            let curr = current;
            while (curr) {
                const [x, y] = curr.split(',').map(Number);
                path.unshift({ x: x * gridSize + gridSize / 2, y: y * gridSize + gridSize / 2 });
                curr = cameFrom.get(curr);
            }
            return path;
        }

        openSet.delete(current);
        closedSet.add(current);

        for (const neighbor of getNeighbors(current)) {
            const neighborStr = `${neighbor.x},${neighbor.y}`;
            if (closedSet.has(neighborStr) || isObstacle(neighbor)) continue;

            const tentativeG = (gScore.get(current) || 0) + Math.hypot((neighbor.x - cx) * gridSize, (neighbor.y - cy) * gridSize);
            if (!openSet.has(neighborStr)) openSet.add(neighborStr);
            else if (tentativeG >= (gScore.get(neighborStr) || Infinity)) continue;

            cameFrom.set(neighborStr, current);
            gScore.set(neighborStr, tentativeG);
            fScore.set(neighborStr, tentativeG + Math.hypot((neighbor.x - goal.x / gridSize) * gridSize, (neighbor.y - goal.y / gridSize) * gridSize));
        }
    }
    return [];
}

/* Bot Logic */
function moveMouseToward(worldX, worldY) {
    if (!window.slither?.xx) return;
    window.botTargetPos = { x: worldX, y: worldY };
    const screenX = (worldX - window.view_xx) * window.gsc + window.mww2;
    const screenY = (worldY - window.view_yy) * window.gsc + window.mhh2;
    if (Math.hypot(screenX - window.mousePos.x, screenY - window.mousePos.y) > 10) {
        window.dispatchEvent(new MouseEvent('mousemove', { clientX: screenX, clientY: screenY, bubbles: true }));
    }
}

let foodBotInterval = null;
function startFoodBot() {
    if (!foodBotInterval) foodBotInterval = setInterval(foodBotUpdate, loadPreference('botSpeed', 20));
}
function stopFoodBot() {
    if (foodBotInterval) {
        clearInterval(foodBotInterval);
        foodBotInterval = null;
    }
}

function foodBotUpdate() {
    if (!window.slither?.xx || !Array.isArray(window.foods)) return;
    const self = window.slither, now = Date.now();
    let dangerLevel = 0, enemyList = [];
    criticDanger = false;

    if (Array.isArray(window.slithers)) {
        window.slithers.forEach(enemy => {
            if (!enemy || enemy.xx === self.xx || typeof enemy.xx !== 'number') return;
            const bodyPoints = getEnemyBodyPoints(enemy);
            if (!bodyPoints.length) return;
            let bestPoint = null, bestDistance = Infinity, bestDx = 0, bestDy = 0;
            bodyPoints.forEach(p => {
                const dx = p.xx - self.xx, dy = p.yy - self.yy, d = Math.hypot(dx, dy);
                if (d < bestDistance) {
                    bestDistance = d;
                    bestPoint = p;
                    bestDx = dx;
                    bestDy = dy;
                }
            });
            if (bestPoint) {
                dangerLevel = Math.max(dangerLevel, bestDistance < 300 ? 1 - bestDistance / 300 : bestDistance < 700 ? 0.5 * (1 - (bestDistance - 300) / 400) : 0);
                if (bestDistance < 300) criticDanger = true;
                enemyList.push({ point: bestPoint, distance: bestDistance, dx: bestDx, dy: bestDy, size: enemy.l || 100, futurePoint: {
                    xx: bestPoint.xx + (enemy.spd || 0) * Math.cos(enemy.ang || 0) * 100,
                    yy: bestPoint.yy + (enemy.spd || 0) * Math.sin(enemy.ang || 0) * 100
                } });
            }
        });
    }

    if (showDangerBar) {
        const fill = document.getElementById('bot-danger-fill');
        if (fill) {
            fill.style.height = `${Math.min(dangerLevel * 100, 100)}%`;
            fill.style.background = `rgb(${Math.floor(255 * dangerLevel)},${Math.floor(255 * (1 - dangerLevel))},0)`;
        }
    }

    if (speedModulation && !isSpeedBoost && targetFood?.sz > 50 && dangerLevel < 0.5 && Date.now() - lastSpeedBoost > speedBoostCooldown) {
        window.setAcceleration?.(1);
        isSpeedBoost = true;
        lastSpeedBoost = Date.now();
        document.querySelectorAll('#mod-speedBoost .mod-button').forEach(btn => {
            btn.textContent = `Speed Boost: ON`;
            btn.className = 'mod-button on';
        });
    } else if (speedModulation && isSpeedBoost && (!targetFood || targetFood.sz <= 50 || dangerLevel >= 0.5)) {
        window.setAcceleration?.(0);
        isSpeedBoost = false;
        document.querySelectorAll('#mod-speedBoost .mod-button').forEach(btn => {
            btn.textContent = `Speed Boost: OFF`;
            btn.className = 'mod-button';
        });
    }

    if (autoZoom) {
        const baseZoom = 1.0, sizeFactor = window.slither?.l ? Math.min(0.5, 500 / window.slither.l) : 0;
        window.zoomMultiplier = Math.max(0.2, Math.min(3.0, baseZoom - sizeFactor + dangerLevel * 0.5));
        window.updateZoom();
        savePreference('zoomMultiplier', window.zoomMultiplier);
    }

    const foods = window.foods.filter(f => f && typeof f.xx === 'number' && !(blacklistedFoods[`${f.xx}_${f.yy}`] && now < blacklistedFoods[`${f.xx}_${f.yy}`]));
    let target = null;

    if (!enemyList.length) {
        target = chooseBestFood(foods);
    } else if (enemyList.some(e => e.distance < 300)) {
        if (autoDodge) {
            let avgX = 0, avgY = 0, totalWeight = 0;
            enemyList.filter(e => e.distance < 300).forEach(e => {
                const weight = 1 / (e.distance + 1e-5);
                avgX += (e.dx / e.distance) * weight;
                avgY += (e.dy / e.distance) * weight;
                totalWeight += weight;
            });
            if (totalWeight > 0) {
                avgX /= totalWeight;
                avgY /= totalWeight;
                const bestDir = { x: -avgX * 200, y: -avgY * 200 };
                if (criticDanger && Math.random() < 0.5) {
                    const angle = Date.now() / 1000 * Math.PI;
                    bestDir.x += Math.cos(angle) * 50;
                    bestDir.y += Math.sin(angle) * 50;
                }
                moveMouseToward(self.xx + bestDir.x, self.yy + bestDir.y);
                targetFood = null;
                return;
            }
        }
    } else if (!aggressiveMode) {
        const closest = enemyList.reduce((a, b) => a.distance < b.distance ? a : b);
        const vecX = self.xx - closest.futurePoint.xx, vecY = self.yy - closest.futurePoint.yy;
        const vecLength = Math.hypot(vecX, vecY);
        const normX = vecLength ? vecX / vecLength : 0, normY = vecLength ? vecY / vecLength : 0;
        const filteredFoods = foods.filter(f => (f.xx - self.xx) * normX + (f.yy - self.yy) * normY > 0);
        target = filteredFoods.length ? chooseBestFood(filteredFoods) : chooseBestFood(foods);
    } else if (enemyTrap && aggressiveMode) {
        const smallEnemies = enemyList.filter(e => e.size < (window.slither.l || 100) && e.distance < 500);
        if (smallEnemies.length) {
            const trapTarget = chooseBestFood(foods.filter(f => {
                return smallEnemies.some(e => Math.hypot(f.xx - e.point.xx, f.yy - e.point.yy) < 200);
            }));
            if (trapTarget) {
                const angle = Date.now() / 1000 * Math.PI;
                const orbitRadius = 100;
                target = {
                    xx: trapTarget.xx + Math.cos(angle) * orbitRadius,
                    yy: trapTarget.yy + Math.sin(angle) * orbitRadius,
                    sz: trapTarget.sz
                };
            } else {
                target = chooseBestFood(foods);
            }
        } else {
            target = chooseBestFood(foods);
        }
    } else {
        target = chooseBestFood(foods);
    }

    if (target && targetFood?.xx === target.xx && target.yy === targetFood.yy && now - targetFoodTimestamp >= 2000) {
        blacklistedFoods[`${targetFood.xx}_${targetFood.yy}`] = now + 2000;
        target = chooseBestFood(foods.filter(f => f.xx !== targetFood.xx || f.yy !== targetFood.yy));
        targetFoodTimestamp = now;
    } else if (target) {
        targetFoodTimestamp = now;
    }

    if (target) {
        const path = aStarPathfinding({ x: self.xx, y: self.yy }, { x: target.xx, y: target.yy }, enemyList);
        moveMouseToward(path[1]?.x || target.xx, path[1]?.y || target.yy);
        targetFood = target;
    }
}

function chooseBestFood(foods) {
    const maxDistance = aggressiveMode ? 1000 : 500;
    let bestTarget = null, bestScore = -Infinity;
    foods.forEach(f => {
        if (!f || typeof f.xx !== 'number') return;
        const dist = Math.hypot(f.xx - window.slither.xx, f.yy - window.slither.yy);
        if (dist > maxDistance) return;
        let dangerScore = 0;
        window.slithers?.forEach(e => {
            if (!e || e.xx === window.slither.xx) return;
            const dx = f.xx - e.xx, dy = f.yy - e.yy, d = Math.hypot(dx, dy);
            if (d < 300) dangerScore -= aggressiveMode ? 500 / (d + 1e-5) : 1000 / (d + 1e-5);
        });
        const score = (f.sz || 1) * (aggressiveMode ? 2 : 1) + dangerScore - dist / (defensiveMode ? 5 : 10);
        if (score > bestScore) {
            bestScore = score;
            bestTarget = f;
        }
    });
    return bestTarget;
}

/* Auto Respawn */
(function checkRespawn() {
    if (autoRespawn && window.dead_mtm && !window.playing) window.play_btn_click?.();
    requestAnimationFrame(checkRespawn);
})();

/* Key Bindings */
document.addEventListener('keydown', (e) => {
    switch (e.key.toLowerCase()) {
        case 't': window.adjustZoom(0.1); break;
        case 'r': window.adjustZoom(-0.1); break;
        case 'y': if (Date.now() - lastSpeedBoost > speedBoostCooldown) toggleSpeedBoost(); break;
    }
});

function toggleSpeedBoost() {
    isSpeedBoost = !isSpeedBoost;
    window.setAcceleration?.(isSpeedBoost ? 1 : 0);
    if (isSpeedBoost) lastSpeedBoost = Date.now();
    savePreference('isSpeedBoost', isSpeedBoost);
    document.querySelectorAll('#mod-speedBoost .mod-button').forEach(btn => {
        btn.textContent = `Speed Boost: ${isSpeedBoost ? 'ON' : 'OFF'}`;
        btn.className = `mod-button ${isSpeedBoost ? 'on' : ''}`;
    });
}

if (IsBotActive) startFoodBot();

document.addEventListener('DOMContentLoaded', () => setTimeout(initializeUI, 100));