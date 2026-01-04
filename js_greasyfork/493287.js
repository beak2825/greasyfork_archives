// ==UserScript==
// @name        Raw Page
// @namespace   i2p.schimon.rawpage
// @description Redirect to raw archived pages.
// @homepageURL https://greasyfork.org/en/scripts/493287-raw-page
// @supportURL  https://greasyfork.org/en/scripts/493287-raw-page/feedback
// @copyright   2024, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @match       *://web.archive.org/web/*
// @version     24.04
// @run-at      document-start
// @grant       none
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn5OEPC90ZXh0Pjwvc3ZnPgo=
// @downloadURL https://update.greasyfork.org/scripts/493287/Raw%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/493287/Raw%20Page.meta.js
// ==/UserScript==

(function () {
  let oldUrl = location.href.split('/');
  if (!oldUrl[4].includes('_')) {
    oldUrl[4] = oldUrl[4] + 'if_';
    let newUrl = oldUrl.join('/');
    location.href = newUrl;
  }
})();
