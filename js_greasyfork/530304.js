// ==UserScript==
// @name         Strava Button Clicker [For Use Convert Ascent and Descent to Feet][ELevate / Sauce Users]
// @namespace    typpi.online
// @version      1.2
// @description  Clicks the button to fetch the Ascent and Descent values in meters for use with the Convert Ascent and Descent to Feet script.
// @author       Nick2bad4u
// @match        https://www.strava.com/activities/*
// @resource     https://www.google.com/s2/favicons?sz=64&domain=strava.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=strava.com
// @icon64       https://www.google.com/s2/favicons?sz=64&domain=strava.com
// @grant        none
// @run-at       document-end
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @supportURL   https://github.com/Nick2bad4u/UserStyles/issues
// @license      Unlicense
// @note         This is for use with: https://update.greasyfork.org/scripts/520655/Convert%20Ascent%20and%20Descent%20to%20Feet.user.js
// @downloadURL https://update.greasyfork.org/scripts/530304/Strava%20Button%20Clicker%20%5BFor%20Use%20Convert%20Ascent%20and%20Descent%20to%20Feet%5D%5BELevate%20%20Sauce%20Users%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/530304/Strava%20Button%20Clicker%20%5BFor%20Use%20Convert%20Ascent%20and%20Descent%20to%20Feet%5D%5BELevate%20%20Sauce%20Users%5D.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Run 5 seconds after the page finishes loading
  setTimeout(() => {
    // Select the button by its ID
    let button = document.querySelector('#extendedStatsButton');
    if (button) {
      button.click();
      console.log('Button clicked.');

      // Close the popup after 3 seconds using the Escape key
      setTimeout(() => {
        let event = new KeyboardEvent('keydown', {
          key: 'Escape',
          code: 'Escape',
          keyCode: 27,
          which: 27,
          bubbles: true,
        });
        document.dispatchEvent(event);
        console.log('Popup closed.');
      }, 3000);
    } else {
      console.error('Button not found. Please ensure the selector is correct.');
    }
  }, 5000);
})();
