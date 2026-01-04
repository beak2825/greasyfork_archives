// ==UserScript==
// @name         视频网站合集
// @namespace    https://v.qq.com/
// @version      1.0.3
// @description  快捷打开优酷，腾讯，爱奇艺，芒果，乐视等常用视频网站
// @author       lqf
// @include      *://m.youku.com/v*
// @include      *://m.youku.com/a*
// @include      *://v.youku.com/v_*
// @include      *://*.iqiyi.com/v_*
// @include      *://*.iqiyi.com/w_*
// @include      *://*.iqiyi.com/a_*
// @include      *://*.iqiyi.com/adv*
// @include      *://*.le.com/ptv/vplay/*
// @include      *v.qq.com/x/cover/*
// @include      *v.qq.com/x/page/*
// @include      *v.qq.com/play*
// @include      *v.qq.com/cover*
// @include      *://*.tudou.com/listplay/*
// @include      *://*.tudou.com/albumplay/*
// @include      *://*.tudou.com/programs/view/*
// @include      *://*.tudou.com/v*
// @include      *://*.mgtv.com/b/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcss.com/sweetalert/2.1.2/sweetalert.min.js
// @license      GPL License
// @grant        GM_setClipboard
// @run-at       document-end
// @connect      shangxueba365.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/393993/%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E5%90%88%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/393993/%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E5%90%88%E9%9B%86.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var currentUrl = window.location.href;
    var reYk = /youku/i;
    var reAqy = /iqiyi/i;
    var reLS = /le.com/i;
    var reTX = /v.qq/i;
    var reMG = /mgtv/i;
    var reSite = /tv.wandhi.com/i;
    var t = $.now();
    if (reAqy.test(currentUrl) || reLS.test(currentUrl) || reTX.test(currentUrl) || reMG.test(currentUrl) || reYk.test(currentUrl)) {
        var menus = [{
            title: '视频解析',
            show: '视频<br>解析',
            type: 'process'
        },
        {
            title: '优酷视频',
            show: '优酷<br>视频',
            type: 'youku'
        },
        {
            title: '爱奇艺视频',
            show: '爱奇艺<br>视频',
            type: 'iqiyi'
        },
        {
            title: '芒果视频',
            show: '芒果<br>视频',
            type: 'mgtv'
        },
        {
            title: '乐视视频',
            show: '乐视<br>视频',
            type: 'le'
        }];
        var f = function() {
            $('body').on('click', '[data-cat=process]',
            function() {
                window.open('http://tv.wandhi.com/go.html?url=' + encodeURIComponent(window.location.href));
            });
            $('body').on('click', '[data-cat=youku]',
            function() {
                window.open('https://www.youku.com/');
            });
            $('body').on('click', '[data-cat=iqiyi]',
            function() {
                window.open('https://www.iqiyi.com/');
            });
            $('body').on('click', '[data-cat=le]',
            function() {
                window.open('http://www.le.com/');
            });
            $('body').on('click', '[data-cat=mgtv]',
            function() {
                window.open('https://www.mgtv.com/');
            });
        };
        InitMenu(menus, f);
    }

    function InitMenu(obj, init) {
        if (reSite.test(top.window.location.href) || $("#aside-nav").length > 0) {
            return;
        }
        var menusclass = ['first', 'second', 'third', 'fourth', 'fifth'];
        var str = "";
        $.each(obj,
        function(i, o) {
            str += '<a href="javascript:void(0)" title="' + o.title + '" data-cat="' + o.type + '" class="menu-item menu-line menu-' + menusclass[i] + '">' + o.show + '</a>';
        });
        var sidenav = '<svg width="0" height="0"><defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo"></feColorMatrix><feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite></filter></defs></svg><div class="aside-nav bounceInUp animated" style="left:-90px;" id="aside-nav"><label for="" class="aside-menu" title="\u6309\u4F4F\u62D6\u52A8">视频</label>' + str + '</div>';
        $("head").append($('<link rel="stylesheet" href="//cdn.wandhi.com/style/tv/asidenav.css">'));
        $("body").append(sidenav).append($('<link rel="stylesheet" href="//cdn.wandhi.com/style/tv/asidenav.css">')).append($('<link rel="stylesheet" href="https://lib.baomitu.com/layer/3.1.1/theme/default/layer.css">'));
        var ua = navigator.userAgent;
        /Safari|iPhone/i.test(ua) && 0 == /chrome/i.test(ua) && $("#aside-nav").addClass("no-filter");
        var drags = {
            down: !1,
            x: 0,
            y: 0,
            winWid: 0,
            winHei: 0,
            clientX: 0,
            clientY: 0
        },
        asideNav = $("#aside-nav")[0],
        getCss = function(a, e) {
            return a.currentStyle ? a.currentStyle[e] : document.defaultView.getComputedStyle(a, !1)[e]
        };
        $("body").on("mousedown", "#aside-nav",
        function(a) {
            drags.down = !0,
            drags.clientX = a.clientX,
            drags.clientY = a.clientY,
            drags.x = getCss(this, "left"),
            drags.y = getCss(this, "top"),
            drags.winHei = $(window).height(),
            drags.winWid = $(window).width(),
            $(document).on("mousemove",
            function(a) {
                var e = a.clientX - drags.clientX,
                t = a.clientY - drags.clientY;
                asideNav.style.top = parseInt(drags.y) + t + "px";
                asideNav.style.left = parseInt(drags.x) + e + "px";
            })
        }).on("mouseup", "#aside-nav",
        function() {
            drags.down = !1,
            $(document).off("mousemove")
        });
        init();
    }
})();