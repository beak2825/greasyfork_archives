// ==UserScript==
// @name         ShellShock.io Complete Custom Theme
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Custom theme for ShellShock.io with skybox and blood-red scopes
// @author       tarry
// @license      MIT
// @include      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shellshock.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534064/ShellShockio%20Complete%20Custom%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/534064/ShellShockio%20Complete%20Custom%20Theme.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // URL of the custom background image
  const backgroundImageURL = 'https://i.postimg.cc/hQnSDb4Z/obito-uchiha-background.jpg';

  // Function to apply custom styles
  function applyCustomStyles() {
    console.log("Applying custom styles...");

    // Create a style element
    const style = document.createElement('style');
    style.innerHTML = `
      /* Custom skybox for inventory and loading screens */
      .inventory-container, .loading-container {
        background: url('${backgroundImageURL}') no-repeat center center fixed !important;
        background-size: cover !important;
      }

      /* Blood-red scopes for Free Ranger, RPEGG, and Crackshot */
      .free-ranger-scope, .rpegg-scope, .crackshot-scope {
        background-color: rgba(255, 0, 0, 0.8) !important; /* Blood red */
        border: 2px solid rgba(139, 0, 0, 0.8) !important; /* Darker red border */
        mix-blend-mode: multiply; /* Blend for a more intense red */
      }
    `;
    // Append the style to the document head
    document.head.appendChild(style);
  }

  // Function to observe DOM changes
  function observeDOMChanges() {
    console.log("Setting up MutationObserver...");

    // Select the target node for observing changes in the DOM
    const targetNode = document.body;

    // Create a MutationObserver to watch for changes
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // Apply custom styles when new nodes are added
          applyCustomStyles();
        }
      }
    });

    // Configuration options for the observer
    const config = {
      childList: true, // Watch for added/removed child nodes
      subtree: true,   // Watch entire subtree
    };

    // Start observing the target node
    observer.observe(targetNode, config);

    console.log("MutationObserver is now active.");
  }

  // Ensure the page has loaded before setting up the observer
  window.addEventListener('load', function () {
    console.log("Page loaded. Initializing...");
    applyCustomStyles(); // Apply styles immediately
    observeDOMChanges(); // Set up DOM observer
  });
})();