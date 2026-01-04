// ==UserScript==
// @name         Bloxd.io Custom Crosshair with Pop + Toggle UI + 10 PNG Crosshairs + No PMC
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Crosshair selector with click animation, UI toggle (Right Shift), 10 PNG crosshair options for Bloxd.io. Supports images + pop animation + hide/show menu keybind.
// @author       bloxdcat
// @match        *://bloxd.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/537889/Bloxdio%20Custom%20Crosshair%20with%20Pop%20%2B%20Toggle%20UI%20%2B%2010%20PNG%20Crosshairs%20%2B%20No%20PMC.user.js
// @updateURL https://update.greasyfork.org/scripts/537889/Bloxdio%20Custom%20Crosshair%20with%20Pop%20%2B%20Toggle%20UI%20%2B%2010%20PNG%20Crosshairs%20%2B%20No%20PMC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const crosshairs = {
        'Dot': '●',
        'Cross': '+',
        'X': '×',
        'Circle': '◯',

        'Green Thin': 'https://iili.io/F9OUctp.png',
        'Red Cross': 'https://iili.io/F9OPz37.png',
        'Blue Cross': 'https://iili.io/F9OQxob.png',
        'Sniper Scope': 'https://iili.io/F9OZpCG.png',
        'Circle Crosshair': 'https://iili.io/F9Omht1.png',
        'New Stylish Crosshair': 'https://iili.io/F9OGR8F.png',
    };

    function createMenu() {
        const menu = document.createElement('div');
        menu.id = 'crosshair-menu';
        menu.innerHTML = `<h3>Crosshair Picker</h3>`;

        for (const [label, value] of Object.entries(crosshairs)) {
            const btn = document.createElement('button');
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'flex-start';
            btn.style.gap = '10px';

            const labelSpan = document.createElement('span');
            labelSpan.innerText = label;

            btn.appendChild(labelSpan);

            if (value.startsWith('http')) {
                const img = document.createElement('img');
                img.src = value;
                img.style.width = '24px';
                img.style.height = '24px';
                img.style.pointerEvents = 'none';
                btn.insertBefore(img, labelSpan);
            } else {
                const symbolSpan = document.createElement('span');
                symbolSpan.innerText = value;
                symbolSpan.style.color = 'red';
                symbolSpan.style.fontSize = '20px';
                symbolSpan.style.marginRight = '8px';
                btn.insertBefore(symbolSpan, labelSpan);
            }

            btn.onclick = () => {
                if (value.startsWith('http')) {
                    localStorage.setItem('customCrosshairType', 'image');
                    localStorage.setItem('customCrosshairImage', value);
                } else {
                    localStorage.setItem('customCrosshairType', 'symbol');
                    localStorage.setItem('customCrosshair', label);
                }
                updateCrosshair();
                document.getElementById('crosshair-menu').style.display = 'none';
            };
            menu.appendChild(btn);
        }

        const inputLabel = document.createElement('label');
        inputLabel.innerText = 'Image URL:';
        inputLabel.style.display = 'block';
        inputLabel.style.marginTop = '10px';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Paste image URL (e.g. Imgur)';
        input.style.width = '100%';
        input.value = localStorage.getItem('customCrosshairImage') || '';

        const saveBtn = document.createElement('button');
        saveBtn.innerText = 'Use Image';
        saveBtn.style.marginTop = '5px';
        saveBtn.onclick = () => {
            const url = input.value.trim();
            if (url) {
                localStorage.setItem('customCrosshairType', 'image');
                localStorage.setItem('customCrosshairImage', url);
                updateCrosshair();
                document.getElementById('crosshair-menu').style.display = 'none';
            }
        };

        menu.appendChild(inputLabel);
        menu.appendChild(input);
        menu.appendChild(saveBtn);

        document.body.appendChild(menu);
    }

    function updateCrosshair() {
        const display = document.getElementById('custom-crosshair');
        const type = localStorage.getItem('customCrosshairType');

        if (type === 'image') {
            const imgURL = localStorage.getItem('customCrosshairImage');
            display.innerHTML = `<img src="${imgURL}" style="width:30px; height:30px;" />`;
        } else {
            const saved = localStorage.getItem('customCrosshair') || 'Dot';
            const val = crosshairs[saved] || '●';
            display.textContent = val;
        }

        animatePop();
    }

    function animatePop() {
        const display = document.getElementById('custom-crosshair');
        display.classList.remove('pop-effect');
        void display.offsetWidth;
        display.classList.add('pop-effect');
    }

    function injectCrosshair() {
        const crosshair = document.createElement('div');
        crosshair.id = 'custom-crosshair';
        document.body.appendChild(crosshair);
        updateCrosshair();
    }

    function setupClickPop() {
        window.addEventListener('mousedown', (event) => {
            if (event.button === 0 || event.button === 2) {
                animatePop();
            }
        });
    }

    function setupUIToggle() {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'ShiftRight') {
                const menu = document.getElementById('crosshair-menu');
                if (menu) {
                    menu.style.display = (menu.style.display === 'none') ? 'block' : 'none';
                }
            }
        });
    }

    GM_addStyle(`
        #custom-crosshair {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: red;
            font-size: 24px;
            z-index: 9999;
            pointer-events: none;
        }
        #custom-crosshair img {
            pointer-events: none;
        }
        #crosshair-menu {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            z-index: 9999;
            font-family: sans-serif;
            width: 240px;
            max-height: 80vh;
            overflow-y: auto;
            border-radius: 8px;
        }
        #crosshair-menu button {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 10px;
            margin: 5px 0;
            width: 100%;
            cursor: pointer;
            background: #222;
            border: none;
            padding: 6px 8px;
            border-radius: 4px;
            color: white;
            font-size: 14px;
            transition: background 0.3s ease;
        }
        #crosshair-menu button:hover {
            background: #555;
        }
        #crosshair-menu input {
            margin-top: 4px;
            padding: 6px 8px;
            border-radius: 4px;
            border: none;
            font-size: 14px;
        }
        #crosshair-menu label {
            font-size: 14px;
        }
        @keyframes pop {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.4); }
            100% { transform: translate(-50%, -50%) scale(1); }
        }
        .pop-effect {
            animation: pop 0.2s ease-in-out;
        }
    `);

    window.addEventListener('load', () => {
        injectCrosshair();
        createMenu();
        setupClickPop();
        setupUIToggle();
    });
})();
