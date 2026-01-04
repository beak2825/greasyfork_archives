// ==UserScript==
// @name         bilibiliGKD
// @namespace    bilibili_gkd
// @version      0.1
// @description  自动播放B站某一分区视频
// @author       Jonesn
// @match        http://*/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @include     http://www.bilibili.com/video/BV*
// @include     https://www.bilibili.com/video/BV*
// @include     https://www.bilibili.com/video/av*
// @include     http://bangumi.bilibili.com/anime/v/*
// @include     https://bangumi.bilibili.com/anime/v/*
// @include     https://www.bilibili.com/bangumi/play/*
// @run-at      document-start
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/461679/bilibiliGKD.user.js
// @updateURL https://update.greasyfork.org/scripts/461679/bilibiliGKD.meta.js
// ==/UserScript==
(function() {
    var keyword=escape(getUrlParam('gkd'));
    var channel={"%E5%AE%85%E8%88%9E": 20,"%E8%A1%97%E8%88%9E": 198,"%E6%98%8E%E6%98%9F%E8%88%9E%E8%B9%88":199,"chi%E5%9B%BD%E9%A3%8E%E8%88%9E%E8%B9%88na":200,"%E8%88%9E%E8%B9%88%E7%BB%BC%E5%90%88":154,"%E8%88%9E%E8%B9%88%E6%95%99%E7%A8%8B":156,"mad":24,"mmd":25,"%E6%89%8B%E4%B9%A6":47,"%E6%89%8B%E5%8A%9E":210,"%E7%89%B9%E6%91%84":86,"%E5%8A%A8%E6%BC%AB%E6%9D%82%E8%B0%88":253,"%E5%8A%A8%E6%BC%AB%E7%BB%BC%E5%90%88":27,"%E9%AC%BC%E7%95%9C%E8%B0%83%E6%95%99":22,"%E9%9F%B3mad":26,"vocaloid":126,"%E9%AC%BC%E7%95%9C%E5%89%A7%E5%9C%BA":216};
    var gkd = channel[keyword];
    if(gkd!=null)
    {
        NextVideo(gkd);
    }
	if ( getUrlParam('channel') != null) {
		window.addEventListener('load', function() {
			console.log("load success");
			this.$ = unsafeWindow.jQuery;
			let elementNames = ["bpx-player-ctrl-web-enter", "bilibili-player-iconfont-web-fullscreen-off", "player_pagefullscreen_player", "squirtle-pagefullscreen-inactive"];
			for (var i = 0; i < elementNames.length; i++) {
				waitElement(elementNames[i]);
			}
		});
        var duration = getUrlParam('time');
		setInterval(function() {
			NextVideo(getUrlParam('channel'));
		}, 1000 * duration + 500);
	}
	function NextVideo(gkd) {
		var response = JSON.parse(httpGet('https://api.bilibili.com/x/web-interface/dynamic/region?ps=1&pn=2&rid='+gkd));
		location.href = 'https://www.bilibili.com/video/' + response.data.archives[0].bvid + '?channel='+gkd+'&time=' + response.data.archives[0].duration;
    }
	function httpGet(theUrl) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", theUrl, false);
		xmlHttp.send(null);
		return xmlHttp.responseText;
	}
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1)
			.match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}
	function waitElement(elementName) {
		this.$ = unsafeWindow.jQuery;
		var _times = 20,
			_interval = 1000,
			_self = document.getElementsByClassName(elementName)[0],
			_iIntervalID;
		if (_self != undefined) {
			_self.click();
		} else {
			_iIntervalID = setInterval(function() {
				if (!_times) {
					clearInterval(_iIntervalID);
				}
				_times <= 0 || _times--;
				_self = document.getElementsByClassName(elementName)[0];
				if (_self == undefined) {
					_self = document.getElementById(elementName);
				}
				if (_self != undefined) {
					_self.click();
					clearInterval(_iIntervalID);
				}
			}, _interval);
		}
		return this;
	}
})();