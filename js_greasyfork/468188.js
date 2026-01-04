// ==UserScript==
// @name         btn joy
// @namespace    namespace
// @version      0.7
// @description  move btn
// @author       mingho
// @match        https://www.torn.com/loader.php*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468188/btn%20joy.user.js
// @updateURL https://update.greasyfork.org/scripts/468188/btn%20joy.meta.js
// ==/UserScript==

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Select the buttons
  var middleButton = document.querySelector(".torn-btn");
  var leftButton = document.querySelector("img.rarity-item");

  // Get the position of the left button
  var leftButtonPosition = leftButton.offsetLeft;
  
  // Set parent container's position to relative or absolute
  leftButton.parentNode.style.position = "relative";

  // Calculate the desired offset
  var offset = 20; // Adjust this value as needed

  // Calculate the new position for the middle button
  var newPosition = leftButtonPosition + leftButton.offsetWidth + offset;

  // Set the new position for the middle button
  middleButton.style.position = "relative";
  middleButton.style.left = newPosition + "px";

  // Create a new element
  var testElement = document.createElement("div");
  testElement.textContent = "test";
  testElement.style.position = "absolute";
  testElement.style.top = "0";
  testElement.style.left = "0";
  
  // Style the test element
  testElement.style.backgroundColor = "yellow";
  testElement.style.padding = "5px";
  testElement.style.color = "black";
  testElement.style.zIndex = "999"; // Set a higher z-index value

  // Insert the test element into the DOM
  leftButton.parentNode.appendChild(testElement);
});
