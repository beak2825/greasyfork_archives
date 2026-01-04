// ==UserScript==
// @name        ⛏️Ironwood Idle Indicators
// @description Updates the tab icon and title when an action stops.
// @version     1.0.3
// @license     MIT
// @author      bradp
// @namespace   bradp
// @match       https://ironwoodrpg.com/*
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/475908/%E2%9B%8F%EF%B8%8FIronwood%20Idle%20Indicators.user.js
// @updateURL https://update.greasyfork.org/scripts/475908/%E2%9B%8F%EF%B8%8FIronwood%20Idle%20Indicators.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const onRequest = (url, callback) => {
    const req = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
      this.addEventListener('load', function () {
        if (this.responseText) {
          let response = {};
          try {
            response = JSON.parse(this.responseText);
          } catch (e) {
            return;
          }

          if (response && this.responseURL.indexOf(url) !== -1) {
            callback(response);
          }
        }
      });
      req.apply(this, arguments);
    };
  };

  const updateFavicon = (state = 'idle') => {
    const favicons = [
        { size: 16, href: 'https://ironwoodrpg.com/favicon/favicon-16x16.png' },
        { size: 32, href: 'https://ironwoodrpg.com/favicon/favicon-32x32.png' },
        { size: 192, href: 'https://ironwoodrpg.com/favicon/android-chrome-192x192.png' },
        { size: 512, href: 'https://ironwoodrpg.com/favicon/android-chrome-512x512.png' },
        { size: 180, rel: 'apple-touch-icon', href: 'https://ironwoodrpg.com/favicon/apple-touch-icon.png' },
    ];

    favicons.forEach((favicon) => {
        // remove existing favicons
        const existing = document.querySelector(`link[rel="${favicon.rel || 'icon'}"][sizes="${favicon.size}"]`);
        if (existing) {
            existing.remove();
        }

        // add new favicon
        const link = document.createElement('link');
        link.rel = favicon.rel || 'icon';
        link.sizes = favicon.size;
        link.href = state === 'idle' ? `https://brrad.com/ironwood/icons/${favicon.size}.png` : favicon.href;
        document.head.appendChild(link);
    });
  };


  onRequest('stopAction', (response) => {
    // Update the tab title to show the action has stopped.
    setTimeout(() => {
      // only update if the title doesn't already contain the indicator text
      if (document.title.indexOf('🟥️ ') !== -1) {
        return;
      }
      document.title = `🟥️ ${document.title}`;

      updateFavicon('idle');
    }, 250);
  });

  onRequest('startAction', (response) => {
    // Update the tab title to remove the action stopped indicator.
    document.title = document.title.replace('🟥️ ', '');

    updateFavicon('active');
  });
})();
