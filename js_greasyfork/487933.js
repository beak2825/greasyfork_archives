// ==UserScript==
// @name         四川内蒙古公务员1.4倍慢加速
// @license      zengyi136
// @include      http://web.chinahrt.com
// @include      https://web.chinahrt.com
// @version      1.13
// @description  快速代学+VX：zengyi136
// @author       yikuaibaiban(https://github.com/yikuaibaiban)
// @match        https://www.lszjxjy.com/home/User/study/*
// @match        http://videoadmin.chinahrt.com.cn/videoPlay/play*
// @match        http://videoadmin.chinahrt.com/videoPlay/play*
// @match        https://videoadmin.chinahrt.com.cn/videoPlay/play*
// @match        https://videoadmin.chinahrt.com/videoPlay/play*
// @grant        none
// @namespace https://github.com/yikuaibaiban/chinahrt
// @downloadURL https://update.greasyfork.org/scripts/487933/%E5%9B%9B%E5%B7%9D%E5%86%85%E8%92%99%E5%8F%A4%E5%85%AC%E5%8A%A1%E5%91%9814%E5%80%8D%E6%85%A2%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/487933/%E5%9B%9B%E5%B7%9D%E5%86%85%E8%92%99%E5%8F%A4%E5%85%AC%E5%8A%A1%E5%91%9814%E5%80%8D%E6%85%A2%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==
$(document).ready(function () {
    // (function () {
    // 'use strict';
    window.onfocus = function () { console.log('原始事件已被替换') };
    window.onblur = function () { console.log('原始事件已被替换') };
    var tmp = setInterval(function () {
        if (player) {
            player.addListener('loadedmetadata', function () {
                document.querySelector("video").playbackRate = 1.4;
                player.videoMute();
                clearInterval(tmp);
            });
        }
    }, 500);
});