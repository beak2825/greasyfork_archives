// ==UserScript==
// @name         ZDF Player With Keyboard
// @namespace    ZDF
// @version      0.3
// @description  Press cursor to skip some seconds back and forth, f fullscreen, p play
// @match        https://www.zdf.de/show/*
// @match        https://www.zdf.de/comedy/*
// @match        https://www.zdf.de/gesellschaft/*
// @match        https://www.zdf.de/play/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460318/ZDF%20Player%20With%20Keyboard.user.js
// @updateURL https://update.greasyfork.org/scripts/460318/ZDF%20Player%20With%20Keyboard.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var toggleFullScreen = 0;
  var togglePlay = 0;

  window.addEventListener('keydown', function(e) {

    var buttonElement;

    if (e.key === 'ArrowLeft') {
      buttonElement = document.querySelector("button[aria-label='10s rückwärts']");
      // console.log("key <- was pressed " + buttonElement);
      buttonElement.click();
    } else if (e.key === 'ArrowRight') {
      buttonElement = document.querySelector("button[aria-label='10s vorwärts']");
      // console.log("key -> was pressed " + buttonElement);
      buttonElement.click();
    } else if (e.key === 'f') {
      buttonElement = document.querySelector("button.button-fullscreen");
      if (toggleFullScreen == 0) {
        toggleFullScreen = 1;
      } else {
        toggleFullScreen = 0;
        buttonElement = document.querySelector("button.button-fullscreen-exit");
      }
      buttonElement.click();
    } else if (e.key === 'p') {
      buttonElement = document.querySelector("button[aria-label='Abspielen']");
      if (togglePlay == 0) {
        togglePlay = 1;
      } else {
        togglePlay = 0;
        buttonElement = document.querySelector("button[aria-label='Anhalten']");
      }
      buttonElement.click();
    }

  });

})();
