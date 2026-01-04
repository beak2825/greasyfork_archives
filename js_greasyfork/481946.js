// ==UserScript==
// @name         Quora: remove the need to click blurred images to see them clearly
// @namespace    quora-unblur
// @version      1.02
// @description  Remove filters from q-box on Quora to make them clearer - even in endless paging lists
// @author       Scriptonomics
// @match        https://*.quora.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481946/Quora%3A%20remove%20the%20need%20to%20click%20blurred%20images%20to%20see%20them%20clearly.user.js
// @updateURL https://update.greasyfork.org/scripts/481946/Quora%3A%20remove%20the%20need%20to%20click%20blurred%20images%20to%20see%20them%20clearly.meta.js
// ==/UserScript==

(function() {
    'use strict';

  function removeImageFiltersFromElement(element) {
    element.querySelectorAll('div.q-box').forEach(i => i.style.filter = 'none');
  }

  function removeImageFilters() {
    removeImageFiltersFromElement(document); // Remove filters from images on the initial page load

    const observer = new MutationObserver(mutationsList => { // Watch for changes in the page's content (dynamically loaded components)
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node instanceof Element && node.getElementsByTagName) removeImageFiltersFromElement(node);
          }
        }
      }
    });

    observer.observe(document, { childList: true, subtree: true }); // Start observing the root of the document (entire page)
  }

  // Wait for the page to fully load before removing filters
  window.addEventListener('load', removeImageFilters);

})();
