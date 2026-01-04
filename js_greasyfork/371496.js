// ==UserScript==
// @name         vip视频解析
// @namespace    http://tampermonkey.net/
// @version      6.1.2
// @description  支持优酷，爱奇艺，腾讯，搜狐，乐视，pptv，芒果tv，1905，等（视频播放页面有10秒钟广告）
// @author       鑫鑫呀
// @match        *://v.youku.com/*
// @match        *://*.iqiyi.com/v*
// @match        *://v.qq.com/x/cover*
// @match        *://film.sohu.com/album/*
// @match        *://tv.sohu.com/v/*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://*.pptv.com/show/*
// @match        *://*.mgtv.com/b/*
// @match        *://vip.1905.com/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371496/vip%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/371496/vip%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ok = confirm('请点击确定或按下回车，即可无广告免费播放VIP和收费视频哦！\n若无法观看请点取消，祝您观影愉快')
    if (ok) {
        window.location.href = "https://www.yemu.xyz/?url=" + window.location.href
    }
})();