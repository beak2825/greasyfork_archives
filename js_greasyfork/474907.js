// ==UserScript==
// @name         Bypass reddit nsfw click
// @namespace    reddit
// @version      1.0
// @description  Click on blurred nodes on Reddit
// @match        https://www.reddit.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474907/Bypass%20reddit%20nsfw%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/474907/Bypass%20reddit%20nsfw%20click.meta.js
// ==/UserScript==

// Select the element to observe
var element = document.querySelector("body > shreddit-app > div > main > div:nth-child(5)");

// Define the function to run on change
var onChange = function(mutations) {
  var nodes = document.querySelectorAll("shreddit-blurred-container");
  nodes.forEach(function(node) {
        node.shadowRoot.querySelector("div").click();
      });
};

// Create a new observer instance
var observer = new MutationObserver(onChange);

// Set the options for the observer
var options = {
  attributes: true, // Observe attributes changes
  childList: true, // Observe child elements changes
  subtree: true // Observe descendants changes
};

// Start observing the element
observer.observe(element, options);


