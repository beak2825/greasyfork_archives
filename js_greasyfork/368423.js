// ==UserScript==
// @name         VIP视频解析测试
// @namespace    http://www.asvideo.top/
// @version      2.4.5
// @description  优酷 爱奇艺 腾讯 芒果 AB站
// @author       taoyouhui
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
// @include      *://asvideo/top*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
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
// @downloadURL https://update.greasyfork.org/scripts/368423/VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/368423/VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==
(function () {
    'use strict';
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
    var restr = /www.asvideo.top/i;
    var t = $.now();
    if (!restr.test(currentUrl) && reAqy.test(currentUrl) || reLS.test(currentUrl) || reTX.test(currentUrl) || reTD.test(currentUrl) || reMG.test(currentUrl) || reSH.test(currentUrl) || rePP.test(currentUrl) || reYk.test(currentUrl)) {
        var menus=[{title:'\u89C6\u9891\u89E3\u6790',show:'\u89C6\u9891<br>\u89E3\u6790',type:'process'}];        
        InitMenu(menus,function(){
        $('body').on('click', '[data-cat=process]', function () {
            window.open('http://www.asvideo.top/index.php?new=' + encodeURIComponent(window.location.href));
        });
        });
    }

    function loader() {
        $("body").append($('<script type="text/javascript" src="//lib.baomitu.com/jquery/1.12.4/jquery.min.js"></script>'));
    }
    function getPar(a) {
        var b = location.search.match(new RegExp("[\?\&]" + a + "=([^\&]+)", "i"));
        if (b == null || b.length < 1) {
            return "";
        }
        return b[1];
    }

    function appendCss(url) {
        $('head').append($('<link rel="stylesheet" href="' + url + '">'));
    }
    
    var answer="-1";
    function Msg(msg){layer.closeAll();layer.msg(msg, {icon: 5});}
    function InitCurrentUrl(){currentUrl = window.location.href;}
    function InitMenu(obj,init){
        var menusclass=['first','third','third','fourth','fifth'];
        var str="";
        $.each(obj,function(i,o){
            str+='<a href="javascript:void(0)" title="'+o.title+'" data-cat="'+o.type+'" class="menu-item menu-line menu-'+menusclass[i]+'">'+o.show+'</a>';
        });
        var sidenav = '<svg width="0" height="0"><defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo"></feColorMatrix><feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite></filter></defs></svg><div class="aside-nav bounceInUp animated" id="aside-nav"><label for="" class="aside-menu" title="\u6309\u4F4F\u62D6\u52A8">VIP</label>'+str+'</div>';
        $("body").append(sidenav).append($('<link rel="stylesheet" href="//cdn.wandhi.com/style/tv/asidenav.css">')).append($('<link rel="stylesheet" href="https://lib.baomitu.com/layer/3.1.1/theme/default/layer.css">'));
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