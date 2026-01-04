// ==UserScript==
// @name         TurkTorrent URL Araması
// @version      1
// @description  TurkTorrent sitesinde URL'den arama yapmaya olanak sağlar (URL Örneği: https://turktorrent.us/?p=torrents&pid=10&q=Avatar).
// @author       nht.ctn
// @namespace    https://github.com/nhtctn
// @include      *://turktorrent.us/?p=torrents&pid=10&q=*
// @grant        none
// @run-at       document-end
// @icon         https://turktorrent.us/favicon.ico?lv=2.2
// @downloadURL https://update.greasyfork.org/scripts/427311/TurkTorrent%20URL%20Aramas%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/427311/TurkTorrent%20URL%20Aramas%C4%B1.meta.js
// ==/UserScript==
const pageUrl = window.location.href;
if (pageUrl.search(/https?:\/\/turktorrent\.us/) >= 0) {

	var urlParams = new URLSearchParams(window.location.search);
	var postKeyword = urlParams.get('q');

	if (urlParams.get('q') && postKeyword !== '') {
		$('#keywords').attr("value", postKeyword);
		$('#search_torrent [value="Ara"]').click();
	}
	else {
		document.location = 'https://turktorrent.us/?p=torrents&pid=10';
	}
}