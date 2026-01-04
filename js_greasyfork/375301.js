// ==UserScript==
// @name         Copy Deezer Release Info
// @namespace    https://greasyfork.org/en/scripts/375301-deezer-release-info-copier
// @version      1.1
// @description  Copies the Deezer release info to the clipboard, formatted for PE.
// @author       newstarshipsmell
// @include      /https?://www.deezer.com/(\w{2}/)?album/\d+/
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/375301/Copy%20Deezer%20Release%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/375301/Copy%20Deezer%20Release%20Info.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var coverDims = [1200, 1300, 1400, 1500, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200, 3600, 4000, 4800, 5000, 6000, 6400, 7000, 7200, 8000];
	var scriptWait = 222;

	function addReleaseInfoButton() {
		if (!bGbl_ChangeEventListenerInstalled)
		{
			bGbl_ChangeEventListenerInstalled = true;
			document.addEventListener("DOMSubtreeModified", HandleDOM_ChangeWithDelay, false);
		}

		try {
			if (document.getElementById('copy_release_info') === null) {
				var coverDims = [1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200, 3600, 4000, 4800, 5000, 6000, 6400, 7000, 7200, 8000];
				var covers = [];
				covers.length = coverDims.length;

				function getCovers(url, callback) {
					for (var i = 0, len = coverDims.length; i < len; i++) {
						covers[i] = new Image();
						covers[i].src = url.replace(/1200x1200/, coverDims[i] + 'x' + coverDims[i]);
					}
					callback(url);
				}

				function addBtns(url) {
					var infoList = document.querySelector('ul.header-info-list');
					var copyBtn = document.createElement('input');
					copyBtn.type = 'button';
					copyBtn.id = 'copy_release_info';
					copyBtn.value = 'Copy release';
					copyBtn.title = 'Copy release info to clipboard';
					infoList.parentNode.insertBefore(copyBtn, infoList);
					copyBtn.onclick = function() {
						var maxCoverSize = 0;
						for (var i = 1, len = covers.length; i < len; i++) {
							if (covers[i].width == 1200) break;
							if (covers[i].width == 0) {
								maxCoverSize = -1;
								break;
							}
							maxCoverSize++
						}
						if (maxCoverSize == -1) {
							this.value = 'Didn\'t Copy (try again!)';
							this.title = 'Images are still loading. Try again!';
						} else {
							var coverUrlMax = url.replace(/1200x1200/, coverDims[maxCoverSize] + 'x' + coverDims[maxCoverSize]);
							var albumTitle = document.querySelector('h1.heading-1').textContent;
							var artistNames = document.querySelectorAll('h2.heading-3 > a');
							var artistName;
							artistName = artistNames.length > 1 ? (artistNames.length > 2 ? 'VA' : artistNames[0].textContent + ' & ' + artistNames[1].textContent) :
							(artistNames[0].textContent == 'Various Artists' ? 'VA' : artistNames[0].textContent);
							var relDate = infoList.childNodes[2].textContent;
							var relDay = parseInt(relDate.replace(/(\d+)\/\d+\/\d+/, '$1'));
							var relMonth = parseInt(relDate.replace(/\d+\/(\d+)\/\d+/, '$1')) - 1;
							var relYear = parseInt(relDate.replace(/\d+\/\d+\/(\d+)/, '$1'));
							var relTracks = infoList.childNodes[0].textContent.replace(/(\d+) tracks?/, '$1');
							var relLength = infoList.childNodes[1].textContent;
							if (/\d h \d+ mins/.test(relLength)) {
								relLength = parseInt((relLength.replace(/(\d) h \d+ mins/, '$1') * 60)) + parseInt(relLength.replace(/\d h (\d+) mins/, '$1'));
							} else {
								relLength = parseInt(relLength.replace(/(\d+) mins/, '$1'));
							}
							var relType = 'a';
							if (relTracks < 9 && relLength < 30) relType = 'm';
							if (relTracks < 7 && relLength < 30) relType = 'e';
							if (relTracks < 3) {
								if (relLength < 30) relType = 'e';
								if (relLength < 10) relType = 's';
							}
							if (artistName == 'VA') relType = 'c';

							var abrDate = new Date();
							abrDate.setFullYear(relYear);
							abrDate.setMonth(relMonth);
							abrDate.setDate(relDay);
							abrDate.setHours(0);
							abrDate.setMinutes(0);
							abrDate.setSeconds(0);
							var approxDate;

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

							var copyright = document.querySelector('div.catalog-legal-notice').lastChild.textContent;
							if (/(\d+ Records DK2?|author's edition|independent|not on label|self.?released?)/i.test(copyright)) copyright = 'Self-Released';
							if (artistName.toLowerCase() == copyright.toLowerCase()) copyright = 'Self-Released';
							var relUrl = location.href.replace(/https?:\/\/www\.deezer\.com\/(\w{2}\/)?album\/(\d+)/, 'http://www.deezer.com/album/$2');
							var infoStr = artistName + ' [' + relYear + '] ' + albumTitle + ' [' + copyright + ', WEB] [FLAC]';
							infoStr += '\t\t' + relUrl + '\t\tnone\tnone\t\t' + relType + '\t' + coverUrlMax + '\t\t\t\t' + approxDate;
							GM_setClipboard(infoStr);
							this.value = 'Copied to clipboard!';
						}
					};
					var mySpace = document.createTextNode(' ');
					infoList.parentNode.insertBefore(mySpace, infoList);
					var copyBtnCover = document.createElement('input');
					copyBtnCover.type = 'button';
					copyBtnCover.id = 'copy_max_cover';
					copyBtnCover.value = 'Copy Max Cover';
					copyBtnCover.title = 'Copy Max Cover URL to clipboard';
					infoList.parentNode.insertBefore(copyBtnCover, infoList);
					copyBtnCover.onclick = function() {
						var maxCoverSize = 0;
						for (var i = 1, len = covers.length; i < len; i++) {
							if (covers[i].width == 1200) break;
							if (covers[i].width == 0) {
								maxCoverSize = -1;
								break;
							}
							maxCoverSize++
						}
						if (maxCoverSize == -1) {
							this.value = 'Didn\'t Copy (try again!)';
							this.title = 'Images are still loading. Try again!';
						} else {
							var coverUrlMax = url.replace(/1200x1200/, coverDims[maxCoverSize] + 'x' + coverDims[maxCoverSize]);
							GM_setClipboard(coverUrlMax);
							this.value = 'Copied (' + coverDims[maxCoverSize] + 'x' + coverDims[maxCoverSize] + ')';
						}

					};
				}

				var coverUrl = document.querySelector('img.picture-img.active').src.replace(/290x290-(\d+)-80/, '1200x1200-$1-95');
				getCovers(coverUrl, addBtns);
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