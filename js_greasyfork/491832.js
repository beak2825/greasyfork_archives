// ==UserScript== 
// @name        Remove Share Buttons
// @namespace   i2p.schimon.remove-share-buttons
// @description Remove useless "trainer wheels" tracking buttons.
// @homepageURL https://openuserjs.org/scripts/sjehuda/Remove_Share_Buttons
// @supportURL  https://openuserjs.org/scripts/sjehuda/Remove_Share_Buttons/issues
// @copyright   2024, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @grant       none
// @run-at      document-end
// @match       file:///*
// @match       *://*/*
// @version     24.01.23
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn6qk77iPPC90ZXh0Pjwvc3ZnPgo=
// @downloadURL https://update.greasyfork.org/scripts/491832/Remove%20Share%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/491832/Remove%20Share%20Buttons.meta.js
// ==/UserScript==

var cssSelectors;

cssSelectors = [
  '/submit?url=',
  '/sharer.php?u=',
  '/intent/tweet?text=',
  '/pin/create/button/?url=',
  '://send?text=',
  '/pin/create/button?url=',
  '/sharing/share-offsite/?url=',
  '/mail/?view=',
  '/sharer/sharer.php?u=',
  '/share?url=',
  'app.com/send?text=',
  'gab.com/compose?url=',
  'n.com/shareArticle?',
  'r.com/share',
  'x.com/share',
  'wp.me/',
  ];

for (const cssSelector of cssSelectors) {
  let links = document.querySelectorAll('a[href*="' + cssSelector + '"]');
  for (const link of links) {
    link.remove();
  }
}

cssSelectors = [
  '/plugins/like.php?href=',
  ];

for (const cssSelector of cssSelectors) {
  let links = document.querySelectorAll('iframe[src*="' + cssSelector + '"]');
  for (const link of links) {
    link.remove();
  }
}

switch (location.hostname) {
  case "creation.com":
    cssSelectors = ".share-bar";
    break;
  case "notthebee.com":
    cssSelectors = ".article-shareables";
    break;
}

document.querySelector(cssSelectors).remove();
