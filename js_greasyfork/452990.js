// ==UserScript==
// @name        In Hospital Faction Users - torn.com
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/page.php?sid=UserList&factions=*
// @grant       none
// @version     1.0
// @author      SendBeesToMars
// @description 13/12/2022, 6:42:59 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452990/In%20Hospital%20Faction%20Users%20-%20torncom.user.js
// @updateURL https://update.greasyfork.org/scripts/452990/In%20Hospital%20Faction%20Users%20-%20torncom.meta.js
// ==/UserScript==

// hide non hospitalised faction users

(function() {
  `use strict`;

  // Select the node that will be observed for mutations
  const targetNode = document.getElementsByClassName('user-info-list-wrap')[0];

  // Options for the observer (which mutations to observe)
  const config = { childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = function(mutationList, observer) {
      // goes through the mutation, looking for hospitalised people
      for(const mutation of mutationList) {
        if (mutation.type === 'childList') {
          for(let item of mutation.addedNodes){
            if(!item.length){
              let child = item.querySelector(".level-icons-wrap #iconTray");
              // if not in hospital -> hide
              if(child.outerHTML.search("<b>Hospital</b>") == -1){
                child.parentNode.parentNode.parentNode.parentNode.style.display = "none";
              }
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