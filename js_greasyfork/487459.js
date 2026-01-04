// ==UserScript==
// @name         （代码被抄，被大范围使用已经和谐）2024年秒过中小学智慧教育平台教师暑假研修学习脚本
// @namespace    http://tampermonkey.net/
// @version      2027
// @description  中小学智慧云平台教师暑假研修学习脚本（7.28可用但需要重复多点不稳定）
// @author       Happy
// @match        *://*/*
// @icon         https://pic.ntimg.cn/file/20200129/2860708_190811479085_2.jpg
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487459/%EF%BC%88%E4%BB%A3%E7%A0%81%E8%A2%AB%E6%8A%84%EF%BC%8C%E8%A2%AB%E5%A4%A7%E8%8C%83%E5%9B%B4%E4%BD%BF%E7%94%A8%E5%B7%B2%E7%BB%8F%E5%92%8C%E8%B0%90%EF%BC%892024%E5%B9%B4%E7%A7%92%E8%BF%87%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E6%95%99%E5%B8%88%E6%9A%91%E5%81%87%E7%A0%94%E4%BF%AE%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/487459/%EF%BC%88%E4%BB%A3%E7%A0%81%E8%A2%AB%E6%8A%84%EF%BC%8C%E8%A2%AB%E5%A4%A7%E8%8C%83%E5%9B%B4%E4%BD%BF%E7%94%A8%E5%B7%B2%E7%BB%8F%E5%92%8C%E8%B0%90%EF%BC%892024%E5%B9%B4%E7%A7%92%E8%BF%87%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E6%95%99%E5%B8%88%E6%9A%91%E5%81%87%E7%A0%94%E4%BF%AE%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==



function skip() {
    let video = document.getElementsByTagName('video')
	video[0].play();
	video[0].pause();
    video[0].currentTime = video[0].duration
	video[0].play();
}
setInterval(skip,100)