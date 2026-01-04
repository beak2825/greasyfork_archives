// ==UserScript==
// @name         Suppress Suggested & Promoted Posts on LinkedIn
// @namespace    https://example.com/
// @version      1.5
// @description  Remove LinkedIn posts labeled as "Suggested" and dynamically observe for new ones
// @author       JH
// @match        https://www.linkedin.com/*
// @include      http://*linkedin.com/*
// @include      https://*linkedin.com/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/522941/Suppress%20Suggested%20%20Promoted%20Posts%20on%20LinkedIn.user.js
// @updateURL https://update.greasyfork.org/scripts/522941/Suppress%20Suggested%20%20Promoted%20Posts%20on%20LinkedIn.meta.js
// ==/UserScript==

(function() {
    'use strict';

  const divTemplate = [
        'div[data-id^="urn:li:activity:"]', // Classic
        'article[data-activity-urn^="urn:li:activity:"]' // iOS Safari
  ];
    
  // Function to hide divs with data-id starting with 'urn:li:activity:' containing spans with 'Promoted' or 'Suggested'
  function hidePromotedPosts() {

      
      divTemplate.forEach(function(template) {
          const divs = document.querySelectorAll(template); 
      
          divs.forEach(div => {
              const spans = div.querySelectorAll('span, p'); // Look for spans within these divs
              spans.forEach(span => {
                  if (span.textContent.trim() === 'Promoted' || span.textContent.trim() === 'Suggested') {
                      div.style.display = 'none'; // Hide the entire div
                  }
              });
          });
      });
  }
  
  // Call the function to hide the promoted and suggested posts
  hidePromotedPosts();
  
  // Run the function when new posts are loaded (using a MutationObserver)
  const observer = new MutationObserver(hidePromotedPosts);
  observer.observe(document.body, { childList: true, subtree: true });

})();