// ==UserScript==
// @name         Fake bot V2
// @version      1.5
// @description  Change villa every iteration
// @include      https://*/game.php*screen=place*
// @namespace https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/524172/Fake%20bot%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/524172/Fake%20bot%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';

const container = document.createElement('div');
container.style.position = 'fixed';
container.style.bottom = '20px';
container.style.right = '20px';
container.style.backgroundColor = '#333';
container.style.color = '#fff';
container.style.padding = '8px';
container.style.borderRadius = '5px';
container.style.zIndex = '10000';
container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
container.style.display = 'flex';
container.style.flexDirection = 'column';
container.style.gap = '10px';
document.body.appendChild(container);

// Remaining loops display
const loopCounterDisplay = document.createElement('div');
loopCounterDisplay.style.fontSize = '14px'; // Smaller text size
loopCounterDisplay.style.textAlign = 'center';
loopCounterDisplay.textContent = 'Remaining Loops: 0';
container.appendChild(loopCounterDisplay);

// Create a flex container for buttons to be side by side
const buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex';
buttonContainer.style.gap = '10px'; // Add space between buttons
buttonContainer.style.width = '100%'; // Ensure the container spans the full width
container.appendChild(buttonContainer);

// Start/Stop button
const startStopButton = document.createElement('button');
startStopButton.textContent = 'Start';
startStopButton.style.padding = '5px 8px'; // Smaller padding
startStopButton.style.fontSize = '14px'; // Smaller font size
startStopButton.style.backgroundColor = '#4CAF50';
startStopButton.style.color = '#fff';
startStopButton.style.border = 'none';
startStopButton.style.borderRadius = '3px';
startStopButton.style.cursor = 'pointer';
startStopButton.style.flex = '1'; // Allow button to take equal space
buttonContainer.appendChild(startStopButton);

// Set Loops button
const loopButton = document.createElement('button');
loopButton.textContent = 'Set';
loopButton.style.padding = '5px 8px'; // Smaller padding
loopButton.style.fontSize = '14px'; // Smaller font size
loopButton.style.backgroundColor = '#FF9800';
loopButton.style.color = '#fff';
loopButton.style.border = 'none';
loopButton.style.borderRadius = '3px';
loopButton.style.cursor = 'pointer';
loopButton.style.flex = '1'; // Allow button to take equal space
buttonContainer.appendChild(loopButton);

    // Retrieve the last state from localStorage
    let isRunning = localStorage.getItem('botState') === 'running';
    let remainingLoops = parseFloat(localStorage.getItem('remainingLoops')) || 0;
    let currentloop = parseFloat(localStorage.getItem('currentloop')) || remainingLoops;

    // Set initial button and loop counter state
    startStopButton.textContent = isRunning ? 'Stop' : 'Start';
    loopCounterDisplay.textContent = `Remaining Loops: ${remainingLoops}`;

    // Start the bot if it was running
    if (isRunning) {
        startBot();
    }

    // Start/Stop button event
    startStopButton.addEventListener('click', () => {
        if (isRunning) {
            stopBot();
        } else {
            startBot();
        }
    });

    // Loop button event
    loopButton.addEventListener('click', () => {
        const loopsInput = parseInt(prompt("Enter the number of loops to run:", remainingLoops), 10);
        if (!isNaN(loopsInput) && loopsInput > 0) {
            remainingLoops = loopsInput;
            currentloop = remainingLoops;
            localStorage.setItem('remainingLoops', remainingLoops);
            localStorage.setItem('currentloop', currentloop);
            loopCounterDisplay.textContent = `Remaining Loops: ${remainingLoops}`;
            console.log(`Set loops to: ${remainingLoops}`);
        }
    });

    function startBot() {
        isRunning = true;
        localStorage.setItem('botState', 'running');
        startStopButton.textContent = 'Stop';
        console.log("Bot started");
        loopCounterDisplay.textContent = `Remaining Loops: ${remainingLoops}`;
        runBotLoop();
    }

    function stopBot() {
        isRunning = false;
        localStorage.setItem('botState', 'stopped');
        startStopButton.textContent = 'Start';
        console.log("Bot stopped");
    }

    function runBotLoop() {
        if (remainingLoops > 0) {
            if (!window.location.href.includes("&screen=place&try=confirm")) {
                if (currentloop !== remainingLoops) {
                    setTimeout(() => {
                        clickKeyD(() => {
                            console.log("Clicked key 'D' and resuming...");
                        });
                        currentloop = remainingLoops;
                        localStorage.setItem('currentloop', currentloop);
                    }, 300 + Math.random() * 200);
                }
                setTimeout(() => {
                    document.dispatchEvent(new KeyboardEvent('keydown', {
                        key: '0', code: 'Digit0', keyCode: 48, which: 48, bubbles: true
                    }));
                    console.log("Key '0' pressed.");

                    checkAndClickButton();
                }, 1200 + Math.random() * 300);
            }

            setTimeout(() => {
                const url = window.location.href;
                if (url.includes("&screen=place&try=confirm")) {
                    const confirmButton = document.querySelector('#troop_confirm_submit');
                    if (confirmButton) {
                        console.log("Detected &screen=place&try=confirm and #troop_confirm_submit exists");
                        // setTimeout(()=> clickButton('#troop_confirm_submit', Math.random() * 100 + 100), 100);
                        setTimeout(() => {
                            clickButton('#troop_confirm_submit')
                        }, 200 + Math.random() * 100);
                        remainingLoops -= 1;
                        localStorage.setItem('remainingLoops', remainingLoops);
                        localStorage.setItem('currentloop', currentloop);
                        loopCounterDisplay.textContent = `Remaining Loops: ${remainingLoops}`;
                        console.log("Sent confirmation");
                    } else {
                        // const newUrl = url.replace("&try=confirm", "");
                        // window.location.href = newUrl;
                        currentloop -= 1;
                        localStorage.setItem('currentloop', currentloop);
                        const newUrl = url.replace(/(&screen=place).*$/, "$1");
                        window.location.href = newUrl;

                    }
                }

                if (remainingLoops > 0) {
                    runBotLoop();
                } else {
                    stopBot();
                }
            }, 1000 + Math.random() * 300);
        }
    }

    function clickKeyD(callback) {
        setTimeout(() => {
            document.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'D', code: 'KeyD', keyCode: 68, which: 68, bubbles: true
            }));
            console.log("Key 'D' pressed.");
            if (callback) callback();
        }, Math.random() * 200 + 100);
    }


    function clickButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            console.log(`Button clicked`);
            button.click()
        } else {
            console.log("Button not found!");
        }
    }

  function checkAndClickButton() {
    var inputElement = document.querySelector('.target-input-field');

    // Check if the input element has display: none;
    if (inputElement.style.display === 'none') {
        console.log('The input element has display: none;');

        // Run the script to click the attack button
        setTimeout(() => {
            const attackButton = document.getElementById("target_attack");
            if (attackButton) {
                attackButton.click();
                console.log("Clicked target_attack button.");
            } else {
                console.log("Button with ID 'target_attack' not found.");
            }
        }, 300 + Math.random() * 200);
    } else {
        // If display is not none, wait for it
        console.log('Input element does not have display: none; Waiting...');
        setTimeout(checkAndClickButton, 50); // Check again after 500ms
    }
  }


})();




