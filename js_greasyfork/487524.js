// ==UserScript==
// @name         Inactive player smaller points display for Autodarts
// @version      0.4.1
// @description  decreases font-size for score of non-active players and only leaves the currently active player with a big score display to reduce overall needed vertical space in the points row
// @author       dotty-dev
// @license      MIT
// @match        *://*.autodarts.io/*
// @match        *://autodarts.io/*
// @namespace    https://greasyfork.org/en/users/913506-dotty-dev
// @downloadURL https://update.greasyfork.org/scripts/487524/Inactive%20player%20smaller%20points%20display%20for%20Autodarts.user.js
// @updateURL https://update.greasyfork.org/scripts/487524/Inactive%20player%20smaller%20points%20display%20for%20Autodarts.meta.js
// ==/UserScript==
/*jshint esversion: 11 */

(function () {
  "use strict";

  document.head.insertAdjacentHTML(
    "beforeend",
    `
        <style>
            .ad-ext-player:not(.ad-ext-player-active) .ad-ext-player-score{
              font-size: 4rem;
            }
        </style>
        `
  );
})();
