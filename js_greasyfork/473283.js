// ==UserScript==
// @name         Disable reddit keyboard shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Disables keyboard shortcuts on reddit
// @author       You
// @match        https://www.reddit.com/*
// @match        https://new.reddit.com/*
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/473283/Disable%20reddit%20keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/473283/Disable%20reddit%20keyboard%20shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to override keyboard event listeners
    function overrideKeyboardEvents() {
      function stopEvent(e) {
        e.stopImmediatePropagation();
      }

      window.addEventListener('keydown', stopEvent, true);
      window.addEventListener('keyup', stopEvent, true);
      window.addEventListener('keypress', stopEvent, true);

      document.addEventListener('keydown', stopEvent, true);
      document.addEventListener('keyup', stopEvent, true);
      document.addEventListener('keypress', stopEvent, true);
    }

    // Run the function to override events
    overrideKeyboardEvents();

})();