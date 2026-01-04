// ==UserScript==
// @name         Display Time
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Displays the current time in the any place of the page.
// @author       You
// @match       *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/533489/Display%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/533489/Display%20Time.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const defaultSettings = {
        top: '10px',
        left: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        textColor: 'white',
        fontSize: '14px',
        draggable: false // Initial draggable state
    };
    const settings = Object.assign({}, defaultSettings, GM_getValue('timeDisplaySettings'));
    function saveSettings() {
        GM_setValue('timeDisplaySettings', settings);
    }
    const timeDiv = document.createElement('div');
    timeDiv.id = 'myTimeDisplay';
    styleTimeDiv();
    function styleTimeDiv() {
        timeDiv.style.position = 'fixed';
        timeDiv.style.top = settings.top;
        timeDiv.style.left = settings.left;
        timeDiv.style.padding = '5px 10px';
        timeDiv.style.backgroundColor = settings.backgroundColor;
        timeDiv.style.color = settings.textColor;
        timeDiv.style.borderRadius = '5px';
        timeDiv.style.zIndex = '9999';
        timeDiv.style.fontSize = settings.fontSize;
        timeDiv.style.cursor = settings.draggable ? 'move' : 'default';
    }
    function updateTime() {
        const now = new Date();
        timeDiv.textContent = now.toLocaleTimeString();
    }
    let isDragging = false;
    let offsetX, offsetY;
    timeDiv.addEventListener('mousedown', (e) => {
        if (settings.draggable) {
            isDragging = true;
            offsetX = e.clientX - timeDiv.offsetLeft;
            offsetY = e.clientY - timeDiv.offsetTop;
        }
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            settings.left = (e.clientX - offsetX) + 'px';
            settings.top = (e.clientY - offsetY) + 'px';
            timeDiv.style.left = settings.left;
            timeDiv.style.top = settings.top;
        }
    });
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            saveSettings();
        }
    });
    document.body.appendChild(timeDiv);
    updateTime();
    setInterval(updateTime, 1000);
    GM_registerMenuCommand("Toggle Draggable", () => {
        settings.draggable = !settings.draggable;
        styleTimeDiv(); // Reapply styles
        saveSettings();
    });
})();