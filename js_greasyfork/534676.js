// ==UserScript==
// @name         Bloxd.io Auto-Aim + Attack
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This is only for test, and i asked chatgpt for injection it kinda dumbass test it yourself 
// @author       zNxrbd
// @match        *://*.bloxd.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534676/Bloxdio%20Auto-Aim%20%2B%20Attack.user.js
// @updateURL https://update.greasyfork.org/scripts/534676/Bloxdio%20Auto-Aim%20%2B%20Attack.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let mouseDown = false;
    let gameLoaded = false;
    let sendPacketFunc = null;

    // Watch for left mouse hold
    window.addEventListener('mousedown', e => {
        if (e.button === 0) mouseDown = true;
    });
    window.addEventListener('mouseup', e => {
        if (e.button === 0) mouseDown = false;
    });

    // Wait until Noa and packet sender exist
    const waitForGame = () => {
        const interval = setInterval(() => {
            if (window.noa && noa.entities && window.SendPacket) {
                sendPacketFunc = window.SendPacket;
                gameLoaded = true;
                clearInterval(interval);
                startAutoAttack();
            }
        }, 250);
    };

    const getDistance = (a, b) => {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    };

    const rotateToTarget = (playerPos, targetPos) => {
        const dx = targetPos[0] - playerPos[0];
        const dz = targetPos[2] - playerPos[2];
        const angle = Math.atan2(dz, dx) - Math.PI / 2;
        noa.camera.heading = angle;
    };

    const sendAttackPacket = () => {
        if (typeof sendPacketFunc === "function") {
            sendPacketFunc(2, 'action|attack');
        }
    };

    function startAutoAttack() {
        function tick() {
            if (!mouseDown || !gameLoaded) {
                requestAnimationFrame(tick);
                return;
            }

            const playerId = noa.playerEntity;
            const playerPos = noa.entities.getPosition(playerId);

            let closest = null;
            let closestDist = 3; // max range

            noa.entities.getAllEntities().forEach(e => {
                if (e === playerId) return;
                const pos = noa.entities.getPosition(e);
                if (!pos) return;
                const dist = getDistance(playerPos, pos);
                if (dist <= closestDist) {
                    closest = e;
                    closestDist = dist;
                }
            });

            if (closest) {
                const targetPos = noa.entities.getPosition(closest);
                rotateToTarget(playerPos, targetPos);
                sendAttackPacket();
            }

            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    waitForGame();
})();
