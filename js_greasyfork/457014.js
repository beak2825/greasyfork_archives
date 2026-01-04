// ==UserScript==
// @name         Arrow Key Navigation Manga Hub
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Made for manga hub, use the left and right arrow keys to navitage between chapters
// @author       Zelanious
// @match        *://*.mangahub.io/*
// @license      WTFPL
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457014/Arrow%20Key%20Navigation%20Manga%20Hub.user.js
// @updateURL https://update.greasyfork.org/scripts/457014/Arrow%20Key%20Navigation%20Manga%20Hub.meta.js
// ==/UserScript==

(function () {
  "use strict";
  document.addEventListener("keydown", function (event) {

    if (event.key == "ArrowLeft") {
      console.log('left');
      document.getElementsByClassName("previous")[0].childNodes[0].click()
    }

    else if (event.key == "ArrowRight") {
      console.log('right');
      document.getElementsByClassName("next")[0].childNodes[0].click()
    }
  });
})();
