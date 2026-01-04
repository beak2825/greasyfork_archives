// ==UserScript==
// @name         Ferge2.io ESP Demo Overlay
// @namespace    http://Ferge.io/
// @version      0.1
// @description  Basic ESP overlay canvas demo for Ferge2.io (dummy data)
// @author       YourName
// @match        https://ferge2.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539645/Ferge2io%20ESP%20Demo%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/539645/Ferge2io%20ESP%20Demo%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create overlay canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.pointerEvents = 'none'; // click-through
    canvas.style.zIndex = '9999';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Resize overlay with window
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Dummy player positions (screen coords)
    const players = [
        {x: 300, y: 200, name: 'Enemy1', health: 80},
        {x: 600, y: 400, name: 'Enemy2', health: 50},
        {x: 900, y: 150, name: 'Ally1', health: 100},
    ];

    function drawESP() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        players.forEach(p => {
            // Draw box
            ctx.strokeStyle = p.name.startsWith('Enemy') ? 'red' : 'green';
            ctx.lineWidth = 2;
            ctx.strokeRect(p.x - 20, p.y - 40, 40, 80);

            // Draw health bar
            ctx.fillStyle = 'black';
            ctx.fillRect(p.x - 22, p.y - 45, 44, 8);
            ctx.fillStyle = 'limegreen';
            ctx.fillRect(p.x - 20, p.y - 43, 40 * (p.health / 100), 4);

            // Draw name
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.fillText(p.name, p.x - ctx.measureText(p.name).width / 2, p.y - 50);
        });
    }

    // Animation loop
    function loop() {
        drawESP();
        requestAnimationFrame(loop);
    }
    loop();
})();
