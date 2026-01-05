// ==UserScript==
// @name          Coincidence Detector
// @description   Detects coincidences.
// @include       *
// @grant         GM_getResourceText
// @resource      theList https://bit.no.com:43110/1As8nyiVibNzfjLiS1eCinYia2dK2ZgHiz/theList.json
// @version 0.0.1.20160925234551
// @namespace https://greasyfork.org/users/68664
// @downloadURL https://update.greasyfork.org/scripts/23520/Coincidence%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/23520/Coincidence%20Detector.meta.js
// ==/UserScript==


var theList = JSON.parse(GM_getResourceText("theList"));
var regexp = new RegExp('\\b(' + theList.join('|') + ')\\b(?!\\)\\))', "gi");

function walk(node) {
	// I stole this function from here:
	// http://is.gd/mwZp7E

	var child, next;

	switch ( node.nodeType )
	{
		case 1:
		case 9:
		case 11:
			child = node.firstChild;
			while ( child )
			{
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;

		case 3:
			handleText(node);
			break;
	}
}

function handleText(textNode) {
	textNode.nodeValue = textNode.nodeValue.replace(regexp, '((($1)))');
	textNode.nodeValue = textNode.nodeValue.replace(/\bIsrael\b/, '(((Our Greatest Ally)))');
}

walk(document.body);
