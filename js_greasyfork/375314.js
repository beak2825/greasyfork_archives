// ==UserScript==
// @name         Copy iTunes Release Info
// @namespace    https://greasyfork.org/en/scripts/375314-copy-itunes-release-info
// @version      1.0
// @description  Copies the iTunes Store release info to the clipboard, formatted for PE.
// @author       newstarshipsmell
// @include      /https?://itunes.apple.com/(\w{2}/)?album/([a-z0-9\-]+/)?\d+(\?.+)?/
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/375314/Copy%20iTunes%20Release%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/375314/Copy%20iTunes%20Release%20Info.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var coverMax, coverMaxUrl;
	var nzAhead = 19;//difference in hours between local time and NZT
	var hook = document.querySelector('span.product-header__identity');
	var cover = document.querySelector('img.we-artwork__image').src;
	function getCoverMax(url, callback) {
		coverMax = new Image();
		coverMax.src = url.replace(/268x0w\./, '10000x0w.');
		callback(url);
	}
	function addBtns(url) {
		var copyBtn = document.createElement('input');
		copyBtn.type = 'button';
		copyBtn.id = 'copy_release_info';
		copyBtn.value = 'Copy release';
		copyBtn.title = 'Copy release info to clipboard';
		hook.parentNode.appendChild(copyBtn);
		copyBtn.onclick = function() {
			var coverMaxSize = coverMax.width;
			coverMaxUrl = url.replace(/268x0w\./, coverMaxSize + 'x0w.');
			var artistName = document.querySelector('span.product-header__identity').textContent.trim();
			artistName = artistName == 'Various Artists' ? 'VA' : artistName;
			var albumTitle = document.querySelector('span.product-header__title').textContent.trim();
			var metaDate = document.querySelector('meta[property="music:release_date"]').content;
			var fullDate = new Date();
			fullDate.setTime(Date.parse(metaDate.replace(/T00:/, 'T24:')));
			var relDate = fullDate.toLocaleDateString();
			var relYear = fullDate.getFullYear();

			var relType = 'a';
			if (/.+ - EP/.test(albumTitle)) {
				albumTitle = albumTitle.replace(/ - EP$/, '');
				relType = 'e';
			}
			if (/.+ - Single/.test(albumTitle)) {
				albumTitle = albumTitle.replace(/ - Single$/, '');
				relType = 's';
			}
			if (artistName == 'VA') relType = 'c';
			var copyright = document.querySelector('li.link-list__item--copyright').textContent.replace(/^. \d{4} /, '');
			if (/(\d+ Records DK2?|author's edition|independent|not on label|self.?released?)/i.test(copyright)) copyright = 'Self-Released';
			if (artistName.toLowerCase() == copyright.toLowerCase()) copyright = 'Self-Released';
			var relUrl = location.href.replace(/https?:\/\/www\.deezer\.com\/(\w{2}\/)?album\/(\d+)/, 'http://www.deezer.com/album/$2');

			var dToday = new Date();
			dToday.setHours(0);
			dToday.setMinutes(0);
			dToday.setSeconds(0);
			dToday = dToday.getTime();

			var infoStr;
			if (Date.parse(relDate) - (nzAhead * 3600000) > dToday) {
				infoStr = artistName + ' [' + relYear + '] ' + albumTitle + ' [' + copyright + ', WEB] [FLAC]\t\t\t\tnone\tnone\t' + relUrl + '\t' + relType + '\tx\t' + relDate;
			} else {
				infoStr = artistName + ' [' + relYear + '] ' + albumTitle + ' [' + copyright + ', WEB] [FLAC]\tNA\t\t\tnone\tnone\t' + relUrl +
					'\t' + relType;
			}
			GM_setClipboard(infoStr);

		};
		var mySpace = document.createTextNode(' ');
		hook.parentNode.appendChild(mySpace);
		var copyBtnCover = document.createElement('input');
		copyBtnCover.type = 'button';
		copyBtnCover.id = 'copy_max_cover';
		copyBtnCover.value = 'Copy Max Cover';
		copyBtnCover.title = 'Copy Max Cover URL to clipboard';
		hook.parentNode.appendChild(copyBtnCover);
		copyBtnCover.onclick = function() {
			var coverMaxSize = coverMax.width;
			coverMaxUrl = url.replace(/268x0w\./, coverMaxSize + 'x0w.');
			GM_setClipboard(coverMaxUrl);
			this.value = 'Copied (' + coverMaxSize + 'x' + coverMaxSize + ')';
		};
	}
	getCoverMax(cover, addBtns);
})();