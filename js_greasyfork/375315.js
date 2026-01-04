// ==UserScript==
// @name         Copy Tidal Release Info
// @namespace    https://greasyfork.org/en/scripts/375315-copy-tidal-release-info
// @version      1.0
// @description  Copies the Tidal release info to the clipboard, formatted for PE.
// @author       newstarshipsmell
// @include      /https://listen\.tidal\.com/album/\d+/
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/375315/Copy%20Tidal%20Release%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/375315/Copy%20Tidal%20Release%20Info.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var scriptWait = 222;
	var btnAdded = false;

	function addReleaseInfoButton() {
		if (!bGbl_ChangeEventListenerInstalled)
		{
			bGbl_ChangeEventListenerInstalled = true;
			document.addEventListener("DOMSubtreeModified", HandleDOM_ChangeWithDelay, false);
		}

		try {
			if (document.getElementById('copy_release_info') === null) {
				var hook = document.querySelectorAll('div.container--Ia1cn')[1];
				var cover = document.querySelectorAll('img.image--1FYJU')[1].src.replace(/320x320\.jpg/, '1280x1280.jpg');
				var copyBtn = document.createElement('input');
				copyBtn.type = 'button';
				copyBtn.id = 'copy_release_info';
				copyBtn.value = 'Copy release';
				copyBtn.title = 'Copy release info to clipboard';
				hook.parentNode.insertBefore(copyBtn, hook);
				copyBtn.onclick = function() {
					var artistName = document.querySelector('span.infoLinkText--1Sl5g > a').textContent.trim();
					artistName = artistName == 'Various Artists' ? 'VA' : artistName;
					var albumTitle = document.querySelector('div.title--2mCqw').textContent.trim();
					var relDate = document.querySelector('div.info--1I6IM').lastChild.textContent;
					var relDay = parseInt(relDate.replace(/\d+\/(\d+)\/\d+/, '$1'));
					var relMonth = parseInt(relDate.replace(/(\d+)\/\d+\/\d+/, '$1')) - 1;
					var relYear = parseInt(relDate.replace(/\d+\/\d+\/(\d{4})/, '$1'));

					var abrDate = new Date();
					abrDate.setFullYear(relYear);
					abrDate.setMonth(relMonth);
					abrDate.setDate(relDay);
					abrDate.setHours(0);
					abrDate.setMinutes(0);
					abrDate.setSeconds(0);
					var approxDate;


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
					if (relType == 's' || Date.parse(abrDate) <= 1535691600000) {
						approxDate = 'old';
					} else {
						switch (abrDate.getDay()) {
							case 0:
								abrDate.setDate(relDay - 2);
								break;
							case 6:
								abrDate.setDate(relDay - 1);
								break;
							default:
								abrDate.setDate(relDay + (5 - abrDate.getDay()));
						}
						approxDate = abrDate.toLocaleDateString().replace(/\/\d{4}$/, '');
					}


					var copyright = document.querySelector('div.copyright--3ukP3').textContent.replace(/^((. )?\d{4} )?(.+)/, '$3');
					if (/(\d+ Records DK2?|author's edition|independent|not on label|self.?released?)/i.test(copyright)) copyright = 'Self-Released';
					if (artistName.toLowerCase() == copyright.toLowerCase()) copyright = 'Self-Released';
					var relUrl = location.href.replace(/https?:\/\/www\.deezer\.com\/(\w{2}\/)?album\/(\d+)/, 'http://www.deezer.com/album/$2');
					var infoStr = artistName + ' [' + relYear + '] ' + albumTitle + ' [' + copyright + ', WEB] [FLAC]';
					infoStr += '\t\t' + relUrl + '\t\tnone\tnone\t\t' + relType + '\t' + cover + '\t\t\t\t' + approxDate;
					GM_setClipboard(infoStr);

				};
				var mySpace = document.createTextNode(' ');
				hook.parentNode.insertBefore(mySpace, hook);
				var copyBtnCover = document.createElement('input');
				copyBtnCover.type = 'button';
				copyBtnCover.id = 'copy_max_cover';
				copyBtnCover.value = 'Copy Max Cover';
				copyBtnCover.title = 'Copy Max Cover URL to clipboard';
				hook.parentNode.insertBefore(copyBtnCover, hook);
				copyBtnCover.onclick = function() {
					GM_setClipboard(cover);
					this.value = 'Copied (1280x1280)';
				};
				btnAdded = true;
			}
		} catch(err) {}
	}

	function HandleDOM_ChangeWithDelay(zEvent) {
		if (typeof zGbl_DOM_ChangeTimer == "number")
		{
			clearTimeout (zGbl_DOM_ChangeTimer);
			zGbl_DOM_ChangeTimer = '';
		}
		zGbl_DOM_ChangeTimer = setTimeout (function() { addReleaseInfoButton(); }, scriptWait);
	}

	var zGbl_DOM_ChangeTimer = '';
	var bGbl_ChangeEventListenerInstalled = false;

	window.addEventListener ("load", addReleaseInfoButton, false);
})();