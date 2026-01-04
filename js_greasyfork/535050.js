
// ==UserScript==
// @name         Aimbot/ESP(Non -working/UI Only) - BoseyCC
// @namespace    http://tampermonkey.net/
// @version      4.0.0-preview
// @description  Preview version of my Aim/ESP Client and ESP (Non-funtional, Just a preview)
// @author       StateFarm
// @match        *://shellshock.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535050/AimbotESP%28Non%20-workingUI%20Only%29%20-%20BoseyCC.user.js
// @updateURL https://update.greasyfork.org/scripts/535050/AimbotESP%28Non%20-workingUI%20Only%29%20-%20BoseyCC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const waitForGame = setInterval(() => {
        if (document.readyState === 'complete' && document.body) {
            clearInterval(waitForGame);
            initUI();
            setupHooks();
        }
    }, 100);

    function initUI() {
        const ui = document.createElement('div');
        ui.id = 'statefarm-ui';
        ui.style.position = 'fixed';
        ui.style.top = '100px';
        ui.style.left = '100px';
        ui.style.width = '300px';
        ui.style.background = 'rgba(30, 30, 30, 0.95)';
        ui.style.color = '#fff';
        ui.style.padding = '10px';
        ui.style.zIndex = '9999';
        ui.style.border = '2px solid #3cf';
        ui.style.borderRadius = '8px';
        ui.style.fontFamily = 'Arial, sans-serif';
        ui.style.userSelect = 'none';
        ui.innerHTML = `
            <div id="header" style="cursor: move; background: #222; padding: 4px; text-align: center; font-weight: bold;">StateFarm Client v4</div>

            <h4>Combat</h4>
            <label><input type="checkbox" id="toggleAimbot"> Aimbot</label><br>
            <label><input type="checkbox" id="toggleESP"> ESP</label><br>
            <label>Min Angle: <input type="range" id="minAngle" min="0" max="360" value="180"></label><br>
            <label>TriggerBot: <input type="checkbox" id="triggerbot"></label><br>

            <h4>Misc</h4>
            <label><input type="checkbox" id="grenadeMax"> Max Grenade Power</label><br>
        `;

        document.body.appendChild(ui);
        makeDraggable(ui);
        attachHandlers();
    }

    function makeDraggable(el) {
        const header = el.querySelector('#header');
        let offsetX = 0, offsetY = 0, isDown = false;

        header.addEventListener('mousedown', (e) => {
            isDown = true;
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
        });
        document.addEventListener('mouseup', () => isDown = false);
        document.addEventListener('mousemove', (e) => {
            if (isDown) {
                el.style.left = `${e.clientX - offsetX}px`;
                el.style.top = `${e.clientY - offsetY}px`;
            }
        });
    }

    function attachHandlers() {
        document.getElementById('toggleESP').addEventListener('change', (e) => {
            window.SFC_ESP_ENABLED = e.target.checked;
            console.log('ESP:', window.SFC_ESP_ENABLED);
        });

        document.getElementById('toggleAimbot').addEventListener('change', (e) => {
            window.SFC_AIMBOT_ENABLED = e.target.checked;
            console.log('Aimbot:', window.SFC_AIMBOT_ENABLED);
        });

        document.getElementById('minAngle').addEventListener('input', (e) => {
            window.SFC_AIMBOT_MIN_ANGLE = parseInt(e.target.value);
        });

        document.getElementById('triggerbot').addEventListener('change', (e) => {
            window.SFC_TRIGGERBOT = e.target.checked;
        });

        document.getElementById('grenadeMax').addEventListener('change', (e) => {
            window.SFC_GRENADE_MAX = e.target.checked;
        });
    }

    function setupHooks() {
        // Basic ESP render logic placeholder
        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const drawESP = () => {
            if (window.SFC_ESP_ENABLED) {
                ctx.save();
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.strokeRect(100, 100, 50, 50); // Placeholder box
                ctx.restore();
            }
            requestAnimationFrame(drawESP);
        };
        drawESP();
    }
})();
