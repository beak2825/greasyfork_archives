// ==UserScript==
// @name         /line
// @namespace    http://tampermonkey.net/
// @version      2024-10-27
// @description  just type /line in the chat to activate the script!!
// @author       Gamer Luka YT - @gamerluka1451 YouTube.com/@gamerluka1451
// @match        https://cellcraft.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cellcraft.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514378/line.user.js
// @updateURL https://update.greasyfork.org/scripts/514378/line.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let linesActive = false;

// Function to toggle lines
function toggleLines() {
    if (linesActive) {
        // Remove the lines
        console.log("Removing lines...");
        document.querySelectorAll('.line').forEach(line => line.remove());
        linesActive = false;
    } else {
        // Create style and lines
        console.log("Adding lines...");
        const style = document.createElement('style');
        style.textContent = `
            .line {
                position: fixed;
                background: black;
                z-index: 9999;
            }
            .horizontal {
                top: 50%;
                left: 0;
                right: 0;
                height: 2px;
            }
            .vertical {
                top: 0;
                bottom: 0;
                left: 50%;
                width: 2px;
            }
        `;
        document.head.appendChild(style);

        const horizontalLine = document.createElement('div');
        horizontalLine.className = 'line horizontal';
        document.body.appendChild(horizontalLine);

        const verticalLine = document.createElement('div');
        verticalLine.className = 'line vertical';
        document.body.appendChild(verticalLine);

        linesActive = true;
    }
}

// Add event listener to the chat input
const chatInput = document.getElementById('chtbox');
chatInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const message = chatInput.value.trim();
        if (message === '/line') {
            toggleLines();
            chatInput.value = ''; // Clear input after command
            event.preventDefault(); // Prevent default action (sending the text)
        }
    }
});

})();