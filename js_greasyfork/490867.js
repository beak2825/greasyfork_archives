// ==UserScript==
// @name         Instagram Fixer
// @namespace    vaindil
// @version      2024-03-25
// @description  Fixes Instagram stopping right clicks
// @author       vaindil
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490867/Instagram%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/490867/Instagram%20Fixer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function changes(records, observer) {
    console.warn('changes');
    for (const record of records) {
      handleNodes(record.addedNodes);
    }
  }

  function handleNodes(nodes) {
    for (const node of nodes) {
      const images = node.querySelectorAll('img');
      for (const image of images) {
        const emptySibling = image.parentElement.nextSibling;
        if (emptySibling && emptySibling.textContent === '') {
          console.warn('removing element');
          emptySibling.remove();
        }
      }
    }
  }

  const i = setInterval(() => {
    console.warn('interval running');
    const target = document.body;
    if (target != null) {
      clearInterval(i);

      console.warn('cleaning initial nodes');
      handleNodes(target.children);

      console.warn('starting observer');
      const observer = new MutationObserver(changes);
      observer.observe(target.parentElement, { childList: true, subtree: true });
    }
  }, 500);
})();