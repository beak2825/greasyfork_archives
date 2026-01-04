// ==UserScript==
// @name         esp-insec-tablette
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description test
// @license MIT
// @author       Enzo Doyen
// @match        https://crowdin.com/*
// @match        https://valve.crowdin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456538/esp-insec-tablette.user.js
// @updateURL https://update.greasyfork.org/scripts/456538/esp-insec-tablette.meta.js
// ==/UserScript==
(function() {
    'use strict';

// Listen for keydown events on the page
document.addEventListener("keydown", function(event) {
  // Check if the Ctrl and Space keys are pressed
  if (event.ctrlKey && event.keyCode === 32) {
    var input = document.activeElement;
    // Check if the element is a text input or textarea
    if (input && (input.tagName === "INPUT" && input.type === "text" || input.tagName === "TEXTAREA")) {
      // Insert the non-breaking space character at the current cursor position
      var start = input.selectionStart;
      var end = input.selectionEnd;
      input.value = input.value.substring(0, start) + "\u00A0" + input.value.substring(end);
      input.selectionStart = start + 1;
      input.selectionEnd = start + 1;
    }
  }
});

})();