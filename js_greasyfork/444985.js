// ==UserScript==
// @name         Auto Scroll disable
// @description  Disables middle mouse button auto scroll
// @match        https://app.roll20.net/editor/*
// @grant        none
// @version      0.1
// @namespace    https://greasyfork.org/users/823025
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444985/Auto%20Scroll%20disable.user.js
// @updateURL https://update.greasyfork.org/scripts/444985/Auto%20Scroll%20disable.meta.js
// ==/UserScript==

(function() {
    'use strict';

  document.addEventListener("mousedown", function(mouseEvent) {
      if (mouseEvent.button != 1) {

          return;

      }

      mouseEvent.preventDefault();

      mouseEvent.stopPropagation();
  });

})();