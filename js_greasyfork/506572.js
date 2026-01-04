// ==UserScript==
// @name         Oculus GUI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Custom GUI for script execution
// @author       Your Name
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/506572/Oculus%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/506572/Oculus%20GUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject HTML
    const oculusGUI = document.createElement('div');
    oculusGUI.id = 'oculus-gui';
    oculusGUI.innerHTML = `
        <div class="container">
            <div class="sidebar">
                <p>Hello user</p>
            </div>
            <div class="main">
                <div class="header">
                    <span id="oculus-label"><img src="https://i.imgur.com/og6DB9N.png" alt="Oculus" class="logo"> oculus</span>
                    <div id="status-indicator" class="status-indicator red"></div>
                </div>
                <div class="output-area-container">
                    <textarea id="script-input" class="output-area" placeholder="Enter your script here..."></textarea>
                </div>
                <div class="buttons">
                    <button id="execute">Execute</button>
                    <button id="clear">Clear</button>
                    <button id="inject">Inject</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(oculusGUI);

    // Inject CSS
    GM_addStyle(`
        #oculus-gui {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 600px;
            z-index: 9999;
            font-family: Arial, sans-serif;
        }

        .container {
            display: flex;
            background-color: #FFCA2E;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .sidebar {
            width: 16%;
            background-color: #C69300;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000;
            font-weight: bold;
            font-size: 18px;
            border-radius: 10px 0 0 10px;
        }

        .main {
            width: 84%;
            padding: 0;
            display: flex;
            flex-direction: column;
        }

        .header {
            background-color: #FFCA2E;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #D4D4D4;
        }

        .logo {
            height: 40px;
            vertical-align: middle;
        }

        #oculus-label {
            font-size: 24px;
            font-weight: bold;
            color: #000;
            display: flex;
            align-items: center;
        }

        .status-indicator {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 20px;
        }

        .status-indicator.green {
            background-color: #00FF00;
        }

        .status-indicator.red {
            background-color: #FF0000;
        }

        .output-area-container {
            flex: 1;
            background-color: #D4D4D4;
            border-radius: 10px;
            margin: 20px;
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .output-area {
            width: 100%;
            height: 200px;
            background-color: #BFBFBF;
            border: none;
            border-radius: 10px;
            padding: 20px;
            font-size: 16px;
            resize: none;
            box-shadow: inset 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .buttons {
            display: flex;
            justify-content: space-around;
            background-color: #FFCA2E;
            padding: 10px;
        }

        button {
            background-color: #FFCA2E;
            border: 2px solid #E0A800;
            border-radius: 20px;
            padding: 10px 30px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #E0A800;
        }

        button:active {
            background-color: #C69300;
        }
    `);

    // JavaScript Logic
    const executeButton = document.getElementById('execute');
    const clearButton = document.getElementById('clear');
    const injectButton = document.getElementById('inject');
    const scriptInput = document.getElementById('script-input');
    const statusIndicator = document.getElementById('status-indicator');

    injectButton.addEventListener('click', function() {
        statusIndicator.classList.remove('red');
        statusIndicator.classList.add('green');
        statusIndicator.setAttribute('data-injected', 'true');
    });

    clearButton.addEventListener('click', function() {
        scriptInput.value = "";
    });

    executeButton.addEventListener('click', function() {
        if (statusIndicator.getAttribute('data-injected') === 'true') {
            const script = scriptInput.value;

            // Execute Userscript
            try {
                eval(script);
                alert('Script executed successfully.');
            } catch (err) {
                console.error('Error executing script:', err);
            }
        } else {
            alert('Please inject the environment first.');
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
