// ==UserScript==
// @name           Custom Fixed Font in Gmail
// @namespace      https://mail.google.com
// @include        https://mail.google.com/*
// @icon           https://ssl.gstatic.com/ui/v1/icons/mail/favicon.ico
// @run-at         document-start
// @description    Custom fixed-font in Gmail messages
// @version        1.4.1
// @license        CC0; https://creativecommons.org/publicdomain/zero/1.0/
// @author         Marcin Rataj (original), Martin Baranski (tweaks)
// @homepageURL    https://github.com/lidel/userscripts
// @grant          GM_addStyle
// @grant          GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/27690/Custom%20Fixed%20Font%20in%20Gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/27690/Custom%20Fixed%20Font%20in%20Gmail.meta.js
// ==/UserScript==

const fontName = 'Source Code Pro';
const fontSubset = 'latin';

// dragons below this line
const fontCss = 'font-family: \'' + fontName + '\', monospace !important;';
// plain-text messages
let css = '.ii, .Ak {' + fontCss + '}';
// editor
css += '.editable {' + fontCss + '}';
// load
const heads = document.getElementsByTagName('head');
// load font
if (heads.length > 0) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '//fonts.googleapis.com/css?family=' + fontName.replace(/\ /g, '+') + '&subset=' + fontSubset;
  heads[0].appendChild(link);
  const node = document.createElement('style');
  node.type = 'text/css';
  node.appendChild(document.createTextNode(css));
  heads[0].appendChild(node);
}
// attach style
if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
} else if (typeof addStyle != "undefined") {
    addStyle(css);
} else {
  if (heads.length > 0) {
    const node = document.createElement('style');
    node.type = 'text/css';
    node.appendChild(document.createTextNode(css));
    heads[0].appendChild(node);
  }
}
