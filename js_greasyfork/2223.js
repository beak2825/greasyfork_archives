/*
 My LJ Style
 2005-04-04
 Copyright (c) 2005, Steven Chai (email: gm AT yankovic DOT org )
 Released under the GPL license
 http://www.gnu.org/copyleft/gpl.html

 This is a Greasemonkey user script
 http://greasemonkey.mozdev.org/
*/
// ==UserScript==
// @name          My LJ Style
// @namespace     http://www.yankovic.org/happy/gmonkey/
// @description   Modify all LiveJournals to your style.
// @version       0.5
// @license       GPL
// @include       http://*.livejournal.com/*
// @exclude       http://*.livejournal.com/*s2id=*
// @exclude       http://pics.livejournal.com/*
// @exclude       http://www.livejournal.com/*
// @downloadURL https://update.greasyfork.org/scripts/2223/My%20LJ%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/2223/My%20LJ%20Style.meta.js
// ==/UserScript==

(function() {
	function addMyStyle(s) {
		return (s?s+'&':'?')+'style=mine';
	};

	for (var i = 0; i < document.links.length; i++) {
		var l = document.links[i];
		if (l.hostname.match(/\.livejournal\.com$/i)
		&& l.pathname.indexOf('.bml') == -1
		&& l.search.indexOf('style=') == -1
		){
			l.search = addMyStyle(l.search);
		}
	}
})();
