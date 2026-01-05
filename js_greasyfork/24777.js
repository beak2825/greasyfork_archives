// ==UserScript==
// @name        PC World disable autoplaying how-to video
// @namespace   linagkar
// @description Disables autoplay for the video in the right sidebar on PC World
// @include     *://www.pcworld.com/*
// @include     *://pcworld.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24777/PC%20World%20disable%20autoplaying%20how-to%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/24777/PC%20World%20disable%20autoplaying%20how-to%20video.meta.js
// ==/UserScript==

const vid = document.getElementById('bcplayer-rightrail_html5_api');
if (vid !== null) {
	let stopPlaying;
	stopPlaying = () => {
		vid.pause();
		vid.removeEventListener('play', stopPlaying);
	};
	vid.addEventListener('play', stopPlaying);
}
