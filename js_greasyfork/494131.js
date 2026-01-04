// ==UserScript==
// @name         Disable Censorship
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disable censorship on a webpage
// @author       Script Genius
// @match        *://character.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494131/Disable%20Censorship.user.js
// @updateURL https://update.greasyfork.org/scripts/494131/Disable%20Censorship.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Remove censorship elements
  function removeCensorship() {
    const censorshipElements = document.querySelectorAll('.censored');
    censorshipElements.forEach(function(element) {
      element.style.display = 'none';
    });
  }

  // Run the script on page load
  window.addEventListener('load', function() {
    removeCensorship();
  });

  // Run the script on DOM mutation
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        removeCensorship();
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();