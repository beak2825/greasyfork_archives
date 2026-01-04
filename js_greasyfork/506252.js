// ==UserScript==
// @name         YouTube - Hide cringe videos & channels
// @namespace    amekusa.yt-cringe-remover
// @author       amekusa
// @version      0.1.1
// @description  Remove cringe videos & channels on YouTube. Not fully implemented yet
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @homepage     https://github.com/amekusa/monkeyscripts
// @downloadURL https://update.greasyfork.org/scripts/506252/YouTube%20-%20Hide%20cringe%20videos%20%20channels.user.js
// @updateURL https://update.greasyfork.org/scripts/506252/YouTube%20-%20Hide%20cringe%20videos%20%20channels.meta.js
// ==/UserScript==

(function (doc) {
	let debug = false ? console.debug : (() => {});
	let NS = '--ns' + Math.floor(Math.random() * 10000); // namespace

	let filter = [
		/(?:^|[^a-z])(?:vtube|holo|ch\.|nijis|genshin|hongkai|2ch|5ch)/i,
		/(?:ホロライ|にじさん|原神|スターレイル)/u,
		/(?:歌ってみた|歌い手|初音|ボカロ)/u,
		/(?:コメ付|ゆっくり|ずんだも|(?:2|5|２|５)ちゃんねる)/u,
	];

	let purged = `${NS}-purged`;

	let purge = item => {
		item.classList.add(purged);
	};

	let check = item => {
		let info = item.innerText;
		for (let i = 0; i < filter.length; i++) {
			if (info.match(filter[i])) {
				debug('purge:', info, item);
				purge(item);
				return;
			}
		}
	};

	let checkAll = sel => {
		doc.querySelectorAll(`${sel}:not(.${purged})`).forEach(check);
	};

	let update = () => {
		checkAll('ytd-video-renderer');
		checkAll('ytd-rich-item-renderer');
		checkAll('ytd-reel-item-renderer'); // videos in a carousel list
		checkAll('ytd-compact-video-renderer'); // videos on the right sidebar
	};

	doc.addEventListener('scrollend', update);
	doc.addEventListener('DOMContentLoaded', () => {
		let style = doc.createElement('style');
		style.innerHTML = `
			.${purged} {
				opacity: .25 !important;
			}
			.${purged} img {
				opacity: .25 !important;
				filter: blur(4px) !important;
			}
		`;
		doc.head.appendChild(style);
		update();
	});

})(document);

