// ==UserScript==
// @name         Reddit Sort Comments by old
// @version      1.3
// @description  Append ?sort=old to all /comments/ links, waiting for feed to load
// @author       Rayman30
// @license      MIT
// @match        https://www.reddit.com/*
// @grant        none
// @run-at       document-end
// @namespace https://github.com/rayman1972
// @downloadURL https://update.greasyfork.org/scripts/523422/Reddit%20Sort%20Comments%20by%20old.user.js
// @updateURL https://update.greasyfork.org/scripts/523422/Reddit%20Sort%20Comments%20by%20old.meta.js
// ==/UserScript==
(function() {
  'use strict';

  /**
   * Rewrites all comment links so that, if they don't have a "sort" param,
   * we add "?sort=old".
   */
  function rewriteCommentLinks() {
    // Grab all anchor tags whose href includes "/comments/"
    const anchors = document.querySelectorAll('a[href*="/comments/"]');

    anchors.forEach(a => {
      try {
        const url = new URL(a.href);
        // If no sort param, set it to "old"
        if (!url.searchParams.has('sort')) {
          url.searchParams.set('sort', 'old');
          a.href = url.toString();
        }
      } catch (err) {
        // Ignore any invalid URLs
      }
    });

    console.log('[Reddit Sort=old] Rewrote comment links.');
  }

  /**
   * Initialize:
   * 1) Wait for window load to ensure initial feed is done.
   * 2) Rewrites links once.
   * 3) Sets a MutationObserver to catch newly inserted links (infinite scroll).
   */
  function init() {
    // First, rewrite links once on the "window.load" event
    window.addEventListener('load', () => {
      console.log('[Reddit Sort=old] Window load event fired. Rewriting links...');
      rewriteCommentLinks();
    });

    // Then keep an eye out for new content (infinite scrolling)
    const observer = new MutationObserver(() => {
      rewriteCommentLinks();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Start
  init();
})();