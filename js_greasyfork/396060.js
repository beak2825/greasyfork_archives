// ==UserScript==
// @name         【vip影视助手】免费在线观看VIP视频，支持爱奇艺，优酷，乐视tv，腾讯视频，土豆，芒果TV，搜狐视频，Acfun，PPTV，华数TV等主流影视平台
// @namespace    http://mmys.club/vip
// @version      0.6
// @description  只专注于一个功能，简洁干净，在视频播放页左侧点击VIP按钮，跳转到新页面即可免费在线观看vip视频
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
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396060/%E3%80%90vip%E5%BD%B1%E8%A7%86%E5%8A%A9%E6%89%8B%E3%80%91%E5%85%8D%E8%B4%B9%E5%9C%A8%E7%BA%BF%E8%A7%82%E7%9C%8BVIP%E8%A7%86%E9%A2%91%EF%BC%8C%E6%94%AF%E6%8C%81%E7%88%B1%E5%A5%87%E8%89%BA%EF%BC%8C%E4%BC%98%E9%85%B7%EF%BC%8C%E4%B9%90%E8%A7%86tv%EF%BC%8C%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%EF%BC%8C%E5%9C%9F%E8%B1%86%EF%BC%8C%E8%8A%92%E6%9E%9CTV%EF%BC%8C%E6%90%9C%E7%8B%90%E8%A7%86%E9%A2%91%EF%BC%8CAcfun%EF%BC%8CPPTV%EF%BC%8C%E5%8D%8E%E6%95%B0TV%E7%AD%89%E4%B8%BB%E6%B5%81%E5%BD%B1%E8%A7%86%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/396060/%E3%80%90vip%E5%BD%B1%E8%A7%86%E5%8A%A9%E6%89%8B%E3%80%91%E5%85%8D%E8%B4%B9%E5%9C%A8%E7%BA%BF%E8%A7%82%E7%9C%8BVIP%E8%A7%86%E9%A2%91%EF%BC%8C%E6%94%AF%E6%8C%81%E7%88%B1%E5%A5%87%E8%89%BA%EF%BC%8C%E4%BC%98%E9%85%B7%EF%BC%8C%E4%B9%90%E8%A7%86tv%EF%BC%8C%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%EF%BC%8C%E5%9C%9F%E8%B1%86%EF%BC%8C%E8%8A%92%E6%9E%9CTV%EF%BC%8C%E6%90%9C%E7%8B%90%E8%A7%86%E9%A2%91%EF%BC%8CAcfun%EF%BC%8CPPTV%EF%BC%8C%E5%8D%8E%E6%95%B0TV%E7%AD%89%E4%B8%BB%E6%B5%81%E5%BD%B1%E8%A7%86%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var vipBtn = "<div id='vipBtn' style='cursor:pointer;z-index:99998;position:fixed;left:10px;top:300px;'><img src='https://mmys.club/vip-button.jpg' height='55' ></div>";
    $("body").append(vipBtn);
    $('#vipBtn').click(function() {
        window.location.href = "http://mmys.club/vip?" + encodeURIComponent(window.location.href);
    });
})();