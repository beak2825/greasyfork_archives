// ==UserScript==
// @name         Drawaria Zoom & Precise Brush
// @namespace    https://greasyfork.org/en/users/your-username
// @version      1.0
// @description  Adds mouse wheel zoom and precise brush outline in Drawaria
// @author       Lucas
// @match        https://www.drawaria.online/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541656/Drawaria%20Zoom%20%20Precise%20Brush.user.js
// @updateURL https://update.greasyfork.org/scripts/541656/Drawaria%20Zoom%20%20Precise%20Brush.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait until the canvas exists
    const waitForCanvas = setInterval(() => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            clearInterval(waitForCanvas);
            enhanceDrawaria(canvas);
        }
    }, 500);

    function enhanceDrawaria(canvas) {
        const ctx = canvas.getContext('2d');
        let scale = 1;

        // Enable zoom with mouse wheel
        canvas.addEventListener('wheel', function(event) {
            if (!event.ctrlKey) return; // Use Ctrl + Scroll to zoom
            event.preventDefault();
            const delta = event.deltaY > 0 ? 0.9 : 1.1;
            scale *= delta;
            canvas.style.transform = `scale(${scale})`;
            canvas.style.transformOrigin = "center center";
        });

        // Draw brush outline when hovering
        const brushOutline = document.createElement('div');
        brushOutline.style.position = 'absolute';
        brushOutline.style.border = '1px dashed #ff0000';
        brushOutline.style.borderRadius = '50%';
        brushOutline.style.pointerEvents = 'none';
        brushOutline.style.zIndex = '9999';
        brushOutline.style.width = '8px';
        brushOutline.style.height = '8px';
        document.body.appendChild(brushOutline);

        canvas.addEventListener('mousemove', function(e) {
            const rect = canvas.getBoundingClientRect();
            brushOutline.style.left = `${e.clientX - 4}px`;
            brushOutline.style.top = `${e.clientY - 4}px`;
        });
    }
})();
