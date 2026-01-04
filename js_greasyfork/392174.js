// ==UserScript==
// @name         Erome Image Viewer
// @namespace    https://github.com/kittenparry/
// @version      1.0
// @description  View the full images on Erome by clicking a button under them.
// @author       kittenparry
// @match        https://www.erome.com/a/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/392174/Erome%20Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/392174/Erome%20Image%20Viewer.meta.js
// ==/UserScript==

let img_divs = document.querySelectorAll('.img');

img_divs.forEach(div => {
	let group = div.parentElement;
	let img = div.firstElementChild;
	if (img.tagName == 'IMG') {
		group.innerHTML += `<a class='btn btn-pink' href="${img.src}">View Full Image</a>`;
	}
});
