// ==UserScript==
// @name         Existential Comics hovertext
// @namespace    https://existentialcomics.com
// @version      2
// @description  Make hovertext visible on page for easier reading on mobile.
// @author       Tehhund
// @match        *://existentialcomics.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=existentialcomics.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537471/Existential%20Comics%20hovertext.user.js
// @updateURL https://update.greasyfork.org/scripts/537471/Existential%20Comics%20hovertext.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

const comicImages = [...document.getElementsByClassName('comicImg')];
console.log(comicImages);
const bottom = document.getElementById('bottom');
console.log(bottom);
for (const comic of comicImages) {
  if (comic.getAttribute('title')) {
    bottom.prepend(comic.getAttribute('title'));
  }
}