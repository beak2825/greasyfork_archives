// ==UserScript==
// @name         Fortnite Adaptive Aimbot v42.1
// @namespace    http://tampermonkey.net/
// @version      42.1
// @description  Adaptive Aimbot with customizable crosshair, sliders, and buttons for better control. ESP included.
// @license MIT
// @author       MrTimTam
// @match        https://www.xbox.com/en-US/play/launch/fortnite/BT5P2X999VH2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526304/Fortnite%20Adaptive%20Aimbot%20v421.user.js
// @updateURL https://update.greasyfork.org/scripts/526304/Fortnite%20Adaptive%20Aimbot%20v421.meta.js
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
        enableNormalAim: false,
        autoShoot: true,
        visibleCheck: true,
        distanceLimit: 2000,
        hitbox: 'head', // Options: 'head', 'body', 'nearest'
        silentAimSpeed: 50.0,
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
            enabled: true,
        },
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
    gui.id = 'gui';
    gui.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 10px;
        z-index: 1000;
        font-family: Arial, sans-serif;
        display: flex;
        flex-direction: column;
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
    createButton('Toggle Silent Aim', () => {
        config.enableSilentAim = !config.enableSilentAim;
        debugLog(`Silent Aim toggled: ${config.enableSilentAim}`);
    });

    createButton('Toggle Normal Aim', () => {
        config.enableNormalAim = !config.enableNormalAim;
        debugLog(`Normal Aim toggled: ${config.enableNormalAim}`);
    });

    createButton('Toggle Auto Shoot', () => {
        config.autoShoot = !config.autoShoot;
        debugLog(`Auto Shoot toggled: ${config.autoShoot}`);
    });

    createButton('Toggle FOV Display', () => {
        config.fovEnabled = !config.fovEnabled;
        updateFovCircle();
        debugLog(`FOV Display toggled: ${config.fovEnabled}`);
    });

    createButton('Toggle ESP', () => {
        config.esp.enabled = !config.esp.enabled;
        updateESP();
        debugLog(`ESP toggled: ${config.esp.enabled}`);
    });

    createButton('Reset Settings', () => {
        Object.assign(config, {
            fovRadius: 150,
            silentAimSpeed: 50.0,
            crosshair: {
                size: 15,
                outline: true,
                outlineWidth: 2,
            },
        });
        updateCrosshair();
        updateFovCircle();
        updateESP();
        debugLog('Settings reset to default.');
    });

    // Add Sliders
    createSlider('FOV Radius', 50, 300, 10, config.fovRadius, (value) => {
        config.fovRadius = parseInt(value, 10);
        updateFovCircle();
    });

    createSlider('Silent Aim Speed', 0.1, 100.0, 0.1, config.silentAimSpeed, (value) => {
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

    // ESP
    function createESP() {
        const espContainer = document.createElement('div');
        espContainer.id = 'esp-container';
        espContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(espContainer);
    }

    function updateESP() {
        const espContainer = document.getElementById('esp-container');
        if (espContainer) {
            espContainer.style.display = config.esp.enabled ? 'block' : 'none';
        }
    }

    createESP();

    // Player Detection
    function detectPlayers() {
        const players = document.querySelectorAll(config.playerSelector);
        return Array.from(players).map((player) => {
            const rect = player.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                width: rect.width,
                height: rect.height,
            };
        });
    }

    // Get the player under the crosshair
    function getPlayerUnderCrosshair() {
        const players = detectPlayers();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const closestPlayer = players.reduce((closest, current) => {
            const distance = Math.hypot(current.x - centerX, current.y - centerY);
            if (distance < closest.distance) {
                return { player: current, distance };
            }
            return closest;
        }, { player: null, distance: Infinity });
        return closestPlayer.player;
    }

    // Main loop
    setInterval(() => {
        // Silent Aim
        if (config.enableSilentAim) {
            const players = detectPlayers();
            if (players.length > 0) {
                let targetPlayer = null;
                const playerUnderCrosshair = getPlayerUnderCrosshair();
                if (playerUnderCrosshair) {
                    targetPlayer = playerUnderCrosshair;
                } else {
                    targetPlayer = players.reduce((closest, current) => {
                        const distance = Math.hypot(current.x - window.innerWidth / 2, current.y - window.innerHeight / 2);
                        if (distance < closest.distance) {
                            return { player: current, distance };
                        }
                        return closest;
                    }, { player: null, distance: Infinity }).player;
                }
                if (targetPlayer) {
                    const aimX = targetPlayer.x;
                    const aimY = targetPlayer.y;
                    // Move the crosshair to the aim position
                    const crosshair = document.getElementById('custom-crosshair');
                    const ctx = crosshair.getContext('2d');
                    ctx.clearRect(0, 0, crosshair.width, crosshair.height);
                    ctx.beginPath();
                    ctx.arc(aimX, aimY, config.crosshair.size / 2, 0, Math.PI * 2);
                    ctx.stroke();
                    // Simulate mouse movement
                    const event = new MouseEvent('mousemove', {
                        clientX: aimX,
                        clientY: aimY,
                    });
                    document.dispatchEvent(event);
                }
            }
        }

        // Normal Aim
        if (config.enableNormalAim) {
            const players = detectPlayers();
            if (players.length > 0) {
                let targetPlayer = null;
                const playerUnderCrosshair = getPlayerUnderCrosshair();
                if (playerUnderCrosshair) {
                    targetPlayer = playerUnderCrosshair;
                } else {
                    targetPlayer = players.reduce((closest, current) => {
                        const distance = Math.hypot(current.x - window.innerWidth / 2, current.y - window.innerHeight / 2);
                        if (distance < closest.distance) {
                            return { player: current, distance };
                        }
                        return closest;
                    }, { player: null, distance: Infinity }).player;
                }
                if (targetPlayer) {
                    const aimX = targetPlayer.x;
                    const aimY = targetPlayer.y;
                    // Move the mouse to the aim position
                    const event = new MouseEvent('mousemove', {
                        clientX: aimX,
                        clientY: aimY,
                    });
                    document.dispatchEvent(event);
                }
            }
        }

        // Auto Shoot
        if (config.autoShoot) {
            const players = detectPlayers();
            if (players.length > 0) {
                let targetPlayer = null;
                const playerUnderCrosshair = getPlayerUnderCrosshair();
                if (playerUnderCrosshair) {
                    targetPlayer = playerUnderCrosshair;
                } else {
                    targetPlayer = players.reduce((closest, current) => {
                        const distance = Math.hypot(current.x - window.innerWidth / 2, current.y - window.innerHeight / 2);
                        if (distance < closest.distance) {
                            return { player: current, distance };
                        }
                        return closest;
                    }, { player: null, distance: Infinity }).player;
                }
                if (targetPlayer) {
                    const aimX = targetPlayer.x;
                    const aimY = targetPlayer.y;
                    // Check if the player is within the FOV
                    const fovRadius = config.fovRadius;
                    const distance = Math.hypot(aimX - window.innerWidth / 2, aimY - window.innerHeight / 2);
                    if (distance <= fovRadius) {
                        // Simulate mouse click
                        const event = new MouseEvent('click', {
                            clientX: aimX,
                            clientY: aimY,
                            button: 0,
                            buttons: 1,
                        });
                        document.dispatchEvent(event);
                        // Simulate key press (for Xbox cloud gaming)
                        const keyEvent = new KeyboardEvent('keydown', {
                            key: ' ',
                            keyCode: 32,
                            code: 'Space',
                            which: 32,
                            bubbles: true,
                            cancelable: true,
                        });
                        document.dispatchEvent(keyEvent);
                        setTimeout(() => {
                            const keyUpEvent = new KeyboardEvent('keyup', {
                                key: ' ',
                                keyCode: 32,
                                code: 'Space',
                                which: 32,
                                bubbles: true,
                                cancelable: true,
                            });
                            document.dispatchEvent(keyUpEvent);
                        }, 100);
                    }
                }
            }
        }

        // ESP
        if (config.esp.enabled) {
            const players = detectPlayers();
            const espContainer = document.getElementById('esp-container');
            if (espContainer) {
                espContainer.innerHTML = '';
                players.forEach((player) => {
                    const rect = player;
                    const espBox = document.createElement('div');
                    espBox.style.cssText = `
                        position: absolute;
                        top: ${rect.y}px;
                        left: ${rect.x}px;
                        width: ${rect.width}px;
                        height: ${rect.height}px;
                        border: 2px solid red;
                        pointer-events: none;
                    `;
                    espContainer.appendChild(espBox);
                });
            }
        }
    }, config.aimInterval);

    // Add a new keyboard shortcut to toggle the GUI
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            const guiElement = document.getElementById('gui');
            if (guiElement) {
                guiElement.style.display = guiElement.style.display === 'none' ? 'block' : 'none';
            }
        }
    });
})();
