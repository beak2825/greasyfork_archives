// ==UserScript==
// @name         YouTube Mobile Full Comment Removal
// @namespace    https://your.custom.domain/
// @version      1.4
// @description  Fully remove YouTube mobile comment section, blocking dynamic reappearance
// @match        *://m.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543154/YouTube%20Mobile%20Full%20Comment%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/543154/YouTube%20Mobile%20Full%20Comment%20Removal.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Insert CSS to force-hide comment containers with !important
  const style = document.createElement('style');
  style.textContent = `
    ytm-comments-entry-point-renderer,
    ytd-comments,
    #comments {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      overflow: hidden !important;
    }
  `;
  document.head.appendChild(style);

  // Aggressive mutation observer to remove any re-added comment elements
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;

        if (
          node.matches && (
            node.matches('ytm-comments-entry-point-renderer') ||
            node.matches('ytd-comments') ||
            node.matches('#comments') ||
            node.closest('ytm-comments-entry-point-renderer') ||
            node.closest('ytd-comments') ||
            node.closest('#comments')
          )
        ) {
          node.remove();
          console.log('Removed comment-related node:', node);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Also remove any existing comment containers immediately
  const removeExisting = () => {
    const toRemove = document.querySelectorAll('ytm-comments-entry-point-renderer, ytd-comments, #comments');
    toRemove.forEach(el => {
      el.remove();
      console.log('Removed existing comment container:', el);
    });
  };

  removeExisting();

})();