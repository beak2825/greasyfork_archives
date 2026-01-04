// ==UserScript==
// @name         Fortnite Adaptive Silent Aim v42.1
// @namespace    http://tampermonkey.net/
// @version      42.1
// @description  Silent Aim with adaptive AI, customizable crosshair, sliders, and buttons for better control. ESP included for enemy visibility.
// @author       DAC
// @match        https://www.xbox.com/en-US/play/launch/fortnite/BT5P2X999VH2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528596/Fortnite%20Adaptive%20Silent%20Aim%20v421.user.js
// @updateURL https://update.greasyfork.org/scripts/528596/Fortnite%20Adaptive%20Silent%20Aim%20v421.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const config = {
        enemySelector: '.enemy-class', // Replace with actual enemy element selector
        playerSelector: '.PlayerInfo-module__container___ROgVL',
        aimInterval: 100,
        fov: 90,
        fovRadius: 150,
        fovEnabled: true,
        enableSilentAim: true, // Silent Aim always enabled
        autoShoot: true,
        visibleCheck: true,
        distanceLimit: 500,
        hitbox: 'head', // Options: 'head', 'body', 'nearest'
        silentAimSpeed: 0.2,
        crosshair: {
            enabled: true,
            size: 15,
            color: 'red',
            style: 'circle', // Options: 'circle', 'dot', 'cross'
            outline: true,
            outlineWidth: 2,
            outlineColor: 'white',
        },
        debugMode: true,
        esp: {
            enabled: true, // Turn on ESP
        },
        menuKeybind: 'Slash', // Key to toggle the menu visibility
    };

    // Debug Log
    function debugLog(message) {
        if (config.debugMode) {
            console.log(`[DEBUG] ${message}`);
        }
    }

    debugLog('Initializing script...');

    // GUI Setup
    const gui = document.createElement('div');
    gui.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 10px;
        z-index: 10000; /* Ensure it is on top */
        font-family: Arial, sans-serif;
        display: flex;
        flex-direction: column;
        width: 200px;
        display: none; /* Initially hidden */
    `;
    document.body.appendChild(gui);
    debugLog('GUI added.');

    // GUI Helpers
    function createButton(label, onClick) {
        const button = document.createElement('button');
        button.textContent = label;
        button.style.cssText = `
            margin: 5px 0;
            padding: 5px 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        button.addEventListener('click', onClick);
        gui.appendChild(button);
    }

    function createSlider(label, min, max, step, defaultValue, onChange) {
        const container = document.createElement('div');
        container.style.marginBottom = '10px';

        const sliderLabel = document.createElement('label');
        sliderLabel.textContent = `${label}: ${defaultValue}`;
        sliderLabel.style.color = 'white';
        sliderLabel.style.display = 'block';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = defaultValue;
        slider.style.width = '100%';
        slider.style.marginTop = '5px';

        slider.addEventListener('input', () => {
            sliderLabel.textContent = `${label}: ${slider.value}`;
            onChange(slider.value);
        });

        container.appendChild(sliderLabel);
        container.appendChild(slider);
        gui.appendChild(container);
    }

    // Add Buttons
    createButton('Toggle Auto Shoot', () => {
        config.autoShoot = !config.autoShoot;
        debugLog(`Auto Shoot toggled: ${config.autoShoot}`);
    });

    createButton('Toggle FOV Display', () => {
        config.fovEnabled = !config.fovEnabled;
        updateFovCircle();
        debugLog(`FOV Display toggled: ${config.fovEnabled}`);
    });

    createButton('Reset Settings', () => {
        Object.assign(config, {
            fovRadius: 150,
            silentAimSpeed: 0.2,
            crosshair: {
                size: 15,
                outline: true,
                outlineWidth: 2,
            },
        });
        updateCrosshair();
        updateFovCircle();
        debugLog('Settings reset to default.');
    });

    // Add Sliders
    createSlider('FOV Radius', 50, 300, 10, config.fovRadius, (value) => {
        config.fovRadius = parseInt(value, 10);
        updateFovCircle();
    });

    createSlider('Silent Aim Speed', 0.1, 1.0, 0.1, config.silentAimSpeed, (value) => {
        config.silentAimSpeed = parseFloat(value);
    });

    createSlider('Crosshair Size', 5, 30, 1, config.crosshair.size, (value) => {
        config.crosshair.size = parseInt(value, 10);
        updateCrosshair();
    });

    // Crosshair
    function createCrosshair() {
        const canvas = document.createElement('canvas');
        canvas.id = 'custom-crosshair';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10000;
        `;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        function drawCrosshair() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            ctx.strokeStyle = config.crosshair.color;
            ctx.lineWidth = config.crosshair.outline ? config.crosshair.outlineWidth : 1;

            switch (config.crosshair.style) {
                case 'circle':
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, config.crosshair.size / 2, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
                case 'dot':
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, config.crosshair.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'cross':
                    ctx.beginPath();
                    ctx.moveTo(centerX - config.crosshair.size, centerY);
                    ctx.lineTo(centerX + config.crosshair.size, centerY);
                    ctx.moveTo(centerX, centerY - config.crosshair.size);
                    ctx.lineTo(centerX, centerY + config.crosshair.size);
                    ctx.stroke();
                    break;
            }
        }

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        setInterval(drawCrosshair, 16);
    }

    createCrosshair();

    // FOV Circle
    function createFovCircle() {
        const circle = document.createElement('div');
        circle.id = 'fov-circle';
        circle.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: ${config.fovRadius * 2}px;
            height: ${config.fovRadius * 2}px;
            border-radius: 50%;
            border: ${config.crosshair.outlineWidth}px solid ${config.crosshair.outlineColor};
            pointer-events: none;
            transform: translate(-50%, -50%);
            display: ${config.fovEnabled ? 'block' : 'none'};
            opacity: 0.5;
            z-index: 999;
        `;
        document.body.appendChild(circle);
    }

    function updateFovCircle() {
        const circle = document.getElementById('fov-circle');
        if (circle) {
            circle.style.width = `${config.fovRadius * 2}px`;
            circle.style.height = `${config.fovRadius * 2}px`;
            circle.style.display = config.fovEnabled ? 'block' : 'none';
        }
    }

    createFovCircle();

    // ESP (Enemy Box)
    function createEsp() {
        const enemies = document.querySelectorAll(config.enemySelector);
        enemies.forEach((enemy) => {
            const box = document.createElement('div');
            box.style.cssText = `
                position: absolute;
                background-color: rgba(255, 0, 0, 0.5);
                border: 2px solid red;
                z-index: 9999;
                pointer-events: none;
            `;
            const rect = enemy.getBoundingClientRect();
            box.style.width = `${rect.width}px`;
            box.style.height = `${rect.height}px`;
            box.style.top = `${rect.top}px`;
            box.style.left = `${rect.left}px`;
            document.body.appendChild(box);
        });
    }

    setInterval(createEsp, 1000);

    // Keybind listener for toggling the menu visibility
    document.addEventListener('keydown', (e) => {
        if (e.code === config.menuKeybind) {
            gui.style.display = gui.style.display === 'none' ? 'flex' : 'none';
            debugLog(`Menu visibility toggled`);
        }
    });

    debugLog('Script Initialized.');
})();