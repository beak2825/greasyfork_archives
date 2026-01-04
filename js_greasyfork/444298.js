// ==UserScript==
// @name         YouTube don't stop
// @namespace    https://www.hicparaverme.com
// @version      0.1
// @description  Play limitless videos/music
// @author       amcu11
// @match        http://www.youtube.com/*
// @match        https://www.youtube.com/*
// @match        http://youtube.com/*
// @match        https://youtube.com/*
// @copyright 2020, amcu11 (https://openuserjs.org/users/amcu11)
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444298/YouTube%20don%27t%20stop.user.js
// @updateURL https://update.greasyfork.org/scripts/444298/YouTube%20don%27t%20stop.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var clickCheck = setInterval(function () {
    if (document.querySelectorAll("#confirm-button").length > 0) {
      clearInterval(clickCheck);

      document.querySelector("#confirm-button").click();
    }
  }, 5000);
})();
