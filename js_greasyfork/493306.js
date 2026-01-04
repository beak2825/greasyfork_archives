// ==UserScript==
// @name         流动彩灯
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add a festive lights effect with slower motion to the edges of the Discourse forum
// @author       You
// @match        https://linux.do/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/493306/%E6%B5%81%E5%8A%A8%E5%BD%A9%E7%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/493306/%E6%B5%81%E5%8A%A8%E5%BD%A9%E7%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '100000';
    const ctx = canvas.getContext('2d');

    const lights = [];
    const numLights = 100;
    const maxRadius = 5;
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']; // Red, Green, Blue, Yellow, Magenta, Cyan

    // Create lights around all edges
    for (let i = 0; i < numLights; i++) {
        let position = Math.random();
        let x, y;
        if (position < 0.25) { // Top edge
            x = Math.random() * canvas.width;
            y = 0;
        } else if (position < 0.5) { // Right edge
            x = canvas.width;
            y = Math.random() * canvas.height;
        } else if (position < 0.75) { // Bottom edge
            x = Math.random() * canvas.width;
            y = canvas.height;
        } else { // Left edge
            x = 0;
            y = Math.random() * canvas.height;
        }

        lights.push({
            x: x,
            y: y,
            radius: Math.random() * maxRadius + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: (Math.random() - 0.5) * 2 // Reduced speed for slower motion
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lights.forEach(light => {
            ctx.beginPath();
            ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
            ctx.fillStyle = light.color;
            ctx.fill();

            // Update light position
            light.x += light.speed;
            light.y += light.speed;
            // Wrap around the edges
            if (light.x > canvas.width + maxRadius) {
                light.x = -maxRadius;
            } else if (light.x < -maxRadius) {
                light.x = canvas.width + maxRadius;
            }
            if (light.y > canvas.height + maxRadius) {
                light.y = -maxRadius;
            } else if (light.y < -maxRadius) {
                light.y = canvas.height + maxRadius;
            }
        });
    }

    setInterval(draw, 40); // Update the scene
})();