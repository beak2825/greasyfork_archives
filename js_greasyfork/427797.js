// ==UserScript==
// @name           Link Blanker
// @namespace      kamkam
// @include        *
// @version 0.0.1.20210611
// @description Add target blank
// @downloadURL https://update.greasyfork.org/scripts/427797/Link%20Blanker.user.js
// @updateURL https://update.greasyfork.org/scripts/427797/Link%20Blanker.meta.js
// ==/UserScript==

if (window.top == window) {
	var ahrefs = document.querySelectorAll('a[target]');
	for (var a_ind = 0; a_ind < ahrefs.length; a_ind++ ) {
		var a = ahrefs[a_ind];
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
	}

	var bases = document.querySelectorAll("base[target]");
	for (var ind = 0; ind < bases.length; ind++) {
		var base = bases[ind];
        base.setAttribute('target', '_blank');
        base.setAttribute('rel', 'noopener');
	}
}