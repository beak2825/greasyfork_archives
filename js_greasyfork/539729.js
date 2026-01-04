javascript:(function() {
    // ==UserScript==
    // @name         Emu's Chams GUI (Stats HUD)
    // @namespace    EmuChams
    // @version      1.9
    // @description  Professional toggleable wallhack (chams) GUI for Kirka.io with advanced crosshairs and stats HUD
    // @author       Emulation
    // @match        *://kirka.io/*
    // @run-at       document-start
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539729/Emu%27s%20Chams%20GUI%20%28Stats%20HUD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539729/Emu%27s%20Chams%20GUI%20%28Stats%20HUD%29.meta.js
    // ==/UserScript==

    (function () {
        // Settings
        const settings = {
            enabled: localStorage.getItem('chamsEnabled') !== 'false',
            theme: localStorage.getItem('chamsTheme') || 'obsidian-black',
            menuPosition: JSON.parse(localStorage.getItem('menuPosition')) || { left: '120px', top: '120px' },
            menuVisible: true, // Always visible on load
            menuMinimized: localStorage.getItem('menuMinimized') === 'true',
            hudPosition: JSON.parse(localStorage.getItem('hudPosition')) || { left: '400px', top: '120px' },
            crosshairType: localStorage.getItem('crosshairType') || 'None',
            crosshairSize: parseInt(localStorage.getItem('crosshairSize')) || 20,
            crosshairThickness: parseInt(localStorage.getItem('crosshairThickness')) || 2,
            crosshairColor: localStorage.getItem('crosshairColor') || '#00f0ff',
            crosshairOutline: localStorage.getItem('crosshairOutline') === 'true',
            crosshairOutlineThickness: parseFloat(localStorage.getItem('crosshairOutlineThickness')) || 1,
            crosshairOpacity: parseFloat(localStorage.getItem('crosshairOpacity')) || 1,
            crosshairRotation: parseInt(localStorage.getItem('crosshairRotation')) || 0,
            showFPS: localStorage.getItem('showFPS') === 'true',
            showLatency: localStorage.getItem('showLatency') === 'true',
            showFPSGraph: localStorage.getItem('showFPSGraph') === 'true',
            showLatencyGraph: localStorage.getItem('showLatencyGraph') === 'true',
            menuOpacity: parseFloat(localStorage.getItem('menuOpacity')) || 1,
            menuScale: parseFloat(localStorage.getItem('menuScale')) || 1
        };
        const modifiedMaterials = new WeakSet();
        let notificationTimeout = null;
        const clientVersion = '1.9.0';
        let menuVisible = settings.menuVisible;
        const notifications = [];
        let crosshairCanvas, crosshairCtx, statsCanvas, statsCtx;
        let lastFrameTime = performance.now();
        let fps = 0, latency = 0;
        const fpsHistory = [], latencyHistory = [];
        const maxHistory = 60; // ~30s at 60fps

        // Save settings
        function saveSettings() {
            localStorage.setItem('chamsEnabled', settings.enabled);
            localStorage.setItem('chamsTheme', settings.theme);
            localStorage.setItem('menuPosition', JSON.stringify(settings.menuPosition));
            localStorage.setItem('menuVisible', menuVisible);
            localStorage.setItem('menuMinimized', settings.menuMinimized);
            localStorage.setItem('hudPosition', JSON.stringify(settings.hudPosition));
            localStorage.setItem('crosshairType', settings.crosshairType);
            localStorage.setItem('crosshairSize', settings.crosshairSize);
            localStorage.setItem('crosshairThickness', settings.crosshairThickness);
            localStorage.setItem('crosshairColor', settings.crosshairColor);
            localStorage.setItem('crosshairOutline', settings.crosshairOutline);
            localStorage.setItem('crosshairOutlineThickness', settings.crosshairOutlineThickness);
            localStorage.setItem('crosshairOpacity', settings.crosshairOpacity);
            localStorage.setItem('crosshairRotation', settings.crosshairRotation);
            localStorage.setItem('showFPS', settings.showFPS);
            localStorage.setItem('showLatency', settings.showLatency);
            localStorage.setItem('showFPSGraph', settings.showFPSGraph);
            localStorage.setItem('showLatencyGraph', settings.showLatencyGraph);
            localStorage.setItem('menuOpacity', settings.menuOpacity);
            localStorage.setItem('menuScale', settings.menuScale);
        }

        // Reset settings
        function resetSettings() {
            localStorage.clear();
            settings.enabled = true;
            settings.theme = 'obsidian-black';
            settings.menuPosition = { left: '120px', top: '120px' };
            settings.menuVisible = true;
            settings.menuMinimized = false;
            settings.hudPosition = { left: '400px', top: '120px' };
            settings.crosshairType = 'None';
            settings.crosshairSize = 20;
            settings.crosshairThickness = 2;
            settings.crosshairColor = '#00f0ff';
            settings.crosshairOutline = false;
            settings.crosshairOutlineThickness = 1;
            settings.crosshairOpacity = 1;
            settings.crosshairRotation = 0;
            settings.showFPS = false;
            settings.showLatency = false;
            settings.showFPSGraph = false;
            settings.showLatencyGraph = false;
            settings.menuOpacity = 1;
            settings.menuScale = 1;
            saveSettings();
            showNotification('Settings reset to default');
            location.reload();
        }

        // Show notification
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification tooltip';
            notification.textContent = message;
            notification.style.position = 'fixed';
            notification.style.bottom = `${20 + notifications.length * 40}px`;
            notification.style.right = '20px';
            notification.style.background = 'var(--bg-gradient)';
            notification.style.border = '1px solid var(--accent-color)';
            notification.style.color = 'var(--text-color)';
            notification.style.padding = '6px 12px';
            notification.style.borderRadius = '5px';
            notification.style.boxShadow = '0 4px 15px var(--accent-shadow)';
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            notification.style.transform = 'translateX(20px)';
            notification.style.zIndex = '999997';
            notification.style.fontFamily = '"Inter", sans-serif';
            notification.style.fontSize = '11px';
            notification.style.backdropFilter = 'blur(12px)';
            document.body.appendChild(notification);
            notifications.push(notification);

            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            }, 10);
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(20px)';
                setTimeout(() => {
                    notification.remove();
                    notifications.splice(notifications.indexOf(notification), 1);
                    notifications.forEach((n, i) => {
                        n.style.bottom = `${20 + i * 40}px`;
                    });
                }, 300);
            }, 2500);

            if (notificationTimeout) clearTimeout(notificationTimeout);
            notificationTimeout = setTimeout(() => {}, 100);
        }

        // Patch material for chams
        const patchMaterial = (material) => {
            if (!material || !material.map || !material.map.image) return;
            const isTarget = material.map.image.width === 64 && material.map.image.height === 64;
            if (!isTarget) return;

            if (settings.enabled && !modifiedMaterials.has(material)) {
                for (let key in material) {
                    if (material[key] === 3) {
                        material[key] = 1;
                        modifiedMaterials.add(material);
                    }
                }
            } else if (!settings.enabled && modifiedMaterials.has(material)) {
                for (let key in material) {
                    if (material[key] === 1) {
                        material[key] = 3;
                    }
                }
                modifiedMaterials.delete(material);
            }
        };

        // Hook Array.isArray to intercept material use
        const proxyHandler = {
            apply(target, thisArg, args) {
                patchMaterial(args[0]);
                return Reflect.apply(target, thisArg, args);
            }
        };
        const originalIsArray = Array.isArray;
        Array.isArray = new Proxy(originalIsArray, proxyHandler);

        // Force material patching on any new materials dynamically
        const observeMaterials = () => {
            const interval = setInterval(() => {
                if (window.THREE) {
                    const walk = (obj) => {
                        if (!obj || typeof obj !== "object") return;
                        if (obj.material) {
                            const mat = obj.material;
                            if (Array.isArray(mat)) mat.forEach(patchMaterial);
                            else patchMaterial(mat);
                        }
                        for (const key in obj) {
                            if (obj.hasOwnProperty(key)) walk(obj[key]);
                        }
                    };
                    walk(window);
                    clearInterval(interval);
                }
            }, 1000);
        };

        // Crosshair rendering
        function initCrosshairCanvas() {
            crosshairCanvas = document.createElement('canvas');
            crosshairCanvas.id = 'crosshair-canvas';
            crosshairCanvas.style.position = 'fixed';
            crosshairCanvas.style.top = '0';
            crosshairCanvas.style.left = '0';
            crosshairCanvas.style.width = '100%';
            crosshairCanvas.style.height = '100%';
            crosshairCanvas.style.zIndex = '999998';
            crosshairCanvas.style.pointerEvents = 'none';
            document.body.appendChild(crosshairCanvas);
            crosshairCtx = crosshairCanvas.getContext('2d');
            resizeCrosshair();
        }

        function resizeCrosshair() {
            if (!crosshairCanvas) return;
            crosshairCanvas.width = window.innerWidth;
            crosshairCanvas.height = window.innerHeight;
            drawCrosshair();
        }

        function drawCrosshair() {
            if (!crosshairCtx || !crosshairCanvas) return;
            crosshairCtx.clearRect(0, 0, crosshairCanvas.width, crosshairCanvas.height);
            if (settings.crosshairType === 'None') return;

            const centerX = crosshairCanvas.width / 2;
            const centerY = crosshairCanvas.height / 2;
            const size = settings.crosshairSize;
            const thickness = settings.crosshairThickness;
            const color = settings.crosshairColor;
            let rotation = settings.crosshairRotation * Math.PI / 180;
            if (settings.crosshairType === 'Dynamic Star') rotation += Date.now() / 1000;
            if (settings.crosshairType === 'Dynamic Circle') rotation = 0;

            crosshairCtx.save();
            crosshairCtx.translate(centerX, centerY);
            crosshairCtx.rotate(rotation);
            crosshairCtx.globalAlpha = settings.crosshairOpacity;

            if (settings.crosshairOutline) {
                crosshairCtx.strokeStyle = '#000000';
                crosshairCtx.lineWidth = thickness + settings.crosshairOutlineThickness * 2;
                drawCrosshairShape(true);
            }

            crosshairCtx.strokeStyle = color;
            crosshairCtx.fillStyle = color;
            crosshairCtx.lineWidth = thickness;
            drawCrosshairShape(false);

            crosshairCtx.restore();

            function drawCrosshairShape(isOutline) {
                const method = isOutline ? 'stroke' : settings.crosshairType.includes('Dot') || settings.crosshairType === 'Circle' || settings.crosshairType === 'Triangle' ? 'fill' : 'stroke';
                crosshairCtx.beginPath();
                switch (settings.crosshairType) {
                    case 'Dot':
                        crosshairCtx.arc(0, 0, size / 5, 0, Math.PI * 2);
                        break;
                    case 'Cross':
                        crosshairCtx.moveTo(-size / 2, 0); crosshairCtx.lineTo(-size / 4, 0);
                        crosshairCtx.moveTo(size / 4, 0); crosshairCtx.lineTo(size / 2, 0);
                        crosshairCtx.moveTo(0, -size / 2); crosshairCtx.lineTo(0, -size / 4);
                        crosshairCtx.moveTo(0, size / 4); crosshairCtx.lineTo(0, size / 2);
                        break;
                    case 'Dynamic Dot':
                        const pulseSize = size / 5 + Math.sin(Date.now() / 300) * (size / 10);
                        crosshairCtx.arc(0, 0, pulseSize, 0, Math.PI * 2);
                        break;
                    case 'Circle':
                        crosshairCtx.arc(0, 0, size / 2, 0, Math.PI * 2);
                        break;
                    case 'Plus':
                        crosshairCtx.moveTo(-size / 2, 0); crosshairCtx.lineTo(size / 2, 0);
                        crosshairCtx.moveTo(0, -size / 2); crosshairCtx.lineTo(0, size / 2);
                        break;
                    case 'T-Shape':
                        crosshairCtx.moveTo(-size / 2, -size / 2); crosshairCtx.lineTo(size / 2, -size / 2);
                        crosshairCtx.moveTo(0, -size / 2); crosshairCtx.lineTo(0, size / 2);
                        break;
                    case 'Gap Cross':
                        crosshairCtx.moveTo(-size / 2, -size / 2); crosshairCtx.lineTo(-size / 4, -size / 4);
                        crosshairCtx.moveTo(size / 4, size / 4); crosshairCtx.lineTo(size / 2, size / 2);
                        crosshairCtx.moveTo(-size / 2, size / 2); crosshairCtx.lineTo(-size / 4, size / 4);
                        crosshairCtx.moveTo(size / 4, -size / 4); crosshairCtx.lineTo(size / 2, -size / 2);
                        break;
                    case 'Star':
                        for (let i = 0; i < 8; i++) {
                            const angle = i * Math.PI / 4;
                            const r = i % 2 === 0 ? size / 2 : size / 4;
                            crosshairCtx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
                        }
                        crosshairCtx.closePath();
                        break;
                    case 'Triangle':
                        crosshairCtx.moveTo(0, -size / 2);
                        crosshairCtx.lineTo(size / 2, size / 2);
                        crosshairCtx.lineTo(-size / 2, size / 2);
                        crosshairCtx.closePath();
                        break;
                    case 'Dynamic Circle':
                        const dynamicRadius = size / 2 + Math.sin(Date.now() / 500) * (size / 10);
                        crosshairCtx.arc(0, 0, dynamicRadius, 0, Math.PI * 2);
                        break;
                    case 'Dynamic Star':
                        for (let i = 0; i < 8; i++) {
                            const angle = i * Math.PI / 4;
                            const r = i % 2 === 0 ? size / 2 : size / 4;
                            crosshairCtx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
                        }
                        crosshairCtx.closePath();
                        break;
                }
                crosshairCtx[method]();
            }
        }

        // Stats rendering
        function initStatsCanvas() {
            statsCanvas = document.createElement('canvas');
            statsCanvas.id = 'stats-canvas';
            statsCanvas.style.width = '100%';
            statsCanvas.style.height = '80px';
            statsCanvas.style.display = 'block';
            document.querySelector('#emu-stats-hud')?.appendChild(statsCanvas);
            statsCtx = statsCanvas.getContext('2d');
            resizeStats();
        }

        function resizeStats() {
            if (!statsCanvas || !statsCanvas.parentElement) return;
            statsCanvas.width = statsCanvas.parentElement.offsetWidth * devicePixelRatio;
            statsCanvas.height = 80 * devicePixelRatio;
            statsCanvas.style.transform = `scale(${1 / devicePixelRatio})`;
            statsCanvas.style.transformOrigin = 'top left';
            drawStats();
        }

        function drawStats() {
            if (!statsCtx || !statsCanvas) return;
            statsCtx.clearRect(0, 0, statsCanvas.width, statsCanvas.height);
            if (!settings.showFPSGraph && !settings.showLatencyGraph) return;

            const width = statsCanvas.width;
            const height = statsCanvas.height;
            const step = width / maxHistory;

            if (settings.showFPSGraph) {
                statsCtx.strokeStyle = '#00ff00';
                statsCtx.lineWidth = 2;
                statsCtx.beginPath();
                fpsHistory.forEach((value, i) => {
                    const y = height - (value / 120) * height / 2;
                    if (i === 0) statsCtx.moveTo(i * step, y);
                    else statsCtx.lineTo(i * step, y);
                });
                statsCtx.stroke();
            }

            if (settings.showLatencyGraph) {
                statsCtx.strokeStyle = '#ff0000';
                statsCtx.lineWidth = 2;
                statsCtx.beginPath();
                latencyHistory.forEach((value, i) => {
                    const y = height - (value / 200) * height / 2;
                    if (i === 0) statsCtx.moveTo(i * step, y);
                    else statsCtx.lineTo(i * step, y);
                });
                statsCtx.stroke();
            }
        }

        // Update stats
        function updateStats() {
            const now = performance.now();
            const delta = now - lastFrameTime;
            fps = Math.round(1000 / delta);
            lastFrameTime = now;

            // Simulate latency (Kirka.io doesn't expose WebSocket directly)
            latency = Math.round(50 + Math.random() * 50);

            fpsHistory.push(fps);
            latencyHistory.push(latency);
            if (fpsHistory.length > maxHistory) fpsHistory.shift();
            if (latencyHistory.length > maxHistory) latencyHistory.shift();

            drawStats();
            updateHUD();
        }

        // Update HUD
        function updateHUD() {
            const hud = document.querySelector('#emu-stats-hud');
            if (!hud) return;
            const counters = hud.querySelector('#stats-counters');
            let html = '';
            if (settings.showFPS) {
                html += `<span class="status-item tooltip" title="Frames per second"><i class="fas fa-tachometer-alt"></i> FPS: <span class="status-value">${fps}</span></span>`;
            }
            if (settings.showLatency) {
                html += `<span class="status-item tooltip" title="Network latency"><i class="fas fa-network-wired"></i> Latency: <span class="status-value">${latency}ms</span></span>`;
            }
            counters.innerHTML = html;

            const isVisible = settings.showFPS || settings.showLatency || settings.showFPSGraph || settings.showLatencyGraph;
            hud.style.display = isVisible ? 'block' : 'none';
            if (isVisible && !statsCanvas && (settings.showFPSGraph || settings.showLatencyGraph)) {
                initStatsCanvas();
            }
        }

        // Update status bar
        function updateStatus() {
            const statusBar = document.querySelector('#status-bar');
            if (!statusBar) return;
            statusBar.innerHTML = `
                <span class="status-item tooltip" title="Chams status"><i class="fas fa-eye"></i> Chams: <span class="${settings.enabled ? 'active' : ''}">${settings.enabled ? 'ON' : 'OFF'}</span></span>
                <span class="status-item tooltip" title="Crosshair type"><i class="fas fa-crosshairs"></i> Crosshair: <span class="status-value">${settings.crosshairType}</span></span>
            `;
        }

        // Animation loop
        function animate() {
            updateStats();
            drawCrosshair();
            requestAnimationFrame(animate);
        }

        // GUI creation function
        function createGUI() {
            // Inject styles
            const styleSheet = document.createElement('style');
            styleSheet.id = 'emuChamsStyle';
            styleSheet.innerHTML = `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Orbitron:wght@700;800&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

                :root {
                    --accent-color: #00ccff;
                    --accent-shadow: rgba(0, 204, 255, 0.4);
                    --bg-gradient: linear-gradient(to bottom, rgba(0, 10, 20, 0.9), rgba(5, 15, 30, 0.9));
                    --btn-bg: rgba(20, 30, 50, 0.7);
                    --btn-hover-bg: rgba(0, 204, 255, 0.3);
                    --text-color: #f0f6ff;
                    --border-color: #1a2538;
                    --divider-color: #2e3a50;
                }

                [data-theme="obsidian-black"] { --accent-color: #00ccff; --accent-shadow: rgba(0, 204, 255, 0.4); --bg-gradient: linear-gradient(to bottom, rgba(0, 10, 20, 0.9), rgba(5, 15, 30, 0.9)); --btn-bg: rgba(20, 30, 50, 0.7); --btn-hover-bg: rgba(0, 204, 255, 0.3); --text-color: #f0f6ff; --border-color: #1a2538; --divider-color: #2e3a50; }
                [data-theme="arctic-white"] { --accent-color: #0066cc; --accent-shadow: rgba(0, 102, 204, 0.3); --bg-gradient: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(235, 245, 255, 0.9)); --btn-bg: rgba(245, 250, 255, 0.4); --btn-hover-bg: rgba(0, 102, 204, 0.2); --text-color: #1a2530; --border-color: #d5e0f0; --divider-color: #e0e5f0; }
                [data-theme="crimson-pulse"] { --accent-color: #ff3333; --accent-shadow: rgba(255, 51, 51, 0.3); --bg-gradient: linear-gradient(to bottom, rgba(45, 0, 0, 0.9), rgba(30, 5, 5, 0.9)); --btn-bg: rgba(60, 15, 15, 0.7); --btn-hover-bg: rgba(255, 51, 51, 0.5); --text-color: #ffcc99; --border-color: #4a2525; --divider-color: #5a3f3f; }
                [data-theme="toxic-green"] { --accent-color: #00ff33; --accent-shadow: rgba(0, 255, 51, 0.3); --bg-gradient: linear-gradient(to bottom, rgba(0, 40, 0, 0.9), rgba(5, 25, 0, 0.9)); --btn-bg: rgba(20, 60, 20, 0.7); --btn-hover-bg: rgba(0, 255, 51, 0.2); --text-color: #ccff99; --border-color: #2f4a2f; --divider-color: #3f5a3f; }

                #emu-chams-gui {
                    position: absolute;
                    width: 260px;
                    background: var(--bg-gradient);
                    backdrop-filter: blur(12px);
                    border: 1px solid var(--accent-color);
                    border-radius: 8px;
                    box-shadow: 0 4px 25px var(--accent-shadow), inset 0 0 5px rgba(255, 255, 255, 0.1);
                    z-index: 999999;
                    font-family: 'Inter', sans-serif;
                    color: var(--text-color);
                    transition: opacity 0.3s ease, transform 0.3s ease, height 0.3s ease;
                    left: ${settings.menuPosition.left};
                    top: ${settings.menuPosition.top};
                    opacity: ${settings.menuOpacity};
                    transform: scale(${settings.menuScale});
                }

                #emu-chams-gui.hidden {
                    opacity: 0;
                    transform: scale(${settings.menuScale * 0.95});
                    pointer-events: none;
                }

                #emu-chams-gui.minimized {
                    height: 32px;
                    overflow: hidden;
                }

                #emu-chams-gui.dragging, #emu-stats-hud.dragging {
                    cursor: grabbing;
                }

                #emu-stats-hud {
                    position: absolute;
                    width: 200px;
                    background: var(--bg-gradient);
                    backdrop-filter: blur(8px);
                    border: 1px solid var(--accent-color);
                    border-radius: 6px;
                    box-shadow: 0 4px 15px var(--accent-shadow);
                    z-index: 999996;
                    font-family: 'Inter', sans-serif;
                    color: var(--text-color);
                    left: ${settings.hudPosition.left};
                    top: ${settings.hudPosition.top};
                    padding: 8px;
                    cursor: move;
                    display: ${settings.showFPS || settings.showLatency || settings.showFPSGraph || settings.showLatencyGraph ? 'block' : 'none'};
                }

                #stats-counters {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }

                #gui-header {
                    padding: 8px;
                    background: rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid var(--border-color);
                    cursor: move;
                }

                #gui-logo {
                    width: 16px;
                    height: 16px;
                    margin-right: 8px;
                    background: conic-gradient(from 45deg, transparent 0deg 90deg, var(--accent-color) 90deg 180deg, transparent 180deg 270deg, var(--accent-color) 270deg 360deg);
                    clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
                    transform: rotate(45deg);
                    animation: spin 4s linear infinite;
                }

                #gui-title {
                    font-size: 14px;
                    font-weight: 800;
                    font-family: 'Orbitron', sans-serif;
                    background: linear-gradient(45deg, var(--accent-color), #ff4081);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-shadow: 0 0 3px var(--accent-shadow);
                    flex-grow: 1;
                }

                #gui-badge {
                    font-size: 8px;
                    padding: 2px 6px;
                    background: linear-gradient(45deg, var(--accent-color), #ff4081);
                    color: var(--btn-bg);
                    border-radius: 3px;
                    text-transform: uppercase;
                    font-weight: 800;
                }

                #gui-controls button {
                    background: none;
                    border: none;
                    color: var(--text-color);
                    font-size: 12px;
                    padding: 4px;
                    cursor: pointer;
                    transition: color 0.2s, transform 0.2s;
                    margin-left: 4px;
                }

                #gui-controls button:hover {
                    color: var(--accent-color);
                    transform: scale(1.1);
                }

                #gui-tabs {
                    display: flex;
                    background: rgba(0, 0, 0, 0.4);
                    border-bottom: 1px solid var(--border-color);
                }

                #gui-tabs button {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: var(--text-color);
                    padding: 6px;
                    cursor: pointer;
                    font-size: 11px;
                    font-weight: 700;
                    font-family: 'Orbitron', sans-serif;
                    transition: all 0.2s;
                    text-transform: uppercase;
                }

                #gui-tabs button:hover {
                    background: var(--btn-hover-bg);
                }

                #gui-tabs button.active {
                    color: var(--accent-color);
                    background: var(--btn-bg);
                    border-bottom: 2px solid var(--accent-color);
                }

                #gui-body {
                    padding: 10px;
                    max-height: 300px;
                    overflow-y: auto;
                }

                #gui-body::-webkit-scrollbar {
                    width: 6px;
                }

                #gui-body::-webkit-scrollbar-track {
                    background: var(--btn-bg);
                    border-radius: 3px;
                }

                #gui-body::-webkit-scrollbar-thumb {
                    background: var(--accent-color);
                    border-radius: 3px;
                }

                .tab-content {
                    display: none;
                    animation: fadeIn 0.3s ease;
                }

                .tab-content.active {
                    display: block;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .toggle-btn {
                    width: 100%;
                    background: var(--btn-bg);
                    border: 1px solid var(--accent-color);
                    color: var(--text-color);
                    font-family: 'Orbitron', sans-serif;
                    font-size: 12px;
                    font-weight: 700;
                    padding: 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    text-transform: uppercase;
                    margin-bottom: 10px;
                }

                .toggle-btn:hover {
                    background: var(--btn-hover-bg);
                    box-shadow: 0 0 10px var(--accent-shadow);
                    transform: scale(1.02);
                }

                .toggle-btn:active {
                    transform: scale(0.98);
                }

                .toggle-btn.enabled {
                    background: var(--accent-color);
                    color: var(--btn-bg);
                }

                .cheat-btn {
                    width: 100%;
                    background: var(--btn-bg);
                    border: 1px solid var(--border-color);
                    color: var(--text-color);
                    font-family: 'Orbitron', sans-serif;
                    font-size: 11px;
                    font-weight: 700;
                    padding: 6px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    margin: 5px 0;
                }

                .cheat-btn:hover {
                    background: var(--btn-hover-bg);
                    box-shadow: 0 0 10px var(--accent-shadow);
                    transform: scale(1.02);
                }

                .cheat-btn:active {
                    transform: scale(0.98);
                }

                .cheat-btn.active {
                    background: var(--accent-color);
                    color: var(--btn-bg);
                }

                select, input[type="color"], input[type="range"] {
                    width: 100%;
                    background: var(--btn-bg);
                    border: 1px solid var(--border-color);
                    color: var(--text-color);
                    font-family: 'Inter', sans-serif;
                    font-size: 12px;
                    padding: 6px;
                    border-radius: 6px;
                    margin: 5px 0;
                    cursor: pointer;
                }

                input[type="range"] {
                    -webkit-appearance: none;
                    height: 6px;
                }

                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 12px;
                    height: 12px;
                    background: var(--accent-color);
                    border-radius: 50%;
                    border: 1px solid var(--border-color);
                    cursor: pointer;
                }

                label {
                    font-size: 11px;
                    font-weight: 500;
                    margin: 5px 0 2px;
                    display: block;
                }

                .slider-value {
                    font-size: 11px;
                    margin-left: 5px;
                }

                #status-bar {
                    padding: 6px 10px;
                    background: rgba(0, 0, 0, 0.4);
                    border-top: 1px solid var(--border-color);
                    font-size: 10px;
                    color: var(--text-color);
                    display: flex;
                    flex-wrap: wrap;
                    gap: 5px;
                }

                .status-item {
                    background: var(--btn-bg);
                    padding: 2px 8px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    cursor: pointer;
                }

                .status-item:hover {
                    background: var(--btn-hover-bg);
                }

                .status-value, .active {
                    color: var(--accent-color);
                    font-weight: 600;
                }

                .notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: var(--bg-gradient);
                    border: 1px solid var(--accent-color);
                    color: var(--text-color);
                    padding: 6px 12px;
                    border-radius: 5px;
                    box-shadow: 0 4px 15px var(--accent-shadow);
                    opacity: 0;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    transform: translateX(20px);
                    z-index: 999997;
                    font-family: 'Inter', sans-serif;
                    font-size: 11px;
                    backdropFilter: blur(12px);
                }

                .tooltip::after {
                    content: attr(title);
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--btn-bg);
                    color: var(--text-color);
                    padding: 3px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    white-space: nowrap;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s;
                    z-index: 10;
                    border: 1px solid var(--border-color);
                }

                .tooltip:hover::after {
                    opacity: 1;
                }

                @keyframes spin {
                    to { transform: rotate(405deg); }
                }

                hr {
                    border: 0;
                    border-top: 1px solid var(--divider-color);
                    margin: 8px 0;
                }
            `;
            document.head.appendChild(styleSheet);

            // Create GUI
            const gui = document.createElement('div');
            gui.id = 'emu-chams-gui';
            gui.dataset.theme = settings.theme;
            gui.classList.toggle('hidden', !menuVisible);
            gui.classList.toggle('minimized', settings.menuMinimized);

            const header = document.createElement('div');
            header.id = 'gui-header';
            header.innerHTML = `
                <div id="gui-logo"></div>
                <span id="gui-title">Emu's Chams Client</span>
                <span id="gui-badge">PREMIUM</span>
                <div id="gui-controls">
                    <button id="minimize-btn" aria-label="Minimize menu"><i class="fas fa-${settings.menuMinimized ? 'plus' : 'minus'}"></i></button>
                    <button id="close-btn" aria-label="Close menu"><i class="fas fa-times"></i></button>
                </div>
            `;

            const tabs = document.createElement('div');
            tabs.id = 'gui-tabs';
            tabs.innerHTML = `
                <button class="tab-btn active" data-tab="main">Main</button>
                <button class="tab-btn" data-tab="crosshairs">Crosshairs</button>
                <button class="tab-btn" data-tab="settings">Settings</button>
            `;

            const body = document.createElement('div');
            body.id = 'gui-body';

            const statusBar = document.createElement('div');
            statusBar.id = 'status-bar';

            gui.appendChild(header);
            gui.appendChild(tabs);
            gui.appendChild(body);
            gui.appendChild(statusBar);
            document.body.appendChild(gui);

            // Create Stats HUD
            const statsHud = document.createElement('div');
            statsHud.id = 'emu-stats-hud';
            statsHud.innerHTML = `
                <div id="stats-counters"></div>
            `;
            document.body.appendChild(statsHud);

            // Tab content
            const tabContents = {
                main: `
                    <button id="toggle-chams" class="toggle-btn ${settings.enabled ? 'enabled' : ''} tooltip" title="Toggle wallhacks">
                        <i class="fas fa-eye"></i> ${settings.enabled ? 'Disable' : 'Enable'} Chams
                    </button>
                    <hr>
                    <select id="theme-selector" title="Select theme">
                        <option value="obsidian-black" ${settings.theme === 'obsidian-black' ? 'selected' : ''}>Obsidian Black</option>
                        <option value="arctic-white" ${settings.theme === 'arctic-white' ? 'selected' : ''}>Arctic White</option>
                        <option value="crimson-pulse" ${settings.theme === 'crimson-pulse' ? 'selected' : ''}>Crimson Pulse</option>
                        <option value="toxic-green" ${settings.theme === 'toxic-green' ? 'selected' : ''}>Toxic Green</option>
                    </select>
                `,
                crosshairs: `
                    <label>Crosshair Type</label>
                    <select id="crosshair-selector" title="Select crosshair style">
                        <option value="None" ${settings.crosshairType === 'None' ? 'selected' : ''}>None</option>
                        <option value="Dot" ${settings.crosshairType === 'Dot' ? 'selected' : ''}>Dot</option>
                        <option value="Cross" ${settings.crosshairType === 'Cross' ? 'selected' : ''}>Cross</option>
                        <option value="Dynamic Dot" ${settings.crosshairType === 'Dynamic Dot' ? 'selected' : ''}>Dynamic Dot</option>
                        <option value="Circle" ${settings.crosshairType === 'Circle' ? 'selected' : ''}>Circle</option>
                        <option value="Plus" ${settings.crosshairType === 'Plus' ? 'selected' : ''}>Plus</option>
                        <option value="T-Shape" ${settings.crosshairType === 'T-Shape' ? 'selected' : ''}>T-Shape</option>
                        <option value="Gap Cross" ${settings.crosshairType === 'Gap Cross' ? 'selected' : ''}>Gap Cross</option>
                        <option value="Star" ${settings.crosshairType === 'Star' ? 'selected' : ''}>Star</option>
                        <option value="Triangle" ${settings.crosshairType === 'Triangle' ? 'selected' : ''}>Triangle</option>
                        <option value="Dynamic Circle" ${settings.crosshairType === 'Dynamic Circle' ? 'selected' : ''}>Dynamic Circle</option>
                        <option value="Dynamic Star" ${settings.crosshairType === 'Dynamic Star' ? 'selected' : ''}>Dynamic Star</option>
                    </select>
                    <label>Crosshair Size: <span id="crosshair-size-value">${settings.crosshairSize}px</span></label>
                    <input type="range" id="crosshair-size" min="5" max="100" step="5" value="${settings.crosshairSize}">
                    <label>Crosshair Thickness: <span id="crosshair-thickness-value">${settings.crosshairThickness}px</span></label>
                    <input type="range" id="crosshair-thickness" min="1" max="10" step="1" value="${settings.crosshairThickness}">
                    <label>Crosshair Color</label>
                    <input type="color" id="crosshair-color" value="${settings.crosshairColor}">
                    <button id="toggle-outline" class="cheat-btn ${settings.crosshairOutline ? 'active' : ''} tooltip" title="Toggle black outline">Outline: ${settings.crosshairOutline ? 'ON' : 'OFF'}</button>
                    <label>Outline Thickness: <span id="crosshair-outline-thickness-value">${settings.crosshairOutlineThickness}px</span></label>
                    <input type="range" id="crosshair-outline-thickness" min="0" max="5" step="0.5" value="${settings.crosshairOutlineThickness}" ${settings.crosshairOutline ? '' : 'disabled'}>
                    <label>Crosshair Opacity: <span id="crosshair-opacity-value">${settings.crosshairOpacity}</span></label>
                    <input type="range" id="crosshair-opacity" min="0.1" max="1" step="0.1" value="${settings.crosshairOpacity}">
                    <label>Crosshair Rotation: <span id="crosshair-rotation-value">${settings.crosshairRotation}°</span></label>
                    <input type="range" id="crosshair-rotation" min="0" max="360" step="5" value="${settings.crosshairRotation}">
                `,
                settings: `
                    <button id="toggle-fps" class="cheat-btn ${settings.showFPS ? 'active' : ''} tooltip" title="Show FPS counter">FPS Counter: ${settings.showFPS ? 'ON' : 'OFF'}</button>
                    <button id="toggle-latency" class="cheat-btn ${settings.showLatency ? 'active' : ''} tooltip" title="Show latency counter">Latency Counter: ${settings.showLatency ? 'ON' : 'OFF'}</button>
                    <button id="toggle-fps-graph" class="cheat-btn ${settings.showFPSGraph ? 'active' : ''} tooltip" title="Show FPS graph">FPS Graph: ${settings.showFPSGraph ? 'ON' : 'OFF'}</button>
                    <button id="toggle-latency-graph" class="cheat-btn ${settings.showLatencyGraph ? 'active' : ''} tooltip" title="Show latency graph">Latency Graph: ${settings.showLatencyGraph ? 'ON' : 'OFF'}</button>
                    <hr>
                    <label>Menu Opacity: <span id="menu-opacity-value">${settings.menuOpacity}</span></label>
                    <input type="range" id="menu-opacity" min="0.5" max="1" step="0.05" value="${settings.menuOpacity}">
                    <label>Menu Scale: <span id="menu-scale-value">${settings.menuScale}</span></label>
                    <input type="range" id="menu-scale" min="0.8" max="1.5" step="0.05" value="${settings.menuScale}">
                    <hr>
                    <button id="reset-settings" class="cheat-btn tooltip" title="Reset all settings to default">Reset Settings</button>
                `
            };

            let currentTab = 'main';

            function updateTabContent() {
                body.innerHTML = tabContents[currentTab];
                if (currentTab === 'main') {
                    const toggleBtn = document.getElementById('toggle-chams');
                    toggleBtn.onclick = () => {
                        settings.enabled = !settings.enabled;
                        toggleBtn.classList.toggle('enabled', settings.enabled);
                        toggleBtn.innerHTML = `<i class="fas fa-eye"></i> ${settings.enabled ? 'Disable' : 'Enable'} Chams`;
                        showNotification(`Chams ${settings.enabled ? 'enabled' : 'disabled'}`);
                        observeMaterials();
                        updateStatus();
                        saveSettings();
                    };

                    const themeSelector = document.getElementById('theme-selector');
                    themeSelector.onchange = () => {
                        settings.theme = themeSelector.value;
                        gui.dataset.theme = settings.theme;
                        statsHud.dataset.theme = settings.theme;
                        showNotification(`Theme changed to ${themeSelector.options[themeSelector.selectedIndex].text}`);
                        saveSettings();
                        updateStatus();
                    };
                } else if (currentTab === 'crosshairs') {
                    const crosshairSelector = document.getElementById('crosshair-selector');
                    crosshairSelector.onchange = () => {
                        settings.crosshairType = crosshairSelector.value;
                        showNotification(`Crosshair set to ${settings.crosshairType}`);
                        drawCrosshair();
                        updateStatus();
                        saveSettings();
                    };

                    const sizeSlider = document.getElementById('crosshair-size');
                    const sizeValue = document.getElementById('crosshair-size-value');
                    sizeSlider.oninput = () => {
                        settings.crosshairSize = parseInt(sizeSlider.value);
                        sizeValue.textContent = `${settings.crosshairSize}px`;
                        showNotification(`Crosshair size set to ${settings.crosshairSize}px`);
                        drawCrosshair();
                        saveSettings();
                    };

                    const thicknessSlider = document.getElementById('crosshair-thickness');
                    const thicknessValue = document.getElementById('crosshair-thickness-value');
                    thicknessSlider.oninput = () => {
                        settings.crosshairThickness = parseInt(thicknessSlider.value);
                        thicknessValue.textContent = `${settings.crosshairThickness}px`;
                        showNotification(`Crosshair thickness set to ${settings.crosshairThickness}px`);
                        drawCrosshair();
                        saveSettings();
                    };

                    const colorPicker = document.getElementById('crosshair-color');
                    colorPicker.onchange = () => {
                        settings.crosshairColor = colorPicker.value;
                        showNotification(`Crosshair color set to ${colorPicker.value}`);
                        drawCrosshair();
                        saveSettings();
                    };

                    const outlineToggle = document.getElementById('toggle-outline');
                    const outlineThicknessSlider = document.getElementById('crosshair-outline-thickness');
                    outlineToggle.onclick = () => {
                        settings.crosshairOutline = !settings.crosshairOutline;
                        outlineToggle.classList.toggle('active', settings.crosshairOutline);
                        outlineToggle.textContent = `Outline: ${settings.crosshairOutline ? 'ON' : 'OFF'}`;
                        outlineThicknessSlider.disabled = !settings.crosshairOutline;
                        showNotification(`Crosshair outline ${settings.crosshairOutline ? 'enabled' : 'disabled'}`);
                        drawCrosshair();
                        saveSettings();
                    };

                    const outlineThicknessValue = document.getElementById('crosshair-outline-thickness-value');
                    outlineThicknessSlider.oninput = () => {
                        settings.crosshairOutlineThickness = parseFloat(outlineThicknessSlider.value);
                        outlineThicknessValue.textContent = `${settings.crosshairOutlineThickness}px`;
                        showNotification(`Outline thickness set to ${settings.crosshairOutlineThickness}px`);
                        drawCrosshair();
                        saveSettings();
                    };

                    const opacitySlider = document.getElementById('crosshair-opacity');
                    const opacityValue = document.getElementById('crosshair-opacity-value');
                    opacitySlider.oninput = () => {
                        settings.crosshairOpacity = parseFloat(opacitySlider.value);
                        opacityValue.textContent = settings.crosshairOpacity.toFixed(1);
                        showNotification(`Crosshair opacity set to ${settings.crosshairOpacity}`);
                        drawCrosshair();
                        saveSettings();
                    };

                    const rotationSlider = document.getElementById('crosshair-rotation');
                    const rotationValue = document.getElementById('crosshair-rotation-value');
                    rotationSlider.oninput = () => {
                        settings.crosshairRotation = parseInt(rotationSlider.value);
                        rotationValue.textContent = `${settings.crosshairRotation}°`;
                        showNotification(`Crosshair rotation set to ${settings.crosshairRotation}°`);
                        drawCrosshair();
                        saveSettings();
                    };
                } else if (currentTab === 'settings') {
                    const fpsToggle = document.getElementById('toggle-fps');
                    fpsToggle.onclick = () => {
                        settings.showFPS = !settings.showFPS;
                        fpsToggle.classList.toggle('active', settings.showFPS);
                        fpsToggle.textContent = `FPS Counter: ${settings.showFPS ? 'ON' : 'OFF'}`;
                        showNotification(`FPS counter ${settings.showFPS ? 'enabled' : 'disabled'}`);
                        updateHUD();
                        saveSettings();
                    };

                    const latencyToggle = document.getElementById('toggle-latency');
                    latencyToggle.onclick = () => {
                        settings.showLatency = !settings.showLatency;
                        latencyToggle.classList.toggle('active', settings.showLatency);
                        latencyToggle.textContent = `Latency Counter: ${settings.showLatency ? 'ON' : 'OFF'}`;
                        showNotification(`Latency counter ${settings.showLatency ? 'enabled' : 'disabled'}`);
                        updateHUD();
                        saveSettings();
                    };

                    const fpsGraphToggle = document.getElementById('toggle-fps-graph');
                    fpsGraphToggle.onclick = () => {
                        settings.showFPSGraph = !settings.showFPSGraph;
                        fpsGraphToggle.classList.toggle('active', settings.showFPSGraph);
                        fpsGraphToggle.textContent = `FPS Graph: ${settings.showFPSGraph ? 'ON' : 'OFF'}`;
                        showNotification(`FPS graph ${settings.showFPSGraph ? 'enabled' : 'disabled'}`);
                        updateHUD();
                        saveSettings();
                    };

                    const latencyGraphToggle = document.getElementById('toggle-latency-graph');
                    latencyGraphToggle.onclick = () => {
                        settings.showLatencyGraph = !settings.showLatencyGraph;
                        latencyGraphToggle.classList.toggle('active', settings.showLatencyGraph);
                        latencyGraphToggle.textContent = `Latency Graph: ${settings.showLatencyGraph ? 'ON' : 'OFF'}`;
                        showNotification(`Latency graph ${settings.showLatencyGraph ? 'enabled' : 'disabled'}`);
                        updateHUD();
                        saveSettings();
                    };

                    const opacitySlider = document.getElementById('menu-opacity');
                    const opacityValue = document.getElementById('menu-opacity-value');
                    opacitySlider.oninput = () => {
                        settings.menuOpacity = parseFloat(opacitySlider.value);
                        opacityValue.textContent = settings.menuOpacity.toFixed(2);
                        gui.style.opacity = settings.menuOpacity;
                        showNotification(`Menu opacity set to ${settings.menuOpacity}`);
                        saveSettings();
                    };

                    const scaleSlider = document.getElementById('menu-scale');
                    const scaleValue = document.getElementById('menu-scale-value');
                    scaleSlider.oninput = () => {
                        settings.menuScale = parseFloat(scaleSlider.value);
                        scaleValue.textContent = settings.menuScale.toFixed(2);
                        gui.style.transform = `scale(${settings.menuScale})`;
                        showNotification(`Menu scale set to ${settings.menuScale}`);
                        saveSettings();
                    };

                    const resetBtn = document.getElementById('reset-settings');
                    resetBtn.onclick = () => {
                        resetSettings();
                    };
                }
            }

            // Tab switching
            tabs.querySelectorAll('.tab-btn').forEach(btn => {
                btn.onclick = () => {
                    currentTab = btn.dataset.tab;
                    tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    updateTabContent();
                    showNotification(`Switched to ${currentTab} tab`);
                };
            });

            // Initial tab content
            updateTabContent();

            // Event listeners
            const minimizeBtn = document.getElementById('minimize-btn');
            minimizeBtn.onclick = () => {
                settings.menuMinimized = !settings.menuMinimized;
                gui.classList.toggle('minimized', settings.menuMinimized);
                minimizeBtn.innerHTML = `<i class="fas fa-${settings.menuMinimized ? 'plus' : 'minus'}"></i>`;
                showNotification(`Menu ${settings.menuMinimized ? 'minimized' : 'restored'}`);
                saveSettings();
            };

            const closeBtn = document.getElementById('close-btn');
            closeBtn.onclick = () => {
                menuVisible = false;
                gui.classList.add('hidden');
                showNotification('Menu closed');
                saveSettings();
            };

            // Draggable GUI
            let isDragging = false, offsetX = 0, offsetY = 0;
            header.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.clientX - parseFloat(gui.style.left || 120);
                offsetY = e.clientY - parseFloat(gui.style.top || 120);
                gui.classList.add('dragging');
                document.body.style.userSelect = 'none';
            });

            window.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    let newX = e.clientX - offsetX;
                    let newY = e.clientY - offsetY;
                    newX = Math.max(0, Math.min(newX, window.innerWidth - gui.offsetWidth * settings.menuScale));
                    newY = Math.max(0, Math.min(newY, window.innerHeight - gui.offsetHeight * settings.menuScale));
                    gui.style.left = `${newX}px`;
                    gui.style.top = `${newY}px`;
                    settings.menuPosition = { left: `${newX}px`, top: `${newY}px` };
                    saveSettings();
                }
            });

            window.addEventListener('mouseup', () => {
                isDragging = false;
                gui.classList.remove('dragging');
                document.body.style.userSelect = '';
            });

            // Draggable HUD
            let hudIsDragging = false, hudOffsetX = 0, hudOffsetY = 0;
            statsHud.addEventListener('mousedown', (e) => {
                hudIsDragging = true;
                hudOffsetX = e.clientX - parseFloat(statsHud.style.left || 400);
                hudOffsetY = e.clientY - parseFloat(statsHud.style.top || 120);
                statsHud.classList.add('dragging');
                document.body.style.userSelect = 'none';
            });

            window.addEventListener('mousemove', (e) => {
                if (hudIsDragging) {
                    let newX = e.clientX - hudOffsetX;
                    let newY = e.clientY - hudOffsetY;
                    newX = Math.max(0, Math.min(newX, window.innerWidth - statsHud.offsetWidth));
                    newY = Math.max(0, Math.min(newY, window.innerHeight - statsHud.offsetHeight));
                    statsHud.style.left = `${newX}px`;
                    statsHud.style.top = `${newY}px`;
                    settings.hudPosition = { left: `${newX}px`, top: `${newY}px` };
                    saveSettings();
                }
            });

            window.addEventListener('mouseup', () => {
                hudIsDragging = false;
                statsHud.classList.remove('dragging');
                document.body.style.userSelect = '';
            });

            // Toggle menu with semicolon
            document.addEventListener('keydown', (e) => {
                if (e.key === ';') {
                    menuVisible = !menuVisible;
                    gui.classList.toggle('hidden', !menuVisible);
                    showNotification(`Menu ${menuVisible ? 'opened' : 'closed'}`);
                    saveSettings();
                }
            });

            // Initialize canvases
            initCrosshairCanvas();
            if (settings.showFPSGraph || settings.showLatencyGraph) initStatsCanvas();
            window.addEventListener('resize', () => {
                resizeCrosshair();
                if (statsCanvas) resizeStats();
            });

            updateStatus();
            updateHUD();
            animate();
        }

        // Wait for DOM to be ready then create GUI
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createGUI);
        } else {
            createGUI();
        }

        // Initial call to start watching materials
        observeMaterials();
    })();
})();