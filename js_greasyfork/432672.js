// ==UserScript==
// @name		UD Same Character Highlighter
// @namespace		http://www.aichon.com
// @description		Mousing over a character link highlights all instances of that link
// @include		http://urbandead.com/map.cgi*
// @include		http://www.urbandead.com/map.cgi*
// @exclude		http://urbandead.com/map.cgi?logout
// @exclude		http://www.urbandead.com/map.cgi?logout
// @version 0.0.1.20210919202133
// @downloadURL https://update.greasyfork.org/scripts/432672/UD%20Same%20Character%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/432672/UD%20Same%20Character%20Highlighter.meta.js
// ==/UserScript==

/* Urban Dead Same Character Highlighter
 * v1.0.2
 *
 * Copyright (C) 2009 Bradley Sattem
 * Author: Bradley Sattem (a.k.a. Aichon)
 * Last Modified: 2009-10-30
 * 
 * Tested under: Safari 4.0.3 on Mac
 *   
 * Contact: [my first name [DOT] my last name]@gmail.com (check the Copyright info for my name)
 *
 * Changes:
 *   v1.0.3 - Fixed a small bug introduced by 1.0.2
 *   v1.0.2 - Made it more careful about which links it attaches to (created an error with Barrista)
 *   v1.0.1 - Initial public release
 *
 */


addHighlight();

function addHighlight() {
	var links = document.evaluate("//a[contains(@href, 'profile.cgi?id')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	for(var i = 0; i < links.snapshotLength; i++) {
		var id = getProfileID(links.snapshotItem(i));

		links.snapshotItem(i).setAttribute("onmouseover","toggleHighlight(" + id + ")");
		links.snapshotItem(i).setAttribute("onmouseout","toggleHighlight(" + id + ")");
	}
}

function getProfileID(link) {
	return link.href.substr(link.href.indexOf("=") + 1);
}

toggleHighlight = function(id) {
	var charLinks = document.evaluate("//a[contains(@href, 'profile.cgi?id=" + id + "')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	for(var i = 0; i < charLinks.snapshotLength; i++) {
		if(charLinks.snapshotItem(i).style.textDecoration == "underline") charLinks.snapshotItem(i).style.textDecoration = "none";
		else charLinks.snapshotItem(i).style.textDecoration = "underline";
	}
}