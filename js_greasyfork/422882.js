// ==UserScript==
// @name        Open Youtube video on Holodex
// @description Add a button under the video to open the video on Holodex.net
// @namespace   OpenYoutubeOnHolodex
// @version     1.1.0
// @include     https://www.youtube.com/*
// @run-at      document-end
// @noframes    
// @downloadURL https://update.greasyfork.org/scripts/422882/Open%20Youtube%20video%20on%20Holodex.user.js
// @updateURL https://update.greasyfork.org/scripts/422882/Open%20Youtube%20video%20on%20Holodex.meta.js
// ==/UserScript==

const watchRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
const channelRegex = /(?:youtube\.com\/(?:channel)\/)([a-zA-Z0-9\-]+)/i;

function openOnHolodex() {
	const vid = window.location.href.match(watchRegex)?.[1];
	if (vid) {
		window.open(`https://holodex.net/watch/${vid}`, '_blank');
		return;
	}

	const cid = window.location.href.match(channelRegex)?.[1];
	if (cid) {
		window.open(`https://holodex.net/channel/${cid}`, '_blank');
		return;
	}
}

async function getVideoFromHolodexApi(vid) {
	const api = `https://holodex.net/api/v2/videos/${vid}`;
	const res = await fetch(api);
	const data = await res.json();
	return data;
}

async function reinitialize() {
	addButton();
	openHolodexButton.style.display = 'none';

	const vid = window.location.href.match(watchRegex)?.[1];
	if (vid) {
		const videoData = await getVideoFromHolodexApi(vid);
		if (videoData.id) {
			openHolodexButton.style.display = '';
		}
	}
}

function addButton() {
	const ytpRightControls = document.getElementsByClassName("ytp-right-controls")[0];
	const openOnHolodexButton2 = document.getElementsByClassName("openOnHolodexButton")[0];
	if (ytpRightControls && !openOnHolodexButton2) {
		ytpRightControls.prepend(openHolodexButton);
	}
}

const openHolodexButton = document.createElement("button");
openHolodexButton.className = "openOnHolodexButton ytp-button";
openHolodexButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" role="img" aria-hidden="true" class="v-icon__svg"><path fill="#ffffff" id="svg_1" d="m20.24992,8.99992l0,2l3.59,0l-9.83,9.83l1.41,1.41l9.83,-9.83l0,3.59l2,0l0,-7m-2,16l-14,0l0,-14l7,0l0,-2l-7,0c-1.11,0 -2,0.9 -2,2l0,14a2,2 0 0 0 2,2l14,0a2,2 0 0 0 2,-2l0,-7l-2,0l0,7z"/></svg>`;
openHolodexButton.title = openHolodexButton.ariaLabel = "Open on Holodex.net";
openHolodexButton.onclick = openOnHolodex;
openHolodexButton.style.display = 'none';

addButton();
setTimeout(async () => {
	await reinitialize();
}, 1000);

let storedHref = window.location.href;
new MutationObserver(async () => {
	if (storedHref !== window.location.href) {
		storedHref = window.location.href;
		console.log("【OpenYoutubeOnHolodex】URL Changed", storedHref, window.location.href);
		await reinitialize();
	}
}).observe(document, {
	childList: true,
	subtree: true,
});
