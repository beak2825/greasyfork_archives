// ==UserScript==
// @name         	Github Repository Active Forks
// @description		Adds a button to search for active forks of the original Github repository on techgaun.github.io.
// @namespace    	iamMG
// @version     	1.1
// @include        	/https?:\/\/github\.com\/.+\//
// @author       	iamMG
// @run-at			document-end
// @grant        	GM.openInTab
// @copyright		2020, iamMG (https://openuserjs.org/users/iamMG)
// @license 		MIT
// @downloadURL https://update.greasyfork.org/scripts/398393/Github%20Repository%20Active%20Forks.user.js
// @updateURL https://update.greasyfork.org/scripts/398393/Github%20Repository%20Active%20Forks.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var kid = document.createElement("div");
	kid.classList.add("btn-with-count");
	kid.innerHTML = '<a class="btn btn-sm" title="Search for active forks">Active Forks</a>';
	var url = document.getElementsByClassName('mr-2 flex-self-stretch')[0].getElementsByTagName('a')[0].href; 
	if (document.getElementsByClassName('fork-flag')[0]) { url = document.getElementsByClassName('fork-flag')[0].getElementsByTagName('a')[0].href };
	kid.addEventListener('click', function() { window.open("https://techgaun.github.io/active-forks/index.html#" + url); });
	document.getElementsByClassName('pagehead-actions')[0].appendChild(kid);
})();