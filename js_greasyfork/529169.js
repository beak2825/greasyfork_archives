// ==UserScript==
// @name         ASMR
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Execute UserScript
// @author       Your Name
// @match        https://asmr18.fans/* 
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529169/ASMR.user.js
// @updateURL https://update.greasyfork.org/scripts/529169/ASMR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement('div');
    button.style.position = 'fixed';
    button.style.top = '15px';
    button.style.left = '50px';
    button.style.width = '25px';
    button.style.height = '25px';
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '10000';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';

    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.style.width = '20px';
        line.style.height = '3px';
        line.style.backgroundColor = 'white';
        line.style.margin = '2px 0';
        button.appendChild(line);
    }

    button.addEventListener('click', () => {
javascript:(function() {      if (document.getElementById('videoControlPopup')) {         document.getElementById('videoControlPopup').remove();         return;     }       const popup = document.createElement('div');     popup.id = 'videoControlPopup';     popup.style.position = 'fixed';     popup.style.top = '20px';     popup.style.right = '20px';     popup.style.backgroundColor = '#fff';     popup.style.border = '2px solid #000';     popup.style.padding = '10px';     popup.style.zIndex = '9999';       const title = document.createElement('div');     title.textContent = 'Video Controls';     title.style.fontWeight = 'bold';     title.style.marginBottom = '10px';     popup.appendChild(title);       const speedControls = [0.25, 0.5, 1, 2, 3];     const speedContainer = document.createElement('div');     speedControls.forEach(speed => {         const button = document.createElement('button');         button.textContent = `x${speed}`;         button.style.margin = '5px';         button.onclick = function() {             const video = document.querySelector('video');             if (video) video.playbackRate = speed;         };         speedContainer.appendChild(button);     });     popup.appendChild(speedContainer);       const skipTimes = [-30, -10, -5, 5, 10, 30];     const skipContainer = document.createElement('div');     skipTimes.forEach(time => {         const button = document.createElement('button');         button.textContent = `${time > 0 ? '+' : ''}${time}`;         button.style.margin = '5px';         button.onclick = function() {             const video = document.querySelector('video');             if (video) video.currentTime += time;         };         skipContainer.appendChild(button);     });     popup.appendChild(skipContainer);       const closeButton = document.createElement('button');     closeButton.textContent = 'x';     closeButton.style.position = 'absolute';     closeButton.style.top = '5px';     closeButton.style.right = '5px';     closeButton.onclick = function() {         popup.remove();     };     popup.appendChild(closeButton);       document.body.appendChild(popup); })();
    });

    document.body.appendChild(button);
})();