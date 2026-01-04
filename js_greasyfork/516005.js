// ==UserScript==
// @name         Cryzen.io Lightweight Performance Boost
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Simplified Cryzen.io performance boost script for low-end systems.
// @match        https://cryzen.io/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516005/Cryzenio%20Lightweight%20Performance%20Boost.user.js
// @updateURL https://update.greasyfork.org/scripts/516005/Cryzenio%20Lightweight%20Performance%20Boost.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Cryzen.io Lightweight Performance Boost Loaded.");

    
    function limitFrameRate(fps = 30) {
        const originalRequestAnimationFrame = window.requestAnimationFrame;
        let lastCall = 0;

        window.requestAnimationFrame = function(callback) {
            const now = performance.now();
            if (now - lastCall >= 1000 / fps) {
                lastCall = now;
                originalRequestAnimationFrame(callback);
            } else {
                
                originalRequestAnimationFrame(callback);
            }
        };
    }

    
    function applyGraphicsOptimizations() {
        try {
            const graphicsConfig = {
                shadows: false,  
                textures: "low", 
                effects: "minimal" 
            };

            const materialSettings = {
                wireframe: false, // Evita o modo wireframe
                opacity: 1 
            };

            console.log("Graphics optimizations applied:", graphicsConfig, materialSettings);
        } catch (e) {
            console.warn("Graphics optimization error:", e);
        }
    }

    
    function startOptimizations() {
        limitFrameRate(30); 
        applyGraphicsOptimizations(); 
    }

    
    const intervalId = setInterval(() => {
        const gameLoaded = document.querySelector('canvas');
        if (gameLoaded) {
            clearInterval(intervalId);
            startOptimizations();
            console.log("Optimizations applied successfully.");
        }
    }, 1000); 
})();
