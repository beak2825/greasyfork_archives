// ==UserScript==
// @name         NoAliTrackID
// @namespace    http://imews.cn/
// @version      0.1
// @description  将淘宝客链接还原成原始网址
// @author       MewChen
// @include      http*://item.taobao.com/*
// @include      http*://detail.tmall.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31087/NoAliTrackID.user.js
// @updateURL https://update.greasyfork.org/scripts/31087/NoAliTrackID.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function getQueryString(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return unescape(r[2]);
		}
		return null;
	}
	var trackid = getQueryString('ali_trackid');
	if(trackid!==null){
		var id = getQueryString('id');
		var url = 'https://' + window.location.host + '/item.htm?id=' + id;
		window.location.href= url;
	}
})();