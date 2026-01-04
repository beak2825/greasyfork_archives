// ==UserScript==
// @name         Auto Input and Click Infinity AI
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自動輸入文字並點選「Create Now」按鈕，每15分鐘刷新頁面
// @author       Jason
// @license      Jason
// @match        https://app.infinityai.network/create
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507747/Auto%20Input%20and%20Click%20Infinity%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/507747/Auto%20Input%20and%20Click%20Infinity%20AI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variables to control the script
    let isRunning = false;
    let inputText = ''; // Default input text

    // Create a UI panel
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '10px'; // Position at the bottom
    panel.style.left = '10px'; // Position at the left
    panel.style.backgroundColor = '#f9f9f9'; // Light grey background
    panel.style.border = '1px solid #ccc';
    panel.style.padding = '10px';
    panel.style.zIndex = '1000';
    panel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    panel.style.borderRadius = '5px'; // Rounded corners
    panel.innerHTML = `
        <h3 style="margin: 0; font-size: 16px; color: #333;">Infinity AI Auto Input</h3>
        <input type="text" id="inputText" value="${inputText}" placeholder="Enter text here" style="width: 100%; padding: 5px; margin-top: 5px; color: #000; background-color: #fff;"/>
        <button id="toggleButton" style="margin-top: 5px; padding: 5px; background-color: #28a745; color: white; border: none; border-radius: 3px;">Start</button>
        <button id="stopButton" style="margin-top: 5px; padding: 5px; background-color: #dc3545; color: white; border: none; border-radius: 3px; display: none;">Stop</button>
    `;
    document.body.appendChild(panel);

    // Function to input text and click the button
    function autoInputAndClick() {
        // Find the textarea and input the specified text
        const textarea = document.querySelector('.chakra-textarea.css-gt1cyx');
        if (textarea) {
            textarea.innerHTML = inputText; // Set the innerHTML to the desired text
            textarea.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event
        }

        // Find the button and click it
        const button = document.querySelector('button.chakra-button.css-4l4dj5');
        if (button) {
            button.click(); // Click the button
        }
    }

    // Function to start the auto input process
    function startAutoInput() {
        isRunning = true;
        inputText = document.getElementById('inputText').value; // Get user input text
        document.getElementById('toggleButton').style.display = 'none';
        document.getElementById('stopButton').style.display = 'inline';

        // Execute the function every second (1000 milliseconds)
        const inputInterval = setInterval(() => {
            if (isRunning) {
                autoInputAndClick(); // Execute the input and click
            } else {
                clearInterval(inputInterval); // Clear the interval if stopped
            }
        }, 1); // 1 second

        // Refresh the page every 15 minutes (900000 milliseconds)
        setInterval(() => {
            if (isRunning) {
                location.reload(); // Refresh the page
            }
        }, 900000); // 15 minutes
    }

    // Function to stop the auto input process
    function stopAutoInput() {
        isRunning = false;
        document.getElementById('toggleButton').style.display = 'inline';
        document.getElementById('stopButton').style.display = 'none';
    }

    // Event listeners for buttons
    document.getElementById('toggleButton').addEventListener('click', startAutoInput);
    document.getElementById('stopButton').addEventListener('click', stopAutoInput);

})();