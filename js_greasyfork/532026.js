// ==UserScript==
// @name         Auto Clicker with Mobile & Desktop Draggable UI
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Auto-clicker with a draggable UI that works on desktop and mobile devices too.
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532026/Auto%20Clicker%20with%20Mobile%20%20Desktop%20Draggable%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/532026/Auto%20Clicker%20with%20Mobile%20%20Desktop%20Draggable%20UI.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isClicking = false;
    let interval = 1000;
    let clickInterval;
    let targetElement = null;

    // Create panel
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '50px';
    panel.style.left = '50px';
    panel.style.backgroundColor = 'white';
    panel.style.border = '2px solid black';
    panel.style.padding = '10px';
    panel.style.zIndex = '99999';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    panel.style.touchAction = 'none'; // important for mobile drag
    panel.setAttribute('id', 'autoClickerPanel');

    panel.innerHTML = `
        <div id="panelHeader" style="font-weight:bold; cursor:move; margin-bottom:8px;">Auto Clicker</div>
        Delay (ms): <input type="number" id="clickDelay" value="1000" style="width: 80px;"><br><br>
        <button id="selectTarget">Select Target</button><br><br>
        <button id="startClicker">Start</button>
        <button id="stopClicker">Stop</button>
    `;
    document.body.appendChild(panel);

    // Make panel draggable on both desktop & mobile
    (function makeDraggable(el) {
        const header = document.getElementById('panelHeader');
        let offsetX = 0, offsetY = 0, isDragging = false;

        const startDrag = (e) => {
            isDragging = true;
            offsetX = (e.touches ? e.touches[0].clientX : e.clientX) - el.offsetLeft;
            offsetY = (e.touches ? e.touches[0].clientY : e.clientY) - el.offsetTop;

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchmove', drag);
            document.addEventListener('touchend', stopDrag);
        };

        const drag = (e) => {
            if (!isDragging) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            el.style.left = (clientX - offsetX) + 'px';
            el.style.top = (clientY - offsetY) + 'px';
        };

        const stopDrag = () => {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('touchend', stopDrag);
        };

        header.addEventListener('mousedown', startDrag);
        header.addEventListener('touchstart', startDrag);
    })(panel);

    // Event Listeners
    document.getElementById('selectTarget').addEventListener('click', () => {
        alert('Tap the element you want to auto-click.');
        document.body.style.cursor = 'crosshair';

        const onClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            targetElement = e.target;
            document.body.style.cursor = 'default';
            document.removeEventListener('click', onClick, true);
            alert('Target selected: ' + targetElement.tagName);
        };

        document.addEventListener('click', onClick, true);
    });

    document.getElementById('startClicker').addEventListener('click', () => {
        if (!targetElement) {
            alert('No target selected!');
            return;
        }
        if (isClicking) return;
        interval = parseInt(document.getElementById('clickDelay').value);
        isClicking = true;
        clickInterval = setInterval(() => {
            try {
                targetElement.click();
            } catch (err) {
                console.error('Click failed:', err);
            }
        }, interval);
    });

    document.getElementById('stopClicker').addEventListener('click', () => {
        isClicking = false;
        clearInterval(clickInterval);
    });

})();