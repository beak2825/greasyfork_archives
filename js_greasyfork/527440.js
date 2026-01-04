// ==UserScript==
// @name			Unpin Jira comment box
// @namespace		Violentmonkey Scripts
// @match			https://jira.*/*
// @exclude-match https://*/*RapidBoard*
// @grant			none
// @version			1.3
// @author			LeviOliveira
// @description		Unpins Jira's sticky comment box
// @license			MIT
// @downloadURL https://update.greasyfork.org/scripts/527440/Unpin%20Jira%20comment%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/527440/Unpin%20Jira%20comment%20box.meta.js
// ==/UserScript==
 
// Set position to static instead of sticky
let observer = new MutationObserver(function(mutation) {
	// document.getElementById("addcomment").classList.remove("sticky");
	document.getElementById("addcomment").style.position = "static"
});
 
observer.observe(document.documentElement || document.body, {
	childList: true,
	subtree: true
});