// ==UserScript==
// @name         PubMed Link Opener
// @namespace    Zhang
// @version      1.0
// @description  Force all links to open in new tabs on PubMed. 
// @author       Zhang-Y
// @match        https://*pubmed.ncbi.nlm.nih.gov/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465670/PubMed%20Link%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/465670/PubMed%20Link%20Opener.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const links = document.getElementsByTagName('a');

  for (let i = 0; i < links.length; i++) {
    links[i].setAttribute('target', '_blank');
  }

  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        const addedNode = mutation.addedNodes[0];

        if (addedNode.tagName === 'A') {
          addedNode.setAttribute('target', '_blank');
        }
        else if (addedNode.getElementsByTagName) {
          const addedLinks = addedNode.getElementsByTagName('a');

          for (let i = 0; i < addedLinks.length; i++) {
            addedLinks[i].setAttribute('target', '_blank');
          }
        }
      }
    });
  });

  observer.observe(document, { childList: true, subtree: true });
})();