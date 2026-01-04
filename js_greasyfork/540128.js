// ==UserScript==
// @name        Bye Bye Reels
// @namespace   Violentmonkey Scripts
// @match       *://*.instagram.com/*
// @grant       none
// @version     0.1.0
// @author      Walnit
// @license     MIT
// @description Say goodbye to the distraction that is Insta Reels. I wish this worked on mobile.
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/540128/Bye%20Bye%20Reels.user.js
// @updateURL https://update.greasyfork.org/scripts/540128/Bye%20Bye%20Reels.meta.js
// ==/UserScript==

console.log("hello, world!")

VM.observe(document.body, (mutations, observer) => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes) {
      const newNodes = Array.from(mutation.addedNodes);
      newNodes.forEach(node => {
        // Check and hide all with follow button
        const nodes = node.querySelectorAll('.x173jzuc');
        if (nodes) {
          nodes.forEach(node => {
            const article = node.closest('article');
            if (article !== null) {
              article.style.visibility = "hidden";
            }
          });
        }
      });
    }
  });
}, { childList: true });