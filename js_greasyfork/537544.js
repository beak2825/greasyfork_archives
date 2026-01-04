// ==UserScript==
// @name         Nekoking Client! 1.1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enhanced customization for Poxel.io with RAVE, CHAOS, crosshair, color mod, ad remover, and more. (No Resolution Scale)
// @author       Nekoking!
// @match        *://poxel.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537544/Nekoking%20Client%21%2011.user.js
// @updateURL https://update.greasyfork.org/scripts/537544/Nekoking%20Client%21%2011.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- スタイル追加 ----------
    const style = document.createElement('style');
    style.textContent = `
        #gear-button {
            position: fixed;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            background-color: #222;
            padding: 10px;
            border-radius: 0 10px 10px 0;
            color: white;
            cursor: pointer;
            z-index: 9999;
            font-size: 20px;
        }
        #settings-panel {
            position: fixed;
            top: 50%;
            left: 50px;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.9);
            padding: 15px;
            color: white;
            border-radius: 10px;
            z-index: 9999;
            display: none;
            min-width: 250px;
        }
        .section {
            margin-bottom: 10px;
            border-bottom: 1px solid #555;
            padding-bottom: 10px;
        }
        .section:last-child {
            border-bottom: none;
        }
        label {
            display: block;
            margin: 4px 0;
        }
        .subpanel {
            margin-top: 8px;
            padding-left: 10px;
        }
        .slider {
            width: 100%;
        }
        #crosshair {
            position: fixed;
            z-index: 9998;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
        }
        #rave-overlay, #color-overlay, #chaos-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 9990;
            pointer-events: none;
        }
        #rave-overlay {
            background: linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet);
            mix-blend-mode: screen;
            opacity: 0.8;
            animation: rave 1s linear infinite;
            display: none;
        }
        #chaos-overlay {
            background: black;
            mix-blend-mode: difference;
            animation: chaos 0.3s infinite;
            display: none;
        }
        #color-overlay {
            background-color: rgba(255,0,0,0.2);
            mix-blend-mode: multiply;
            display: none;
        }
        @keyframes rave {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        @keyframes chaos {
            0% { background: red; }
            25% { background: yellow; }
            50% { background: lime; }
            75% { background: cyan; }
            100% { background: violet; }
        }
    `;
    document.head.appendChild(style);

    // ---------- オーバーレイ ----------
    const overlayRave = document.createElement('div');
    overlayRave.id = 'rave-overlay';
    document.body.appendChild(overlayRave);

    const overlayColor = document.createElement('div');
    overlayColor.id = 'color-overlay';
    document.body.appendChild(overlayColor);

    const overlayChaos = document.createElement('div');
    overlayChaos.id = 'chaos-overlay';
    document.body.appendChild(overlayChaos);

    // ---------- 歯車ボタン ----------
    const gear = document.createElement('div');
    gear.id = 'gear-button';
    gear.textContent = '⚙️';
    document.body.appendChild(gear);

    const panel = document.createElement('div');
    panel.id = 'settings-panel';
    document.body.appendChild(panel);

    gear.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    // ---------- UI ----------
    panel.innerHTML = `
        <div class="section">
            <label><input type="checkbox" id="enable-crosshair"> Enable Crosshair</label>
            <div id="crosshair-settings" class="subpanel" style="display:none;">
                <label>Type: <select id="crosshair-type"><option>Dot</option><option>Cross</option></select></label>
                <label>Size: <input type="range" id="crosshair-size" min="4" max="40" value="10" class="slider"></label>
                <label>Color: <input type="color" id="crosshair-color" value="#ffffff"></label>
            </div>
        </div>
        <div class="section">
            <label><input type="checkbox" id="enable-color"> Enable Color Mod</label>
            <div id="color-settings" class="subpanel" style="display:none;">
                <label>Color: <input type="color" id="color-mod-color" value="#ff0000"></label>
                <label>Opacity: <input type="range" id="color-mod-opacity" min="0" max="1" step="0.01" value="0.2" class="slider"></label>
            </div>
        </div>
        <div class="section">
            <label><input type="checkbox" id="enable-rave"> RAVE Mode</label>
        </div>
        <div class="section">
            <label><input type="checkbox" id="enable-chaos"> Chaos Mode</label>
        </div>
        <div class="section">
            <label><input type="checkbox" id="enable-performance"> Performance Mode</label>
        </div>
        <div class="section">
            <label><input type="checkbox" id="enable-removefx"> Remove Effects</label>
        </div>
        <div class="section">
            <label><input type="checkbox" id="enable-adblock"> Remove ADS</label>
        </div>
    `;

    // ---------- クロスヘア描画 ----------
    const crosshairCanvas = document.createElement('canvas');
    crosshairCanvas.id = 'crosshair';
    document.body.appendChild(crosshairCanvas);
    const ctx = crosshairCanvas.getContext('2d');

    function drawCrosshair() {
        const enabled = document.getElementById('enable-crosshair').checked;
        crosshairCanvas.style.display = enabled ? 'block' : 'none';
        if (!enabled) return;

        const type = document.getElementById('crosshair-type').value;
        const size = parseInt(document.getElementById('crosshair-size').value);
        const color = document.getElementById('crosshair-color').value;

        crosshairCanvas.width = size * 2;
        crosshairCanvas.height = size * 2;
        ctx.clearRect(0, 0, crosshairCanvas.width, crosshairCanvas.height);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;

        if (type === 'Dot') {
            ctx.beginPath();
            ctx.arc(size, size, size / 4, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(size, 0);
            ctx.lineTo(size, size * 2);
            ctx.moveTo(0, size);
            ctx.lineTo(size * 2, size);
            ctx.stroke();
        }
    }

    // ---------- イベント処理 ----------
    document.getElementById('enable-crosshair').addEventListener('change', e => {
        document.getElementById('crosshair-settings').style.display = e.target.checked ? 'block' : 'none';
        drawCrosshair();
    });
    ['crosshair-type', 'crosshair-size', 'crosshair-color'].forEach(id => {
        document.getElementById(id).addEventListener('input', drawCrosshair);
    });

    document.getElementById('enable-color').addEventListener('change', e => {
        document.getElementById('color-settings').style.display = e.target.checked ? 'block' : 'none';
        overlayColor.style.display = e.target.checked ? 'block' : 'none';
    });
    document.getElementById('color-mod-color').addEventListener('input', e => {
        overlayColor.style.backgroundColor = e.target.value;
    });
    document.getElementById('color-mod-opacity').addEventListener('input', e => {
        overlayColor.style.opacity = e.target.value;
    });

    document.getElementById('enable-rave').addEventListener('change', e => {
        overlayRave.style.display = e.target.checked ? 'block' : 'none';
    });

    document.getElementById('enable-chaos').addEventListener('change', e => {
        overlayChaos.style.display = e.target.checked ? 'block' : 'none';
    });

    document.getElementById('enable-performance').addEventListener('change', e => {
        document.body.style.imageRendering = e.target.checked ? 'pixelated' : '';
    });

    document.getElementById('enable-removefx').addEventListener('change', e => {
        const particleContainers = document.querySelectorAll('[class*=particle], [class*=fx]');
        particleContainers.forEach(el => el.style.display = e.target.checked ? 'none' : '');
    });

    document.getElementById('enable-adblock').addEventListener('change', e => {
        const ads = document.querySelectorAll('iframe, .ad, [id*=ads], [class*=ads], .adsbygoogle');
        ads.forEach(ad => ad.remove());
    });

    // 初期描画
    drawCrosshair();
})();
