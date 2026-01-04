// ==UserScript==
// @name         LOLZ_Remove_Game_Icons_In_Market
// @namespace    LOLZ_Remove_Game_Icons_In_Market
// @version      0.1
// @description  Remove game icons in Market
// @author       el9in
// @match        https://lzt.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/476184/LOLZ_Remove_Game_Icons_In_Market.user.js
// @updateURL https://update.greasyfork.org/scripts/476184/LOLZ_Remove_Game_Icons_In_Market.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function init() {
      const elements_threads = document.querySelectorAll('.steamGameIcon--div');
      elements_threads.forEach(function(element) {
        element.remove();
      });
    }

    async function ones(element) {
      const addedNodeClass = element.classList;
      if(addedNodeClass.contains("marketIndexItem")) {
          const elements_threads = document.querySelectorAll('.steamGameIcon--div');
          elements_threads.forEach(function(element) {
              element.remove();
          });
      }
    }

    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(addedNode => {
            if (addedNode.nodeType === Node.ELEMENT_NODE) {
              ones(addedNode);
            }
          });
        }
      }
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    init();
})();