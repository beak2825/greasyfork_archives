// ==UserScript==
// @name        Revivable Hosital Patients - torn.com
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/hospitalview.php
// @grant       none
// @version     1.1
// @author      SendBeesToMars
// @description 6/23/2022, 6:42:59 PM
// @downloadURL https://update.greasyfork.org/scripts/446940/Revivable%20Hosital%20Patients%20-%20torncom.user.js
// @updateURL https://update.greasyfork.org/scripts/446940/Revivable%20Hosital%20Patients%20-%20torncom.meta.js
// ==/UserScript==

// removes unrevivable users in hospital

(function() {
  `use strict`;

  // Select the node that will be observed for mutations
  const targetNode = document.getElementsByClassName('user-info-list-wrap')[0];

  // Options for the observer (which mutations to observe)
  const config = { childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = function(mutationList, observer) {
      // Use traditional 'for loops' for IE 11
      for(const mutation of mutationList) {
          if (mutation.type === 'childList') {
            let reviveNA = document.getElementsByClassName("reviveNotAvailable");
            if(reviveNA.length){
              for(user of reviveNA){
                // hide parent node of unrevivable user
                user.parentNode.style.display = 'none';
              }
            }
          }
      }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

})();