// ==UserScript==
// @name         Real Key Press Simulation
// @namespace    http://your-unique-namespace.com
// @version      1.0
// @description  Simulate actual key presses (0 and 9) with a delay of 2.89 seconds each, start/stop with buttons
// @author       Your Name
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519396/Real%20Key%20Press%20Simulation.user.js
// @updateURL https://update.greasyfork.org/scripts/519396/Real%20Key%20Press%20Simulation.meta.js
// ==/UserScript==

(function() {
  let intervalId; // For storing the interval ID to stop the process
  let running = false; // State to track if the process is running

  // Create the start and stop buttons
  const startBtn = document.createElement('button');
  startBtn.innerText = 'Start';
  startBtn.style.position = 'absolute';
  startBtn.style.top = '10px';
  startBtn.style.right = '10px';
  startBtn.style.padding = '10px';
  startBtn.style.backgroundColor = '#4CAF50';
  startBtn.style.color = 'white';
  startBtn.style.border = 'none';
  startBtn.style.cursor = 'pointer';
  document.body.appendChild(startBtn);

  const stopBtn = document.createElement('button');
  stopBtn.innerText = 'Stop';
  stopBtn.style.position = 'absolute';
  stopBtn.style.top = '50px';
  stopBtn.style.right = '10px';
  stopBtn.style.padding = '10px';
  stopBtn.style.backgroundColor = '#f44336';
  stopBtn.style.color = 'white';
  stopBtn.style.border = 'none';
  stopBtn.style.cursor = 'pointer';
  stopBtn.style.display = 'none'; // Initially hidden
  document.body.appendChild(stopBtn);

  // Function to simulate key press
  function simulateKeyPress(key) {
    const event = new KeyboardEvent('keydown', {
      key: key,
      code: `Key${key.toUpperCase()}`,
      keyCode: key.charCodeAt(0),
      which: key.charCodeAt(0),
      bubbles: true,
    });
    document.dispatchEvent(event);
  }

  // Function to start the repeating actions
  function startRepeating() {
    if (!running) {
      running = true;
      intervalId = setInterval(() => {
        simulateKeyPress('0'); // Simulate pressing "0"
        setTimeout(() => {
          simulateKeyPress('9'); // Simulate pressing "9"
        }, 2890); // Wait 2.89 seconds
      }, 5780); // Total interval is 5.78 seconds (2.89s + 2.89s)
      stopBtn.style.display = 'block'; // Show the Stop button when the process starts
    }
  }

  // Function to stop the repeating actions
  function stopRepeating() {
    clearInterval(intervalId);
    running = false;
    stopBtn.style.display = 'none'; // Hide the Stop button when the process stops
  }

  // Add event listener for Start button
  startBtn.addEventListener('click', startRepeating);

  // Add event listener for Stop button
  stopBtn.addEventListener('click', stopRepeating);
})();
