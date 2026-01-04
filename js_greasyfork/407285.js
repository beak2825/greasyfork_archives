// ==UserScript==
// @name         YoutubeWhy
// @include      https://www.youtube.com/*
// @version      28
// @description  Clicks the dumb age verification button new accounts are forced to click, and also bypasses the warning placed on user created videos that counter-signal google's financial interests.
// @author Wepwawet
// @grant        none
// @namespace sc
// @downloadURL https://update.greasyfork.org/scripts/407285/YoutubeWhy.user.js
// @updateURL https://update.greasyfork.org/scripts/407285/YoutubeWhy.meta.js
// ==/UserScript==
//
function code()
{
	var r18 = document.querySelector('#reason');
	if (!r18) r18 = document.querySelector('yt-formatted-string.yt-button-renderer');
	if (r18 && r18.innerText == 'I UNDERSTAND AND WISH TO PROCEED' || r18 && r18.innerText == 'This video may be inappropriate for some users.')
	{
		window.stop();
		// location.replace(document.URL + '&bpctr=9999999999&has_verified=1'); // bpctr stopped working
		location.replace(document.URL + '&has_verified=1');
		return;
	}
}
window.onload = code;
window.addEventListener('yt-navigate-start', code, true);
window.addEventListener('yt-page-data-updated', code, true);
window.addEventListener('yt-action', code, true);
window.addEventListener('yt-navigate-finish', code, true);
window.addEventListener('yt-navigate-finish', code, true);
window.addEventListener('onPolymerReady', code, true);
