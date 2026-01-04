// ==UserScript==
// @name         Warbrokers Crosshair Overlay
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  Crosshair overlay for Warbrokers
// @author       Happyjeffery
// @match        https://warbrokers.io/game3d.php*
// @icon         https://i.imgur.com/11sYWVM.png
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/531567/Warbrokers%20Crosshair%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/531567/Warbrokers%20Crosshair%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Styles
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Roquen:wght@700&display=swap');

        .crosshair-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        .crosshair {
            position: relative;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            border: 2px solid red;
            background: transparent;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        .lines div {
            position: absolute;
            background: transparent;
            border: 1px solid red;
        }
        .lines .top { width: 2px; height: 15px; top: -20px; left: 50%; transform: translateX(-50%); }
        .lines .bottom { width: 2px; height: 15px; bottom: -20px; left: 50%; transform: translateX(-50%); }
        .lines .left { width: 15px; height: 2px; left: -20px; top: 50%; transform: translateY(-50%); }
        .lines .right { width: 15px; height: 2px; right: -20px; top: 50%; transform: translateY(-50%); }
        .circle {
            width: 30px;
            height: 30px;
            border: 2px solid red;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: transparent;
        }
        .headkiller {
            width: 30px;
            height: 30px;
            border: 2px solid red;
            border-radius: 7px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: transparent;
        }
        .headkiller:before {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            border: 2px solid red;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: transparent;
        }
        .headkiller:after {
            content: '';
            position: absolute;
            width: 4px;
            height: 4px;
            background: red;
            border-radius: 50%;
            top: 6px;
            right: 6px;
        }
        .plus {
            width: 24px;
            height: 24px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        .plus:before, .plus:after {
            content: '';
            position: absolute;
            background: red;
        }
        .plus:before {
            width: 2px;
            height: 100%;
            left: 50%;
            transform: translateX(-50%);
        }
        .plus:after {
            width: 100%;
            height: 2px;
            top: 50%;
            transform: translateY(-50%);
        }
        .x-cross {
            width: 24px;
            height: 24px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
        }
        .x-cross:before, .x-cross:after {
            content: '';
            position: absolute;
            background: red;
            width: 2px;
            height: 100%;
            left: 50%;
            transform: translateX(-50%);
        }
        .x-cross:after {
            transform: translateX(-50%) rotate(90deg);
        }
        .menu {
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: #0a1f44;
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            display: none;
            text-align: center;
            width: auto;
            white-space: nowrap;
            z-index: 10000;
            font-family: Arial, sans-serif;
        }
        .menu h2 {
            color: purple;
            font-family: 'Roquen', sans-serif;
            font-size: 12px;
            font-weight: bold;
            margin: 0 0 5px;
        }
        .menu button, .menu input {
            margin: 5px;
            background: #123c69;
            color: white;
            border: none;
            padding: 8px;
            cursor: pointer;
            border-radius: 5px;
        }
        .customization-panel {
            display: none;
            background: #0a1f44;
            padding: 10px;
            border-radius: 10px;
            margin-top: 10px;
        }
        #colorPicker {
            width: 40px;
            height: 40px;
            border: none;
            cursor: pointer;
            vertical-align: middle;
        }
        .settings-label {
            display: inline-block;
            margin-right: 10px;
            vertical-align: middle;
        }
    `;
    document.head.appendChild(style);

    // Create crosshair overlay
    const crosshairOverlay = document.createElement('div');
    crosshairOverlay.className = 'crosshair-overlay';
    crosshairOverlay.id = 'crosshairOverlay';
    document.body.appendChild(crosshairOverlay);

    // Create crosshair
    const crosshair = document.createElement('div');
    crosshair.className = 'crosshair';
    crosshair.id = 'crosshair';
    crosshair.innerHTML = '<div class="dot"></div><div class="lines"><div class="top"></div><div class="bottom"></div><div class="left"></div><div class="right"></div></div><div class="circle"></div>';
    crosshairOverlay.appendChild(crosshair);

    // Menu
    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.id = 'crosshairMenu';
    menu.innerHTML = `
        <h2>Developed By: Happyjeffery</h2>
        <button id="toggleCrosshairBtn">Turn Off Crosshair</button>
        <button id="dotBtn">Dot</button>
        <button id="linesBtn">Lines</button>
        <button id="dotCircleBtn">Dot + Circle</button>
        <button id="plusBtn">Plus Sign</button>
        <button id="xCrossBtn">X Cross</button>
        <button id="headkillerBtn">Head Killer</button>
        <button id="customizationBtn">Customization</button>
        <div class="customization-panel" id="customizationPanel">
            <span class="settings-label">Color:</span>
            <input type="color" id="colorPicker" value="#ff0000">
            <button id="rgbBtn">Toggle RGB Mode</button>
        </div>
    `;
    document.body.appendChild(menu);

    let isVisible = true;
    let menuVisible = false;
    let rgbMode = false;
    let hue = 0;
    let rgbInterval;

    // Functions
    function toggleCrosshair() {
        isVisible = !isVisible;
        crosshair.style.display = isVisible ? "flex" : "none";
        document.getElementById("toggleCrosshairBtn").innerText = isVisible ? "Turn Off Crosshair" : "Turn On Crosshair";
    }

    function changeCrosshair(type) {
        crosshair.innerHTML = '';
        if (type === "dot") {
            crosshair.innerHTML = '<div class="dot"></div>';
        } else if (type === "lines") {
            crosshair.innerHTML = '<div class="lines"><div class="top"></div><div class="bottom"></div><div class="left"></div><div class="right"></div></div>';
        } else if (type === "dot-circle") {
            crosshair.innerHTML = '<div class="dot"></div><div class="lines"><div class="top"></div><div class="bottom"></div><div class="left"></div><div class="right"></div></div><div class="circle"></div>';
        } else if (type === "headkiller") {
            crosshair.innerHTML = '<div class="headkiller"></div>';
        } else if (type === "plus") {
            crosshair.innerHTML = '<div class="plus"></div>';
        } else if (type === "x-cross") {
            crosshair.innerHTML = '<div class="x-cross"></div>';
        }
        updateColor();
    }

    function updateColor() {
        const color = rgbMode ? `hsl(${hue}, 100%, 50%)` : document.getElementById("colorPicker").value;

        // Create a new style element for all crosshair styles
        let styleElement = document.getElementById('crosshairStyle');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'crosshairStyle';
            document.head.appendChild(styleElement);
        }

        // Update all styles via CSS
        styleElement.innerHTML = `
            .dot {
                border-color: ${color} !important;
            }
            .lines div {
                border-color: ${color} !important;
            }
            .circle {
                border-color: ${color} !important;
            }
            .headkiller {
                border-color: ${color} !important;
            }
            .headkiller:before {
                border-color: ${color} !important;
            }
            .headkiller:after {
                background: ${color} !important;
            }
            .plus:before, .plus:after {
                background: ${color} !important;
            }
            .x-cross:before, .x-cross:after {
                background: ${color} !important;
            }
        `;
    }

    function updateRGB() {
        if (rgbMode) {
            hue = (hue + 1) % 360;
            updateColor();
        }
    }

    function toggleRGBMode() {
        rgbMode = !rgbMode;
        if (rgbMode) {
            rgbInterval = setInterval(updateRGB, 20);
        } else {
            clearInterval(rgbInterval);
        }
        updateColor();
    }

    function toggleCustomization() {
        const customizationPanel = document.getElementById("customizationPanel");
        customizationPanel.style.display = customizationPanel.style.display === "block" ? "none" : "block";
    }

    // Event Listeners
    document.getElementById("toggleCrosshairBtn").addEventListener('click', toggleCrosshair);
    document.getElementById("dotBtn").addEventListener('click', () => changeCrosshair('dot'));
    document.getElementById("linesBtn").addEventListener('click', () => changeCrosshair('lines'));
    document.getElementById("dotCircleBtn").addEventListener('click', () => changeCrosshair('dot-circle'));
    document.getElementById("plusBtn").addEventListener('click', () => changeCrosshair('plus'));
    document.getElementById("xCrossBtn").addEventListener('click', () => changeCrosshair('x-cross'));
    document.getElementById("headkillerBtn").addEventListener('click', () => changeCrosshair('headkiller'));
    document.getElementById("colorPicker").addEventListener('input', updateColor);
    document.getElementById("rgbBtn").addEventListener('click', toggleRGBMode);
    document.getElementById("customizationBtn").addEventListener('click', toggleCustomization);

    document.addEventListener('keydown', (event) => {
        if (event.key === '-') {
            menuVisible = !menuVisible;
            menu.style.display = menuVisible ? 'block' : 'none';
            if (!menuVisible) {
                document.getElementById("customizationPanel").style.display = 'none';
            }
        }
    });

    // Initialize with default color
    updateColor();
})();