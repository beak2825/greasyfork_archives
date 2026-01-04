// ==UserScript==
// @name         jb51脚本之家去广告
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  脚本之家去广告
// @author       Sheller
// @match        *://jb51.net
// @match        *://jb51.net/*
// @match        *://www.jb51.net
// @match        *://www.jb51.net/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400568/jb51%E8%84%9A%E6%9C%AC%E4%B9%8B%E5%AE%B6%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/400568/jb51%E8%84%9A%E6%9C%AC%E4%B9%8B%E5%AE%B6%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //阅读全文
    $('#btn-readmore').click();
    // 获取当前地址url
    var url = location.href;
    // 正则匹配博客部分
    var jb51 = /jb51.net/;
    $(".ad").remove();
    if (jb51.test(url)) {
        // logo右侧的两个广告
        $(".logom.fl").remove();
        $(".logor.fr").remove();
        // 清除所有class属性值为clearfix的标签（会清除其他菜单内容）
        // $(".clearfix").remove();
        $("#slider").remove();
        // 菜单栏下面的广告
        $(".tonglan").remove();
        $(".pt10.clearfix").remove();
        $(".main.clearfix").remove();
        $(".mtb10.clearfix").remove();
        // 首页分菜单之间的广告
        $(".mainlr").remove();
        $(".dxy776").remove();
        $(".dxy370").remove();
        $(".topimg").remove();
        $(".dxy1200.clearfix").remove();
        // 搜索输入框下面的广告
        $(".da").remove();
        $(".r300.clearfix").remove();
        $(".sidebox-recomm").remove();
        var sidebar = $("#sidebar").children();
        var sidebar1 = sidebar.eq(0);
        var sidebar2 = sidebar.eq(2);
        var sidebar3 = sidebar.eq(5);
        sidebar1.remove();
        sidebar2.remove();
        sidebar3.remove();
        // $(".mt10").remove();
        // 最近更新列表下面的广告
        $(".side-box.mtb10").remove();
        // 软件下载页面的下载按钮下面的广告
        $(".softsfwtl").remove();
        // 文章页面的“大家感兴趣的内容”和“常用在线小工具”下面的广告和右下侧浮动广告
        $(".r300.clearfix.mt10").remove();
        $("#con_all").remove();
        // 右侧栏最下面的广告
        $(".mt10.rFixedBox").remove();
        // 软件下载地址右侧的广告
        $(".da-download").remove();
        // 软件下载的“相关文章下面的广告”
        $("#down4").remove();
        $("#content > div.clearfix").remove();
        // 文章页面 “你可能感兴趣的文章”下面的广告
        $(".lbd_bot.clearfix").remove();
        // 文章页面 “原文链接”下面的广告
        $("#ewm").remove();
        $(".cupage").next().remove();
        // 文章页面 tag标签下面的广告和“相关文章”里面的广告
        $(".lbd.clearfix").remove();
        // 编程语言界面广告
        $(".mtb10.lists-main").next().remove();
        $(".rFixedBox").remove();
    }
})();