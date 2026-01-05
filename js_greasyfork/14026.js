// ==UserScript==
// @name alert test
// @description	userscript alert test
// @version		0.13
// @include		http://*
// @include		https://*
// @namespace	
// @grant		none
// @run-at		document-start
// @downloadURL https://update.greasyfork.org/scripts/14026/alert%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/14026/alert%20test.meta.js
// ==/UserScript==

(function() {
	alert('test1');
})();
alert('test2');