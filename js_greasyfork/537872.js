// ==UserScript==
// @name         GraphQL Playground Timed Autocomplete Hide
// @description  Hides GraphQL Playground autocomplete suggestions after a short delay
// @namespace    @lfernandezcall
// @version      2025-05-31
// @author       Alberto Fernandez
// @match        */graphql
// @icon         https://graphql.org/favicon.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537872/GraphQL%20Playground%20Timed%20Autocomplete%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/537872/GraphQL%20Playground%20Timed%20Autocomplete%20Hide.meta.js
// ==/UserScript==

let hintTimeout; // Global variable to store the timeout ID

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList.contains("CodeMirror-hints") || node.classList.contains("CodeMirror-hint-information")) {
            handleHintBoxVisibility();
          }
        }
      });
    } else if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
      if (mutation.target.classList.contains("CodeMirror-hints") || mutation.target.classList.contains("CodeMirror-hint-information")) {
        if (window.getComputedStyle(mutation.target).display !== 'none') {
          handleHintBoxVisibility();
        }
      }
    }
  });
});

// Function to manage the hint box visibility
function handleHintBoxVisibility() {
  if (hintTimeout) {
    clearTimeout(hintTimeout);
  }

  // Set a new timeout to hide/remove the hints after a delay
  // You can adjust the delay (in milliseconds) here
  const delay = 1500; // 1.5 seconds

  hintTimeout = setTimeout(() => {
    const hintWrappers = document.querySelectorAll(".CodeMirror-hints-wrapper, .CodeMirror-hints, .CodeMirror-hint-information");
    hintWrappers.forEach(element => {
      if (element.style.display !== 'none') {
        element.style.display = 'none';
      }
    });
    hintTimeout = null; // Reset timeout ID after execution
  }, delay);
}

// Start observing the body for child list changes and attribute changes on subtree elements
observer.observe(document.body, {
  subtree: true,
  childList: true,
  attributes: true,
  attributeFilter: ['style'] // Only observe 'style' attribute changes for performance
});

console.log("MutationObserver for GraphQL Playground initialized (timed hide).");