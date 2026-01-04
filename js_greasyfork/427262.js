// ==UserScript==
// @name         YTEngineTests
// @namespace    bo.gd.an[at]rambler.ru
// @version      0.2
// @description  Some internal tests
// @author       Bogudan
// @match        https://www.youtube.com/*
// @grant        none
// @run-at           document-start
// @license For personal use only
// @downloadURL https://update.greasyfork.org/scripts/427262/YTEngineTests.user.js
// @updateURL https://update.greasyfork.org/scripts/427262/YTEngineTests.meta.js
// ==/UserScript==

(function() {
    'use strict';
	// FULLSCREEN
	let fss = {};
	setInterval (function () {
		let p = document.querySelectorAll ('button.ytp-fullscreen-button');
		if (!p || !p.length)
			return;
		p = p [0];
		if (p === fss.node)
			return;
		fss.node = p;
		p.addEventListener ('click', function () {
			const ep = document.getElementById ("movie_player");
			if (ep && ep.isFullscreen)
				console.log (document.mozFullScreenElement, ep.isFullscreen ());
			else
				console.log (document.mozFullScreenElement);
			if (document.mozFullScreenElement) {
				document.mozCancelFullScreen ();
				return;
				}
			let q = document.querySelectorAll ('ytd-player');
			if (q && q.length)
				q [0].mozRequestFullScreen ();
			});
		}, 1000);
	document.addEventListener ('mozfullscreenchange', function () {
		if (document.mozFullScreenElement === document.documentElement)
			document.mozCancelFullScreen ();
		});
	}) ();