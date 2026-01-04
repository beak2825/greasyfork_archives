// ==UserScript==
// @name         网易云音乐，QQ音乐，酷狗音乐，酷我音乐，虾米音乐，百度音乐，蜻蜓FM，全民K歌，荔枝FM，喜马拉雅，5Sing，咪咕音乐 全能VIP音乐 在线试听  免费下载 2018版
// @version      1.0.0
// @match        *://music.163.com/*
// @match        *://y.qq.com/*
// @match        *://www.kugou.com/*
// @match        *://www.kuwo.cn/*
// @match        *://www.xiami.com/*
// @match        *://music.baidu.com/*
// @match        *://www.qingting.fm/*
// @match        *://www.lizhi.fm/*
// @match        *://music.migu.cn/*
// @match        *://www.ximalaya.com/*
// @match        *://kg.qq.com/*
// @match        *://5sing.kugou.com/*
// @match        *://music.migu.cn/*
// @description  永久解析各大网站VIP在线音乐，网易云音乐，QQ音乐，酷狗音乐，酷我音乐，虾米音乐，百度音乐，蜻蜓FM，全民K歌，荔枝FM，喜马拉雅，5Sing，咪咕音乐
// @grant        unsafeWindow
// @require      http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @run-at       document-end
// @license      MIT
// @namespace    http://music.jbsou.cn/
// @downloadURL https://update.greasyfork.org/scripts/40801/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%EF%BC%8CQQ%E9%9F%B3%E4%B9%90%EF%BC%8C%E9%85%B7%E7%8B%97%E9%9F%B3%E4%B9%90%EF%BC%8C%E9%85%B7%E6%88%91%E9%9F%B3%E4%B9%90%EF%BC%8C%E8%99%BE%E7%B1%B3%E9%9F%B3%E4%B9%90%EF%BC%8C%E7%99%BE%E5%BA%A6%E9%9F%B3%E4%B9%90%EF%BC%8C%E8%9C%BB%E8%9C%93FM%EF%BC%8C%E5%85%A8%E6%B0%91K%E6%AD%8C%EF%BC%8C%E8%8D%94%E6%9E%9DFM%EF%BC%8C%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%EF%BC%8C5Sing%EF%BC%8C%E5%92%AA%E5%92%95%E9%9F%B3%E4%B9%90%20%E5%85%A8%E8%83%BDVIP%E9%9F%B3%E4%B9%90%20%E5%9C%A8%E7%BA%BF%E8%AF%95%E5%90%AC%20%20%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%202018%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/40801/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%EF%BC%8CQQ%E9%9F%B3%E4%B9%90%EF%BC%8C%E9%85%B7%E7%8B%97%E9%9F%B3%E4%B9%90%EF%BC%8C%E9%85%B7%E6%88%91%E9%9F%B3%E4%B9%90%EF%BC%8C%E8%99%BE%E7%B1%B3%E9%9F%B3%E4%B9%90%EF%BC%8C%E7%99%BE%E5%BA%A6%E9%9F%B3%E4%B9%90%EF%BC%8C%E8%9C%BB%E8%9C%93FM%EF%BC%8C%E5%85%A8%E6%B0%91K%E6%AD%8C%EF%BC%8C%E8%8D%94%E6%9E%9DFM%EF%BC%8C%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%EF%BC%8C5Sing%EF%BC%8C%E5%92%AA%E5%92%95%E9%9F%B3%E4%B9%90%20%E5%85%A8%E8%83%BDVIP%E9%9F%B3%E4%B9%90%20%E5%9C%A8%E7%BA%BF%E8%AF%95%E5%90%AC%20%20%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%202018%E7%89%88.meta.js
// ==/UserScript==
(function () {
	'use strict';
	var NowSite = window.location.href;
	var reWY = /music\.163\.com\/song/i
	var reQQ = /y\.qq\.com\/n\/yqq\/song/i;
	var reKG = /www\.kugou\.com\/song/i;
	var reKW = /www\.kuwo\.cn\/yinyue/i;
	var reXM = /www\.xiami\.com/i;
	var reBD = /music\.baidu\.com/i;
	var reQT = /www\.qingting\.fm/i;
	var reLZ = /www\.lizhi\.fm/i;
	var reMG = /music\.migu\.cn/i;
	var reXMLY = /www\.ximalaya\.com/i;
	var reQMKG = /kg\.qq\.com\/node\/play/i;
	var re5sing = /5sing\.kugou\.com\/(yc|fc)/i;
	var musicVipBtn = '<a target="_blank" id="VipMusicBtn" style="margin:10px 10px 10px 0;display:inline-block;padding:0 5px;height:22px;border:1px solid red;color:red;vertical-align:bottom;text-decoration:none;font-size:17px;line-height:22px;cursor:pointer;">下载此音乐</a>';
	var searchVipBtn = '<a target="_blank" id="VipSearchBtn" style="margin:10px 0;display:inline-block;padding:0 5px;height:22px;border:1px solid red;color:red;vertical-align:bottom;text-decoration:none;font-size:17px;line-height:22px;cursor:pointer;">搜索歌曲</a>';
	var MusicName = '';

	//网易云音乐
	if (reWY.test(NowSite)) {
		$('.u-icn-37').parent('.hd').after(musicVipBtn, searchVipBtn);
		MusicName = $('.tit').find('.f-ff2').eq(0).text();
		console.log('[音乐解析][信息] 匹配网易云音乐 歌曲名称：' + MusicName);
	}

	//QQ音乐
	if (reQQ.test(NowSite)) {
		$('.data__name_txt').parent('.data__name').after(musicVipBtn, searchVipBtn);
		MusicName = $('.data__name_txt').text();
		$('.data__actions').css('bottom', '-10px');
		console.log('[音乐解析][信息] 匹配QQ音乐 歌曲名称：' + MusicName);
	}

	//酷狗音乐
	if (reKG.test(NowSite)) {
		KGadd();
		setInterval(function () {
			KGadd();
		}, 1000);
	}
	function KGadd() {
		if ($("#VipMusicBtn").length === 0 && $(".audioName").length > 0) {
			$('.audioName').parent('.songName').after(musicVipBtn, searchVipBtn);
		}
		MusicName = $('.songName .audioName').text();
		console.log('[音乐解析][信息] 匹配酷狗音乐 歌曲名称：' + MusicName);
	}

	//酷我音乐
	if (reKW.test(NowSite)) {
		$('#lrcName').after('<div id="vipmusicBtn" style="text-align: center;"></div>');
		$('#vipmusicBtn').append(musicVipBtn, searchVipBtn);
		MusicName = $('#lrcName').text();
		console.log('[音乐解析][信息] 匹配酷我音乐 歌曲名称：' + MusicName);
	}

	//虾米音乐
	if (reXM.test(NowSite)) {
		$('.player').parent('.song_info').after(musicVipBtn, searchVipBtn);
		MusicName = $('#title h1').text();
		$('#header .primary .nav a').css('width', '88px'); //修复虾米nav排版问题
		console.log('[音乐解析][信息] 匹配虾米音乐 歌曲名称：' + MusicName);
	}

	//百度音乐
	if (reBD.test(NowSite)) {
		$('.songpage-title').parent('.song').after(musicVipBtn, searchVipBtn);
		MusicName = $('.name').text();
		console.log('[音乐解析][信息] 匹配百度音乐 歌曲名称：' + MusicName);
	}

	//蜻蜓FM
	if (reQT.test(NowSite)) {
		QTadd();
		setInterval(function () {
			QTadd();
		}, 1000);
	}
	function QTadd() {
		if ($("#VipMusicBtn").length === 0 && $(".sprite-program").length > 0 && /qingting(.*)programs/i.test(window.location.href)) {
			$(".sprite-program").parent().after(musicVipBtn);
			console.log('[音乐解析][信息] 匹配蜻蜓FM');
		}
	}

	//荔枝FM
	if (reLZ.test(NowSite)) {
		$('.audioName').parent('.audioInfo').after(musicVipBtn);
		console.log('[音乐解析][信息] 匹配荔枝FM');
	}

	//喜马拉雅
	if (reXMLY.test(NowSite)) {
		XMadd();
		setInterval(function () {
			XMadd();
		}, 1000);
	}
	function XMadd() {
		if ($("#VipMusicBtn").length === 0 && $(".detailContent_title").length > 0 && /ximalaya(.*)sound/i.test(window.location.href)) {
			$('.detailContent_title').parent('.right').after(musicVipBtn);
			console.log('[音乐解析][信息] 匹配喜马拉雅');
		}
	}

	//全名K歌
	if (reQMKG.test(NowSite)) {
		$('.play_name').after(musicVipBtn, searchVipBtn);
		MusicName = $('.play_name').text();
		console.log('[音乐解析][信息] 匹配全名K歌 歌曲名称：' + MusicName);
	}

	//5Sing翻唱原唱
	if (re5sing.test(NowSite)) {
		$('.view_tit').after(musicVipBtn, searchVipBtn);
		$('#VipMusicBtn').css('margin-left', '18px');
		MusicName = $('.view_tit h1').text();
		console.log('[音乐解析][信息] 匹配5Sing 歌曲名称：' + MusicName);
	}

	//咪咕音乐
	if (reMG.test(NowSite)) {
		$('.song-name-text').eq(0).parent('.song-name').after(musicVipBtn, searchVipBtn);
		MusicName = $('.song-name-text').eq(0).text();
		console.log('[音乐解析][信息] 匹配咪咕音乐 歌曲名称：' + MusicName);
	}

	$(document).on('click', '#VipMusicBtn', function () {
		window.open("http://www.jbsou.cn/music/?url=" + encodeURIComponent(window.location.href));
	});

	$(document).on('click', '#VipSearchBtn', function () {
		window.open("http://www.jbsou.cn/music/?name=" + encodeURIComponent(MusicName.replace(/[\r\n]/g, "").replace(/for/i, "f o r")));
	});

})();