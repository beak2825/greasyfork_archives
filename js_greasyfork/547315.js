// ==UserScript==
// @name         Klavia Page Zoom (Toggleable)
// @namespace    https://www.playklavia.com
// @version      2.1
// @description  Toggle page zoom on/off with Z key and show indicator
// @match        https://www.playklavia.com*
// @match        https://www.playklavia.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547315/Klavia%20Page%20Zoom%20%28Toggleable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547315/Klavia%20Page%20Zoom%20%28Toggleable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ZOOM_LEVEL = 1.4; // 140%
    const STORAGE_KEY = 'klaviaZoomOn';
    let zoomed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'true');

    // Create the on-screen indicator
    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.bottom = '12px';
    indicator.style.right = '12px';
    indicator.style.padding = '6px 10px';
    indicator.style.background = 'rgba(0,0,0,0.7)';
    indicator.style.color = '#fff';
    indicator.style.fontFamily = 'Arial, sans-serif';
    indicator.style.fontSize = '14px';
    indicator.style.borderRadius = '6px';
    indicator.style.zIndex = '999999';
    indicator.style.userSelect = 'none';
    document.body.appendChild(indicator);

    function updateIndicator() {
        indicator.textContent = zoomed ? `Zoom: ON (${ZOOM_LEVEL * 100}%)` : 'Zoom: OFF';
    }

    // Apply zoom
    function applyZoom() {
        document.body.style.zoom = zoomed ? `${ZOOM_LEVEL}` : '1';
        updateIndicator();
    }

    // Initial application
    applyZoom();

    // Toggle zoom with Z key
    document.addEventListener('keydown', e => {
        if (e.key.toLowerCase() === 'z') {
            zoomed = !zoomed;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(zoomed));
            applyZoom();
        }
    });

})();
