// ==UserScript==
// @name         House of Hazards Speedrun Timer!
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a MM:SS:MS timer to the top right of the screen with start, stop, and reset controls
// @author       You
// @match        https://kdata1.com/2020/10/House_of_Hazards/
// @grant        none
// @license      CC BY 4.0
// @downloadURL https://update.greasyfork.org/scripts/528271/House%20of%20Hazards%20Speedrun%20Timer%21.user.js
// @updateURL https://update.greasyfork.org/scripts/528271/House%20of%20Hazards%20Speedrun%20Timer%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let timerDiv = document.createElement('div');
    timerDiv.style.position = 'fixed';
    timerDiv.style.top = '15%';
    timerDiv.style.right = '10px';
    timerDiv.style.background = 'rgba(0, 0, 0, 0.7)';
    timerDiv.style.color = 'white';
    timerDiv.style.padding = '5px 10px';
    timerDiv.style.fontSize = '18px';
    timerDiv.style.fontFamily = 'monospace';
    timerDiv.style.borderRadius = '5px';
    timerDiv.style.zIndex = '9999';
    timerDiv.innerText = '00:00:000'; // Ensure it's visible immediately
    document.body.appendChild(timerDiv);

    let startTime = 0;
    let elapsedTime = 0;
    let running = false;
    let animationFrame;

    function updateTimer() {
        let now = performance.now() - startTime + elapsedTime;
        let minutes = Math.floor(now / 60000).toString().padStart(2, '0');
        let seconds = Math.floor((now % 60000) / 1000).toString().padStart(2, '0');
        let milliseconds = Math.floor(now % 1000).toString().padStart(3, '0');
        timerDiv.innerText = `${minutes}:${seconds}:${milliseconds}`;
        if (running) {
            animationFrame = requestAnimationFrame(updateTimer);
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === '1' && !running) {
            startTime = performance.now();
            running = true;
            updateTimer();
        } else if (event.key === '2' && running) {
            elapsedTime += performance.now() - startTime;
            running = false;
            cancelAnimationFrame(animationFrame);
        } else if (event.key === '3') {
            running = false;
            elapsedTime = 0;
            timerDiv.innerText = '00:00:000';
            cancelAnimationFrame(animationFrame);
        }
    });
})();
