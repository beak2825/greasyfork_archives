// ==UserScript==
// @name         florr.io magic/shiny firefly timer
// @namespace    http://tampermonkey.net/
// @version      2.4.18
// @description  it tells you, visually
// @author       Kosuken
// @match        https://florr.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520060/florrio%20magicshiny%20firefly%20timer.user.js
// @updateURL https://update.greasyfork.org/scripts/520060/florrio%20magicshiny%20firefly%20timer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // shit
    const timerBox = document.createElement('div');
    timerBox.id = 'mff-timer';
    timerBox.style.position = 'fixed';
    timerBox.style.top = '20px';
    timerBox.style.left = '20px';
    timerBox.style.padding = '10px';
    timerBox.style.backgroundColor = 'rgba(119, 234, 249, 0.8)';
    timerBox.style.color = 'white';
    timerBox.style.textShadow = '1px 1px 0 black, -1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black';
    timerBox.style.fontFamily = '"Ubuntu", sans-serif';
    timerBox.style.fontWeight = 'bold';
    timerBox.style.border = '5px solid rgba(96, 190, 202, 0.5)';
    timerBox.style.borderRadius = '8px';
    timerBox.style.zIndex = '10000';
    timerBox.style.cursor = 'move';
    document.body.appendChild(timerBox);

    let eventNow = false;
    let eventEndsTimeout;

    function updateTimer() {
        const intv = 4732;
        const startT = 0;

        // Tnow = time now
        const Tnow = Math.floor(Date.now() / 1000);

        // next time and sex left
        const nextT = startT + (Math.floor((Tnow - startT) / intv) + 1) * intv;
        const secsLeft = nextT - Tnow;

        if (secsLeft >= intv) {
            // show the end countdown
            if (!eventNow) {
                eventNow = true;
                let eventLength = 60;

                eventEndsTimeout = setInterval(() => {
                    timerBox.innerHTML = `
                        <div>mff stop spawning in: <br><strong>${eventLength}s</strong></div>
                    `;
                    eventLength--;

                    if (eventLength < 0) {
                        clearInterval(eventEndsTimeout);
                        eventNow = false;
                    }
                }, 1000);

                return;
            }
        }

        if (!eventNow) {
            // normal
            const hours = Math.floor(secsLeft / 3600);
            const minutes = Math.floor((secsLeft % 3600) / 60);
            const seconds = secsLeft % 60;

            timerBox.innerHTML = `
                <div>next magic fireflies: <br><strong>${new Date(nextT * 1000).toLocaleTimeString()}</strong></div>
                <div>time left: <br><strong>${hours}h ${minutes}m ${seconds}s</strong></div>
            `;
        }
    }

    // upd8 every sec
    setInterval(updateTimer, 1000);
    updateTimer(); // init

    // drag :D
    timerBox.onmousedown = function (event) {
        event.preventDefault();
        let shiftX = event.clientX - timerBox.getBoundingClientRect().left;
        let shiftY = event.clientY - timerBox.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            timerBox.style.left = pageX - shiftX + 'px';
            timerBox.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        timerBox.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            timerBox.onmouseup = null;
        };
    };

    timerBox.ondragstart = function () {
        return false;
    };
})();
