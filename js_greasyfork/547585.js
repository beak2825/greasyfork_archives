// ==UserScript==
// @name         GoBattle.io Mapping Tool 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Record coords by clicking, export as compact JSON
// @match        https://gobattle.io/*
// @grant        none
// @author       Nightwave
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547585/GoBattleio%20Mapping%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/547585/GoBattleio%20Mapping%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let recording = false;
    let points = [];
    let startPoint = null;

    // Create a simple overlay UI
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '10px';
    overlay.style.right = '10px';
    overlay.style.background = 'rgba(0,0,0,0.7)';
    overlay.style.color = '#fff';
    overlay.style.padding = '8px';
    overlay.style.borderRadius = '6px';
    overlay.style.zIndex = '9999';
    overlay.innerHTML = `
        <div style="font-weight:bold;">Mapping Tool</div>
        <button id="startStopBtn">Start Recording</button>
        <button id="exportBtn">Export</button>
    `;
    document.body.appendChild(overlay);

    const startStopBtn = document.getElementById('startStopBtn');
    const exportBtn = document.getElementById('exportBtn');

    startStopBtn.addEventListener('click', () => {
        recording = !recording;
        startStopBtn.textContent = recording ? 'Stop Recording' : 'Start Recording';
        if (!recording) startPoint = null; // reset if stopped
    });

    exportBtn.addEventListener('click', () => {
        const json = JSON.stringify(points);
        console.log('=== MAPPING DATA ===');
        console.log(json);
        alert('Check console for exported data!');
    });

    window.addEventListener('click', (e) => {
        if (!recording) return;

        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);

        if (!startPoint) {
            startPoint = { x, y };
            console.log(`Start: (${x}, ${y})`);
        } else {
            const rectData = {
                x1: Math.min(startPoint.x, x),
                y1: Math.min(startPoint.y, y),
                x2: Math.max(startPoint.x, x),
                y2: Math.max(startPoint.y, y)
            };
            points.push(rectData);
            console.log(`Saved Rect:`, rectData);
            startPoint = null; // reset for next square
        }
    });
})();
