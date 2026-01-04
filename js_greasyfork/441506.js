// ==UserScript==
// @name        Bandcamp Current Title
// @version     1.3
// @author      raina
// @namespace   raina
// @description Shows currently playing track in the page/window/tab title
// @license     GPLv3
// @include     /^https?:\/\//
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/441506/Bandcamp%20Current%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/441506/Bandcamp%20Current%20Title.meta.js
// ==/UserScript==

window.self === window.top && window.siteroot && "https://bandcamp.com" == window.siteroot && (function() {

	const title = document.head.querySelector(`title`);
	const album = document.body.querySelector(`#name-section h2.trackTitle`).textContent.trim();
	const albumArtist = document.body.querySelector(`#name-section h3 span a`).textContent.trim();
	const currentTrack = document.body.querySelector('.inline_player .title');
	const year = document.body.querySelector(`.tralbum-credits`).textContent.match(/(?<=released.*)(\d{4})(?=\n)/)[0];
	let artist, track;

	let llamaTime;
	const llamaScroll = () => {
		observer.disconnect();
		title.textContent = title.textContent.slice(0,3) + title.textContent.slice(4) + title.textContent.slice(3,4);
		observer.observe(title, {childList:true});
	}

	const observer = new MutationObserver((mutationList, observer) => {

		let titleString = currentTrack.textContent;

		observer.disconnect();

		if (mutationList[0].addedNodes[0].data.includes("▶︎")) {
			if (track = titleString.split(" - ")[1]) {
				artist = titleString[0];
			} else {
				artist = albumArtist;
				track = currentTrack.textContent.trim();
			}
			title.textContent = `▶︎ ${album}, ${year})   ${artist} – ${track} (`.replace(/ /g, "\xa0");
			llamaTime = setInterval(llamaScroll, 250);
		} else {
			clearInterval(llamaTime);
			title.textContent = title.dataset.originalTitle;
		}

		observer.observe(title, {childList:true});

	});

	title.dataset.originalTitle = title.textContent.trim();
	observer.observe(title, {childList:true});

}());
