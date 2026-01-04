// ==UserScript==
// @name         Fake bot
// @version      1.7
// @include      https://*/game.php*screen=place*
// @namespace https://greasyfork.org/users/1388863
// @description auto send fake
// @downloadURL https://update.greasyfork.org/scripts/518588/Fake%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/518588/Fake%20bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create Start/Stop button
    const startStopButton = document.createElement('button');
    startStopButton.textContent = 'Start';
    startStopButton.style.position = 'fixed';
    startStopButton.style.bottom = '20px';
    startStopButton.style.right = '20px';
    startStopButton.style.padding = '10px 20px';
    startStopButton.style.fontSize = '16px';
    startStopButton.style.backgroundColor = '#4CAF50';
    startStopButton.style.color = 'white';
    startStopButton.style.border = 'none';
    startStopButton.style.borderRadius = '5px';
    startStopButton.style.cursor = 'pointer';
    startStopButton.style.zIndex = '9999';
    document.body.appendChild(startStopButton);

    // Create Loop Count button (for setting the number of loops)
    const loopButton = document.createElement('button');
    loopButton.textContent = 'Set Loops';
    loopButton.style.position = 'fixed';
    loopButton.style.bottom = '20px';
    loopButton.style.right = '120px'; // Adjusted position for spacing
    loopButton.style.padding = '10px 20px';
    loopButton.style.fontSize = '16px';
    loopButton.style.backgroundColor = '#FF9800';
    loopButton.style.color = 'white';
    loopButton.style.border = 'none';
    loopButton.style.borderRadius = '5px';
    loopButton.style.cursor = 'pointer';
    loopButton.style.zIndex = '9999';
    document.body.appendChild(loopButton);

    // Create remaining loop counter display
    const loopCounterDisplay = document.createElement('div');
    loopCounterDisplay.style.position = 'fixed';
    loopCounterDisplay.style.bottom = '70px';
    loopCounterDisplay.style.right = '20px';
    loopCounterDisplay.style.fontSize = '18px';
    loopCounterDisplay.style.color = 'white';
    loopCounterDisplay.style.zIndex = '9999';
    loopCounterDisplay.textContent = 'Remaining Loops: 0';
    document.body.appendChild(loopCounterDisplay);

    // Retrieve the last state from localStorage (Start or Stop)
    let isRunning = localStorage.getItem('botState') === 'running';
    let remainingLoops = parseFloat(localStorage.getItem('remainingLoops'), 10) || 0;
    let loops = parseInt(localStorage.getItem('loops'), 10) || 0;

    // Set initial button and loop counter state based on localStorage
    startStopButton.textContent = isRunning ? 'Stop' : 'Start';
    loopCounterDisplay.textContent = `Remaining Loops: ${remainingLoops}`;

    // If bot is running, start it automatically when the page loads
    if (isRunning) {
        startBot();
    }

    // Function to toggle the script on/off
    startStopButton.addEventListener('click', () => {
        if (isRunning) {
            stopBot();
        } else {
            startBot();
        }
    });

    // Loop button click event to set the number of loops
    loopButton.addEventListener('click', () => {
        const loopsInput = parseInt(prompt("Enter the number of loops to run:", remainingLoops), 10);
        if (!isNaN(loopsInput) && loopsInput > 0) {
            remainingLoops = loopsInput; // Double the entered loops * 2
            // loops = loopsInput;
            localStorage.setItem('remainingLoops', remainingLoops);
            // localStorage.setItem('loops', loops);
            loopCounterDisplay.textContent = `Remaining Loops: ${remainingLoops}`;
            console.log(`Set loops to: ${remainingLoops}`);
        }
    });

    function startBot() {
        // Set the bot as running in localStorage
        isRunning = true;
        localStorage.setItem('botState', 'running');
        startStopButton.textContent = 'Stop';
        console.log("Bot started");

        // Start the loop process
        loopCounterDisplay.textContent = `Remaining Loops: ${remainingLoops}`;
        runBotLoop();
    }

    function stopBot() {
        // Set the bot as stopped in localStorage
        isRunning = false;
        localStorage.setItem('botState', 'stopped');
        startStopButton.textContent = 'Start';
        console.log("Bot stopped");
    }

    function runBotLoop() {
        if (remainingLoops > 0) {
            // Dispatch '0' key event unless URL contains &screen=place&try=confirm
            if (!window.location.href.includes("&screen=place&try=confirm")) {
                setTimeout(() => {
                    // Simulate pressing the '0' key
                    document.dispatchEvent(new KeyboardEvent('keydown', {
                        key: '0', code: 'Digit0', keyCode: 48, which: 48, bubbles: true
                    }));
                    console.log("Key '0' pressed.");

                    // Wait 500ms - 1 second, then click the 'target_attack' element
                    setTimeout(() => {
                        const attackButton = document.getElementById("target_attack");
                        if (attackButton) {
                            attackButton.click();
                            console.log("Clicked target_attack button.");
                        } else {
                            console.log("Button with ID 'target_attack' not found.");
                        }
                    }, 2000 + Math.random() * 1000); // Random delay between 500-1000ms
                }, 500 + Math.random() * 1000); // Random delay between 100-250ms
            }

            // Handle URL-specific actions
            setTimeout(() => {
                const url = window.location.href;
                if (url.includes("&screen=place&try=confirm")) {
                    console.log("Detected &screen=place&try=confirm");
                    setTimeout(() => clickButton('#troop_confirm_submit', Math.random() * 300 + 500), 100);
                    remainingLoops -= 1;
                    loops -= 1;
                    localStorage.setItem('remainingLoops', remainingLoops);
                    localStorage.setItem('loops', loops);
                    loopCounterDisplay.textContent = `Remaining Loops: ${remainingLoops.toFixed(1)}`;
                    console.log("Sent confirmation");
                } else {
                    console.log("No matching URL condition");
                    checkTroopCount(() => {
                        console.log("Troop count sufficient. Proceeding...");
                        clickButton('#target_attack', Math.random() * 500 + 800);
                    });
                }

                // Continue the loop if there are remaining loops
                if (remainingLoops > 0) {
                    runBotLoop();
                } else {
                    stopBot(); // Stop the bot if no loops are left
                }
            }, 1000 + Math.random() * 1000);
        }
    }

    // Function to check troop count
    function checkTroopCount(callback) {
        setTimeout(() => {
            const RAM = document.getElementById('unit_input_ram');
            if (RAM && parseInt(RAM.value, 10) > 0) {
                callback();
            } else {
                setTimeout(() => checkTroopCount(callback), 200);
            }
        }, 100 + Math.random() * 100);
    }

    // Function to click a button after a delay
    function clickButton(selector, delay) {
        const button = document.querySelector(selector);
        if (button) {
            setTimeout(() => button.click(), delay);
            console.log(`Button clicked after ${delay}ms`);
        } else {
            console.log("Button not found!");
        }
    }

})();
