// ==UserScript==
// @name         YouTube - Remove Subscriptions Page
// @auhor        Mane
// @version      1.0
// @license      CCO-1.0
// @description  Removes the subscriptions page and Subscriptions links and buttons on youtube.com
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1491313
// @downloadURL https://update.greasyfork.org/scripts/542292/YouTube%20-%20Remove%20Subscriptions%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/542292/YouTube%20-%20Remove%20Subscriptions%20Page.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 1) Redirect any direct visit to Subscriptions feed
  if (location.pathname === '/feed/subscriptions') {
    location.replace('https://www.youtube.com/');
    return;
  }

  // 2) CSS to hide Subscriptions links/buttons
  var css = `
    /* Sidebar and header link */
    a#endpoint[href="/feed/subscriptions"],
    /* Guide entry renderer */
    ytd-guide-entry-renderer a#endpoint[href="/feed/subscriptions"],
    /* Top bar button (camera icon row) */
    tp-yt-paper-icon-button[title="Subscriptions"],
    /* Any element with title or aria-label Subscriptions */
    [title="Subscriptions"],
    [aria-label="Subscriptions"] {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;
  var style = document.createElement('style');
  style.textContent = css;
  document.documentElement.appendChild(style);

  // 3) Function to remove any existing Subscriptions nodes
  function removeSubscriptionsLinks() {
    var selectors = [
      'a#endpoint[href="/feed/subscriptions"]',
      'ytd-guide-entry-renderer a#endpoint[href="/feed/subscriptions"]',
      'tp-yt-paper-icon-button[title="Subscriptions"]',
      '[title="Subscriptions"]',
      '[aria-label="Subscriptions"]'
    ];
    selectors.forEach(function(sel) {
      var els = document.querySelectorAll(sel);
      for (var i = 0; i < els.length; i++) {
        els[i].remove();
      }
    });
  }

  // 4) Observe dynamic DOM updates
  removeSubscriptionsLinks();
  if (window.MutationObserver) {
    new MutationObserver(removeSubscriptionsLinks)
      .observe(document.documentElement, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMNodeInserted', removeSubscriptionsLinks, false);
  }
})();
