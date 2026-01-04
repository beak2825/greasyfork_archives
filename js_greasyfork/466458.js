// ==UserScript==
// @name Auto Read for getepic.com
// @namespace 
// @version 1.0
// @description Automatically clicks the right arrow key every minute on getepic.com with a GUI indicator.
// @match https://www.getepic.com/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466458/Auto%20Read%20for%20getepiccom.user.js
// @updateURL https://update.greasyfork.org/scripts/466458/Auto%20Read%20for%20getepiccom.meta.js
// ==/UserScript==

let intervalId;
let autoReadEnabled = false;

// Create GUI elements
const guiContainer = document.createElement('div');
guiContainer.style.position = 'fixed';
guiContainer.style.top = '20px';
guiContainer.style.right = '20px';
guiContainer.style.padding = '10px';
guiContainer.style.background = 'rgba(0, 0, 0, 0.7)';
guiContainer.style.color = '#fff';
guiContainer.style.fontFamily = 'Arial, sans-serif';
guiContainer.style.fontSize = '14px';
guiContainer.style.borderRadius = '5px';
guiContainer.style.zIndex = '9999';

const statusText = document.createElement('span');
statusText.textContent = 'Auto Read: OFF';
guiContainer.appendChild(statusText);

document.body.appendChild(guiContainer);

// Function to simulate a key press
function simulateKeyPress(key) {
  const event = new KeyboardEvent('keydown', { key });
  document.dispatchEvent(event);
}

// Function to toggle auto read on and off
function toggleAutoRead() {
  autoReadEnabled = !autoReadEnabled;

  if (autoReadEnabled) {
    console.log('Auto Read: ON');
    intervalId = setInterval(() => {
      simulateKeyPress('ArrowRight');
    }, 60000); // 60000 milliseconds = 1 minute
    statusText.textContent = 'Auto Read: ON';
  } else {
    console.log('Auto Read: OFF');
    clearInterval(intervalId);
    statusText.textContent = 'Auto Read: OFF';
  }
}

// Event listener for the keybind "K"
document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'k') {
    toggleAutoRead();
  }
});
