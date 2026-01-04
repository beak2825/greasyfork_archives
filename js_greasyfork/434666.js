// ==UserScript==
// @name         Pixeldrain video viewer
// @description  Sometimes Pixeldrain does not shows online player for video files and asks to download them. This script forces video player to appear.
// @namespace    bo.gd.an@rambler.ru
// @version      0.1.2
// @author       Bogudan
// @match        https://pixeldrain.com/u/*
// @license      For personal use only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434666/Pixeldrain%20video%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/434666/Pixeldrain%20video%20viewer.meta.js
// ==/UserScript==

(function() {
	'use strict';
	// body#body
	// div#file_viewer.file_viewer.svelte-1ofgsf6
	// div.file_preview_row.svelte-1ofgsf6
	// div.file_preview.svelte-1ofgsf6.checkers.toolbar_visible
	// div.container.svelte-1vb3mev
	// div.player.svelte-1vb3mev
	// video.video.drop_shadow.svelte-1vb3mev[controls][autoplay]
	const int = setInterval (function () {
		if (document.getElementsByTagName ('video').length > 0) {
			clearInterval (int);
			return console.log ('video detected');
			}
		function TryClass (cls) {
			const q = document.getElementsByClassName (cls);
			return q && q.length && q [0];
			}
		const preview = TryClass ('checkers');
		if (!preview)
			return console.log ('container not found');
		clearInterval (int);
		while (preview.lastChild)
			preview.removeChild (preview.lastChild);
		const src = document.createElement ('source');
		src.setAttribute ('type', 'video/mp4');
		src.setAttribute ('src', '/api/file/' + document.location.pathname.substring (3));
		const video = document.createElement ('video');
		video.setAttribute ('style', 'position: relative; display: block; margin: auto; max-width: 100%; max-height: 100%; top: 50%; transform: translateY(-50%); box-shadow: 1px 1px 6px var(--shadow_color)');
		video.setAttribute ('controls', '');
		video.setAttribute ('autoplay', '');
		video.append (src);
		const pl = document.createElement ('div');
		pl.setAttribute ('style', 'flex: 1 1 auto; overflow: hidden');
		pl.append (video);
		const cnt = document.createElement ('div');
		cnt.setAttribute ('style', 'display: flex; flex-direction: column; height: 100%; width: 100%');
		cnt.append (pl);
		preview.append (cnt);
		}, 1000);
	})();
