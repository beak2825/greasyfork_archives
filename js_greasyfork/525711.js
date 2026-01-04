// ==UserScript==
// @name         Krunker.io Enhancer
// @namespace    https://greasyfork.org/en/users/yourusername
// @version      1.0
// @description  Enhances Krunker.io with a custom crosshair, FPS booster, auto settings loader, and UI improvements.
// @author      lurik furios
// @match        *://krunker.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525711/Krunkerio%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/525711/Krunkerio%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Custom Crosshair
    function addCustomCrosshair() {
        let crosshair = document.createElement('div');
        crosshair.id = 'customCrosshair';
        crosshair.style.position = 'fixed';
        crosshair.style.top = '50%';
        crosshair.style.left = '50%';
        crosshair.style.transform = 'translate(-50%, -50%)';
        crosshair.style.width = '10px';
        crosshair.style.height = '10px';
        crosshair.style.borderRadius = '50%';
        crosshair.style.backgroundColor = 'red';
        crosshair.style.pointerEvents = 'none';
        document.body.appendChild(crosshair);
    }

    // FPS Booster (Lower Graphics Settings)
    function optimizeFPS() {
        localStorage.setItem('krunkerSettings', JSON.stringify({
            particles: false,
            shadows: false,
            reflections: false,
            ambientShading: false,
            resolution: 0.5
        }));
    }

    // Auto Load Settings
    function loadSettings() {
        let settings = localStorage.getItem('krunkerSettings');
        if (settings) {
            Object.assign(window, JSON.parse(settings));
        }
    }

    // UI Enhancements (Dark Mode)
    function applyDarkMode() {
        let style = document.createElement('style');
        style.innerHTML = `
            body { background-color: #222 !important; color: #fff !important; }
            .menuItem { background-color: #333 !important; }
        `;
        document.head.appendChild(style);
    }

    // Apply Enhancements
    window.onload = function() {
        addCustomCrosshair();
        optimizeFPS();
        loadSettings();
        applyDarkMode();
        console.log('Krunker.io Enhancer Loaded!');
    };
})();
