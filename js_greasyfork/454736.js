// ==UserScript==
// @name         深圳市继续教育自动刷课
// @namespace    www.2284550203@qq.com
// @version      0.1
// @description  深圳市继续教育视频自动跳转
// @author       Wang-1024
// @match        *://jx.mboxc.com/hadmin/html/studyCentre/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454736/%E6%B7%B1%E5%9C%B3%E5%B8%82%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/454736/%E6%B7%B1%E5%9C%B3%E5%B8%82%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';
var video = document.getElementById("main_video_html5_api");/*视频加载注册*/
var DangQian = document.querySelector('video');/*当前视频元素*/
var All = document.querySelectorAll(".list-group-item");/*获取视频标签集合*/
/*获取本章视频个数有几位*/
var i = All.length;
var l = 0;
while (i >= 1) {
	i = i / 10;
	l++;
}

var intDangQian = parseInt(DangQian.getAttribute("data-id").substr(l * -1, l));/*当前视频ID*/
console.log(intDangQian.toString());

/*视频加载事件*/
video.addEventListener('loadedmetadata', function () {
	document.querySelector(".vjs-big-play-button").click();
});

/*video视频播放完成的事件*/
var aud = document.getElementById("main_video_html5_api");
aud.onended = function () {
	All[intDangQian].click();
};
})();