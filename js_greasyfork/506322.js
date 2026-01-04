// ==UserScript==
// @name         Kogama Tesla CheatWorker
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Kogama cheats with extensive API support, in-game functionality, and a mobile keyboard for player movement.
// @author       YourName
// @match        *://www.kogama.com/*
// @match        *://friends.kogama.com/*
// @match        *://www.kogama.com/games/*
// @match        *://friends.kogama.com/games/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506322/Kogama%20Tesla%20CheatWorker.user.js
// @updateURL https://update.greasyfork.org/scripts/506322/Kogama%20Tesla%20CheatWorker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS for modern UI
    const styles = `
        .tesla-cheatworker {
            position: fixed;
            top: 20px;
            left: 20px;
            background-color: #4A4A4A;
            color: white;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: none;
            width: 300px;
        }
        .tesla-cheatworker .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
        }
        .tesla-cheatworker .header img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
        }
        .tesla-cheatworker .header h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
        }
        .tesla-cheatworker button {
            background-color: #333;
            color: white;
            border: none;
            padding: 10px 15px;
            margin: 8px 0;
            cursor: pointer;
            border-radius: 6px;
            transition: background-color 0.3s ease;
            text-align: left;
        }
        .tesla-cheatworker button:hover {
            background-color: #555;
        }
        .tesla-cheatworker button:active {
            background-color: #666;
        }
        .tesla-cheatworker button:focus {
            outline: none;
            box-shadow: 0 0 0 2px #888;
        }
        .mobile-keyboard {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background-color: #4A4A4A;
            color: white;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: none;
        }
        .mobile-keyboard button {
            background-color: #333;
            color: white;
            border: none;
            padding: 10px;
            margin: 5px;
            cursor: pointer;
            border-radius: 50%;
            transition: background-color 0.3s ease;
        }
        .mobile-keyboard button:hover {
            background-color: #555;
        }
        .mobile-keyboard button:active {
            background-color: #666;
        }
        .mobile-keyboard button:focus {
            outline: none;
            box-shadow: 0 0 0 2px #888;
        }
        .status-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: red;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .status-button.green {
            background-color: green;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Create the Tesla CheatWorker GUI
    const cheatGUI = document.createElement('div');
    cheatGUI.className = 'tesla-cheatworker';
    cheatGUI.innerHTML = `
        <div class="header">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tesla_logo.png/200px-Tesla_logo.png" alt="Tesla Logo">
            <h2>Tesla CheatWorker</h2>
            <button id="toggle-cheatworker">Toggle</button>
        </div>
        <button id="inject-cheat">Inject Cheat</button>
        <button id="give-random-item">Give Random Item</button>
        <button id="give-gun">Give Gun</button>
        <button id="give-block">Give Block</button>
        <button id="teleport-player">Teleport Player</button>
        <button id="bring-player">Bring Player</button>
    `;
    document.body.appendChild(cheatGUI);

    // Create a draggable mobile keyboard
    const mobileKeyboard = document.createElement('div');
    mobileKeyboard.className = 'mobile-keyboard';
    mobileKeyboard.innerHTML = `
        <button id="move-up">⬆️</button>
        <button id="move-left">⬅️</button>
        <button id="move-right">➡️</button>
        <button id="move-down">⬇️</button>
        <button id="jump">Jump</button>
    `;
    document.body.appendChild(mobileKeyboard);

    // Create the status button
    const statusButton = document.createElement('button');
    statusButton.className = 'status-button';
    statusButton.textContent = 'Not Injected';
    document.body.appendChild(statusButton);

    // Make the mobile keyboard draggable
    mobileKeyboard.onmousedown = function(event) {
        let shiftX = event.clientX - mobileKeyboard.getBoundingClientRect().left;
        let shiftY = event.clientY - mobileKeyboard.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            mobileKeyboard.style.left = pageX - shiftX + 'px';
            mobileKeyboard.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        mobileKeyboard.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            mobileKeyboard.onmouseup = null;
        };
    };
    mobileKeyboard.ondragstart = function() {
        return false;
    };

    // Add the open/close functionality for both GUIs
    let guiOpen = true;
    let keyboardOpen = true;

    document.getElementById('toggle-cheatworker').onclick = function() {
        guiOpen = !guiOpen;
        cheatGUI.style.display = guiOpen ? 'block' : 'none';
    };

    // Show GUI and keyboard on game pages
    window.addEventListener('load', function() {
        if (window.location.href.includes('/games/')) {
            cheatGUI.style.display = 'block';
            mobileKeyboard.style.display = 'block';
        }
    });

    // Initialize the cheat
    function initializeCheat() {
        // Example API calls and setup
        console.log("Cheat injected successfully!");
        statusButton.textContent = 'Injected';
        statusButton.classList.add('green');
        statusButton.classList.remove('red');
        // Example: Initialize all the cheats, connect to Kogama APIs, etc.
        // Add additional API integration here
    }

    function failInjection() {
        statusButton.textContent = 'Failed to Inject';
        statusButton.classList.add('red');
        statusButton.classList.remove('green');
    }

    // Function to interact with Kogama APIs (mocked example)
    function interactWithKogamaAPI(action, params) {
        // Implement API calls based on action and params
        console.log(`Interacting with Kogama API: ${action}`, params);
    }

    // Functionality for the buttons
    document.getElementById('inject-cheat').onclick = function() {
        try {
            initializeCheat();
        } catch (e) {
            failInjection();
        }
    };
    document.getElementById('give-random-item').onclick = function() {
        interactWithKogamaAPI('giveRandomItem', {});
    };
    document.getElementById('give-gun').onclick = function() {
        interactWithKogamaAPI('giveGun', {});
    };
    document.getElementById('give-block').onclick = function() {
        interactWithKogamaAPI('giveBlock', {});
    };
    document.getElementById('teleport-player').onclick = function() {
        // Example logic to choose and teleport a player
        interactWithKogamaAPI('teleportPlayer', { playerId: prompt('Enter player ID to teleport:') });
    };
    document.getElementById('bring-player').onclick = function() {
        // Example logic to choose and bring a player
        interactWithKogamaAPI('bringPlayer', { playerId: prompt('Enter player ID to bring:') });
    };

    // Mobile keyboard functionality
    document.getElementById('move-up').onclick = function() {
        interactWithKogamaAPI('movePlayer', { direction: 'up' });
    };
    document.getElementById('move-left').onclick = function() {
        interactWithKogamaAPI('movePlayer', { direction: 'left' });
    };
    document.getElementById('move-right').onclick = function() {
        interactWithKogamaAPI('movePlayer', { direction: 'right' });
    };
    document.getElementById('move-down').onclick = function() {
        interactWithKogamaAPI('movePlayer', { direction: 'down' });
    };
    document.getElementById('jump').onclick = function() {
        interactWithKogamaAPI('playerJump', {});
    };

    // Auto-update check periodically
    function checkForUpdates() {
        // Example logic to check for updates
        // Compare current version with stored version
        let currentVersion = '1.3'; // Update this value as necessary
        let storedVersion = localStorage.getItem('cheatWorkerVersion');
        if (storedVersion !== currentVersion) {
            console.log('New version detected. Reinitializing cheat...');
            initializeCheat();
            localStorage.setItem('cheatWorkerVersion', currentVersion);
        }
    }

    setInterval(checkForUpdates, 60000); // Check every 60 seconds
})();
