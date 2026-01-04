// ==UserScript==
// @name         Auto Key Press Simulation
// @namespace    http://your-unique-namespace.com
// @version      1.0
// @description  Simulate key presses (0 and 9) with a delay of 2.89 seconds each, start/stop with buttons
// @author       Your Name
// @match        *://*/*  // This matches all URLs, change it to a specific site if needed
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519085/Auto%20Key%20Press%20Simulation.user.js
// @updateURL https://update.greasyfork.org/scripts/519085/Auto%20Key%20Press%20Simulation.meta.js
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

  // Function to simulate key press (in this case, we will just log to the page)
  function simulateAction() {
    // Simulating the "0" press
    const message0 = document.createElement('p');
    message0.innerText = '0 pressed';
    document.body.appendChild(message0);

    // After 2.89 seconds, simulate the "9" press
    setTimeout(() => {
      const message9 = document.createElement('p');
      message9.innerText = '9 pressed';
      document.body.appendChild(message9);
    }, 2890); // Wait for 2.89 seconds
  }

  // Function to start the repeating actions
  function startRepeating() {
    if (!running) {
      running = true;
      intervalId = setInterval(() => {
        simulateAction();
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
