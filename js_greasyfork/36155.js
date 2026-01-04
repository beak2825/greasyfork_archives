// ==UserScript==
// @name         Wangblows
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  In GNU we trust
// @author       (You)
// @include      *://*.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36155/Wangblows.user.js
// @updateURL https://update.greasyfork.org/scripts/36155/Wangblows.meta.js
// ==/UserScript==

(function() {
	function findAndReplace(searchText, replacement, searchNode) {
	var regex = typeof searchText === 'string' ?
	    new RegExp(searchText, 'gi') : searchText,
	    childNodes = (searchNode || document.body).childNodes,
	    cnLength = childNodes.length,
	    excludes = 'html,head,style,title,link,meta,script,object,iframe';
	while (cnLength--) {
		var currentNode = childNodes[cnLength];
		if (currentNode.nodeType === 1 &&
		    (excludes + ',').indexOf(currentNode.nodeName.toLowerCase() + ',') === -1) {
		        arguments.callee(searchText, replacement, currentNode);
		    }
		if (currentNode.nodeType !== 3 || !regex.test(currentNode.data) ) {
		    continue;
		}
		var parent = currentNode.parentNode,
		frag = (function(){
			var html = currentNode.data.replace(regex, replacement),
			wrap = document.createElement('div'),
			frag = document.createDocumentFragment();
			wrap.innerHTML = html;
			while (wrap.firstChild) {
			    frag.appendChild(wrap.firstChild);
			}
			return frag;
		})();
		parent.insertBefore(frag, currentNode);
		parent.removeChild(currentNode);
	    }
	}
    findAndReplace('windows', 'Wangblows');
    findAndReplace('microsoft', 'Microshaft');
    findAndReplace('apple', 'Applel');
})();