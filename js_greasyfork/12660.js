// ==UserScript==
// @name        Cloud to Butt
// @namespace   cloud-to-butt
// @include     *
// @description Replaces all the occurrences of "The cloud" with "My Butt".
// @version     1.0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12660/Cloud%20to%20Butt.user.js
// @updateURL https://update.greasyfork.org/scripts/12660/Cloud%20to%20Butt.meta.js
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

	v = v.replace(/\bThe Cloud\b/g, "My Butt");
	v = v.replace(/\bThe cloud\b/g, "My butt");
	v = v.replace(/\bthe Cloud\b/g, "my Butt");
	v = v.replace(/\bthe cloud\b/g, "my butt");
	
	textNode.nodeValue = v;
}