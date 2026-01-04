// ==UserScript==
// @name         Erome Video Download
// @namespace    greasyfork.org
// @version      1.2
// @description  Shows Erome.com Video Download Links
// @author       malakai2
// @match        https://www.erome.com/*
// @icon         https://www.erome.com/favicon.ico
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481004/Erome%20Video%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/481004/Erome%20Video%20Download.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let addLink = function(media) {
		let tagName = media.tagName;
		let src;
		let sourceElement = media.querySelector('source');
		src = !src && sourceElement ? sourceElement.src : '';

		let br = document.createElement('br');
		let link = document.createElement('a');
        link.style = "display:block;text-align:center;font-weight:bold;text-decoration:underline;";
		link.setAttribute('href', src);
		link.download = '';
		link.textContent = 'Download:- ' + src.split('/').pop();
		link.target = '_blank';
		link.rel = 'noopener';
		link.onclick = function(e) {
			e.preventDefault();
			let src = e.target.href;
			let fname = src.split('/').pop();
			GM_download(src,fname);
		};
		media.parentElement.parentElement.appendChild(link);
		media.parentElement.parentElement.appendChild(br);
	}

	let init = function() {
		let mediaElements = document.querySelectorAll('.media-group .video video');

		for (let i = 0; i < mediaElements.length; i++) {
			let media = mediaElements[i];
			addLink(media);
		}
	}
    if(document.readyState !== 'loading') init();
    else document.addEventListener("DOMContentLoaded", init);
})();