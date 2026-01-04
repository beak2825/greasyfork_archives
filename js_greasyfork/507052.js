// ==UserScript==
// @name         Agar.io Username Teleport Cheat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Teleport to a player by username in Agar.io (client-side)
// @author       ProDev
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507052/Agario%20Username%20Teleport%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/507052/Agario%20Username%20Teleport%20Cheat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let ws;  // WebSocket connection reference
    let players = {};  // Store players data by their ID

    // Create the GUI
    const gui = document.createElement('div');
    gui.style.position = 'fixed';
    gui.style.top = '10px';
    gui.style.left = '10px';
    gui.style.background = 'white';
    gui.style.border = '2px solid black';
    gui.style.zIndex = '9999';
    gui.style.padding = '10px';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter Username';
    gui.appendChild(input);
    
    const button = document.createElement('button');
    button.innerHTML = 'Teleport';
    gui.appendChild(button);
    
    document.body.appendChild(gui);

    // Function to simulate teleportation
    function teleportToCoordinates(x, y) {
        if (ws && ws.readyState === WebSocket.OPEN) {
            // Create the movement packet
            let teleportPacket = new DataView(new ArrayBuffer(21));
            teleportPacket.setUint8(0, 16);  // Message type for movement
            teleportPacket.setFloat32(1, x, true);
            teleportPacket.setFloat32(5, y, true);
            teleportPacket.setUint32(9, 0, true);  // Simulated mass (0 for default)
            ws.send(teleportPacket.buffer);
        }
    }

    // Find the player by username and attempt to teleport
    button.addEventListener('click', function() {
        const targetUsername = input.value.trim();
        if (!targetUsername) {
            alert('Enter a username');
            return;
        }

        // Find player by username
        for (let playerId in players) {
            if (players[playerId].name === targetUsername) {
                teleportToCoordinates(players[playerId].x, players[playerId].y);
                return;
            }
        }

        alert('Player not found!');
    });

    // Intercept the WebSocket connection
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        ws = new originalWebSocket(url, protocols);

        ws.addEventListener('message', function(event) {
            const data = new DataView(event.data);

            // Here we attempt to parse the incoming WebSocket messages
            // This is where you'd capture player positions

            // For demo purposes: Assume the server sends player info in a specific way
            const type = data.getUint8(0);  // Example: message type 16 for movement updates

            if (type === 16) {
                const playerId = data.getUint32(1, true);  // Player ID (example)
                const x = data.getFloat32(5, true);  // X coordinate
                const y = data.getFloat32(9, true);  // Y coordinate

                const playerName = 'Unknown';  // Replace with actual logic to extract player names
                players[playerId] = { x, y, name: playerName };
            }
        });

        return ws;
    };

})();
