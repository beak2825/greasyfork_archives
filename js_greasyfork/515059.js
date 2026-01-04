// ==UserScript==
// @name         Global Notepad
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a global notepad feature with Markdown support and settings GUI
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515059/Global%20Notepad.user.js
// @updateURL https://update.greasyfork.org/scripts/515059/Global%20Notepad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button to toggle the notepad
    const button = document.createElement('button');
    button.textContent = '📝'; // Notepad icon
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '1000';
    button.style.fontSize = '24px';
    button.style.border = 'none';
    button.style.backgroundColor = '#007BFF';
    button.style.color = '#fff';
    button.style.borderRadius = '50%';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    // Create the notepad container
    const notepad = document.createElement('div');
    notepad.style.position = 'fixed';
    notepad.style.bottom = '80px';
    notepad.style.right = '20px';
    notepad.style.width = '300px';
    notepad.style.height = '300px';
    notepad.style.border = '1px solid #000';
    notepad.style.backgroundColor = '#fff';
    notepad.style.padding = '10px';
    notepad.style.zIndex = '1000';
    notepad.style.display = 'none';
    notepad.style.overflow = 'auto';
    notepad.style.fontFamily = 'Arial';
    notepad.style.fontSize = '12pt';
    document.body.appendChild(notepad);

    // Create a textarea for the notes
    const textarea = document.createElement('textarea');
    textarea.style.width = '100%';
    textarea.style.height = '90%';
    notepad.appendChild(textarea);

    // Create settings button
    const settingsButton = document.createElement('button');
    settingsButton.textContent = '⚙️'; // Settings icon
    settingsButton.style.position = 'absolute';
    settingsButton.style.bottom = '10px';
    settingsButton.style.right = '10px'; // Position it near the textarea
    settingsButton.style.zIndex = '1001';
    settingsButton.style.border = 'none';
    settingsButton.style.backgroundColor = '#ccc';
    settingsButton.style.cursor = 'pointer';
    settingsButton.style.display = 'none'; // Initially hidden
    notepad.appendChild(settingsButton);

    // Create settings GUI
    const settingsMenu = document.createElement('div');
    settingsMenu.style.display = 'none';
    settingsMenu.style.border = '1px solid #ccc';
    settingsMenu.style.backgroundColor = '#f9f9f9';
    settingsMenu.style.padding = '10px';
    settingsMenu.style.position = 'absolute';
    settingsMenu.style.bottom = '60px'; // Position it above the button
    settingsMenu.style.right = '5px';
    notepad.appendChild(settingsMenu);

    const fontSizeInput = document.createElement('input');
    fontSizeInput.type = 'number';
    fontSizeInput.value = 12;
    fontSizeInput.style.marginBottom = '10px';
    fontSizeInput.placeholder = 'Font Size (pt)';
    settingsMenu.appendChild(fontSizeInput);

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply';
    settingsMenu.appendChild(applyButton);

    // Create save button
    const saveButton = document.createElement('button');
    saveButton.textContent = '💾'; // Save icon
    saveButton.style.position = 'fixed';
    saveButton.style.bottom = '75px'; // Position it under the notepad icon
    saveButton.style.right = '20px'; // Align it with the notepad icon
    saveButton.style.zIndex = '1001';
    saveButton.style.border = 'none';
    saveButton.style.backgroundColor = '#90EE90'; // Light green
    saveButton.style.color = '#fff';
    saveButton.style.borderRadius = '50%';
    saveButton.style.width = '50px';
    saveButton.style.height = '50px';
    saveButton.style.cursor = 'pointer';
    saveButton.style.transform = 'translateY(100%)'; // Start hidden with glide effect
    saveButton.style.transition = 'transform 0.3s ease'; // Glide animation
    saveButton.style.display = 'none'; // Initially hidden
    document.body.appendChild(saveButton);

    // Load saved notes
    const savedNotes = GM_getValue('globalNotepadNotes', '');
    textarea.value = savedNotes;

    // Save notes on change
    textarea.addEventListener('input', () => {
        GM_setValue('globalNotepadNotes', textarea.value);
    });

    // Toggle notepad visibility
    button.addEventListener('click', () => {
        notepad.style.display = notepad.style.display === 'none' ? 'block' : 'none';
    });

    // Collapse notepad when clicking outside
    document.addEventListener('click', (event) => {
        if (notepad.style.display === 'block' && !notepad.contains(event.target) && event.target !== button && event.target !== settingsButton && event.target !== saveButton) {
            notepad.style.display = 'none';
        }
    });

    // Show settings button on hover over notepad icon
    button.addEventListener('mouseover', () => {
        settingsButton.style.display = 'block';
        saveButton.style.display = 'block'; // Show save button
        saveButton.style.transform = 'translateY(0)'; // Glide into view
    });

    // Track mouse movements to keep buttons visible
    let mouseInSettingsArea = false;
    settingsButton.addEventListener('mouseenter', () => {
        mouseInSettingsArea = true;
    });

    settingsButton.addEventListener('mouseleave', () => {
        mouseInSettingsArea = false;
        setTimeout(() => {
            if (!mouseInSettingsArea) {
                settingsButton.style.display = 'none';
            }
        }, 300); // Delay before hiding
    });

    button.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!mouseInSettingsArea) {
                settingsButton.style.display = 'none';
                saveButton.style.transform = 'translateY(100%)'; // Glide out of view
                saveButton.style.display = 'none'; // Hide save button
            }
        }, 500); // Increased delay before hiding
    });

    // Show settings menu on settings button click
    settingsButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent closing the notepad
        settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
    });

    // Apply font size change
    applyButton.addEventListener('click', () => {
        const fontSize = fontSizeInput.value;
        notepad.style.fontSize = fontSize + 'pt';
        textarea.style.fontSize = fontSize + 'pt';
        settingsMenu.style.display = 'none'; // Hide settings menu after applying
    });

    // Save to hard drive function
    saveButton.addEventListener('click', () => {
        const blob = new Blob([textarea.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notepad_notes.txt'; // Default file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Animation effect
        saveButton.style.transform = 'scale(1.1)';
        setTimeout(() => {
            saveButton.style.transform = 'scale(1)';
        }, 200); // Reset scale after animation
    });

})();
