// ==UserScript==
// @name         Ultimate Dino Hack GUI  
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Hack Chrome Dino: Modern Dark GUI, Draggable, Collapsible, Smart Auto Jump.
// @author       Max Stewie  
// @match        *://chromedino.com/*
// @match        chrome://dino
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500428/Ultimate%20Dino%20Hack%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/500428/Ultimate%20Dino%20Hack%20GUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Đợi game load
    const waitForRunner = setInterval(() => {
        if (typeof Runner !== 'undefined' && Runner.instance_) {
            clearInterval(waitForRunner);
            initHack();
        }
    }, 100);

    function initHack() {
        // --- STATE ---
        const state = {
            isInvincible: false,
            autoJump: false,
            originalGameOver: Runner.prototype.gameOver,
            isMinimized: false
        };

        // --- STYLES (Modern Dark Theme) ---
        const style = document.createElement('style');
        style.innerHTML = `
            #dino-hack-container {
                position: fixed; top: 20px; right: 20px; z-index: 99999;
                width: 240px;
                font-family: 'Consolas', 'Monaco', monospace;
                user-select: none;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                border-radius: 12px;
                overflow: hidden;
                backdrop-filter: blur(10px);
                background: rgba(30, 30, 30, 0.9);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: height 0.3s ease;
            }
            #hack-header {
                padding: 12px 15px;
                background: linear-gradient(90deg, #00C853, #64DD17);
                color: #000; font-weight: bold; cursor: move;
                display: flex; justify-content: space-between; align-items: center;
                font-size: 14px; text-transform: uppercase; letter-spacing: 1px;
            }
            #hack-minimize {
                cursor: pointer; font-weight: 900; padding: 0 5px;
                transition: transform 0.2s;
            }
            #hack-minimize:hover { transform: scale(1.2); }
            #hack-body {
                padding: 15px; display: flex; flex-direction: column; gap: 12px;
            }
            .hack-row { display: flex; gap: 10px; }
            .hack-btn {
                flex: 1; padding: 10px; border: none; border-radius: 6px;
                background: #333; color: #aaa; font-weight: bold;
                cursor: pointer; transition: all 0.2s; font-size: 12px;
                border: 1px solid #444;
            }
            .hack-btn:hover { background: #444; color: #fff; }
            .hack-btn.active {
                background: rgba(0, 200, 83, 0.2);
                color: #00C853; border-color: #00C853;
                box-shadow: 0 0 8px rgba(0, 200, 83, 0.3);
            }
            .hack-label { font-size: 11px; color: #888; margin-bottom: 4px; display: block; }
            .hack-input {
                width: 100%; background: #222; border: 1px solid #444;
                color: #fff; padding: 6px; border-radius: 4px;
                font-family: monospace;
            }
            /* Custom Range Slider */
            input[type=range] {
                -webkit-appearance: none; width: 100%; background: transparent;
            }
            input[type=range]::-webkit-slider-runnable-track {
                width: 100%; height: 6px; background: #444; border-radius: 3px;
            }
            input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none; height: 16px; width: 16px;
                border-radius: 50%; background: #00C853;
                margin-top: -5px; cursor: pointer;
            }
            .hidden-body { display: none !important; }
        `;
        document.head.appendChild(style);

        // --- LOGIC ---
        
        function toggleInvincible(btn) {
            state.isInvincible = !state.isInvincible;
            if (state.isInvincible) {
                Runner.prototype.gameOver = function() {};
                btn.classList.add('active');
            } else {
                Runner.prototype.gameOver = state.originalGameOver;
                btn.classList.remove('active');
            }
        }

        function toggleAutoJump(btn) {
            state.autoJump = !state.autoJump;
            if (state.autoJump) {
                btn.classList.add('active');
                requestAnimationFrame(autoJumpLoop);
            } else {
                btn.classList.remove('active');
            }
        }

        function autoJumpLoop() {
            if (!state.autoJump) return;
            const instance = Runner.instance_;
            
            if (!instance.playing || instance.crashed) {
                requestAnimationFrame(autoJumpLoop);
                return;
            }

            const tRex = instance.tRex;
            const obstacles = instance.horizon.obstacles;

            if (obstacles.length > 0) {
                const obstacle = obstacles[0];
                // Thuật toán tính khoảng cách nhảy thông minh
                const actionDistance = 100 + (instance.currentSpeed * 15);
                
                // Thêm check loại chướng ngại vật (Pterodactyl trên cao thì cúi xuống nếu cần - ở đây chỉ nhảy)
                const dist = obstacle.xPos - tRex.xPos;
                if (dist > 0 && dist < actionDistance && !tRex.jumping) {
                    tRex.startJump(instance.currentSpeed);
                }
            }
            requestAnimationFrame(autoJumpLoop);
        }

        // --- GUI CONSTRUCTION ---

        const gui = document.createElement('div');
        gui.id = 'dino-hack-container';

        // Header (Drag Handle)
        const header = document.createElement('div');
        header.id = 'hack-header';
        header.innerHTML = `<span>⚡ Dino Hack</span> <span id="hack-minimize">_</span>`;
        gui.appendChild(header);

        // Body
        const body = document.createElement('div');
        body.id = 'hack-body';

        // Buttons Row
        const btnRow = document.createElement('div');
        btnRow.className = 'hack-row';
        
        const btnGod = document.createElement('button');
        btnGod.className = 'hack-btn';
        btnGod.textContent = 'GOD MODE';
        btnGod.onclick = () => toggleInvincible(btnGod);

        const btnJump = document.createElement('button');
        btnJump.className = 'hack-btn';
        btnJump.textContent = 'AUTO JUMP';
        btnJump.onclick = () => toggleAutoJump(btnJump);

        btnRow.appendChild(btnGod);
        btnRow.appendChild(btnJump);
        body.appendChild(btnRow);

        // Speed Slider
        const speedContainer = document.createElement('div');
        const speedLabel = document.createElement('span');
        speedLabel.className = 'hack-label';
        speedLabel.innerHTML = 'SPEED: <span id="speed-val">10</span>';
        
        const speedInput = document.createElement('input');
        speedInput.type = 'range';
        speedInput.min = '10'; speedInput.max = '200'; speedInput.step = '1'; speedInput.value = '10';
        speedInput.oninput = function() {
            Runner.instance_.setSpeed(parseFloat(this.value));
            document.getElementById('speed-val').textContent = this.value;
        };

        speedContainer.appendChild(speedLabel);
        speedContainer.appendChild(speedInput);
        body.appendChild(speedContainer);

        // Score Input
        const scoreContainer = document.createElement('div');
        scoreContainer.innerHTML = '<span class="hack-label">SET SCORE:</span>';
        const scoreInput = document.createElement('input');
        scoreInput.className = 'hack-input';
        scoreInput.type = 'number';
        scoreInput.placeholder = 'Example: 99999';
        scoreInput.onchange = function() {
            const val = parseInt(this.value);
            Runner.instance_.distanceMeter.setHighScore(val);
            Runner.instance_.distanceRan = val / Runner.instance_.distanceMeter.config.COEFFICIENT;
        };
        scoreContainer.appendChild(scoreInput);
        body.appendChild(scoreContainer);

        // Reset
        const btnReset = document.createElement('button');
        btnReset.className = 'hack-btn';
        btnReset.style.width = '100%';
        btnReset.textContent = 'RESTART GAME';
        btnReset.onclick = () => location.reload();
        body.appendChild(btnReset);

        gui.appendChild(body);
        document.body.appendChild(gui);

        // --- DRAG & DROP LOGIC ---
        let isDragging = false, startX, startY, initialLeft, initialTop;

        header.onmousedown = function(e) {
            // Ngăn drag khi click nút minimize
            if(e.target.id === 'hack-minimize') return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = gui.offsetLeft;
            initialTop = gui.offsetTop;
            header.style.cursor = 'grabbing';
        };

        document.onmousemove = function(e) {
            if (isDragging) {
                gui.style.left = (initialLeft + e.clientX - startX) + 'px';
                gui.style.top = (initialTop + e.clientY - startY) + 'px';
                gui.style.right = 'auto'; // Disable default right positioning
            }
        };

        document.onmouseup = function() {
            isDragging = false;
            header.style.cursor = 'move';
        };

        // --- MINIMIZE LOGIC ---
        const minimizeBtn = document.getElementById('hack-minimize');
        minimizeBtn.onclick = () => {
            state.isMinimized = !state.isMinimized;
            if(state.isMinimized) {
                body.classList.add('hidden-body');
                minimizeBtn.textContent = '+';
            } else {
                body.classList.remove('hidden-body');
                minimizeBtn.textContent = '_';
            }
        };

        // --- KEYBOARD SHORTCUT (H) ---
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'h' && document.activeElement.tagName !== 'INPUT') {
                gui.style.display = gui.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
})();