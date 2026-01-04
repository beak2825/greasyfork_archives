// ==UserScript==
// @name         ScottDaWozify
// @version      1.0
// @license      MIT
// @namespace   https://theghostboi64.github.io/
// @description  Adds Scott The Woz to all YouTube thumbnails
// @author       Ghost64
// @include      https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473465/ScottDaWozify.user.js
// @updateURL https://update.greasyfork.org/scripts/473465/ScottDaWozify.meta.js
// ==/UserScript==
(new MutationObserver(() =>
	document.querySelectorAll('ytd-thumbnail yt-image, .ytp-videowall-still-image')
		.forEach(e => {
			if (e.classList.contains('scottdawozified')) return;
			let img = document.createElement('IMG');
			img.src = `https://theghostboi64.github.io/scottdawozify/images/ScottDaWozify${Math.floor(Math.random()*5)+1}.PNG`;
			img.style.position = 'absolute';
			img.style.width = '100%';
			img.style.left = 0;
			img.style.bottom = 0;
			img.style.objectFit = 'cover';
			e.append(img);
			e.classList.add('scottdawozified');
		})
)).observe(document.querySelector('ytd-page-manager'), {subtree: true, childList: true});

