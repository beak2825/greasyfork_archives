// ==UserScript==
// @name         Mine-craft.io FOV Changer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shift + Scroll Wheel for Fov Change is that Simple.
// @author       Junes
// @license      MIT
// @match        *://*.mine-craft.io/*
// @match        *://*.mine-craft.fun/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542841/Mine-craftio%20FOV%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/542841/Mine-craftio%20FOV%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let currentFov = 1000;
    const commandTemplate = "/fov {fov}";
    const scrollCooldown = 150;
    let isShiftPressed = false;
    let isCoolingDown = false;
    function sendFovCommand(fovValue) {
        const chatInput = document.getElementById('chat-input');
        if (!chatInput) {
            console.error("Fuck it");
            return;
        }
        const commandText = commandTemplate.replace('{fov}', fovValue);

        const typeAndSendCommand = () => {
            const input = document.getElementById('chat-input');
            if (input) {
                input.value = commandText;
                input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
            }
        };

        if (!chatInput.classList.contains('show')) {
            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
            setTimeout(typeAndSendCommand, 50);
        } else {
            typeAndSendCommand();
        }
    }
    document.addEventListener('wheel', function(event) {
        if (!isShiftPressed || isCoolingDown) return;
        event.preventDefault();
        isCoolingDown = true;
        setTimeout(() => { isCoolingDown = false; }, scrollCooldown);

        if (event.deltaY < 0) {
            currentFov += 100;
        } else {
            currentFov -= 100;
            if (currentFov < 0) currentFov = 0;
        }
        sendFovCommand(currentFov);
    }, { passive: false });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Shift') isShiftPressed = true;
    });
    window.addEventListener('keyup', (event) => {
        if (event.key === 'Shift') isShiftPressed = false;
    });
})();