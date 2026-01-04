// ==UserScript==
// @name         Instagram Image Viewer
// @namespace    https://github.com/kittenparry/
// @version      0.3
// @description  View the full image with the click of a button (or D key press).
// @author       kittenparry
// @match        https://www.instagram.com/p/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/377853/Instagram%20Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/377853/Instagram%20Image%20Viewer.meta.js
// ==/UserScript==

/* CHANGELOG:
 * 0.3:   fix bad url timestamp error
 * 0.2.1: use a var to store img url to save those bytes in script file size
 * 0.2:   fix the functionality | only gets the last image in image sets
 * 0.1:   initial
 */

window.addEventListener('load', () => {
	let img_url = document.querySelector('img[class="FFVAD"]').src;

	window.addEventListener('keydown', (e) => {
		var type = e.target.getAttribute('type');
		var tag = e.target.tagName.toLowerCase();
		if (type != 'text' && tag != 'textarea') {
			if (e.keyCode == 68) {
				window.location = img_url;
			}
		}
	}, false);

	document.querySelector('nav[class="NXc7H jLuN9  "]').innerHTML += '<a href="' + img_url + '" style="color: #7f8a94;"><div style="position: fixed; bottom: 50%; right: 0px; border-radius: 15px 0px 0px 15px; background: #faf0e6; padding: 13px; border: 2px solid #7f8a94; border-right-style: none;"><i style="border: solid black; border-width: 0 3px 3px 0; display: inline-block; padding: 3px; transform: rotate(45deg); -webkit-transform: rotate(45deg);"></i></div></a>';
});
