// ==UserScript==
// @name         PPS Counter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Displays pixels per second
// @author       guildedbird
// @match        pixelplace.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532851/PPS%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/532851/PPS%20Counter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const counterUI = document.createElement('div');
    counterUI.style.position = 'absolute';
    counterUI.style.top = '35px';
    counterUI.style.right = '135px';
    counterUI.style.padding = '4px 6px';
    counterUI.style.background = 'rgba(0, 0, 0, 0.45)';
    counterUI.style.color = '#FFFFFF';
    counterUI.style.fontFamily = 'Arial';
    counterUI.style.fontSize = '0.7em';
    counterUI.style.zIndex = '10';
    counterUI.style.borderRadius = '34px';
    counterUI.style.pointerEvents = 'none';
    counterUI.style.display = 'none';
    document.body.appendChild(counterUI);

    let messagesInCurrentSecond = 0;
    let maxMessagesPerSecond = 0;
    let lastTimestamp = Math.floor(Date.now() / 1000);
    const SEND_CAP = 55.555;
    let lastSendTimestamp = Date.now();

    setInterval(() => {
        const currentTime = Date.now();
        if (currentTime - lastSendTimestamp >= 3000) {
            maxMessagesPerSecond = 0;
            counterUI.textContent = `PPS: ${maxMessagesPerSecond}`;
            counterUI.style.display = 'none';
            console.log('[Tampermonkey] Sec Max reset and UI hidden after 3 seconds of inactivity.');
        }
    }, 1000);

    const hookEmit = () => {
        const io = window.io;
        if (!io || !io.Socket) {
            setTimeout(hookEmit, 500);
            return;
        }

        const originalEmit = io.Socket.prototype.emit;

        io.Socket.prototype.emit = function (...args) {
            const currentTimestamp = Math.floor(Date.now() / 1000);

            if (currentTimestamp !== lastTimestamp) {
                maxMessagesPerSecond -= messagesInCurrentSecond;
                if (maxMessagesPerSecond < 0) {
                    maxMessagesPerSecond = 0;
                }

                maxMessagesPerSecond = Math.max(maxMessagesPerSecond, messagesInCurrentSecond);
                lastTimestamp = currentTimestamp;
                messagesInCurrentSecond = 0;
            }

            if (messagesInCurrentSecond < SEND_CAP) {
                messagesInCurrentSecond++;
                lastSendTimestamp = Date.now();
                counterUI.textContent = `PPS: ${maxMessagesPerSecond}`;
                counterUI.style.display = 'block';
                return originalEmit.apply(this, args);
            } else {
                console.log('[Tampermonkey] Send cap reached for this second.');
                return false;
            }
        };

        console.log('[Tampermonkey] Hooked into Socket.IO emit() with cap');
    };

    hookEmit();
})();