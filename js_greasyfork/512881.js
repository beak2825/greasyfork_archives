// ==UserScript==
// @name         FPS and Ping Display
// @version      1.0
// @description  Displays FPS and Ping on the top-right corner of the page
// @author       hynap
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/1381858
// @downloadURL https://update.greasyfork.org/scripts/512881/FPS%20and%20Ping%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/512881/FPS%20and%20Ping%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const statsDiv = document.createElement('div');
    statsDiv.style.position = 'fixed';
    statsDiv.style.top = '10px';
    statsDiv.style.right = '10px';
    statsDiv.style.zIndex = '10000';
    statsDiv.style.padding = '5px';
    statsDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    statsDiv.style.color = '#fff';
    statsDiv.style.fontSize = '14px';
    statsDiv.style.fontFamily = 'Arial, sans-serif';
    statsDiv.style.borderRadius = '5px';
    statsDiv.innerHTML = `0<br>0 ms`;
    document.body.appendChild(statsDiv);

    let lastFrameTime = performance.now();
    let frameCount = 0;
    let fps = 0;

    function updateFPS() {
        const now = performance.now();
        frameCount++;
        if (now - lastFrameTime >= 100) {
            fps = (frameCount / ((now - lastFrameTime) / 1000)).toFixed(2);
            lastFrameTime = now;
            frameCount = 0;
        }
        requestAnimationFrame(updateFPS);
    }

    function updatePing() {
        const startTime = performance.now();
        fetch(window.location.href, { method: 'HEAD' })
            .then(() => {
                const ping = (performance.now() - startTime).toFixed(2);
                statsDiv.innerHTML = `${fps}<br>${ping} ms`;
            })
            .catch(() => {
                statsDiv.innerHTML = `${fps}<br>error`;
            });
    }

    setInterval(updatePing, 100);
    requestAnimationFrame(updateFPS);
})