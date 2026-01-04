// ==UserScript==
// @name         Normal scrollbar for youtube
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to get old scroll bar back
// @author       nicholas paul
// @match *://*.youtube.com/*
// @match *://*.youtu.be/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441919/Normal%20scrollbar%20for%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/441919/Normal%20scrollbar%20for%20youtube.meta.js
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
    document.querySelector('ytd-app').addEventListener('yt-visibility-refresh', restoreScrollbar);