// ==UserScript==
// @name         Poorchat na kick.com/wonziu
// @description  Podmienia czat Kicka na Poorchat u Wonzia (poorchat.net jadisco.pl pancernik.info Wonziu)
// @version      1.1.1
// @author       Pabli
// @license      MIT
// @homepageURL  https://greasyfork.org/scripts/518121-poorchat-na-kick-com-wonziu
// @supportURL   https://greasyfork.org/scripts/518121-poorchat-na-kick-com-wonziu/feedback
// @namespace    https://github.com/pabli24
// @match        https://kick.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIGZpbGw9IiM1M2ZjMTgiIHN0cm9rZT0iIzUzZmMxOCIgc3Ryb2tlLXdpZHRoPSIwIiB2aWV3Qm94PSItNiAtNiA3MiA3MiI+PHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiB4PSItNiIgeT0iLTYiIGZpbGw9IiMxNDE1MTciIHN0cm9rZT0ibm9uZSIgcng9IjAiLz48ZyBzdHJva2U9Im5vbmUiPjxwYXRoIGQ9Ik0yNiA5LjZDMTEuNyA5LjYgMCAyMCAwIDMzYzAgNC41IDEuNCA4LjkgNC4xIDEyLjYtLjUgNS42LTEuOSA5LjctMy44IDExLjdBMSAxIDAgMCAwIDEgNTljLjQgMCA4LjUtMS4yIDE0LjQtNC42IDMuMyAxLjMgNi44IDIgMTAuNSAyQzQwLjMgNTYuNCA1MiA0NiA1MiAzM1M0MC4zIDkuNiAyNiA5LjZ6Ii8+PHBhdGggZD0iTTU1LjkgMzdjMi43LTMuNyA0LjEtOCA0LjEtMTIuNkM2MCAxMS41IDQ4LjMgMSAzNCAxYy04LjIgMC0xNiAzLjYtMjAuOCA5LjRBMzAgMzAgMCAwIDEgMjYgNy42QzQxLjQgNy42IDU0IDE5IDU0IDMzYzAgNS41LTIgMTAuNi01LjIgMTQuOEE1Mi4zIDUyLjMgMCAwIDAgNTkgNTAuNGExIDEgMCAwIDAgLjctMS43Yy0yLTItMy4zLTYtMy44LTExLjd6Ii8+PC9nPjwvc3ZnPg==
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/518121/Poorchat%20na%20kickcomwonziu.user.js
// @updateURL https://update.greasyfork.org/scripts/518121/Poorchat%20na%20kickcomwonziu.meta.js
// ==/UserScript==

(() => {

const CHAT = '#channel-chatroom';
const CHANNEL_PATCH = /^\/wonziu(\/|$)/;
const IFRAME_SRC = 'https://poorchat.net/channels/jadisco';

GM_registerMenuCommand('Otwórz Poorchat w nowym oknie', () => {
	window.open('https://poorchat.net/channels/jadisco', '_blank', windowFeatures());
});
GM_registerMenuCommand('Otwórz czat z Kicka w nowym oknie', () => {
	window.open('https://kick.com/popout/wonziu/chat', '_blank', windowFeatures());
});
GM_registerMenuCommand('Otwórz live na YouTube', () => {
	window.open('https://www.youtube.com/channel/UCYN3DEMx3v31t5_ll3R0a5Q/live', '_blank');
});
GM_registerMenuCommand('Otwórz Jadisco.pl', () => {
	window.open('https://jadisco.pl/', '_blank');
});

function windowFeatures() {
	const width = 400;
	const height = 900;
	let left = 0;
	let top = 0;

	left = window.screenLeft + Math.floor(window.screen.width - width);
	top = window.screenTop + Math.floor((window.screen.height - height) / 2);

	return `left=${left},top=${top},width=${width},height=${height}`;
}

function insertPoorchat() {
	const chat = document.querySelector(CHAT);
	if (!chat || chat.dataset.poorchat) return;

	chat.dataset.poorchat = true;

	const iframe = document.createElement('iframe');
	iframe.src = IFRAME_SRC;
	iframe.allow = 'fullscreen; encrypted-media';
	iframe.style = 'width: 100%; height: 100%; border: none; position: relative;';

	chat.replaceChildren(iframe);
}

let observer = null;
function onRouteChange() {
	if (observer) {
		observer.disconnect();
		observer = null;
	}

	const path = window.location.pathname;
	if (!CHANNEL_PATCH.test(path)) return;

	insertPoorchat();

	observer = new MutationObserver(() => {
		insertPoorchat();
	});
	observer.observe(document.body, { childList: true, subtree: true });

	setTimeout(() => {
		if (observer) {
			observer.disconnect();
			observer = null;
		}
	}, 60 * 1000);
}

const origPushState = history.pushState;
history.pushState = function (...args) {
	const ret = origPushState.apply(this, args);
	onRouteChange();
	return ret;
};

window.addEventListener('popstate', onRouteChange);
window.addEventListener('resize', onRouteChange);
onRouteChange();

})();