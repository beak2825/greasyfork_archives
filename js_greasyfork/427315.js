// ==UserScript==
// @name         Çeşitli Siteler İçin URL'den Arama
// @version      1.6
// @description  URL'den arama yapmaya olanak sağlar (URL Örneği: https://subscene.com/subtitles/title?q=Dexter).
// @author       nht.ctn
// @namespace    https://github.com/nhtctn

// @match      *://turktorrent.us/?p=torrents&pid=10&q=*
// @match      *://subscene.com/subtitles/title?q=*
// @include    *://*turkanime.co/?q=*
// @grant        none
// @run-at       document-start
// @icon         https://turktorrent.us/favicon.ico?lv=2.2
// @require	     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==
/* global $ */
/*jshint esversion: 6 */

(function() {
	'use strict';

	const pageUrl = window.location.href;
if ($('meta#redirecting648').length < 1) {
	if (pageUrl.search(/https?:\/\/turktorrent\.us/) >= 0) {
		window.stop();
		$('head').append('<meta id="redirecting648">');

		let urlParams = new URLSearchParams(window.location.search);
		let postKeyword = urlParams.get('q');
		let postUrl = 'https://turktorrent.us/?p=torrents&pid=10';

		if (urlParams.get('q') && postKeyword !== '') {
			let postForm = document.createElement("form");
			postForm.setAttribute("method", "post");
			postForm.setAttribute("action", postUrl);
			let hiddenField = document.createElement("input");
			hiddenField.setAttribute("name", "keywords");
			hiddenField.setAttribute("value", postKeyword);
			hiddenField.setAttribute("type", "hidden");
			postForm.appendChild(hiddenField);
			let hiddenSelect = document.createElement("select");
			hiddenSelect.setAttribute("name", "search_type");
			let hiddenOpt = document.createElement("option");
			hiddenOpt.setAttribute("value", "name");
			hiddenSelect.appendChild(hiddenOpt);
			postForm.appendChild(hiddenSelect);
			console.log(postForm);
			document.getElementsByTagName('html')[0].appendChild(postForm);
			postForm.submit();
		}
		else {
			document.location = 'https://turktorrent.us/?p=torrents&pid=10';
		}
	}
	else if (pageUrl.search(/https?:\/\/subscene\.com/) >= 0) {
		window.stop();
		$('head').append('<meta id="redirecting648">');

		if ($("html").attr("searchByTitle") != 1) {
			$("html").attr("searchByTitle", 1);
			let urlParams = new URLSearchParams(window.location.search);
			let postKeyword = urlParams.get('q');
			let postUrl = '/subtitles/searchbytitle';

			if (urlParams.get('q') && postKeyword !== '') {
				let postForm = document.createElement("form");
				postForm.setAttribute("method", "post");
				postForm.setAttribute("action", postUrl);
				let hiddenField = document.createElement("input");
				hiddenField.setAttribute("name", "query");
				hiddenField.setAttribute("value", postKeyword);
				hiddenField.setAttribute("type", "hidden");
				postForm.appendChild(hiddenField);
				document.getElementsByTagName('html')[0].appendChild(postForm);
				postForm.submit();
			}
			else{
				document.location = 'https://subscene.com/subtitles';
			}
		}
	}
	else if (pageUrl.search(/https?:\/\/.+turkanime\.co/) >= 0) {
		window.stop();
		$('head').append('<meta id="redirecting648">');

		let urlParams = new URLSearchParams(window.location.search);
		let postKeyword = urlParams.get('q');

		if (urlParams.get('q') && postKeyword !== '') {
			let postForm = document.createElement("form");
			postForm.setAttribute("method", "post");
			postForm.setAttribute("action", "arama");
			let hiddenField = document.createElement("input");
			hiddenField.setAttribute("name", "arama");
			hiddenField.setAttribute("value", postKeyword);
			hiddenField.setAttribute("type", "hidden");
			postForm.appendChild(hiddenField);
			document.getElementsByTagName('html')[0].appendChild(postForm);
			postForm.submit();
		}
	}
}

})();