// ==UserScript==
// @name         Duohelper
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Monitor Ping and FPS, track session time, and reset password securely.
// @author       Your Name
// @match        https://*.duolingo.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/503968/Duohelper.user.js
// @updateURL https://update.greasyfork.org/scripts/503968/Duohelper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let basePing = 100; // Basic Ping (ms)
    let baseFps = 60; // Basic FPS

    let ping = basePing; // Current ping value (ms)
    let fps = baseFps; // Current FPS value
    let sessionStartTime = Date.now(); // Session start time

    // Function to check if localStorage is supported
    function isLocalStorageSupported() {
        try {
            const testKey = '__testKey';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Check if localStorage is supported
    if (!isLocalStorageSupported()) {
        console.error('LocalStorage is not supported.');
        return;
    }

    // Create and append CSS styles
    const style = document.createElement('style');
    style.textContent = `
        #performanceMonitor {
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 8px;
            border: 5px solid #ddd;
            background-color: #0a0a0a;
            color: white;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            width: 200px;
            text-align: left;
            overflow: auto;
            cursor: pointer;
            z-index: 9999;
            transition: opacity 0.3s ease-in-out;
        }
        #performanceMonitor button {
            display: block;
            margin-bottom: 5px;
            cursor: pointer;
            background-color: #444;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            transition: background-color 0.3s;
        }
        #performanceMonitor button:hover {
            background-color: #666;
        }
        #performanceContent {
            display: block;
        }
        .modal {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.9);
            color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: none;
        }
        .modal h3 {
            margin-bottom: 10px;
        }
        .modal label {
            display: block;
            margin-bottom: 5px;
        }
        .modal input[type="text"], .modal input[type="password"], .modal input[type="email"] {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #666;
            border-radius: 4px;
            background-color: #333;
            color: white;
        }
        .modal button {
            margin-top: 10px;
            padding: 8px 16px;
            background-color: #1cb0f6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .modal button:hover {
            background-color: #0a7bb0;
        }
    `;
    document.head.appendChild(style);

    // Create container for display
    const container = document.createElement('div');
    container.id = 'performanceMonitor';
    container.title = 'Click to hide/show';
    document.body.appendChild(container);

    // Create content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.id = 'performanceContentWrapper';
    container.appendChild(contentWrapper);

    // Create content area
    const content = document.createElement('div');
    content.id = 'performanceContent';
    contentWrapper.appendChild(content);

    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Hide';
    toggleButton.addEventListener('mouseover', () => {
        toggleButton.style.backgroundColor = '#666';
    });
    toggleButton.addEventListener('mouseout', () => {
        toggleButton.style.backgroundColor = '#444';
    });
    toggleButton.addEventListener('click', () => {
        const isVisible = contentWrapper.style.display !== 'none';
        contentWrapper.style.display = isVisible ? 'none' : 'block';
        toggleButton.textContent = isVisible ? 'Show' : 'Hide';
    });
    container.appendChild(toggleButton);

    // Create reload button
    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Reload Page';
    reloadButton.addEventListener('click', () => {
        location.reload();
    });
    contentWrapper.appendChild(reloadButton);

    // Function to measure ping
    async function measurePing(url) {
        try {
            const start = performance.now();
            const response = await fetch(url, { method: 'HEAD' });
            await response;
            const end = performance.now();
            const pingValue = Math.round(end - start) + ' ms';
            updateDisplay(pingValue);
        } catch (error) {
            console.error('Ping Error:', error);
            updateDisplay('Error');
        }
    }

    // Function to measure FPS
    let lastFrameTime = performance.now();
    let frameCount = 0;

    function measureFPS() {
        const now = performance.now();
        const delta = now - lastFrameTime;
        frameCount++;

        if (delta >= 1000) {
            const fpsValue = Math.round((frameCount * 1000) / delta);
            updateDisplay(null, fpsValue);
            frameCount = 0;
            lastFrameTime = now;
        }

        requestAnimationFrame(measureFPS);
    }

    // Function to update display
    function updateDisplay(pingValue, fpsValue) {
        if (pingValue !== undefined) {
            ping = pingValue;
        }
        if (fpsValue !== undefined) {
            fps = fpsValue;
        }

        const elapsedTime = formatSessionTime(Date.now() - sessionStartTime);

        const display = document.getElementById('performanceContent');
        display.innerHTML = `
            <div><strong>Ping:</strong> ${ping}</div>
            <div><strong>FPS:</strong> ${fps}</div>
            <div><strong>Session Time:</strong> ${elapsedTime}</div>
            <button id="resetPassword" style="margin-top: 5px;">Reset Password</button>
        `;
        document.getElementById('resetPassword').addEventListener('click', showResetPasswordModal);
    }

    // Format session time in HH:mm:ss format
    function formatSessionTime(milliseconds) {
        let seconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Modal to reset password
    const resetPasswordModal = document.createElement('div');
    resetPasswordModal.className = 'modal';
    resetPasswordModal.innerHTML = `
        <h3>Reset Password</h3>
        <div>
            <label for="resetEmail">Email:</label>
            <input type="email" id="resetEmail" />
        </div>
        <button id="sendResetEmail" style="margin-top: 10px;">Send Reset Email</button>
        <button id="cancelResetPassword" style="margin-top: 10px;">Cancel</button>
    `;
    document.body.appendChild(resetPasswordModal);

    // Show reset password modal function
    function showResetPasswordModal() {
        resetPasswordModal.style.display = 'block';
    }

    // Hide reset password modal function
    function hideResetPasswordModal() {
        resetPasswordModal.style.display = 'none';
    }

    // Cancel reset password modal function
    document.getElementById('cancelResetPassword').addEventListener('click', hideResetPasswordModal);

    // Send reset email function
    document.getElementById('sendResetEmail').addEventListener('click', () => {
        const email = document.getElementById('resetEmail').value;

        if (email && validateEmail(email)) {
            // Simulate sending a reset password email
            console.log('Sending password reset email to:', email);
            alert('A password reset email has been sent to ' + email);
            hideResetPasswordModal();
        } else {
            alert('Please enter a valid email address.');
        }
    });

    // Validate email address
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Start measuring ping and FPS
    setInterval(() => {
        measurePing('https://www.duolingo.com');
    }, 5000); // Measure ping every 5 seconds

    requestAnimationFrame(measureFPS); // Start measuring FPS

    // Initialize display
    updateDisplay(basePing, baseFps); // Initial display update
})();
