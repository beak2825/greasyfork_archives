// ==UserScript==
// @name         Crosshair
// @version      1.4 or 1.5 (I don't remember tbh)
// @description Custom Crosshairs for poxel.io
// @author        ceborix
// @match        *://*poxel.io/*
// @match        *://*kour.io/*
// @match        *://*cryzen.io/*
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/533746/Crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/533746/Crosshair.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'crosshair-settings';
    function saveSettings(style) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ style }));
    }
    function loadSettings() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    }

    const state = {
        currentStyle: 'ceborix',
        ...loadSettings()
    };

    const crosshair = document.createElement('div');
    crosshair.id = 'custom-crosshair';
    crosshair.style.position = 'fixed';
    crosshair.style.top = '50%';
    crosshair.style.left = '50%';
    crosshair.style.transform = 'translate(-50%, -50%)';
    crosshair.style.zIndex = '9999';
    crosshair.style.pointerEvents = 'none';
    document.body.appendChild(crosshair);

    function clearCrosshair() {
        crosshair.innerHTML = '';
        crosshair.style.background = '';
        crosshair.style.border = '';
        crosshair.style.borderRadius = '';
        crosshair.style.filter = '';
        crosshair.style.width = '';
        crosshair.style.height = '';
        crosshair.style.maskImage = '';
        crosshair.style.webkitMaskImage = '';
        crosshair.style.display = 'none';
    }

    function applyCrosshair(style) {
        clearCrosshair();
        if (!style) return;

        crosshair.style.display = 'flex';
        crosshair.style.alignItems = 'center';
        crosshair.style.justifyContent = 'center';

               switch (style) {
           case 'myrrr':
                crosshair.style.width = '15px';
                crosshair.style.height = '15px';
                crosshair.style.filter = 'drop-shadow(0 0 1px #fff) drop-shadow(0 0 2px #cc88ff)';
                const horiz = document.createElement('div');
                Object.assign(horiz.style, {
                    position: 'absolute',
                    width: '15px',
                    height: '3px',
                    background: 'linear-gradient(to bottom, #ffffff, #e0ccff)',
                    borderRadius: '1px',
                });
                const vert = document.createElement('div');
                Object.assign(vert.style, {
                    position: 'absolute',
                    width: '3px',
                    height: '15px',
                    background: 'linear-gradient(to bottom, #ffffff, #e0ccff)',
                    borderRadius: '1px',
                });
                crosshair.appendChild(horiz);
                crosshair.appendChild(vert);
                break;

            case 'dot':
                crosshair.style.width = '6px';
                crosshair.style.height = '6px';
                crosshair.style.borderRadius = '50%';
                crosshair.style.background = '#fff';
                crosshair.style.filter = 'drop-shadow(0 0 4px #66f)';
                break;

            case 'shotgun':
                crosshair.style.width = '40px';
                crosshair.style.height = '40px';
                crosshair.style.border = '4px solid #fff';
                crosshair.style.borderRadius = '50%';
                crosshair.style.boxSizing = 'border-box';
                crosshair.style.background = '(#fff, 0.1)';
                crosshair.style.filter = 'drop-shadow(0 0 8px #66f';
                break;

            case 'ceborix':
                crosshair.style.width = '11px';
                crosshair.style.height = '11px';
                crosshair.style.filter = '';
                const horizCeborix = document.createElement('div');
                Object.assign(horizCeborix.style, {
                    position: 'absolute',
                    width: '11px',
                    height: '3px',
                    background: '#fff',
                    borderRadius: '1px',
                });
                const vertCeborix = document.createElement('div');
                Object.assign(vertCeborix.style, {
                    position: 'absolute',
                    width: '3px',
                    height: '11px',
                    background: '#fff',
                    borderRadius: '1px',
                });
                crosshair.appendChild(horizCeborix);
                crosshair.appendChild(vertCeborix);
                break;
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        #crosshair-settings {
        position: fixed;
        top: 100px;
        right: 10px;
        z-index: 99999;
        font-family: Arial, sans-serif;
        background-color: #222;
        border-radius: 20px;
        padding: 10px;
        width: auto;
        height: auto;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }

        #crosshair-settings-button {
            background: transparent;
            border: none;
            font-size: 24px;
            color: #fff;
            cursor: pointer;
            filter: drop-shadow(0 0 3px #000);
            transition: transform 0.3s ease;
        }

        #crosshair-settings-button:hover {
            transform: scale(1.1);
        }

        #crosshair-menu {
            display: none;
            flex-direction: column;
            margin-top: 10px;
            background: rgba(30, 30, 30, 0.95);
            border-radius: 10px;
            padding: 10px;
            box-shadow: 0 0 10px #000;
            transition: opacity 0.3s ease-in-out;
        }

        .crosshair-option {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 8px 0;
            color: #fff;
            font-size: 14px;
            gap: 8px;
            flex-wrap: nowrap
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 20px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: #4caf50;
        }

        input:checked + .slider:before {
            transform: translateX(20px);
        }
    `;
    document.head.appendChild(style);

    const menuContainer = document.createElement('div');
    menuContainer.id = 'crosshair-settings';

    const settingsButton = document.createElement('button');
    settingsButton.id = 'crosshair-settings-button';
    settingsButton.innerHTML = '⚙️';

    const menu = document.createElement('div');
    menu.id = 'crosshair-menu';

const crosshairOptions = [
    { label: "ceborix's crosshair", key: 'ceborix' },
    { label: "myrrr's crosshair", key: 'myrrr' },
    { label: 'Dot', key: 'dot' },
    { label: 'Shotgun', key: 'shotgun' }
];

    function createOption(label, styleKey) {
        const row = document.createElement('div');
        row.className = 'crosshair-option';

        const text = document.createElement('span');
        text.textContent = label;

        const toggleContainer = document.createElement('label');
        toggleContainer.className = 'switch';

        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.checked = state.currentStyle === styleKey;

        const slider = document.createElement('span');
        slider.className = 'slider';

        toggle.onchange = () => {
            if (toggle.checked) {
                state.currentStyle = styleKey;
                saveSettings(state.currentStyle);
                applyCrosshair(state.currentStyle);

                document.querySelectorAll('#crosshair-menu input[type=checkbox]').forEach(cb => {
                    if (cb !== toggle) cb.checked = false;
                });
            } else {
                state.currentStyle = null;
                saveSettings(null);
                clearCrosshair();
            }
        };

        toggleContainer.appendChild(toggle);
        toggleContainer.appendChild(slider);
        row.appendChild(text);
        row.appendChild(toggleContainer);
        return row;
    }

    crosshairOptions.forEach(opt => menu.appendChild(createOption(opt.label, opt.key)));

    menuContainer.onclick = (e) => {
    if (e.target.closest('#crosshair-menu')) return;

        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    };


    menuContainer.appendChild(settingsButton);
    menuContainer.appendChild(menu);
    document.body.appendChild(menuContainer);

    applyCrosshair(state.currentStyle);
})();

//I miss you m̈