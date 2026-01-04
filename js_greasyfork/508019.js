// ==UserScript==
// @name         Slither.io Fake Ban Simulation
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Simulate a server-side fake ban in Slither.io
// @author       You
// @match        *://slither.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/508019/Slitherio%20Fake%20Ban%20Simulation.user.js
// @updateURL https://update.greasyfork.org/scripts/508019/Slitherio%20Fake%20Ban%20Simulation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the GUI elements
    const createBanGUI = () => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.backgroundColor = '#111';
        container.style.color = '#0ff';
        container.style.padding = '20px';
        container.style.borderRadius = '12px';
        container.style.zIndex = '1000';
        container.style.cursor = 'move';
        container.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.5)';
        container.style.transition = 'all 0.3s ease';

        const title = document.createElement('h3');
        title.textContent = 'Fake Ban GUI';
        title.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.7)';
        container.appendChild(title);

        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.placeholder = 'Enter username';
        usernameInput.style.marginBottom = '10px';
        usernameInput.style.padding = '10px';
        usernameInput.style.border = '2px solid #0ff';
        usernameInput.style.backgroundColor = '#222';
        usernameInput.style.color = '#0ff';
        usernameInput.style.borderRadius = '8px';
        usernameInput.style.transition = 'all 0.3s ease';
        usernameInput.onfocus = () => usernameInput.style.borderColor = '#0ff';
        usernameInput.onblur = () => usernameInput.style.borderColor = '#0ff';
        container.appendChild(usernameInput);

        const timeInput = document.createElement('input');
        timeInput.type = 'text';
        timeInput.placeholder = 'Enter ban time (mm:ss)';
        timeInput.style.marginBottom = '10px';
        timeInput.style.padding = '10px';
        timeInput.style.border = '2px solid #0ff';
        timeInput.style.backgroundColor = '#222';
        timeInput.style.color = '#0ff';
        timeInput.style.borderRadius = '8px';
        timeInput.style.transition = 'all 0.3s ease';
        timeInput.onfocus = () => timeInput.style.borderColor = '#0ff';
        timeInput.onblur = () => timeInput.style.borderColor = '#0ff';
        container.appendChild(timeInput);

        const button = document.createElement('button');
        button.textContent = 'Ban';
        button.style.padding = '10px 20px';
        button.style.border = 'none';
        button.style.backgroundColor = '#0ff';
        button.style.color = '#111';
        button.style.fontSize = '16px';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
        button.style.transition = 'all 0.3s ease';
        button.onmouseover = () => button.style.backgroundColor = '#0cc';
        button.onmouseout = () => button.style.backgroundColor = '#0ff';
        button.onclick = () => {
            const username = usernameInput.value.trim();
            const [minutes, seconds] = timeInput.value.split(':').map(num => parseInt(num, 10));
            if (!username || isNaN(minutes) || isNaN(seconds)) {
                alert('Please enter a valid username and time in mm:ss format.');
                return;
            }
            const banTime = (minutes * 60 + seconds) * 1000; // Convert to milliseconds

            // Send ban request to the proxy server
            fetch('http://your-proxy-server/ban', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, banTime })
            })
            .then(response => response.json())
            .then(data => {
                showBanPopup(username, banTime);
            })
            .catch(error => {
                console.error('Error:', error);
            });
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

    const showBanPopup = (username, banTime) => {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#111';
        popup.style.color = '#0ff';
        popup.style.padding = '30px';
        popup.style.borderRadius = '12px';
        popup.style.zIndex = '1000';
        popup.style.textAlign = 'center';
        popup.style.fontSize = '20px';
        popup.style.fontWeight = 'bold';
        popup.style.boxShadow = '0 0 25px rgba(0, 255, 255, 0.7)';
        popup.style.transition = 'opacity 0.5s ease';
        popup.style.opacity = '0';
        popup.style.animation = 'popup-fade 0.5s forwards';

        const message = document.createElement('div');
        message.textContent = `${username}, you are banned for ${Math.floor(banTime / 60000)} minutes and ${Math.floor((banTime % 60000) / 1000)} seconds.`;
        popup.appendChild(message);

        document.body.appendChild(popup);

        // Disable game interaction
        document.body.style.pointerEvents = 'none';
    };

    const checkBanStatus = () => {
        fetch('http://your-proxy-server/status', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            if (data.isBanned && Date.now() < data.banEndTime) {
                showBanPopup(data.username, data.banEndTime - Date.now());
            } else if (data.isBanned && Date.now() >= data.banEndTime) {
                document.body.style.pointerEvents = 'auto'; // Re-enable interaction
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
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
