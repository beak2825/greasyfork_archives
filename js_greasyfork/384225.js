// ==UserScript==
// @author craftwar
// @name Spotify song-name helper
// @description Make craftwar's obs plugin (https://craftwarblog.blogspot.com/2018/01/obs-plugin-playing-song.html) able to get Spotify song name.
// @copyright 2022, craftwar (https://craftwarblog.blogspot.com/)
// @license GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @homepageURL https://github.com/craftwar/userscript/tree/master/Spotify-song-name-helper
// @version 0.1.20220830
// @namespace github.com.craftwar
// @match https://open.spotify.com/*
// @grant none
// @run-at document-end
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/384225/Spotify%20song-name%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/384225/Spotify%20song-name%20helper.meta.js
// ==/UserScript==
// inject-into content for Violentmonkey, default mode page is not working
// ref: https://violentmonkey.github.io/2018/11/23/inject-into-context/

'use strict';
(() => {
	const title_element = document.querySelector("title");
	new MutationObserver(() => {
		if (!document.title.endsWith(" - YouTube"))
			document.title += " - YouTube";
	}).observe(title_element, { childList: true });
})();
