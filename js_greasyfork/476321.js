// ==UserScript==
// @name         惜命
// @author       公子有语
// @description  在BiliBili，每次都会把我设置的1080P自动切换成720P，鲁迅说过：“时间就是生命，无端的空耗别人的时间，其实无异于谋财害命的。” \n 所以保留切换的几秒时间，一天可保留生命哦。
// @version      1.01
// @grant        none
// @icon         https://api.iconify.design/carbon:notebook-reference.svg
// @match        https://www.bilibili.com/video/*
// @license      Mozilla
// @namespace https://greasyfork.org/users/1183543
// @downloadURL https://update.greasyfork.org/scripts/476321/%E6%83%9C%E5%91%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/476321/%E6%83%9C%E5%91%BD.meta.js
// ==/UserScript==

window.onload = function() {
    var video = document.querySelector('video');
    video.src = video.src.replace(/(\d{3,4}p)/, '1080p$1');
    video.play();
}