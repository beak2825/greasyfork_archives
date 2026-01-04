// ==UserScript==
// @name         解除文亮已购课程观看次数限制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  你是否还在为网课次数不足而发愁，你是否经常没看完网课转眼次数耗光，如今你不必再为此担心，尝试使用此脚本，如此顺滑！
// @author       Shepher.Y
// @match        http://www.wenliangwk.com/video/plv*
// @grant        none
// @icon         http://www.wenliangwk.com/main_web/image/logo_small.ico
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/421277/%E8%A7%A3%E9%99%A4%E6%96%87%E4%BA%AE%E5%B7%B2%E8%B4%AD%E8%AF%BE%E7%A8%8B%E8%A7%82%E7%9C%8B%E6%AC%A1%E6%95%B0%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/421277/%E8%A7%A3%E9%99%A4%E6%96%87%E4%BA%AE%E5%B7%B2%E8%B4%AD%E8%AF%BE%E7%A8%8B%E8%A7%82%E7%9C%8B%E6%AC%A1%E6%95%B0%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    player.off("playing");
    player.on('playing', function(e) {
		if (player.getStatus() == 'play' | player.getStatus() == 'loading') {
			if (stid != null && stid != undefined && stid != "" && "au_ye" == au) {
				var cookie_time = cookie.get("time_" + tuid + "_" + stid + "_" + vid);
				if (cookie_time == null && play_count > 0) {
					cookie.set("time_" + tuid + "_" + stid + "_" + vid, Date.parse(new Date()));
					$.ajax({
						type: "post",
						async: false,
						url: "/video/playCountF",
						data: {
							"videoId": vid,
							"uid": stid,
							"tuid": tuid
						},
						success: function(result) {
							play_count = result.playcount;
							//player.pause();
							if ("FPer" == result.msg && play_count > 0) {
								player.play();
							} else if ("FNoPlayCount" == result.msg) {
								//player.pause();
								//confirmBoxE("亲，您的播放次数已用完");
								return;
							} else if ("FNoPermission" == result.msg) {
								//player.pause();
								//confirmBoxE("未开通该课程");
								return;
							} else {
								window.location.reload();
							}
						},
						error: function() {
							confirmBoxE("服务器出错！");
							return;
						}
					});
				} else if (cookie_time != null && (Date.parse(new Date()) - cookie_time) / 60000 > 10 && play_count > 0) {
					//player.pause();
					cookie.set("time_" + tuid + "_" + stid + "_" + vid, Date.parse(new Date()));
					$.ajax({
						type: "post",
						async: false,
						url: "/video/playCountF",
						data: {
							"videoId": vid,
							"uid": stid,
							"tuid": tuid
						},
						success: function(result) {
							//player.pause();
							play_count = result.playcount;
							if ("FPer" == result.msg && play_count > 0) {
								player.play();
							} else if ("FNoPlayCount" == result.msg) {
								//player.pause();
								//confirmBoxE("亲，您的播放次数已用完");
								return;
							} else if ("FNoPermission" == result.msg) {
								//player.pause();
								//confirmBoxE("未开通该课程");
								return;
							} else {
								window.location.reload();
							}
						},
						error: function() {
							confirmBoxE("服务器出错！");
							return;
						}
					});
				} else if (cookie_time != null && (Date.parse(new Date()) - cookie_time) / 60000 <= 10 && play_count > 0) {
					player.play();
					return false;
				} else {
					cookie.set("time_" + tuid + "_" + stid + "_" + vid, Date.parse(new Date()));
					$.ajax({
						type: "post",
						async: false,
						url: "/video/playCountF",
						data: {
							"videoId": vid,
							"uid": stid,
							"tuid": tuid
						},
						success: function(result) {
							//player.pause();
							play_count = result.playcount;
							if ("FPer" == result.msg && play_count > 0) {
								player.play();
							} else if ("FNoPlayCount" == result.msg) {
								//player.pause();
								//confirmBoxE("亲，您的播放次数已用完");
								return;
							} else if ("FNoPermission" == result.msg) {
								//player.pause();
								//confirmBoxE("未开通该课程");
								return;
							} else {
								window.location.reload();
							}
						},
						error: function() {
							confirmBoxE("服务器出错！");
							return;
						}
					});
				}
				flag = setInterval(shuiyin, 6000);
				player.on("ended", function() {
					clearInterval(flag);
				});
			} else {
				player.on('ended', function(e) {
					confirmBoxE("试听结束");
				});
			}
		}
	})
    // Your code here...
})();