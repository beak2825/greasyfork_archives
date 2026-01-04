// ==UserScript==
// @name         Roblox Join Game by Job ID (Draggable + Error Handling)
// @namespace    https://roblox.com/
// @version      1.2
// @description  Join a Roblox server via Job ID with fallback, error messages, and draggable UI 💪🎮✨
// @author       Abirvoid
// @match        https://www.roblox.com/games/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/545039/Roblox%20Join%20Game%20by%20Job%20ID%20%28Draggable%20%2B%20Error%20Handling%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545039/Roblox%20Join%20Game%20by%20Job%20ID%20%28Draggable%20%2B%20Error%20Handling%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {
        // Create draggable container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.left = '20px';
        container.style.zIndex = '9999';
        container.style.background = 'white';
        container.style.padding = '10px';
        container.style.border = '2px solid #000';
        container.style.borderRadius = '10px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.cursor = 'move'; // Drag cursor

        const label = document.createElement('label');
        label.innerText = 'Join by Job ID: ';
        label.style.marginRight = '5px';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter Job ID';
        input.style.padding = '5px';
        input.style.width = '300px';

        const button = document.createElement('button');
        button.innerText = 'Join';
        button.style.marginLeft = '5px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';

        const message = document.createElement('div');
        message.style.marginTop = '8px';
        message.style.color = 'red';
        message.style.fontWeight = 'bold';

        // Build DOM
        container.appendChild(label);
        container.appendChild(input);
        container.appendChild(button);
        container.appendChild(message);
        document.body.appendChild(container);

        // Place ID from URL
        const match = window.location.href.match(/\/games\/(\d+)/);
        if (!match) return;
        const placeId = parseInt(match[1], 10);

        // Button handler
        button.onclick = () => {
            const jobId = input.value.trim();
            message.innerText = '';

            if (!jobId) {
                message.innerText = 'Please enter a Job ID.';
                return;
            }

            input.disabled = true;
            button.disabled = true;

            // Try Roblox.GameLauncher
            try {
                if (typeof Roblox !== 'undefined' &&
                    Roblox.GameLauncher &&
                    typeof Roblox.GameLauncher.joinGameInstance === 'function') {

                    Roblox.GameLauncher.joinGameInstance(placeId, jobId);
                    message.innerText = '🔄 Attempting to join via GameLauncher...';

                    setTimeout(() => {
                        message.innerText = "⚠️ Try another JobID if you see that Job ID is invalid or restricted.";
                        input.disabled = false;
                        button.disabled = false;
                    }, 3000);
                    return;
                }
            } catch (err) {
                console.warn('GameLauncher error:', err);
            }

            // Fallback: roblox:// protocol
            try {
                const url = `roblox://join?placeId=${placeId}&gameInstanceId=${jobId}`;
                window.location.href = url;
                message.innerText = '🔄 Attempting to launch Roblox client...';

                setTimeout(() => {
                    message.innerText = "⚠️ Try another JobID if you see that Job ID is invalid or restricted.";
                    input.disabled = false;
                    button.disabled = false;
                }, 3000);
            } catch (err) {
                console.error('roblox:// error:', err);
                message.innerText = '❌ Failed to launch Roblox client.';
                input.disabled = false;
                button.disabled = false;
            }
        };

        // Make container draggable
        let isDragging = false;
        let offsetX, offsetY;

        container.addEventListener('mousedown', (e) => {
            // Only allow dragging from the top area (not when typing in the box)
            if (e.target === input || e.target === button) return;
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
            container.style.opacity = '0.85';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                container.style.left = (e.clientX - offsetX) + 'px';
                container.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.opacity = '1';
        });
    });
})();
