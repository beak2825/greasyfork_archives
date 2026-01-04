// ==UserScript==
// @name         Jagar FreeCam
// @namespace    Violentmonkey Scripts
// @version      0.1
// @description  Sorry for the bad controls. W - down, A - right, S- up, D - left. It just happened that way, but at least the script works:)
// @author       Drik
// @match        https://jagar.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533164/Jagar%20FreeCam.user.js
// @updateURL https://update.greasyfork.org/scripts/533164/Jagar%20FreeCam.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let freeCamEnabled = false;
    let cameraTarget = null;
    let originalPosition = { x: 0, y: 0 };
    let keysPressed = {};
    const speed = 10;

    const statusIndicator = document.createElement('div');
    statusIndicator.style.position = 'absolute';
    statusIndicator.style.bottom = '10px';
    statusIndicator.style.left = '10px';
    statusIndicator.style.background = 'rgba(0,0,0,0.7)';
    statusIndicator.style.color = '#fff';
    statusIndicator.style.padding = '6px 10px';
    statusIndicator.style.fontFamily = 'monospace';
    statusIndicator.style.fontSize = '14px';
    statusIndicator.style.zIndex = '9999';
    statusIndicator.style.borderRadius = '8px';
    statusIndicator.textContent = 'FreeCam: OFF';
    document.body.appendChild(statusIndicator);

    function updateStatus() {
        statusIndicator.textContent = `FreeCam: ${freeCamEnabled ? 'ON' : 'OFF'}`;
    }

    function toggleFreeCam() {
        freeCamEnabled = !freeCamEnabled;
        updateStatus();
        if (cameraTarget?.position) {
            if (freeCamEnabled) {
                originalPosition.x = cameraTarget.position.x;
                originalPosition.y = cameraTarget.position.y;
            } else {
                cameraTarget.position.x = originalPosition.x;
                cameraTarget.position.y = originalPosition.y;
            }
        }
    }

    window.addEventListener('keydown', (e) => {
        if (e.code === 'F4') {
            e.preventDefault();
            toggleFreeCam();
        } else {

            const key = e.key.toLowerCase();
            if (freeCamEnabled) {
                if (['w', 'ц'].includes(key)) keysPressed['up'] = true;
                if (['a', 'ф'].includes(key)) keysPressed['left'] = true;
                if (['s', 'ы'].includes(key)) keysPressed['down'] = true;
                if (['d', 'в'].includes(key)) keysPressed['right'] = true;
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        if (['w', 'ц'].includes(key)) keysPressed['up'] = false;
        if (['a', 'ф'].includes(key)) keysPressed['left'] = false;
        if (['s', 'ы'].includes(key)) keysPressed['down'] = false;
        if (['d', 'в'].includes(key)) keysPressed['right'] = false;
    });

    function moveCamera() {
        if (freeCamEnabled && cameraTarget?.position) {

            if (keysPressed['up']) cameraTarget.position.y -= speed;

            if (keysPressed['down']) cameraTarget.position.y += speed;

            if (keysPressed['left']) cameraTarget.position.x -= speed;

            if (keysPressed['right']) cameraTarget.position.x += speed;
        }
        requestAnimationFrame(moveCamera);
    }

    const initInterval = setInterval(() => {
        if (window.mouseObject?.parent?.position) {
            cameraTarget = window.mouseObject.parent;
            clearInterval(initInterval);
            moveCamera();
        }
    }, 500);
})();
