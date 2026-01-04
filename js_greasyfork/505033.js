// ==UserScript==
// @name         A Universal Dark Theme
// @description  Universal Dark Mode to fix flashbang sites like fitgirl repacks or wikipedia
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @version      2.0
// @author       TallTacoTristan
// @license MIT
// @namespace https://greasyfork.org/users/1253611
// @downloadURL https://update.greasyfork.org/scripts/505033/A%20Universal%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/505033/A%20Universal%20Dark%20Theme.meta.js
// ==/UserScript==
  function applyDarkTheme() {
    var style = document.createElement('style');
    style.innerHTML = `
      body, p, span, div, a, h1, h2, h3, h4, h5, h6, li, td:not(video) {
        color: #008080!important;
      }
      body, p, span, div, a, h1, h2, h3, h4, h5, h6, li, td[style*='background-image'] {
        background-color: #000000!important;
        background-image: none!important;
      }
      input[type='text'], input[type='password'], textarea, select {
        background-color: #D8BFD8!important;
        position: relative;
        z-index: 9999;
      }
      /* Add this rule to change non-interactable elements to black */
      body *:not(input[type='text']):not(input[type='password']):not(textarea):not(select) {
        background-color: #000000!important;
        color: #008080!important;
      }
    `;
    document.head.appendChild(style);
  }

  // Check if the current hostname is excluded
  if (!(localStorage.getItem("excluded") === window.location.hostname)) {
    applyDarkTheme();
  }

  // Create your button element
  var includeButton = document.createElement('button');
  includeButton.innerHTML = 'Include';

  var excludeButton = document.createElement('button');
  excludeButton.innerHTML = 'Exclude';

  // Append the buttons to the body of the page
  var buttonContainer = document.createElement('div');
  buttonContainer.style.position = 'fixed';
  buttonContainer.style.top = '10px';
  buttonContainer.style.right = '10px';
  buttonContainer.style.zIndex = '9999';
  buttonContainer.appendChild(includeButton);
  buttonContainer.appendChild(excludeButton);
  document.body.appendChild(buttonContainer);

  // Add functionality to the buttons
  includeButton.addEventListener('click', function() {
    localStorage.removeItem("excluded", window.location.hostname); //make sure this matches
    location.reload();
  });

  excludeButton.addEventListener('click', function() {
    localStorage.setItem("excluded", window.location.hostname); // Change "excluded" to something else if multiple userscripts use this code
    location.reload();
  });

  // Check the localStorage for the user's preference
  var showButtons = GM_getValue('showButtons', true);
  buttonContainer.style.display = showButtons? 'block' : 'none';

  // Register the GM menu commands
  GM_registerMenuCommand("Hide Buttons", function() {
    buttonContainer.style.display = 'none';
    GM_setValue('showButtons', false);
  }, 'h');

  GM_registerMenuCommand("Show Buttons", function() {
    buttonContainer.style.display = 'block';
    GM_setValue('showButtons', true);
  },'s');

  GM_registerMenuCommand("Include Current Site", function() {
    localStorage.removeItem("excluded", window.location.hostname);
    applyDarkTheme();
  });

  GM_registerMenuCommand("Exclude Current Site", function() {
    localStorage.setItem("excluded", window.location.hostname); // Change "excluded" to something else if multiple userscripts use this code
    location.reload();
  });