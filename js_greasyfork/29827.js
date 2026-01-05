// ==UserScript==
// @name        Google docs - force preview
// @description Redirects edit to preview
// @namespace   http://eldar.cz/myf/
// @include     https://docs.google.com/*
// @include     https://drive.google.com/*
// @version     1.0.1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/29827/Google%20docs%20-%20force%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/29827/Google%20docs%20-%20force%20preview.meta.js
// ==/UserScript==

var r = /\/edit$/;
if (r.test(document.location.pathname)) {
	document.location.pathname = document.location.pathname.replace(r, '/preview');
}