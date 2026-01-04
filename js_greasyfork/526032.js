// ==UserScript==
// @name         Roblox Animations, Loading Circle, Safety Warning, and Draggable Red Circle
// @license RatauCotl
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add animations, loading effects, a safety warning, and a draggable red circle with a menu for Roblox.com
// @author       Your Name
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526032/Roblox%20Animations%2C%20Loading%20Circle%2C%20Safety%20Warning%2C%20and%20Draggable%20Red%20Circle.user.js
// @updateURL https://update.greasyfork.org/scripts/526032/Roblox%20Animations%2C%20Loading%20Circle%2C%20Safety%20Warning%2C%20and%20Draggable%20Red%20Circle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS for animations, loading circle, warning screen, and red circle
    const style = document.createElement('style');
    style.innerHTML = `
        /* Animation for clickable objects */
        .animated-object {
            transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .animated-object:hover {
            transform: scale(1.1);
        }

        /* Loading circle and overlay */
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .loading-circle {
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .loading-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        /* Warning screen */
        .warning-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .warning-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .warning-box {
            background: #1e1e1e;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
            width: 100%;
        }

        .warning-box h2 {
            color: #fff;
            margin-bottom: 20px;
        }

        .warning-box button {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 0 10px;
            transition: background 0.3s ease;
        }

        .warning-box button.understand {
            background: #28a745;
            color: #fff;
        }

        .warning-box button.understand:hover {
            background: #218838;
        }

        .warning-box button.return {
            background: #dc3545;
            color: #fff;
        }

        .warning-box button.return:hover {
            background: #c82333;
        }

        /* Red circle and menu */
        .red-circle {
            position: fixed;
            width: 40px;
            height: 40px;
            background: red;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10001;
            user-select: none;
        }

        .red-circle-menu {
            position: absolute;
            top: 50px;
            left: 0;
            background: #1e1e1e;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            display: none;
            z-index: 10002;
        }

        .red-circle-menu button {
            display: block;
            width: 100%;
            padding: 5px 10px;
            margin: 5px 0;
            background: #3498db;
            color: #fff;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            transition: background 0.3s ease;
        }

        .red-circle-menu button:hover {
            background: #2980b9;
        }
    `;
    document.head.appendChild(style);

    // Function to add animations to clickable objects
    function addAnimationsToObjects() {
        const clickableObjects = document.querySelectorAll('a, button, .btn, .icon, .thumbnail'); // Add more selectors as needed
        clickableObjects.forEach(obj => {
            if (!obj.classList.contains('animated-object')) {
                obj.classList.add('animated-object');
            }
        });
    }

    // Function to show loading circle
    function showLoadingCircle() {
        const overlay = document.createElement('div');
        overlay.classList.add('loading-overlay');
        overlay.innerHTML = '<div class="loading-circle"></div>';
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);

        return overlay;
    }

    // Function to hide loading circle
    function hideLoadingCircle(overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }

    // Function to show warning screen
    function showWarningScreen() {
        const overlay = document.createElement('div');
        overlay.classList.add('warning-overlay');
        overlay.innerHTML = `
            <div class="warning-box">
                <h2>Warning!</h2>
                <p>If you are streaming, please turn off your screen for the stream. This is for your safety.</p>
                <button class="understand">I Understand</button>
                <button class="return">Return</button>
            </div>
        `;
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);

        // Add event listeners to buttons
        const understandButton = overlay.querySelector('.understand');
        const returnButton = overlay.querySelector('.return');

        understandButton.addEventListener('click', () => {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
            }, 300);
        });

        returnButton.addEventListener('click', () => {
            window.history.back();
        });
    }

    // Check if the current page is Settings or Account Info
    function isSettingsPage() {
        return window.location.href.includes('/my/account') || window.location.href.includes('/settings');
    }

    // Create the red circle and menu
    function createRedCircle() {
        const redCircle = document.createElement('div');
        redCircle.classList.add('red-circle');
        document.body.appendChild(redCircle);

        const menu = document.createElement('div');
        menu.classList.add('red-circle-menu');
        menu.innerHTML = `
            <button id="toggle-warning">Turn Warning Off</button>
        `;
        redCircle.appendChild(menu);

        // Load saved preference
        const warningEnabled = localStorage.getItem('warningEnabled') !== 'false';
        if (!warningEnabled) {
            menu.querySelector('#toggle-warning').textContent = 'Turn Warning On';
        }

        // Make the red circle draggable
        let isDragging = false;
        let offsetX, offsetY;

        redCircle.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - redCircle.getBoundingClientRect().left;
            offsetY = e.clientY - redCircle.getBoundingClientRect().top;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                redCircle.style.left = `${e.clientX - offsetX}px`;
                redCircle.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Toggle warning on/off
        menu.querySelector('#toggle-warning').addEventListener('click', () => {
            const warningEnabled = localStorage.getItem('warningEnabled') !== 'false';
            localStorage.setItem('warningEnabled', !warningEnabled);
            menu.querySelector('#toggle-warning').textContent = warningEnabled ? 'Turn Warning On' : 'Turn Warning Off';
            menu.style.display = 'none';
        });

        // Show/hide menu on click
        redCircle.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });

        // Hide menu when clicking outside
        document.addEventListener('click', () => {
            menu.style.display = 'none';
        });
    }

    // Detect page navigation and show loading circle (except on Settings/Account Info)
    let loadingOverlay = null;

    document.addEventListener('click', (event) => {
        const target = event.target.closest('a');
        if (target && target.href && !target.href.startsWith('javascript:') && !isSettingsPage()) {
            loadingOverlay = showLoadingCircle();
        }
    });

    window.addEventListener('beforeunload', () => {
        if (loadingOverlay && !isSettingsPage()) {
            loadingOverlay.classList.add('active');
        }
    });

    window.addEventListener('load', () => {
        if (loadingOverlay) {
            hideLoadingCircle(loadingOverlay);
            loadingOverlay = null;
        }
    });

    // Apply animations to objects on page load and dynamically
    addAnimationsToObjects();
    setInterval(addAnimationsToObjects, 1000);

    // Show warning screen if on Settings or Account Info page and warning is enabled
    if (isSettingsPage() && localStorage.getItem('warningEnabled') !== 'false') {
        showWarningScreen();
    }

    // Create the red circle
    createRedCircle();
})();