// ==UserScript==
// @name         youtube
// @include      https://www.youtube.com/watch?v=*
// @supportURL   https://github.com/sxlgkxk/browser_script/issues
// @version      0.1
// @description  youtube script
// @namespace    http://sxlgkxk.github.io/
// @author       sxlgkxk
// @icon         http://sxlgkxk.github.io/im/avatar.jpg
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/444971/youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/444971/youtube.meta.js
// ==/UserScript==

(function () {
	let container, dom;

	let wait_ytb_interval=setInterval(function(){
		container=document.querySelector('#info-contents > ytd-video-primary-info-renderer');
		if(!container) return;
		clearInterval(wait_ytb_interval);

		dom=document.createElement('div');
		dom.id='sxlgkxk-youtube-container';

		let youtubeId=location.href.match(/v=([^&]+)/)[1];
		// let title=document.querySelector('#container > h1 > yt-formatted-string').innerText.replace('"', "'");
		let title=document.title.replace('"', "'");

		dom.innerHTML=`<h1>{%ytb ${youtubeId} "${title}" %}</h1>
			<style>
				#sxlgkxk-youtube-container {
					width: 100%;
					text-align: center;
					background-color: #ddd;
					color: #000;
					padding: 10px;
				}
			</style>
		`
		container.prepend(dom);
	},1000);

})();