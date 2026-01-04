// ==UserScript==
// @name         Advanced Skribbl.io Cheat GUI
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enhanced Cheat GUI for Skribbl.io
// @match        *://skribbl.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504088/Advanced%20Skribblio%20Cheat%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/504088/Advanced%20Skribblio%20Cheat%20GUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create GUI container
    const gui = document.createElement('div');
    gui.style.position = 'fixed';
    gui.style.top = '10px';
    gui.style.right = '10px';
    gui.style.zIndex = '1000';
    gui.style.backgroundColor = 'white';
    gui.style.padding = '10px';
    gui.style.border = '1px solid black';
    gui.style.borderRadius = '5px';
    
    // Create a close button
    const closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.backgroundColor = 'red';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.addEventListener('click', function() {
        gui.style.display = 'none';
    });
    gui.appendChild(closeButton);
    
    // Create an open button
    const openButton = document.createElement('button');
    openButton.innerText = 'Open Cheats';
    openButton.style.position = 'fixed';
    openButton.style.top = '10px';
    openButton.style.right = '10px';
    openButton.style.zIndex = '1000';
    openButton.addEventListener('click', function() {
        gui.style.display = 'block';
    });
    document.body.appendChild(openButton);

    // Auto-Draw Image Button
    const autoDrawButton = document.createElement('button');
    autoDrawButton.innerText = 'Auto Draw Image';
    autoDrawButton.addEventListener('click', function() {
        // Show file picker to select image
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        input.addEventListener('change', function() {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const image = new Image();
                    image.src = e.target.result;
                    // Logic to auto draw the image on Skribbl.io
                    console.log('Auto drawing image:', image.src);
                };
                reader.readAsDataURL(file);
            }
        });
        input.click();
    });
    gui.appendChild(autoDrawButton);

    // Auto-Guess Button
    const autoGuessButton = document.createElement('button');
    autoGuessButton.innerText = 'Auto Guess';
    autoGuessButton.addEventListener('click', function() {
        // Logic to auto guess
        console.log('Auto Guess activated');
    });
    gui.appendChild(autoGuessButton);

    // Ban Player Button
    const banPlayerButton = document.createElement('button');
    banPlayerButton.innerText = 'Ban Player';
    banPlayerButton.addEventListener('click', function() {
        const playerToBan = prompt('Enter player name to ban:');
        if (playerToBan) {
            // Logic to ban the player and send a report
            console.log('Banning player:', playerToBan);
            // Example of sending a report (Placeholder URL)
            fetch('https://example.com/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ player: playerToBan })
            }).then(response => response.json())
              .then(data => console.log('Report sent:', data));
        }
    });
    gui.appendChild(banPlayerButton);

    // Restart Game Button
    const restartGameButton = document.createElement('button');
    restartGameButton.innerText = 'Restart Game';
    restartGameButton.addEventListener('click', function() {
        // Logic to restart the game
        console.log('Restart Game activated');
    });
    gui.appendChild(restartGameButton);

    // Append GUI to body
    document.body.appendChild(gui);

    // Logic for showing cheats to other players
    // This is complex and not directly feasible with JavaScript due to game restrictions
})();
