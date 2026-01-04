// ==UserScript==
// @name        RemoveRedditAd
// @namespace   Violentmonkey Scripts
// @match       https://www.reddit.com/*
// @run-at      document-start
// @grant       none
// @version     1.1
// @author      al0rid4l
// @description 4/8/2024, 1:56:53 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/491970/RemoveRedditAd.user.js
// @updateURL https://update.greasyfork.org/scripts/491970/RemoveRedditAd.meta.js
// ==/UserScript==
window.addEventListener('DOMContentLoaded', () => {
  const sytle = document.createElement('style');
  sytle.textContent = 'shreddit-ad-post, shreddit-dynamic-ad-link { display: none!important; }';
  document.head.appendChild(sytle);
});

window.addEventListener('load', () => {
  let main = null;
  const handler = setInterval(() => {
    main = document.getElementById('subgrid-container');
    if (main) {
      setInterval(() => {
        const joins = document.querySelectorAll('shreddit-join-button[data-testid="credit-bar-join-button"]');
        for (const btn of joins) {
          let parent = btn.parentElement;
          while (parent?.tagName != 'ARTICLE') {
            parent = parent.parentElement;
            if (!parent)
              debugger;
          }
          parent.style.display = 'none';
        }
      }, 1000);
      // const observer = new MutationObserver((list) => {
      //   for (const node of list) {
      //     console.log(node);
      //   }
      // });
      // observer.observe(main, {
      //   childList: true
      // });
      clearInterval(handler);
    }
  }, 300);
});