// ==UserScript==
// @name         KEY STROKE[Unhorion]
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Unhorion Client Key Stroke module[only key stroke module] "h" to move gui "[" to make the key stroke smaller and "]"to make the gui bigger
// @author       Unhorion[prompt_kak_joke_preash]
// @icon         https://i.postimg.cc/Y0J0JxPJ/Untitled3-20250614193932.png
// @match        *://bloxd.io/*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/540360/KEY%20STROKE%5BUnhorion%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/540360/KEY%20STROKE%5BUnhorion%5D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const COOKIE_NAME = "unhConfig";
    function saveCookie(data) {
        document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=31536000`;
    }
    function loadCookie() {
        const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
        return match ? JSON.parse(decodeURIComponent(match[1])) : null;
    }

    GM_addStyle(`
        .unh-container {
            position: fixed;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: 'Segoe UI', 'Arial', sans-serif;
            z-index: 9999;
            gap: 10px;
            pointer-events: none;
            outline: none;
            transition: outline 0.2s ease;
        }

        .unh-row {
            display: flex;
            justify-content: center;
            gap: 14px;
        }

        .unh-box {
            width: 60px;
            height: 60px;
            background: rgba(10, 10, 20, 0.5);
            border: 1px solid rgba(0, 153, 255, 0.3);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            color: #66ccff;
            font-weight: 600;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 12px rgba(0, 153, 255, 0.3);
            transition: 0.25s ease;
            user-select: none;
            pointer-events: auto;
            cursor: default;
        }

        .unh-box.active {
            transform: scale(1.12);
            background: rgba(0, 20, 40, 0.8);
            box-shadow: 0 0 20px rgba(0, 170, 255, 0.6);
            color: #00eaff;
        }

        .unh-box.space-box {
            width: 200px;
            height: 44px;
            font-size: 15px;
            position: relative;
            background: rgba(5,10,30,0.5);
        }

        .unh-box.space-box::after {
            content: '';
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 3px;
            background: linear-gradient(90deg, #00bfff, #0088ff);
            border-radius: 3px;
        }

        .unh-stats {
            color: #88ccff;
            font-size: 14px;
            display: flex;
            gap: 20px;
            margin-top: 8px;
            text-shadow: 0 0 4px #000;
        }

        .unh-credit {
            color: #777;
            font-size: 12px;
            font-style: italic;
            margin-top: 6px;
            text-align: center;
            text-shadow: 0 0 2px black;
        }

        .unh-container .unh-box:hover {
            transform: scale(1.15);
            box-shadow: 0 0 22px rgba(0, 195, 255, 0.7);
            cursor: pointer;
        }
    `);

    const hud = document.createElement('div');
    hud.className = 'unh-container';

    const createRow = (...labels) => {
        const row = document.createElement('div');
        row.className = 'unh-row';
        const map = {};
        for (let label of labels) {
            const box = document.createElement('div');
            box.className = 'unh-box';
            box.innerText = label;
            row.appendChild(box);
            map[label.toLowerCase()] = box;
        }
        hud.appendChild(row);
        return map;
    };

    const rowW = createRow('W');
    const rowASD = createRow('A', 'S', 'D');

    const rowSpace = document.createElement('div');
    rowSpace.className = 'unh-row';
    const spaceBox = document.createElement('div');
    spaceBox.className = 'unh-box space-box';
    spaceBox.innerText = 'SPACE';
    rowSpace.appendChild(spaceBox);
    hud.appendChild(rowSpace);

    const rowMouse = createRow('LMB', 'RMB');

    const stats = document.createElement('div');
    stats.className = 'unh-stats';
    const cpsText = document.createElement('div');
    const fpsText = document.createElement('div');
    stats.appendChild(cpsText);
    stats.appendChild(fpsText);
    hud.appendChild(stats);

    const credit = document.createElement('div');
    credit.className = 'unh-credit';
    credit.innerHTML = `
        <img src="https://i.postimg.cc/Y0J0JxPJ/Untitled3-20250614193932.png" alt="Logo" style="height: 18px; vertical-align: middle; margin-right: 6px;">
        Unhorion Client [KEYSTROKE NO MODULE]
    `;
    hud.appendChild(credit);
    document.body.appendChild(hud);

    //
    const saved = loadCookie();
    let isEditingHUD = false;
    let scale = saved?.scale || 1;
    hud.style.left = saved?.x || '30px';
    hud.style.top = saved?.y || '';
    hud.style.bottom = saved?.bottom || '30px';
    hud.style.transform = `scale(${scale})`;

    const keyMap = { w: rowW['w'], a: rowASD['a'], s: rowASD['s'], d: rowASD['d'] };
    document.addEventListener('keydown', e => {
        const k = e.key.toLowerCase();
        if (keyMap[k]) keyMap[k].classList.add('active');
        if (k === ' ') spaceBox.classList.add('active');
    });
    document.addEventListener('keyup', e => {
        const k = e.key.toLowerCase();
        if (keyMap[k]) keyMap[k].classList.remove('active');
        if (k === ' ') spaceBox.classList.remove('active');
    });

    let lmb = 0, rmb = 0;
    document.addEventListener('mousedown', e => {
        if (e.button === 0) { lmb++; rowMouse['lmb'].classList.add('active'); }
        if (e.button === 2) { rmb++; rowMouse['rmb'].classList.add('active'); }
    });
    document.addEventListener('mouseup', e => {
        if (e.button === 0) rowMouse['lmb'].classList.remove('active');
        if (e.button === 2) rowMouse['rmb'].classList.remove('active');
    });

    setInterval(() => {
        cpsText.innerText = `${lmb + rmb} CPS`;
        lmb = 0; rmb = 0;
    }, 1000);

    let last = performance.now(), frames = 0;
    function measureFPS(now) {
        frames++;
        if (now - last >= 1000) {
            fpsText.innerText = `FPS: ${frames}`;
            frames = 0; last = now;
        }
        requestAnimationFrame(measureFPS);
    }
    requestAnimationFrame(measureFPS);

    //
    let offsetX = 0, offsetY = 0, isDragging = false;
    hud.addEventListener('mousedown', e => {
        if (!isEditingHUD) return;
        isDragging = true;
        offsetX = e.clientX - hud.offsetLeft;
        offsetY = e.clientY - hud.offsetTop;
    });
    document.addEventListener('mousemove', e => {
        if (!isEditingHUD || !isDragging) return;
        hud.style.left = `${e.clientX - offsetX}px`;
        hud.style.top = `${e.clientY - offsetY}px`;
        hud.style.bottom = 'unset';
    });
    document.addEventListener('mouseup', () => { isDragging = false; });

    document.addEventListener('keydown', e => {
        const key = e.key.toLowerCase();
        if (key === 'h') {
            isEditingHUD = !isEditingHUD;
            hud.style.outline = isEditingHUD ? '2px solid #00ffffaa' : 'none';
            hud.style.cursor = isEditingHUD ? 'grab' : 'default';
            if (!isEditingHUD) {
                saveCookie({
                    x: hud.style.left,
                    y: hud.style.top,
                    bottom: hud.style.bottom,
                    scale
                });
            }
        }

        //
        if (isEditingHUD && key === '[') {
            scale = Math.max(0.5, scale - 0.05);
            hud.style.transform = `scale(${scale})`;
        }
        if (isEditingHUD && key === ']') {
            scale = Math.min(2, scale + 0.05);
            hud.style.transform = `scale(${scale})`;
        }
    });
})();

(function () {
    'use strict';

    const COOKIE_NAME = "unhConfig";
    function saveCookie(data) {
        document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=31536000`;
    }
    function loadCookie() {
        const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
        return match ? JSON.parse(decodeURIComponent(match[1])) : null;
    }

    GM_addStyle(`
        .unh-container, .module-box, .settings-panel, .module-overlay {
            font-family: 'Segoe UI', 'Arial', sans-serif;
            z-index: 9999;
        }
        .module-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.45);
            backdrop-filter: blur(8px);
            display: none;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease forwards;
        }
        .module-box {
            background: rgba(10,10,20,0.9);
            border: 1px solid #00ccff;
            border-radius: 16px;
            padding: 12px 14px;
            color: white;
            box-shadow: 0 0 15px #00ccff66;
            width: 260px;
            transform: scale(0.95);
            opacity: 0;
            animation: popIn 0.3s ease forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes popIn {
            to { transform: scale(1); opacity: 1; }
        }
        .module-box h3 {
            margin-top: 0;
            font-size: 18px;
            text-align: center;
            margin-bottom: 12px;
            color: #00ccff;
        }
        .module-entry {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding: 6px 8px;
            background: rgba(0,0,0,0.4);
            border-radius: 8px;
        }
        .module-entry button {
            margin-left: 5px;
            padding: 2px 8px;
            border-radius: 6px;
            border: none;
            background: #111;
            color: #00ccff;
            cursor: pointer;
            transition: 0.2s;
        }
        .module-entry button:hover {
            background: #00ccff;
            color: #000;
        }
        .settings-panel {
            display: none;
            position: fixed;
            top: 200px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(10,10,20,0.95);
            border: 1px solid #00ccff;
            padding: 12px;
            border-radius: 12px;
            color: white;
            box-shadow: 0 0 15px #00ccff66;
        }
        .settings-panel label {
            display: block;
            margin-bottom: 8px;
        }
        .settings-panel input[type="range"] {
            width: 150px;
        }
        .fov-circle {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 8888;
        }
    `);

    const overlay = document.createElement('div');
    overlay.className = 'module-overlay';

    const moduleBox = document.createElement('div');
    moduleBox.className = 'module-box';
    moduleBox.innerHTML = `
        <h3>Unhorion Modules</h3>
        <div class="module-entry">
            <span>Aim Helper</span>
            <div>
                <button id="aimToggle">OFF</button>
                <button id="aimSettings">⚙️</button>
            </div>
        </div>
    `;

    overlay.appendChild(moduleBox);
    document.body.appendChild(overlay);

    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'settings-panel';
    settingsPanel.innerHTML = `
        <label>FOV Radius: <input id="fovRadius" type="range" min="50" max="400" value="150"></label>
        <label><input type="checkbox" id="rgbToggle" checked> RGB Mode</label>
        <label>Static Color: <input type="color" id="staticColor" value="#00ffff"></label>
    `;
    document.body.appendChild(settingsPanel);

    let aimEnabled = false;
    const aimToggle = moduleBox.querySelector('#aimToggle');
    const aimSettings = moduleBox.querySelector('#aimSettings');

    aimToggle.onclick = () => {
        aimEnabled = !aimEnabled;
        aimToggle.textContent = aimEnabled ? 'ON' : 'OFF';
        updateFOV();
    };

    aimSettings.onclick = () => {
        settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    };

    document.getElementById('fovRadius').addEventListener('input', updateFOV);
    document.getElementById('rgbToggle').addEventListener('change', updateFOV);
    document.getElementById('staticColor').addEventListener('input', updateFOV);

    document.addEventListener('keydown', e => {
        if (e.code === 'ShiftRight') {
            overlay.style.display = overlay.style.display === 'none' ? 'flex' : 'none';
            if (overlay.style.display === 'none') settingsPanel.style.display = 'none';
        }
    });

    const circle = document.createElement('div');
    circle.className = 'fov-circle';
    document.body.appendChild(circle);

    function updateFOV() {
        if (!aimEnabled) {
            circle.style.display = 'none';
            return;
        }

        const radius = parseInt(document.getElementById('fovRadius').value);
        const rgb = document.getElementById('rgbToggle').checked;
        const staticColor = document.getElementById('staticColor').value;

        circle.style.display = 'block';
        circle.style.width = `${radius * 2}px`;
        circle.style.height = `${radius * 2}px`;
        circle.style.border = `2px solid ${rgb ? getRGBColor() : staticColor}`;
    }

    setInterval(() => {
        if (!aimEnabled) return;
        const rgb = document.getElementById('rgbToggle').checked;
        if (rgb) circle.style.border = `2px solid ${getRGBColor()}`;
    }, 75);

    function getRGBColor() {
        const time = Date.now() / 1000;
        const r = Math.floor(Math.sin(time * 2) * 127 + 128);
        const g = Math.floor(Math.sin(time * 2 + 2) * 127 + 128);
        const b = Math.floor(Math.sin(time * 2 + 4) * 127 + 128);
        return `rgb(${r},${g},${b})`;
    }
})();
