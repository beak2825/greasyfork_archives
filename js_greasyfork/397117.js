// ==UserScript==
// @author craftwar
// @name MooBot-song-player song-name helper
// @description Make craftwar's obs plugin (https://craftwarblog.blogspot.com/2018/01/obs-plugin-playing-song.html) able to get NightBot-AutoDJ song name.
// @copyright 2020, craftwar (https://craftwarblog.blogspot.com/)
// @license GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @homepageURL https://github.com/craftwar/userscript/tree/master/MooBot-song-name-helper
// @version 0.1.20201005
// @namespace github.com.craftwar
// @match https://moo.bot/*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/397117/MooBot-song-player%20song-name%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/397117/MooBot-song-player%20song-name%20helper.meta.js
// ==/UserScript==

'use strict';
(() => {
	const body_observer = new MutationObserver((record, observer) => {
		const song_list = document.querySelector(".widget-song-requests-list");
		if (song_list) {
			observer.disconnect();

			const song_observer = new MutationObserver(() => {
				document.title = song_list.querySelector(".widget-song-requests-list-text > h4:first-child").firstChild.wholeText + " - YouTube";
			});
			song_observer.observe(song_list, { subtree: true, childList: true });
		}
	});
	const body_element = document.querySelector("body");
	body_observer.observe(body_element, { subtree: true, childList: true });
})();
