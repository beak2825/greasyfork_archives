// ==UserScript==
// @name         Website Usage Timer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Shows a timer on any website to track time spent, with hide/show toggle
// @author       Drewby123
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529615/Website%20Usage%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/529615/Website%20Usage%20Timer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Prevent script from running inside iframes
    if (window.top !== window.self) return;

    // Create the container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'flex-end';
    container.style.gap = '6px';

    // Create the timer box
    const timerBox = document.createElement('div');
    timerBox.id = 'site-timer-overlay';
    timerBox.style.background = 'rgba(0, 0, 0, 0.7)';
    timerBox.style.color = '#fff';
    timerBox.style.padding = '10px 14px';
    timerBox.style.borderRadius = '10px';
    timerBox.style.fontFamily = 'monospace';
    timerBox.style.fontSize = '14px';
    timerBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)';
    timerBox.textContent = 'Time on site: 00:00';

    // Create the toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '⨉';
    toggleBtn.style.background = '#000';
    toggleBtn.style.border = '1px solid #fff';
    toggleBtn.style.color = '#fff';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.fontSize = '14px';
    toggleBtn.style.fontFamily = 'monospace';
    toggleBtn.style.padding = '4px 8px';
    toggleBtn.style.borderRadius = '6px';
    toggleBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    toggleBtn.style.transition = 'background 0.2s';
    toggleBtn.onmouseenter = () => toggleBtn.style.background = '#222';
    toggleBtn.onmouseleave = () => toggleBtn.style.background = '#000';

    let visible = true;
    toggleBtn.onclick = () => {
        visible = !visible;
        timerBox.style.display = visible ? 'block' : 'none';
        toggleBtn.textContent = visible ? '⨉' : '⧉';
    };

    container.appendChild(toggleBtn);
    container.appendChild(timerBox);
    document.body.appendChild(container);

    // Timer logic
    let seconds = 0;
    setInterval(() => {
        if (visible) {
            seconds++;
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            timerBox.textContent = `Time on site: ${mins}:${secs}`;
        }
    }, 1000);
})();
