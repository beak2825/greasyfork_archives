// ==UserScript==
// @name         YouTube CC Customizer (Advanced In-Player)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Customize YouTube closed captions with advanced controls in the player
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/501239/YouTube%20CC%20Customizer%20%28Advanced%20In-Player%29.user.js
// @updateURL https://update.greasyfork.org/scripts/501239/YouTube%20CC%20Customizer%20%28Advanced%20In-Player%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
function applyCCStyles() {
        const size = document.getElementById('cc-size').value;
        const font = document.getElementById('cc-font').value;
        const weight = document.getElementById('cc-weight').value;
        const color = document.getElementById('cc-color').value;
        const bgColor = document.getElementById('cc-bg-color').value;
        const bgOpacity = document.getElementById('cc-bg-opacity').value;
        const align = document.getElementById('cc-align').value;

        const outlineEnable = document.getElementById('cc-outline-enable').checked;
        const outlineColor = document.getElementById('cc-outline-color').value;
        const outlineWidth = document.getElementById('cc-outline-width').value;

        const shadowEnable = document.getElementById('cc-shadow-enable').checked;
        const shadowColor = document.getElementById('cc-shadow-color').value;
        const shadowBlur = document.getElementById('cc-shadow-blur').value;
        const shadowOffsetX = document.getElementById('cc-shadow-offset-x').value;
        const shadowOffsetY = document.getElementById('cc-shadow-offset-y').value;

        let outlineEffect = '';
        if (outlineEnable) {
            outlineEffect = `
                -webkit-text-stroke: ${outlineWidth}px ${outlineColor};
                text-stroke: ${outlineWidth}px ${outlineColor};
            `;
        }

        let shadowEffect = '';
        if (shadowEnable) {
            shadowEffect = `text-shadow: ${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor};`;
        }

        const style = `
            .ytp-caption-segment {
                font-size: ${size}em !important;
                font-family: ${font} !important;
                font-weight: ${weight} !important;
                color: ${color} !important;
                background-color: ${bgColor}${Math.round(bgOpacity * 255).toString(16).padStart(2, '0')} !important;
                ${outlineEffect}
                ${shadowEffect}
                paint-order: stroke fill;
            }
            .caption-window {
                text-align: ${align} !important;
            }
        `;

        let styleElem = document.getElementById('cc-custom-style');
        if (!styleElem) {
            styleElem = document.createElement('style');
            styleElem.id = 'cc-custom-style';
            document.head.appendChild(styleElem);
        }
        styleElem.textContent = style;

        // Save settings
        const settings = {size, font, weight, color, bgColor, bgOpacity, align, outlineEnable, outlineColor, outlineWidth, shadowEnable, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY};
        GM_setValue('ccSettings', JSON.stringify(settings));
    }
    const fonts = [
        "Arial", "Helvetica", "Verdana", "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia", "Garamond",
        "Courier New", "Brush Script MT", "Copperplate", "Papyrus", "Impact", "Comic Sans MS", "Lucida Console",
        "Palatino", "Book Antiqua", "Calibri", "Candara", "Futura", "Geneva", "Optima", "Cambria", "Didot",
        "Baskerville", "Rockwell", "Franklin Gothic Medium", "Segoe UI", "Roboto", "Open Sans", "Lato", "Montserrat"
    ];

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .ytp-cc-custom-button {
                width: auto !important;
                padding: 0 10px !important;
            }
            .ytp-cc-custom-menu {
                position: absolute;
                bottom: 50px;
                right: 10px;
                background: rgba(28, 28, 28, 0.9);
                border-radius: 2px;
                padding: 10px;
                color: white;
                font-size: 12px;
                z-index: 1000;
                display: none;
                max-height: 80vh;
                overflow-y: auto;
                width: 250px;
            }
            .ytp-cc-custom-menu label {
                display: block;
                margin-top: 5px;
            }
            .ytp-cc-custom-menu select, .ytp-cc-custom-menu input {
                width: 100%;
                margin-top: 2px;
            }
            .ytp-cc-custom-menu input[type="checkbox"] {
                width: auto;
                margin-right: 5px;
            }
        `;
        document.head.appendChild(style);
    }

    function createCustomButton() {
        const button = document.createElement('button');
        button.className = 'ytp-button ytp-cc-custom-button';
        button.innerHTML = 'CC Style';
        button.addEventListener('click', toggleCustomMenu);
        return button;
    }

    function createCustomMenu() {
        const menu = document.createElement('div');
        menu.className = 'ytp-cc-custom-menu';
        menu.innerHTML = `
            <label for="cc-font">Font Family:</label>
            <select id="cc-font">
                ${fonts.map(font => `<option value="${font}, sans-serif">${font}</option>`).join('')}
            </select>
            <label for="cc-size">Font Size:</label>
            <input type="range" id="cc-size" min="0.5" max="2" step="0.1" value="1">
            <label for="cc-weight">Font Weight:</label>
            <select id="cc-weight">
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
            </select>
            <label for="cc-color">Text Color:</label>
            <input type="color" id="cc-color" value="#ffffff">
            <label for="cc-bg-color">Background Color:</label>
            <input type="color" id="cc-bg-color" value="#000000">
            <label for="cc-bg-opacity">Background Opacity:</label>
            <input type="range" id="cc-bg-opacity" min="0" max="1" step="0.1" value="0.8">
            <label for="cc-align">Text Alignment:</label>
            <select id="cc-align">
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
            </select>
            <label>
                <input type="checkbox" id="cc-outline-enable"> Enable Outline
            </label>
            <label for="cc-outline-color">Outline Color:</label>
            <input type="color" id="cc-outline-color" value="#000000">
            <label for="cc-outline-width">Outline Width:</label>
            <input type="range" id="cc-outline-width" min="0" max="10" step="0.5" value="1">
            <label>
                <input type="checkbox" id="cc-shadow-enable"> Enable Drop Shadow
            </label>
            <label for="cc-shadow-color">Shadow Color:</label>
            <input type="color" id="cc-shadow-color" value="#000000">
            <label for="cc-shadow-blur">Shadow Blur:</label>
            <input type="range" id="cc-shadow-blur" min="0" max="10" step="1" value="2">
            <label for="cc-shadow-offset-x">Shadow Offset X:</label>
            <input type="range" id="cc-shadow-offset-x" min="-10" max="10" step="1" value="2">
            <label for="cc-shadow-offset-y">Shadow Offset Y:</label>
            <input type="range" id="cc-shadow-offset-y" min="-10" max="10" step="1" value="2">
        `;
        return menu;
    }

    function toggleCustomMenu() {
        const menu = document.querySelector('.ytp-cc-custom-menu');
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }

    function applyCCStyles() {
        const size = document.getElementById('cc-size').value;
        const font = document.getElementById('cc-font').value;
        const weight = document.getElementById('cc-weight').value;
        const color = document.getElementById('cc-color').value;
        const bgColor = document.getElementById('cc-bg-color').value;
        const bgOpacity = document.getElementById('cc-bg-opacity').value;
        const align = document.getElementById('cc-align').value;

        const outlineEnable = document.getElementById('cc-outline-enable').checked;
        const outlineColor = document.getElementById('cc-outline-color').value;
        const outlineWidth = document.getElementById('cc-outline-width').value;

        const shadowEnable = document.getElementById('cc-shadow-enable').checked;
        const shadowColor = document.getElementById('cc-shadow-color').value;
        const shadowBlur = document.getElementById('cc-shadow-blur').value;
        const shadowOffsetX = document.getElementById('cc-shadow-offset-x').value;
        const shadowOffsetY = document.getElementById('cc-shadow-offset-y').value;

        let textEffects = [];
        if (outlineEnable) {
            for (let i = 0; i < 4; i++) {
                textEffects.push(`${outlineWidth}px ${outlineWidth}px 0 ${outlineColor}`);
                textEffects.push(`${-outlineWidth}px ${outlineWidth}px 0 ${outlineColor}`);
                textEffects.push(`${outlineWidth}px ${-outlineWidth}px 0 ${outlineColor}`);
                textEffects.push(`${-outlineWidth}px ${-outlineWidth}px 0 ${outlineColor}`);
            }
        }
        if (shadowEnable) {
            textEffects.push(`${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}`);
        }

        const style = `
            .ytp-caption-segment {
                font-size: ${size}em !important;
                font-family: ${font} !important;
                font-weight: ${weight} !important;
                color: ${color} !important;
                background-color: ${bgColor}${Math.round(bgOpacity * 255).toString(16).padStart(2, '0')} !important;
                text-shadow: ${textEffects.join(', ')} !important;
            }
            .caption-window {
                text-align: ${align} !important;
            }
        `;

        let styleElem = document.getElementById('cc-custom-style');
        if (!styleElem) {
            styleElem = document.createElement('style');
            styleElem.id = 'cc-custom-style';
            document.head.appendChild(styleElem);
        }
        styleElem.textContent = style;

        // Save settings
        const settings = {size, font, weight, color, bgColor, bgOpacity, align, outlineEnable, outlineColor, outlineWidth, shadowEnable, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY};
        GM_setValue('ccSettings', JSON.stringify(settings));
    }

    function loadSettings() {
        const savedSettings = GM_getValue('ccSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            Object.keys(settings).forEach(key => {
                const element = document.getElementById(`cc-${key}`);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = settings[key];
                    } else {
                        element.value = settings[key];
                    }
                }
            });
            applyCCStyles();
        }
    }

    function init() {
        const player = document.querySelector('.ytp-right-controls');
        if (player && !document.querySelector('.ytp-cc-custom-button')) {
            const button = createCustomButton();
            const menu = createCustomMenu();
            player.appendChild(button);
            player.parentNode.appendChild(menu);

            const controls = [
                'cc-size', 'cc-font', 'cc-weight', 'cc-color', 'cc-bg-color', 'cc-bg-opacity', 'cc-align',
                'cc-outline-enable', 'cc-outline-color', 'cc-outline-width',
                'cc-shadow-enable', 'cc-shadow-color', 'cc-shadow-blur', 'cc-shadow-offset-x', 'cc-shadow-offset-y'
            ];
            controls.forEach(control => {
                const element = document.getElementById(control);
                if (element) {
                    element.addEventListener('input', applyCCStyles);
                }
            });

            loadSettings();
        }
    }

    function waitForElement(selector, callback, checkFrequencyInMs, timeoutInMs) {
        const startTimeInMs = Date.now();
        (function loopSearch() {
            if (document.querySelector(selector) != null) {
                callback();
                return;
            }
            else {
                setTimeout(function () {
                    if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
                        return;
                    loopSearch();
                }, checkFrequencyInMs);
            }
        })();
    }

    addStyles();
    waitForElement('.ytp-right-controls', init, 1000, 60000);

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            waitForElement('.ytp-right-controls', init, 1000, 60000);
        }
    }).observe(document, {subtree: true, childList: true});
})();