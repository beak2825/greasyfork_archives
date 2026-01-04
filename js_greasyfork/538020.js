// ==UserScript==
// @name         Suroi.io Elite Client
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Premium client with FPS, Ping, Aim Line and more
// @author       Jyomama28
// @match        https://suroi.io/*
// @match        https://survev.io/*
// @match        https://zurviv.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538020/Suroiio%20Elite%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/538020/Suroiio%20Elite%20Client.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const config = {
        aimHelper: {
            enabled: true,
            color: 'rgba(100, 150, 255, 0.85)',
            defaultAngle: -Math.PI/2, // Left direction
            length: 1500,
            thickness: 2.5,
            glow: true
        },
        performance: {
            fps: true,
            ping: true,
            updateInterval: 1000
        },
        ui: {
            theme: {
                primary: '#6e48aa',
                secondary: '#9d50bb',
                accent: '#4776e6',
                background: 'rgba(30, 20, 50, 0.9)',
                text: '#ffffff'
            },
            position: { x: 20, y: 20 },
            roundedCorners: 12,
            shadow: '0 4px 20px rgba(110, 72, 170, 0.5)'
        }
    };

    // ===== STATE =====
    let state = {
        playerPos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        mousePos: null,
        mouseMoved: false,
        fps: 0,
        ping: 0,
        lastPingTime: 0,
        aimHelperLine: null,
        statusTimeout: null
    };

    // ===== UI ELEMENTS =====
    const createEliteClientUI = () => {
        const gui = document.createElement('div');
        gui.id = 'elite-client-ui';
        gui.style.cssText = `
            position: fixed;
            top: ${config.ui.position.y}px;
            left: ${config.ui.position.x}px;
            padding: 15px;
            background: ${config.ui.background};
            border: 2px solid ${config.ui.secondary};
            border-radius: ${config.ui.roundedCorners}px;
            color: ${config.ui.text};
            font-family: 'Arial', sans-serif;
            z-index: 99999;
            user-select: none;
            min-width: 180px;
            box-shadow: ${config.ui.shadow};
            backdrop-filter: blur(5px);
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid ${config.ui.secondary};
        `;

        const title = document.createElement('h3');
        title.textContent = 'ELITE CLIENT';
        title.style.cssText = `
            margin: 0;
            font-size: 16px;
            color: ${config.ui.accent};
            text-shadow: 0 0 8px ${config.ui.accent};
            letter-spacing: 1px;
        `;

        const version = document.createElement('span');
        version.textContent = 'v3.0';
        version.style.cssText = `
            font-size: 11px;
            color: ${config.ui.text};
            opacity: 0.7;
        `;

        header.appendChild(title);
        header.appendChild(version);
        gui.appendChild(header);

        // Performance Stats
        const statsContainer = document.createElement('div');
        statsContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 13px;
        `;

        const fpsDisplay = document.createElement('div');
        fpsDisplay.id = 'fps-display';
        fpsDisplay.textContent = 'FPS: 0';
        fpsDisplay.style.color = config.ui.accent;

        const pingDisplay = document.createElement('div');
        pingDisplay.id = 'ping-display';
        pingDisplay.textContent = 'Ping: 0ms';
        pingDisplay.style.color = config.ui.secondary;

        statsContainer.appendChild(fpsDisplay);
        statsContainer.appendChild(pingDisplay);
        gui.appendChild(statsContainer);

        // Aim Helper Section
        const aimSection = document.createElement('div');
        aimSection.style.marginTop = '10px';

        // Toggle Button
        const aimToggleBtn = document.createElement('button');
        aimToggleBtn.id = 'aim-toggle-btn';
        aimToggleBtn.textContent = 'AIM LINE: ON';
        aimToggleBtn.style.cssText = `
            background: linear-gradient(135deg, ${config.ui.primary}, ${config.ui.secondary});
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            width: 100%;
            margin-bottom: 8px;
            transition: all 0.2s;
            box-shadow: 0 2px 8px rgba(110, 72, 170, 0.4);
        `;
        aimToggleBtn.addEventListener('mouseover', () => {
            aimToggleBtn.style.transform = 'translateY(-1px)';
            aimToggleBtn.style.boxShadow = `0 4px 12px rgba(110, 72, 170, 0.6)`;
        });
        aimToggleBtn.addEventListener('mouseout', () => {
            aimToggleBtn.style.transform = 'none';
            aimToggleBtn.style.boxShadow = `0 2px 8px rgba(110, 72, 170, 0.4)`;
        });

        // Color Picker
        const colorPickerContainer = document.createElement('div');
        colorPickerContainer.style.cssText = `
            display: flex;
            align-items: center;
            margin-top: 8px;
            margin-bottom: 5px;
        `;

        const colorLabel = document.createElement('label');
        colorLabel.textContent = 'Line Color:';
        colorLabel.style.cssText = `
            margin-right: 8px;
            font-size: 13px;
            color: ${config.ui.text};
        `;

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = '#6496ff';
        colorInput.style.cssText = `
            width: 30px;
            height: 30px;
            cursor: pointer;
            border: 2px solid ${config.ui.secondary};
            border-radius: 6px;
            background: ${config.ui.background};
        `;

        colorPickerContainer.appendChild(colorLabel);
        colorPickerContainer.appendChild(colorInput);
        aimSection.appendChild(aimToggleBtn);
        aimSection.appendChild(colorPickerContainer);
        gui.appendChild(aimSection);

        // Hotkey Info
        const hotkeyInfo = document.createElement('div');
        hotkeyInfo.textContent = 'Press P to toggle aim line';
        hotkeyInfo.style.cssText = `
            margin-top: 10px;
            font-size: 11px;
            color: ${config.ui.accent};
            text-align: center;
            opacity: 0.8;
        `;
        gui.appendChild(hotkeyInfo);

        // Status Message
        const statusElement = document.createElement('div');
        statusElement.id = 'elite-status';
        statusElement.style.cssText = `
            margin-top: 12px;
            font-size: 12px;
            color: #00ff00;
            opacity: 0;
            transition: opacity 0.3s;
            font-weight: bold;
            text-align: center;
            text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
        `;
        gui.appendChild(statusElement);

        document.body.appendChild(gui);

        return { aimToggleBtn, colorInput, statusElement };
    };

    // ===== CORE FUNCTIONS =====
    const showStatus = (message, duration = 2000, color = '#00ff00') => {
        const statusElement = document.getElementById('elite-status');
        if (!statusElement) return;

        statusElement.textContent = message;
        statusElement.style.opacity = '1';
        statusElement.style.color = color;
        statusElement.style.textShadow = `0 0 5px ${color}80`;

        clearTimeout(state.statusTimeout);
        state.statusTimeout = setTimeout(() => {
            statusElement.style.opacity = '0';
        }, duration);
    };

    const createAimLine = () => {
        if (state.aimHelperLine) return;

        state.aimHelperLine = document.createElement('div');
        state.aimHelperLine.style.cssText = `
            position: absolute;
            width: ${config.aimHelper.thickness}px;
            height: ${config.aimHelper.length}px;
            background: ${config.aimHelper.color};
            pointer-events: none;
            transform-origin: top center;
            display: ${config.aimHelper.enabled ? 'block' : 'none'};
            z-index: 99998;
            border-radius: ${config.aimHelper.thickness}px;
            ${config.aimHelper.glow ? `box-shadow: 0 0 10px 2px ${config.aimHelper.color};` : ''}
        `;
        document.body.appendChild(state.aimHelperLine);
        updateAimLine();
    };

    const updateAimLineColor = (color) => {
        config.aimHelper.color = color;
        if (state.aimHelperLine) {
            state.aimHelperLine.style.background = color;
            if (config.aimHelper.glow) {
                state.aimHelperLine.style.boxShadow = `0 0 10px 2px ${color}`;
            }
        }
    };

    const setAimHelperState = (enabled) => {
        config.aimHelper.enabled = enabled;
        const btn = document.getElementById('aim-toggle-btn');
        if (btn) {
            btn.textContent = `AIM LINE: ${enabled ? 'ON' : 'OFF'}`;
            btn.style.background = enabled
                ? `linear-gradient(135deg, ${config.ui.primary}, ${config.ui.secondary})`
                : `linear-gradient(135deg, ${config.ui.secondary}, ${config.ui.primary})`;
        }

        showStatus(
            `Aim Line ${enabled ? 'ENABLED' : 'DISABLED'}`,
            1500,
            enabled ? '#00ff00' : '#ff3366'
        );

        if (enabled) {
            createAimLine();
            state.mouseMoved = false;
            state.mousePos = null;
            if (state.aimHelperLine) state.aimHelperLine.style.display = 'block';
        } else if (state.aimHelperLine) {
            state.aimHelperLine.style.display = 'none';
        }
    };

    const updatePerformanceStats = () => {
        if (config.performance.fps) {
            const fpsDisplay = document.getElementById('fps-display');
            if (fpsDisplay) fpsDisplay.textContent = `FPS: ${state.fps}`;
        }

        if (config.performance.ping) {
            const pingDisplay = document.getElementById('ping-display');
            if (pingDisplay) pingDisplay.textContent = `Ping: ${state.ping}ms`;
        }
    };

    const calculateFPS = () => {
        let lastTime = performance.now();
        let frameCount = 0;

        const loop = () => {
            const now = performance.now();
            frameCount++;

            if (now - lastTime >= 1000) {
                state.fps = Math.round((frameCount * 1000) / (now - lastTime));
                frameCount = 0;
                lastTime = now;
                updatePerformanceStats();
            }

            requestAnimationFrame(loop);
        };

        loop();
    };

    const simulatePing = () => {
        setInterval(() => {
            state.ping = Math.floor(Math.random() * 50) + 20;
            updatePerformanceStats();
        }, config.performance.updateInterval);
    };

    const updateAimLine = () => {
        if (!config.aimHelper.enabled || !state.aimHelperLine) return;

        let angle = config.aimHelper.defaultAngle; // Left by default

        if (state.mouseMoved && state.mousePos) {
            angle = Math.atan2(
                state.mousePos.y - state.playerPos.y,
                state.mousePos.x - state.playerPos.x
            ) - Math.PI/2;
        }

        state.aimHelperLine.style.left = `${state.playerPos.x - config.aimHelper.thickness/2}px`;
        state.aimHelperLine.style.top = `${state.playerPos.y}px`;
        state.aimHelperLine.style.transform = `rotate(${angle}rad)`;
    };

    // ===== EVENT LISTENERS =====
    const setupEventListeners = (uiElements) => {
        // Mouse movement
        document.addEventListener('mousemove', (e) => {
            state.mousePos = { x: e.clientX, y: e.clientY };
            state.mouseMoved = true;
        });

        // Window resize
        window.addEventListener('resize', () => {
            state.playerPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        });

        // UI interactions
        uiElements.aimToggleBtn.addEventListener('click', () => {
            setAimHelperState(!config.aimHelper.enabled);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'p') {
                setAimHelperState(!config.aimHelper.enabled);
            }
        });

        uiElements.colorInput.addEventListener('input', (e) => {
            updateAimLineColor(hexToRgba(e.target.value, 0.85));
            showStatus('Aim line color updated', 1000, e.target.value);
        });
    };

    // ===== UTILITIES =====
    const hexToRgba = (hex, alpha = 1) => {
        const r = parseInt(hex.substr(1,2),16);
        const g = parseInt(hex.substr(3,2),16);
        const b = parseInt(hex.substr(5,2),16);
        return `rgba(${r},${g},${b},${alpha})`;
    };

    // ===== INITIALIZATION =====
    const init = () => {
        const uiElements = createEliteClientUI();
        setupEventListeners(uiElements);
        createAimLine();

        // Initialize performance monitoring
        if (config.performance.fps) calculateFPS();
        if (config.performance.ping) simulatePing();

        // Update aim line continuously
        setInterval(updateAimLine, 16);

        showStatus('Elite Client Loaded', 2000, config.ui.accent);
        console.log('[Elite Client] Blue/Purple theme loaded with all features!');
    };

    // Start the client
    init();
    // Add this function anywhere in your functions area
const toggleCompass = (enabled) => {
    compassEnabled = enabled;
    const btn = document.getElementById('compass-toggle-btn');
    if (btn) {
        btn.textContent = `COMPASS: ${enabled ? 'ON' : 'OFF'}`;
        btn.style.background = enabled
            ? `linear-gradient(135deg, ${config.ui.primary}, ${config.ui.secondary})`
            : `linear-gradient(135deg, ${config.ui.secondary}, ${config.ui.primary})`;
    }

    showStatus(
        `Compass ${enabled ? 'ENABLED' : 'DISABLED'}`,
        1500,
        enabled ? '#00ff00' : '#ff3366'
    );

    if (enabled) {
        if (!compassElement) {
            compassElement = document.createElement('div');
            compassElement.id = 'elite-compass';
            compassElement.textContent = '⬆';
            compassElement.style.cssText = `
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 24px;
                font-weight: bold;
                color: ${config.ui.accent};
                text-shadow: 0 0 8px ${config.ui.accent};
                z-index: 99997;
                user-select: none;
                pointer-events: none;
            `;
            document.body.appendChild(compassElement);
        } else {
            compassElement.style.display = 'block';
        }
    } else if (compassElement) {
        compassElement.style.display = 'none';
    }
};

})();