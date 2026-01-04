// ==UserScript==
// @name	 	PKGA YouTube Theater Mode
// @description A more fullscreen experience for theater mode
// @license GNU GPLv3
// @namespace /lig/
// @version		13
// @grant GM.info
// @include		https://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/442089/PKGA%20YouTube%20Theater%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/442089/PKGA%20YouTube%20Theater%20Mode.meta.js
// ==/UserScript==
const appendStyle = (css, id = '', doc = document) => {
	const style = document.createElement('style');
	style.id = id;
	style.innerHTML = css;
	doc.head.appendChild(style);
	return style;
}

// main style
const mainCSS = `
#ytc-filter .vc-toolbar button[title="Show ytcFilter"] {
	right: 0 !important;
	position: absolute;
}

button.html5-video-info-panel-close {
	left: 5px;
	right: unset !important;
}

.seventv-yt-theater-mode-button-container {
	display: none;
}

.seventv-overlay > div > div {
	transform: none !important;
	width: 100%;
	height: 100%;
}

.seventv-emote-menu {
	box-sizing: border-box;
	left: unset !important;
	max-width: 100% !important;
	max-height: calc(100% - 105px);
}

.seventv-emote-menu .seventv-emote-menu-tab {
	max-height: 30px !important;
	min-height: 20px;
}

.seventv-emote-menu-header > button:after {
	color: white !important;
	font-weight: bold;
	margin: auto;
	margin-left: 5px;
}

.seventv-emote-menu-header > button:nth-child(1):after {
	content: "7TV";
}

.seventv-emote-menu-header > button:nth-child(2):after {
	content: "BTTV";
}

.seventv-emote-menu-header > button:nth-child(3):after {
	content: "FFZ";
}

.seventv-emote-menu-header > button {
	border-color: #aaa;
	border-width: 1px;
	border-radius: .4rem;
}

.seventv-emote-menu-header > button.selected {
	border-color: #fff;
}

.seventv-emote-menu .seventv-emote-menu-scrollable {
	padding-top: 0;
}

.seventv-emote-menu .seventv-emote-menu-tab img {
	width: auto;
	height: 25px;
	margin-left: auto;
}

.seventv-emote-menu-scrollable {
	max-height: calc();
}

.iaextractor-webx-iframe {
	z-index: 10000;
}

* {
	scrollbar-color: #727273 #171719;
}

::-webkit-scrollbar-button {
	background: #727273 !important;
}

::-webkit-scrollbar-thumb {
	background: #727273 !important;
}

::-webkit-scrollbar-track {
	background: #171719 !important;
}

app-drawer[opened] {
	z-index: 10000
}

#clarify-box {
	display:none !important;
}

/*  Chat container  */
body.theater ytd-live-chat-frame#chat {
	/*min-height: 0 !important;
	height: 40px !important;
	min-width: 0 !important;
	width: 50px;
	overflow: hidden;
	border: hidden;*/
	margin: 0 !important;
	position: absolute;
	top: 0 !important;
	right: 0;
	width: calc(12.79vw) !important;
	min-width: 285px;
	max-width: 440px;
	border-width: 0px !important;
	pointer-events: none;
	overflow: visible !important;
}

/*  Chat panel  */
body.theater ytd-live-chat-frame#chat iframe.ytd-live-chat-frame {
	position: absolute;
	top: 0px;
	right: 0;
	width: calc(12.79vw) !important;
	min-width: 285px;
	max-width: 440px;
	height: 100vh;
	z-index: 0;
	pointer-events: auto;
}

ytd-watch-flexy[fullscreen] #full-bleed-container.live-chat ~ #columns #chat iframe {
	height: calc(100vh - 75px);
}

body.theater.live-chat-top ytd-live-chat-frame#chat iframe.ytd-live-chat-frame {
	top: var(--video-height);
	max-width: 100vw;
	width: 100vw !important;
	height: var(--chat-height);
}

/*  Toggle Button  */
#show-hide-button tp-yt-paper-button#button.ytd-toggle-button-renderer {
	z-index: 1001;
	position: absolute;
	top: 0px;
	right: 0;
	/*width: 30px !important;*/
	height: 30px;
	padding: 3px !important;
	pointer-events: auto;
	/*transform: translate(300px, 0);*/
}

#show-hide-button yt-formatted-string#text.ytd-toggle-button-renderer {
	width: 40px;
	filter: drop-shadow(0 0 5px #000);
}

#show-hide-button paper-ripple {
	width: 40px;
}

.live-chat-top #show-hide-button tp-yt-paper-button#button.ytd-toggle-button-renderer[aria-pressed="false"] {
	/*top: calc(var(--video-height));*/
}

@media only screen and (max-width: 750px) {}

/*  super chat ticker  */
.live-chat-top yt-live-chat-renderer #ticker.yt-live-chat-renderer {
	left: 127px;
	right: 107px;
	transform: translateY(-40px);
	position: absolute;
	z-index: 10000;
}

.live-chat-top yt-live-chat-renderer #ticker.yt-live-chat-renderer #items {
	padding-bottom: 0;
}

.live-chat-top yt-live-chat-renderer #contents {
	overflow: visible !important;
}

/* Resize the player in theater mode only */
ytd-watch-flexy[theater]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy {
	max-height: 100vh;
	height: 100vh;
}

/*  Live Chat Variant  */
ytd-watch-flexy[theater]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy.live-chat,
ytd-watch-flexy[fullscreen] #full-bleed-container.ytd-watch-flexy.live-chat {
	left: 0;
	right: min(440px, max(285px, calc(12.79vw)));
	width: calc(100vw - min(440px, max(285px, calc(12.79vw)))) !important;
}

.live-chat-top ytd-watch-flexy[theater]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy.live-chat {
	width: 100vw !important;
	height: var(--video-height);
	margin-bottom: var(--chat-height);
	right: 0;
	min-height: 0 !important;
}

ytd-watch-flexy[fullscreen] #full-bleed-container.ytd-watch-flexy.live-chat .html5-video-container {
	width: 100%;
	height: 100%;
}

ytd-watch-flexy[fullscreen] #full-bleed-container.ytd-watch-flexy.live-chat .html5-video-container video {
	width: 100% !important;
}

body.theater #show-hide-button {
	pointer-events: all;
	width: 102px;
	left: 114px;
	position: absolute;
}

#show-hide-button button {
	height: 30px;
}

body.theater.live-chat-top #show-hide-button {
	top: var(--video-height);
}

.yt-spec-button-shape-next--button-text-content {
	text-overflow: clip;
	width: 64px;
}

#ytc-filter,
#ytc-filter > div,
#ytc-filter .vc-toolbar {
	pointer-events: none;
}

div.vc-toolbar > * {
	pointer-events: all;
}

body.no-ytc-filter yt-live-chat-header-renderer {
	margin-top: 30px;
}

body.no-ytc-filter #show-hide-button {
	left: unset;
	right: 0;
}

body.theater #show-hide-button.chat-hidden {
	top: 0;
	right: 0;
	left: unset;
	width: unset;
}

body.theater #show-hide-button.chat-hidden .yt-spec-button-shape-next--button-text-content {
	width: unset;
}

`;
appendStyle(mainCSS, 'pkga-css');

const watchCSS = `
	html::-webkit-scrollbar,
	body::-webkit-scrollbar {
		display: none;
	}

	body, html {
		scrollbar-width: none;
	}

	body.theater #masthead-container {
		position: fixed;
		opacity: 0;
		transition: opacity 0.25s, transform 0.3s ease !important;
		pointer-events: none;
	}

	body.theater #masthead-container:hover,
	body.theater #masthead-container:focus,
	body.theater #masthead-container.show-header {
		opacity: 1;
	}

	body.theater ytd-searchbox.ytd-masthead {
		margin-left: 9px;
	}

	#search-icon-legacy.ytd-searchbox {
		width: 35px;
	}

	body.theater #masthead {
		border-bottom-left-radius: 15px;
		border-bottom-right-radius: 15px;
		box-shadow: 0 0 20px #000a;
		margin: 0 auto;
		pointer-events: auto;
	}

	body.theater #masthead,
	body.theater #masthead #background {
		width: calc(100vw - 700px);
		max-width: min(1750px, calc(100vw - 2*min(440px, max(285px, calc(12.79vw)))));;
		min-width: 750px;
	}

	body.theater.live-chat-top #masthead,
	body.theater.live-chat-top #masthead #background {
		width: calc(100vw - 200px);
		max-width: unset;
		min-width: 450px;
	}

	body.theater #masthead-bg {
		position: fixed;
		z-index: -1;
		background: #0006;
		pointer-events: none;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		transition: opacity 0.25s;
		opacity: 0;
	}

	body.theater .show-header #masthead-bg {
		opacity: 0;
	}

	body.theater #page-manager {
		margin-top: 0 !important;
	}

	ytd-watch-flexy[theater] #secondary {
		position: unset !important;
	}

	ytd-watch-flexy[flexy][js-panel-height_] #chat.ytd-watch-flexy:not([collapsed]).ytd-watch-flexy, ytd-watch-flexy[flexy][js-panel-height_] #chat-container.ytd-watch-flexy:not([chat-collapsed]).ytd-watch-flexy {
		height: var(--chat-height) !important;
		border-radius: 0 !important;
	}

	body.live-chat-top ytd-watch-flexy[flexy][js-panel-height_] #chat.ytd-watch-flexy:not([collapsed]).ytd-watch-flexy, ytd-watch-flexy[flexy][js-panel-height_] #chat-container.ytd-watch-flexy:not([chat-collapsed]).ytd-watch-flexy {
		height: 0 !important;
	}

	ytd-live-chat-frame[rounded-container] iframe.ytd-live-chat-frame {
		border-radius: 0 !important;
	}

	body.theater.live-chat-top #chat {
		width: 100vw !important;
		left: 0 !important;
		right: 0 !important;
		max-width: 100vw !important;
	}

	@media screen and (max-width: 1015px) {
		.live-chat-top #chat {
			top: calc(-14px - 100vh) !important;
			left: 0 !important;
			right: 0 !important;
			z-index: 100000;
		}

		.live-chat-top #chatframe {
			left:-24px !important;
			right: 0 !important;
		}
	}

	#ytd-player .html5-video-container {
		height: 100%;
	}

	#ytd-player video {
		object-fit: contain;
		object-position: center;
		width: 100% !important;
		height: 100% !important;
		left: unset !important;
		right: unset !important;
		top: unset !important;
		bottom: unset !important;
		transform: none !important;
	}

	body.theater #panels-full-bleed-container {
		width: min(440px, max(285px, calc(12.79vw))) !important;
	}
`;

const waitingRoomCSS = `
#ytp-offline-slate {
	max-height: calc(100vh - 56px);
}
`;

let delay = ms => new Promise(res => setTimeout(res, ms));

let checkForHTML = async (selector, element = document) => {
	let selected;
	while(true) {
		if(selected = element.querySelector(selector))
			return selected;
		await delay(100);
	}
}

let getAnimationFrame = () => new Promise(res => requestAnimationFrame(res));

function getCookies() {
	let cookies = {};
	for(let [k,v] of document.cookie.split('; ').map(e => e.split('=')))
		cookies[k] = v;
	return cookies;
}

if(parseInt(getCookies().wide || 0) == 1) {
	document.body.classList.add('theater');
	window.dispatchEvent(new Event('resize'));
}

document.addEventListener('click', async e => {
	let target;
	if(target = e.target.closest('button.ytp-size-button')) {
		document.body.classList.toggle('theater');
	} else if(target = e.target.closest('#show-hide-button')) {
		await getAnimationFrame();
		let player = document.querySelector('#full-bleed-container.ytd-watch-flexy');
		if(target.innerText.toUpperCase().startsWith('SHOW CHAT')) {
			player.classList.remove('live-chat');
			target.classList.add('chat-hidden');
		} else {
			player.classList.add('live-chat');
			target.classList.remove('chat-hidden');
		}
		window.dispatchEvent(new Event('resize'));
	}
});

let root = document.body.parentElement,
	header = document.querySelector('#masthead-container'),
	lastScroll = 0;
document.addEventListener('scroll', e => {
	/*let currentScroll = Date.now();
	if(currentScroll - lastScroll < 100) return;
	lastScroll = currentScroll;*/
	if(!header) header = document.querySelector('#masthead-container');
	if(root.scrollTop != 0)
		header.classList.add('show-header');
	else header.classList.remove('show-header');
});

function checkIfLiveChat() {
	return document.querySelector('#chat')
		&& document.querySelector('#show-hide-button').innerText.toUpperCase().startsWith('HIDE CHAT');
}

(async() => {
	let watchStyle;
	while(true) {
		(() => {
			let player = document.querySelector('ytd-watch-flexy:not([hidden]) #full-bleed-container'),
				video = player ? player.querySelector('video'):null,
				offline = document.querySelector('.ytp-offline-slate');
			if(player && (video && video.src || offline)) {
				//console.log('[PKGA Theater Mode] video', video);
				if(!watchStyle) {
					appendStyle(watchCSS, 'pkga-watch-css');
					getAnimationFrame().then(() => document.documentElement.scrollTop = 0);
					watchStyle = document.querySelector('#pkga-watch-css');
				}
				let isLiveChat = checkIfLiveChat();
				if(isLiveChat) {
					player.classList.add('live-chat');
					document.querySelector('#show-hide-button').classList.remove('chat-hidden');
					let chatDocument = document.querySelector('#chatframe').contentDocument;
					if(!chatDocument || !chatDocument.body || !chatDocument.head)
						return;
					if(!chatDocument.querySelector('#ytc-filter')) {
						document.body.classList.add('no-ytc-filter');
						chatDocument.body.classList.add('no-ytc-filter');
					} else {
						document.body.classList.remove('no-ytc-filter');
						chatDocument.body.classList.remove('no-ytc-filter');
					}
					if(!chatDocument.querySelector('#pkga-css'))
						appendStyle(mainCSS, 'pkga-css', chatDocument);
					//await getAnimationFrame();
					//window.dispatchEvent(new Event('resize'));
				} else if(player.classList.contains('live-chat')) {
					player.classList.remove('live-chat');
					//await getAnimationFrame();
					//window.dispatchEvent(new Event('resize'));
				}
				/*document.querySelector('#movie_player').classList.add('ytp-big-mode');*/
			} else if(watchStyle) {
				watchStyle.remove();
				watchStyle = null;
			}
		})();
		await delay(100);
	}
})();

let oldVideo;
(async() => {
	while(true) {
		let video = document.querySelector('ytd-watch-flexy:not([hidden]) #full-bleed-container video');
		if(!video) {
			if(video = document.querySelector('.ytp-offline-slate-background')) {
				video.src = video.getAttribute('style');
				video.offline = true;
			}
		}
		if(video && (!oldVideo || oldVideo.src != video.src)) {
			if(video.offline) {
				//console.log('[PKGA Theater Mode] Offline Stream Found');
				setTopChat();
			} else if(!video.videoWidth) {
				await new Promise(res => {
					video.addEventListener('loadedmetadata', res);
				});
				setTopChat();
			}
		}
		oldVideo = video;
		await delay(100);
	}
})();

(async() => {
	let header = await checkForHTML('#masthead-container');
	header.addEventListener('focusin', e => {
		header.classList.add('show-header');
	});
	header.addEventListener('focusout', e => {
		header.classList.remove('show-header');
	});
})();

let lastResize = 0;

async function setTopChat(currentResize = Date.now()) {
	let video = document.querySelector('ytd-watch-flexy:not([hidden]) #full-bleed-container video'),
		offline = document.querySelector('.ytp-offline-slate'),
		player = document.querySelector('#full-bleed-container');
	if(!(player && (video || offline))) return;
	if(!checkIfLiveChat()) {
		document.body.classList.remove('live-chat-top');
	}
	if(video && (!oldVideo || oldVideo.src != video.src)) {
		if(!video.videoWidth) {
			await new Promise(res => {
				video.addEventListener('loadedmetadata', res);
			});
			if(currentResize < lastResize) return;
		}
	}
	let videoHeight = video ? Math.round(video.videoHeight*window.innerWidth/video.videoWidth):720*window.innerWidth/1280,
		chatHeight = window.innerHeight - videoHeight,
		chatDocument = document.querySelector('#chatframe');
	chatDocument = chatDocument ? chatDocument.contentDocument:null;
	if(chatHeight >= 350) {
		for(let e of [document, chatDocument]) {
			if(!e) continue;
			e.body.classList.add('live-chat-top');
			e.documentElement.style.setProperty('--chat-height', chatHeight+'px');
			e.documentElement.style.setProperty('--video-height', videoHeight+'px');
		}
	} else {
		document.body.classList.remove('live-chat-top');
		chatDocument && chatDocument.body.classList.remove('live-chat-top');
	}
	//console.log('[PKGA Theater Mode] videoHeight', videoHeight, 'chatHeight', chatHeight);
}

window.addEventListener('resize', async e => {
	let currentResize = Date.now();
	do {
		if(currentResize <= lastResize) break;
		else if(currentResize - lastResize > 100) {
			setTopChat(currentResize);
			lastResize = currentResize;
			break;
		} else await delay(currentResize - lastResize + 10);
	} while(true);
});