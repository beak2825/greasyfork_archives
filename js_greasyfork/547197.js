// ==UserScript==
// @name        Hide Fake Dubizzle/Olx Listings
// @namespace   Violentmonkey Scripts
// @match       https://www.dubizzle.*/*
// @grant       none
// @version     1.0
// @author      swanknight
// @description Hides all listings without a "Call" option
// @icon        https://www.google.com/s2/favicons?domain=www.dubizzle.com
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/547197/Hide%20Fake%20DubizzleOlx%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/547197/Hide%20Fake%20DubizzleOlx%20Listings.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const HIDE_CLASS = 'hide-listing-no-call-js';

  // Insert minimal CSS to hide matched items
  const style = document.createElement('style');
  style.textContent = `.${HIDE_CLASS} { display: none !important; }`;
  document.head.appendChild(style);

  function processListing(li) {
    if (!(li instanceof HTMLElement)) return;
    if (li.getAttribute('aria-label') !== 'Listing') return;
    // find any descendant div with aria-label="Call"
    const hasCallDiv = li.querySelector('div[aria-label="Call"]') !== null;
    if (!hasCallDiv) li.classList.add(HIDE_CLASS);
    else li.classList.remove(HIDE_CLASS);
  }

  function scanAll() {
    const listItems = document.querySelectorAll('li[aria-label="Listing"]');
    listItems.forEach(processListing);
  }

  // Initial pass when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanAll, { once: true });
  } else {
    scanAll();
  }

  // Observe for dynamically added/changed listings
  const observer = new MutationObserver(mutations => {
    const toCheck = new Set();
    for (const m of mutations) {
      if (m.type === 'childList') {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          const el = node;
          if (el.matches && el.matches('li[aria-label="Listing"]')) toCheck.add(el);
          // also if an added subtree contains listing(s)
          el.querySelectorAll && el.querySelectorAll('li[aria-label="Listing"]').forEach(n => toCheck.add(n));
          // if a descendant div with aria-label="Call" was added somewhere, re-scan ancestor listing(s)
          if (el.matches && el.matches('div[aria-label="Call"]')) {
            let ancestor = el.closest('li[aria-label="Listing"]');
            if (ancestor) toCheck.add(ancestor);
          }
          el.querySelectorAll && el.querySelectorAll('div[aria-label="Call"]').forEach(div => {
            const ancestor = div.closest && div.closest('li[aria-label="Listing"]');
            if (ancestor) toCheck.add(ancestor);
          });
        });
        m.removedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          const el = node;
          if (el.matches && el.matches('li[aria-label="Listing"]')) toCheck.add(el.parentElement); // parent may need re-check
          el.querySelectorAll && el.querySelectorAll('li[aria-label="Listing"]').forEach(n => toCheck.add(n.parentElement));
        });
      } else if (m.type === 'attributes') {
        const target = m.target;
        // If aria-label changed on a div or li, re-check the closest listing
        if (target instanceof Element) {
          const listing = target.closest && target.closest('li[aria-label="Listing"]');
          if (listing) toCheck.add(listing);
        }
      }
    }
    // If nothing specific, do a lightweight rescan
    if (toCheck.size === 0) {
      scanAll();
    } else {
      toCheck.forEach(item => item && processListing(item));
    }
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-label']
  });

})();
