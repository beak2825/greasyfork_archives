// ==UserScript==
// @name         Radioitalia fullscreen
// @namespace    https://www.radioitalia.it/
// @version      0.1
// @description  Add a fullscreen button for a radioitalia website
// @author       You
// @match        https://www.radioitalia.it/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466734/Radioitalia%20fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/466734/Radioitalia%20fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

	const videoId = 'RadioItaliaPlayer_html5_api';

	const button = document.createElement('button');
	button.innerText = 'Fullscreen';
	button.style.position = 'absolute';
	button.style.right = '100px';
	button.style.bottom = '100px';
	button.onclick = () => {
		const video = document.getElementById(videoId);
		video.requestFullscreen();
	};

	button.style.zIndex = 1000;
	document.body.appendChild(button);
    // Your code here...
})();