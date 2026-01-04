// ==UserScript==
// @name         Noxx.to New Tab Blocker
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Prevents new tabs from opening on noxx.to
// @author       You
// @match        https://noxx.to/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472131/Noxxto%20New%20Tab%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/472131/Noxxto%20New%20Tab%20Blocker.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Function to block new tabs
  function blockNewTab(event) {
    if (event.target.tagName.toLowerCase() === 'a' && event.target.getAttribute('target') === '_blank') {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  // Add event listener to block new tabs
  window.addEventListener('click', blockNewTab, true);
})();