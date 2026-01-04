// ==UserScript==
// @name         1heo's Tribal.IO FPS Booster (1.1)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Boosts FPS by removing unnecessary elements & adds a toggleable UI
// @author       1heo
// @match        https://tribals.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/537289/1heo%27s%20TribalIO%20FPS%20Booster%20%2811%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537289/1heo%27s%20TribalIO%20FPS%20Booster%20%2811%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== FPS OPTIMIZATIONS =====
    function optimizePerformance() {
        // Remove unnecessary elements that slow down FPS
        const elementsToRemove = [
            '.Bear',           // Background clouds
            '.particles',        // Particle effects
            '.unnecessary-anim', // Any unnecessary animations
            'footer',            // Footer (if not needed)
            '[fps-heavy]'        // Custom attribute for heavy elements
        ];

        elementsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });

        // Reduce animation quality (if applicable)
        const gameCanvas = document.querySelector('canvas');
        if (gameCanvas) {
            gameCanvas.style.imageRendering = 'pixelated'; // Faster rendering
        }

        console.log('[1heo] FPS optimizations applied!');
    }

    // ===== TOGGLEABLE UI =====
    GM_addStyle(`
        @keyframes rainbow {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }
        .heo-minimized-ui {
            position: fixed;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            background: rgba(48, 25, 52, 0.7);
            border-radius: 5px;
            padding: 5px 10px;
            color: white;
            font-family: Arial, sans-serif;
            cursor: pointer;
            z-index: 9999;
            font-size: 12px;
            border: 1px solid #6a3093;
        }
        .heo-full-ui {
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            background: #301934;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            font-family: Arial, sans-serif;
            width: 200px;
            display: none;
        }
        .heo-title {
            margin-top: 0;
            margin-bottom: 15px;
            background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-weight: bold;
            animation: rainbow 2s linear infinite;
            text-align: center;
        }
        .heo-discord-icon {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            transition: transform 0.2s;
            display: block;
            margin: 10px auto;
        }
        .heo-discord-icon:hover {
            transform: scale(1.1);
        }
        .heo-close-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 14px;
        }
    `);

    // Create minimized UI (press K to open)
    const minimizedUI = document.createElement('div');
    minimizedUI.className = 'heo-minimized-ui';
    minimizedUI.textContent = "Press K for 1heo's UI";
    minimizedUI.onclick = toggleUI;

    // Create full UI
    const fullUI = document.createElement('div');
    fullUI.className = 'heo-full-ui';
    fullUI.innerHTML = `
        <button class="heo-close-btn" onclick="document.querySelector('.heo-full-ui').style.display = 'none'">×</button>
        <h2 class="heo-title">1heo's userscript</h2>
        <p style="color: white; text-align: center;">FPS Boost Active!</p>
        <a href="https://discord.gg/x3aUjnwbMt" target="_blank">
            <img class="heo-discord-icon" src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" alt="Discord">
        </a>
    `;

    document.body.appendChild(minimizedUI);
    document.body.appendChild(fullUI);

    // Toggle UI with K key
    function toggleUI() {
        if (fullUI.style.display === 'block') {
            fullUI.style.display = 'none';
        } else {
            fullUI.style.display = 'block';
        }
    }

    // Keybind (K to toggle)
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'k') {
            toggleUI();
        }
    });

    // ===== INITIALIZE =====
    optimizePerformance();
})();