// ==UserScript==
// @name        wikia monobook
// @namespace   wikia-monobook
// @include     *.wikia.com/*
// @description Automatically redirect Wikia pages to Monobook theme
// @version     2
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/18762/wikia%20monobook.user.js
// @updateURL https://update.greasyfork.org/scripts/18762/wikia%20monobook.meta.js
// ==/UserScript==

var suffix = 'useskin=monobook';

var url = document.location.href;

var anchorPos = url.indexOf('#');
var anchor = ''
if (anchorPos >= 0) {
	anchor = url.slice(anchorPos);
  url = url.slice(0, anchorPos);
}

if (!url.includes(suffix)) {
  var sep = url.includes('?') ? '&' : '?';
  location.replace(url + sep + suffix + anchor);
}
