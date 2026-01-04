// ==UserScript==
// @name         Real Key Press Simulation (Toggle with Q and E)
// @namespace    http://your-unique-namespace.com
// @version      1.0
// @description  Simulates pressing keys 0 and 9 repeatedly. Activate with Q and deactivate with E.
// @author       Your Name
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519397/Real%20Key%20Press%20Simulation%20%28Toggle%20with%20Q%20and%20E%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519397/Real%20Key%20Press%20Simulation%20%28Toggle%20with%20Q%20and%20E%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let intervalId; // Holds the interval ID
  let running = false; // Tracks whether the script is running

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

  // Function to start the key press simulation
  function startRepeating() {
    if (!running) {
      running = true;
      console.log('Simulation started');
      intervalId = setInterval(() => {
        simulateKeyPress('0'); // Simulate pressing "0"
        setTimeout(() => {
          simulateKeyPress('9'); // Simulate pressing "9"
        }, 2890); // Wait 2.89 seconds before pressing "9"
      }, 5780); // Repeat every 5.78 seconds
    }
  }

  // Function to stop the key press simulation
  function stopRepeating() {
    if (running) {
      clearInterval(intervalId);
      running = false;
      console.log('Simulation stopped');
    }
  }

  // Event listener for key presses
  document.addEventListener('keydown', (event) => {
    if (event.key === 'q' || event.key === 'Q') {
      startRepeating(); // Start simulation on pressing Q
    } else if (event.key === 'e' || event.key === 'E') {
      stopRepeating(); // Stop simulation on pressing E
    }
  });
})();
