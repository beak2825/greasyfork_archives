// ==UserScript==
// @name        【8年老脚本 常更新】 全网音乐一键免费下载 一键搜索 秒下载VIP音乐 在线试听 [无损音乐的下载]2026.1月更新 
// @version      3.92
// @homepage     https://greasyfork.org/zh-CN/scripts/37058
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
// @description  全网音乐在线试听 一键免费下载 一键搜索 提供多站合一 音乐试听 音乐下载 音乐搜索解决方案，网易云音乐，QQ音乐，酷狗音乐，酷我音乐，虾米音乐，百度音乐，蜻蜓FM，荔枝FM，喜马拉雅。
// @grant        unsafeWindow
// @icon         http://music.sonimei.cn/favicon.ico
// @run-at       document-end
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/37058/%E3%80%908%E5%B9%B4%E8%80%81%E8%84%9A%E6%9C%AC%20%E5%B8%B8%E6%9B%B4%E6%96%B0%E3%80%91%20%E5%85%A8%E7%BD%91%E9%9F%B3%E4%B9%90%E4%B8%80%E9%94%AE%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%20%E4%B8%80%E9%94%AE%E6%90%9C%E7%B4%A2%20%E7%A7%92%E4%B8%8B%E8%BD%BDVIP%E9%9F%B3%E4%B9%90%20%E5%9C%A8%E7%BA%BF%E8%AF%95%E5%90%AC%20%5B%E6%97%A0%E6%8D%9F%E9%9F%B3%E4%B9%90%E7%9A%84%E4%B8%8B%E8%BD%BD%5D20261%E6%9C%88%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/37058/%E3%80%908%E5%B9%B4%E8%80%81%E8%84%9A%E6%9C%AC%20%E5%B8%B8%E6%9B%B4%E6%96%B0%E3%80%91%20%E5%85%A8%E7%BD%91%E9%9F%B3%E4%B9%90%E4%B8%80%E9%94%AE%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%20%E4%B8%80%E9%94%AE%E6%90%9C%E7%B4%A2%20%E7%A7%92%E4%B8%8B%E8%BD%BDVIP%E9%9F%B3%E4%B9%90%20%E5%9C%A8%E7%BA%BF%E8%AF%95%E5%90%AC%20%5B%E6%97%A0%E6%8D%9F%E9%9F%B3%E4%B9%90%E7%9A%84%E4%B8%8B%E8%BD%BD%5D20261%E6%9C%88%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==
(function() {
	'use strict';
	var curPlaySite = '';
	var curWords = '';
	var videoSite = window.location.href;
	var reWY = /163(.*)song/i;
	var reQQ = /QQ(.*)song/i;
	var reKG = /kugou(.*)song/i;
	var reKW = /kuwo(.*)yinyue/i;
	var reXM = /xiami/i;
	var reBD = /baidu/i;
	var reQT = /qingting/i;
	var reLZ = /lizhi/i;
	var reMG = /migu/i;
	var reXMLY = /ximalaya/i;
	var vipBtn = '<a target="_blank" id="VipMusicBtn" style="margin:10px 0;display:inline-block;padding:0 5px;height:22px;border:1px solid red;color:red;vertical-align:bottom;text-decoration:none;font-size:17px;line-height:22px;cursor:pointer;">一键免费下载</a>';

  //网易云音乐
  if(reWY.test(videoSite)){
    var Title = $('.u-icn-37');
    Title.parent('.hd').after(vipBtn);
    $('#VipMusicBtn').attr('href','http://www.jbsou.cn/?url=' + encodeURIComponent(window.location.href.replace('http://music.163.com', "http://music.163.com/#")));
  }
  
  //QQ音乐
  if(reQQ.test(videoSite)){
    var Title = $('.data__name_txt');
    Title.parent('.data__name').after(vipBtn);
    $('#VipMusicBtn').attr('href','http://www.jbsou.cn/?url=' + encodeURIComponent(window.location.href));
  }
  
  //酷狗音乐
  if(reKG.test(videoSite)){
	KGadd();
	setInterval(function(){KGadd()},1000);
	function KGadd(){
		if($("#VipMusicBtn").length==0 && $(".audioName").length>0){
			var Title = $('.audioName');
			Title.parent('.songName').after(vipBtn);
		}
		$("#VipMusicBtn").attr("href","http://www.jbsou.cn/?url=" + encodeURIComponent(window.location.href));
	}
  }

  //酷我音乐
  if(reKW.test(videoSite)){
    var Title = $('#sinlesDownBtn');
    Title.parent('.down').after(vipBtn);
    $('#VipMusicBtn').attr('href','http://www.jbsou.cn/?url=' + encodeURIComponent(window.location.href));
  }

  //虾米音乐
  if(reXM.test(videoSite)){
    var Title = $('.player');
    Title.parent('.song_info').after(vipBtn);
    $('#VipMusicBtn').attr('href','http://www.jbsou.cn/?url=' + encodeURIComponent(window.location.href));
  }
  
  //百度音乐
  if(reBD.test(videoSite)){
    var Title = $('.songpage-title');
    Title.parent('.song').after(vipBtn);
    $('#VipMusicBtn').attr('href','http://www.jbsou.cn/?url=' + encodeURIComponent(window.location.href));
  }
  
  //蜻蜓FM
  if(reQT.test(videoSite)){
	QTadd();
	setInterval(function(){QTadd()},1000);
	function QTadd(){
		if($("#VipMusicBtn").length==0 && $(".sprite-program").length>0 && /qingting(.*)programs/i.test(window.location.href)){
			$(".sprite-program").parent().after(vipBtn);
		}
		$("#VipMusicBtn").attr("href","http://www.jbsou.cn/?url=" + encodeURIComponent(window.location.href));
	}
  }

  //荔枝FM
  if(reLZ.test(videoSite)){
    var Title = $('.audioName');
    Title.parent('.audioInfo').after(vipBtn);
    $('#VipMusicBtn').attr('href','http://www.jbsou.cn/?url=' + encodeURIComponent(window.location.href));
  }
  
  //喜马拉雅
  if(reXMLY.test(videoSite)){
	XMadd();
	setInterval(function(){XMadd()},1000);
	function XMadd(){
		if($("#VipMusicBtn").length==0 && $(".detailContent_title").length>0 && /ximalaya(.*)sound/i.test(window.location.href)){
			var Title = $('.detailContent_title');
			Title.parent('.right').after(vipBtn);
		}
		$("#VipMusicBtn").attr("href","http://www.jbsou.cn/?url=" + encodeURIComponent(window.location.href));
	}
  } 
  
})();