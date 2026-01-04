// ==UserScript==
// @name         Deezer :: Grab UPC and Largest Cover and Search Redacted
// @namespace    https://greasyfork.org/en/scripts/380685-deezer-grab-upc-and-largest-cover-and-search-redacted
// @version      1.0
// @description  Adds buttons to Deezer release pages which copy the UPC for the release or the largest cover image URL to the clipboard, as well as search the artist on Redacted.
// @author       newstarshipsmell
// @include      /https?://www.deezer.com/(\w{2}/)?album/\d+/
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @connect      deezer.com
// @downloadURL https://update.greasyfork.org/scripts/380685/Deezer%20%3A%3A%20Grab%20UPC%20and%20Largest%20Cover%20and%20Search%20Redacted.user.js
// @updateURL https://update.greasyfork.org/scripts/380685/Deezer%20%3A%3A%20Grab%20UPC%20and%20Largest%20Cover%20and%20Search%20Redacted.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var jpegQuality = 80;
	var coverDims = [1200, 1400, 1500, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200, 3600, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
	var scriptWait = 500;

	function addReleaseInfoButton() {
		if (!bGbl_ChangeEventListenerInstalled)
		{
			bGbl_ChangeEventListenerInstalled = true;
			document.addEventListener("DOMSubtreeModified", HandleDOM_ChangeWithDelay, false);
		}

		try {
			if (document.getElementById('copy_upc') === null) {
				var covers = [];
				covers.length = coverDims.length;

				var copyBtnCover = document.createElement('input');
				copyBtnCover.type = 'button';
				copyBtnCover.id = 'copy_max_cover';
				copyBtnCover.value = 'Copy Max Cover';
				copyBtnCover.title = 'Copy Max Cover URL to clipboard';

				function getCovers(url, callback) {
					for (var i = 0, len = coverDims.length; i < len; i++) {
						covers[i] = new Image();
						covers[i].src = url.replace(/1200x1200/, coverDims[i] + 'x' + coverDims[i]);
					}

					waitCovers();
					callback(url);
				}

				function waitCovers() {
					var coversDims = [];
					coversDims.length = covers.length;
					coversDims[0] = 1200;
					for (var i = 1, len = coverDims.length; i < len; i++) coversDims[i] = (i > 0 && covers[i].width == 1200) ? 1 : covers[i].width;

					var firstUnloaded = coversDims.indexOf(0);
					var firstResized = coversDims.indexOf(1);
					var coversDimsSorted = coversDims;
					coversDimsSorted.sort(function(a, b){return b - a});
					var largestLoaded = coversDimsSorted[0];

					if (firstUnloaded > -1) {
						copyBtnCover.value = 'Loaded: ' + largestLoaded + 'x' + largestLoaded;
					} else if (firstResized > -1) {
						copyBtnCover.value = 'Max: ' + largestLoaded + 'x' + largestLoaded;
					} else {
						copyBtnCover.value = 'Still loading...';
					}

					copyBtnCover.title = '';
					for (i = 1, len = coverDims.length; i < len; i++) {
						copyBtnCover.title += coverDims[i] + ': ' + covers[i].width + (i + 1 < len ? '\n' : '');
					}

					if (firstUnloaded > -1) {
						setTimeout(waitCovers, 1000);
					} else {
						return;
					}

				}

				function addBtns(url) {
					var copyBtnClicks = 0;
					var infoList = document.querySelector('ul.header-info-list');
					var upc = '';
					var copyBtn = document.createElement('input');
					copyBtn.type = 'button';
					copyBtn.id = 'copy_upc';
					copyBtn.value = 'Copy UPC';
					copyBtn.title = 'Copy UPC to clipboard';
					infoList.parentNode.insertBefore(copyBtn, infoList);
					copyBtn.onclick = function() {
						GM_xmlhttpRequest({

							method: "GET",
							url: location.href.replace(/(https:\/\/)www(\.deezer\.com\/)[a-z]{2}\/(album\/\d+)/, '$1api$2$3'),
							headers: {
								"Accept": "text/xml"
							},

							onload: function(response) {
								try {
									upc = JSON.parse(response.responseText).upc;
								} catch(e) {
									upc = null;
								};

								if (upc) {
									GM_setClipboard(upc);
									copyBtn.value = 'UPC: ' + upc + ' (copied)';
								} else {
									copyBtn.value = 'Failure! :(';
								}
							}
						});
					};

					infoList.parentNode.insertBefore(document.createTextNode(' '), infoList);
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
							this.value = 'Nope! (' + coverDims[i] + 'x' + coverDims[i] + ')';
							this.title = 'Images are still loading. Try again!';
						} else {
							var coverUrlMax = url.replace(/1200x1200/, coverDims[maxCoverSize] + 'x' + coverDims[maxCoverSize]);
							GM_setClipboard(coverUrlMax);
							this.value = 'Copied (' + coverDims[maxCoverSize] + 'x' + coverDims[maxCoverSize] + ')';
						}

					};

					var searchBtn = document.createElement('input');
					searchBtn.type = 'button';
					searchBtn.id = 'search_artist';
					searchBtn.value = 'Search artist';
					searchBtn.title = 'Search this artist on RED';
					infoList.parentNode.insertBefore(document.createTextNode(' '), infoList);
					infoList.parentNode.insertBefore(searchBtn, infoList);
					searchBtn.onclick = function() {
						var artistNames = document.querySelectorAll('h2.heading-3 > a');
						if (artistNames[0].textContent == 'Various Artists' || artistNames.length > 2) return;
						var artistName = artistNames.length > 1 ? artistNames[0].textContent + ' & ' + artistNames[1].textContent : artistNames[0].textContent;
						GM_openInTab('https://redacted.ch/artist.php?artistname=' +
									 encodeURIComponent(artistName), false);
					};

				}

				var coverUrl = document.querySelector('img.picture-img.image-loader').src.replace(/(\d+)x\1-(\d+)-80/, '1200x1200-$2-' + jpegQuality);
				if (!/^https:\/\/e-cdns-images\.dzcdn\.net\/images\/cover\//.test(coverUrl)) location.reload();
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