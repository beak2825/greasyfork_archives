// ==UserScript==
// @name         GOG - Search gameplay videos on YouTube and Twitch
// @namespace    amekusa.gog-gameplay-videos
// @author       amekusa
// @version      1.0.2
// @description  Adds links to gameplay videos on YouTube and Twitch. Made extremely simple & lightweight. No jQuery used. No side effects.
// @match        https://www.gog.com/game/*
// @match        https://www.gog.com/*/game/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @homepage     https://github.com/amekusa/monkeyscripts
// @downloadURL https://update.greasyfork.org/scripts/506043/GOG%20-%20Search%20gameplay%20videos%20on%20YouTube%20and%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/506043/GOG%20-%20Search%20gameplay%20videos%20on%20YouTube%20and%20Twitch.meta.js
// ==/UserScript==

(function (doc) {
	let NS = '--ns' + Math.floor(Math.random() * 10000); // namespace

	let m = doc.URL.match(/gog\.com\/(?:[^/]+\/)?game\/([^/]+)$/);
	if (!m) {
		console.error('Bad URL');
		return;
	}
	let game = m[1].replaceAll('_', '+');

	doc.addEventListener('DOMContentLoaded', () => {
		let box = doc.querySelector('.product-actions-body');
		if (!box) {
			console.error('Bad HTML');
			return;
		}

		let style = doc.createElement('style');
		style.innerHTML = /*css*/`
			#${NS}-watch-gameplay {
				margin-top: 1.5em;
				text-align: right;
			}
			#${NS}-watch-gameplay a {
				display: inline-block;
				border-radius: .25em;
				padding: .25em .5em;
				color: white;
				font-weight: bold;
				opacity: .5;
				transition: opacity .2s ease-out;
			}
			#${NS}-watch-gameplay a:hover,
			#${NS}-watch-gameplay a:focus {
				opacity: 1;
			}
			#${NS}-watch-gameplay a[href*="youtube.com"] {
				background-color: #ff0033;
			}
			#${NS}-watch-gameplay a[href*="twitch.tv"] {
				background-color: #9147ff;
			}
			#${NS}-watch-gameplay a svg {
				width: 18px;
				height: 18px;
				vertical-align: -.25em
			}
		`;
		doc.head.appendChild(style);

		let temp = doc.createElement('template');
		let attrs = `rel="external" target="_blank"`;
		let youtube = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-youtube"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg> YouTube`;
		let twitch = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-twitch"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path></svg> Twitch`;
		temp.innerHTML = `
			<div id="${NS}-watch-gameplay">
				Watch gameplay on
				<a ${attrs} href="https://www.youtube.com/results?search_query=${game}+gameplay">${youtube}</a>
				<a ${attrs} href="https://www.twitch.tv/search?term=${game}">${twitch}</a>
			</div>
		`;
		box.appendChild(temp.content);
	});

})(document);

