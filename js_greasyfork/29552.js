// ==UserScript==
// @name         微社VIP视频解析
// @version      666.999
// @description  集成17个接口来解析主流视频网站的会员视频，此脚本乃本人无聊试水用，如有侵犯网站权利，忘请见谅
// @author       微社电商，生活很简单
// @match        *://v.youku.com/v_show/id_*
// @match        *://*.iqiyi.com/v_*
// @match        *://vip.iqiyi.com/20*
// @match        *://*.mgtv.com/b/*
// @match        *://*.mgtv.com/z/*
// @match        *://tv.sohu.com/20*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://*.pptv.com/vod_*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/video/*
// @match        *://*.pptv.com/show/*
// @match        *://*.tudou.com/albumplay/*
// @match        *://*.qq.com/x/*
// @match        *://*.qq.com/cover/*
// @grant        GM_addStyle
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @run-at       document_start
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/122192
// @downloadURL https://update.greasyfork.org/scripts/29552/%E5%BE%AE%E7%A4%BEVIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/29552/%E5%BE%AE%E7%A4%BEVIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
	'use strict';
	GM_addStyle('.ikrong{position:fixed;z-index:999999;right:1%;top:23%;background-color:#ea5514;width:80px;height:30px;opacity:.4;overflow:hidden;display:none}' + '.ikrong .button{position:relative;width:80%;height:80%;background-position:center;background-size:cover}' + '.ikrong div.list{position:absolute;padding-left:80px;left:0;top:-130px;opacity:0;width:80px;height:240px;display:table}' + '.ikrong div.list div{height:100%;display:table-cell;vertical-align:middle}' + '.ikrong div.list ul{list-style:none;position:relative;left:0;width:60px;height:auto;top:0;bottom:0}' + '.ikrong div.list ul li:hover{background: #348cee;color: #fff;cursor: pointer;}' + '.ikrong div.list ul li{width:50px;height:30px;display:block;padding: 3px;font-size:12px;text-align:center;line-height:30px;background-color:#ea5514;color:#fff;cursor:pointer;margin-left:-200%');
	$("body").append('<div class="ikrong" style="opacity: 0.4; display: block; overflow: hidden;"><div class="button" style="font-size: 1px;color: #fff;text-align: center;line-height: 30px;width: 80px;font-weight:900;">微社解析</div><div class="list" style="left: -20px; opacity: 0;"><div><ul><li id="playaaa">小品解析</li><li id="play111">47解析</li><li id="play222">妹儿解析</li><li id="play333">司机解析</li><li id="play444">那片解析</li><li id="play555">5奇艺</li><li id="play666">云上解析</li><li id="play777">西瓜解析</li><li id="play888">无名解析</li><li id="play999">舞动秋天</li><li id="playbbb">72解析</li><li id="playccc">4P解析</li><li id="playddd">梦中解析</li><li id="playeee">言鹏解析</li><li id="playfff">万能解析</li><li id="playggg">免费解析</li><li id="playhhh">云解析</li></ul></div></div></div>'), $(".gui_FlashPlayer").css('display', 'none'), $(".ikrong").on("mouseover", function() {
		$(this).animate({
			opacity: 1
		}, {
			speed: "normal",
			queue: !1
		}), $(this).css("overflow", "visible"), $(this).find(".list").animate({
			right: "50px",
			opacity: "1"
		}, {
			speed: 1500,
			queue: !1
		})
	}), $(".ikrong").on("mouseout", function() {
		$(this).animate({
			opacity: .4
		}, {
			speed: "normal",
			queue: !1
		}), $(this).find(".list").animate({
			left: "-20px",
			opacity: "0"
		}, {
			speed: 1e3,
			queue: !1
		}), $(this).css("overflow", "hidden")
	}), $("#playaaa").on("click", function() {
		var url = window.location.href;
		var style = "font-weight:bold;padding:0;position:absolute;text-align:center;";
		if (url.indexOf('youku.com') > 0) {
			document.getElementsByClassName('vpactionv5_iframe_wrap')[0].style.display = 'none';
			doPlay('player');
		}
		if (url.indexOf('www.tudou.com') > 0) {
			style = 'width:100%;height:500px;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('v.qq.com') > 0) {
			doPlay('tenvideo_player');
			doPlay('mod_player');
			setInterval(function() {
				var newUrl = window.location.href;
				if (newUrl != url) {
					url = window.location.href;
					doPlay('tenvideo_player');
					doPlay('mod_player');
				}
			}, 1000);
		}
		if (url.indexOf('www.mgtv.com') > 0) {
			doPlay('mgtv-player-wrap');
		}
		if (url.indexOf('tv.sohu.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('sohuplayer');
		}
		if (url.indexOf('v.pptv.com') > 0) {
			style = 'width:100%;height:100%;z-index:999999;';
			doPlay('pptv_playpage_box');
		}
		if (url.indexOf('www.acfun.cn') > 0) {
			style = 'width:80%;height:500px;position:absolute;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('www.bilibili.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('bofqi');
		}

		function doPlay(playerId) {
			setTimeout(function() {
				if (document.getElementById(playerId)) {
					document.getElementById(playerId).innerHTML = '<iframe style="border:none;' + style + '" width="100%" height="100%" src="https://www.zuixiaopin.com/api/cloudVideo?url=' + url + '"></iframe>';
				}
			}, 500);
		}
		var a = new Object;
		var url = window.location.href;
		if (url.indexOf("iqiyi.com") > -1) {
			window.location.href = "https://www.zuixiaopin.com/api/cloudVideo?url=" + url
		}
		if (url.indexOf("le.com") > -1) {
			window.location.href = "https://www.zuixiaopin.com/api/cloudVideo?url=" + url
		}
	}), $("#playbbb").on("click", function() {
		var url = window.location.href;
		var style = "font-weight:bold;padding:0;position:absolute;text-align:center;";
		if (url.indexOf('youku.com') > 0) {
			document.getElementsByClassName('vpactionv5_iframe_wrap')[0].style.display = 'none';
			doPlay('player');
		}
		if (url.indexOf('www.mgtv.com') > 0) {
			doPlay('mgtv-player-wrap');
		}
		if (url.indexOf('tv.sohu.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('sohuplayer');
		}
		if (url.indexOf('v.pptv.com') > 0) {
			style = 'width:100%;height:100%;z-index:999999;';
			doPlay('pptv_playpage_box');
		}
		if (url.indexOf('www.acfun.cn') > 0) {
			style = 'width:80%;height:500px;position:absolute;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('www.bilibili.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('bofqi');
		}

		function doPlay(playerId) {
			setTimeout(function() {
				if (document.getElementById(playerId)) {
					document.getElementById(playerId).innerHTML = '<iframe style="border:none;' + style + '" width="100%" height="100%" src="http://q.z.vip.totv.72du.com/?url=' + url + '"></iframe>';
				}
			}, 500);
		}
		var a = new Object;
		var url = window.location.href;
		if (url.indexOf("iqiyi.com") > -1) {
			window.location.href = "http://q.z.vip.totv.72du.com/?url=" + url
		}
		if (url.indexOf("v.qq.com") > -1) {
			window.location.href = "http://q.z.vip.totv.72du.com/?url=" + url
		}
		if (url.indexOf("le.com") > -1) {
			window.location.href = "http://q.z.vip.totv.72du.com/?url=" + url
		}
		if (url.indexOf("tudou.com") > -1) {
			window.location.href = "http://q.z.vip.totv.72du.com/?url=" + url
		}
	}), $("#playccc").on("click", function() {
		var url = window.location.href;
		var style = "font-weight:bold;padding:0;position:absolute;text-align:center;";
		if (url.indexOf('youku.com') > 0) {
			document.getElementsByClassName('vpactionv5_iframe_wrap')[0].style.display = 'none';
			doPlay('player');
		}
		if (url.indexOf('www.mgtv.com') > 0) {
			doPlay('mgtv-player-wrap');
		}
		if (url.indexOf('tv.sohu.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('sohuplayer');
		}
		if (url.indexOf('v.pptv.com') > 0) {
			style = 'width:100%;height:100%;z-index:999999;';
			doPlay('pptv_playpage_box');
		}
		if (url.indexOf('www.acfun.cn') > 0) {
			style = 'width:80%;height:500px;position:absolute;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('www.bilibili.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('bofqi');
		}

		function doPlay(playerId) {
			setTimeout(function() {
				if (document.getElementById(playerId)) {
					document.getElementById(playerId).innerHTML = '<iframe style="border:none;' + style + '" width="100%" height="100%" src="http://www.ppypp.com/yunparse/?url=' + url + '"></iframe>';
				}
			}, 500);
		}
		var a = new Object;
		var url = window.location.href;
		if (url.indexOf("iqiyi.com") > -1) {
			window.location.href = "http://www.ppypp.com/yunparse/?url=" + url
		}
		if (url.indexOf("v.qq.com") > -1) {
			window.location.href = "http://www.ppypp.com/yunparse/?url=" + url
		}
		if (url.indexOf("le.com") > -1) {
			window.location.href = "http://www.ppypp.com/yunparse/?url=" + url
		}
		if (url.indexOf("tudou.com") > -1) {
			window.location.href = "http://www.ppypp.com/yunparse/?url=" + url
		}
	}), $("#playddd").on("click", function() {
		var url = window.location.href;
		var style = "font-weight:bold;padding:0;position:absolute;text-align:center;";
		if (url.indexOf('youku.com') > 0) {
			document.getElementsByClassName('vpactionv5_iframe_wrap')[0].style.display = 'none';
			doPlay('player');
		}
		if (url.indexOf('www.mgtv.com') > 0) {
			doPlay('mgtv-player-wrap');
		}
		if (url.indexOf('tv.sohu.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('sohuplayer');
		}
		if (url.indexOf('v.pptv.com') > 0) {
			style = 'width:100%;height:100%;z-index:999999;';
			doPlay('pptv_playpage_box');
		}
		if (url.indexOf('www.acfun.cn') > 0) {
			style = 'width:80%;height:500px;position:absolute;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('www.bilibili.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('bofqi');
		}

		function doPlay(playerId) {
			setTimeout(function() {
				if (document.getElementById(playerId)) {
					document.getElementById(playerId).innerHTML = '<iframe style="border:none;' + style + '" width="100%" height="100%" src="http://www.wpswan.com/mzr/vipparse/index.php?url=' + url + '"></iframe>';
				}
			}, 500);
		}
		var a = new Object;
		var url = window.location.href;
		if (url.indexOf("iqiyi.com") > -1) {
			window.location.href = "http://www.wpswan.com/mzr/vipparse/index.php?url=" + url
		}
		if (url.indexOf("v.qq.com") > -1) {
			window.location.href = "http://www.wpswan.com/mzr/vipparse/index.php?url=" + url
		}
		if (url.indexOf("le.com") > -1) {
			window.location.href = "http://www.wpswan.com/mzr/vipparse/index.php?url=" + url
		}
		if (url.indexOf("tudou.com") > -1) {
			window.location.href = "http://www.wpswan.com/mzr/vipparse/index.php?url=" + url
		}
	}), $("#playeee").on("click", function() {
		var url = window.location.href;
		var style = "font-weight:bold;padding:0;position:absolute;text-align:center;";
		if (url.indexOf('youku.com') > 0) {
			document.getElementsByClassName('vpactionv5_iframe_wrap')[0].style.display = 'none';
			doPlay('player');
		}
		if (url.indexOf('www.mgtv.com') > 0) {
			doPlay('mgtv-player-wrap');
		}
		if (url.indexOf('tv.sohu.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('sohuplayer');
		}
		if (url.indexOf('v.pptv.com') > 0) {
			style = 'width:100%;height:100%;z-index:999999;';
			doPlay('pptv_playpage_box');
		}
		if (url.indexOf('www.acfun.cn') > 0) {
			style = 'width:80%;height:500px;position:absolute;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('www.bilibili.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('bofqi');
		}

		function doPlay(playerId) {
			setTimeout(function() {
				if (document.getElementById(playerId)) {
					document.getElementById(playerId).innerHTML = '<iframe style="border:none;' + style + '" width="100%" height="100%" src="http://xin.yingyanxinwen.cn/dxl/?url=' + url + '"></iframe>';
				}
			}, 500);
		}
		var a = new Object;
		var url = window.location.href;
		if (url.indexOf("iqiyi.com") > -1) {
			window.location.href = "http://xin.yingyanxinwen.cn/dxl/?url=" + url
		}
		if (url.indexOf("v.qq.com") > -1) {
			window.location.href = "http://xin.yingyanxinwen.cn/dxl/?url=" + url
		}
		if (url.indexOf("le.com") > -1) {
			window.location.href = "http://xin.yingyanxinwen.cn/dxl/?url=" + url
		}
		if (url.indexOf("tudou.com") > -1) {
			window.location.href = "http://xin.yingyanxinwen.cn/dxl/?url=" + url
		}
	}), $("#playfff").on("click", function() {
		var url = window.location.href;
		var style = "font-weight:bold;padding:0;position:absolute;text-align:center;";
		if (url.indexOf('youku.com') > 0) {
			document.getElementsByClassName('vpactionv5_iframe_wrap')[0].style.display = 'none';
			doPlay('player');
		}
		if (url.indexOf('www.mgtv.com') > 0) {
			doPlay('mgtv-player-wrap');
		}
		if (url.indexOf('tv.sohu.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('sohuplayer');
		}
		if (url.indexOf('v.pptv.com') > 0) {
			style = 'width:100%;height:100%;z-index:999999;';
			doPlay('pptv_playpage_box');
		}
		if (url.indexOf('www.acfun.cn') > 0) {
			style = 'width:80%;height:500px;position:absolute;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('www.bilibili.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('bofqi');
		}

		function doPlay(playerId) {
			setTimeout(function() {
				if (document.getElementById(playerId)) {
					document.getElementById(playerId).innerHTML = '<iframe style="border:none;' + style + '" width="100%" height="100%" src="http://yyygwz.com/index.php?url=' + url + '"></iframe>';
				}
			}, 500);
		}
		var a = new Object;
		var url = window.location.href;
		if (url.indexOf("iqiyi.com") > -1) {
			window.location.href = "http://yyygwz.com/index.php?url=" + url
		}
		if (url.indexOf("v.qq.com") > -1) {
			window.location.href = "http://yyygwz.com/index.php?url=" + url
		}
		if (url.indexOf("le.com") > -1) {
			window.location.href = "http://yyygwz.com/index.php?url=" + url
		}
		if (url.indexOf("tudou.com") > -1) {
			window.location.href = "http://yyygwz.com/index.php?url=" + url
		}
	}), $("#playggg").on("click", function() {
		var url = window.location.href;
		var style = "font-weight:bold;padding:0;position:absolute;text-align:center;";
		if (url.indexOf('youku.com') > 0) {
			document.getElementsByClassName('vpactionv5_iframe_wrap')[0].style.display = 'none';
			doPlay('player');
		}
		if (url.indexOf('www.mgtv.com') > 0) {
			doPlay('mgtv-player-wrap');
		}
		if (url.indexOf('tv.sohu.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('sohuplayer');
		}
		if (url.indexOf('v.pptv.com') > 0) {
			style = 'width:100%;height:100%;z-index:999999;';
			doPlay('pptv_playpage_box');
		}
		if (url.indexOf('www.acfun.cn') > 0) {
			style = 'width:80%;height:500px;position:absolute;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('www.bilibili.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('bofqi');
		}

		function doPlay(playerId) {
			setTimeout(function() {
				if (document.getElementById(playerId)) {
					document.getElementById(playerId).innerHTML = '<iframe style="border:none;' + style + '" width="100%" height="100%" src="http://parse.colaparse.cc/?url=' + url + '"></iframe>';
				}
			}, 500);
		}
		var a = new Object;
		var url = window.location.href;
		if (url.indexOf("iqiyi.com") > -1) {
			window.location.href = "http://parse.colaparse.cc/?url=" + url
		}
		if (url.indexOf("v.qq.com") > -1) {
			window.location.href = "http://parse.colaparse.cc/?url=" + url
		}
		if (url.indexOf("le.com") > -1) {
			window.location.href = "http://parse.colaparse.cc/?url=" + url
		}
		if (url.indexOf("tudou.com") > -1) {
			window.location.href = "http://parse.colaparse.cc/?url=" + url
		}
	}), $("#playhhh").on("click", function() {
		var url = window.location.href;
		var style = "font-weight:bold;padding:0;position:absolute;text-align:center;";
		if (url.indexOf('youku.com') > 0) {
			document.getElementsByClassName('vpactionv5_iframe_wrap')[0].style.display = 'none';
			doPlay('player');
		}
		if (url.indexOf('www.mgtv.com') > 0) {
			doPlay('mgtv-player-wrap');
		}
		if (url.indexOf('tv.sohu.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('sohuplayer');
		}
		if (url.indexOf('v.pptv.com') > 0) {
			style = 'width:100%;height:100%;z-index:999999;';
			doPlay('pptv_playpage_box');
		}
		if (url.indexOf('www.acfun.cn') > 0) {
			style = 'width:80%;height:500px;position:absolute;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('www.bilibili.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('bofqi');
		}

		function doPlay(playerId) {
			setTimeout(function() {
				if (document.getElementById(playerId)) {
					document.getElementById(playerId).innerHTML = '<iframe style="border:none;' + style + '" width="100%" height="100%" src="http://s1y2.com/?url=' + url + '"></iframe>';
				}
			}, 500);
		}
		var a = new Object;
		var url = window.location.href;
		if (url.indexOf("iqiyi.com") > -1) {
			window.location.href = "http://s1y2.com/?url=" + url
		}
		if (url.indexOf("v.qq.com") > -1) {
			window.location.href = "http://s1y2.com/?url=" + url
		}
		if (url.indexOf("le.com") > -1) {
			window.location.href = "http://s1y2.com/?url=" + url
		}
		if (url.indexOf("tudou.com") > -1) {
			window.location.href = "http://s1y2.com/?url=" + url
		}
	}), $("#play111").on("click", function() {
		var url = window.location.href;
		var style = "font-weight:bold;padding:0;position:absolute;text-align:center;";
		if (url.indexOf('youku.com') > 0) {
			document.getElementsByClassName('vpactionv5_iframe_wrap')[0].style.display = 'none';
			doPlay('player');
		}
		if (url.indexOf('www.tudou.com') > 0) {
			style = 'width:100%;height:500px;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('v.qq.com') > 0) {
			doPlay('tenvideo_player');
			doPlay('mod_player');
			setInterval(function() {
				var newUrl = window.location.href;
				if (newUrl != url) {
					url = window.location.href;
					doPlay('tenvideo_player');
					doPlay('mod_player');
				}
			}, 1000);
		}
		if (url.indexOf('www.mgtv.com') > 0) {
			doPlay('mgtv-player-wrap');
		}
		if (url.indexOf('tv.sohu.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('sohuplayer');
		}
		if (url.indexOf('v.pptv.com') > 0) {
			style = 'width:100%;height:100%;z-index:999999;';
			doPlay('pptv_playpage_box');
		}
		if (url.indexOf('www.acfun.cn') > 0) {
			style = 'width:80%;height:500px;position:absolute;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('www.bilibili.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('bofqi');
		}

		function doPlay(playerId) {
			setTimeout(function() {
				if (document.getElementById(playerId)) {
					document.getElementById(playerId).innerHTML = '<iframe style="border:none;' + style + '" width="100%" height="100%" src="https://api.47ks.com/webcloud/?v=' + url + '"></iframe>';
				}
			}, 500);
		}
		var a = new Object;
		var url = window.location.href;
		if (url.indexOf("iqiyi.com") > -1) {
			window.location.href = "https://api.47ks.com/webcloud/?v=" + url
		}
		if (url.indexOf("le.com") > -1) {
			window.location.href = "https://api.47ks.com/webcloud/?v=" + url
		}
	}), $("#play222").on("click", function() {
		var url = window.location.href;
		var style = "font-weight:bold;padding:0;position:absolute;text-align:center;";
		if (url.indexOf('youku.com') > 0) {
			document.getElementsByClassName('vpactionv5_iframe_wrap')[0].style.display = 'none';
			doPlay('player');
		}
		if (url.indexOf('www.tudou.com') > 0) {
			style = 'width:100%;height:500px;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('v.qq.com') > 0) {
			doPlay('tenvideo_player');
			doPlay('mod_player');
			setInterval(function() {
				var newUrl = window.location.href;
				if (newUrl != url) {
					url = window.location.href;
					doPlay('tenvideo_player');
					doPlay('mod_player');
				}
			}, 1000);
		}
		if (url.indexOf('www.mgtv.com') > 0) {
			doPlay('mgtv-player-wrap');
		}
		if (url.indexOf('tv.sohu.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('sohuplayer');
		}
		if (url.indexOf('v.pptv.com') > 0) {
			style = 'width:100%;height:100%;z-index:999999;';
			doPlay('pptv_playpage_box');
		}
		if (url.indexOf('www.acfun.cn') > 0) {
			style = 'width:80%;height:500px;position:absolute;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('www.bilibili.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('bofqi');
		}

		function doPlay(playerId) {
			setTimeout(function() {
				if (document.getElementById(playerId)) {
					document.getElementById(playerId).innerHTML = '<iframe style="border:none;' + style + '" width="100%" height="100%" src="https://www.yymeier.com/api.php?url=' + url + '"></iframe>';
				}
			}, 500);
		}
		var a = new Object;
		var url = window.location.href;
		if (url.indexOf("iqiyi.com") > -1) {
			window.location.href = "https://www.yymeier.com/api.php?url=" + url
		}
		if (url.indexOf("le.com") > -1) {
			window.location.href = "https://www.yymeier.com/api.php?url=" + url
		}
	}), $("#play333").on("click", function() {
		var url = window.location.href;
		var style = "font-weight:bold;padding:0;position:absolute;text-align:center;";
		if (url.indexOf('youku.com') > 0) {
			document.getElementsByClassName('vpactionv5_iframe_wrap')[0].style.display = 'none';
			doPlay('player');
		}
		if (url.indexOf('www.tudou.com') > 0) {
			style = 'width:100%;height:500px;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('v.qq.com') > 0) {
			doPlay('tenvideo_player');
			doPlay('mod_player');
			setInterval(function() {
				var newUrl = window.location.href;
				if (newUrl != url) {
					url = window.location.href;
					doPlay('tenvideo_player');
					doPlay('mod_player');
				}
			}, 1000);
		}
		if (url.indexOf('www.mgtv.com') > 0) {
			doPlay('mgtv-player-wrap');
		}
		if (url.indexOf('tv.sohu.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('sohuplayer');
		}
		if (url.indexOf('v.pptv.com') > 0) {
			style = 'width:100%;height:100%;z-index:999999;';
			doPlay('pptv_playpage_box');
		}
		if (url.indexOf('www.acfun.cn') > 0) {
			style = 'width:80%;height:500px;position:absolute;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('www.bilibili.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('bofqi');
		}

		function doPlay(playerId) {
			setTimeout(function() {
				if (document.getElementById(playerId)) {
					document.getElementById(playerId).innerHTML = '<iframe style="border:none;' + style + '" width="100%" height="100%" src="https://aikan-tv.com/tong.php?url=' + url + '"></iframe>';
				}
			}, 500);
		}
		var a = new Object;
		var url = window.location.href;
		if (url.indexOf("iqiyi.com") > -1) {
			window.location.href = "https://aikan-tv.com/tong.php?url=" + url
		}
		if (url.indexOf("le.com") > -1) {
			window.location.href = "https://aikan-tv.com/tong.php?url=" + url
		}
	}), $("#play444").on("click", function() {
		var url = window.location.href;
		var style = "font-weight:bold;padding:0;position:absolute;text-align:center;";
		if (url.indexOf('youku.com') > 0) {
			document.getElementsByClassName('vpactionv5_iframe_wrap')[0].style.display = 'none';
			doPlay('player');
		}
		if (url.indexOf('www.tudou.com') > 0) {
			style = 'width:100%;height:500px;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('v.qq.com') > 0) {
			doPlay('tenvideo_player');
			doPlay('mod_player');
			setInterval(function() {
				var newUrl = window.location.href;
				if (newUrl != url) {
					url = window.location.href;
					doPlay('tenvideo_player');
					doPlay('mod_player');
				}
			}, 1000);
		}
		if (url.indexOf('www.mgtv.com') > 0) {
			doPlay('mgtv-player-wrap');
		}
		if (url.indexOf('tv.sohu.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('sohuplayer');
		}
		if (url.indexOf('v.pptv.com') > 0) {
			style = 'width:100%;height:100%;z-index:999999;';
			doPlay('pptv_playpage_box');
		}
		if (url.indexOf('www.acfun.cn') > 0) {
			style = 'width:80%;height:500px;position:absolute;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('www.bilibili.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('bofqi');
		}

		function doPlay(playerId) {
			setTimeout(function() {
				if (document.getElementById(playerId)) {
					document.getElementById(playerId).innerHTML = '<iframe style="border:none;' + style + '" width="100%" height="100%" src="https://jxapi.nepian.com/ckparse/?url=' + url + '"></iframe>';
				}
			}, 500);
		}
		var a = new Object;
		var url = window.location.href;
		if (url.indexOf("iqiyi.com") > -1) {
			window.location.href = "https://jxapi.nepian.com/ckparse/?url=" + url
		}
		if (url.indexOf("le.com") > -1) {
			window.location.href = "https://jxapi.nepian.com/ckparse/?url=" + url
		}
	}), $("#play555").on("click", function() {
		var url = window.location.href;
		var style = "font-weight:bold;padding:0;position:absolute;text-align:center;";
		if (url.indexOf('youku.com') > 0) {
			document.getElementsByClassName('vpactionv5_iframe_wrap')[0].style.display = 'none';
			doPlay('player');
		}
		if (url.indexOf('www.mgtv.com') > 0) {
			doPlay('mgtv-player-wrap');
		}
		if (url.indexOf('tv.sohu.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('sohuplayer');
		}
		if (url.indexOf('v.pptv.com') > 0) {
			style = 'width:100%;height:100%;z-index:999999;';
			doPlay('pptv_playpage_box');
		}
		if (url.indexOf('www.acfun.cn') > 0) {
			style = 'width:80%;height:500px;position:absolute;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('www.bilibili.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('bofqi');
		}

		function doPlay(playerId) {
			setTimeout(function() {
				if (document.getElementById(playerId)) {
					document.getElementById(playerId).innerHTML = '<iframe style="border:none;' + style + '" width="100%" height="100%" src="http://www.jiexi.cx/5qiyi/?url=' + url + '"></iframe>';
				}
			}, 500);
		}
		var a = new Object;
		var url = window.location.href;
		if (url.indexOf("iqiyi.com") > -1) {
			window.location.href = "http://www.jiexi.cx/5qiyi/?url=" + url
		}
		if (url.indexOf("v.qq.com") > -1) {
			window.location.href = "http://www.jiexi.cx/5qiyi/?url=" + url
		}
		if (url.indexOf("le.com") > -1) {
			window.location.href = "http://www.jiexi.cx/5qiyi/?url=" + url
		}
		if (url.indexOf("tudou.com") > -1) {
			window.location.href = "http://www.jiexi.cx/5qiyi/?url=" + url
		}
	}), $("#play666").on("click", function() {
		var url = window.location.href;
		var style = "font-weight:bold;padding:0;position:absolute;text-align:center;";
		if (url.indexOf('youku.com') > 0) {
			document.getElementsByClassName('vpactionv5_iframe_wrap')[0].style.display = 'none';
			doPlay('player');
		}
		if (url.indexOf('www.mgtv.com') > 0) {
			doPlay('mgtv-player-wrap');
		}
		if (url.indexOf('tv.sohu.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('sohuplayer');
		}
		if (url.indexOf('v.pptv.com') > 0) {
			style = 'width:100%;height:100%;z-index:999999;';
			doPlay('pptv_playpage_box');
		}
		if (url.indexOf('www.acfun.cn') > 0) {
			style = 'width:80%;height:500px;position:absolute;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('www.bilibili.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('bofqi');
		}

		function doPlay(playerId) {
			setTimeout(function() {
				if (document.getElementById(playerId)) {
					document.getElementById(playerId).innerHTML = '<iframe style="border:none;' + style + '" width="100%" height="100%" src="http://www.ou522.cn/t2/1.php?url=' + url + '"></iframe>';
				}
			}, 500);
		}
		var a = new Object;
		var url = window.location.href;
		if (url.indexOf("iqiyi.com") > -1) {
			window.location.href = "http://www.ou522.cn/t2/1.php?url=" + url
		}
		if (url.indexOf("v.qq.com") > -1) {
			window.location.href = "http://www.ou522.cn/t2/1.php?url=" + url
		}
		if (url.indexOf("le.com") > -1) {
			window.location.href = "http://www.ou522.cn/t2/1.php?url=" + url
		}
		if (url.indexOf("tudou.com") > -1) {
			window.location.href = "http://www.ou522.cn/t2/1.php?url=" + url
		}
	}), $("#play777").on("click", function() {
		var url = window.location.href;
		var style = "font-weight:bold;padding:0;position:absolute;text-align:center;";
		if (url.indexOf('youku.com') > 0) {
			document.getElementsByClassName('vpactionv5_iframe_wrap')[0].style.display = 'none';
			doPlay('player');
		}
		if (url.indexOf('www.mgtv.com') > 0) {
			doPlay('mgtv-player-wrap');
		}
		if (url.indexOf('tv.sohu.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('sohuplayer');
		}
		if (url.indexOf('v.pptv.com') > 0) {
			style = 'width:100%;height:100%;z-index:999999;';
			doPlay('pptv_playpage_box');
		}
		if (url.indexOf('www.acfun.cn') > 0) {
			style = 'width:80%;height:500px;position:absolute;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('www.bilibili.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('bofqi');
		}

		function doPlay(playerId) {
			setTimeout(function() {
				if (document.getElementById(playerId)) {
					document.getElementById(playerId).innerHTML = '<iframe style="border:none;' + style + '" width="100%" height="100%" src="http://www.vipjiexi.com/yun.php?url=' + url + '"></iframe>';
				}
			}, 500);
		}
		var a = new Object;
		var url = window.location.href;
		if (url.indexOf("iqiyi.com") > -1) {
			window.location.href = "http://www.vipjiexi.com/yun.php?url=" + url
		}
		if (url.indexOf("v.qq.com") > -1) {
			window.location.href = "http://www.vipjiexi.com/yun.php?url=" + url
		}
		if (url.indexOf("le.com") > -1) {
			window.location.href = "http://www.vipjiexi.com/yun.php?url=" + url
		}
		if (url.indexOf("tudou.com") > -1) {
			window.location.href = "http://www.vipjiexi.com/yun.php?url=" + url
		}
	}), $("#play888").on("click", function() {
		var url = window.location.href;
		var style = "font-weight:bold;padding:0;position:absolute;text-align:center;";
		if (url.indexOf('youku.com') > 0) {
			document.getElementsByClassName('vpactionv5_iframe_wrap')[0].style.display = 'none';
			doPlay('player');
		}
		if (url.indexOf('www.mgtv.com') > 0) {
			doPlay('mgtv-player-wrap');
		}
		if (url.indexOf('tv.sohu.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('sohuplayer');
		}
		if (url.indexOf('v.pptv.com') > 0) {
			style = 'width:100%;height:100%;z-index:999999;';
			doPlay('pptv_playpage_box');
		}
		if (url.indexOf('www.acfun.cn') > 0) {
			style = 'width:80%;height:500px;position:absolute;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('www.bilibili.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('bofqi');
		}

		function doPlay(playerId) {
			setTimeout(function() {
				if (document.getElementById(playerId)) {
					document.getElementById(playerId).innerHTML = '<iframe style="border:none;' + style + '" width="100%" height="100%" src="http://www.wmxz.wang/video.php?url=' + url + '"></iframe>';
				}
			}, 500);
		}
		var a = new Object;
		var url = window.location.href;
		if (url.indexOf("iqiyi.com") > -1) {
			window.location.href = "http://www.wmxz.wang/video.php?url=" + url
		}
		if (url.indexOf("v.qq.com") > -1) {
			window.location.href = "http://www.wmxz.wang/video.php?url=" + url
		}
		if (url.indexOf("le.com") > -1) {
			window.location.href = "http://www.wmxz.wang/video.php?url=" + url
		}
		if (url.indexOf("tudou.com") > -1) {
			window.location.href = "http://www.wmxz.wang/video.php?url=" + url
		}
	}), $("#play999").on("click", function() {
		var url = window.location.href;
		var style = "font-weight:bold;padding:0;position:absolute;text-align:center;";
		if (url.indexOf('youku.com') > 0) {
			document.getElementsByClassName('vpactionv5_iframe_wrap')[0].style.display = 'none';
			doPlay('player');
		}
		if (url.indexOf('www.mgtv.com') > 0) {
			doPlay('mgtv-player-wrap');
		}
		if (url.indexOf('tv.sohu.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('sohuplayer');
		}
		if (url.indexOf('v.pptv.com') > 0) {
			style = 'width:100%;height:100%;z-index:999999;';
			doPlay('pptv_playpage_box');
		}
		if (url.indexOf('www.acfun.cn') > 0) {
			style = 'width:80%;height:500px;position:absolute;z-index:999999;';
			doPlay('player');
		}
		if (url.indexOf('www.bilibili.com') > 0) {
			style = 'width:100%;height:500px;position:absolute;z-index:999999;';
			doPlay('bofqi');
		}

		function doPlay(playerId) {
			setTimeout(function() {
				if (document.getElementById(playerId)) {
					document.getElementById(playerId).innerHTML = '<iframe style="border:none;' + style + '" width="100%" height="100%" src="http://qtzr.net/s/?qt=' + url + '"></iframe>';
				}
			}, 500);
		}
		var a = new Object;
		var url = window.location.href;
		if (url.indexOf("iqiyi.com") > -1) {
			window.location.href = "http://qtzr.net/s/?qt=" + url
		}
		if (url.indexOf("v.qq.com") > -1) {
			window.location.href = "http://qtzr.net/s/?qt=" + url
		}
		if (url.indexOf("le.com") > -1) {
			window.location.href = "http://qtzr.net/s/?qt=" + url
		}
		if (url.indexOf("tudou.com") > -1) {
			window.location.href = "http://qtzr.net/s/?qt=" + url
		}
	})
})();