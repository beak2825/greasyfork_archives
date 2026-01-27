// ==UserScript==
// @name         LiveReload
// @namespace    https://github.com/RustwuIf
// @version      2.2.1
// @description  Randomized auto-refresh
// @author       Rustwulf
// @match        <all_urls>
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531614/LiveReload.user.js
// @updateURL https://update.greasyfork.org/scripts/531614/LiveReload.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function LiveReload() {
        const storageKey = 'autoRefreshState';
        const themeKey = 'autoRefreshTheme';
        const opacityKey = 'autoRefreshOpacity';
        const soundKey = 'autoRefreshSound';
        const defaults = { min: 5, max: 15, opacity: 1, sound: false };

        let isRunning = false;
        let isPausedBySafety = false;
        let isPausedByInactivity = false;
        let remainingTime = 0;
        let timerId = null;
        let maxRemainingTime = 0;
        let lastActivityTime = Date.now();
        let inactivityTimeout = null;
        const INACTIVITY_THRESHOLD = 60000;
        const originalFavicon = document.querySelector("link[rel~='icon']") ? document.querySelector("link[rel~='icon']").href : '/favicon.ico';

        const statsKey = 'autoRefreshStats';
        let stats = {
            totalReloads: 0,
            sessionStartTime: null,
            totalRunningTime: 0,
            waitTimes: [],
            historyLog: [],
            maxReloadsLimit: 0,
            excludedDomains: [],
            jitterMode: false,
            pauseOnNetwork: false
        };

        function loadStats() {
            try {
                const stored = localStorage.getItem(statsKey);
                if (stored) {
                    const loaded = JSON.parse(stored);
                    stats = { ...stats, ...loaded };
                }
            } catch (e) {
                console.error('[AutoRefresh] Stats load error:', e);
            }
        }

        function saveStats() {
            try {
                localStorage.setItem(statsKey, JSON.stringify(stats));
            } catch (e) {
                console.error('[AutoRefresh] Stats save error:', e);
            }
        }

        function getSettings() {
            return {
                min: parseInt(localStorage.getItem('minDelay'), 10) || defaults.min,
                max: parseInt(localStorage.getItem('maxDelay'), 10) || defaults.max,
                opacity: localStorage.getItem(opacityKey) || defaults.opacity,
                sound: localStorage.getItem(soundKey) === 'true'
            };
        }

        const updateFavicon = (number) => {
            const canvas = document.createElement('canvas');
            canvas.width = 32; canvas.height = 32;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = originalFavicon;

            img.onload = () => {
                ctx.drawImage(img, 0, 0, 32, 32);
                ctx.beginPath();
                ctx.arc(20, 20, 12, 0, 2 * Math.PI);
                ctx.fillStyle = isPausedBySafety ? '#3498db' : (number <= 3 ? '#ff5f6d' : '#2ecc71');
                ctx.fill();
                ctx.fillStyle = "white";
                ctx.font = "bold 16px Arial";
                ctx.textAlign = "center";
                ctx.fillText(isPausedBySafety ? "!!" : number, 20, 26);

                let link = document.querySelector("link[rel~='icon']");
                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.head.appendChild(link);
                }
                link.href = canvas.toDataURL('image/png');
            };

            img.onerror = () => {
                console.warn('[AutoRefresh] Could not load favicon');
            };
        };

        const showToast = (message) => {
            const toast = document.createElement('div');
            toast.style.cssText = 'position: fixed; bottom: 100px; left: 20px; background: rgba(52, 152, 219, 0.95); color: white; padding: 16px 24px; border-radius: 12px; font-weight: 600; z-index: 2147483646; box-shadow: 0 8px 25px rgba(0,0,0,0.3); backdrop-filter: blur(10px); animation: slideInUp 0.3s ease-out; font-family: Arial, sans-serif;';
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2500);
        };

        const getReloadCount = () => {
            const count = localStorage.getItem('reloadCounter');
            return parseInt(count) || 0;
        };

        const incrementReloadCount = () => {
            const newCount = getReloadCount() + 1;
            localStorage.setItem('reloadCounter', newCount.toString());
            stats.totalReloads = newCount;
            saveStats();
            return newCount;
        };

        const resetReloadCount = () => {
            localStorage.setItem('reloadCounter', '0');
            stats.totalReloads = 0;
            saveStats();
        };

        const applyJitter = (value) => {
            if (!localStorage.getItem('jitterMode') || localStorage.getItem('jitterMode') !== 'true') return value;
            const jitter = Math.floor(value * 0.1);
            return value + Math.floor(Math.random() * jitter * 2) - jitter;
        };

        const isCurrentDomainExcluded = () => {
            if (!stats.excludedDomains || stats.excludedDomains.length === 0) return false;
            const currentDomain = window.location.hostname;
            return stats.excludedDomains.some(domain => currentDomain.includes(domain.trim()));
        };

        const addToHistory = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            stats.historyLog.push(timeStr);
            if (stats.historyLog.length > 20) stats.historyLog.shift();
            saveStats();
        };

        const recordActivity = () => {
            lastActivityTime = Date.now();
            if (isPausedByInactivity) {
                isPausedByInactivity = false;
                updateUIState();
            }
            resetInactivityTimeout();
        };

        const resetInactivityTimeout = () => {
            if (inactivityTimeout) clearTimeout(inactivityTimeout);
            if (!isRunning || localStorage.getItem('inactivityPauseEnabled') !== 'true') return;

            inactivityTimeout = setTimeout(() => {
                if (isRunning && !isPausedBySafety) {
                    isPausedByInactivity = true;
                    updateUIState();
                }
            }, INACTIVITY_THRESHOLD);
        };

        let host, shadow, mainBtn, settingsBtn, themeBtn, settingsModal, opacitySlider;
        let minInput, maxInput, minDisplay, maxDisplay;

        function createShadowUI() {
            if (!document.body) {
                setTimeout(createShadowUI, 100);
                return;
            }

            host = document.createElement('div');
            host.id = 'live-reload-host';
            host.style.cssText = 'position: fixed; bottom: 20px; left: 20px; z-index: 2147483647; font-family: "Inter", sans-serif;';

            let isDragging = false;
            let dragOffsetX = 0;
            let dragOffsetY = 0;

            host.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                const path = e.composedPath();
                const isFromModal = path.some(el => {
                    return el.tagName === 'INPUT' ||
                           (el.className && (el.className.includes('modal') || el.className.includes('stats-section')));
                });
                if (isFromModal) return;

                isDragging = true;
                dragOffsetX = e.clientX - host.offsetLeft;
                dragOffsetY = e.clientY - host.offsetTop;
                host.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                host.style.left = (e.clientX - dragOffsetX) + 'px';
                host.style.top = (e.clientY - dragOffsetY) + 'px';
                host.style.bottom = 'auto';
                localStorage.setItem('liveReloadPos', JSON.stringify({x: e.clientX - dragOffsetX, y: e.clientY - dragOffsetY}));
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                host.style.cursor = 'grab';
            });

            const savedPos = localStorage.getItem('liveReloadPos');
            if (savedPos) {
                try {
                    const pos = JSON.parse(savedPos);
                    host.style.left = pos.x + 'px';
                    host.style.top = pos.y + 'px';
                    host.style.bottom = 'auto';
                } catch (e) {
                    console.warn('[AutoRefresh] Could not restore position:', e);
                }
            }

            document.body.appendChild(host);
            shadow = host.attachShadow({ mode: 'open' });

            const style = document.createElement('style');
            style.textContent = `
                :host { --accent-red: linear-gradient(135deg, #ff5f6d, #ffc371); --accent-green: linear-gradient(135deg, #11998e, #38ef7d); --accent-blue: #3498db; }
                :host([theme="dark"]) { --bg: rgba(20,20,25,0.95); --modal-bg: rgba(15,15,20,0.98); --text: #fff; --border: rgba(255,255,255,0.08); --input-bg: rgba(255,255,255,0.05); }
                :host([theme="light"]) { --bg: rgba(240,242,245,0.95); --modal-bg: rgba(255,255,255,0.98); --text: #1a1a1b; --border: rgba(0,0,0,0.08); --input-bg: rgba(0,0,0,0.03); }

                .btn { cursor: pointer; color: var(--text); border-radius: 12px; padding: 11px 20px; font-weight: 600; border: 1px solid var(--border); display: flex; align-items: center; gap: 8px; backdrop-filter: blur(20px); background: var(--bg); transition: all 0.25s ease; font-size: 14px; }
                .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); border-color: rgba(255,255,255,0.15); }
                .btn:active { transform: translateY(0px); }
                .btn:hover .icon { animation: iconRotate 0.6s ease-in-out forwards; }
                .icon { display: inline-block; font-size: 16px; }

                .btn-main { background: var(--accent-red); border: none; color: white; min-width: 130px; justify-content: center; box-shadow: 0 6px 20px rgba(255, 95, 109, 0.3); position: relative; font-size: 15px; font-weight: 700; }
                .btn-main::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 160px;
                    height: 160px;
                    border: 3px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    animation: rotatePulse 3s linear infinite;
                    pointer-events: none;
                    z-index: -1;
                }
                .btn-main.active::before {
                    border-color: rgba(255, 255, 255, 0.7);
                    animation: rotatePulse 2s linear infinite;
                }
                .btn-main.safety::before {
                    border-color: rgba(52, 152, 219, 0.7);
                    animation: rotatePulse 1.5s linear infinite;
                }
                @keyframes rotatePulse {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
                .btn-main.active { background: linear-gradient(135deg, #f1c40f, #f39c12); color: #000; box-shadow: 0 6px 20px rgba(241, 196, 15, 0.4); }
                .btn-main.safety { background: var(--accent-blue); color: white; box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3); animation: softPulse 2s infinite; }

                .modal {
                    position: absolute; bottom: 75px; left: 0; background: var(--modal-bg); padding: 18px; border-radius: 18px;
                    border: 1px solid var(--border); box-shadow: 0 25px 60px rgba(0,0,0,0.2); color: var(--text); display: none;
                    flex-direction: column; gap: 10px; width: 300px; backdrop-filter: blur(30px); max-height: 480px; overflow-y: auto;
                }
                .modal::-webkit-scrollbar { width: 5px; }
                .modal::-webkit-scrollbar-track { background: transparent; }
                .modal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
                .modal::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }

                .modal, .modal * { cursor: auto !important; }
                .modal button { cursor: pointer !important; }
                .modal input { cursor: pointer !important; }

                input[type="range"] {
                    width: 100%; height: 6px; border-radius: 5px; background: var(--input-bg);
                    outline: none; -webkit-appearance: none; appearance: none;
                    accent-color: #11998e;
                }
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%;
                    background: linear-gradient(135deg, #11998e, #38ef7d); cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    transition: all 0.2s ease;
                }
                input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.15); box-shadow: 0 4px 12px rgba(17,153,142,0.4); }
                input[type="range"]::-moz-range-thumb {
                    width: 18px; height: 18px; border-radius: 50%; background: linear-gradient(135deg, #11998e, #38ef7d);
                    cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2); border: none; transition: all 0.2s ease;
                }
                input[type="range"]::-moz-range-thumb:hover { transform: scale(1.15); box-shadow: 0 4px 12px rgba(17,153,142,0.4); }

                input[type="checkbox"] {
                    width: 16px; height: 16px; cursor: pointer; accent-color: #11998e;
                }

                .preset-btn {
                    background: rgba(17, 153, 142, 0.15); border: 1px solid rgba(17, 153, 142, 0.3); color: var(--text);
                    padding: 8px 12px; border-radius: 8px; font-weight: 600; font-size: 11px; cursor: pointer;
                    transition: all 0.2s ease; font-family: inherit;
                }
                .preset-btn:hover { background: rgba(17, 153, 142, 0.25); border-color: rgba(17, 153, 142, 0.5); transform: translateY(-1px); }
                .preset-btn:active { transform: translateY(0); }

                .btn-save {
                    background: var(--accent-green); border: none; color: white; padding: 10px 35px; border-radius: 10px;
                    font-weight: 700; margin: 8px auto 0 auto; display: block; cursor: pointer; font-size: 13px;
                    transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(17,153,142,0.3); font-family: inherit;
                }
                .btn-save:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(17,153,142,0.4); }
                .btn-save:active { transform: translateY(0); }

                .section-title { font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; opacity: 0.65; margin: 6px 0 2px 0; }
                .input-group { display: flex; flex-direction: column; gap: 5px; }
                .input-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
                .input-row label { font-size: 12px; font-weight: 500; }
                .input-row strong { color: #11998e; font-weight: 700; font-size: 13px; }

                .divider { height: 1px; background: var(--border); margin: 8px 0; }
                .presets-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }

                .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; }
                .stats-grid > div { padding: 6px; background: var(--input-bg); border-radius: 6px; border: 1px solid var(--border); }
                .stats-grid .label { opacity: 0.6; margin-bottom: 2px; }
                .stats-grid .value { font-size: 13px; font-weight: 700; color: #11998e; }

                @keyframes softPulse { 0% { opacity: 1; } 50% { opacity: 0.75; } 100% { opacity: 1; } }
                @keyframes iconRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes slideInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `;

            const wrapper = document.createElement('div');
            wrapper.style.opacity = getSettings().opacity;
            const container = document.createElement('div');
            container.style.display = 'flex'; container.style.gap = '10px';

            mainBtn = document.createElement('button');
            mainBtn.className = 'btn btn-main';
            mainBtn.style.position = 'relative';
            mainBtn.innerHTML = `<span class="icon">▶</span><span>Start</span>`;

            settingsBtn = document.createElement('button');
            settingsBtn.className = 'btn';
            settingsBtn.innerHTML = `<span class="icon">⚙</span>`;

            themeBtn = document.createElement('button');
            themeBtn.className = 'btn';

            settingsModal = document.createElement('div');
            settingsModal.className = 'modal';
            settingsModal.innerHTML = `
                <div style="font-weight: 700; font-size: 13px;">⚡ Presets</div>
                <div class="presets-grid">
                    <button class="preset-btn" id="preset-1-5">1-5s</button>
                    <button class="preset-btn" id="preset-1-15">1-15s</button>
                    <button class="preset-btn" id="preset-5-10">5-10s</button>
                    <button class="preset-btn" id="preset-10-15">10-15s</button>
                    <button class="preset-btn" id="preset-15-20">15-20s</button>
                    <button class="preset-btn" id="preset-20-30">20-30s</button>
                    <button class="preset-btn" id="preset-1-5m" style="grid-column: 1 / -1;">1-5m</button>
                </div>

                <div class="divider"></div>

                <div class="section-title">⏱ Timing</div>
                <div class="input-group">
                    <div class="input-row">
                        <label>Min</label>
                        <strong id="min-display">5</strong><span style="opacity: 0.5; font-size: 11px;">s</span>
                    </div>
                    <input type="range" id="min-input" min="1" max="299" value="5">
                </div>

                <div class="input-group">
                    <div class="input-row">
                        <label>Max</label>
                        <strong id="max-display">15</strong><span style="opacity: 0.5; font-size: 11px;">s</span>
                    </div>
                    <input type="range" id="max-input" min="2" max="300" value="15">
                </div>

                <div class="divider"></div>

                <div class="section-title">🎛 Controls</div>
                <div class="input-group">
                    <div class="input-row">
                        <label>Max Reloads</label>
                        <strong id="max-reloads-display">0</strong>
                    </div>
                    <input type="range" id="max-reloads-input" min="0" max="100" value="0">
                </div>

                <div class="input-group">
                    <div class="input-row">
                        <label>Opacity</label>
                        <strong id="opacity-display">100</strong><span style="opacity: 0.5; font-size: 11px;">%</span>
                    </div>
                    <input type="range" id="opacity-slider" min="0.2" max="1" step="0.1" value="1">
                </div>

                <div style="display: flex; gap: 10px; margin-top: 6px;">
                    <div style="flex: 1; display: flex; align-items: center; gap: 6px;">
                        <input type="checkbox" id="inactivity-toggle" style="margin: 0;">
                        <label style="font-size: 11px; font-weight: 500; margin: 0;">Inactivity</label>
                    </div>
                    <div style="flex: 1; display: flex; align-items: center; gap: 6px;">
                        <input type="checkbox" id="jitter-toggle" style="margin: 0;">
                        <label style="font-size: 11px; font-weight: 500; margin: 0;">Jitter</label>
                    </div>
                </div>

                <div class="divider"></div>

                <div class="section-title">📊 Stats</div>
                <div class="stats-grid">
                    <div>
                        <div class="label">Reloads</div>
                        <div class="value" id="stat-reloads">0</div>
                    </div>
                    <div>
                        <div class="label">Limit</div>
                        <div class="value" id="stat-max-limit">0</div>
                    </div>
                    <div>
                        <div class="label">Session</div>
                        <div class="value" id="stat-session">0m</div>
                    </div>
                    <div>
                        <div class="label">Avg</div>
                        <div class="value" id="stat-avg">0s</div>
                    </div>
                </div>

                <button class="btn-save" id="save-btn">SAVE</button>
                <button class="preset-btn" id="reset-stats-btn" style="width: 100%; margin-top: 4px; padding: 8px; font-size: 11px;">Reset</button>
            `;

            container.append(mainBtn, themeBtn, settingsBtn);
            wrapper.append(container, settingsModal);
            shadow.append(style, wrapper);

            minInput = settingsModal.querySelector('#min-input');
            maxInput = settingsModal.querySelector('#max-input');
            minDisplay = settingsModal.querySelector('#min-display');
            maxDisplay = settingsModal.querySelector('#max-display');

            opacitySlider = settingsModal.querySelector('#opacity-slider');

            const maxReloadsInput = settingsModal.querySelector('#max-reloads-input');
            const maxReloadsDisplay = settingsModal.querySelector('#max-reloads-display');
            const opacityDisplay = settingsModal.querySelector('#opacity-display');

            // MIN SLIDER - Real-time + Validation
            minInput.addEventListener('input', function() {
                minDisplay.textContent = this.value;
            });

            minInput.addEventListener('change', function() {
                const minVal = parseInt(this.value, 10);
                const maxVal = parseInt(maxInput.value, 10);
                if (minVal >= maxVal) {
                    this.value = maxVal - 1;
                    minDisplay.textContent = maxVal - 1;
                    console.log('[AutoRefresh] Min auto-corrected to:', maxVal - 1);
                }
            });

            // MAX SLIDER - Real-time + Validation
            maxInput.addEventListener('input', function() {
                maxDisplay.textContent = this.value;
            });

            maxInput.addEventListener('change', function() {
                const maxVal = parseInt(this.value, 10);
                const minVal = parseInt(minInput.value, 10);
                if (maxVal <= minVal) {
                    this.value = minVal + 1;
                    maxDisplay.textContent = minVal + 1;
                    console.log('[AutoRefresh] Max auto-corrected to:', minVal + 1);
                }
            });

            // MAX RELOADS SLIDER
            maxReloadsInput.addEventListener('input', function() {
                maxReloadsDisplay.textContent = this.value;
            });

            // OPACITY SLIDER
            opacitySlider.addEventListener('input', function() {
                wrapper.style.opacity = this.value;
                opacityDisplay.textContent = Math.round(this.value * 100);
            });
        }

        function updateUIState() {
            if (isPausedByInactivity) {
                mainBtn.className = 'btn btn-main safety';
                mainBtn.innerHTML = `<span class="icon">💤</span><span>NO ACTIVITY</span>`;
            } else if (isPausedBySafety) {
                mainBtn.className = 'btn btn-main safety';
                mainBtn.innerHTML = `<span class="icon">🛡</span><span>PAUSED</span>`;
            } else if (isRunning) {
                mainBtn.className = 'btn btn-main active';
                mainBtn.innerHTML = `<span class="icon">⏸</span><span>${remainingTime}s</span>`;
            } else {
                mainBtn.className = 'btn btn-main';
                mainBtn.innerHTML = `<span class="icon">▶</span><span>Start</span>`;
            }
            updateFavicon(remainingTime);
            if (isRunning && !isPausedBySafety && !isPausedByInactivity) {
                document.title = `[${remainingTime}s] ` + document.title.replace(/\[\d+s\]\s/, '');
            } else {
                document.title = document.title.replace(/\[\d+s\]\s/, '');
            }
        }

        function startCycle() {
            if (isCurrentDomainExcluded()) {
                showToast('⛔ Domain excluded');
                isRunning = false;
                updateUIState();
                return;
            }

            const { min, max } = getSettings();
            let waitTime = Math.max(1, Math.floor(Math.random() * (max - min) + min));
            waitTime = applyJitter(waitTime);
            remainingTime = waitTime;
            maxRemainingTime = remainingTime;
            stats.waitTimes.push(remainingTime);

            if (!stats.sessionStartTime) {
                stats.sessionStartTime = Date.now();
            }

            isPausedByInactivity = false;
            resetInactivityTimeout();
            updateUIState();

            timerId = setInterval(() => {
                if (!isPausedBySafety && !isPausedByInactivity) {
                    remainingTime--;
                    updateUIState();
                    if (remainingTime <= 0) {
                        const maxReloadsLimit = parseInt(localStorage.getItem('maxReloadsLimit')) || 0;
                        const currentReloadCount = getReloadCount();

                        if (maxReloadsLimit > 0 && currentReloadCount >= maxReloadsLimit) {
                            showToast('🛑 Max reached');
                            isRunning = false;
                            clearInterval(timerId);
                            updateUIState();
                            return;
                        }

                        incrementReloadCount();
                        addToHistory();
                        window.location.reload();
                    }
                }
            }, 1000);
        }

        const checkSafety = (e) => {
            const active = document.activeElement;
            const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
            if (isRunning && isTyping) {
                isPausedBySafety = true;
            } else {
                isPausedBySafety = false;
            }
            updateUIState();
        };

        createShadowUI();
        host.setAttribute('theme', localStorage.getItem(themeKey) || 'dark');
        themeBtn.innerHTML = host.getAttribute('theme') === 'dark' ? `<span class="icon">☀️</span>` : `<span class="icon">🌙</span>`;

        mainBtn.onclick = () => {
            isRunning = !isRunning;
            isPausedBySafety = false;
            isPausedByInactivity = false;
            localStorage.setItem(storageKey, isRunning);
            isRunning ? startCycle() : (clearInterval(timerId), clearTimeout(inactivityTimeout), updateUIState());
        };

        document.addEventListener('focusin', checkSafety);
        document.addEventListener('focusout', () => setTimeout(checkSafety, 100));
        document.addEventListener('mousemove', recordActivity);
        document.addEventListener('keypress', recordActivity);
        document.addEventListener('click', recordActivity);
        document.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.key.toUpperCase() === 'T') {
                e.preventDefault();
                mainBtn.click();
            }
        });

        loadStats();
        stats.totalReloads = getReloadCount();

        themeBtn.onclick = () => {
            const next = host.getAttribute('theme') === 'dark' ? 'light' : 'dark';
            host.setAttribute('theme', next);
            localStorage.setItem(themeKey, next);
            themeBtn.innerHTML = next === 'dark' ? `<span class="icon">☀️</span>` : `<span class="icon">🌙</span>`;
        };

        settingsBtn.onclick = () => {
            settingsModal.style.display = settingsModal.style.display === 'flex' ? 'none' : 'flex';
            const s = getSettings();

            minInput.value = s.min;
            maxInput.value = s.max;
            minDisplay.textContent = s.min;
            maxDisplay.textContent = s.max;

            shadow.querySelector('#inactivity-toggle').checked = localStorage.getItem('inactivityPauseEnabled') === 'true';
            shadow.querySelector('#jitter-toggle').checked = localStorage.getItem('jitterMode') === 'true';

            const maxReloadsValue = localStorage.getItem('maxReloadsLimit') || '0';
            shadow.querySelector('#max-reloads-input').value = maxReloadsValue;
            shadow.querySelector('#max-reloads-display').textContent = maxReloadsValue;

            opacitySlider.value = s.opacity;
            shadow.querySelector('#opacity-display').textContent = Math.round(s.opacity * 100);

            const sessionTime = stats.sessionStartTime ? Date.now() - stats.sessionStartTime : 0;
            const minutes = Math.floor(sessionTime / 60000);
            const seconds = Math.floor((sessionTime % 60000) / 1000);
            const avgWait = stats.waitTimes.length > 0 ? Math.round(stats.waitTimes.reduce((a,b) => a+b) / stats.waitTimes.length) : 0;

            shadow.querySelector('#stat-reloads').textContent = stats.totalReloads;
            shadow.querySelector('#stat-max-limit').textContent = localStorage.getItem('maxReloadsLimit') || '0';
            shadow.querySelector('#stat-session').textContent = minutes > 0 ? `${minutes}m` : '0m';
            shadow.querySelector('#stat-avg').textContent = avgWait + 's';

            console.log('[AutoRefresh] Settings opened');
        };

        // Presets
        const updateSliderDisplay = (minVal, maxVal) => {
            minInput.value = minVal;
            maxInput.value = maxVal;
            minDisplay.textContent = minVal;
            maxDisplay.textContent = maxVal;
            console.log(`[AutoRefresh] Preset: ${minVal}s - ${maxVal}s`);
        };

        shadow.querySelector('#preset-1-5').addEventListener('click', () => updateSliderDisplay(1, 5));
        shadow.querySelector('#preset-1-15').addEventListener('click', () => updateSliderDisplay(1, 15));
        shadow.querySelector('#preset-5-10').addEventListener('click', () => updateSliderDisplay(5, 10));
        shadow.querySelector('#preset-10-15').addEventListener('click', () => updateSliderDisplay(10, 15));
        shadow.querySelector('#preset-15-20').addEventListener('click', () => updateSliderDisplay(15, 20));
        shadow.querySelector('#preset-20-30').addEventListener('click', () => updateSliderDisplay(20, 30));
        shadow.querySelector('#preset-1-5m').addEventListener('click', () => updateSliderDisplay(60, 300));

        shadow.querySelector('#save-btn').addEventListener('click', () => {
            const minVal = parseInt(minInput.value, 10);
            const maxVal = parseInt(maxInput.value, 10);

            if (minVal >= maxVal) {
                showToast('❌ Min must be less than Max');
                console.warn('[AutoRefresh] Save validation failed');
                return;
            }

            localStorage.setItem('minDelay', minVal.toString());
            localStorage.setItem('maxDelay', maxVal.toString());
            localStorage.setItem(opacityKey, opacitySlider.value);
            localStorage.setItem('inactivityPauseEnabled', shadow.querySelector('#inactivity-toggle').checked);
            localStorage.setItem('jitterMode', shadow.querySelector('#jitter-toggle').checked);

            const maxReloadsValue = parseInt(shadow.querySelector('#max-reloads-input').value) || 0;
            localStorage.setItem('maxReloadsLimit', maxReloadsValue.toString());

            stats.maxReloadsLimit = maxReloadsValue;
            stats.jitterMode = shadow.querySelector('#jitter-toggle').checked;
            saveStats();

            showToast('✅ Settings saved!');
            console.log('[AutoRefresh] Settings saved');
            settingsModal.style.display = 'none';
        });

        shadow.querySelector('#reset-stats-btn').addEventListener('click', () => {
            if (confirm('Reset all statistics?')) {
                resetReloadCount();
                stats = {
                    totalReloads: 0,
                    sessionStartTime: null,
                    totalRunningTime: 0,
                    waitTimes: [],
                    historyLog: [],
                    maxReloadsLimit: 0,
                    excludedDomains: [],
                    jitterMode: false,
                    pauseOnNetwork: false
                };
                saveStats();
                shadow.querySelector('#stat-reloads').textContent = '0';
                shadow.querySelector('#stat-max-limit').textContent = '0';
                shadow.querySelector('#stat-session').textContent = '0m';
                shadow.querySelector('#stat-avg').textContent = '0s';
                showToast('🔄 Stats reset!');
            }
        });

        if (localStorage.getItem(storageKey) === 'true') {
            isRunning = true;
            startCycle();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', LiveReload);
    } else {
        LiveReload();
    }
})();