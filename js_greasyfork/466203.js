
// ==UserScript==
// @name         Scrollbar Key Ignore
// @namespace    ScrollbarKeyIgnore
// @version      1.1
// @description  Disables scrolling when the arrow keys or spacebar are pressed on the scrollbar.
// @license      MIT
// @match        https://sploop.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466203/Scrollbar%20Key%20Ignore.user.js
// @updateURL https://update.greasyfork.org/scripts/466203/Scrollbar%20Key%20Ignore.meta.js
// ==/UserScript==

(function() {
  'use strict';
  window.addEventListener("keydown", function(event) {
    // Disable scrolling when down arrow, up arrow, or space key is pressed
    if ([32, 38, 40].indexOf(event.keyCode) > -1) {
      event.preventDefault();
    }
  }, false);
})();