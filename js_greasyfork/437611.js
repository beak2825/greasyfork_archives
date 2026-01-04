// ==UserScript==
// @name         通用VIP视频在线解析(纯净自用版本)
// @namespace    https://greasyfork.org/zh-CN/scripts/437611
// @version      1.0.6
// @description  优酷 爱奇艺 腾讯 芒果 AB站
// @author       极速软件定制(企鹅:1073481777)
// @license      MIT
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
// @include      *://film.sohu.com/album/*
// @include      *://tv.sohu.com/v/*
// @include      *://*.acfun.cn/v/*
// @include      *://*.bilibili.com/video/*
// @include      *://*.bilibili.com/anime/*
// @include      *://*.bilibili.com/bangumi/play/*
// @include      *://*.pptv.com/show/*
// @include      *://*.baofeng.com/play/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/layer/3.1.1/layer.min.js
// @grant        GM_setClipboard
// @run-at       document-end
// @grant        unsafeWindow


// @downloadURL https://update.greasyfork.org/scripts/437611/%E9%80%9A%E7%94%A8VIP%E8%A7%86%E9%A2%91%E5%9C%A8%E7%BA%BF%E8%A7%A3%E6%9E%90%28%E7%BA%AF%E5%87%80%E8%87%AA%E7%94%A8%E7%89%88%E6%9C%AC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/437611/%E9%80%9A%E7%94%A8VIP%E8%A7%86%E9%A2%91%E5%9C%A8%E7%BA%BF%E8%A7%A3%E6%9E%90%28%E7%BA%AF%E5%87%80%E8%87%AA%E7%94%A8%E7%89%88%E6%9C%AC%29.meta.js
// ==/UserScript==

(function () {
    //    'use strict';
    var currentUrl = window.location.href;
    var reYk = /youku/i;
    var reAqy = /iqiyi/i;
    var reLS = /le.com/i;
    var reTX = /v.qq/i;
    var reTD = /tudou/i;
    var reMG = /mgtv/i;
    var reSH = /sohu/i;
    var reAF = /acfun/i;
    var reBL = /bilibili/i;
    var reYJ = /1905/i;
    var rePP = /pptv/i;
    var restr = /www.1717yun.com/i;
    var t = $.now();
    if (!restr.test(currentUrl) && reAqy.test(currentUrl) || reLS.test(currentUrl) || reTX.test(currentUrl) || reTD.test(currentUrl) || reMG.test(currentUrl) || reSH.test(currentUrl) || rePP.test(currentUrl) || reYk.test(currentUrl)) {
        function PlayByURL(ClassName,URL){
            $('body').on('click', '[data-cat=' + ClassName + ']', function () {
                layer.open({
                    type: 2,
                    title:document.title,
                    maxmin: true,
                    anim: 1,
                    area: ['800px', '550px'],
                    content: URL+ encodeURIComponent(window.location.href)
                });
            });
        }
        var menus=[{title:'\u89c6\u9891\u89e3\u6790\u4e00',show:'\u89C6\u9891<br>\u89E3\u6790',type:'process1'},
                   { title: '\u89c6\u9891\u89e3\u6790\u4e8c', show: '\u89C6\u9891<br>\u89E3\u6790', type: 'process2' },
                   { title: '\u89c6\u9891\u89e3\u6790\u4e09', show: '\u89C6\u9891<br>\u89E3\u6790', type: 'process3' },
                   { title: '\u89c6\u9891\u89e3\u6790\u56db', show: '\u89C6\u9891<br>\u89E3\u6790', type: 'process4' },
                  ];
        InitMenu(menus,function(){
            PlayByURL('process1','https://jx.xmflv.com/?url=');
            PlayByURL('process2','https://im1907.top/?jx=');
            PlayByURL('process3','https://www.ckmov.com/?url=');
            PlayByURL('process4','https://yparse.ik9.cc/index.php?url=');
        });
    }

    function accpendCssContent(content) {
        var Style = document.createElement("style");
        Style.innerHTML = content;
        $("body").append(Style);
    };

    function InitMenu(obj,init){
        var menusclass=['first','second','third','fourth','fifth','sixth'];
        var str="";
        $.each(obj,function(i,o){
            str+='<a href="javascript:void(0)" title="'+o.title+'" data-cat="'+o.type+'" class="menu-item menu-line menu-'+menusclass[i]+'">'+o.show+'</a>';
        });
        var sidenav = '<svg width="0" height="0"><defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo"></feColorMatrix><feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite></filter></defs></svg><div class="aside-nav bounceInUp animated" id="aside-nav"><label for="" class="aside-menu" title="\u6309\u4F4F\u62D6\u52A8">VIP</label>'+str+'</div>';
        var css ="\n            html {\n                -ms-text-size-adjust: 100%;\n                -webkit-text-size-adjust: 100%;\n                -webkit-font-smoothing: antialiased;\n                font-size: 62.5%\n            }\n            body .aside-nav {\n                font-family: \"Helvetica Neue\", Helvetica, \"Microsoft YaHei\", Arial, sans-serif;\n                margin: 0;\n                font-size: 1.6rem;\n                /*background-color: #f9f9f9;*/\n                color: #4E546B\n            }\n            .aside-nav {\n                position: fixed;\n                /*right: -50px;*/\n                top: 350px;\n                width: 260px;\n                height: 260px;\n                -webkit-filter: url(#goo);\n                filter: url(#goo);\n                -ms-user-select: none;\n                -moz-user-select: none;\n                -webkit-user-select: none;\n                user-select: none;\n                opacity: .75;\n                z-index: 20180817;\n            }\n            .aside-nav.no-filter {\n                -webkit-filter: none;\n                filter: none\n            }\n            .aside-nav .aside-menu {\n                position: absolute;\n                width: 70px;\n                height: 70px;\n                -webkit-border-radius: 50%;\n                border-radius: 50%;\n                background: #f34444;\n                left: 0;\n                top: 0;\n                right: 0;\n                bottom: 0;\n                margin: auto;\n                text-align: center;\n                line-height: 70px;\n                color: #fff;\n                font-size: 20px;\n                z-index: 1;\n                cursor: move\n            }\n            .aside-nav .menu-item {\n                position: absolute;\n                width: 60px;\n                height: 60px;\n                background-color: #FF7676;\n                left: 0;\n                top: 0;\n                right: 0;\n                bottom: 0;\n                margin: auto;\n                line-height: 60px;\n                text-align: center;\n                -webkit-border-radius: 50%;\n                border-radius: 50%;\n                text-decoration: none;\n                color: #fff;\n                -webkit-transition: background .5s, -webkit-transform .6s;\n                transition: background .5s, -webkit-transform .6s;\n                -moz-transition: transform .6s, background .5s, -moz-transform .6s;\n                transition: transform .6s, background .5s;\n                transition: transform .6s, background .5s, -webkit-transform .6s, -moz-transform .6s;\n                font-size: 14px;\n                -webkit-box-sizing: border-box;\n                -moz-box-sizing: border-box;\n                box-sizing: border-box\n            }\n            .aside-nav .menu-item:hover {\n                background: #A9C734;\n            }\n            .aside-nav .menu-line {\n                line-height: 20px;\n                padding-top: 10px;\n            }\n            .aside-nav:hover {\n                opacity: 1;\n            }\n            .aside-nav:hover .aside-menu {\n                -webkit-animation: jello 1s;\n                -moz-animation: jello 1s;\n                animation: jello 1s\n            }\n            .aside-nav:hover .menu-first {\n                -webkit-transform: translate3d(0, -135%, 0);\n                -moz-transform: translate3d(0, -135%, 0);\n                transform: translate3d(0, -135%, 0)\n            }\n            .aside-nav:hover .menu-second {\n                -webkit-transform: translate3d(120%, -70%, 0);\n                -moz-transform: translate3d(120%, -70%, 0);\n                transform: translate3d(120%, -70%, 0)\n            }\n            .aside-nav:hover .menu-third {\n                -webkit-transform: translate3d(120%, 70%, 0);\n                -moz-transform: translate3d(120%, 70%, 0);\n                transform: translate3d(120%, 70%, 0)\n            }\n            .aside-nav:hover .menu-fourth {\n                -webkit-transform: translate3d(0, 135%, 0);\n                -moz-transform: translate3d(0, 135%, 0);\n                transform: translate3d(0, 135%, 0)\n            }\n            @-webkit-keyframes jello {\n            from, 11.1%, to {\n            -webkit-transform:none;\n            transform:none\n            }\n            22.2% {\n            -webkit-transform:skewX(-12.5deg) skewY(-12.5deg);\n            transform:skewX(-12.5deg) skewY(-12.5deg)\n            }\n            33.3% {\n            -webkit-transform:skewX(6.25deg) skewY(6.25deg);\n            transform:skewX(6.25deg) skewY(6.25deg)\n            }\n            44.4% {\n            -webkit-transform:skewX(-3.125deg) skewY(-3.125deg);\n            transform:skewX(-3.125deg) skewY(-3.125deg)\n            }\n            55.5% {\n            -webkit-transform:skewX(1.5625deg) skewY(1.5625deg);\n            transform:skewX(1.5625deg) skewY(1.5625deg)\n            }\n            66.6% {\n            -webkit-transform:skewX(-.78125deg) skewY(-.78125deg);\n            transform:skewX(-.78125deg) skewY(-.78125deg)\n            }\n            77.7% {\n            -webkit-transform:skewX(0.390625deg) skewY(0.390625deg);\n            transform:skewX(0.390625deg) skewY(0.390625deg)\n            }\n            88.8% {\n            -webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);\n            transform:skewX(-.1953125deg) skewY(-.1953125deg)\n            }\n            }\n            @-moz-keyframes jello {\n            from, 11.1%, to {\n            -moz-transform:none;\n            transform:none\n            }\n            22.2% {\n            -moz-transform:skewX(-12.5deg) skewY(-12.5deg);\n            transform:skewX(-12.5deg) skewY(-12.5deg)\n            }\n            33.3% {\n            -moz-transform:skewX(6.25deg) skewY(6.25deg);\n            transform:skewX(6.25deg) skewY(6.25deg)\n            }\n            44.4% {\n            -moz-transform:skewX(-3.125deg) skewY(-3.125deg);\n            transform:skewX(-3.125deg) skewY(-3.125deg)\n            }\n            55.5% {\n            -moz-transform:skewX(1.5625deg) skewY(1.5625deg);\n            transform:skewX(1.5625deg) skewY(1.5625deg)\n            }\n            66.6% {\n            -moz-transform:skewX(-.78125deg) skewY(-.78125deg);\n            transform:skewX(-.78125deg) skewY(-.78125deg)\n            }\n            77.7% {\n            -moz-transform:skewX(0.390625deg) skewY(0.390625deg);\n            transform:skewX(0.390625deg) skewY(0.390625deg)\n            }\n            88.8% {\n            -moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);\n            transform:skewX(-.1953125deg) skewY(-.1953125deg)\n            }\n            }\n            @keyframes jello {\n            from, 11.1%, to {\n            -webkit-transform:none;\n            -moz-transform:none;\n            transform:none\n            }\n            22.2% {\n            -webkit-transform:skewX(-12.5deg) skewY(-12.5deg);\n            -moz-transform:skewX(-12.5deg) skewY(-12.5deg);\n            transform:skewX(-12.5deg) skewY(-12.5deg)\n            }\n            33.3% {\n            -webkit-transform:skewX(6.25deg) skewY(6.25deg);\n            -moz-transform:skewX(6.25deg) skewY(6.25deg);\n            transform:skewX(6.25deg) skewY(6.25deg)\n            }\n            44.4% {\n            -webkit-transform:skewX(-3.125deg) skewY(-3.125deg);\n            -moz-transform:skewX(-3.125deg) skewY(-3.125deg);\n            transform:skewX(-3.125deg) skewY(-3.125deg)\n            }\n            55.5% {\n            -webkit-transform:skewX(1.5625deg) skewY(1.5625deg);\n            -moz-transform:skewX(1.5625deg) skewY(1.5625deg);\n            transform:skewX(1.5625deg) skewY(1.5625deg)\n            }\n            66.6% {\n            -webkit-transform:skewX(-.78125deg) skewY(-.78125deg);\n            -moz-transform:skewX(-.78125deg) skewY(-.78125deg);\n            transform:skewX(-.78125deg) skewY(-.78125deg)\n            }\n            77.7% {\n            -webkit-transform:skewX(0.390625deg) skewY(0.390625deg);\n            -moz-transform:skewX(0.390625deg) skewY(0.390625deg);\n            transform:skewX(0.390625deg) skewY(0.390625deg)\n            }\n            88.8% {\n            -webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);\n            -moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);\n            transform:skewX(-.1953125deg) skewY(-.1953125deg)\n            }\n            }\n            \n            .animated {\n                -webkit-animation-duration: 1s;\n                -moz-animation-duration: 1s;\n                animation-duration: 1s;\n                -webkit-animation-fill-mode: both;\n                -moz-animation-fill-mode: both;\n                animation-fill-mode: both\n            }\n            \n            @-webkit-keyframes bounceInUp {\n            from, 60%, 75%, 90%, to {\n            -webkit-animation-timing-function:cubic-bezier(0.215, .61, .355, 1);\n            animation-timing-function:cubic-bezier(0.215, .61, .355, 1)\n            }\n            from {\n                opacity: 0;\n                -webkit-transform: translate3d(0, 800px, 0);\n                transform: translate3d(0, 800px, 0)\n            }\n            60% {\n            opacity:1;\n            -webkit-transform:translate3d(0, -20px, 0);\n            transform:translate3d(0, -20px, 0)\n            }\n            75% {\n            -webkit-transform:translate3d(0, 10px, 0);\n            transform:translate3d(0, 10px, 0)\n            }\n            90% {\n            -webkit-transform:translate3d(0, -5px, 0);\n            transform:translate3d(0, -5px, 0)\n            }\n            to {\n                -webkit-transform: translate3d(0, 0, 0);\n                transform: translate3d(0, 0, 0)\n            }\n            }\n            @-moz-keyframes bounceInUp {\n            from, 60%, 75%, 90%, to {\n            -moz-animation-timing-function:cubic-bezier(0.215, .61, .355, 1);\n            animation-timing-function:cubic-bezier(0.215, .61, .355, 1)\n            }\n            from {\n                opacity: 0;\n                -moz-transform: translate3d(0, 800px, 0);\n                transform: translate3d(0, 800px, 0)\n            }\n            60% {\n            opacity:1;\n            -moz-transform:translate3d(0, -20px, 0);\n            transform:translate3d(0, -20px, 0)\n            }\n            75% {\n            -moz-transform:translate3d(0, 10px, 0);\n            transform:translate3d(0, 10px, 0)\n            }\n            90% {\n            -moz-transform:translate3d(0, -5px, 0);\n            transform:translate3d(0, -5px, 0)\n            }\n            to {\n                -moz-transform: translate3d(0, 0, 0);\n                transform: translate3d(0, 0, 0)\n            }\n            }\n            @keyframes bounceInUp {\n            from, 60%, 75%, 90%, to {\n            -webkit-animation-timing-function:cubic-bezier(0.215, .61, .355, 1);\n            -moz-animation-timing-function:cubic-bezier(0.215, .61, .355, 1);\n            animation-timing-function:cubic-bezier(0.215, .61, .355, 1)\n            }\n            from {\n                opacity: 0;\n                -webkit-transform: translate3d(0, 800px, 0);\n                -moz-transform: translate3d(0, 800px, 0);\n                transform: translate3d(0, 800px, 0)\n            }\n            60% {\n            opacity:1;\n            -webkit-transform:translate3d(0, -20px, 0);\n            -moz-transform:translate3d(0, -20px, 0);\n            transform:translate3d(0, -20px, 0)\n            }\n            75% {\n            -webkit-transform:translate3d(0, 10px, 0);\n            -moz-transform:translate3d(0, 10px, 0);\n            transform:translate3d(0, 10px, 0)\n            }\n            90% {\n            -webkit-transform:translate3d(0, -5px, 0);\n            -moz-transform:translate3d(0, -5px, 0);\n            transform:translate3d(0, -5px, 0)\n            }\n            to {\n                -webkit-transform: translate3d(0, 0, 0);\n                -moz-transform: translate3d(0, 0, 0);\n                transform: translate3d(0, 0, 0)\n            }\n            }\n            .bounceInUp {\n                -webkit-animation-name: bounceInUp;\n                -moz-animation-name: bounceInUp;\n                animation-name: bounceInUp;\n                -webkit-animation-delay: 1s;\n                -moz-animation-delay: 1s;\n                animation-delay: 1s\n            }\n            \n            @media screen and (max-width:640px) {\n            .aside-nav {/* display: none!important */}\n            }\n            @media screen and (min-width:641px) and (max-width:1367px) {\n            .aside-nav {top: 50px}\n            }\n            ";
        accpendCssContent(css);
        $("body").append(sidenav).append($('<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.css">'));

        var ua = navigator.userAgent;
        /Safari|iPhone/i.test(ua) && 0 == /chrome/i.test(ua) && $("#aside-nav").addClass("no-filter");
        var drags = { down: !1, x: 0, y: 0, winWid: 0, winHei: 0, clientX: 0, clientY: 0 }, asideNav = $("#aside-nav")[0], getCss = function (a, e) { return a.currentStyle ? a.currentStyle[e] : document.defaultView.getComputedStyle(a, !1)[e] };
        $("body").on("mousedown","#aside-nav", function (a) {
            drags.down = !0, drags.clientX = a.clientX, drags.clientY = a.clientY, drags.x = getCss(this, "right"), drags.y = getCss(this, "top"), drags.winHei = $(window).height(), drags.winWid = $(window).width(), $(document).on("mousemove", function (a) {
                if (drags.winWid > 640 && (a.clientX < 120 || a.clientX > drags.winWid - 50))
                    return !1;
                if (a.clientY < 180 || a.clientY > drags.winHei - 120)
                    return !1;
                var e = a.clientX - drags.clientX,
                    t = a.clientY - drags.clientY;
                asideNav.style.top = parseInt(drags.y) + t + "px";
                asideNav.style.right = parseInt(drags.x) - e + "px";
            })
        }).on("mouseup","#aside-nav", function () {
            drags.down = !1, $(document).off("mousemove")
        });
        init();
    }
})();