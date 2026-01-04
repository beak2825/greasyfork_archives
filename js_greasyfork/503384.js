// ==UserScript==
// @name           Remove 'blank'
// @namespace jjb
// @match *://*.t66y.com/*
// @version 0.0.2
// @description Remove target blank from all links
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503384/Remove%20%27blank%27.user.js
// @updateURL https://update.greasyfork.org/scripts/503384/Remove%20%27blank%27.meta.js
// ==/UserScript==

if (window.top == window) {
	var ahrefs = document.querySelectorAll('a[target]');
	for (var a_ind = 0; a_ind < ahrefs.length; a_ind++ ) {
		var a = ahrefs[a_ind];
		a.removeAttribute('target');
	}

	// remove base target tag
	var bases = document.querySelectorAll("base[target]");
	for (var ind = 0; ind < bases.length; ind++) {
		var base = bases[ind];
		base.removeAttribute('target');
	}
}