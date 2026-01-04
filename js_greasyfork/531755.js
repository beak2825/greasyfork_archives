// ==UserScript==
// @name         Jyomama28s Suroi.io Menu Customizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Customize the look of suroi.io main menu with a GUI that pops up when Z is pressed
// @author       You
// @match        *://*.suroi.io/*
// @match        *://suroi.io/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/531755/Jyomama28s%20Suroiio%20Menu%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/531755/Jyomama28s%20Suroiio%20Menu%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';


    GM_addStyle(`
        #menu-customizer {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 9999;
            width: 350px;
            display: none;
            font-family: Arial, sans-serif;
        }

        #menu-customizer h2 {
            text-align: center;
            margin-top: 0;
            margin-bottom: 15px;
            color: #fff;
        }

        .customizer-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .color-picker {
            display: flex;
            align-items: center;
        }

        .color-label {
            margin-right: 10px;
            width: 100px;
        }

        .button-row {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
        }

        .customizer-button {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 8px 15px;
            text-align: center;
            text-decoration: none;
            font-size: 14px;
            cursor: pointer;
            border-radius: 5px;
        }

        .customizer-button.cancel {
            background-color: #f44336;
        }

        .customizer-button.rgb {
            background-color: #2196F3;
        }

        #rgb-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-left: 10px;
            background-color: gray;
        }

        #rgb-indicator.active {
            background-color: #00ff00;
        }

        input[type="color"] {
            width: 40px;
            height: 25px;
            border: none;
            cursor: pointer;
        }

        input[type="range"] {
            width: 120px;
        }
    `);


    const createCustomizerGUI = () => {
        const customizer = document.createElement('div');
        customizer.id = 'menu-customizer';

        customizer.innerHTML = `
            <h2>Suroi.io Menu Customizer</h2>
            <div class="customizer-row">
                <div class="color-label">Background:</div>
                <div class="color-picker">
                    <input type="color" id="background-color" value="#1e1e1e">
                </div>
            </div>
            <div class="customizer-row">
                <div class="color-label">Text Color:</div>
                <div class="color-picker">
                    <input type="color" id="text-color" value="#ffffff">
                </div>
            </div>
            <div class="customizer-row">
                <div class="color-label">Button Color:</div>
                <div class="color-picker">
                    <input type="color" id="button-color" value="#4caf50">
                </div>
            </div>
            <div class="customizer-row">
                <div class="color-label">Button Text:</div>
                <div class="color-picker">
                    <input type="color" id="button-text-color" value="#ffffff">
                </div>
            </div>
            <div class="customizer-row">
                <div class="color-label">Logo Size:</div>
                <div class="color-picker">
                    <input type="range" id="logo-size" min="50" max="150" value="100">
                    <span id="logo-size-value">100%</span>
                </div>
            </div>
            <div class="customizer-row">
                <div class="color-label">RGB Mode:</div>
                <div class="color-picker">
                    <span id="rgb-status">Off</span>
                    <span id="rgb-indicator"></span>
                </div>
            </div>
            <div class="button-row">
                <button id="rgb-toggle" class="customizer-button rgb">Toggle RGB</button>
                <button id="apply-button" class="customizer-button">Apply</button>
                <button id="cancel-button" class="customizer-button cancel">Close</button>
            </div>
        `;

        document.body.appendChild(customizer);


        document.getElementById('logo-size').addEventListener('input', (e) => {
            document.getElementById('logo-size-value').textContent = e.target.value + '%';
        });

        document.getElementById('apply-button').addEventListener('click', applyCustomizations);
        document.getElementById('rgb-toggle').addEventListener('click', toggleRGBMode);
        document.getElementById('cancel-button').addEventListener('click', () => {
            document.getElementById('menu-customizer').style.display = 'none';
        });
    };


    let rgbModeActive = false;
    let rgbInterval = null;
    let hue = 0;

    const toggleRGBMode = () => {
        rgbModeActive = !rgbModeActive;
        const indicator = document.getElementById('rgb-indicator');
        const status = document.getElementById('rgb-status');

        if (rgbModeActive) {
            indicator.classList.add('active');
            status.textContent = 'On';

            if (!rgbInterval) {
                startRGBMode();
            }
        } else {
            indicator.classList.remove('active');
            status.textContent = 'Off';

            if (rgbInterval) {
                clearInterval(rgbInterval);
                rgbInterval = null;
            }
        }
    };

    const startRGBMode = () => {
        applyCustomizations();

        rgbInterval = setInterval(() => {
            hue = (hue + 1) % 360;

            const menuBackground = document.querySelector('.main-menu-container') ||
                                   document.querySelector('.game-menu');
            const logo = document.querySelector('.logo-container img') ||
                         document.querySelector('.game-title');
            const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn');

            if (menuBackground) {
                menuBackground.style.backgroundColor = `hsl(${hue}, 70%, 20%)`;
            }

            if (logo) {
                logo.style.filter = `hue-rotate(${hue}deg)`;
            }

            buttons.forEach(button => {
                button.style.backgroundColor = `hsl(${(hue + 120) % 360}, 70%, 40%)`;
                button.style.borderColor = `hsl(${(hue + 180) % 360}, 70%, 50%)`;
            });

        }, 50);
    };


    const applyCustomizations = () => {
        const backgroundColor = document.getElementById('background-color').value;
        const textColor = document.getElementById('text-color').value;
        const buttonColor = document.getElementById('button-color').value;
        const buttonTextColor = document.getElementById('button-text-color').value;
        const logoSize = document.getElementById('logo-size').value;

        const menuBackground = document.querySelector('.main-menu-container') ||
                               document.querySelector('.game-menu');
        const menuTexts = document.querySelectorAll('.menu-text, .menu-item, h1, h2, h3, p, label, .modal-content');
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn');
        const logo = document.querySelector('.logo-container img') ||
                     document.querySelector('.game-title');


        if (menuBackground && !rgbModeActive) {
            menuBackground.style.backgroundColor = backgroundColor;
        }

        menuTexts.forEach(text => {
            text.style.color = textColor;
        });

        if (!rgbModeActive) {
            buttons.forEach(button => {
                button.style.backgroundColor = buttonColor;
                button.style.color = buttonTextColor;
            });
        }

        if (logo) {
            logo.style.transform = `scale(${logoSize / 100})`;
        }


        localStorage.setItem('suroi-customizer-settings', JSON.stringify({
            backgroundColor,
            textColor,
            buttonColor,
            buttonTextColor,
            logoSize,
            rgbModeActive
        }));
    };


    const loadSavedSettings = () => {
        const savedSettings = localStorage.getItem('suroi-customizer-settings');

        if (savedSettings) {
            const settings = JSON.parse(savedSettings);

            document.getElementById('background-color').value = settings.backgroundColor;
            document.getElementById('text-color').value = settings.textColor;
            document.getElementById('button-color').value = settings.buttonColor;
            document.getElementById('button-text-color').value = settings.buttonTextColor;
            document.getElementById('logo-size').value = settings.logoSize;
            document.getElementById('logo-size-value').textContent = settings.logoSize + '%';

            rgbModeActive = settings.rgbModeActive;

            if (rgbModeActive) {
                document.getElementById('rgb-status').textContent = 'On';
                document.getElementById('rgb-indicator').classList.add('active');
                startRGBMode();
            }
        }
    };


    const setupKeyListener = () => {
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'z') {
                const customizer = document.getElementById('menu-customizer');

                if (customizer.style.display === 'block') {
                    customizer.style.display = 'none';
                } else {
                    customizer.style.display = 'block';
                }
            }
        });
    };

    const initialize = () => {

        createCustomizerGUI();

        setupKeyListener();

        loadSavedSettings();

        setTimeout(applyCustomizations, 1000);
    };

    window.addEventListener('load', initialize);
})();