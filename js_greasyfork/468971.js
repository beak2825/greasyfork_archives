// ==UserScript==
// @name         Modern Time Display (Rounded)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Displays the current time in milliseconds
// @author       NEMES
// @match        *://*/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468971/Modern%20Time%20Display%20%28Rounded%29.user.js
// @updateURL https://update.greasyfork.org/scripts/468971/Modern%20Time%20Display%20%28Rounded%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the time display window
    const timeWindow = document.createElement('div');
    timeWindow.style.position = 'fixed';
    timeWindow.style.right = '0';
    timeWindow.style.top = '50%';
    timeWindow.style.transform = 'translateY(-50%)';
    timeWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    timeWindow.style.color = '#ffffff';
    timeWindow.style.padding = '10px';
    timeWindow.style.fontFamily = 'Arial, sans-serif';
    timeWindow.style.fontSize = '24px';
    timeWindow.style.zIndex = '9999';
    timeWindow.style.pointerEvents = 'auto';
    timeWindow.style.userSelect = 'none';
    timeWindow.style.cursor = 'move';
    timeWindow.style.display = 'none'; // Set display to 'none' initially
    timeWindow.style.borderRadius = '10px'; // Add rounded corners
    document.body.appendChild(timeWindow);

    // Create the return button
    const returnButton = document.createElement('button');
    returnButton.style.position = 'fixed';
    returnButton.style.right = '10px';
    returnButton.style.bottom = '10px';
    returnButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    returnButton.style.color = '#ffffff';
    returnButton.style.padding = '5px';
    returnButton.style.border = 'none';
    returnButton.style.zIndex = '9999';
    returnButton.innerText = 'Show';
    returnButton.style.borderRadius = '10px'; // Add rounded corners
    returnButton.addEventListener('click', () => {
        timeWindow.style.display = 'block';
        hideButton.style.display = 'block';
        returnButton.style.display = 'none';
    });
    document.body.appendChild(returnButton);

    // Create the hide button
    const hideButton = document.createElement('button');
    hideButton.style.position = 'fixed';
    hideButton.style.right = '10px';
    hideButton.style.bottom = '10px';
    hideButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    hideButton.style.color = '#ffffff';
    hideButton.style.padding = '5px';
    hideButton.style.border = 'none';
    hideButton.style.zIndex = '9999';
    hideButton.style.display = 'none'; // Set display to 'none' initially
    hideButton.innerText = 'Hide';
    hideButton.style.borderRadius = '10px'; // Add rounded corners
    hideButton.addEventListener('click', () => {
        timeWindow.style.display = 'none';
        hideButton.style.display = 'none';
        returnButton.style.display = 'block';
    });
    document.body.appendChild(hideButton);

    // Function to handle window movement
    let isDragging = false;
    let offset = { x: 0, y: 0 };

    function handleMouseDown(event) {
        isDragging = true;
        offset.x = event.clientX - timeWindow.offsetLeft;
        offset.y = event.clientY - timeWindow.offsetTop;
    }

    function handleMouseMove(event) {
        if (isDragging) {
            const x = event.clientX - offset.x;
            const y = event.clientY - offset.y;
            timeWindow.style.right = 'auto';
            timeWindow.style.left = `${x}px`;
            timeWindow.style.top = `${y}px`;
        }
    }

    function handleMouseUp() {
        isDragging = false;
    }

    // Attach event listeners for window movement
    timeWindow.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Function to update the time display
    function updateTimeDisplay() {
        const currentTime = new Date();
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const seconds = currentTime.getSeconds().toString().padStart(2, '0');
        const milliseconds = currentTime.getMilliseconds().toString().padStart(3, '0');
        timeWindow.innerText = `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    // Update the time display every millisecond
    setInterval(updateTimeDisplay, 1);

    // Show the return button by default
    returnButton.style.display = 'block';
})();
