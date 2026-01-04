// ==UserScript==
// @name         Forum Hide
// @namespace    dev.kwack.torn.forum-hide
// @version      1.1.0
// @description  Hides content from the forums, very quick and dirty
// @author       Kwack [2190604]
// @match        https://www.torn.com/forums.php
// @grant		 GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at 		 document-end
// @downloadURL https://update.greasyfork.org/scripts/495056/Forum%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/495056/Forum%20Hide.meta.js
// ==/UserScript==

GM_addStyle(`
	body.kw-forum-hide-images .post-container img {
		display: none !important;
	}
`);

const loadPrevious = () => {
	const old = localStorage.getItem("kw-forum-hide-images-enabled") === "true";
	return old;
};

const persistentToggle = () => {
	const old = loadPrevious();
	if (!old) {
		localStorage.setItem("kw-forum-hide-images-enabled", "true");
		document.body.classList.add("kw-forum-hide-images");
	} else {
		localStorage.setItem("kw-forum-hide-images-enabled", "false");
		document.body.classList.remove("kw-forum-hide-images");
	}
};

if (typeof GM_registerMenuCommand === "function") {
	GM_registerMenuCommand("Toggle images", persistentToggle);
	if (loadPrevious()) document.body.classList.add("kw-forum-hide-images");
} else {
	console.warn("No function GM_registerMenuCommand, enabling by default...");
	document.body.classList.add("kw-forum-hide-images");
}
