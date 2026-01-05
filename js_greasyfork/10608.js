// ==UserScript==
// @name Syntaxify
// @description Universal syntax highlighting
// @namespace http://rob-bolton.co.uk
// @version 1.4
// @include http*
// @grant GM_addStyle
// @grant GM_getResourceText
// @require http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/highlight.min.js
// @resource highlightJsCss https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/styles/monokai.min.css
// @downloadURL https://update.greasyfork.org/scripts/10608/Syntaxify.user.js
// @updateURL https://update.greasyfork.org/scripts/10608/Syntaxify.meta.js
// ==/UserScript==
//

var tagsToSearch = ["pre", "code"];

GM_addStyle(GM_getResourceText("highlightJsCss"));

var codeBlocks = {};
var itemCounter = 0;
var selectedItem;

function isCodeBlock(node) {
	if(node) {
		var tagname = node.tagName.toLowerCase();
		for(var i=0; i<tagsToSearch.length; i++) {
			if(tagname == tagsToSearch[i]) {
				return true;
			}
		}
	}
	
	return false;
}

function wrapSelection() {
	var selection = window.getSelection();
	if(selection.rangeCount > 0) {
		var range = selection.getRangeAt(0);
		var parent = range.startContainer.parentNode;
		if(!isCodeBlock(parent)) {
			var container = document.createElement("code");
			var containerData = addBlock(container);
			containerData.originalFragment = range.cloneContents();
			container.setAttribute("contextmenu", "SyntaxifyPreUnwrapMenu");
			range.surroundContents(container);
		}
	}
}

function unwrap() {
	if(selectedItem) {
		var node = selectedItem;
		var nodeData = codeBlocks[node.id];
		var parent = node.parentNode;
		parent.insertBefore(nodeData.originalFragment, node);
		parent.removeChild(node);
	}
}

function addBlock(node) {
	if(!node.id) {
		node.id = "SyntaxifyBlock" + itemCounter++;
	}
	codeBlocks[node.id] = {
		"node": node,
		"highlighted": false,
		"originalNode": node.cloneNode(true)
	}
	
	return codeBlocks[node.id];
}

function revert(nodeData) {
	var parent = nodeData.node.parentNode;
	parent.insertBefore(nodeData.originalNode, nodeData.node);
	parent.removeChild(nodeData.node);
	nodeData.node = nodeData.originalNode;
	nodeData.highlighted = false;
	if(nodeData.originalFragment) {
		nodeData.node.setAttribute("contextMenu", "SyntaxifyPreUnwrapMenu");
	} else {
		nodeData.node.setAttribute("contextMenu", "SyntaxifyPreMenu");
	}
}

function highlight() {
	var node = selectedItem;
	if(node) {
		if(!codeBlocks[node.id]) {
			addBlock(node);
		}
		var nodeData = codeBlocks[node.id];
		if(nodeData.highlighted === false) {
			nodeData.originalNode = node.cloneNode(true);
			try {
				if(nodeData.lang) {
					node.className = (node.className || "") + " lang-" + nodeData.lang;
				}
				hljs.highlightBlock(node);
			} catch(e) {
				console.err(e);
				revert(nodeData);
				alert(e);
				return;
			}
			nodeData.highlighted = true;
			node.setAttribute("contextMenu", "SyntaxifyPostMenu");
		}
	}
}

function highlightAs() {
	var node = selectedItem;
	if(node) {
		if(!codeBlocks[node.id]) {
				addBlock(node);
		}
		var lang = prompt("Language:");
		if(lang) {
			codeBlocks[node.id].lang = lang;
			highlight();
		} else {
			codeBlocks[node.id].lang = null;
		}
	}
}

function unHighlight() {
	var node = selectedItem;
	if(node) {
		if(!codeBlocks[node.id]) {
			addBlock(node);
		}
		var nodeData = codeBlocks[node.id];
		if(nodeData.highlighted === true) {
			revert(nodeData);
		}
	}
}

var syntaxableElements = [];
for(var i=0; i<tagsToSearch.length; i++) {
	var tagsFound = document.getElementsByTagName(tagsToSearch[i]);
	for(var j=0; j<tagsFound.length; j++) {
		syntaxableElements.push(tagsFound.item(j));
	}
}

if(syntaxableElements) {
	for(var i=0; i<(syntaxableElements.length || 0); i++) {
		syntaxableElements[i].setAttribute("contextmenu", "SyntaxifyPreMenu");
	}
}

var body = document.body;
var bodyMenu;
var bodyMenuId = body.getAttribute("contextmenu");
if(!bodyMenuId) {
	bodyMenu = document.createElement("menu");
	bodyMenu.setAttribute("type", "context");
	bodyMenu.setAttribute("id", "SyntaxifyMenuMain");
} else {
	bodyMenu = document.getElementById(bodyMenuId);
}

var wrapItem = document.createElement("menuitem");
wrapItem.setAttribute("label", "Syntaxify - Wrap with <code>");
wrapItem.addEventListener("click", wrapSelection, false);

bodyMenu.appendChild(wrapItem);
body.appendChild(bodyMenu);
body.setAttribute("contextmenu", bodyMenu.getAttribute("id"));

// Menu for un-highlighted code blocks
var syntaxPreMenu = document.createElement("menu");
syntaxPreMenu.setAttribute("type", "context");
syntaxPreMenu.setAttribute("id", "SyntaxifyPreMenu");

var syntaxPreMenuHighlightItem = document.createElement("menuitem");
syntaxPreMenuHighlightItem.setAttribute("label", "Syntaxify - Highlight");
syntaxPreMenuHighlightItem.addEventListener("click", highlight, false);
syntaxPreMenu.appendChild(syntaxPreMenuHighlightItem);

var syntaxPreMenuHighlightAsItem = document.createElement("menuitem");
syntaxPreMenuHighlightAsItem.setAttribute("label", "Syntaxify - Highlight as...");
syntaxPreMenuHighlightAsItem.addEventListener("click", highlightAs, false);
syntaxPreMenu.appendChild(syntaxPreMenuHighlightAsItem);

body.appendChild(syntaxPreMenu);


// Menu for un-highlighted ad-hoc code blocks created via the context-menu's wrap entry
var syntaxPreUnwrapMenu = syntaxPreMenu.cloneNode(false);
syntaxPreUnwrapMenu.setAttribute("id", "SyntaxifyPreUnwrapMenu");

var syntaxPreUnwrapMenuUnwrapItem = document.createElement("menuitem");
syntaxPreUnwrapMenuUnwrapItem.setAttribute("label", "Syntaxify - Unwrap");
syntaxPreUnwrapMenuUnwrapItem.addEventListener("click", unwrap, false);

var syntaxPreUnwrapMenuHighlightItem = syntaxPreMenuHighlightItem.cloneNode(false);
var syntaxPreUnwrapMenuHighlightAsItem = syntaxPreMenuHighlightAsItem.cloneNode(false);

syntaxPreUnwrapMenuHighlightItem.addEventListener("click", highlight, false);
syntaxPreUnwrapMenuHighlightAsItem.addEventListener("click", highlightAs, false);

syntaxPreUnwrapMenu.appendChild(syntaxPreUnwrapMenuHighlightItem);
syntaxPreUnwrapMenu.appendChild(syntaxPreUnwrapMenuHighlightAsItem);
syntaxPreUnwrapMenu.appendChild(syntaxPreUnwrapMenuUnwrapItem);

body.appendChild(syntaxPreUnwrapMenu);


var syntaxPostMenu = document.createElement("menu");
syntaxPostMenu.setAttribute("type", "context");
syntaxPostMenu.setAttribute("id", "SyntaxifyPostMenu");

var syntaxPostMenuUnHighlightItem = document.createElement("menuitem");
syntaxPostMenuUnHighlightItem.setAttribute("label", "Syntaxify - UnHighlight");
syntaxPostMenuUnHighlightItem.addEventListener("click", unHighlight, false);
syntaxPostMenu.appendChild(syntaxPostMenuUnHighlightItem);

body.appendChild(syntaxPostMenu);

document.addEventListener("mousedown", function(event) {
	if(event.button == 2) {
		var node = event.target;
		while(node.parentNode && !isCodeBlock(node)) {
			node = node.parentNode;
		}
		if(isCodeBlock(node)) {
			selectedItem = node;
		} else {
			selectedItem = null;
		}
	}
});