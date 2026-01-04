// ==UserScript==
// @name         LessRainbows
// @namespace    http://tampermonkey.net/
// @version      2024-06-29
// @description  Make Torn have less rainbows
// @author       You
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499249/LessRainbows.user.js
// @updateURL https://update.greasyfork.org/scripts/499249/LessRainbows.meta.js
// ==/UserScript==


(function() {
  'use strict';


  function change_logo() {
    var bodyElement = document.getElementById('body');
    if (bodyElement.getAttribute('data-celebration') === 'pride-day') {
        bodyElement.removeAttribute('data-celebration');
    }
  }

  change_logo();
  document.addEventListener('DOMContentLoaded', function() {
    change_logo();
  });
  setInterval(change_logo, 100);

  // Function to replace image sources
  function replaceImageSources() {
      // Get all image elements
      const images = document.querySelectorAll('img');

      images.forEach(img => {
          // Replace src attribute if it matches the target
          if (img.src.includes('/images/honors/204')) {
              img.src = img.src.replace('/images/honors/204', '/images/honors/716');
          }

          // Replace srcset attribute if it contains the target
          if (img.srcset.includes('/images/honors/204')) {
              img.srcset = img.srcset.replace('/images/honors/204', '/images/honors/716');
          }
      });

  }

  // Run the function once the page has loaded
  window.addEventListener('load', replaceImageSources);

  // Also run the function if the page content is modified (e.g., via AJAX)
  const observer = new MutationObserver(replaceImageSources);
  observer.observe(document.body, { childList: true, subtree: true });
})();

