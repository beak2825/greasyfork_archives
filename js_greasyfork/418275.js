// ==UserScript==
// @name Make Khazar Milkers Great Again
// @author Arnold François Lecherche
// @namespace greasyfork.org
// @version 1.00
// @description Allows visitors to khazarmilkers.com to once again save the images of those Khazar milkers.
// @include http://khazarmilkers.com/*
// @include http://*.khazarmilkers.com/*
// @include https://khazarmilkers.com/*
// @include https://*.khazarmilkers.com/*
// @grant none
// @run-at document-end
// @copyright 2020 Arnold François Lecherche
// @downloadURL https://update.greasyfork.org/scripts/418275/Make%20Khazar%20Milkers%20Great%20Again.user.js
// @updateURL https://update.greasyfork.org/scripts/418275/Make%20Khazar%20Milkers%20Great%20Again.meta.js
// ==/UserScript==
(function (w, d, b, v) {
  'use strict';
  function tru() {return true;}
  var u = 'unselectable', ul = u.length + 1, uns = d.getElementsByClassName(u), l = uns.length, c, n, s;
  while (l--) {
    c = uns[l].className;
    n = c.indexOf(u);
    if (n !== -1) uns[l].className = c.substring(0, n) + c.substring(n + ul);
  }
  if ('function' === typeof touchstart) w.removeEventListener('touchstart', touchstart, false);
  if ('function' === typeof touchend) w.removeEventListener('touchend', touchend, false);
  if ('undefined' !== typeof b.onselectstart) b.onselectstart = tru;
  if (v.userAgent.indexOf('MSIE') === -1) d.onmousedown = tru;
  b.onmousedown = d.onselectstart = d.onkeydown = d.ondragstart = d.oncontextmenu = tru;
  if ('undefined' !== typeof b.style.MozUserSelect) b.style.MozUserSelect = 'auto';
  b.style.cursor = 'auto';
  b.setAttribute(u, 'off');
  s = d.createElement('style');
  s.textContent = 'html{-webkit-touch-callout:initial;-webkit-user-select:initial;-khtml-user-select:initial;-moz-user-select:initial;-ms-user-select:initial;user-select:initial;-webkit-tap-highlight-color:initial}';
  b.appendChild(s);
})(window, document, document.body || document.getElementsByTagName('body')[0] || document.getElementsByTagName('frameset')[0], navigator);