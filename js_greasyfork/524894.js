// ==UserScript==
// @name         Chat Spam Control with Player Info
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Chat spamming control with UI elements and player info
// @author       You
// @match        https://craftnite.io/*
// @grant        none
// @license LOVEJL
// @downloadURL https://update.greasyfork.org/scripts/524894/Chat%20Spam%20Control%20with%20Player%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/524894/Chat%20Spam%20Control%20with%20Player%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let cheatnite = {};
    let spamInterval = null;
    let isInputVisible = true;
    let playerInfo = {};  // To store IP address and coordinates for each player

    // Add spam control UI elements
    const chatBox = document.createElement('div');
    chatBox.style.position = 'fixed';
    chatBox.style.top = '50%';
    chatBox.style.left = '50%';
    chatBox.style.transform = 'translate(-50%, -50%)';
    chatBox.style.zIndex = '1000';
    chatBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    chatBox.style.padding = '10px';
    chatBox.style.borderRadius = '10px';
    chatBox.style.display = 'flex';
    chatBox.style.flexDirection = 'column';
    chatBox.style.alignItems = 'center';

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Enter your message';
    inputField.style.marginBottom = '10px';
    inputField.style.padding = '5px';

    const spamButton = document.createElement('button');
    spamButton.innerText = 'Spam';
    spamButton.style.marginBottom = '5px';
    spamButton.onclick = () => {
        const message = inputField.value.trim();
        if (message) {
            // Stop any existing spam
            if (spamInterval) {
                clearInterval(spamInterval);
                spamInterval = null;
            }
            // Start new spam
            spamInterval = setInterval(() => {
                var e = new a201();
                e.msg = message;
                if (G.socket && typeof G.socket.send === 'function') {
                    G.socket.send(e.a614());
                }
            }, 60);
        }
    };

    const stopButton = document.createElement('button');
    stopButton.innerText = 'Stop';
    stopButton.style.marginBottom = '5px';
    stopButton.onclick = () => {
        if (spamInterval) {
            clearInterval(spamInterval);
            spamInterval = null;
        }
    };

    const clearButton = document.createElement('button');
    clearButton.innerText = 'Clear';
    clearButton.style.marginBottom = '5px';
    clearButton.onclick = () => {
        inputField.value = '';
    };

    const playerButton = document.createElement('button');
    playerButton.innerText = 'Players';
    playerButton.style.marginBottom = '5px';
    playerButton.onclick = () => {
        startPlayerInfoSpam();
    };

    chatBox.appendChild(inputField);
    chatBox.appendChild(spamButton);
    chatBox.appendChild(stopButton);
    chatBox.appendChild(clearButton);
    chatBox.appendChild(playerButton);
    document.body.appendChild(chatBox);

    function startPlayerInfoSpam() {
        if (spamInterval) {
            clearInterval(spamInterval);
        }
        spamInterval = setInterval(() => {
            let players = getOtherPlayers();
            players.forEach(player => {
                if (player.name && player.name.toLowerCase() === "unnamed") {
                    if (!playerInfo[player.hitbox.uuid]) {
                        playerInfo[player.hitbox.uuid] = {
                            ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                            coords: `${(Math.random() * 180 - 90).toFixed(6)}, ${(Math.random() * 360 - 180).toFixed(6)}`
                        };
                    }
                    let playerWorldPosition = new THREE.Vector3();
                    player.a240.getWorldPosition(playerWorldPosition);
                    var e = new a201();
                    e.msg = `Player: ${player.name}, Location: ${playerWorldPosition.toArray()}, IP: ${playerInfo[player.hitbox.uuid].ip}, Coordinates: ${playerInfo[player.hitbox.uuid].coords}`;
                    if (G.socket && typeof G.socket.send === 'function') {
                        G.socket.send(e.a614());
                    }
                }
            });
        }, 1000); // Send player information as message every second
    }

    function getOtherPlayers() {
        return G.othera822ers.filter(player => player && player.a240).map(player => {
            if (!player.hitbox) {
                var hitbox = new THREE.Mesh(
                    new THREE.BoxGeometry(3, 10, 3),
                    new THREE.MeshBasicMaterial({ visible: true }) // Make hitboxes visible
                );
                player.hitbox = hitbox;
                player.a240.add(hitbox);
            }
            return player;
        });
    }

    // Prevent default WASD, space, and other keys when input field is focused
    inputField.addEventListener('keydown', (event) => {
        console.log(`Key pressed: ${event.key}`); // Log pressed key to console

        // Allow all alphanumeric keys and control shortcuts
        if (!event.ctrlKey && (event.key.length === 1 && event.key.match(/[a-z0-9]/i) || event.key === ' ')) {
            // Prevent game actions but allow typing
            event.preventDefault();
            event.stopPropagation();
            inputField.value += event.key;
        }
    });

    // Enable paste functionality
    inputField.addEventListener('paste', (event) => {
        // Allow default paste behavior
        setTimeout(() => {
            const pastedText = inputField.value;
            console.log(`Pasted text: ${pastedText}`);
        }, 0);
    });

    // Hide and show input box with key '7'
    document.addEventListener('keydown', (event) => {
        if (event.key === '7') {
            isInputVisible = !isInputVisible;
            chatBox.style.display = isInputVisible ? 'flex' : 'none';
        }
    });

    // G.socket.onmessage error handling
    if (G.socket) {
        G.socket.onmessage = function(event) {
            try {
                // Existing logic
            } catch (error) {
                console.error('Error processing message:', error);
            }
        };
    } else {
        console.error('G.socket is null or undefined');
    }
})();
