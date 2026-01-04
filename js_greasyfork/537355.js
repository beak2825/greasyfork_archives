// ==UserScript==
// @name         Tribals.io ESP
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  TESTING PURPOSES ONLY - Visual helper for Tribal.io
// @author       1heo
// @match        https://*.tribals.io/*
// @grant        GM_addStyle
// @icon         https://tribals.io/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/537355/Tribalsio%20ESP.user.js
// @updateURL https://update.greasyfork.org/scripts/537355/Tribalsio%20ESP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== TESTING FEATURES =====
    let visionHelperEnabled = false;
    const highlightedPlayers = new Map();
    const highlightStyle = {
        position: 'absolute',
        border: '3px solid red',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        pointerEvents: 'none',
        zIndex: '99999',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 15px rgba(255,0,0,0.7)'
    };

    function toggleVisionHelper() {
        visionHelperEnabled = !visionHelperEnabled;
        updateUI();
        if (!visionHelperEnabled) clearHighlights();
        console.log(`[1heo] Vision Helper ${visionHelperEnabled ? 'ENABLED' : 'DISABLED'}`);
    }

    function clearHighlights() {
        highlightedPlayers.forEach(highlight => highlight.remove());
        highlightedPlayers.clear();
    }

    function checkPlayerVisibility() {
        if (!visionHelperEnabled) return;
        
        clearHighlights();
        
        // TESTING PURPOSES ONLY - This would need proper game-specific selectors
        const players = document.querySelectorAll('.player-element, [class*="character"]'); 
        
        players.forEach(player => {
            const rect = player.getBoundingClientRect();
            const centerX = rect.left + rect.width/2;
            const centerY = rect.top + rect.height/2;
            
            // Check if player is in viewport (simple visibility check)
            if (isElementInViewport(player)) {
                const highlight = document.createElement('div');
                Object.assign(highlight.style, highlightStyle);
                document.body.appendChild(highlight);
                
                // Position highlight
                const updatePosition = () => {
                    const newRect = player.getBoundingClientRect();
                    highlight.style.left = `${newRect.left + newRect.width/2}px`;
                    highlight.style.top = `${newRect.top + newRect.height/2}px`;
                };
                
                updatePosition();
                highlightedPlayers.set(player, {element: highlight, update: updatePosition});
            }
        });
    }

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // ===== IMPROVED UI =====
    GM_addStyle(`
        @keyframes rainbow {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }
        
        .heo-ui-container {
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            background: rgba(48, 25, 52, 0.95);
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.5);
            z-index: 99999;
            font-family: 'Arial', sans-serif;
            width: 260px;
            backdrop-filter: blur(8px);
            border: 2px solid #9b4dff;
        }
        
        .heo-title {
            margin: 0 0 25px 0;
            background: linear-gradient(to right, 
                red, orange, yellow, green, blue, indigo, violet);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-weight: bold;
            font-size: 22px;
            text-align: center;
            animation: rainbow 4s linear infinite;
            background-size: 400% 100%;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        
        .heo-control-group {
            margin-bottom: 25px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .heo-toggle-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .heo-toggle-label {
            color: #e0d0ff;
            font-size: 16px;
            font-weight: 500;
            margin-right: 15px;
        }
        
        .heo-toggle {
            position: relative;
            display: inline-block;
            width: 65px;
            height: 34px;
        }
        
        .heo-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .heo-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #4a256a, #6a3093);
            transition: .4s;
            border-radius: 34px;
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
        }
        
        .heo-slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        input:checked + .heo-slider {
            background: linear-gradient(135deg, #6a3093, #a044ff);
        }
        
        input:checked + .heo-slider:before {
            transform: translateX(31px);
        }
        
        .heo-status {
            color: #ffa0a0;
            text-align: center;
            margin: 5px 0 0 0;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s;
        }
        
        .heo-status.active {
            color: #a0ffa0;
        }
        
        .heo-discord-btn {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s;
            display: block;
            margin: 20px auto 0;
            filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));
        }
        
        .heo-discord-btn:hover {
            transform: scale(1.15);
            filter: drop-shadow(0 5px 10px rgba(0,0,0,0.4));
        }
    `);

    // Create UI
    const uiContainer = document.createElement('div');
    uiContainer.className = 'heo-ui-container';
    uiContainer.innerHTML = `
        <h1 class="heo-title">1heo User Script</h1>
        
        <div class="heo-control-group">
            <div class="heo-toggle-container">
                <span class="heo-toggle-label">Vision Helper</span>
                <label class="heo-toggle">
                    <input type="checkbox" id="heo-vision-toggle">
                    <span class="heo-slider"></span>
                </label>
            </div>
            <p class="heo-status" id="heo-status">Currently Disabled</p>
        </div>
        
        <a href="https://discord.gg/x3aUjnwbMt" target="_blank">
            <img class="heo-discord-btn" src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" alt="Join Discord">
        </a>
    `;

    // Add UI to page
    document.body.appendChild(uiContainer);

    // Setup toggle
    const visionToggle = document.getElementById('heo-vision-toggle');
    const statusLabel = document.getElementById('heo-status');
    
    function updateUI() {
        statusLabel.textContent = visionHelperEnabled ? 'Active - Highlighting Visible Players' : 'Currently Disabled';
        statusLabel.classList.toggle('active', visionHelperEnabled);
        visionToggle.checked = visionHelperEnabled;
    }

    visionToggle.addEventListener('change', toggleVisionHelper);

    // Visibility check loop
    setInterval(checkPlayerVisibility, 200);

    // Update highlights when scrolling/resizing
    window.addEventListener('scroll', () => {
        if (visionHelperEnabled) {
            highlightedPlayers.forEach(data => data.update());
        }
    });

    window.addEventListener('resize', () => {
        if (visionHelperEnabled) checkPlayerVisibility();
    });

    // Initial UI update
    updateUI();

    // Disclaimer
    console.log('%c[1heo] This script is for TESTING PURPOSES ONLY', 'color: #a044ff; font-weight: bold;');
    console.log('%c[1heo] Not intended for actual gameplay advantage', 'color: #a044ff;');
    console.log('%c[1heo] Only highlights players currently visible on screen', 'color: #a044ff;');
})();