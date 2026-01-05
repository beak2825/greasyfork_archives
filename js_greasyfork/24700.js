// ==UserScript==
// @name        Trump to Butt
// @namespace   trump-to-butt
// @include     *
// @description Replaces all the occurrences of Trump with variations on "My Butt".
// @version     1.0.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24700/Trump%20to%20Butt.user.js
// @updateURL https://update.greasyfork.org/scripts/24700/Trump%20to%20Butt.meta.js
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

//	v = v.replace(/\bDonald\s*(J\.?)?\s*Trump\b/g, "My Huge Butt");
	v = v.replace(/\bDonald J\.? Trump\b/g, "My Huge Butt");
	v = v.replace(/\bDonald John Trump\b/g, "My Enormous Butt");
	v = v.replace(/\bDonald Trump\b/g, "My Butt");
	v = v.replace(/\bTRUMP\b/g, "MY BUTT");
	v = v.replace(/\btrump\b/g, "my butt");
	v = v.replace(/\bTrump\b/g, "Butt");
	
	textNode.nodeValue = v;
}