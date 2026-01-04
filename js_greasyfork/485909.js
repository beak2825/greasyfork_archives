// ==UserScript==
// @name         Bonk.io Chat Command
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide player names in bonk.io chat if /hide is typed
// @author       You
// @match        https://www.bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485909/Bonkio%20Chat%20Command.user.js
// @updateURL https://update.greasyfork.org/scripts/485909/Bonkio%20Chat%20Command.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide player names
    function hidePlayerNames() {
        // Find all player name elements and hide them
        const playerNames = document.querySelectorAll('.playerName');
        playerNames.forEach(nameElement => {
            nameElement.style.visibility = 'hidden';
        });
    }

    // Function to monitor the bonk.io chat
    function monitorChat() {
        const chatInput = document.getElementById('chatInput');

        if (chatInput) {
            // Add event listener to chat input
            chatInput.addEventListener('keydown', function(event) {
                // Check if Enter key is pressed
                if (event.key === 'Enter') {
                    const chatMessage = chatInput.value.trim();

                    // Check if the chat message is "/hide"
                    if (chatMessage === '/hide') {
                        hidePlayerNames();
                        // Clear the chat input after processing the command
                        chatInput.value = '';
                    }
                }
            });
        }
    }

    // Run the script
    monitorChat();
})();

