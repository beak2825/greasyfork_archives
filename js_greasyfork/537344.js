// ==UserScript==
// @name         1heo's Voxiom.io FPS Booster
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Improves FPS in Voxiom.io with optimization options and a toggleable UI
// @author       1heo
// @match        https://voxiom.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/537344/1heo%27s%20Voxiomio%20FPS%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/537344/1heo%27s%20Voxiomio%20FPS%20Booster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== FPS OPTIMIZATION FUNCTIONS =====
    function optimizePerformance() {
        // Remove or modify elements that impact FPS
        const optimizations = {
            reduceParticles: () => {
                const particles = document.querySelectorAll('.particle, .effect-particle');
                particles.forEach(p => p.remove());
                console.log('[1heo] Removed particles');
            },
            simplifyShadows: () => {
                document.querySelectorAll('*').forEach(el => {
                    el.style.boxShadow = 'none';
                    el.style.textShadow = 'none';
                });
                console.log('[1heo] Simplified shadows');
            },
            reduceAnimations: () => {
                document.querySelectorAll('*').forEach(el => {
                    el.style.animation = 'none';
                    el.style.transition = 'none';
                });
                console.log('[1heo] Reduced animations');
            },
            lowerRenderQuality: () => {
                const canvas = document.querySelector('canvas');
                if (canvas) {
                    canvas.style.imageRendering = 'pixelated';
                    console.log('[1heo] Lowered render quality');
                }
            }
        };

        // Apply all optimizations
        Object.values(optimizations).forEach(fn => {
            try { fn(); } catch (e) { console.error(e); }
        });
    }

    // ===== UI CREATION =====
    GM_addStyle(`
        @keyframes rainbow {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }

        /* Minimized UI */
        .heo-minimized-ui {
            position: fixed;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            background: rgba(48, 25, 52, 0.8);
            border-radius: 5px;
            padding: 8px 12px;
            color: white;
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            cursor: pointer;
            z-index: 9999;
            border: 1px solid #7d3bb8;
            backdrop-filter: blur(2px);
            transition: all 0.3s ease;
        }

        .heo-minimized-ui:hover {
            background: rgba(48, 25, 52, 0.9);
        }

        /* Full UI */
        .heo-full-ui {
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            background: #301934;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            z-index: 9999;
            font-family: 'Arial', sans-serif;
            width: 220px;
            display: none;
            backdrop-filter: blur(4px);
            border: 1px solid #7d3bb8;
        }

        .heo-title {
            margin: 0 0 15px 0;
            background: linear-gradient(to right,
                red, orange, yellow, green, blue, indigo, violet);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-weight: bold;
            font-size: 18px;
            text-align: center;
            animation: rainbow 3s linear infinite;
            background-size: 400% 100%;
        }

        .heo-option {
            margin: 10px 0;
            color: white;
            font-size: 14px;
        }

        .heo-button {
            background: linear-gradient(to right, #6a3093, #a044ff);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            margin: 5px 0;
            transition: all 0.2s;
        }

        .heo-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .heo-discord-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s;
            display: block;
            margin: 10px auto 0;
        }

        .heo-discord-icon:hover {
            transform: scale(1.1);
        }

        .heo-close-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 16px;
        }
    `);

    // Create minimized UI
    const minimizedUI = document.createElement('div');
    minimizedUI.className = 'heo-minimized-ui';
    minimizedUI.textContent = "Press K for 1heo's UI";
    minimizedUI.onclick = toggleUI;

    // Create full UI
    const fullUI = document.createElement('div');
    fullUI.className = 'heo-full-ui';
    fullUI.innerHTML = `
        <button class="heo-close-btn" onclick="this.parentElement.style.display='none'">×</button>
        <h2 class="heo-title">1heo's userscript</h2>

        <div class="heo-option">FPS Boost Options:</div>
        <button class="heo-button" onclick="optimizePerformance()">Apply All Optimizations</button>
        <button class="heo-button" onclick="location.reload()">Reset All Changes</button>

        <div style="text-align: center; margin-top: 15px; color: #aaa; font-size: 12px;">
            FPS improvements applied!
        </div>

        <a href="https://discord.gg/x3aUjnwbMt" target="_blank">
            <img class="heo-discord-icon" src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" alt="Join Discord">
        </a>
    `;

    // Toggle UI function
    function toggleUI() {
        fullUI.style.display = fullUI.style.display === 'block' ? 'none' : 'block';
    }

    // Keybind (K to toggle)
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'k') {
            toggleUI();
        }
    });

    // Add elements to page
    document.body.appendChild(minimizedUI);
    document.body.appendChild(fullUI);

    // Initial optimizations
    setTimeout(optimizePerformance, 2000);
})();