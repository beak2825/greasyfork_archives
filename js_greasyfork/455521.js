// ==UserScript==
// @name         ArrowKey Page Navigation for Asura Websites
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  navigate left and right previous page and next page
// @author       icycoldveins
// @match        *://*.asura.gg/*
// @match        *://*.asura.nacm.xyz/*
// @match        *://*.asuracomics.com/*
// @match        *://*.asuratoon.com/*
// @match        *://*.asuracomic.net/*




// @license      MIT
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455521/ArrowKey%20Page%20Navigation%20for%20Asura%20Websites.user.js
// @updateURL https://update.greasyfork.org/scripts/455521/ArrowKey%20Page%20Navigation%20for%20Asura%20Websites.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  // ch-next-btn
  // ch-prev-btn
  //next page-numbers
  //prev page-numbers

  // navigate using arrow left key and arrow right key
  document.addEventListener("keydown", function (event) {
    if (event.key == "ArrowLeft") {
        // if class ch-prev-btn exists, click it else click prev page-numbers
        if (document.getElementsByClassName("ch-prev-btn")[0]) {
            document.getElementsByClassName("ch-prev-btn")[0].click();
        }
        else {
            document.getElementsByClassName("prev page-numbers")[0].click();
        }
    }
    if (event.key == "ArrowRight") {
        // if class ch-next-btn exists, click it else click next page-numbers
        if (document.getElementsByClassName("ch-next-btn")[0]) {
            document.getElementsByClassName("ch-next-btn")[0].click();
        }
        else {
            document.getElementsByClassName("next page-numbers")[0].click();
        }
    }
    });
})();
