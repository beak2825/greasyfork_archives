// ==UserScript==
// @name         智慧树挂机脚本
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  2020-05-14更新：适用于录播课，设置静音和1.5倍速，自动跳过已经看过的视频，随机答题并自动关闭弹题窗口
// @author       jungtravor
// @match        *://*.zhihuishu.com/videoStudy.html*
// @icon         http://assets.zhihuishu.com/icon/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398210/%E6%99%BA%E6%85%A7%E6%A0%91%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/398210/%E6%99%BA%E6%85%A7%E6%A0%91%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
	'use strict';
	const $ = window.jQuery;
	var zhs_halt = false;

	function keeping() {
		if ( zhs_halt ) return;

		// 读取视频时长计算标识
		var video_finished = $(".current_play b").hasClass("time_icofinish");

		// 暂停后自动播放
		if ( $("video")[0].paused && !video_finished ) {
			$("#playButton").click();
		}

		// 自动切换下一个视频
		if ( video_finished ) {
			// 点击 next 按钮
			// $("#nextBtn").click();
			// 由于智慧树网页设计问题，在一定情况下点击 next 按钮后无法跳转到视频页面，故采用模拟点击方法
			var current_video = $(".video.current_play");
			var videos = $(".video");
			var click = false;
			$(".video").each(function(){
				if( click ){
					$(this).click();
					click = false;
				}
				if($(this).hasClass("current_play")) click = true;
			})
		}

		// 静音
		if ( $("video")[0].volume ) {
			$(".volumeIcon")[0].click();
		}

		// 自动切换到1.5倍
		if ( $("video")[0].playbackRate != 1.5 ) {
			$(".speedTab15")[0].click();
		}

		// 弹题自动选择第一个选项
		if ( $(".dialog-test").length ) {
			var test = $(".dialog-test");
			var test_option = test.find(".topic-item").length - 1;
			test_option = parseInt( Math.random() * test_option );
			test.find(".topic-item")[test_option].click();
			test.find(".dialog-footer").find(".btn")[0].click();
		}

	}

	$(window).ready(function(){
		setInterval(keeping, 1000);
	})

})();