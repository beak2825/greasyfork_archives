// ==UserScript==
// @name          Dark Mode
// @namespace     http://tampermonkey.net/
// @version       1.0
// @description   A userscript to enable dark mode by changing white elements to black and inverting the text color on all websites.
// @match         *://*/*
// @author        kiwv
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/471089/Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/471089/Dark%20Mode.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Keep track of the dark mode state
  let isDarkMode = true;

  // Apply dark mode initially
  applyDarkMode();

  // Function to apply dark mode
  function applyDarkMode() {
    const elements = document.querySelectorAll('*');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];

      // Invert text color
      const color = window.getComputedStyle(element).color;
      const backgroundColor = window.getComputedStyle(element).backgroundColor;

      if (isDarkMode) {
        // Invert text color and change white elements to black
        if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
          element.style.color = invertColor(color);
        }
        if (
          backgroundColor === 'rgb(255, 255, 255)' ||
          backgroundColor === 'rgba(255, 255, 255, 0)'
        ) {
          element.style.backgroundColor = '#000';
        }
      }
    }

    // Toggle the document body background color
    document.body.style.backgroundColor = isDarkMode ? '#000' : '';
  }

  // Helper function to invert color
  function invertColor(color) {
    const hexColor = colorToHex(color);
    const invertedHexColor = (Number(`0x1${hexColor}`) ^ 0xffffff)
      .toString(16)
      .substr(1);
    return `#${invertedHexColor}`;
  }

  // Helper function to convert color to hex format
  function colorToHex(color) {
    const rgb = color.match(/\d+/g);
    return (
      ((1 << 24) | (rgb[0] << 16) | (rgb[1] << 8) | Number(rgb[2]))
        .toString(16)
        .slice(1)
    );
  }
})();