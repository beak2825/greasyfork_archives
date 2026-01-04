// ==UserScript==
// @name         CracksHash Magnet Getter with Popup Blocker
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Adds a floating button that gets the magnet link when pressed and blocks pop-up windows
// @author       ThatDudeJBob
// @match        *://crackshash.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496885/CracksHash%20Magnet%20Getter%20with%20Popup%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/496885/CracksHash%20Magnet%20Getter%20with%20Popup%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const buttonConfig = {
        text: localStorage.getItem('buttonText') || 'Click Magnet',
        backgroundColor: localStorage.getItem('buttonBgColor') || '#007bff',
        textColor: 'white',
        initialTop: localStorage.getItem('buttonTop') || '10px',
        initialRight: localStorage.getItem('buttonRight') || '10px'
    };

    // Helper function to create and style elements
    function createElement(type, styles, textContent = '') {
        const element = document.createElement(type);
        Object.assign(element.style, styles);
        element.textContent = textContent;
        return element;
    }

    // Function to show overlay warning
    function showOverlayWarning(message, type) {
        const overlay = createElement('div', {
            position: 'fixed',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: type === 'error' ? 'rgba(245, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            zIndex: '1000',
            transition: 'opacity 1s',
            opacity: '1'
        }, message);
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => document.body.removeChild(overlay), 1000);
        }, 2000);
    }

    // Function to toggle settings menu visibility
    function toggleSettingsMenu() {
        settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
    }

    // Save settings
    function saveSettings() {
        localStorage.setItem('buttonText', buttonTextInput.value);
        localStorage.setItem('buttonBgColor', buttonBgColorInput.value);
        localStorage.setItem('buttonTop', buttonTopInput.value + 'px');
        localStorage.setItem('buttonRight', buttonRightInput.value + 'px');
        button.innerText = buttonTextInput.value;
        button.style.backgroundColor = buttonBgColorInput.value;
        button.style.top = buttonTopInput.value + 'px';
        button.style.right = buttonRightInput.value + 'px';
        settingsMenu.style.display = 'none';
    }

    // Block pop-up windows, except for settings menu interactions
    function preventPopup(e) {
        if (e.target.tagName === 'A' && (e.target.href.startsWith('magnet:') || new URL(e.target.href).hostname === window.location.hostname)) {
            return;
        }

        if (settingsMenu.contains(e.target) || e.target === settingsButton) {
            return;
        }

        e.preventDefault();
    }

    // Create the floating button
    const button = createElement('button', {
        position: 'fixed',
        top: buttonConfig.initialTop,
        right: buttonConfig.initialRight,
        zIndex: '1000',
        backgroundColor: buttonConfig.backgroundColor,
        color: buttonConfig.textColor,
        border: 'none',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
        width: 'auto',
        whiteSpace: 'nowrap'
    }, buttonConfig.text);
    document.body.appendChild(button);

    // Create the settings button
    const settingsButton = createElement('button', {
        position: 'fixed',
        top: '10px',
        right: '50px', // Adjusted to avoid overlap
        zIndex: '1000',
        backgroundColor: '#555',
        color: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
        width: 'auto',
        whiteSpace: 'nowrap'
    }, '?');
    document.body.appendChild(settingsButton);

    // Create the settings menu
    const settingsMenu = createElement('div', {
        position: 'fixed',
        top: '40px',
        right: '10px',
        zIndex: '1000',
        backgroundColor: '#333',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        display: 'none'
    });
    document.body.appendChild(settingsMenu);

    const buttonTextInput = createElement('input', { display: 'block', marginBottom: '10px' });
    buttonTextInput.type = 'text';
    buttonTextInput.placeholder = 'Button Text';
    buttonTextInput.value = buttonConfig.text;
    settingsMenu.appendChild(buttonTextInput);

    const buttonBgColorInput = createElement('input', { display: 'block', marginBottom: '10px' });
    buttonBgColorInput.type = 'color';
    buttonBgColorInput.value = buttonConfig.backgroundColor;
    settingsMenu.appendChild(buttonBgColorInput);

    const buttonTopInput = createElement('input', { display: 'block', marginBottom: '10px' });
    buttonTopInput.type = 'number';
    buttonTopInput.placeholder = 'Top Position (px)';
    buttonTopInput.value = parseInt(buttonConfig.initialTop, 10);
    settingsMenu.appendChild(buttonTopInput);

    const buttonRightInput = createElement('input', { display: 'block', marginBottom: '10px' });
    buttonRightInput.type = 'number';
    buttonRightInput.placeholder = 'Right Position (px)';
    buttonRightInput.value = parseInt(buttonConfig.initialRight, 10);
    settingsMenu.appendChild(buttonRightInput);

    const saveButton = createElement('button', {
        marginTop: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '5px',
        borderRadius: '5px',
        cursor: 'pointer'
    }, 'Save');
    settingsMenu.appendChild(saveButton);

    settingsButton.addEventListener('click', toggleSettingsMenu);
    saveButton.addEventListener('click', saveSettings);

    document.addEventListener('click', (event) => {
        if (!settingsMenu.contains(event.target) && event.target !== settingsButton) {
            settingsMenu.style.display = 'none';
        }
    });

    // Add click event to the button
    button.addEventListener('click', () => {
        const magnetLink = document.querySelector('a[href^="magnet:"]');
        if (magnetLink) {
            const originalBeforeUnload = window.onbeforeunload; // Backup the original onbeforeunload handler
            window.onbeforeunload = null; // Allow navigation for this action
            magnetLink.click();
            window.onbeforeunload = originalBeforeUnload; // Restore the original handler
        } else {
            showOverlayWarning('No magnet link found on this page.', 'error');
        }
    });

    // Override window.open to detect blocked pop-ups
    const originalWindowOpen = window.open;
    window.open = function(url, name, specs) {
        const newWindow = originalWindowOpen(url, name, specs);
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            showOverlayWarning('Blocked a pop-up window.', 'error');
        }
        return newWindow;
    };

    window.addEventListener('beforeunload', preventPopup);
    window.addEventListener('unload', preventPopup);
    document.addEventListener('click', preventPopup);
})();