// ==UserScript==
// @name         奥鹏教育视频刷课-静音-自动下一课
// @namespace    https://greasyfork.org/zh-CN/users/41249-tantiancai
// @version      0.9.3
// @description  奥鹏教育视频
// @author       tantiancai
// @match        *://learn.open.com.cn/StudentCenter/CourseWare/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425088/%E5%A5%A5%E9%B9%8F%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E5%88%B7%E8%AF%BE-%E9%9D%99%E9%9F%B3-%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/425088/%E5%A5%A5%E9%B9%8F%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E5%88%B7%E8%AF%BE-%E9%9D%99%E9%9F%B3-%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
	'use strict';

    var windowType = '';

    function checkWindowType(){
        var qrcode = document.getElementsByClassName("qrcodebox");
        if (qrcode.length > 0){
            windowType = 'Video';
        }

        var pageInfo = document.getElementById("pageInfo");
        if(pageInfo){
            windowType = 'Video';
        }

        var currentItem = document.getElementsByClassName("curSelectedNode");
        if (currentItem.length > 0){
            windowType = 'Main';
        }
    }

	setInterval(function () {
        if(windowType != 'Video'){
            return;
        }

		var videos = document.getElementsByTagName("video");
		var qrcode = document.getElementsByClassName("qrcodebox");
        var docMain = window.parent.document;

		// 没有视频，或者视频播放结束后，模拟点击“下一课”
		if (!IsVideo(docMain)
			|| (qrcode.length > 0 && qrcode[0].style.display == "block")) {
			var next_video = docMain.getElementsByClassName("progress_btn half_play")
			if (next_video.length > 0) {
				next_video[0].previousSibling.click()
			}
			else {
				next_video = docMain.getElementsByClassName("progress_btn not_play")
				if (next_video.length > 0) {
					next_video[0].previousSibling.click()
				}
				else {
					// 结束
				}
			}
		}
		else {
			for (var i = 0; i < videos.length; i++) {
				var current_video = videos[i]

				// 静音
				current_video.volume = 0
				// 2倍速
				// current_video.playbackRate = 2.0
				if (current_video.paused) {
					current_video.play()
				}
			}
		}
	}, 2000)

	function hasClass(element, cls) {
		return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
	}

	function IsVideo(doc) {
		var ret = false;
		var a = doc.getElementsByClassName("curSelectedNode");
		if (a.length > 0) {
			var status = a[0].nextSibling;
			ret = hasClass(status, "progress_btn") && !hasClass(status, "all_play");
		}
		return ret;
	}

    checkWindowType();
})();