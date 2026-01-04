// ==UserScript==
// @name         Clock Overlay (12-hour format, draggable & resizable)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add a draggable and resizable clock with date (MM/DD/YYYY) above the time, with larger text and no size limits
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514470/Clock%20Overlay%20%2812-hour%20format%2C%20draggable%20%20resizable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/514470/Clock%20Overlay%20%2812-hour%20format%2C%20draggable%20%20resizable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the main clock container div with a smaller initial size
    const clockDiv = document.createElement("div");
    clockDiv.style = `
        position:fixed;
        top:10px;
        right:10px;
        width: 150px; /* Small initial width */
        height: 80px;  /* Small initial height */
        background:black;
        color:white;
        font-family:Arial, sans-serif;
        border-radius:10px;
        z-index:10000;
        cursor:move;
        user-select:none;
        text-align: center;
        overflow: hidden; /* Prevent text overflow */
        padding: 5px; /* Adjust padding */
    `;
    document.body.appendChild(clockDiv);

    // Create the div for the date
    const dateDiv = document.createElement("div");
    dateDiv.style = `
        font-size: 1.4em; /* Larger initial font size */
        margin-bottom: 2px;
    `;
    clockDiv.appendChild(dateDiv);

    // Create the div for the time
    const timeDiv = document.createElement("div");
    timeDiv.style = `
        font-size: 1.6em; /* Larger initial font size */
    `;
    clockDiv.appendChild(timeDiv);

    // Create resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.style = `
        width:10px;
        height:10px;
        background:white;
        position:absolute;
        right:0;
        bottom:0;
        cursor:nwse-resize;
    `;
    clockDiv.appendChild(resizeHandle);

    // Function to update the clock and date
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        // Convert to 12-hour format
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // The hour '0' should be '12'

        // Get the date in MM/DD/YYYY format
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
        const day = now.getDate().toString().padStart(2, '0');
        const year = now.getFullYear();
        const dateStr = `${month}/${day}/${year}`;

        // Combine time
        const timeStr = `${hours}:${minutes}:${seconds} ${ampm}`;

        // Update the content of the date and time divs
        dateDiv.textContent = dateStr;
        timeDiv.textContent = timeStr;

        // Update font size based on clock dimensions
        updateFontSize();
    }

    // Function to update the font size
    function updateFontSize() {
        const width = clockDiv.offsetWidth;
        const height = clockDiv.offsetHeight;

        // Adjust scaling for both width and height
        const fontSize = Math.min(Math.max(Math.min(width / 5, height / 5), 14), 50); // Minimum 14px, Maximum 50px
        dateDiv.style.fontSize = `${fontSize}px`;
        timeDiv.style.fontSize = `${fontSize}px`;
    }

    // Update the clock every second
    setInterval(updateClock, 1000);

    // Initial clock update
    updateClock();

    // Draggable functionality
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    function disableTextSelection() {
        document.body.style.userSelect = 'none'; // Disable text selection globally
    }

    function enableTextSelection() {
        document.body.style.userSelect = ''; // Restore the default behavior
    }

    clockDiv.addEventListener('mousedown', function(e) {
        if (e.target !== resizeHandle) {
            isDragging = true;
            offsetX = e.clientX - clockDiv.getBoundingClientRect().left;
            offsetY = e.clientY - clockDiv.getBoundingClientRect().top;
            clockDiv.style.cursor = 'grabbing';
            disableTextSelection(); // Disable text selection when dragging
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            clockDiv.style.left = `${e.clientX - offsetX}px`;
            clockDiv.style.top = `${e.clientY - offsetY}px`;
            clockDiv.style.right = 'auto'; // Reset right so it can freely move left
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        clockDiv.style.cursor = 'move';
        enableTextSelection(); // Re-enable text selection after dragging
    });

    // Resizing functionality without any limits
    let isResizing = false;
    let initialWidth, initialHeight, initialMouseX, initialMouseY;

    resizeHandle.addEventListener('mousedown', function(e) {
        isResizing = true;
        initialWidth = clockDiv.offsetWidth;
        initialHeight = clockDiv.offsetHeight;
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        e.preventDefault(); // Prevent default behavior like text selection
    });

    document.addEventListener('mousemove', function(e) {
        if (isResizing) {
            const widthDiff = e.clientX - initialMouseX;
            const heightDiff = e.clientY - initialMouseY;
            let newWidth = initialWidth + widthDiff;
            let newHeight = initialHeight + heightDiff;

            // Remove any minimum size constraints for resizing
            clockDiv.style.width = `${newWidth}px`;
            clockDiv.style.height = `${newHeight}px`;

            updateFontSize(); // Update font size on resize
        }
    });

    document.addEventListener('mouseup', function() {
        isResizing = false;
    });

})();