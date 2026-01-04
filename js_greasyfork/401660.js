// ==UserScript==
// @name         听说这样的标题更容易让人看到__________________2020.08.16更新__________________itys VIP视频免费播放 破解VIP视频去广告 免费VIP视频解析 实用
// @version      20.08.16
// @description  精心收集优质视频解析接口，为大家提供爱奇艺、腾讯、优酷、芒果TV四大视频网站视频解析服务，解析接口收集于互联网，如有侵权、不妥之处请联系我们删除，敬请谅解，邮箱 itys@foxmail.com 有【安卓APP版】下载 QQ群 237903556 加群答案 itys
// @author       itys
// @namespace    itys@foxmail.com
// @include      *.iqiyi.com/v_*
// @include      *.iqiyi.com/w_*
// @include      *.iqiyi.com/a_*
// @include      *v.qq.com/x/*
// @include      *v.qq.com/play*
// @include      *v.qq.com/cover*
// @include      *v.qq.com/tv/*
// @include      *v.youku.com/v_*
// @include      *v.youku.com/p*
// @include      *m.youku.com/v*
// @include      *m.youku.com/a*
// @include      *.mgtv.com/b/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401660/%E5%90%AC%E8%AF%B4%E8%BF%99%E6%A0%B7%E7%9A%84%E6%A0%87%E9%A2%98%E6%9B%B4%E5%AE%B9%E6%98%93%E8%AE%A9%E4%BA%BA%E7%9C%8B%E5%88%B0__________________20200816%E6%9B%B4%E6%96%B0__________________itys%20VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E6%92%AD%E6%94%BE%20%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%8E%BB%E5%B9%BF%E5%91%8A%20%E5%85%8D%E8%B4%B9VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%20%E5%AE%9E%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/401660/%E5%90%AC%E8%AF%B4%E8%BF%99%E6%A0%B7%E7%9A%84%E6%A0%87%E9%A2%98%E6%9B%B4%E5%AE%B9%E6%98%93%E8%AE%A9%E4%BA%BA%E7%9C%8B%E5%88%B0__________________20200816%E6%9B%B4%E6%96%B0__________________itys%20VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E6%92%AD%E6%94%BE%20%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%8E%BB%E5%B9%BF%E5%91%8A%20%E5%85%8D%E8%B4%B9VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%20%E5%AE%9E%E7%94%A8.meta.js
// ==/UserScript==

(function () {
	"use strict";
	function spjx() {
		var api = new Array(
			"https://jx.yingxiangbao.cn/vip.php?url=",
			"https://www.2ajx.com/vip.php?url="
		);
		var div = document.createElement("div");
		div.innerHTML = "<div style='position:fixed;top:10%;left:0;z-index:2147483647;display:block;width:40px;height:40px;border-radius:0 20px 20px 0;background-color:#ff0080;color:#fff;text-align:center;font-size:16px;line-height:40px'>视源</div>";
		div.onclick = function () {
			window.open(
				api[Math.floor(Math.random() * api.length)] + window.location.href
			);
		};
		document.body.appendChild(div);
	}
	var url = new Array(
		".iqiyi.com/v_",
		".iqiyi.com/w_",
		".iqiyi.com/a_",
		"v.qq.com/x/",
		"v.qq.com/play",
		"v.qq.com/cover",
		"v.qq.com/tv/",
		"v.youku.com/v_",
		"v.youku.com/p",
		"m.youku.com/v",
		"m.youku.com/a",
		".mgtv.com/b/"
	);
	var i;
	for (i = 0; i < url.length; i++) {
		if (window.location.href.indexOf(url[i]) != -1) {
			spjx();
			break;
		}
	}
})();
