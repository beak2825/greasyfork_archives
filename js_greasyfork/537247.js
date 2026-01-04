// ==UserScript==
// @name         Chimp Mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Recreates the limited-hold memory task from the real chimpanzee test, where numbers are briefly shown and then hidden. In the original study, hold times were 650ms, 430ms, and 210ms. You can adjust the delay in the UI.
// @author       creationsdolly
// @match        https://humanbenchmark.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537247/Chimp%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/537247/Chimp%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Load saved delay and auto-hide settings from localStorage
    let delay = parseInt(localStorage.getItem('chimpClickDelay')) || 650;
    let autoHideEnabled = localStorage.getItem('chimpAutoHide') === 'true';
    let uiVisible = true;

    // Create and style the floating UI panel
    const panel = document.createElement('div');
    panel.innerHTML = `
        <style>
            #chimp-ui {
                font-family: 'Segoe UI', sans-serif;
                background: white;
                backdrop-filter: blur(4px);
                border: 1px solid #ccc;
                border-radius: 8px;
                padding: 8px 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                position: fixed;
                top: 55px;
                right: 20px;
                z-index: 9999;
                font-size: 14px;
                color: #333;
                display: none;
                transition: opacity 0.3s ease;
            }
            #chimp-ui label {
                font-weight: 500;
                margin-right: 6px;
            }
            #chimp-ui input[type="number"] {
                padding: 4px 6px;
                border: 1px solid #aaa;
                border-radius: 4px;
                width: 70px;
                outline: none;
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            #chimp-ui input:focus {
                border-color: #0077ff;
                box-shadow: 0 0 4px #0077ff66;
            }
            #chimp-ui .row {
                margin-bottom: 6px;
            }
        </style>
        <div id="chimp-ui">
            <div class="row">
                <label for="chimp-delay">Delay (ms):</label>
                <input type="number" id="chimp-delay" min="0" value="${delay}">
            </div>
            <div class="row">
                <label><input type="checkbox" id="chimp-autohide" ${autoHideEnabled ? 'checked' : ''}> Enable/disable</label>
            </div>
            <div style="font-size:11px; color:#666;">Press <b>X</b> to toggle UI</div>
        </div>
    `;
    document.body.appendChild(panel);

    const uiBox = panel.querySelector('#chimp-ui');
    const delayInput = panel.querySelector('#chimp-delay');
    const autoHideCheckbox = panel.querySelector('#chimp-autohide');

    // Handle changes to the delay input
    delayInput.addEventListener('input', function () {
        delay = parseInt(this.value);
        localStorage.setItem('chimpClickDelay', delay);
    });

    // Handle enable/disable checkbox toggle
    autoHideCheckbox.addEventListener('change', function () {
        autoHideEnabled = this.checked;
        localStorage.setItem('chimpAutoHide', autoHideEnabled);
    });

    // Pressing "X" toggles the visibility of the UI while on the chimp test page
    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'x' && location.pathname === '/tests/chimp') {
            uiVisible = !uiVisible;
            uiBox.style.display = uiVisible ? 'block' : 'none';
        }
    });

    // Hides the numbers on the tiles by turning text white and background white
    function simulateNumberHide() {
        const tiles = document.querySelectorAll('[data-cellnumber]');
        if (tiles.length === 0) return;

        tiles.forEach(tile => {
            tile.style.background = 'white';

            const textDiv = tile.querySelector('div');
            if (textDiv) {
                textDiv.textContent = '';
                textDiv.style.userSelect = 'none';
            }

            // Hide the tile completely after user clicks it (only once)
            tile.addEventListener('click', () => {
                tile.style.visibility = 'hidden';
            }, { once: true });
        });
    }

    // Waits for the "Continue" button to be clicked, then starts the hiding logic
    function setupClickListener() {
        const continueButton = document.querySelector('button.css-de05nr.e19owgy710');
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                setTimeout(() => {
                    if (autoHideEnabled) simulateNumberHide();
                }, delay);
            }, { once: true });
        }
    }

    // Detects DOM changes to attach listeners when the chimp test loads or changes
    const observer = new MutationObserver(() => {
        if (location.pathname === '/tests/chimp') {
            setupClickListener();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    let currentPath = location.pathname;

    // Detects navigation changes in the app to show/hide UI accordingly
    function checkUrlChange() {
        const newPath = location.pathname;
        if (newPath !== currentPath) {
            currentPath = newPath;
            handleUrlChange();
        }
    }

    // Manages UI display when navigating between sections of the site
    function handleUrlChange() {
        if (currentPath === '/tests/chimp') {
            if (uiVisible) uiBox.style.display = 'block';
            setupClickListener();
        } else {
            uiBox.style.display = 'none';
        }
    }

    // Monkey-patch pushState to detect navigation in SPA (single-page app)
    const pushState = history.pushState;
    history.pushState = function (...args) {
        pushState.apply(this, args);
        setTimeout(checkUrlChange, 50);
    };
    window.addEventListener('popstate', checkUrlChange);

    // Run once when script loads
    handleUrlChange();
})();
