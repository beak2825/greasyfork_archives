// ==UserScript==
// @name         哔哩哔哩注册时间查询助手
// @namespace    undefined
// @version      0.1.0
// @description  查询B站账号注册时间。
// @author       点灯 diandeng
// @match        *://space.bilibili.com/*
// @require      http://code.jquery.com/jquery-3.2.1.js
// @icon 		 https://www.bilibili.com/favicon.ico
// @supportURL   https://space.bilibili.com/21219957
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/382542/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%B3%A8%E5%86%8C%E6%97%B6%E9%97%B4%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/382542/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%B3%A8%E5%86%8C%E6%97%B6%E9%97%B4%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
	'use strict';
	//初始化
	$(function() {
		pageInit();
	});

	function pageInit() {
		setTimeout(function() {
			if ($(".user .info .meta .row").length > 0) {
				$("head").append(
					'<style type="text/css">.user .info .meta .row {height: 88px;white-space: normal;}.user .info .jointime .icon {background-position: -209px -84px;}.user .info .help .icon {background-position: -209px -790px;;}.user .info .jointime .text a {padding: 0 5px;color: #00a1d6;}.user .info .help .text a {padding: 0 5px;color: #00a1d6;}</style>'
				);
				$(".user .info .meta .row").append(
					'<div class="item jointime"><span class="icon"></span><span class="text">正在查询...</span></div>'
				);
				getJointime()
			} else {
				pageInit();
			}
		}, 1000);
	}
	
	function getJointime() {
		$.ajax({
			url: "//api.bilibili.com/x/space/myinfo",
			type: "GET",
			xhrFields: {
				withCredentials: true
			},
			dataType: "json",
			success: function(data) {
				if (data == null) {
					$(".user .info .jointime .text").text("查询失败")
				} else {
					switch (data.code) {
						case -101:
							$(".user .info .jointime .text").text("请先")
							$(".user .info .jointime .text").append('<a href="//passport.bilibili.com/login">登录</a>');
							return;
						case 0:
							var time = new Date(data.data.jointime * 1000);
							var year = time.getFullYear();
							var month = time.getMonth() + 1;
							var date = time.getDate();
							var hours = time.getHours().toString().padStart(2, '0');
							var minutes = time.getMinutes().toString().padStart(2, '0');
							var seconds = time.getSeconds().toString().padStart(2, '0');
							$(".user .info .jointime .text").text(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" +
								seconds)
							$(".user .info .meta .row").append(
								'<div class="item help"><span class="icon"></span><span class="text"><a href="//jq.qq.com/?_wv=1027&k=5VHA1qb">帮助更多人</a></span></div>'
							);
							return;
					}
				}
			},
			error: function() {
				$(".user .info .jointime .text").text("网络错误")
			}
		});
	}
})();
