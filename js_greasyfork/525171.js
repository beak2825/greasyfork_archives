// ==UserScript==
// @name         Sparx Maths Enhancements with Dark Mode
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds productivity tools and dark mode for Sparx Maths platform.
// @author       CyphrNX
// @match        *://*.sparxmaths.uk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525171/Sparx%20Maths%20Enhancements%20with%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/525171/Sparx%20Maths%20Enhancements%20with%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Inject CSS for custom styles (e.g., timer, dark mode)
    const style = document.createElement('style');
    style.id = 'custom-style';
    style.innerHTML = `
        #custom-timer {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 16px;
            z-index: 9999;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .highlighted {
            background-color: yellow !important;
            border: 2px solid red !important;
        }
        .dark-mode {
            background-color: #1e1e1e !important;
            color: #d4d4d4 !important;
        }
        .dark-mode input, .dark-mode textarea {
            background-color: #2d2d2d !important;
            color: #ffffff !important;
            border: 1px solid #555 !important;
        }
        .dark-mode button {
            background-color: #444 !important;
            color: #fff !important;
            border: 1px solid #555 !important;
        }
        .dark-mode a {
            color: #79b8ff !important;
        }
    `;
    document.head.appendChild(style);

    // Add dark mode toggle button
    const darkModeButton = document.createElement('button');
    darkModeButton.innerText = 'Toggle Dark Mode';
    darkModeButton.style.position = 'fixed';
    darkModeButton.style.top = '20px';
    darkModeButton.style.left = '20px';
    darkModeButton.style.zIndex = '9999';
    darkModeButton.style.padding = '10px 20px';
    darkModeButton.style.background = '#333';
    darkModeButton.style.color = '#fff';
    darkModeButton.style.border = 'none';
    darkModeButton.style.borderRadius = '5px';
    darkModeButton.style.cursor = 'pointer';
    darkModeButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    document.body.appendChild(darkModeButton);

    let darkModeEnabled = false;

    // Toggle dark mode
    darkModeButton.addEventListener('click', () => {
        darkModeEnabled = !darkModeEnabled;

        if (darkModeEnabled) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    });

    // Highlight key elements
    function highlightImportantElements() {
        const question = document.querySelector('.question-text'); // Adjust selector based on Sparx
        const inputs = document.querySelectorAll('input[type="text"], textarea');

        if (question) {
            question.classList.add('highlighted');
        }
        inputs.forEach((input) => {
            input.classList.add('highlighted');
        });
    }
    highlightImportantElements();

    // Add a session timer
    const timer = document.createElement('div');
    timer.id = 'custom-timer';
    timer.innerText = 'Session Timer: 0:00';
    document.body.appendChild(timer);

    let seconds = 0;
    setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timer.innerText = `Session Timer: ${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }, 1000);
})();
