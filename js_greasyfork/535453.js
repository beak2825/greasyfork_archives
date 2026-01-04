// ==UserScript==
// @name         Enable Youtube Search Middle Click
// @namespace    http://tampermonkey.net/
// @version      2025-05-09
// @description  does what the name on the tin says
// @author       Bones
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535453/Enable%20Youtube%20Search%20Middle%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/535453/Enable%20Youtube%20Search%20Middle%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function setupMiddleClickSearch(buttonElement, searchInputElement) {
  buttonElement.addEventListener('mousedown', function(event) {
    if (event.button === 1) { // Middle click
      event.preventDefault(); // Prevent auto-scroll or other browser behavior

      const query = searchInputElement.value.trim();
      if (query) {
        const url = `/results?search_query=${encodeURIComponent(query)}`;
        window.open(url, '_blank');
      }
    }
  });
}

function setup() {
  var button = document.querySelectorAll("yt-searchbox button[class*=SearchButton")[0];
  var searchBox = document.querySelectorAll("yt-searchbox form input")[0];
  setupMiddleClickSearch(button, searchBox);
}

if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
  // already loaded
  setup();
} else {
  document.addEventListener("DOMContentLoaded", function(event) {
      // finished loading
      setup();
  });
}
})();