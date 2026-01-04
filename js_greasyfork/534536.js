// ==UserScript==
// @name         Force Steam US Dollars
// @namespace    Force-Steam-US-Dollars
// @version      1.2
// @description  Always use dollars as currency in Steam Search results.
// @author       masterofobzene
// @match        https://store.steampowered.com/*
// @grant        none
// @license      GNU GPLv3
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534536/Force%20Steam%20US%20Dollars.user.js
// @updateURL https://update.greasyfork.org/scripts/534536/Force%20Steam%20US%20Dollars.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const US_CC = 'us';

  // --- STEP 1: Force cc=us in the main URL ---
  try {
    const url = new URL(location.href);
    if (url.searchParams.get('cc') !== US_CC) {
      url.searchParams.set('cc', US_CC);
      console.log('[Steam US Redirect] Redirecting to US store URL:', url.toString());
      location.replace(url.toString());
      return; // Prevent further script execution after redirect
    }
  } catch (e) {
    console.error('[Steam US Redirect] URL parse error:', e);
  }

  // --- STEP 2: Patch XMLHttpRequest and fetch to force cc=us in background requests ---
  function appendCCParam(originalUrl) {
    try {
      const url = new URL(originalUrl, location.origin);
      if (url.searchParams.get('cc') !== US_CC) {
        url.searchParams.set('cc', US_CC);
      }
      return url.toString();
    } catch (e) {
      console.warn('[Steam US Redirect] Failed to rewrite URL:', originalUrl, e);
      return originalUrl;
    }
  }

  // Patch XMLHttpRequest
  const OriginalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    const modifiedUrl = appendCCParam(url);
    return OriginalOpen.call(this, method, modifiedUrl, ...rest);
  };

  // Patch fetch
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    if (typeof input === 'string') {
      input = appendCCParam(input);
    } else if (input instanceof Request) {
      const newUrl = appendCCParam(input.url);
      input = new Request(newUrl, input);
    }
    return originalFetch(input, init);
  };

  console.log('[Steam US Redirect] cc=us enforced on all requests.');
})();
