// ==UserScript==
// @name         WormVision Lite MAX – Full ESP + Aimbot UI (CloudSafe/Chromebook)
// @namespace    http://wormgpt.blacklightrift
// @version      1.2
// @description  Chromebook-safe Fortnite ESP + Head Detection + FOV + Smooth Aimbot + Triggerbot | Runs on Xbox Cloud Gaming 🎯💻🧠
// @author       Worm
// @match        *://*.xbox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517058/WormVision%20Lite%20MAX%20%E2%80%93%20Full%20ESP%20%2B%20Aimbot%20UI%20%28CloudSafeChromebook%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517058/WormVision%20Lite%20MAX%20%E2%80%93%20Full%20ESP%20%2B%20Aimbot%20UI%20%28CloudSafeChromebook%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    ///////////////////////////////
    // === UI & STYLE SYSTEM === //
    ///////////////////////////////

    const style = document.createElement('style');
    style.innerHTML = `
        .worm-ui {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 280px;
            background: #0e0e12;
            border: 2px solid #8f00ff;
            border-radius: 12px;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 999999;
            padding: 12px;
            box-shadow: 0 0 12px #8f00ff88;
            display: none;
        }
        .worm-ui h2 {
            margin: 0 0 10px;
            font-size: 16px;
            text-align: center;
            color: #BB86FC;
        }
        .worm-ui label {
            display: flex;
            justify-content: space-between;
            margin: 6px 0;
        }
        .worm-ui input[type=checkbox], .worm-ui input[type=range] {
            transform: scale(1.2);
        }
        .worm-overlay, .worm-head {
            position: fixed;
            z-index: 999998;
            pointer-events: none;
        }
        .worm-box {
            border: 2px solid lime;
            background: rgba(0, 255, 0, 0.1);
            border-radius: 4px;
        }
        .worm-head {
            width: 6px;
            height: 6px;
            background: red;
            border-radius: 50%;
        }
        .worm-fov {
            border: 2px dashed rgba(255, 0, 255, 0.6);
            border-radius: 50%;
        }
    `;
    document.head.appendChild(style);

    const uiHTML = `
        <div class="worm-ui" id="wormMenu">
            <h2>🧠 WormVision Lite MAX</h2>
            <label>ESP <input type="checkbox" id="esp-toggle"></label>
            <label>Triggerbot <input type="checkbox" id="trigger-toggle"></label>
            <label>Soft Aim <input type="checkbox" id="aim-toggle"></label>
            <label>FOV Overlay <input type="checkbox" id="fov-toggle"></label>
            <label>Aim Smooth<input type="range" id="smooth-slider" min="1" max="10" value="4"></label>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', uiHTML);
    const menu = document.getElementById('wormMenu');

    // === Toggle Menu With Ctrl+Alt+G+3
    let buffer = [];
    window.addEventListener('keydown', e => {
        buffer.push(e.key.toLowerCase());
        if (buffer.length > 5) buffer.shift();
        if (buffer.join('-').includes('control-alt-g-3')) {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            buffer = [];
        }
    });

    ///////////////////////////
    // === STATE + LOGIC === //
    ///////////////////////////

    const config = {
        esp: false,
        triggerbot: false,
        aim: false,
        fov: false,
        smoothness: 4,
        aimKey: 'f',
        aimRadius: 100,
    };

    document.getElementById('esp-toggle').addEventListener('change', e => config.esp = e.target.checked);
    document.getElementById('trigger-toggle').addEventListener('change', e => config.triggerbot = e.target.checked);
    document.getElementById('aim-toggle').addEventListener('change', e => config.aim = e.target.checked);
    document.getElementById('fov-toggle').addEventListener('change', e => config.fov = e.target.checked);
    document.getElementById('smooth-slider').addEventListener('input', e => config.smoothness = parseInt(e.target.value));

    let aimX = 0, aimY = 0;

    function drawESP(x, y, w, h, scaleX, scaleY) {
        const box = document.createElement('div');
        box.className = 'worm-overlay worm-box';
        box.style.left = `${x * scaleX}px`;
        box.style.top = `${y * scaleY}px`;
        box.style.width = `${w * scaleX}px`;
        box.style.height = `${h * scaleY}px`;
        document.body.appendChild(box);
        setTimeout(() => box.remove(), 80);
    }

    function drawHead(x, y, scaleX, scaleY) {
        const dot = document.createElement('div');
        dot.className = 'worm-head';
        dot.style.left = `${x * scaleX}px`;
        dot.style.top = `${y * scaleY}px`;
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 80);
    }

    function drawFOV() {
        const fov = document.createElement('div');
        const size = config.aimRadius * 2;
        fov.className = 'worm-overlay worm-fov';
        fov.style.width = `${size}px`;
        fov.style.height = `${size}px`;
        fov.style.left = `calc(50% - ${config.aimRadius}px)`;
        fov.style.top = `calc(50% - ${config.aimRadius}px)`;
        document.body.appendChild(fov);
        setTimeout(() => fov.remove(), 80);
    }

    ///////////////////////////////
    // === VISION / AIM ENGINE ===
    ///////////////////////////////

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function scanFrame() {
        const video = document.querySelector('video');
        if (!video || video.videoWidth === 0) return;

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');

        try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const targets = [];

            for (let y = 0; y < canvas.height; y += 6) {
                for (let x = 0; x < canvas.width; x += 6) {
                    const idx = (y * canvas.width + x) * 4;
                    const r = pixels[idx], g = pixels[idx + 1], b = pixels[idx + 2];

                    if ((r > 200 && g < 80 && b < 80) || (r > 200 && g > 200 && b > 200)) {
                        targets.push({ x, y });
                    }
                }
            }

            const clusters = groupByProximity(targets, 40);
            const scaleX = window.innerWidth / canvas.width;
            const scaleY = window.innerHeight / canvas.height;
            let best = null;
            let bestDist = Infinity;

            clusters.forEach(cluster => {
                const minX = Math.min(...cluster.map(p => p.x));
                const minY = Math.min(...cluster.map(p => p.y));
                const maxX = Math.max(...cluster.map(p => p.x));
                const maxY = Math.max(...cluster.map(p => p.y));

                const width = maxX - minX;
                const height = maxY - minY;
                const headX = minX + width / 2;
                const headY = minY;

                if (config.esp) drawESP(minX, minY, width, height, scaleX, scaleY);
                if (config.esp) drawHead(headX, headY, scaleX, scaleY);

                const dx = headX - centerX;
                const dy = headY - centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < bestDist && dist < config.aimRadius) {
                    best = { dx, dy };
                    bestDist = dist;
                }
            });

            // Triggerbot
            if (config.triggerbot) {
                const mid = ctx.getImageData(centerX, centerY, 1, 1).data;
                if (mid[0] > 200 && mid[1] < 80 && mid[2] < 80) {
                    document.dispatchEvent(new KeyboardEvent('keydown', { key: config.aimKey, bubbles: true }));
                    document.dispatchEvent(new KeyboardEvent('keyup', { key: config.aimKey, bubbles: true }));
                }
            }

            // Aim assist
            if (config.aim && best) {
                aimX = lerp(aimX, best.dx, 1 / config.smoothness);
                aimY = lerp(aimY, best.dy, 1 / config.smoothness);
                window.dispatchEvent(new MouseEvent('mousemove', {
                    movementX: aimX / 4,
                    movementY: aimY / 4,
                    bubbles: true
                }));
            }

            if (config.fov) drawFOV();

        } catch (err) {
            // Ignore CORS errors
        }
    }

    function groupByProximity(points, threshold = 40) {
        const groups = [];
        points.forEach(p => {
            let added = false;
            for (let g of groups) {
                if (g.some(q => Math.hypot(p.x - q.x, p.y - q.y) < threshold)) {
                    g.push(p);
                    added = true;
                    break;
                }
            }
            if (!added) groups.push([p]);
        });
        return groups.filter(g => g.length > 5);
    }

    setInterval(scanFrame, 70);
})();
