// ==UserScript==
// @name         教师研修秒学脚本
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  视频秒学脚本
// @author       New Era Teacher
// @match        *://*.smartedu.cn/*
// @icon         https://img0.baidu.com/it/u=2897227376,4164167746&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489806/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%A7%92%E5%AD%A6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/489806/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%A7%92%E5%AD%A6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


function skip() {
    let video = document.getElementsByTagName('video')
	video[0].play();
	video[0].pause();
    video[0].currentTime = video[0].duration
	video[0].play();
}
setInterval(skip,1000)