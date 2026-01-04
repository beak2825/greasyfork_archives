// ==UserScript==
// @namespace    custom-crosshair
// @license      MIT
// @author       ovftank
// @name         Custom Crosshair
// @description  A versatile crosshair customization tool for Deadshot.io, allowing users to personalize crosshair color, size, thickness, gap, and dot visibility for enhanced gameplay precision.
// @version      1.0
// @icon         https://deadshot.io/favicon.png
// @match        https://deadshot.io/
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/516150/Custom%20Crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/516150/Custom%20Crosshair.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const crosshairSettings = {
        color: '#ffffff',
        barLength: '4px',
        thickness: '2px',
        gap: '0px',
        showDot: false,
        dotSize: '2px',
    };

    let topBar,
        bottomBar,
        leftBar,
        rightBar,
        dot,
        previewTopBar,
        previewBottomBar,
        previewLeftBar,
        previewRightBar,
        previewDot;

    function applyCrosshairStyles() {
        const gapValue = parseInt(crosshairSettings.gap);
        topBar.style.cssText = `
            width: ${crosshairSettings.thickness};
            height: ${crosshairSettings.barLength};
            background-color: ${crosshairSettings.color};
            position: absolute;
            top: calc(50% - ${gapValue}px - ${crosshairSettings.barLength});
            left: 50%;
            transform: translate(-50%, 0);
            z-index: 200;
        `;

        bottomBar.style.cssText = `
            width: ${crosshairSettings.thickness};
            height: ${crosshairSettings.barLength};
            background-color: ${crosshairSettings.color};
            position: absolute;
            top: calc(50% + ${gapValue}px);
            left: 50%;
            transform: translate(-50%, 0);
            z-index: 200;
        `;

        leftBar.style.cssText = `
            width: ${crosshairSettings.barLength};
            height: ${crosshairSettings.thickness};
            background-color: ${crosshairSettings.color};
            position: absolute;
            top: 50%;
            left: calc(50% - ${gapValue}px - ${crosshairSettings.barLength});
            transform: translate(0, -50%);
            z-index: 200;
        `;

        rightBar.style.cssText = `
            width: ${crosshairSettings.barLength};
            height: ${crosshairSettings.thickness};
            background-color: ${crosshairSettings.color};
            position: absolute;
            top: 50%;
            left: calc(50% + ${gapValue}px);
            transform: translate(0, -50%);
            z-index: 200;
        `;
        if (crosshairSettings.showDot) {
            dot.style.cssText = `
                width: ${crosshairSettings.dotSize};
                height: ${crosshairSettings.dotSize};
                background-color: ${crosshairSettings.color};
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border-radius: 50%;
                z-index: 200;
            `;
            document.body.appendChild(dot);
        } else {
            if (dot.parentElement) {
                dot.parentElement.removeChild(dot);
            }
        }
    }

    function applyPreviewStyles() {
        const gapValue = parseInt(crosshairSettings.gap);

        previewTopBar.style.cssText = `
            width: ${crosshairSettings.thickness};
            height: ${crosshairSettings.barLength};
            background-color: ${crosshairSettings.color};
            position: absolute;
            top: calc(50% - ${gapValue}px - ${crosshairSettings.barLength});
            left: 50%;
            transform: translate(-50%, 0);
        `;

        previewBottomBar.style.cssText = `
            width: ${crosshairSettings.thickness};
            height: ${crosshairSettings.barLength};
            background-color: ${crosshairSettings.color};
            position: absolute;
            top: calc(50% + ${gapValue}px);
            left: 50%;
            transform: translate(-50%, 0);
        `;

        previewLeftBar.style.cssText = `
            width: ${crosshairSettings.barLength};
            height: ${crosshairSettings.thickness};
            background-color: ${crosshairSettings.color};
            position: absolute;
            top: 50%;
            left: calc(50% - ${gapValue}px - ${crosshairSettings.barLength});
            transform: translate(0, -50%);
        `;

        previewRightBar.style.cssText = `
            width: ${crosshairSettings.barLength};
            height: ${crosshairSettings.thickness};
            background-color: ${crosshairSettings.color};
            position: absolute;
            top: 50%;
            left: calc(50% + ${gapValue}px);
            transform: translate(0, -50%);
        `;

        if (crosshairSettings.showDot) {
            previewDot.style.cssText = `
                width: ${crosshairSettings.dotSize};
                height: ${crosshairSettings.dotSize};
                background-color: ${crosshairSettings.color};
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border-radius: 50%;
            `;
            previewContainer.appendChild(previewDot);
        } else if (previewDot.parentElement) {
            previewDot.parentElement.removeChild(previewDot);
        }
    }

    function createCrosshair() {
        topBar = document.createElement('div');
        bottomBar = document.createElement('div');
        leftBar = document.createElement('div');
        rightBar = document.createElement('div');
        dot = document.createElement('div');
        applyCrosshairStyles();

        document.body.appendChild(topBar);
        document.body.appendChild(bottomBar);
        document.body.appendChild(leftBar);
        document.body.appendChild(rightBar);
    }

    function createSettingsButton() {
        const settingsButton = document.createElement('button');
        settingsButton.innerText = '⚙️';
        settingsButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-size: 24px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            z-index: 300;
        `;
        settingsButton.onclick = openSettingsModal;

        document.body.appendChild(settingsButton);
    }

    function createSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'crosshairSettingsModal';
        modal.style.cssText = `
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #1e1e2e;
        color: #f5f5f7;
        padding: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border-radius: 12px;
        width: 320px;
        font-family: Arial, sans-serif;
        z-index: 300;
    `;

        modal.innerHTML = `
        <h2 style="margin-top: 0; font-size: 1.5em; text-align: center;">Customize Crosshair</h2>
        <div id="previewContainer" style="position: relative; width: 60px; height: 60px; margin: 15px auto; border: 2px solid #888; border-radius: 6px;">
            <div id="previewTopBar" style="position: absolute;"></div>
            <div id="previewBottomBar" style="position: absolute;"></div>
            <div id="previewLeftBar" style="position: absolute;"></div>
            <div id="previewRightBar" style="position: absolute;"></div>
            <div id="previewDot" style="position: absolute;"></div>
        </div>
        <label>Color: <input type="color" id="crosshairColor" value="${
            crosshairSettings.color
        }" style="border: none; outline: none;"></label><br><br>
        <label>Bar Length: <input type="number" id="barLength" value="${parseInt(
            crosshairSettings.barLength,
        )}" style="width: 50px;"> px</label><br><br>
        <label>Line Thickness: <input type="number" id="lineThickness" value="${parseInt(
            crosshairSettings.thickness,
        )}" style="width: 50px;"> px</label><br><br>
        <label>Gap: <input type="number" id="lineGap" value="${parseInt(
            crosshairSettings.gap,
        )}" style="width: 50px;"> px</label><br><br>
        <label>Dot: <input type="checkbox" id="showDot" ${
            crosshairSettings.showDot ? 'checked' : ''
        }></label><br><br>
        <label>Dot Size: <input type="number" id="dotSize" value="${parseInt(
            crosshairSettings.dotSize,
        )}" style="width: 50px;"> px</label><br><br>
        <button id="closeModal" style="background-color: #6a5acd; color: white; border: none; border-radius: 5px; padding: 8px 16px; cursor: pointer; font-size: 1em; width: 100%;">Close</button>
    `;

        document.body.appendChild(modal);
        previewTopBar = modal.querySelector('#previewTopBar');
        previewBottomBar = modal.querySelector('#previewBottomBar');
        previewLeftBar = modal.querySelector('#previewLeftBar');
        previewRightBar = modal.querySelector('#previewRightBar');
        previewDot = modal.querySelector('#previewDot');
        document.getElementById('crosshairColor').oninput = (e) => {
            crosshairSettings.color = e.target.value;
            applyCrosshairStyles();
            applyPreviewStyles();
        };

        document.getElementById('barLength').oninput = (e) => {
            let inputValue = parseInt(e.target.value);
            if (inputValue > 20) {
                inputValue = 20;
                e.target.value = 20;
            }
            crosshairSettings.barLength = inputValue + 'px';
            applyCrosshairStyles();
            applyPreviewStyles();
        };

        document.getElementById('lineThickness').oninput = (e) => {
            crosshairSettings.thickness = e.target.value + 'px';
            applyCrosshairStyles();
            applyPreviewStyles();
        };

        document.getElementById('lineGap').oninput = (e) => {
            crosshairSettings.gap = e.target.value + 'px';
            applyCrosshairStyles();
            applyPreviewStyles();
        };

        document.getElementById('showDot').onchange = (e) => {
            crosshairSettings.showDot = e.target.checked;
            applyCrosshairStyles();
            applyPreviewStyles();
        };

        document.getElementById('dotSize').oninput = (e) => {
            crosshairSettings.dotSize = e.target.value + 'px';
            applyCrosshairStyles();
            applyPreviewStyles();
        };
        document.getElementById('closeModal').onclick = closeSettingsModal;
        applyPreviewStyles();
    }

    function openSettingsModal() {
        document.getElementById('crosshairSettingsModal').style.display =
            'block';
    }

    function closeSettingsModal() {
        document.getElementById('crosshairSettingsModal').style.display =
            'none';
    }

    window.addEventListener('load', function () {
        try {
            createCrosshair();
            createSettingsButton();
            createSettingsModal();
        } catch (e) {
            console.error('Error initializing crosshair script:', e);
        }
    });
})();
