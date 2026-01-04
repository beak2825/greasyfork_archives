// ==UserScript==
// @name         Bloxd.io Dev Special Tools Private but Got Public for Banning Random People
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds custom features like ESP, Anti-Ban, and Warning
// @author       You
// @match        https://bloxd.io/
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524519/Bloxdio%20Dev%20Special%20Tools%20Private%20but%20Got%20Public%20for%20Banning%20Random%20People.user.js
// @updateURL https://update.greasyfork.org/scripts/524519/Bloxdio%20Dev%20Special%20Tools%20Private%20but%20Got%20Public%20for%20Banning%20Random%20People.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Warning screen with Andrew Tate background
    const warnContainer = document.createElement('div');
    warnContainer.style.position = 'fixed';
    warnContainer.style.top = '0';
    warnContainer.style.left = '0';
    warnContainer.style.width = '100%';
    warnContainer.style.height = '100%';
    warnContainer.style.backgroundImage =
        'url("https://tse2.mm.bing.net/th?id=OIP.VaIfBulWjKGixh6nv77KnQHaHa&pid=Api")';
    warnContainer.style.backgroundSize = 'cover';
    warnContainer.style.zIndex = '10000';
    warnContainer.style.display = 'flex';
    warnContainer.style.justifyContent = 'center';
    warnContainer.style.alignItems = 'center';
    warnContainer.style.opacity = '1';
    warnContainer.style.transition = 'opacity 3s ease'; // Fade-out in 3 seconds

    const warnBox = document.createElement('div');
    warnBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    warnBox.style.color = 'red';
    warnBox.style.padding = '20px';
    warnBox.style.borderRadius = '10px';
    warnBox.style.textAlign = 'center';
    warnBox.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.8)';

    const warnTitle = document.createElement('h1');
    warnTitle.textContent = 'WARN';
    warnBox.appendChild(warnTitle);

    const warnMessage = document.createElement('p');
    warnMessage.textContent = 'These mods are so dead so watch out';
    warnBox.appendChild(warnMessage);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginTop = '10px';
    closeButton.style.padding = '10px';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = 'red';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '16px';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

    closeButton.addEventListener('click', () => {
        closeButton.style.transform = 'scale(1.05)';
        closeButton.style.opacity = '0.8';

        warnContainer.style.opacity = '0'; // Gradual fade-out

        setTimeout(() => {
            document.body.removeChild(warnContainer); // Remove after fading out
        }, 3000); // Match the new fade-out duration (3 seconds)
    });

    warnBox.appendChild(closeButton);
    warnContainer.appendChild(warnBox);
    document.body.appendChild(warnContainer);

    // Create the GUI container
    const gui = document.createElement('div');
    gui.style.position = 'fixed';
    gui.style.top = '10px';
    gui.style.left = '10px';
    gui.style.backgroundColor = 'black';
    gui.style.color = 'white';
    gui.style.padding = '10px';
    gui.style.border = '2px solid white';
    gui.style.borderRadius = '8px';
    gui.style.zIndex = '10001';
    gui.style.width = '200px';
    gui.style.cursor = 'move';

    let isDragging = false;
    let offsetX, offsetY;

    gui.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - gui.getBoundingClientRect().left;
        offsetY = e.clientY - gui.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            gui.style.left = `${e.clientX - offsetX}px`;
            gui.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Refresh Button
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh Page';
    refreshButton.style.margin = '5px';
    refreshButton.style.padding = '5px';
    refreshButton.style.backgroundColor = 'gray';
    refreshButton.style.color = 'white';
    refreshButton.style.border = 'none';
    refreshButton.style.borderRadius = '5px';
    refreshButton.style.cursor = 'pointer';

    refreshButton.addEventListener('click', () => {
        location.reload();
    });

    gui.appendChild(refreshButton);

    // ESP Button
    const espButton = document.createElement('button');
    espButton.textContent = 'ESP';
    espButton.style.margin = '5px';
    espButton.style.padding = '5px';
    espButton.style.backgroundColor = 'gray';
    espButton.style.color = 'white';
    espButton.style.border = 'none';
    espButton.style.borderRadius = '5px';
    espButton.style.cursor = 'pointer';

    let espEnabled = false;
    espButton.addEventListener('click', () => {
        espEnabled = !espEnabled;
        const players = document.querySelectorAll('.player'); // Adjust for actual player selector
        players.forEach((player) => {
            if (espEnabled) {
                player.style.outline = '3px solid red';
                player.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
            } else {
                player.style.outline = '';
                player.style.backgroundColor = '';
            }
        });
        alert(`ESP ${espEnabled ? 'activated' : 'deactivated'}`);
    });

    gui.appendChild(espButton);

    document.body.appendChild(gui);
})();
