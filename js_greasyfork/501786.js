// ==UserScript==
// @name         MooMoo.io Sandbox Password System
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a password system to sandbox.moomoo.io with locking functionality
// @match        *://sandbox.moomoo.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501786/MooMooio%20Sandbox%20Password%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/501786/MooMooio%20Sandbox%20Password%20System.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PASSWORD = 'wat';
    const LOCK_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Check if the script is locked
    const lockUntil = GM_getValue('lockUntil', 0);
    if (Date.now() < lockUntil) {
        alert('Script is locked. Please try again later.');
        return;
    }

    // Create and append CSS
    const style = document.createElement('style');
    style.textContent = `
        #passwordOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        #passwordBox {
            background-color: #000;
            border: 4px solid;
            border-image: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff) 1;
            padding: 20px;
            text-align: center;
            animation: borderAnimation 5s linear infinite;
        }
        #passwordInput {
            margin: 10px 0;
            padding: 5px;
            width: 200px;
        }
        #submitPassword {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
        }
        #message {
            color: white;
            margin-top: 10px;
        }
        @keyframes borderAnimation {
            0% { border-image-source: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff); }
            100% { border-image-source: linear-gradient(45deg, #8b00ff, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff); }
        }
    `;
    document.head.appendChild(style);

    // Create password overlay
    const overlay = document.createElement('div');
    overlay.id = 'passwordOverlay';
    overlay.innerHTML = `
        <div id="passwordBox">
            <h2 style="color: white;">Enter Password</h2>
            <input type="password" id="passwordInput" placeholder="Password">
            <br>
            <button id="submitPassword">Submit</button>
            <div id="message"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Add event listener to submit button
    document.getElementById('submitPassword').addEventListener('click', checkPassword);

    // Add event listener for Enter key
    document.getElementById('passwordInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });

    function checkPassword() {
        const input = document.getElementById('passwordInput').value;
        const messageElement = document.getElementById('message');

        if (input === PASSWORD) {
            messageElement.textContent = 'Authentication successful. Welcome!';
            messageElement.style.color = 'green';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 2000);
        } else {
            messageElement.textContent = 'Authentication wrong. Locking script...';
            messageElement.style.color = 'red';
            GM_setValue('lockUntil', Date.now() + LOCK_DURATION);
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    }
})();
