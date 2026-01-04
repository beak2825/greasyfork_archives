// ==UserScript==
// @name 【秒过】2024年中小学智慧教育平台GD学习脚本
// @namespace    http://tampermonkey.net/
// @version      07.29.12
// @description  登录中小学
// @author       Happy
// @match        *://*/*
// @icon         https://pic.ntimg.cn/file/20200129/2860708_190811479085_2.jpg
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504651/%E3%80%90%E7%A7%92%E8%BF%87%E3%80%912024%E5%B9%B4%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0GD%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/504651/%E3%80%90%E7%A7%92%E8%BF%87%E3%80%912024%E5%B9%B4%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0GD%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==



function skip() {
    let video = document.getElementsByTagName('video')
	video[0].play();
	video[0].pause();
    video[0].currentTime = video[0].duration
	video[0].play();
}
setInterval(skip,100)