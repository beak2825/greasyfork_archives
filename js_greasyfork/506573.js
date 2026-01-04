// ==UserScript==
// @name         Agar.io Oculus GUI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Custom GUI for script execution in Agar.io
// @author       Your Name
// @match        *://agar.io/*
// @grant        GM_addStyle
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/506573/Agario%20Oculus%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/506573/Agario%20Oculus%20GUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the "Open GUI" button
    const openGuiButton = document.createElement('button');
    openGuiButton.id = 'open-gui-button';
    openGuiButton.innerText = 'Open GUI';
    document.body.appendChild(openGuiButton);

    // Create the GUI container
    const oculusGUI = document.createElement('div');
    oculusGUI.id = 'oculus-gui';
    oculusGUI.style.display = 'none'; // Initially hidden
    oculusGUI.innerHTML = `
        <div id="oculus-container">
            <div id="oculus-header">
                <img src="https://i.imgur.com/og6DB9N.png" alt="Oculus" id="oculus-logo">
                <span id="oculus-label">Oculus</span>
                <div id="status-indicator" class="red-circle"></div>
                <button id="close-gui-button">X</button>
            </div>
            <textarea id="script-input" placeholder="Enter your script here..."></textarea>
            <div id="oculus-buttons">
                <button id="execute">Execute</button>
                <button id="clear">Clear</button>
                <button id="inject">Inject</button>
            </div>
        </div>
    `;
    document.body.appendChild(oculusGUI);

    // Inject CSS styles
    GM_addStyle(`
        #open-gui-button {
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 10000;
            padding: 10px 20px;
            background-color: #FFCA2E;
            border: 2px solid #E0A800;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
        }

        #open-gui-button:hover {
            background-color: #E0A800;
        }

        #oculus-gui {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 600px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            background-color: #FFCA2E;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        #oculus-container {
            padding: 10px;
        }

        #oculus-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #FFCA2E;
            border-bottom: 2px solid #D4D4D4;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }

        #oculus-logo {
            height: 40px;
            margin-right: 10px;
        }

        #oculus-label {
            font-size: 24px;
            font-weight: bold;
            color: #000;
        }

        #status-indicator {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #FF0000;
            margin-right: 20px;
        }

        #close-gui-button {
            background-color: #FFCA2E;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #000;
            font-weight: bold;
        }

        #script-input {
            width: 100%;
            height: 200px;
            background-color: #BFBFBF;
            border: none;
            border-radius: 10px;
            padding: 10px;
            font-size: 16px;
            resize: none;
            box-shadow: inset 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 10px;
        }

        #oculus-buttons {
            display: flex;
            justify-content: space-between;
        }

        #oculus-buttons button {
            background-color: #FFCA2E;
            border: 2px solid #E0A800;
            border-radius: 20px;
            padding: 10px 30px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        #oculus-buttons button:hover {
            background-color: #E0A800;
        }

        #oculus-buttons button:active {
            background-color: #C69300;
        }
    `);

    // JavaScript Logic

    // Open GUI
    openGuiButton.addEventListener('click', function() {
        oculusGUI.style.display = 'block';
    });

    // Close GUI
    document.getElementById('close-gui-button').addEventListener('click', function() {
        oculusGUI.style.display = 'none';
    });

    const executeButton = document.getElementById('execute');
    const clearButton = document.getElementById('clear');
    const injectButton = document.getElementById('inject');
    const scriptInput = document.getElementById('script-input');
    const statusIndicator = document.getElementById('status-indicator');

    injectButton.addEventListener('click', function() {
        statusIndicator.classList.remove('red-circle');
        statusIndicator.classList.add('green-circle');
    });

    clearButton.addEventListener('click', function() {
        scriptInput.value = "";
    });

    executeButton.addEventListener('click', function() {
        try {
            eval(scriptInput.value);
            alert('Script executed successfully.');
        } catch (err) {
            console.error('Error executing script:', err);
            alert('Error executing script.');
        }
    });

    // Dragging Logic
    oculusGUI.onmousedown = function(event) {
        let shiftX = event.clientX - oculusGUI.getBoundingClientRect().left;
        let shiftY = event.clientY - oculusGUI.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            oculusGUI.style.left = pageX - shiftX + 'px';
            oculusGUI.style.top = pageY - shiftY + 'px';
        }

        moveAt(event.pageX, event.pageY);

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        oculusGUI.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            oculusGUI.onmouseup = null;
        };
    };

    oculusGUI.ondragstart = function() {
        return false;
    };
})();
