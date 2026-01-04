// ==UserScript==
// @name         Tab Name Changer
// @version      0.0.2
// @description  Lets you change the tab title for the current page
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @namespace   random-uuid:c58b8350-b784-4996-bc18-9927cebe4862
// @license none
// @downloadURL https://update.greasyfork.org/scripts/499074/Tab%20Name%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/499074/Tab%20Name%20Changer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Function to change the tab title and save it to local storage
  function changeTabTitle(newTitle) {
    document.title = newTitle;
    localStorage.setItem(window.location.href, newTitle);
  }

  // Function to clear the tab title from local storage
  function clearTabTitle() {
    localStorage.removeItem(window.location.href);
    document.title = '';
  }

// Function to load the tab title from local storage with delay
  function loadTabTitle() {
    setTimeout(function() {
      const savedTitle = localStorage.getItem(window.location.href);
      if (savedTitle) {
        document.title = savedTitle;
      }
    }, 1000); // 2000 milliseconds delay
  }

  // Create menu button in Tampermonkey menu for changing the tab title
  GM_registerMenuCommand("Tab Name Changer", function() {
    const newTitle = prompt("Enter the new tab title:");
    if (newTitle) {
      changeTabTitle(newTitle);
    }
  });

  // Create menu button in Tampermonkey menu for clearing the tab title
  GM_registerMenuCommand("Clear Tab Title", function() {
    clearTabTitle();
  });

  // Load the tab title when the page loads
  loadTabTitle();
})();
