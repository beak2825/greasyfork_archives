// ==UserScript==
// @name         Infinite Craft Element Cheat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add "Elements" just in a press of K!
// @author       You
// @match        https://neal.fun/infinite-craft/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529742/Infinite%20Craft%20Element%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/529742/Infinite%20Craft%20Element%20Cheat.meta.js
// ==/UserScript==

// Function to add element to storage
function addElementToStorage(text, emoji) {
  // Get the existing data from localStorage
  const storedData = localStorage.getItem('infinite-craft-data');

  // Parse the JSON data
  const data = storedData ? JSON.parse(storedData) : { elements: [] };

  // Create a new element
  const newElement = {
    "text": text,
    "emoji": emoji,
    "discovered": false
  };

  // Add the new element to the elements array
  data.elements.push(newElement);

  // Stringify the updated data and save it back to localStorage
  localStorage.setItem('infinite-craft-data', JSON.stringify(data));
};

// Function to get input from user using prompt
function getInputFromUser() {
  // Get name from user
  const name = prompt('Name?');

  // Get emoji from user
  const emoji = prompt('Emoji?');

  // Add element to storage
  addElementToStorage(name, emoji);

  // Ask user if they want to restart the page
  const restart = prompt('Would you like to restart the page? It will apply changes. (Y/N)');

  // If user chooses to restart, reload the page
  if (restart.toLowerCase() === 'y') {
    location.reload();
  }
};

// Add event listener to execute function when key is pressed
document.addEventListener('keydown', function(event) {
  if (event.key === 'k' || event.key === 'K') {
    getInputFromUser();
  }
});