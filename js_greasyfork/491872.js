// ==UserScript==
// @name            IMDb Image Extractor
// @namespace    https://github.com/ollm/
// @version      0.2.1
// @description  Displays links to easily extract individual images from IMDb
// @author       ollm
// @license         MIT
// @homepageURL     https://github.com/ollm/IMDb-Image-Extractor
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @match        https://*.imdb.com/*/mediaviewer/*
// @include         https://*.imdb.com/*/mediaviewer/*
// @inject-into     content

// @downloadURL https://update.greasyfork.org/scripts/491872/IMDb%20Image%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/491872/IMDb%20Image%20Extractor.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Personalized Sizes
	const personalizedSizes = [
		1920, // FHD
		3840, // UHD
		5000, // IMDb max size
	];

	// Add Google's own CSS used for image dimensions
	addGlobalStyle(`
		.imdbImagesLinksList {
			position: absolute;
			top: 64px;
			left: 0;
			margin: 10px 0px;
			padding: 4px 6px;
			font-family: Roboto-Medium,Roboto,Arial,sans-serif;
			font-size: 10px;
			line-height: 12px;
			z-index: 100;
		}

		.imdbImagesLinksList a {
			text-decoration: none;
		}

		.imdbImagesLinksList span {
			margin: 0px 4px;
			padding: 4px;
			color: #000;
			background-color: rgba(255,255,255,.5);
			border-radius: 6px;
			text-decoration: none;
		}
		`);

	function sizesToHtml(sizes) {

		let html = '';

		for(let key in sizes)
		{
			html += '<a href="'+sizes[key].src+'" target="_blank"><span>'+sizes[key].text+'</span></a>';
		}

		return html;

	}

	function showImagesLinksList() {

		const parent = document.querySelector('main > div.ipc-page-content-container');
		const image = document.querySelector('.media-viewer > div img:not(.peek)');

		let srcset = image.getAttribute('srcset').split(',');

		let first = false;
		let sizes = [];
		let pSizes = [];

		for(let key in srcset)
		{
			let split = srcset[key].trim().split(' ');
			let text = split[1];
			let src = split[0];

			sizes.push({
				text: text.replace(/[^0-9]/iug, '')+'p',
				src: src,
			});

			if(first === false)
				first = src;
		}

		for(let key in personalizedSizes)
		{
			pSizes.push({
				text: personalizedSizes[key]+'p',
				src: first.replace(/jpg_([A-Z]+)[0-9]+_\.jpg/, 'jpg_$1'+personalizedSizes[key]+'_.jpg'),
			});
		}

		// original size (_V1_.jpg)
		const originalSrc = image.src.replace(/(_V1)_.+\.jpg$/, '$1_.jpg');
		let original = [{
			text: 'Original',
			src: originalSrc,
		}];

		let html = sizesToHtml(original) + ' | ' + sizesToHtml(pSizes) + ' | ' + sizesToHtml(sizes);

		let imagesLinksList = document.querySelector('.imdbImagesLinksList');

		if(imagesLinksList)
			imagesLinksList.innerHTML = html;
		else
			parent.insertAdjacentHTML('beforeend', '<div class="imdbImagesLinksList">'+html+'</div>');
	}

	// Run script once on document ready
	showImagesLinksList();

	// Initialize new MutationObserver
	const mutationObserver = new MutationObserver(showImagesLinksList);

	// Let MutationObserver target the images
	const targetNode = document.querySelector('.media-viewer');

	// Run MutationObserver
	mutationObserver.observe(targetNode, { childList: true, subtree: true });

	function addGlobalStyle(css) {
		const head = document.getElementsByTagName('head')[0];
		if (!head) return;
		const style = document.createElement('style');
		style.textContent = css;
		head.appendChild(style);
	}
})();