// ==UserScript==
// @name         BTX HAWIHUB
// @namespace    http://your-namespace.example.com
// @version      1.0
// @description  Adds a movable GUI with GOD MODE button to any webpage
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474479/BTX%20HAWIHUB.user.js
// @updateURL https://update.greasyfork.org/scripts/474479/BTX%20HAWIHUB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isDragging = false;
    var offsetX, offsetY;

    function setSpeed() {
        var speedValue = document.getElementById('speedTextBox').value;
        alert('Speed set to: ' + speedValue);
    }

    function activateGodMode() {
        // Implement your "GOD MODE" functionality here.
        alert('GOD MODE activated!');
        // You can add your custom code to enable God Mode here.
    }

    function createGUI() {
        var speedTextBox = document.createElement('input');
        speedTextBox.id = 'speedTextBox';
        speedTextBox.type = 'text';
        speedTextBox.placeholder = 'Enter speed';
        speedTextBox.className = 'speed-textbox';

        var setSpeedButton = document.createElement('button');
        setSpeedButton.textContent = 'Set speed';
        setSpeedButton.className = 'speed-button';
        setSpeedButton.addEventListener('click', setSpeed);

        var godModeButton = document.createElement('button');
        godModeButton.textContent = 'GOD MODE';
        godModeButton.className = 'god-mode-button';
        godModeButton.addEventListener('click', activateGodMode);

        // Create a title for the GUI
        var title = document.createElement('h1');
        title.textContent = 'BTX HAWIHUB';
        title.className = 'gui-title';

        var container = document.createElement('div');
        container.className = 'speed-container';
        container.appendChild(title); // Add the title
        container.appendChild(speedTextBox);
        container.appendChild(setSpeedButton);
        container.appendChild(godModeButton);

        document.body.appendChild(container);

        var styles = `
            .speed-container {
                position: absolute;
                top: 50px;
                left: 50px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 10px;
                background-color: #f0f0f0;
                border-radius: 5px;
                box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
                cursor: move;
                border: 2px solid #00f; /* Neon blue outline */
            }
            
            .gui-title {
                font-size: 24px;
                margin-bottom: 10px;
            }

            .speed-textbox, .speed-button, .god-mode-button {
                padding: 5px 10px;
                font-size: 16px;
                border: 2px solid #3498db;
                border-radius: 5px;
                margin-bottom: 10px; /* Add some spacing between input and buttons */
                background-color: #3498db;
                color: white;
                cursor: pointer;
            }

            .speed-button:hover, .god-mode-button:hover {
                background-color: #2980b9;
            }
        `;

        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        container.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
        });

        window.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            var newX = e.clientX - offsetX;
            var newY = e.clientY - offsetY;

            container.style.left = newX + 'px';
            container.style.top = newY + 'px';
        });

        window.addEventListener('mouseup', function() {
            isDragging = false;
        });
    }

    createGUI();
})();
