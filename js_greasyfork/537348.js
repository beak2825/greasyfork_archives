// ==UserScript==
// @name         1heo's Kirka.io FPS Booster
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Improves FPS in Kirka.io with optimization options and toggleable UI
// @author       1heo
// @match        https://kirka.io/*
// @grant        GM_addStyle
// @icon         https://kirka.io/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/537348/1heo%27s%20Kirkaio%20FPS%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/537348/1heo%27s%20Kirkaio%20FPS%20Booster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== FPS OPTIMIZATION =====
    function optimizeGamePerformance() {
        // Remove heavy visual elements
        const elementsToRemove = [
            '.particles',
            '.smoke-effects',
            '.unnecessary-animations',
            'footer',
            '[data-heavy]'
        ];

        elementsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });

        // Reduce animation quality
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.animation = 'none';
            el.style.transition = 'none';
        });

        // Optimize canvas rendering
        const gameCanvases = document.querySelectorAll('canvas');
        gameCanvases.forEach(canvas => {
            canvas.style.imageRendering = 'optimizeSpeed';
            canvas.style.willChange = 'auto';
        });

        console.log('[1heo] FPS optimizations applied');
    }

    // ===== UI CREATION =====
    GM_addStyle(`
        @keyframes rainbow {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }

        /* Minimized UI */
        .heo-mini-ui {
            position: fixed;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            background: rgba(48, 25, 52, 0.85);
            border-radius: 8px;
            padding: 8px 12px;
            color: white;
            font-family: 'Arial', sans-serif;
            font-size: 13px;
            cursor: pointer;
            z-index: 99999;
            border: 1px solid #8a2be2;
            backdrop-filter: blur(3px);
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .heo-mini-ui:hover {
            background: rgba(72, 35, 100, 0.9);
        }

        /* Full UI */
        .heo-main-ui {
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            background: rgba(48, 25, 52, 0.95);
            border-radius: 12px;
            padding: 18px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.4);
            z-index: 99999;
            font-family: 'Arial', sans-serif;
            width: 240px;
            display: none;
            backdrop-filter: blur(5px);
            border: 1px solid #9b4dff;
        }

        .heo-rainbow-title {
            margin: 0 0 18px 0;
            background: linear-gradient(to right,
                #ff0000, #ff8000, #ffff00, #00ff00,
                #0000ff, #4b0082, #9400d3);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-weight: bold;
            font-size: 20px;
            text-align: center;
            animation: rainbow 4s linear infinite;
            background-size: 500% 100%;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .heo-ui-section {
            margin: 15px 0;
            color: #e0d0ff;
            font-size: 14px;
        }

        .heo-ui-btn {
            background: linear-gradient(135deg, #6a3093, #a044ff);
            color: white;
            border: none;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
            width: 100%;
            margin: 8px 0;
            transition: all 0.25s;
            font-weight: bold;
            box-shadow: 0 3px 6px rgba(0,0,0,0.2);
        }

        .heo-ui-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 10px rgba(0,0,0,0.3);
            background: linear-gradient(135deg, #7a40a3, #b054ff);
        }

        .heo-discord-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s;
            display: block;
            margin: 15px auto 0;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        .heo-discord-btn:hover {
            transform: scale(1.15);
        }

        .heo-close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: #d0b0ff;
            cursor: pointer;
            font-size: 18px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s;
        }

        .heo-close-btn:hover {
            background: rgba(255,255,255,0.1);
            color: white;
        }
    `);

    // Create minimized UI
    const miniUI = document.createElement('div');
    miniUI.className = 'heo-mini-ui';
    miniUI.textContent = "Press K for 1heo's UI";
    miniUI.onclick = toggleMainUI;

    // Create main UI
    const mainUI = document.createElement('div');
    mainUI.className = 'heo-main-ui';
    mainUI.innerHTML = `
        <button class="heo-close-btn" onclick="this.parentElement.style.display='none'">×</button>
        <h1 class="heo-rainbow-title">1heo's userscript</h1>

        <div class="heo-ui-section">FPS Boost Options:</div>
        <button class="heo-ui-btn" onclick="optimizeGamePerformance()">Apply All Optimizations</button>
        <button class="heo-ui-btn" onclick="window.location.reload()">Reset All Changes</button>

        <div style="text-align: center; margin-top: 20px; color: #c0a0ff; font-size: 12px;">
            Enjoy smoother gameplay!
        </div>

        <a href="https://discord.gg/x3aUjnwbMt" target="_blank">
            <img class="heo-discord-btn" src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" alt="Join Discord">
        </a>
    `;

    // Toggle UI function
    function toggleMainUI() {
        mainUI.style.display = mainUI.style.display === 'block' ? 'none' : 'block';
    }

    // Keybind (K to toggle)
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'k') {
            toggleMainUI();
        }
    });

    // Add elements to page
    document.body.appendChild(miniUI);
    document.body.appendChild(mainUI);

    // Apply initial optimizations after 3 seconds
    setTimeout(optimizeGamePerformance, 3000);
})();