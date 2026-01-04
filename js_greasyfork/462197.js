// ==UserScript==
// @name         学达云教育-建造师继续教育-自动上课
// @namespace    https://github.com/zhangminghao1989/ok99ok99.com
// @version      1.9.1
// @description  自动提交和播放下一节
// @license      GNU GPLv3
// @match        https://*.ok99ok99.com/*
// @exclude      https://*.ok99ok99.com/stu/exam_v2_new.aspx*
// @require      https://code.jquery.com/jquery-1.11.3.min.js


// @downloadURL https://update.greasyfork.org/scripts/462197/%E5%AD%A6%E8%BE%BE%E4%BA%91%E6%95%99%E8%82%B2-%E5%BB%BA%E9%80%A0%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E8%87%AA%E5%8A%A8%E4%B8%8A%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/462197/%E5%AD%A6%E8%BE%BE%E4%BA%91%E6%95%99%E8%82%B2-%E5%BB%BA%E9%80%A0%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E8%87%AA%E5%8A%A8%E4%B8%8A%E8%AF%BE.meta.js
// ==/UserScript==
console.log("学达云教育-建造师继续教育-自动上课开始运行！");
(function () {
	'use strict';
	setTimeout(function(){
		var info = 0;
		var alert_count = 0;
		var myval = setInterval(function () {
			if(!/p[0-9]+\.ok99ok99\.com/.test(window.location.host)){
				if($("#divwxck > div").length == 0 && $("#divwxck").length == 1){
					if (alert_count == 0) {
						alert_count = 1;
						alert("请进行微信验证，验证完成后手动刷新页面！");
						console.log("请进行微信验证，验证完成后手动刷新页面！");
					} else {
						console.log("请进行微信验证，验证完成后手动刷新页面！");
					}
				} else {
					if($("#divwxck").length == 1){
						if(info == 0){
							$("p:contains('学习时间大于计划时间才能提交')").after("<b>手动播放视频后开始自动上课！</b>");
							info = 1;
						}
						else if($("#divPopupCamera").css("display") != "none"){
							$("#btnPopupCamera").click()
						}
						else if($(".submit_btn").attr("disabled") != "disabled"){
							$(".submit_btn").click();
						}
						else if($(".layui-layer-btn0").length == 1){
							submitStudy(2);
						}
						else if($("span i.ico_shipin2.color_blue").length == 0){
							$(".ico_shipin2:first").click();
						}
					} else {
						clearInterval(myval);
					}
				}
			}
		},5000)
	},10000)
})();
