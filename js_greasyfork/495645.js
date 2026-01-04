// ==UserScript==
// @name         xxxtik Ad Blocker
// @namespace    https://greasyfork.org/en/users/1304832-xrex-xrex
// @version      1.0
// @description  Blocks ads on xxxtik
// @author       XREX
// @license      MIT
// @include      https://xxxtik.com/*
// @grant        none
// @run-at       document-start
// @icon         https://xxxtik.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/495645/xxxtik%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/495645/xxxtik%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
          if (mutation.type === 'childList') {
              mutation.addedNodes.forEach(node => {
                  if (node.nodeType === 1 && (node.classList.contains('popup') || node.classList.contains('new-version')) ) {
                      console.log('Popup element appeared:', node);
                      node.style.display = 'none';
                  }
              });
          }
      }
  });

  observer.observe(document.body, {
      childList: true,
      subtree: true
  });
})();
