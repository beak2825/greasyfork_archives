// ==UserScript==
// @name			block xss
// @description		block and alert user of potential autofil xss attacks
// @match			https://epicmafia.com/*
// @version 0.0.1.20160513012604
// @namespace https://greasyfork.org/users/4723
// @downloadURL https://update.greasyfork.org/scripts/19636/block%20xss.user.js
// @updateURL https://update.greasyfork.org/scripts/19636/block%20xss.meta.js
// ==/UserScript==

new MutationObserver(function(mutations) {
	var	mutation, node;
	for(var i=0, j=0; i<mutations.length; i++) {
		mutation=mutations[i];
		for(j=0; j<mutation.addedNodes.length; j++) {
			node=mutation.addedNodes[j];
			if(node.querySelector("input[name='user[password]']")) {
				alert("Blocked XSS");
				node.parentElement.removeChild(node);
				}
			}
		}
	}).observe(document.body, {
		childList: true
		});