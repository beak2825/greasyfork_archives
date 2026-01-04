// ==UserScript==
// @name         Taming.io menu by 𝘣𝘢𝘳𝘴𝘪𝘬 𝘴𝘯𝘰𝘴𝘦𝘳
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds draggable rainbow UI menu with FOV slider and key press display on Taming.io
// @author       𝘣𝘢𝘳𝘴𝘪𝘬 𝘴𝘯𝘰𝘴𝘦𝘳
// @match        *://taming.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540228/Tamingio%20menu%20by%20%F0%9D%98%A3%F0%9D%98%A2%F0%9D%98%B3%F0%9D%98%B4%F0%9D%98%AA%F0%9D%98%AC%20%F0%9D%98%B4%F0%9D%98%AF%F0%9D%98%B0%F0%9D%98%B4%F0%9D%98%A6%F0%9D%98%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/540228/Tamingio%20menu%20by%20%F0%9D%98%A3%F0%9D%98%A2%F0%9D%98%B3%F0%9D%98%B4%F0%9D%98%AA%F0%9D%98%AC%20%F0%9D%98%B4%F0%9D%98%AF%F0%9D%98%B0%F0%9D%98%B4%F0%9D%98%A6%F0%9D%98%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CSS with animated gradient ---
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbowShift {
            0%{background-position:0% 50%;}
            50%{background-position:100% 50%;}
            100%{background-position:0% 50%;}
        }
        #rainbowMenu {
            position: fixed;
            top: 100px;
            left: 20px;
            width: 300px;
            background: linear-gradient(270deg, red, orange, yellow, green, blue, indigo, violet, red);
            background-size: 1600% 1600%;
            animation: rainbowShift 12s ease infinite;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0,0,0,0.5);
            color: white;
            font-family: Arial, sans-serif;
            user-select: none;
            z-index: 999999;
            cursor: grab;
            padding: 15px;
        }
        #rainbowMenu header {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 10px;
            cursor: grab;
        }
        #rainbowMenu label {
            display: block;
            margin-top: 10px;
            font-size: 14px;
        }
        #rainbowMenu input[type="range"] {
            width: 100%;
            margin-top: 5px;
            -webkit-appearance: none;
            background: rgba(255,255,255,0.3);
            border-radius: 5px;
            height: 8px;
        }
        #rainbowMenu input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            background: white;
            border-radius: 50%;
            cursor: pointer;
            border: 1px solid #999;
            margin-top: -5px;
        }
        #keyStatus {
            margin-top: 15px;
            font-size: 14px;
            line-height: 1.4;
            max-height: 150px;
            overflow-y: auto;
            background: rgba(255,255,255,0.15);
            padding: 8px;
            border-radius: 5px;
            user-select: text;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        #keyStatus div.keyBlock {
            padding: 3px 8px;
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 5px;
            background: rgba(255,255,255,0.1);
            white-space: nowrap;
            user-select: none;
        }
    `;
    document.head.appendChild(style);

    // --- Create menu element ---
    const menu = document.createElement('div');
    menu.id = 'rainbowMenu';
    menu.innerHTML = `
        <header>Rainbow UI - Taming.io</header>
        <label for="fovRange">Field of View (FOV): <span id="fovValue">90</span>°</label>
        <input type="range" id="fovRange" min="60" max="140" value="90" step="1" />
        <label for="speedRange">Player Speed: <span id="speedValue">1.0</span>x</label>
        <input type="range" id="speedRange" min="0.5" max="3" value="1" step="0.05" />
        <label>Pressed Keys:</label>
        <div id="keyStatus">None</div>
    `;
    document.body.appendChild(menu);

    // --- Drag functionality ---
    const header = menu.querySelector('header');
    let isDragging = false;
    let dragStartX, dragStartY, menuStartX, menuStartY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        const rect = menu.getBoundingClientRect();
        menuStartX = rect.left;
        menuStartY = rect.top;
        menu.style.cursor = 'grabbing';
        e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        menu.style.cursor = 'grab';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = menuStartX + (e.clientX - dragStartX);
        let newY = menuStartY + (e.clientY - dragStartY);

        const maxX = window.innerWidth - menu.offsetWidth;
        const maxY = window.innerHeight - menu.offsetHeight;
        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX > maxX) newX = maxX;
        if (newY > maxY) newY = maxY;

        menu.style.left = newX + 'px';
        menu.style.top = newY + 'px';
    });

    // --- Key press tracking ---
    const keyStatus = menu.querySelector('#keyStatus');
    const pressedKeys = new Set();

    const keyNames = {
        'ArrowUp': 'Arrow Up',
        'ArrowDown': 'Arrow Down',
        'ArrowLeft': 'Arrow Left',
        'ArrowRight': 'Arrow Right',
        ' ': 'Space',
        'Shift': 'Shift',
        'Control': 'Control',
        'Alt': 'Alt',
        'Enter': 'Enter',
        'Escape': 'Escape',
        'Tab': 'Tab',
    };

    function getDisplayKey(key) {
        if (keyNames[key]) return keyNames[key];
        if (key.length === 1) return key.toUpperCase();
        return key;
    }

    window.addEventListener('keydown', (e) => {
        pressedKeys.add(e.key);
        updateKeyStatus();
    });

    window.addEventListener('keyup', (e) => {
        pressedKeys.delete(e.key);
        updateKeyStatus();
    });

    function updateKeyStatus() {
        if (pressedKeys.size === 0) {
            keyStatus.textContent = 'None';
        } else {
            const blocks = Array.from(pressedKeys)
                .map(getDisplayKey)
                .sort()
                .map(key => `<div class="keyBlock">${key}</div>`)
                .join('');
            keyStatus.innerHTML = blocks;
        }
    }

    // --- FOV control ---
    const fovRange = menu.querySelector('#fovRange');
    const fovValue = menu.querySelector('#fovValue');

    function setGameFOV(fov) {
        try {
            if (window.game && window.game.camera && typeof window.game.camera.fov !== 'undefined') {
                window.game.camera.fov = fov;
                if (typeof window.game.camera.updateProjectionMatrix === 'function') {
                    window.game.camera.updateProjectionMatrix();
                }
                return true;
            }
        } catch(e) {}
        return false;
    }

    fovRange.addEventListener('input', () => {
        const fov = parseInt(fovRange.value, 10);
        fovValue.textContent = fov;
        setGameFOV(fov);
    });

    // --- Player speed control ---
    const speedRange = menu.querySelector('#speedRange');
    const speedValue = menu.querySelector('#speedValue');

    function setPlayerSpeed(multiplier) {
        try {
            if (window.game && window.game.player) {
                const player = window.game.player;
                if ('speed' in player) {
                    player.speed = player.baseSpeed ? player.baseSpeed * multiplier : multiplier;
                } else if ('moveSpeed' in player) {
                    player.moveSpeed = player.baseMoveSpeed ? player.baseMoveSpeed * multiplier : multiplier;
                }
                return true;
            }
        } catch(e) {}
        return false;
    }

    speedRange.addEventListener('input', () => {
        const speed = parseFloat(speedRange.value);
        speedValue.textContent = speed.toFixed(2);
        setPlayerSpeed(speed);
    });

    // --- Initialization ---
    function tryInitSettings() {
        try {
            if (window.game && window.game.camera && typeof window.game.camera.fov !== 'undefined') {
                const currentFov = window.game.camera.fov;
                fovRange.value = currentFov;
                fovValue.textContent = currentFov;
            }
            if (window.game && window.game.player) {
                const player = window.game.player;
                let baseSpeed = 1;
                if ('baseSpeed' in player) baseSpeed = player.baseSpeed;
                else if ('baseMoveSpeed' in player) baseSpeed = player.baseMoveSpeed;
                else if ('speed' in player) baseSpeed = player.speed;
                else if ('moveSpeed' in player) baseSpeed = player.moveSpeed;

                let currentSpeedMult = 1;
                if ('speed' in player && baseSpeed) currentSpeedMult = player.speed / baseSpeed;
                else if ('moveSpeed' in player && baseSpeed) currentSpeedMult = player.moveSpeed / baseSpeed;

                speedRange.value = currentSpeedMult.toFixed(2);
                speedValue.textContent = currentSpeedMult.toFixed(2);
            }
        } catch(e){}
    }

    setTimeout(tryInitSettings, 3000);

})();
