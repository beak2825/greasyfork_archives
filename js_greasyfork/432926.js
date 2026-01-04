// ==UserScript==
// @name         Chineseifier
// @namespace    http://ko-fi.com/
// @version      3.2
// @description  Why?
// @author       leafysweetsgarden (edited by DasLulilaan)
// @include      http://*
// @include      https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432926/Chineseifier.user.js
// @updateURL https://update.greasyfork.org/scripts/432926/Chineseifier.meta.js
// ==/UserScript==

function walk(node)
{
	var ignore = { "STYLE":0, "SCRIPT":0, "NOSCRIPT":0, "IFRAME":0, "OBJECT":0, "PRE":0 };
	// I stole this function from here:
	// http://is.gd/mwZp7E

	var child, next;

if (node.nodeName.toLowerCase() == 'input' || node.nodeName.toLowerCase() == 'textarea' || (node.classList && node.classList.contains('ace_editor'))) { return; }

	if (node.tagName in ignore) return;

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

	v = v.replace(/(?:r)/g, "l");
	v = v.replace(/(?:R)/g, "L");

	textNode.nodeValue = v;
}

// Notify me of everything!
var observerConfig = {
	attributes: true,
	childList: true,
	subtree: true,
	characterData: true
};

var observer = new MutationObserver(function(mutations) {
	observer.disconnect();
	walk(document.body);
	observer.observe(document.body, observerConfig);
});

// Node, config
// In this case we'll listen to all changes to body and child nodes
observer.observe(document.body, observerConfig);
