// ==UserScript==
// @name         广东省干部培训网络学院刷课
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  如果遇到死循环打开时候后把进度条往前拉就行，没做倍速播放的功能，选课要自己选，选完才能刷，不保证所有课程都能刷，有些视频播放页面不一样，我只做了遇到过的三种播放页面，不排除有第四种，有问题可以反馈，虽然我不一定会看
// @author       Nyeming
// @license      MIT
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       window.close
// @include    https://gbpx.gd.gov.cn/*
// @include    https://wcs1.shawcoder.xyz/*
// @include    https://cs1.gdgbpx.com/*




// @downloadURL https://update.greasyfork.org/scripts/547196/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%B9%B2%E9%83%A8%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/547196/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%B9%B2%E9%83%A8%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
(function() {
GM_setValue("bofangwan", false)
var href = window.location.href
if (href.indexOf("gbpx.gd.gov.cn/gdceportal/Study/LearningCourse.aspx") != -1) {
	var alla = document.querySelectorAll("a.courseware-list-reed")
	if (alla.length > 0) {
		document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin",
			"<div id='buxiangdiv' style='position: absolute;background-color: azure;border: 2px solid #555555;font-size: 16px;text-align: center;'><div>不想自动弹出刷课视频请在三秒内点击下方按钮</div><button  onclick='document.title=605;'; style='background-color: aliceblue;color: black;font-size: 16px;padding: 10px 24px;margin: 4px 2px;border-radius: 12px;border: 2px solid #f44336;'>按钮</button></div>"
		)
		setTimeout(function() {
			if (document.title != 605) {
				document.getElementById("buxiangdiv").innerText = "已自动打开视频，如果手动关闭视频可刷新此页恢复自动"
				alla[0].click()
			} else {
				document.getElementById("buxiangdiv").innerText = "已经停止自动打开视频，刷新后重置"
			}
		}, 3000)
	}
} else if (href == "https://wcs1.shawcoder.xyz/gdcecw/play_pc/playmp4_pc.html") {
	document.getElementsByTagName("button")[2].click()
	document.getElementsByTagName("button")[1].click()
	setInterval(function() {
		if (document.getElementsByClassName("vjs-play-progress vjs-slider-bar")[0].style.width == "100%") {
			GM_setValue("bofangwan", true)
		} else {
			if (document.getElementsByTagName("button")[1].title != "暂停") {
				document.getElementsByTagName("button")[1].click()
			}
		}
	}, 3000);
} else if (href.indexOf("wcs1.shawcoder.xyz/gdcecw/CourseWare") != -1 && href.endsWith("index.htm")) {
	if (document.getElementsByTagName("a")[0].innerText != "退出") {
		document.getElementsByTagName("a")[0].click()
	} else {
		setInterval(function() {
			var video3 = document.getElementsByTagName("video")[0]
			video3.volume = 0
			if (video3.currentTime != video3.duration) {
				video3.play()
			}else{
				GM_setValue("bofangwan", true)
			}
		}, 2000);
	}
} else if (href.indexOf("wcs1.shawcoder.xyz/gdcecw/CourseWare") != -1 && href.endsWith("play.htm")) {
	var jingyin = setInterval(function() {
		let jingyinarr = document.getElementsByTagName("video")
		if (jingyinarr.length > 0) {
			jingyinarr[0].volume = 0
		}
	}, 50);
	setInterval(function() {
		let videoarr = document.getElementsByTagName("video")
		if (videoarr.length > 0) {
			let video = videoarr[0]
			if (video.volume == 0) {
				clearInterval(jingyin)
			}
			if (video.currentTime != video.duration) {
				video.play()
			} else {
				GM_setValue("bofangwan", true)
			}
		}
		let blockUI = document.getElementsByClassName("blockUI")
		if (blockUI.length > 0) {
			for (var i = 0; i < blockUI.length; i++) {
				blockUI[i].style.display = "none"
			}
		}
	}, 3000);
} else if (href == "https://wcs1.shawcoder.xyz/gdcecw/play_pc/playdo_pc.html") {
	setInterval(function() {
		if (GM_getValue("bofangwan")) {
			document.querySelectorAll("button.instructions-close")[0].click()
		}
	}, 2000);
} else if (href == "https://gbpx.gd.gov.cn/gdceportal/study/StudyCenter.aspx") {
	setInterval(function() {
		if (GM_getValue("bofangwan")) {
			setTimeout(function() {
				window.location.reload();
			}, 3000)
		}
	}, 3000);
}
})();