// ==UserScript==
// @name    leon自用视频播放脚本
// @namespace http://gongju.dadiyouhui03.cn/app/tool/youhou/index.html
// @author leon
// @version          10
// @description    leon自用视频播放脚本,可用于IPAD  
// @author       simples
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/w_*
// @match        *://*.iqiyi.com/a_*
// @match        *://v.youku.com/v_*
// @match        *://m.youku.com/v*
// @match        *://m.youku.com/a*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://v.qq.com/x/cover/*
// @match        *://v.qq.com/x/page/*
// @match        *://v.qq.com/play*
// @match        *://v.qq.com/cover*
// @match        *://v.qq.com/tv/*
// @match        *://*.tudou.com/listplay/*
// @match        *://*.tudou.com/albumplay/*
// @match        *://*.tudou.com/programs/view/*
// @match        *://*.tudou.com/v*
// @match        *://*.mgtv.com/b/*
// @match        *://film.sohu.com/album/*
// @match        *://tv.sohu.com/v/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.pptv.com/show/*
// @match        *://*.wasu.cn/Play/show*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503823/leon%E8%87%AA%E7%94%A8%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/503823/leon%E8%87%AA%E7%94%A8%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var vipBtn = "<div id='vipBtn' style='cursor:pointer;z-index:99998;position:fixed;left:10px;top:300px;'><img src='https://mmys.club/vip-button.jpg' height='99' ></div>";
    $("body").append(vipBtn);
    $('#vipBtn').click(function() {
        window.location.href = "https://jx.xmflv.com/?url=" + encodeURIComponent(window.location.href);
    });
})();