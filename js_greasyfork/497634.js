// ==UserScript==
// @name        Koencentratie
// @namespace   koencentratie
// @include     *
// @description Replaces all the occurrences of "con" with "koen". Forked from Cloud-to-Butt
// @version     1.0.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/497634/Koencentratie.user.js
// @updateURL https://update.greasyfork.org/scripts/497634/Koencentratie.meta.js
// ==/UserScript==


walk(document.body);

function walk(node)
{
	// I stole this function from here:
	// http://is.gd/mwZp7E

	var child, next;

	switch ( node.nodeType )
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child )
			{
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;

		case 3: // Text node
			handleText(node);
			break;
	}
}

function handleText(textNode)
{
	var v = textNode.nodeValue;

	v = v.replace(/Con/g, "Koen");
	v = v.replace(/CON/g, "KOEN");
	v = v.replace(/con/g, "koen");

        //Koenmmunicatie
        v = v.replace(/Com/g, "Koen");
	v = v.replace(/COM/g, "KOEN");
	v = v.replace(/com/g, "koen");

	textNode.nodeValue = v;
}