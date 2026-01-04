// ==UserScript==
// @name         GBT HTML5 native player and full preload (GBTPP)
// @version      4.51
// @namespace    _pc
// @description  Replaces fluid player with browsers HTML5 native player, initialises native preload and proceeds full preload in background.
// @author       verydelight
// @license      MIT
// @connect      gayporntube.com
// @icon         https://www.gayporntube.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_download
// @grant        GM_xmlHttpRequest
// @grant        GM.download
// @match	     *://*.gayporntube.com/video/*
// @webRequest   {"selector":"*fluidplayer*","action":"cancel"}
// @downloadURL https://update.greasyfork.org/scripts/519345/GBT%20HTML5%20native%20player%20and%20full%20preload%20%28GBTPP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519345/GBT%20HTML5%20native%20player%20and%20full%20preload%20%28GBTPP%29.meta.js
// ==/UserScript==
(async function() {
	const videoplayer = document.getElementById('play-video');
	const videoplayerSource = videoplayer.querySelector('source');
	const pattern = /\/\?br=\d*$/;
	if (videoplayerSource) {
		const src = videoplayerSource.src.replace(pattern, '');
		if (src !== videoplayerSource.src) {
			videoplayerSource.src = src;
		}
		videoplayer.removeAttribute("height");
		videoplayer.removeAttribute("width");
		await videoplayer.focus();
		await videoplayer.play();
		await videoplayer.pause();
		await downloadVideo(videoplayerSource.src);
	}
	async function downloadVideo(url) {
		try {
			const response = await GM.xmlHttpRequest({
				method: 'GET',
				responseType: 'blob',
				url: url,
				headers: {
					"Content-Type": "video/mp4",
					"Accept": "video/mp4"
				},
			});
			const blob = new Blob([response.response], { type: 'video/mp4' });
			const objectUrl = URL.createObjectURL(blob);
			const { currentTime, paused, ended } = videoplayer;
			videoplayerSource.src = objectUrl;
			await videoplayer.load();
			videoplayer.currentTime = currentTime;
			if (!paused && !ended && currentTime > 0) {
				videoplayer.play();
			}
		} catch (err) {
			console.error("GBTPP: Error in fetching and downloading file: ", err);
		}
	}
})();