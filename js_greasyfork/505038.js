// ==UserScript==
// @name         InstaText.io - InstaText Dark Mode with Toggle and Auto Mode
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds a dark mode to InstaText.io editor with a toggle switch and ensures the logo text is visible
// @author       bingusbongus
// @match        https://instatext.io/editor/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505038/InstaTextio%20-%20InstaText%20Dark%20Mode%20with%20Toggle%20and%20Auto%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/505038/InstaTextio%20-%20InstaText%20Dark%20Mode%20with%20Toggle%20and%20Auto%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the dark mode toggle button
    const darkModeToggle = document.createElement('div');
    darkModeToggle.innerHTML = '🌙 Dark Mode';
    darkModeToggle.style.position = 'fixed';
    darkModeToggle.style.top = '60px'; // Adjusted to avoid overlapping with other buttons
    darkModeToggle.style.right = '10px';
    darkModeToggle.style.padding = '10px';
    darkModeToggle.style.backgroundColor = '#333';
    darkModeToggle.style.color = '#fff';
    darkModeToggle.style.borderRadius = '5px';
    darkModeToggle.style.cursor = 'pointer';
    darkModeToggle.style.zIndex = '1000';
    darkModeToggle.style.fontFamily = 'Arial, sans-serif';
    darkModeToggle.style.fontSize = '14px';
    document.body.appendChild(darkModeToggle);

    // Variables to track dark mode state and original SVG fills
    let darkModeEnabled = false;

    // Function to apply dark mode styles
    function enableDarkMode() {
        // Create and append a <style> tag for dark mode CSS
        const darkModeStyle = document.createElement('style');
        darkModeStyle.id = 'custom-dark-mode-styles';
        darkModeStyle.textContent = `
            body, .it-editor, .it-web-editor-field, .it-web-editor-main, .it-web-header, .it-web-sidebar-right-toggle-container {
                background-color: #121212 !important;
                color: #e0e0e0 !important;
            }

            .it-web-editor-field {
                background-color: #1e1e1e !important;
                border-color: #333333 !important;
            }

            .it-web-editor-field .it-web-editor-pre-wrapper > pre {
                background-color: #1e1e1e !important;
                color: #cfcfcf !important;
            }

            .it-web-editor-field ::placeholder {
                color: #bbbbbb !important;
            }

            .it-web-editor-field input, .it-web-editor-field textarea {
                background-color: #2a2a2a !important;
                color: #ffffff !important;
                border: 1px solid #444444 !important;
            }

            .it-editor .it-editor-top-toolbar,
            .it-editor .it-editor-bottom-toolbar {
                background-color: #1f1f1f !important;
                color: #e0e0e0 !important;
            }

            .it-btn, .it-btn-outline, .it-web-btn, .it-web-btn-outline {
                background-color: #333333 !important;
                border-color: #555555 !important;
                color: #e0e0e0 !important;
            }

            .it-btn:hover, .it-btn-outline:hover, .it-web-btn:hover, .it-web-btn-outline:hover {
                background-color: #444444 !important;
                border-color: #666666 !important;
                color: #ffffff !important;
            }

            .it-web-header-logo {
                background-color: #1e1e1e !important;
            }

            .it-web-header, .it-web-sidebar-left {
                background-color: #1a1a1a !important;
            }

            .it-web-header a, .it-web-sidebar-left a {
                color: #e0e0e0 !important;
            }

            .it-web-header a:hover, .it-web-sidebar-left a:hover {
                color: #ffffff !important;
            }

            /* Remove unwanted gradients in the toolbars */
            .it-web-editor-toolbar {
                background: none !important;
                box-shadow: none !important;
            }

            /* Hide unwanted rectangle in the upper left corner */
            .it-web-header::before, .it-web-header::after {
                display: none !important;
            }

            /* Hide the element with the it-web-grad-bg class */
            .it-web-grad-bg {
                display: none !important;
            }

            /* Ensure all buttons are dark mode compatible */
            .it-web-btn, .it-web-btn-outline {
                background-color: #333333 !important;
                color: #e0e0e0 !important;
            }

            .it-web-btn:hover, .it-web-btn-outline:hover {
                background-color: #444444 !important;
                color: #ffffff !important;
            }

            /* Make icons inside buttons white, forcing override of existing styles */
            .it-web-editor-toolbar svg,
            .it-web-editor-toolbar .it-web-btn svg,
            .it-web-editor-toolbar .it-web-btn-outline svg {
                fill: #ffffff !important;
                stroke: #ffffff !important;
                color: #ffffff !important;
            }

            /* In case icons have other elements that need to be targeted */
            .it-web-editor-toolbar .it-web-btn svg *,
            .it-web-editor-toolbar .it-web-btn-outline svg * {
                fill: #ffffff !important;
                stroke: #ffffff !important;
                color: #ffffff !important;
            }
        `;
        document.head.appendChild(darkModeStyle);

        // Modify logo SVG path fills
        document.querySelectorAll('.it-web-editor-logo svg path').forEach(path => {
            path.style.fill = '#e0e0e0'; // Set to match button text color
        });

        document.querySelectorAll('.it-web-editor-logo text').forEach(text => {
            text.style.fill = '#e0e0e0'; // Set to match button text color
        });

        darkModeEnabled = true;
        darkModeToggle.innerHTML = '☀️ Light Mode';
    }

    // Function to disable dark mode styles
    function disableDarkMode() {
        // Remove the dark mode <style> tag
        const darkModeStyle = document.getElementById('custom-dark-mode-styles');
        if (darkModeStyle) {
            darkModeStyle.parentNode.removeChild(darkModeStyle);
        }

        // Restore original logo SVG path fills to white
        document.querySelectorAll('.it-web-editor-logo svg path').forEach(path => {
            path.style.fill = ''; // Reset to original
        });

        document.querySelectorAll('.it-web-editor-logo text').forEach(text => {
            text.style.fill = ''; // Reset to original
        });

        darkModeEnabled = false;
        darkModeToggle.innerHTML = '🌙 Dark Mode';
    }

    // Toggle dark mode on button click
    darkModeToggle.addEventListener('click', function() {
        if (darkModeEnabled) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    // Optional: Automatically apply dark mode if user prefers it
    // Uncomment the following lines if you want to enable dark mode based on user's system preference

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        enableDarkMode();
    }


})();