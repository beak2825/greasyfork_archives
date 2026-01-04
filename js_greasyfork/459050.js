// ==UserScript==
// @name        Wikpedia monobook
// @namespace   wikipedia-monobook
// @match     *.wikipedia.org/*
// @description Redirect wikipedia pages to monobook
// @version     2
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/459050/Wikpedia%20monobook.user.js
// @updateURL https://update.greasyfork.org/scripts/459050/Wikpedia%20monobook.meta.js
// ==/UserScript==

document.getElementsByTagName("html")[0].style.display = "none";

var suffix = 'useskin=monobook';
var url = document.location.href;

if (!url.endsWith(suffix)) {
    window.stop();
} else {
    document.getElementsByTagName("html")[0].style.display = "";
}

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
