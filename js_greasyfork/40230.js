// ==UserScript==
// @name         Bilibili Bangumi Cover
// @version      0.7.4
// @description        Show Bilibili Bangumi Cover
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @author       i9602097
// @include      *://www.bilibili.com/bangumi/play/ep*
// @include      *://www.bilibili.com/bangumi/play/ss*
// @namespace https://greasyfork.org/users/106880
// @downloadURL https://update.greasyfork.org/scripts/40230/Bilibili%20Bangumi%20Cover.user.js
// @updateURL https://update.greasyfork.org/scripts/40230/Bilibili%20Bangumi%20Cover.meta.js
// ==/UserScript==
(function() {
	'use strict';
	var old_aid;
	var title = document.createElement("h4");
	title.id = "coverTitle";
	title.classList.add("recom-title");
	title.style.display = "block";
	title.innerHTML = "封面";
	var coverLink = document.createElement("a");
	var cover = document.createElement("img");
	cover.id = "cover_image";
	coverLink.target = "_blank";
	coverLink.appendChild(cover);

	function setCover() {
		if (cover.src && document.querySelector(".main-container .other-wrapper .recom-wrapper .bangumi-recom") && !document.querySelector(".main-container .other-wrapper .recom-wrapper .bangumi-recom").querySelector("h4#coverTitle")) {
			document.querySelector(".main-container .other-wrapper .recom-wrapper .bangumi-recom").insertBefore(coverLink, document.querySelector(".main-container .other-wrapper .recom-wrapper .bangumi-recom").firstChild);
			document.querySelector(".main-container .other-wrapper .recom-wrapper .bangumi-recom").insertBefore(title, document.querySelector(".main-container .other-wrapper .recom-wrapper .bangumi-recom").firstChild);
		}
	}

	function refreshCover(aid) {
		GM_xmlhttpRequest({
			method: 'GET',
			url: location.protocol + "//www.biliplus.com/api/view?id=" + aid,
			onload: function(result) {
				try {
					if (JSON.parse(result.responseText).code) return;
					coverLink.href = cover.src = JSON.parse(result.responseText).pic.replace(/^https?\:/, location.protocol);
				} catch (e) {
					console.log(e);
					return;
				}
				setCover();
			}
		});
	}
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	new MutationObserver(function(records) {
		if (document.querySelector('.info-sec-av') && document.querySelector('.info-sec-av').innerHTML.match(/AV(\d+)/)[1] != old_aid) refreshCover(document.querySelector('.info-sec-av').innerHTML.match(/AV(\d+)/)[1]);
		else setCover();
		old_aid = document.querySelector('.info-sec-av').innerHTML.match(/AV(\d+)/)[1];
	}).observe(document, {
		'childList': true,
		'subtree': true
	});
	if (document.querySelector('.info-sec-av')) refreshCover(document.querySelector('.info-sec-av').innerHTML.match(/AV(\d+)/)[1]);
	old_aid = document.querySelector('.info-sec-av').innerHTML.match(/AV(\d+)/)[1];
	var css = '#cover_image{display:inline!important;width:calc(100% - 2px);height:auto;border-radius:4px;border:1px solid #e5e9ef;}'
	GM_addStyle(css);
})();