// ==UserScript==
// @name         just for you
// @version      1.0.0
// @homepage     https://greasyfork.org/zh-CN/scripts/375643-just-for-you
// @match        *://ibaotu.com/*
// @match        *://www.58pic.com/*
// @match        *://699pic.com/*
// @match        *://588ku.com/*
// @match        *://90sheji.com/*
// @match        *://www.51yuansu.com/*
// @description  just for you to download design
// @grant        unsafeWindow
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @icon         http://music.sonimei.cn/favicon.ico
// @run-at       document-end
// @namespace
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/375643/just%20for%20you.user.js
// @updateURL https://update.greasyfork.org/scripts/375643/just%20for%20you.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var curPlaySite = '';
    var curWords = '';
    var imgSite = window.location.href;
    var reBaotu = /ibaotu(.*)/i;
    var reQiantu = /www.58pic(.*)/i;
    var reShetu = /699pic(.*)/i;
    var reQianku = /588ku(.*)/i;
    var re90Sheji = /90sheji(.*)/i;
    var reMiyuansu = /www.51yuansu(.*)/i;
    var Title = '';

    var vipBtn = '<div target="_blank" id="VipMusicBtn" style="margin:10px 0;display:inline-block;padding:0 5px;height:22px;border:1px solid red;color:red;vertical-align:bottom;text-decoration:none;font-size:17px;line-height:22px;cursor:pointer;">一键免费下载</div>';

    //包图网
    if (reBaotu.test(imgSite)) {
        Title = $('.detail-crumbs');
        Title.after(vipBtn);
    }

    //千图网
    if (reQiantu.test(imgSite)) {
        Title = $('.bread-crumbs');
        Title.after(vipBtn);
    }

    //摄图网
    if (reShetu.test(imgSite)) {
        Title = $('.photo-view');
        Title.after(vipBtn);
    }

    //千库网
    if (reQianku.test(imgSite)) {
        Title = $('.bread-nav');
        Title.after(vipBtn);
    }

    //90设计
    if (re90Sheji.test(imgSite)) {
        Title = $('.Snav');
        Title.after(vipBtn);
    }

    //觅元素
    if (reMiyuansu.test(imgSite)) {
        Title = $('.crumbs');
        Title.after(vipBtn);
    }

    $(function () {

        //执行下载按钮的单击事件并调用下载函数
        $("#VipMusicBtn").click(function () {
            if (imgSite) {
                var url = encodeURI(imgSite);
                window.open('http://app.baoyoot.com:9876/design?url=' + url);
            }
        });
    });

})();