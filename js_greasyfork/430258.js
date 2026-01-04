// ==UserScript==
// @name         Instagram web RTL
// @namespace    http://tampermonkey.net/
// @description  a script to fix rtl on web version of instagram
// @version      0.1
// @author       techtube
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?domain=instagram.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430258/Instagram%20web%20RTL.user.js
// @updateURL https://update.greasyfork.org/scripts/430258/Instagram%20web%20RTL.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			mutation.addedNodes.forEach(function (node) {
				var text = document.querySelector("div.C4VMK > span");
				if (text !== null) {
					console.log('found');
					text.setAttribute("dir", "auto");
					text.setAttribute("style", "display: inline-block; text-align: start;");
				} else {
					console.log('not found');
				};

			});
		});
	});
	observer.observe(document, {
		childList : true,
		subtree : true,
		attributes : true,
		characterData : false,
	});
})();