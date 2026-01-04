// ==UserScript==
// @name         FPS Display
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Показывает количество кадров в секунду (FPS) в центре экрана сверху в игре Evades.io
// @author       Remaster
// @match        https://evades.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487640/FPS%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/487640/FPS%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var fpsCounter = document.createElement('div');
    fpsCounter.style.position = 'fixed';
    fpsCounter.style.top = '10px';
    fpsCounter.style.left = '50%';
    fpsCounter.style.transform = 'translateX(-50%)';
    fpsCounter.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    fpsCounter.style.color = 'white';
    fpsCounter.style.padding = '5px';
    fpsCounter.style.zIndex = '9999';
    document.body.appendChild(fpsCounter);

    var frameCount = 0;

    function updateFPS() {
        frameCount++;
    }

    setInterval(function() {
        fpsCounter.textContent = 'FPS: ' + frameCount;
        frameCount = 0;
    }, 1000);

    requestAnimationFrame(function measure() {
        updateFPS();
        requestAnimationFrame(measure);
    });
})();
