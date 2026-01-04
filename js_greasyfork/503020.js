// ==UserScript==
// @name         Game Panel addon for Bodega Bot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a floating button to toggle open a draggable and resizable window to host multiple embeddable online games.
// @author       Bort
// @match        https://tinychat.com/room/*
// @match        https://tinychat.com/settings/profile
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503020/Game%20Panel%20addon%20for%20Bodega%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/503020/Game%20Panel%20addon%20for%20Bodega%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the floating button
    const button = document.createElement('button');
    button.innerHTML = 'Open Games';
    button.style.position = 'fixed';
    button.style.left = '10px';
    button.style.top = '50%';
    button.style.transform = 'translateY(-50%)';
    button.style.zIndex = '1000';
    document.body.appendChild(button);

    // Create the container for the game window
    const gameWindowContainer = document.createElement('div');
    gameWindowContainer.style.position = 'fixed';
    gameWindowContainer.style.left = '20px';
    gameWindowContainer.style.top = '20px';
    gameWindowContainer.style.width = '500px';
    gameWindowContainer.style.height = '400px';
    gameWindowContainer.style.backgroundColor = 'white';
    gameWindowContainer.style.border = '1px solid black';
    gameWindowContainer.style.display = 'none';
    gameWindowContainer.style.resize = 'both';
    gameWindowContainer.style.overflow = 'auto';
    gameWindowContainer.style.zIndex = '999';
    document.body.appendChild(gameWindowContainer);

    // Title bar for dragging
    const titleBar = document.createElement('div');
    titleBar.style.width = '100%';
    titleBar.style.height = '30px';
    titleBar.style.backgroundColor = '#333';
    titleBar.style.color = 'white';
    titleBar.style.cursor = 'move';
    titleBar.style.display = 'flex';
    titleBar.style.alignItems = 'center';
    titleBar.style.padding = '0 10px';
    titleBar.innerText = 'Games';
    gameWindowContainer.appendChild(titleBar);

    // Content area for embedding games
    const contentArea = document.createElement('div');
    contentArea.style.width = '100%';
    contentArea.style.height = 'calc(100% - 30px)';
    contentArea.style.overflow = 'auto';
    gameWindowContainer.appendChild(contentArea);

    // Input field for game URL
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Enter game URL';
    urlInput.style.width = '80%';
    urlInput.style.margin = '10px';
    const loadButton = document.createElement('button');
    loadButton.innerText = 'Load Game';
    loadButton.style.margin = '10px';
    titleBar.appendChild(urlInput);
    titleBar.appendChild(loadButton);

    // Function to load game
    loadButton.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.src = urlInput.value;
        contentArea.innerHTML = ''; // Clear previous game
        contentArea.appendChild(iframe);
    });

    // Function to toggle the game window
    button.addEventListener('click', () => {
        gameWindowContainer.style.display = gameWindowContainer.style.display === 'none' ? 'block' : 'none';
    });

    // Dragging functionality
    let isDragging = false;
    let offsetX, offsetY;

    titleBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - gameWindowContainer.offsetLeft;
        offsetY = e.clientY - gameWindowContainer.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
    });

    function onMouseMove(e) {
        if (isDragging) {
            gameWindowContainer.style.left = `${e.clientX - offsetX}px`;
            gameWindowContainer.style.top = `${e.clientY - offsetY}px`;
        }
    }

})();