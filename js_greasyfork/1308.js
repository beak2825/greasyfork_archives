// ==UserScript==
// @name        HTTPouëtS
// @version     1.1
// @released    2014-01-23
// @author      raina
// @description Simple HTTPS redirection and rewrite for Pouët links.
// @namespace   http://userscripts.org/users/315152
// @include     *://www.pouet.net/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1308/HTTPou%C3%ABtS.user.js
// @updateURL https://update.greasyfork.org/scripts/1308/HTTPou%C3%ABtS.meta.js
// ==/UserScript==
(function() {
	"use strict";

	var httpsize = function(target) {
		if (target.href.match(/^http:\/\/(www\.)?pouet\.net/)) {
			target.href = target.href.replace(/^http:/, 'https:');
		}
	};
	
	var sayA = function() {
		var as = document.getElementsByTagName('a');
		for (var i = 0; i < as.length; i++) {
			httpsize(as[i]);
		}
	};

	httpsize(window.location);

	window.addEventListener('load', sayA, false);
}());
