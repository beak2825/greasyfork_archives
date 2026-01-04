// ==UserScript==
// @name         iFunny Video Resize
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Resizes videos on iFunny to match browser window.
// @author       Zeval
// @match        https://ifunny.co/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ifunny.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459922/iFunny%20Video%20Resize.user.js
// @updateURL https://update.greasyfork.org/scripts/459922/iFunny%20Video%20Resize.meta.js
// ==/UserScript==

(function () {
	'use strict';
	try {
		var vids = document.getElementsByTagName('video');
		console.log(vids);
		let headerHeight = 56;
		let newHeight = (window.innerHeight - headerHeight).toString() + 'px';

		if (!vids) return;
		// add top padding so video is not put behind header
		vids[0].parentElement.parentElement.parentElement.parentElement.parentElement.style.paddingTop =
			headerHeight.toString() + 'px';
		// resize vid
		vids[0].style.height = newHeight;
        const newWidth = '100%';
        const parentNewWidth = '90vw';
        vids[0].parentElement.parentElement.style.width = newWidth; // highest level div containing the video
        vids[0].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.maxWidth = parentNewWidth; // parent div that contains the trending section, menu navigation, and the video
        vids[0].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.width = parentNewWidth; // same
		// resize parent divs and comments
		vids[0].parentElement.style.height = newHeight;
		vids[0].parentElement.parentElement.style.height = newHeight;
		vids[0].parentElement.parentElement.parentElement.style.height = newHeight;
		vids[0].parentElement.parentElement.parentElement.parentElement.style.height = newHeight;
		vids[0].parentElement.parentElement.style.paddingTop = '0px';

		document.getElementById('comments').style.paddingTop = '170px';
	} catch (e) {
		console.error(e);
	}
})();
