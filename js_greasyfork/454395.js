// ==UserScript==
// @name         西南SY 国资E学
// @namespace    **************
// @version      0.5
// @description  视频加速16倍，切换界面不影响播放，不能自动播放下一个视频，一个视频放完要手动播放下一个。
// @author       luter
// @match        *://*.tcsasac.com/*
// @require https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @license      MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/454395/%E8%A5%BF%E5%8D%97SY%20%E5%9B%BD%E8%B5%84E%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/454395/%E8%A5%BF%E5%8D%97SY%20%E5%9B%BD%E8%B5%84E%E5%AD%A6.meta.js
// ==/UserScript==
window.onload=function(){
setTimeout(function () {		var elevideo = document.getElementById("course-video_html5_api");
                        elevideo.playbackRate=16;
		elevideo.addEventListener('pause', function () {
           elevideo.play();
        });}, 10000)
}
