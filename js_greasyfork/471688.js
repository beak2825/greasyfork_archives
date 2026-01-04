// ==UserScript==
// @name         Cohost: collapsible posts
// @namespace    http://yal.cc/
// @version      0.1
// @description  Lets you click on post headers to collapse/expand them.
// @author       YellowAfterlife
// @match        https://cohost.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cohost.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471688/Cohost%3A%20collapsible%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/471688/Cohost%3A%20collapsible%20posts.meta.js
// ==/UserScript==

(function() {
    'use strict';
	let style = document.createElement("style");
	style.innerHTML = `
	.yal-collapsible.yal-collapsed > *:not(header) {
		display: none;
	}
	.yal-collapsible.yal-collapsed > header {
		min-height: 100%;
	}
	`;
	document.body.appendChild(style);
	//
	setInterval(() => {
		for (let post of document.querySelectorAll(`div.renderIfVisible article:not(.yal-collapsible)`)) {
			post.classList.add("yal-collapsible");
			let header = post.querySelector("header");
			let headerDiv = header.querySelector("div");
			header.addEventListener("click", (e) => {
				if (e.target != header && e.target != headerDiv) return;
				post.classList.toggle("yal-collapsed");
			});
		}
	}, 500);
})();