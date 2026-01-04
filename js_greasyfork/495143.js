// ==UserScript==
// @name         Prevent Automatic Logout
// @namespace    http://tampermonkey.net/
// @version      2024-05-16
// @description  No logout
// @author       You
// @match        https://web.budgetbakers.com/dashboard
// @icon         https://www.google.com/s2/favicons?sz=64&domain=budgetbakers.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495143/Prevent%20Automatic%20Logout.user.js
// @updateURL https://update.greasyfork.org/scripts/495143/Prevent%20Automatic%20Logout.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Attempt to find and override the logout interval/function directly
  // This part is speculative and needs adjustment based on the actual implementation
  const originalSetInterval = window.setInterval;
  window.setInterval = function(callback, interval) {
      // Check if this interval is likely the logout timer based on its interval
      if (interval === 3000) {
          console.log('Intercepted logout timer');
          // Do not set this interval
          return -1;
      }
      // For all other intervals, behave as normal
      return originalSetInterval(callback, interval);
  };

  // Use a MutationObserver to detect when the logout dialog is added to the DOM and click the cancel button
  const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
              // Assuming the cancel button can be uniquely identified by its text content
              // This needs to be adjusted based on the actual implementation
              if (node.textContent.includes('Cancel Logout Text Here')) {
                  node.click();
              }
          });
      });
  });

  // Start observing the body for added nodes
  observer.observe(document.body, { childList: true, subtree: true });

  console.log('Automatic logout prevention script initialized');
})();