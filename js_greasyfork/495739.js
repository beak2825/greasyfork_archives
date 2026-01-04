// ==UserScript==
// @name         OGFAP Ad Blocker
// @namespace    https://greasyfork.org/en/users/1304832-xrex-xrex
// @version      1.0
// @description  Blocks ads on OGFAP
// @author       XREX
// @license      MIT
// @include      https://ogfap.com/*
// @grant        none
// @run-at       document-start
// @icon         https://ogfap.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/495739/OGFAP%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/495739/OGFAP%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
          if (mutation.type === 'childList') {
              mutation.addedNodes.forEach(node => {
                  if (node.nodeType === 1 && (node.classList.contains('banner'))) {
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
