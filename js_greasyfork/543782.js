// ==UserScript==
// @name         Gmail Typography
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Clean UI tool for adjusting Gmail typography in real-time (font size, spacing, line height, etc.)
// @author       6969RandomGuy6969
// @match        *://mail.google.com/*
// @grant        GM_registerMenuCommand
// @license MIT
// @icon         https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://mail.google.com/mail/u/5/#inbox/FMfcgzQbgRjhGmklwlrrRlJgxzVTFRxB&size=256
// @downloadURL https://update.greasyfork.org/scripts/543782/Gmail%20Typography.user.js
// @updateURL https://update.greasyfork.org/scripts/543782/Gmail%20Typography.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let panelVisible = false;

    GM_registerMenuCommand("Config Menu", () => {
        toggleControlPanel();
    });

    function toggleControlPanel() {
        if (panelVisible) {
            document.getElementById('typo-panel')?.remove();
            panelVisible = false;
        } else {
            createControlPanel();
            panelVisible = true;
        }
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'typo-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: #fff;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            font-family: "Segoe UI", sans-serif;
            color: #333;
            width: 280px;
        `;

        panel.innerHTML = `
            <h3 style="margin-top:0; font-size:18px; color:#444;">🔧 Gmail Typography</h3>

            <label style="display:block; margin-bottom:10px;">
              Font Size (px)
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="range" id="fontSize" min="10" max="72" value="16" style="flex:1;">
                <input type="number" id="fontSizeVal" value="16" min="10" max="72" style="width:50px;">
              </div>
            </label>

            <label style="display:block; margin-bottom:10px;">
              Line Height
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="range" id="lineHeight" min="1" max="3" step="0.1" value="1.5" style="flex:1;">
                <input type="number" id="lineHeightVal" value="1.5" step="0.1" style="width:50px;">
              </div>
            </label>

            <label style="display:block; margin-bottom:10px;">
              Letter Spacing (px)
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="range" id="letterSpacing" min="-2" max="10" step="0.1" value="0" style="flex:1;">
                <input type="number" id="letterSpacingVal" value="0" step="0.1" style="width:50px;">
              </div>
            </label>

            <label style="display:block; margin-bottom:10px;">
              Font Family
              <select id="fontFamily" style="width:100%; padding:4px;">
                <option value="inherit">Inherit</option>
                <option value="Arial" selected>Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Georgia">Georgia</option>
                <option value="Courier New">Courier New</option>
                <option value="Comic Sans MS">Comic Sans</option>
              </select>
            </label>

            <label style="display:block; margin-bottom:10px;">
              Text Align
              <select id="textAlign" style="width:100%; padding:4px;">
                <option value="inherit">Inherit</option>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </label>

            <div style="display:flex; justify-content:space-between; margin-top:15px;">
                <button id="resetStyles" style="padding:6px 10px; font-size:13px;">Reset</button>
                <button id="closePanel" style="padding:6px 10px; font-size:13px;">Close</button>
            </div>
        `;
        document.body.appendChild(panel);

        const fontSizeSlider = document.getElementById('fontSize');
        const fontSizeBox = document.getElementById('fontSizeVal');
        const lineHeightSlider = document.getElementById('lineHeight');
        const lineHeightBox = document.getElementById('lineHeightVal');
        const letterSpacingSlider = document.getElementById('letterSpacing');
        const letterSpacingBox = document.getElementById('letterSpacingVal');

        function syncAndUpdate(slider, box) {
            slider.oninput = () => {
                box.value = slider.value;
                updateStyles();
            };
            box.oninput = () => {
                slider.value = box.value;
                updateStyles();
            };
        }

        syncAndUpdate(fontSizeSlider, fontSizeBox);
        syncAndUpdate(lineHeightSlider, lineHeightBox);
        syncAndUpdate(letterSpacingSlider, letterSpacingBox);

        document.getElementById('fontFamily').onchange = updateStyles;
        document.getElementById('textAlign').onchange = updateStyles;

        document.getElementById('resetStyles').onclick = () => {
            fontSizeSlider.value = 16;
            fontSizeBox.value = 16;
            lineHeightSlider.value = 1.5;
            lineHeightBox.value = 1.5;
            letterSpacingSlider.value = 0;
            letterSpacingBox.value = 0;
            document.getElementById('fontFamily').value = 'Arial';
            document.getElementById('textAlign').value = 'inherit';
            updateStyles();
        };

        document.getElementById('closePanel').onclick = () => {
            document.getElementById('typo-panel')?.remove();
            panelVisible = false;
        };

        updateStyles(); // Apply immediately
    }

    function updateStyles() {
        const fontSize = document.getElementById('fontSize')?.value + 'px';
        const lineHeight = document.getElementById('lineHeight')?.value;
        const letterSpacing = document.getElementById('letterSpacing')?.value + 'px';
        const fontFamily = document.getElementById('fontFamily')?.value;
        const textAlign = document.getElementById('textAlign')?.value;

        const styleBlock = `
            * {
                font-size: ${fontSize} !important;
                line-height: ${lineHeight} !important;
                letter-spacing: ${letterSpacing} !important;
                font-family: ${fontFamily} !important;
                text-align: ${textAlign} !important;
            }
        `;

        let styleTag = document.getElementById('typographyStyles');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'typographyStyles';
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = styleBlock;
    }
})();
