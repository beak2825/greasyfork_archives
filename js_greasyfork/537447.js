// ==UserScript==
// @name        Bring Back Old Reddit (with image fix)
// @namespace   https://greasyfork.org/en/users/1475555-xenon1234
// @description Redirects reddit.com → old.reddit.com, but opens direct image URLs when clicking media links.
// @match       https://www.reddit.com/*
// @exclude     https://www.reddit.com/poll/*
// @run-at      document-start
// @grant       none
// @version     1.0
// @icon        https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-76x76.png
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/537447/Bring%20Back%20Old%20Reddit%20%28with%20image%20fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537447/Bring%20Back%20Old%20Reddit%20%28with%20image%20fix%29.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const href = window.location.href;
  const params = new URLSearchParams(window.location.search);
  const img = params.get('url');

  // If there's a `?url=` param pointing at an image file, go there directly:
  if (img && /\.(?:png|jpe?g|gif|webp|bmp)(?:\?.*)?$/i.test(img)) {
      document.open();
      document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Reddit Image ${img}</title>
            <style>body{margin:0;background:#000}img{display:block;max-width:100%;height:auto;margin:0 auto}</style>
          </head>
          <body>
            <img src="${img}">
          </body>
        </html>
      `);
      document.close();
      return;
  } else {
    // Otherwise, send everything else to old.reddit.com
    window.location.replace(
      href.replace(/^https?:\/\/www\.reddit\.com/, 'https://old.reddit.com')
    );
  }
})();