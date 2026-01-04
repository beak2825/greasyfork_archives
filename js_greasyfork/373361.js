// ==UserScript==
// @name		Github GitCDN Button
// @namespace	eight04.blogspot.com
// @author      by Mikhoul based on eight04.blogspot.com Userscript
// @description	An userscript to add "GitCDN" button on github.
// @include		https://github.com/*
// @include		https://gist.github.com/*
// @version		1.0.1
// @grant 		none
// @downloadURL https://update.greasyfork.org/scripts/373361/Github%20GitCDN%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/373361/Github%20GitCDN%20Button.meta.js
// ==/UserScript==

"use strict";

function replace(){
	// Check if raw-url button exists
	var btns, i;
	btns = document.querySelectorAll(".file-actions a:not(.rawgit)");
	for (i = 0; i < btns.length; i++) {
		if (btns[i].textContent == "Raw") {
			createButton(btns[i]);
		}
	}
}

function createButton(btn) {
	var url = btn.href;
	if (url.indexOf("gist.github.com") >= 0) {
		url = url.replace("gist.github.com", "rawgit.com");
	} else {
		url = url.replace(/github\.com\/([^/]+\/[^/]+)\/raw/, "gitcdn.xyz/repo/$1");
	}

	var newBtn = btn.cloneNode(false);
	newBtn.href = url;
	newBtn.textContent = "GitCDN";
	newBtn.removeAttribute("id");

	btn.parentNode.insertBefore(newBtn, btn.nextSibling);
	btn.classList.add("rawgit");

	if (!btn.parentNode.classList.contains("btn-group")) {
		var parent = btn.parentNode,
			group = document.createElement("div");
		group.className = "btn-group";
		while (parent.childNodes.length) {
			group.appendChild(parent.childNodes[0]);
		}
		parent.appendChild(group);
	}
}

var container =
	document.querySelector("#js-repo-pjax-container") ||
	document.querySelector("#js-pjax-container");

if (container) {
	new MutationObserver(function(){
		replace();
	}).observe(container, {childList: true, subtree: true});
}

replace();
