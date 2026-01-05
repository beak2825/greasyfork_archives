// ==UserScript==
// @name         KotoRiko comments hider.
// @namespace    http://example.com
// @version      69.1337
// @description  To rid your Nyaa experience of le KotoRiko.
// @author       Yomama
// @match        https://www.nyaa.se/?page=view&tid=*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/22846/KotoRiko%20comments%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/22846/KotoRiko%20comments%20hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var c = document.querySelectorAll('a[href="//www.nyaa.se/?user=337775"]')
	var d, e;

	for (var j = 0; j < c.length; j++) {
		d = c[j];
		e = d.parentNode.parentNode;
		console.log("removed ", e);
		e.parentNode.removeChild(e);
	}
})();