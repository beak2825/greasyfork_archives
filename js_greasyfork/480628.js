// ==UserScript==
// @name         Tokopedia no ads
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  to make Tokopedia a fair place for all sellers
// @author       Suwardhana
// @match        https://www.tokopedia.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tokopedia.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480628/Tokopedia%20no%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/480628/Tokopedia%20no%20ads.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Function to remove the parent element
  function removeParent(parent) {
      if (parent) {
          parent.remove();
      }
  }

  // Mutation callback function
  function mutationCallback(mutationsList, observer) {
      for (let mutation of mutationsList) {
          if (mutation.type === 'childList') {
              // Find elements with the identifier
              const elements = document.querySelectorAll('span.css-1sbv0b9');

              elements.forEach(element => {
                  // Traverse up the DOM tree to the 7th level parent
                  let parent = element;
                  for (let i = 0; i < 9; i++) {
                      parent = parent.parentElement;

                      // If there is no parent at the desired level, break the loop
                      if (!parent) {
                          break;
                      }
                  }

                  // Remove the parent element
                  removeParent(parent);
              });
              const elements2 = document.querySelector('div[data-testid="topadsCPMWrapper"]');
              removeParent(elements2);
              const elements3 = document.querySelector('div[data-testid="dSRPTDNSidebar"]');
              removeParent(elements3);
          }
      }
  }

  // Create a new mutation observer
  const observer = new MutationObserver(mutationCallback);

  // Observe the document for changes in the DOM
  observer.observe(document, { childList: true, subtree: true });
})();