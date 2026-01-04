// ==UserScript==
// @name         Prodigy Enhancer
// @namespace    https://greasyfork.org/users/yourusername
// @version      1.0
// @description  Enhance Prodigy with dark mode, shortcuts, and layout improvements
// @author       Abel
// @match        https://prodi.gy/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523688/Prodigy%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/523688/Prodigy%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Add Dark Mode Styles
    const darkModeStyles = `
        body {
            background-color: #121212 !important;
            color: #ffffff !important;
        }
        .header, .footer {
            background-color: #1e1e1e !important;
        }
        .button {
            background-color: #333333 !important;
            color: #ffffff !important;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.id = 'dark-mode-styles';
    styleSheet.innerText = darkModeStyles;
    document.head.appendChild(styleSheet);

    // Add a Dark Mode Toggle Button
    const darkModeToggle = document.createElement('button');
    darkModeToggle.textContent = 'Toggle Dark Mode';
    darkModeToggle.style.position = 'fixed';
    darkModeToggle.style.top = '10px';
    darkModeToggle.style.right = '10px';
    darkModeToggle.style.padding = '10px';
    darkModeToggle.style.zIndex = '1000';
    darkModeToggle.onclick = () => {
        const darkMode = document.getElementById('dark-mode-styles');
        if (darkMode) {
            darkMode.remove();
        } else {
            document.head.appendChild(styleSheet);
        }
    };
    document.body.appendChild(darkModeToggle);

    // Add Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            darkModeToggle.click(); // Toggle Dark Mode with Ctrl+D
        }
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            alert('Custom Save Shortcut Activated!');
        }
    });

    // Improve Layout: Example of resizing panels
    const resizePanels = () => {
        const panels = document.querySelectorAll('.panel');
        panels.forEach(panel => {
            panel.style.width = '45%';
            panel.style.margin = '10px';
        });
    };
    window.addEventListener('load', resizePanels);
})();
