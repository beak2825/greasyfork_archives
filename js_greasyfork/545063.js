// ==UserScript==
// @name         N1 crosshair better!
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Customizable static dot crosshair with control panel for Narrow.One (F8 hotkey fixed)
// @author       Beaverite
// @match        https://narrow.one/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545063/N1%20crosshair%20better%21.user.js
// @updateURL https://update.greasyfork.org/scripts/545063/N1%20crosshair%20better%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("[Crosshair] Script loaded for Narrow.One (F8 hotkey fixed)");
    GM_addStyle(`
        #crosshair-container {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 2147483647 !important;
            display: block !important;
        }
        #crosshair {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .dot-crosshair {
            border-radius: 50%;
            position: absolute;
            transform: translate(-50%, -50%);
            visibility: visible !important;
        }
        #crosshair-control-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(15, 15, 25, 0.95);
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 0 25px rgba(0, 0, 0, 0.7);
            border: 1px solid rgba(90, 150, 255, 0.4);
            z-index: 2147483647 !important;
            width: 320px;
            font-family: 'Segoe UI', sans-serif;
            color: #e0e0ff;
            display: none;
            backdrop-filter: blur(5px);
        }
        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px solid rgba(90, 150, 255, 0.3);
            padding-bottom: 10px;
        }
        .panel-title {
            font-size: 18px;
            font-weight: 600;
            color: #6ab0ff;
        }
        .close-btn {
            background: none;
            border: none;
            color: #ff6b6b;
            font-size: 20px;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 5px;
            transition: background 0.2s;
        }
        .close-btn:hover {
            background: rgba(255, 107, 107, 0.15);
        }
        .control-group {
            margin-bottom: 15px;
        }
        .control-label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            color: #a0b0ff;
        }
        .slider-container {
            display: flex;
            align-items: center;
        }
        .slider-container input[type="range"] {
            flex: 1;
            height: 5px;
            background: rgba(90, 150, 255, 0.2);
            border-radius: 5px;
            outline: none;
            margin-right: 10px;
        }
        .slider-container input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #6ab0ff;
            cursor: pointer;
        }
        .value-display {
            min-width: 30px;
            text-align: center;
            font-size: 14px;
        }
        .color-container {
            display: flex;
            gap: 10px;
        }
        .color-picker {
            display: flex;
            align-items: center;
        }
        .color-picker label {
            margin-right: 8px;
            font-size: 14px;
        }
        .color-picker input[type="color"] {
            width: 30px;
            height: 30px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: transparent;
        }
        .hotkey-info {
            margin-top: 20px;
            padding: 8px;
            background: rgba(30, 40, 60, 0.6);
            border-radius: 5px;
            text-align: center;
            font-size: 14px;
        }
        .hotkey-info span {
            font-weight: 600;
            color: #6ab0ff;
        }
    `);
    const init = () => {
        console.log("[Crosshair] Initialization started (F8 hotkey)");
        if (!document.body) {
            setTimeout(init, 100);
            return;
        }
        if (document.getElementById('crosshair-container')) {
            console.log("[Crosshair] Already initialized, skipping");
            return;
        }
        const container = document.createElement('div');
        container.id = 'crosshair-container';
        document.body.appendChild(container);
        const crosshair = document.createElement('div');
        crosshair.id = 'crosshair';
        container.appendChild(crosshair);
        const controlPanel = document.createElement('div');
        controlPanel.id = 'crosshair-control-panel';
        document.body.appendChild(controlPanel);
        controlPanel.innerHTML = `
            <div class="panel-header">
                <div class="panel-title">Crosshair Settings</div>
                <button id="closePanel" class="close-btn">×</button>
            </div>

            <div class="control-group">
                <label class="control-label">Dot Size</label>
                <div class="slider-container">
                    <input type="range" id="dotSize" min="1" max="20" value="4">
                    <div class="value-display"><span id="sizeValue">4</span>px</div>
                </div>
            </div>
            <div class="control-group">
                <label class="control-label">Outline Thickness</label>
                <div class="slider-container">
                    <input type="range" id="dotThickness" min="0" max="10" value="1">
                    <div class="value-display"><span id="thicknessValue">1</span>px</div>
                </div>
            </div>
            <div class="control-group">
                <label class="control-label">Colors</label>
                <div class="color-container">
                    <div class="color-picker">
                        <label for="innerColor">Inner:</label>
                        <input type="color" id="innerColor" value="#ffffff">
                    </div>
                    <div class="color-picker">
                        <label for="outerColor">Outer:</label>
                        <input type="color" id="outerColor" value="#000000">
                    </div>
                </div>
            </div>
            <div class="hotkey-info">
                Toggle panel with: <span>F8</span>
            </div>
        `;
        const closePanel = document.getElementById('closePanel');
        const dotSize = document.getElementById('dotSize');
        const sizeValue = document.getElementById('sizeValue');
        const dotThickness = document.getElementById('dotThickness');
        const thicknessValue = document.getElementById('thicknessValue');
        const innerColor = document.getElementById('innerColor');
        const outerColor = document.getElementById('outerColor');
        let panelVisible = false;
        const HOTKEY = 'F8';
        const update = () => {
            const size = parseInt(dotSize.value);
            const thickness = parseInt(dotThickness.value);
            const innerClr = innerColor.value;
            const outerClr = outerColor.value;
            crosshair.innerHTML = '';
            if (thickness > 0) {
                const outerCircle = document.createElement('div');
                outerCircle.className = 'dot-crosshair';
                outerCircle.style.width = `${size + thickness * 2}px`;
                outerCircle.style.height = `${size + thickness * 2}px`;
                outerCircle.style.backgroundColor = outerClr;
                crosshair.appendChild(outerCircle);
            }
            const innerCircle = document.createElement('div');
            innerCircle.className = 'dot-crosshair';
            innerCircle.style.width = `${size}px`;
            innerCircle.style.height = `${size}px`;
            innerCircle.style.backgroundColor = innerClr;
            crosshair.appendChild(innerCircle);
        };
        const setup = () => {
            document.addEventListener('keydown', (e) => {
                if (e.key === HOTKEY || e.code === HOTKEY) {
                    e.preventDefault();
                    e.stopPropagation();
                    panelVisible = !panelVisible;
                    controlPanel.style.display = panelVisible ? 'block' : 'none';
                    console.log(`[Crosshair] Toggle panel with F8`);
                }
            }, true);
            closePanel.addEventListener('click', () => {
                controlPanel.style.display = 'none';
                panelVisible = false;
            });
            dotSize.addEventListener('input', () => {
                sizeValue.textContent = dotSize.value;
                update();
            });
            dotThickness.addEventListener('input', () => {
                thicknessValue.textContent = dotThickness.value;
                update();
            });
            innerColor.addEventListener('input', update);
            outerColor.addEventListener('input', update);
        };
        const setDefaults = () => {
            sizeValue.textContent = dotSize.value;
            thicknessValue.textContent = dotThickness.value;
        };
        update();
        setDefaults();
        setup();
        console.log("[Crosshair] Initialization complete (F8 hotkey)");
    };
    const observer = new MutationObserver(() => {
        if (!document.getElementById('crosshair-container')) {
            console.log("[Crosshair] SPA navigation detected, re-initializing");
            init();
        }
    });
    const startScript = () => {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            init();
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                init();
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }
    };
    startScript();
})();

// ..+---+
// ./ R /|
// +---+ |
// | I | +
// | P |/.
// +---+..
//The final version has been finalized
//R.I.P
//Tell me what do you think of the color of this panel(QWQ)