// ==UserScript==
// @name         AnyGame Client GUI Extended v1.3
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  cool clent for anygame 😎
// @author       You
// @match        *://*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/541944/AnyGame%20Client%20GUI%20Extended%20v13.user.js
// @updateURL https://update.greasyfork.org/scripts/541944/AnyGame%20Client%20GUI%20Extended%20v13.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .client-gui, .client-menu {
            position: fixed;
            font-family: Arial, sans-serif;
            z-index: 9999;
        }

        .client-gui {
            top: 20%;
            left: 35%;
            background: #222;
            color: #fff;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            width: 30%;
        }

        .client-menu {
            top: 10%;
            left: 10%;
            background: rgba(20,20,20,0.95);
            color: white;
            padding: 20px;
            border: 2px solid #888;
            border-radius: 8px;
            display: none;
        }

        .tab {
            margin: 5px;
            display: inline-block;
            cursor: pointer;
            padding: 5px 10px;
            background: #444;
            border-radius: 5px;
        }

        .tab.active {
            background: #666;
        }

        .tab-content {
            display: none;
            margin-top: 10px;
        }

        .tab-content.active {
            display: block;
        }

        .btn {
            margin-top: 10px;
            padding: 6px 12px;
            background: #555;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        input[type=range], input[type=color], select {
            width: 100%;
            margin-top: 5px;
        }

        label {
            display: block;
            margin-top: 10px;
        }
    `;
    document.head.appendChild(style);

    // Welcome
    const welcome = document.createElement('div');
    welcome.className = 'client-gui';
    welcome.innerHTML = `
        <div>Hello user, welcome to best client, enjoy.<br>Press "/" to open and close.</div>
        <button class="btn" id="okayBtn">Okay</button>
    `;
    document.body.appendChild(welcome);
    document.getElementById('okayBtn').onclick = () => welcome.remove();

    // GUI Menu
    const menu = document.createElement('div');
    menu.className = 'client-menu';
    menu.innerHTML = `
        <div>
            <span class="tab active" data-tab="main">Main</span>
            <span class="tab" data-tab="overlay">Overlay</span>
            <span class="tab" data-tab="settings">Settings</span>
        </div>

        <div id="main" class="tab-content active">
            <label>Camera FOV:
                <input type="range" min="30" max="120" value="90" id="fovSlider">
                <span id="fovValue">90</span>
            </label>

            <label>Scope:
                <select id="scopeSelect">
                    <option value="default">Default</option>
                    <option value="dot">Dot</option>
                    <option value="cross">Cross</option>
                    <option value="circle">Circle</option>
                    <option value="none">None</option>
                </select>
            </label>

            <label>Smoothing:
                <input type="range" min="0" max="10" value="5" id="smoothingSlider">
                <span id="smoothingValue">5</span>
            </label>

            <button class="btn" id="discordBtn">Join Discord</button>

            <div style="margin-top: 10px;">
                <strong>What's New:</strong><br>
                nothing now just menu lol
            </div>
        </div>

        <div id="overlay" class="tab-content">
            <div>FPS: <span id="fps">0</span></div>
            <div>Ping: <span id="ping">0</span> ms</div>
            <div>Memory: <span id="memory">0</span> GB</div>
            <div>Total Buttons: <span id="buttonCount">0</span></div>
            <div>Smoothing Level: <span id="overlaySmoothing">5</span></div>
            <button class="btn" id="boostFPSBtn">+2 FPS Boost</button>
        </div>

        <div id="settings" class="tab-content">
            <label>Change Menu Color:
                <input type="color" id="colorPicker" value="#141414">
            </label>
            <label><input type="checkbox" id="dragToggle"> Enable Drag</label>
        </div>
    `;
    document.body.appendChild(menu);

    // Tabs
    menu.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            menu.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            menu.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
        });
    });

    // Menu toggle
    let menuVisible = false;
    document.addEventListener('keydown', (e) => {
        if (e.key === '/') {
            menuVisible = !menuVisible;
            menu.style.display = menuVisible ? 'block' : 'none';
        }
    });

    // FOV control
    const fovSlider = document.getElementById('fovSlider');
    const fovValue = document.getElementById('fovValue');
    fovSlider.addEventListener('input', () => fovValue.textContent = fovSlider.value);

    // Scope
    document.getElementById('scopeSelect').addEventListener('change', e => {
        console.log("Scope selected:", e.target.value);
    });

    // Smoothing
    const smoothingSlider = document.getElementById('smoothingSlider');
    const smoothingValue = document.getElementById('smoothingValue');
    const overlaySmoothing = document.getElementById('overlaySmoothing');
    smoothingSlider.addEventListener('input', () => {
        smoothingValue.textContent = smoothingSlider.value;
        overlaySmoothing.textContent = smoothingSlider.value;
    });

    // Discord
    document.getElementById('discordBtn').addEventListener('click', () => {
        navigator.clipboard.writeText("https://discord.gg/zVDfBnhW")
            .then(() => alert("Discord link copied to clipboard!"));
    });

    // FPS tracking
    let lastFrame = performance.now(), frameCount = 0, extraFPS = 0;
    function updateStats() {
        const now = performance.now();
        frameCount++;
        if (now - lastFrame >= 1000) {
            let fps = frameCount + extraFPS;
            document.getElementById('fps').textContent = fps;
            frameCount = 0;
            lastFrame = now;
        }

        document.getElementById('ping').textContent = Math.floor(Math.random() * 80) + 20;
        const gb = (performance.memory?.usedJSHeapSize || 0) / (1024 * 1024 * 1024);
        document.getElementById('memory').textContent = gb.toFixed(2);

        // Button count
        const buttons = menu.querySelectorAll('button').length;
        document.getElementById('buttonCount').textContent = buttons;

        requestAnimationFrame(updateStats);
    }
    updateStats();

    // Boost FPS button
    document.getElementById('boostFPSBtn').addEventListener('click', () => {
        extraFPS += 2;
        alert("+2 FPS activated 💨");
    });

    // Color Picker
    document.getElementById('colorPicker').addEventListener('input', (e) => {
        menu.style.background = e.target.value;
    });

    // Drag logic
    let isDragging = false, offset = [0, 0];
    const dragToggle = document.getElementById('dragToggle');
    menu.addEventListener('mousedown', function (e) {
        if (!dragToggle.checked) return;
        isDragging = true;
        offset = [
            menu.offsetLeft - e.clientX,
            menu.offsetTop - e.clientY
        ];
    });

    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('mousemove', (e) => {
        if (isDragging && dragToggle.checked) {
            e.preventDefault();
            menu.style.left = (e.clientX + offset[0]) + 'px';
            menu.style.top = (e.clientY + offset[1]) + 'px';
        }
    });
})();
