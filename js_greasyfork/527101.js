// ==UserScript==
// @name         Marktplatz Panel Viewer
// @namespace    http://tampermonkey.net/
// @version      1.0.9
// @description  Open the Marktplatz in a popup when the link is clicked and display only the 'wrapper' content properly.
// @author       Asriel
// @copyright    2025, Asriel(https://greasyfork.org/de/users/1375984-asriel-aac)
// @license      MIT
// @match        https://anime.academy/chat*
// @match        https://anime.academy/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527101/Marktplatz%20Panel%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/527101/Marktplatz%20Panel%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createMarktplatzPanel() {
        // Create Marktplatz Panel box
        const panelBox = document.createElement('div');
        panelBox.id = 'marktplatzPanel';
        panelBox.style.position = 'fixed';
        panelBox.style.width = '600px';
        panelBox.style.height = '700px';
        panelBox.style.backgroundColor = '#1e1e1e';
        panelBox.style.color = '#f0f0f0';
        panelBox.style.border = '1px solid #333';
        panelBox.style.borderRadius = '5px';
        panelBox.style.zIndex = '10000';
        panelBox.style.overflow = 'auto';
        panelBox.style.resize = 'both';
        panelBox.style.cursor = 'default';
        panelBox.style.userSelect = 'text';

        // Center the popup on the screen
        panelBox.style.left = '50%';
        panelBox.style.top = '50%';
        panelBox.style.transform = 'translate(-50%, -50%)';

        // Create a title bar for the panel box
        const titleBar = document.createElement('div');
        titleBar.style.cursor = 'move';
        titleBar.style.padding = '5px';
        titleBar.style.backgroundColor = '#333';
        titleBar.style.color = '#f0f0f0';
        titleBar.style.fontWeight = 'bold';
        titleBar.innerHTML = 'Marktplatz Panel (Drag Title Bar to Move)';
        titleBar.style.display = 'flex';
        titleBar.style.justifyContent = 'space-between';
        titleBar.style.alignItems = 'center';

        // Create a close button
        const closeButton = document.createElement('button');
        closeButton.innerText = '×';
        closeButton.style.background = '#ff4d4d';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '16px';
        closeButton.style.width = '25px';
        closeButton.style.height = '25px';
        closeButton.style.borderRadius = '50%';
        closeButton.style.cursor = 'pointer';
        closeButton.style.textAlign = 'center';
        closeButton.style.lineHeight = '25px';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.marginRight = '5px';
        closeButton.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent drag triggering when clicking close
            panelBox.remove();
        });

        // Append close button and title bar
        titleBar.appendChild(closeButton);
        panelBox.appendChild(titleBar);

        // Create a container to load Marktplatz content
        const contentContainer = document.createElement('div');
        contentContainer.style.width = '100%';
        contentContainer.style.height = 'calc(100% - 30px)'; // Adjusting height for the title bar
        contentContainer.style.overflow = 'auto';
        contentContainer.style.background = '#282828';
        contentContainer.style.padding = '5px';
        panelBox.appendChild(contentContainer);

        // Load the Marktplatz page inside an iframe to ensure full functionality
        const iframe = document.createElement('iframe');
        iframe.src = 'https://anime.academy/marktplatz';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.background = '#1e1e1e';
        contentContainer.appendChild(iframe);

        // Append the panel box to the document body
        document.body.appendChild(panelBox);

        // Drag functionality for the title bar only
        let isDragging = false;
        let offsetX, offsetY;

        titleBar.addEventListener('mousedown', function (e) {
            isDragging = true;
            offsetX = e.clientX - panelBox.getBoundingClientRect().left;
            offsetY = e.clientY - panelBox.getBoundingClientRect().top;
        });

        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                panelBox.style.left = `${e.clientX - offsetX}px`;
                panelBox.style.top = `${e.clientY - offsetY}px`;
                panelBox.style.transform = 'none';
            }
        });

        document.addEventListener('mouseup', function () {
            isDragging = false;
        });
    }

    // Detect click on the Marktplatz link and open panel instead
    document.addEventListener('click', function (event) {
        const target = event.target.closest('a[href="/marktplatz"]');
        if (target) {
            event.preventDefault(); // Prevent default opening in new tab
            if (!document.getElementById('marktplatzPanel')) {
                createMarktplatzPanel();
            }
        }
    });
})();
