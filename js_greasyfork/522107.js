// ==UserScript==
// @name         Sync Mouse Clicks and Scroll Across Tabs
// @namespace    Hojoborolo
// @version      1.0
// @description  Record mouse clicks and scroll events in one tab and simulate them in other tabs on the same website, with infinite loop prevention
// @author       CONV1KT | webdevz.sk@gmail.com | https://github.com/webdevsk
// @match        https://www.coinbase.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522107/Sync%20Mouse%20Clicks%20and%20Scroll%20Across%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/522107/Sync%20Mouse%20Clicks%20and%20Scroll%20Across%20Tabs.meta.js
// ==/UserScript==

// Create a BroadcastChannel for communication
const channel = new BroadcastChannel('tab_sync_channel');

// Flag to identify simulated clicks
const SIMULATED_CLICK_FLAG = '__isSimulated';

// Function to broadcast mouse clicks
function broadcastClick(event) {
  console.log("CLicked at: ", Date.now())
  // Ignore simulated clicks
  if (event[SIMULATED_CLICK_FLAG]) return;

  const clickData = {
    type: 'mouseClick',
    x: event.clientX,
    y: event.clientY,
    // timestamp: Date.now(),
  };
  channel.postMessage(clickData); // Send data to all connected tabs
}

// Function to broadcast scroll events
function broadcastScroll() {
  const scrollData = {
    type: 'scroll',
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    // timestamp: Date.now(),
  };
  channel.postMessage(scrollData); // Send scroll position to all connected tabs
}

// Function to simulate mouse clicks
function simulateClick(clickData) {
  const targetElement = document.elementFromPoint(clickData.x, clickData.y);
  if (targetElement) {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: clickData.x,
      clientY: clickData.y,
    });
    // Mark this event as simulated
    Object.defineProperty(clickEvent, SIMULATED_CLICK_FLAG, {
      value: true,
    });
    targetElement.dispatchEvent(clickEvent);
  }
}

// Function to simulate scroll
function simulateScroll(scrollData) {
  window.scrollTo(scrollData.scrollX, scrollData.scrollY);
}

// Listen for mouse clicks in the current tab
document.addEventListener('click', broadcastClick);

// Listen for scroll events in the current tab
window.addEventListener('scroll', () => {
  broadcastScroll();
});

// Listen for messages from other tabs
channel.onmessage = (event) => {
  const data = event.data;
  if (data.type === 'mouseClick') {
    simulateClick(data);
  } else if (data.type === 'scroll') {
    simulateScroll(data);
  }
};
