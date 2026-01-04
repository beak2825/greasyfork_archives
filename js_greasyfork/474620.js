// ==UserScript==
// @name         Youtube Redirect
// @namespace    youtuberedirect
// @homepage     youtuberedirect
// @license MIT
// @version      3.0.1
// @encoding     utf-8
// @description  Youtube Redirect for IOS
// @author       AZ
// @match        *://*.youtube.com/*
// @connect      youtube.com
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/474620/Youtube%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/474620/Youtube%20Redirect.meta.js
// ==/UserScript==


function updateLinks() {
	document.querySelectorAll('.media-item-thumbnail-container, #thumbnail').forEach((link) => {
		link.setAttribute("onClick", `location.href='${link.href}'`);
		link.removeAttribute("href");
	});
}


(function () {
	"use strict";

	updateLinks();
	if (window.location.href.includes("/watch?")) {
		window.location.href = `youtube://${window.location.href.split(".com/")[1]}`;
	}
})();
