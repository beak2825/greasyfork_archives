// ==UserScript==
// @name         XcloudCheat (AI AIMBOT)
// @namespace    http://tampermonkey.net/
// @version      dev-1.0
// @description  Aimbot
// @license MIT
// @author       Ph0qu3_111
// @match        https://www.xbox.com/*/play*
// @match        https://www.xbox.com/*/auth/msa?*loggedIn*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/521415/XcloudCheat%20%28AI%20AIMBOT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521415/XcloudCheat%20%28AI%20AIMBOT%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const config = {
        enemySelector: '.enemy-class',
        playerSelector: '.PlayerInfo-module__container___ROgVL',
        aimInterval: 100,
        fov: 90,
        fovRadius: 150,
        fovEnabled: true,
        enableSilentAim: true,
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
        },
        debugMode: true,
    };

    // Debug Log
    function debugLog(message) {
        if (config.debugMode) {
            console.log(`[DEBUG] ${message}`);
        }
    }

    debugLog('Initializing script...');

    // GUI Setup
    const guiStyle = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 10px;
        z-index: 1000;
        font-family: Arial, sans-serif;
    `;

    const gui = document.createElement('div');
    gui.style.cssText = guiStyle;
    document.body.appendChild(gui);
    debugLog('GUI added.');

    // Add Title
    const title = document.createElement('h3');
    title.textContent = 'Fortnite Silent Aim 1.0(dev)';
    title.style.cssText = 'margin: 0 0 10px; text-align: center; color: lightblue;';
    gui.appendChild(title);

    // Button Creator
    function createButton(label, onClick) {
        const button = document.createElement('button');
        button.textContent = label;
        button.style.cssText = `
            display: block;
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

    // Slider Creator
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
    createButton('Toggle Silent Aim', () => {
        config.enableSilentAim = !config.enableSilentAim;
        debugLog(`Silent Aim toggled: ${config.enableSilentAim}`);
    });

    createButton('Toggle Auto Shoot', () => {
        config.autoShoot = !config.autoShoot;
        debugLog(`Auto Shoot toggled: ${config.autoShoot}`);
    });

    createButton('Toggle FOV Display', () => {
        config.fovEnabled = !config.fovEnabled;
        const circle = document.getElementById('fov-circle');
        if (circle) {
            circle.style.display = config.fovEnabled ? 'block' : 'none';
        }
        debugLog(`FOV Display toggled: ${config.fovEnabled}`);
    });

    createButton('Reset Settings', () => {
        config.fovRadius = 150;
        config.silentAimSpeed = 0.2;
        config.crosshair.size = 15;
        updateFovCircle();
        updateCrosshair();
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
    });

    // Crosshair Fix
    function createCrosshair() {
        if (!config.crosshair.enabled) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'custom-crosshair';
        canvas.style.position = 'fixed';
        canvas.style.pointerEvents = 'none';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.zIndex = '10000';

        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        function drawCrosshair() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            ctx.strokeStyle = config.crosshair.color;
            ctx.fillStyle = config.crosshair.color;

            switch (config.crosshair.style) {
                case 'circle':
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, config.crosshair.size / 2, 0, 2 * Math.PI);
                    ctx.stroke();
                    break;
                case 'dot':
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, config.crosshair.size / 2, 0, 2 * Math.PI);
                    ctx.fill();
                    break;
                case 'cross':
                    ctx.beginPath();
                    ctx.moveTo(centerX - config.crosshair.size / 2, centerY);
                    ctx.lineTo(centerX + config.crosshair.size / 2, centerY);
                    ctx.moveTo(centerX, centerY - config.crosshair.size / 2);
                    ctx.lineTo(centerX, centerY + config.crosshair.size / 2);
                    ctx.stroke();
                    break;
            }
        }

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
            border: 2px solid red;
            pointer-events: none;
            transform: translate(-50%, -50%);
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
        }
    }
    createFovCircle();

    debugLog('Script initialized.');
})();