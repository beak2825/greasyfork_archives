// ==UserScript==
// @name         Voxiom.io AIMBOT ESP HACKS
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  VISUAL TESTING ONLY for Voxiom.io
// @author       1heo
// @match        https://voxiom.io/*
// @grant        none
// @icon         https://voxiom.io/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/537369/Voxiomio%20AIMBOT%20ESP%20HACKS.user.js
// @updateURL https://update.greasyfork.org/scripts/537369/Voxiomio%20AIMBOT%20ESP%20HACKS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Testing Features
    const testingFeatures = {
        esp: false,
        reduceLag: false
    };

    const highlights = new Map();

    function toggleFeature(feature) {
        testingFeatures[feature] = !testingFeatures[feature];
        updateVisuals();
        updateUI();
    }

    function showComingSoon() {
        const notice = document.createElement('div');
        notice.textContent = 'Coming soon!';
        notice.style.position = 'fixed';
        notice.style.top = '50%';
        notice.style.left = '50%';
        notice.style.transform = 'translate(-50%, -50%)';
        notice.style.backgroundColor = 'rgba(48, 25, 52, 0.9)';
        notice.style.color = 'white';
        notice.style.padding = '20px';
        notice.style.borderRadius = '10px';
        notice.style.border = '2px solid #8a2be2';
        notice.style.zIndex = '10001';
        notice.style.fontSize = '18px';
        notice.style.boxShadow = '0 0 20px rgba(0,0,0,0.7)';
        notice.style.animation = 'fadeInOut 2s forwards';
        
        document.body.appendChild(notice);
        setTimeout(() => notice.remove(), 2000);
    }

    function updateVisuals() {
        // Clear existing highlights
        highlights.forEach(hl => hl.remove());
        highlights.clear();

        if (testingFeatures.esp || testingFeatures.reduceLag) {
            const players = document.querySelectorAll('.player, [class*="character"]');
            players.forEach(player => {
                const highlight = document.createElement('div');
                highlight.style.position = 'absolute';
                highlight.style.border = testingFeatures.reduceLag 
                    ? '2px solid rgba(0, 255, 255, 0.7)' 
                    : '2px dashed rgba(255, 50, 50, 0.7)';
                highlight.style.borderRadius = '50%';
                highlight.style.pointerEvents = 'none';
                highlight.style.zIndex = '9999';
                document.body.appendChild(highlight);
                
                const updatePos = () => {
                    const rect = player.getBoundingClientRect();
                    highlight.style.width = `${rect.width + 20}px`;
                    highlight.style.height = `${rect.height + 20}px`;
                    highlight.style.left = `${rect.left - 10}px`;
                    highlight.style.top = `${rect.top - 10}px`;
                };
                
                updatePos();
                highlights.set(player, {element: highlight, update: updatePos});
            });
        }
    }

    // Enhanced UI with naming changes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% {color: red;}
            14% {color: orange;}
            28% {color: yellow;}
            42% {color: green;}
            57% {color: blue;}
            71% {color: indigo;}
            85% {color: violet;}
            100% {color: red;}
        }
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -40%); }
            20% { opacity: 1; transform: translate(-50%, -50%); }
            80% { opacity: 1; transform: translate(-50%, -50%); }
            100% { opacity: 0; transform: translate(-50%, -60%); }
        }
        #heo-test-ui {
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            background: rgba(48, 25, 52, 0.95);
            border: 2px solid #8a2be2;
            border-radius: 12px;
            padding: 20px;
            width: 240px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            box-shadow: 0 0 20px rgba(0,0,0,0.6);
            backdrop-filter: blur(5px);
        }
        #heo-test-title {
            text-align: center;
            margin: 0 0 20px 0;
            font-size: 20px;
            font-weight: bold;
            animation: rainbow 5s linear infinite;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .heo-test-control {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 15px 0;
            color: white;
            font-size: 14px;
        }
        .heo-test-switch {
            position: relative;
            display: inline-block;
            width: 55px;
            height: 28px;
        }
        .heo-test-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .heo-test-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #4a256a;
            transition: .4s;
            border-radius: 28px;
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
        }
        .heo-test-slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        input:checked + .heo-test-slider {
            background-color: #8a2be2;
        }
        input:checked + .heo-test-slider:before {
            transform: translateX(27px);
        }
        #heo-test-discord {
            display: block;
            width: 36px;
            height: 36px;
            margin: 10px auto;
            cursor: pointer;
            transition: all 0.3s;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        #heo-test-discord:hover {
            transform: scale(1.1);
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
        }
        .heo-test-divider {
            border-top: 1px solid rgba(255,255,255,0.1);
            margin: 15px 0;
        }
        .heo-test-button {
            background: rgba(72, 35, 100, 0.7);
            color: white;
            border: 1px solid #8a2be2;
            border-radius: 6px;
            padding: 10px;
            width: 100%;
            text-align: center;
            cursor: pointer;
            margin: 10px 0;
            transition: all 0.3s;
            opacity: 0.7;
        }
        .heo-test-button:hover {
            background: rgba(72, 35, 100, 0.9);
            opacity: 1;
        }
        .heo-test-button.locked {
            cursor: not-allowed;
            position: relative;
        }
        .heo-test-button.locked::after {
            content: "🔒";
            position: absolute;
            right: 10px;
        }
    `;
    document.head.appendChild(style);

    const ui = document.createElement('div');
    ui.id = 'heo-test-ui';
    ui.innerHTML = `
        <div id="heo-test-title">1heo's ESP and Aimbot</div>
        
        <div class="heo-test-control">
            <span>ESP</span>
            <label class="heo-test-switch">
                <input type="checkbox" id="heo-esp-toggle">
                <span class="heo-test-slider"></span>
            </label>
        </div>
        
        <div class="heo-test-control">
            <span>Reduce Lag</span>
            <label class="heo-test-switch">
                <input type="checkbox" id="heo-lag-toggle">
                <span class="heo-test-slider"></span>
            </label>
        </div>
        
        <div class="heo-test-divider"></div>
        
        <div class="heo-test-button locked" id="heo-aimbot-button">
            Aimbot (Locked)
        </div>
        
        <div class="heo-test-divider"></div>
        
        <a href="https://discord.gg/x3aUjnwbMt" target="_blank">
            <img id="heo-test-discord" src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" alt="Discord">
        </a>
    `;
    document.body.appendChild(ui);

    // UI Functions
    function updateUI() {
        document.getElementById('heo-esp-toggle').checked = testingFeatures.esp;
        document.getElementById('heo-lag-toggle').checked = testingFeatures.reduceLag;
    }

    document.getElementById('heo-esp-toggle').addEventListener('change', () => toggleFeature('esp'));
    document.getElementById('heo-lag-toggle').addEventListener('change', () => toggleFeature('reduceLag'));
    document.getElementById('heo-aimbot-button').addEventListener('click', showComingSoon);

    // Visual update loop
    setInterval(() => {
        if (testingFeatures.esp || testingFeatures.reduceLag) {
            highlights.forEach(data => data.update());
        }
    }, 100);

    console.log('%cVisual testing tool loaded - for legitimate purposes only', 'color: #8a2be2; font-weight: bold;');
})();