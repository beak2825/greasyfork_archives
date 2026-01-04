// ==UserScript==
// @name        YouTube Old Scroll Bar
// @description Removes YouTube themed scrollbar
// @match       *://*.youtube.com/*
// @version 1.0
// @namespace https://greasyfork.org/users/205417
// @downloadURL https://update.greasyfork.org/scripts/429153/YouTube%20Old%20Scroll%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/429153/YouTube%20Old%20Scroll%20Bar.meta.js
// ==/UserScript==

function restoreScrollbar() {
  document.body.removeAttribute('standardized-themed-scrollbar');
  document.querySelector('html').removeAttribute('standardized-themed-scrollbar');
  Element.prototype.removeAttributes = function(...attrs) {
    attrs.forEach(attr => this.removeAttribute(attr));
  }
  document.querySelector('ytd-app').removeAttributes('scrollbar-rework', 'standardized-themed-scrollbar');
}

restoreScrollbar();