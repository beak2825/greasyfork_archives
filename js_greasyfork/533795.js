
// ==UserScript==
// @name         TradingView Toast Ad Blocker
// @namespace    https://greasyfork.org/tr/users/1461563-mehmet-kutup
// @version      1.0
// @description  Blocks toast-ad scripts on TradingView
// @author       Mehmet Kutup
// @match        *://*.tradingview.com/*
// @run-at       document-start
// @grant        none
// @license     no license
// @downloadURL https://update.greasyfork.org/scripts/533795/TradingView%20Toast%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/533795/TradingView%20Toast%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // toast-ad.* prevention files
  const observer = new MutationObserver(() => {
    const scripts = document.querySelectorAll('script[src*="toast-ad"]');
    scripts.forEach(script => {
      if (script.src.includes("https://static.tradingview.com/static/bundles/toast-ad")) {
        console.log("Blocked toast-ad script:", script.src);
        script.parentNode.removeChild(script);
      }
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // createElement loading prevention
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    if (tagName.toLowerCase() === 'script') {
      Object.defineProperty(element, 'src', {
        set(value) {
          if (value.includes("https://static.tradingview.com/static/bundles/toast-ad")) {
            console.log("Blocked toast-ad script via createElement:", value);
            return;
          }
          element.setAttribute('src', value);
        },
        get() {
          return element.getAttribute('src');
        }
      });
    }
    return element;
  };

  const checkAd = setInterval(() => {
    const adBox = document.getElementById('tv-toasts');
    if (adBox) {
      adBox.remove();
      console.log('tv-toasts element removed.');
    } else {
      console.log('tv-toasts element not present.');
    }
  }, 5000);
})();
