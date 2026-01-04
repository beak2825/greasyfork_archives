// ==UserScript==
// @name         Console-in-Pages
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Creates a floating console in browser
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531533/Console-in-Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/531533/Console-in-Pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the shell container
    const shellContainer = document.createElement('div');
    shellContainer.style.position = 'fixed';
    shellContainer.style.bottom = '100px';
    shellContainer.style.left = '20px';
    shellContainer.style.width = '500px';
    shellContainer.style.height = '300px';
    shellContainer.style.backgroundColor = '#000';
    shellContainer.style.color = '#0f0';
    shellContainer.style.fontFamily = 'monospace';
    shellContainer.style.zIndex = '99999';
    shellContainer.style.overflowY = 'auto';
    shellContainer.style.padding = '10px';
    shellContainer.style.display = 'none';  // Initially hidden
    document.body.appendChild(shellContainer);

    // Create the header (for dragging)
    const header = document.createElement('div');
    header.style.backgroundColor = '#333';
    header.style.padding = '5px';
    header.style.cursor = 'move';
    header.innerText = 'Tampermonkey generated Console';
    shellContainer.appendChild(header);

    // Create input field for commands
    const inputField = document.createElement('input');
    inputField.style.width = '100%';
    inputField.style.backgroundColor = '#000';
    inputField.style.color = '#0f0';
    inputField.style.border = 'none';
    inputField.style.outline = 'none';
    inputField.style.fontSize = '16px';
    inputField.placeholder = 'Type your command here...';
    shellContainer.appendChild(inputField);

    // Function to handle user input
    inputField.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = inputField.value.trim();
            if (command) {
                executeCommand(command);
            }
            inputField.value = ''; // Clear input after execution
        }
    });

    // Function to execute commands
    function executeCommand(command) {
        const output = document.createElement('div');
        output.textContent = `$ ${command}`;
        shellContainer.appendChild(output);

        // Handle predefined commands
        if (command === 'hello') {
            showOutput('Hello world!');
        } else if (command === 'date') {
            showOutput(new Date().toLocaleString());
        } else if (command === 'clear') {
            clearShell();
        } else {
            showOutput('Command not recognized');
        }

        // Scroll to bottom
        shellContainer.scrollTop = shellContainer.scrollHeight;
    }

    // Function to display command output
    function showOutput(outputText) {
        const output = document.createElement('div');
        output.textContent = outputText;
        shellContainer.appendChild(output);
    }

    // Function to clear the shell
    function clearShell() {
        shellContainer.innerHTML = '';
        shellContainer.appendChild(header); // Keep the header
        shellContainer.appendChild(inputField); // Keep the input field
    }

    // Create the resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.bottom = '0';
    resizeHandle.style.right = '0';
    resizeHandle.style.width = '20px';
    resizeHandle.style.height = '20px';
    resizeHandle.style.backgroundColor = '#0f0';
    resizeHandle.style.cursor = 'se-resize';
    shellContainer.appendChild(resizeHandle);

    // Drag functionality for the terminal window
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - shellContainer.getBoundingClientRect().left;
        offsetY = e.clientY - shellContainer.getBoundingClientRect().top;
        document.addEventListener('mousemove', dragShell);
        document.addEventListener('mouseup', stopDrag);
    });

    function dragShell(e) {
        if (isDragging) {
            shellContainer.style.left = `${e.clientX - offsetX}px`;
            shellContainer.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', dragShell);
        document.removeEventListener('mouseup', stopDrag);
    }

    // Resize functionality for the terminal window
    let isResizing = false;
    let initialWidth, initialHeight, initialMouseX, initialMouseY;

    resizeHandle.addEventListener('mousedown', function(e) {
        isResizing = true;
        initialWidth = shellContainer.offsetWidth;
        initialHeight = shellContainer.offsetHeight;
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        document.addEventListener('mousemove', resizeShell);
        document.addEventListener('mouseup', stopResize);
    });

    function resizeShell(e) {
        if (isResizing) {
            const width = initialWidth + (e.clientX - initialMouseX);
            const height = initialHeight + (e.clientY - initialMouseY);
            shellContainer.style.width = `${width}px`;
            shellContainer.style.height = `${height}px`;
        }
    }

    function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', resizeShell);
        document.removeEventListener('mouseup', stopResize);
    }

    // Create the toggle icon
    const toggleIcon = document.createElement('div');
    toggleIcon.style.position = 'fixed';
    toggleIcon.style.bottom = '60px';
    toggleIcon.style.left = '10px';
    toggleIcon.style.width = '40px';
    toggleIcon.style.height = '40px';
    toggleIcon.style.backgroundColor = '#0f0';
    toggleIcon.style.color = '#000';
    toggleIcon.style.fontSize = '24px';
    toggleIcon.style.borderRadius = '50%';
    toggleIcon.style.textAlign = 'center';
    toggleIcon.style.lineHeight = '40px';
    toggleIcon.style.cursor = 'pointer';
    toggleIcon.style.zIndex = '100000';
    toggleIcon.innerHTML = '&#x2328;'; // Unicode for a refresh icon (can be replaced with other symbols)
    document.body.appendChild(toggleIcon);

    // Add dragging functionality to the toggle icon
    let iconIsDragging = false;
    let iconOffsetX, iconOffsetY;
    let iconDragStartTime;

    toggleIcon.addEventListener('mousedown', function(e) {
        iconIsDragging = false;
        iconDragStartTime = Date.now(); // Record when the drag starts
        iconOffsetX = e.clientX - toggleIcon.getBoundingClientRect().left;
        iconOffsetY = e.clientY - toggleIcon.getBoundingClientRect().top;
        document.addEventListener('mousemove', dragIcon);
        document.addEventListener('mouseup', stopIconDrag);
    });

    function dragIcon(e) {
        iconIsDragging = true;
        toggleIcon.style.left = `${e.clientX - iconOffsetX}px`;
        toggleIcon.style.top = `${e.clientY - iconOffsetY}px`;
    }

    function stopIconDrag(e) {
        document.removeEventListener('mousemove', dragIcon);
        document.removeEventListener('mouseup', stopIconDrag);

        // If the mouse was held down for less than 300ms and moved less than 5px, consider it a click
        if (iconIsDragging && (Date.now() - iconDragStartTime > 300 || Math.abs(e.clientX - toggleIcon.offsetLeft) > 5 || Math.abs(e.clientY - toggleIcon.offsetTop) > 5)) {
            iconIsDragging = false;  // It was a drag, not a click
        } else {
            // Toggle the terminal visibility only on click
            if (shellContainer.style.display === 'none') {
                shellContainer.style.display = 'block';
            } else {
                shellContainer.style.display = 'none';
            }
        }
    }

})();
