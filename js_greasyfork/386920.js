// ==UserScript==
// @name         FuwaFuwaTime Original Lyrics
// @namespace    http://nanodesu.moe/
// @version      0.5
// @description  Display Original lyrics in addition to Romaji on Aqours call guide.
// @author       Findstr
// @homepage     https://github.com/KCFindstr
// @match        https://nanodesu.moe/fuwafuwatime/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/386920/FuwaFuwaTime%20Original%20Lyrics.user.js
// @updateURL https://update.greasyfork.org/scripts/386920/FuwaFuwaTime%20Original%20Lyrics.meta.js
// ==/UserScript==

(function($) {
	const baseurl = 'https://kcfindstr.github.io/fuwafuwa';
	let loaderElement = null;
	let id = null;
	const space = '&nbsp;';

	function renderObj(arr) {
		$('.calls, .instructions, .lyrics, .notes').each(function(index) {
			let top = arr[index].top;
			let bottom = arr[index].bottom;
			if (top === null || top === undefined || bottom === null || bottom === undefined)
				return;
			bottom = bottom.replace(/\s/g, space);
			top = top.replace(/\s/g, space);
			$(this).html('<div><div style="text-align: center;">' + top + '</div><div style="text-align: center;">' + bottom + '</div></div>');
		});
		lrcObj = arr;
	}
	
	async function loadOriginalLyrics() {
		let url = window.location.href;
		url = url.split('#');
		if (url.length < 2)
			return;
		id = url[1];
		loaderElement.text('Loading original lyrics: ' + id);

		let response = null;
		try {
			response = await $.get(baseurl + '/lyrics/' + id + '.json');
		} catch (e) {
			loaderElement.html('Failed to load lyrics.<br/><a href="https://github.com/KCFindstr/FuwaFuwaTime-Original-Lyrics/issues/new" target="_blank">Help us</a> by submitting raw lyrics!<br/>Timeline is unnecessary; but make sure your lyrics matches this page exactly.');
			return;
		}
		
		loaderElement.text('Parsing original lyrics: ' + id);
		renderObj(response);
		let html = 'Done. (By <a href="http://github.com/KCFindstr">KCFindstr@github</a>)';
		loaderElement.html(html);
	}

	$(document).ready(async () => {
		let title = $('#song-name');
		loaderElement = $('<div style="padding-bottom: 10px; text-align: center;">Initializing...</div>');
		title.after(loaderElement);
		// Initial load
		await loadOriginalLyrics();
		title.on('DOMSubtreeModified', loadOriginalLyrics);
	});
})(jQuery);
