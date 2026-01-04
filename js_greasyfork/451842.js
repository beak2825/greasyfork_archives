// ==UserScript==
// @name         VIP会员视频解析
// @namespace    http://QQ.COM
// @version      0.232
// @description  解析并自动跳转各大视频网站会员视频(傻瓜版)
// @author       tro
// @match       v.qq.com/x/cover/*
// @match       *.mgtv.com/b/*
// @match       *.le.com/ptv/vplay/*
// @include       v.youku.com/v_show/*
// @include       *.iqiyi.com/v_*
// @include       *.tudou.com/albumplay/*
// @include       *.wasu.cn/Play/show/id/*
// @include       tv.sohu.com/20*
// @include       film.sohu.com/album/*
// @include       ddp.vip.pptv.com/vod_detail/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451842/VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/451842/VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var JK="http://55o.co?url="        ;                         
window.location.href=JK+window.location.href;
    // Your code here...
})();