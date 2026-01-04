// ==UserScript==
// @name         Kogama Player Tracers and Names
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds visual tracers and player names to Kogama games (for personal use)
// @author       Your Name
// @match        *://*.kogama.com/games/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506388/Kogama%20Player%20Tracers%20and%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/506388/Kogama%20Player%20Tracers%20and%20Names.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and update visual effects
    function updateVisuals() {
        // Remove any existing overlays
        document.querySelectorAll('.custom-tracer').forEach(el => el.remove());
        document.querySelectorAll('.custom-name').forEach(el => el.remove());

        // Example: Assuming player elements have the class 'player' and a data attribute 'data-name'
        const players = document.querySelectorAll('.player'); // Adjust this selector as needed

        players.forEach(player => {
            // Create tracer
            const tracer = document.createElement('div');
            tracer.className = 'custom-tracer';
            tracer.style.position = 'absolute';
            tracer.style.width = '2px';
            tracer.style.height = '100px'; // Adjust height as needed
            tracer.style.backgroundColor = 'red';
            tracer.style.top = (player.offsetTop - 50) + 'px'; // Position it above the player
            tracer.style.left = (player.offsetLeft + (player.offsetWidth / 2)) + 'px'; // Centered
            document.body.appendChild(tracer);

            // Create name label
            const nameLabel = document.createElement('div');
            nameLabel.className = 'custom-name';
            nameLabel.style.position = 'absolute';
            nameLabel.style.top = (player.offsetTop - 20) + 'px'; // Position it above the player
            nameLabel.style.left = (player.offsetLeft + (player.offsetWidth / 2)) + 'px'; // Centered
            nameLabel.style.color = 'white';
            nameLabel.style.textAlign = 'center';
            nameLabel.textContent = player.getAttribute('data-name'); // Adjust based on how names are stored
            document.body.appendChild(nameLabel);
        });
    }

    // Update visuals every 500ms
    setInterval(updateVisuals, 500);

})();
