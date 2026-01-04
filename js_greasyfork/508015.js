// ==UserScript==
// @name         Agar.io Neon Fake Ban GUI
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Neon-themed fake ban GUI with tech UI for Agar.io
// @author       You
// @match        *://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/508015/Agario%20Neon%20Fake%20Ban%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/508015/Agario%20Neon%20Fake%20Ban%20GUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the GUI elements
    const createBanGUI = () => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.backgroundColor = '#222';
        container.style.color = '#00ff00';
        container.style.padding = '20px';
        container.style.borderRadius = '12px';
        container.style.zIndex = '1000';
        container.style.cursor = 'move';
        container.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.5)';
        container.style.transition = 'all 0.3s ease';

        const title = document.createElement('h3');
        title.textContent = 'Fake Ban GUI';
        title.style.textShadow = '0 0 10px rgba(0, 255, 0, 0.7)';
        container.appendChild(title);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter ban time (mm:ss)';
        input.style.marginRight = '10px';
        input.style.padding = '10px';
        input.style.border = '2px solid #00ff00';
        input.style.backgroundColor = '#111';
        input.style.color = '#00ff00';
        input.style.borderRadius = '8px';
        input.style.transition = 'all 0.3s ease';
        input.onfocus = () => input.style.borderColor = '#00ff77';
        input.onblur = () => input.style.borderColor = '#00ff00';
        container.appendChild(input);

        const button = document.createElement('button');
        button.textContent = 'Ban';
        button.style.padding = '10px 20px';
        button.style.border = 'none';
        button.style.backgroundColor = '#00ff00';
        button.style.color = '#111';
        button.style.fontSize = '16px';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
        button.style.transition = 'all 0.3s ease';
        button.onmouseover = () => button.style.backgroundColor = '#00ff77';
        button.onmouseout = () => button.style.backgroundColor = '#00ff00';
        button.onclick = () => {
            const [minutes, seconds] = input.value.split(':').map(num => parseInt(num, 10));
            if (isNaN(minutes) || isNaN(seconds)) {
                alert('Invalid time format. Use mm:ss.');
                return;
            }
            const banTime = (minutes * 60 + seconds) * 1000; // Convert to milliseconds

            // Store the ban end time in localStorage
            localStorage.setItem('banEndTime', Date.now() + banTime);
            localStorage.setItem('isBanned', 'true');

            showBanPopup(banTime);
        };
        container.appendChild(button);

        document.body.appendChild(container);

        // Make the GUI draggable
        let isDragging = false;
        let offsetX, offsetY;

        container.onmousedown = (e) => {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
        };

        document.onmousemove = (e) => {
            if (isDragging) {
                container.style.left = (e.clientX - offsetX) + 'px';
                container.style.top = (e.clientY - offsetY) + 'px';
            }
        };

        document.onmouseup = () => {
            isDragging = false;
        };
    };

    const showBanPopup = (banTime) => {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#222';
        popup.style.color = '#00ff00';
        popup.style.padding = '30px';
        popup.style.borderRadius = '12px';
        popup.style.zIndex = '1000';
        popup.style.textAlign = 'center';
        popup.style.fontSize = '20px';
        popup.style.fontWeight = 'bold';
        popup.style.boxShadow = '0 0 25px rgba(0, 255, 0, 0.7)';
        popup.style.transition = 'opacity 0.5s ease';
        popup.style.opacity = '0';
        popup.style.animation = 'popup-fade 0.5s forwards';

        const message = document.createElement('div');
        message.textContent = `You are banned for ${Math.floor(banTime / 60000)} minutes and ${Math.floor((banTime % 60000) / 1000)} seconds.`;
        popup.appendChild(message);

        document.body.appendChild(popup);

        // Disable game interaction
        document.body.style.pointerEvents = 'none';
    };

    const checkBanStatus = () => {
        const isBanned = localStorage.getItem('isBanned') === 'true';
        const banEndTime = parseInt(localStorage.getItem('banEndTime'), 10);

        if (isBanned && Date.now() < banEndTime) {
            showBanPopup(banEndTime - Date.now());
        } else if (isBanned && Date.now() >= banEndTime) {
            localStorage.removeItem('isBanned');
            localStorage.removeItem('banEndTime');
            document.body.style.pointerEvents = 'auto'; // Re-enable interaction
        }
    };

    // Add keyframes for popup animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes popup-fade {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Initialize the GUI and check ban status
    createBanGUI();
    checkBanStatus();
})();
