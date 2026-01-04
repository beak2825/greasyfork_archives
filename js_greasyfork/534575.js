// ==UserScript==
// @name         jeb_
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Changes avatar appearance based on Minecraft Easter eggs.
// @author       Alpha
// @match        https://skribbl.io/*
// @grant        none
// @icon         https://imgur.com/rVFiCSD.gif
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534575/jeb_.user.js
// @updateURL https://update.greasyfork.org/scripts/534575/jeb_.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const colorSteps = 8;
    const cycleSpeedMs = 250;
    const lookupIntervalMs = 500;

    let cycleInterval = null;
    let currentStep = 0;

    function cleanName(rawName) {
        return rawName.replace(' (You)', '').trim();
    }

    function applyEffectsToAllPlayers() {
        const playerNameElems = document.querySelectorAll('.player-name');

        playerNameElems.forEach(playerNameElem => {
            const rawName = playerNameElem.textContent.trim();
            const name = cleanName(rawName);

            const container = playerNameElem.closest('div.player');
            if (!container) return;

            const colorElem = container.querySelector('div.player-avatar-container > div > div.color');
            const specialElem = container.querySelector('div.player-avatar-container > div > div.special');
            const avatarContainer = container.querySelector('.player-avatar-container');

            if (name === 'jeb_' && colorElem) {
                const xPosition = -100 * currentStep;
                colorElem.style.backgroundPosition = `${xPosition}% 0%`;
                specialElem.style.display = `block`;
                specialElem.style.backgroundPosition = `-900% 0%`;
            }

            if ((name === 'Dinnerbone' || name === 'Grumm') && avatarContainer) {
                avatarContainer.style.transform = 'rotateX(180deg)';
                avatarContainer.style.top = '2px';
                container.style.zIndex = '999';
            }

            if (name === 'Toast' && specialElem) {
                specialElem.style.display = `block`;
                specialElem.style.backgroundPosition = `-800% 0%`;
            }
        });

        currentStep = (currentStep + 1) % colorSteps;
    }

    function startCycling() {
        if (!cycleInterval) {
            cycleInterval = setInterval(applyEffectsToAllPlayers, cycleSpeedMs);
        }
    }

    function waitForPlayers() {
        const check = setInterval(() => {
            if (document.querySelector('.player-name')) {
                startCycling();
                clearInterval(check);
            }
        }, lookupIntervalMs);
    }

    window.addEventListener('load', waitForPlayers);
})();
