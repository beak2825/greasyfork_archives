// ==UserScript==
// @name         LOLZ_Delete Closed Threads
// @namespace    LOLZ_Delete Closed Threads
// @version      0.1
// @description  Delete Closed Threads
// @author       el9in
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/479054/LOLZ_Delete%20Closed%20Threads.user.js
// @updateURL https://update.greasyfork.org/scripts/479054/LOLZ_Delete%20Closed%20Threads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function init() {
        const elements = document.querySelectorAll('[id^="thread-"]');
    	elements.forEach(element => {
            const lockElement = element.querySelector('.iconKey.fa.fa-lock.Tooltip');
    		if (lockElement) element.remove();
    	});
    }

    async function ones(element) {
      const addedNodeClass = element.classList;
      //console.log(addedNodeClass, element);
      if(addedNodeClass.contains("locked")) {
          const lockElement = element.querySelector('.iconKey.fa.fa-lock.Tooltip');
          if (lockElement) element.remove();
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

    let _currentURL = window.location.href;
    setInterval(function() {
        let _newURL = window.location.href;
        if (_newURL !== _currentURL) {
            init();
        }
    }, 1000);
})();