// ==UserScript==
// @name        LazyAutoScrollerJS
// @namespace   https://github.com/Grrraou/lazyAutoScrollerJS
// @match        https://9gag.com/*
// @license MIT
// @grant       none
// @version     1.0
// @author      -
// @description 06/06/2023 00:48:42
// @downloadURL https://update.greasyfork.org/scripts/468010/LazyAutoScrollerJS.user.js
// @updateURL https://update.greasyfork.org/scripts/468010/LazyAutoScrollerJS.meta.js
// ==/UserScript==
// Create the start and stop buttons
const autoscrollButton = document.createElement('button');
autoscrollButton.innerHTML = '&#9658;'; // Play icon
autoscrollButton.style.position = 'fixed';
autoscrollButton.style.bottom = '20px';
autoscrollButton.style.right = '20px';
autoscrollButton.style.width = '30px';
autoscrollButton.style.height = '30px';
autoscrollButton.style.backgroundColor = 'green';
autoscrollButton.style.borderRadius = '50%';
autoscrollButton.style.display = 'flex';
autoscrollButton.style.justifyContent = 'center';
autoscrollButton.style.alignItems = 'center';
autoscrollButton.style.fontSize = '14px';
autoscrollButton.style.color = 'white';
autoscrollButton.style.cursor = 'pointer';

// Create the speed control slider
const speedSlider = document.createElement('input');
speedSlider.type = 'range';
speedSlider.min = '1';
speedSlider.max = '10';
speedSlider.value = '5';
speedSlider.style.width = '200px';
speedSlider.style.position = 'fixed';
speedSlider.style.bottom = '70px';
speedSlider.style.right = '20px';

// Select the element to be scrolled
const elementToScroll = document.documentElement; // Change this to the desired element

// Set the initial scroll speed and interval in milliseconds
let scrollSpeed = parseInt(speedSlider.value);
const scrollInterval = 10; // Adjust this value to change the scroll interval

let isScrolling = false;
let scrollIntervalId;

// Function to start or stop autoscrolling
function toggleAutoscroll() {
  if (isScrolling) {
    clearInterval(scrollIntervalId);
    autoscrollButton.style.backgroundColor = 'green';
    autoscrollButton.innerHTML = '&#9658;'; // Play icon
  } else {
    scrollSpeed = parseInt(speedSlider.value);
    scrollIntervalId = setInterval(autoscroll, scrollInterval);
    autoscrollButton.style.backgroundColor = 'red';
    autoscrollButton.innerHTML = '&#9724;'; // Stop icon
  }
  isScrolling = !isScrolling;
}

// Function to scroll the element
function autoscroll() {
  elementToScroll.scrollBy(0, scrollSpeed); // Scrolls vertically, adjust the X and Y values for horizontal scrolling
}

// Add click event listener to the autoscroll button
autoscrollButton.addEventListener('click', toggleAutoscroll);

// Append the autoscroll button and speed control slider to the document body
document.body.appendChild(autoscrollButton);
document.body.appendChild(speedSlider);