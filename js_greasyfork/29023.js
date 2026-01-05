// ==UserScript==
// @name        FixEdux
// @namespace   Marek Lukáš
// @description Simple userscript to disallow opening of lnks in a new window, thus fixing back/forth navigation through the whole Edux ecosystem.
// @include     https://edux.fit.cvut.cz/*
// @version     4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29023/FixEdux.user.js
// @updateURL https://update.greasyfork.org/scripts/29023/FixEdux.meta.js
// ==/UserScript==

async function fixEdux() {
	let array_of_detected_links = document.querySelectorAll('[target=\'_blank\']');
	let array_of_detected_images = document.querySelectorAll('img.media:not([style="max-width: 50vw;"])')
	let fixed_links_number = 0;
	let fixed_images_number = 0;

	for (let i = 0; i < array_of_detected_links.length; ++i) {
		array_of_detected_links[i].target = "";
		array_of_detected_links[i].innerHTML = array_of_detected_links[i].innerText + " (fixed)";
		fixed_links_number++;
	}

	for (let i = 0; i < array_of_detected_images.length; ++i) {
		array_of_detected_images[i].style.maxWidth = "50vw";
		fixed_images_number++;
	}
	if (fixed_links_number > 0) {
		console.log(fixed_links_number + " \"target=_blank\" links have been fixed");
	}
	if (fixed_images_number > 0) {
		console.log(fixed_images_number + " images have been fixed");
	}
}

window.onload = setInterval(fixEdux, 2000);