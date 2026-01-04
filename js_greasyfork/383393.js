// ==UserScript==
// @name         一键VIP视频解析去广告(全网),一站式音乐搜索下载,上学吧答案显示,百度云离线跳转,去除优惠券推广
// @namespace    http://www.wandhi.com/
// @version      4.3.4-06-12-2019
// @description  在视频播放页悬浮VIP按钮，可在线播放vip视频；支持优酷\腾讯\爱奇艺\芒果\乐视vip等常用视频...一站式音乐搜索解决方案，网易云\QQ\酷狗\酷我\虾米\百度\蜻蜓FM，荔枝FM，喜马拉雅
// @author       Wandhi Mod by jH
// @icon         https://www.wandhi.com/favicon.ico

//video
// @match        *://*.acfun.cn/v/*
// @match        *://*.iqiyi.com/a_*
// @match        *://*.iqiyi.com/adv*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/w_*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://*.mgtv.com/b/*
// @match        *://*.pptv.com/show/*
// @match        *://*.tudou.com/albumplay/*
// @match        *://*.tudou.com/listplay/*
// @match        *://*.tudou.com/programs/view/*
// @match        *://*.wasu.cn/Play/show/*
// @match        *://film.sohu.com/album/*
// @match        *://m.youku.com/a*
// @match        *://m.youku.com/v*
// @match        *://v.youku.com/v_show/*
// @match        *://tv.sohu.com/v/*
// @match        *://v.qq.com/play*
// @match        *://v.qq.com/x/cover/*
// @match        *://v.qq.com/x/page/*
// @match        *://y.qq.com/*

//music
// @match        *://music.163.com/m/song*
// @match        *://music.163.com/song*
// @match        *://music.baidu.com/*
// @match        *://music.migu.cn/*
// @match        *://music.taihe.com/song*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://www.kugou.com/*
// @match        *://www.kuwo.cn/*
// @match        *://www.lizhi.fm/*
// @match        *://www.qingting.fm/*
// @match        *://www.xiami.com/*
// @match        *://www.ximalaya.com/*

//other
// @match        *://www.shangxueba.com/ask/*.html
// @match        *://www.shangxueba.com/ask/*.html
// @match        *://pan.baidu.com/s/*

// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://greasyfork.org/scripts/373336-layer-wandhi/code/layer_wandhi.js?version=637587
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM.getValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/383393/%E4%B8%80%E9%94%AEVIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%8E%BB%E5%B9%BF%E5%91%8A%28%E5%85%A8%E7%BD%91%29%2C%E4%B8%80%E7%AB%99%E5%BC%8F%E9%9F%B3%E4%B9%90%E6%90%9C%E7%B4%A2%E4%B8%8B%E8%BD%BD%2C%E4%B8%8A%E5%AD%A6%E5%90%A7%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BA%2C%E7%99%BE%E5%BA%A6%E4%BA%91%E7%A6%BB%E7%BA%BF%E8%B7%B3%E8%BD%AC%2C%E5%8E%BB%E9%99%A4%E4%BC%98%E6%83%A0%E5%88%B8%E6%8E%A8%E5%B9%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/383393/%E4%B8%80%E9%94%AEVIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%8E%BB%E5%B9%BF%E5%91%8A%28%E5%85%A8%E7%BD%91%29%2C%E4%B8%80%E7%AB%99%E5%BC%8F%E9%9F%B3%E4%B9%90%E6%90%9C%E7%B4%A2%E4%B8%8B%E8%BD%BD%2C%E4%B8%8A%E5%AD%A6%E5%90%A7%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BA%2C%E7%99%BE%E5%BA%A6%E4%BA%91%E7%A6%BB%E7%BA%BF%E8%B7%B3%E8%BD%AC%2C%E5%8E%BB%E9%99%A4%E4%BC%98%E6%83%A0%E5%88%B8%E6%8E%A8%E5%B9%BF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var currentUrl = window.location.href;
    var reAF = /acfun/i;
    var reAqy = /iqiyi/i;
    var reBD = /taihe.com/i;
    var reBDY=/pan.baidu.com\/s/i;
    var reBL = /bilibili/i;
    var reKG = /kugou(.*)song/i;
    var reKW = /kuwo(.*)yinyue/i;
    var reLS = /le.com/i;
    var reLZ = /lizhi/i;
    var reMG = /mgtv/i;
    var reMiGu = /migu/i;
    var rePP = /pptv/i;
    var reQQ = /y.QQ(.*)song/i;
    var reQT = /qingting/i;
    var reSH = /sohu/i;
    var reSXB = /shangxueba/i;
    var reTD = /tudou/i;
    var reTX = /v.qq/i;
    var reWY = /163(.*)song/i;
    var reXM = /xiami/i;
    var reXMLY = /ximalaya/i;
    var reYJ = /1905/i;
    var reYk = /youku/i;
    var reYYT = /yinyuetai/i;
    var t = $.now();
    if (reWY.test(currentUrl) || reQQ.test(currentUrl) || reKG.test(currentUrl) || reKW.test(currentUrl) || reXM.test(currentUrl) || reBD.test(currentUrl) || reQT.test(currentUrl) || reLZ.test(currentUrl) || reMiGu.test(currentUrl) || reXMLY.test(currentUrl)) {
        var menus=[{title:'\u7535\u5F71\u641C\u7D22',show:'\u7535\u5F71<br>\u641C\u7D22',type:'search'},{title:'\u97F3\u4E50\u4E0B\u8F7D',show:'\u97F3\u4E50<br>\u4E0B\u8F7D',type:'process'}];
        var f=function(){
        $('body').on('click', '[data-cat=process]', function () {
            InitCurrentUrl();
            if(reXMLY.test(currentUrl))
            {
                if(__INITIAL_STATE__.SoundDetailPage!=undefined)
                {
                    window.open('http://music.wandhi.com/?id='+__INITIAL_STATE__.SoundDetailPage.trackId+'&type=ximalaya');
                }else
                {
                    layer.closeAll();
                    var html='<div style="padding:0px 50px 0px 50px;"><ul class="sound-list dOi2">';
                    $.each(__INITIAL_STATE__.AlbumDetailTrackList.tracksInfo.tracks,function(index,item){html+='<li class="dOi2"><a href="http://music.wandhi.com/?id='+item.trackId+'&type=ximalaya" target="_blank">'+item.title+'</a></li>';});
                    html+='</ul></div>';
                    layer.open({type: 1,area: ['auto', '30%'],title: '\u4E3A\u4F60\u627E\u5230\u4E86\u8FD9\u4E9B\u66F2\u76EE\u89E3\u6790\u2026\u2026\u4EC0\u4E48\uFF1F\u6211\u4E11\uFF1F\u4EE5\u540E\u518D\u8BF4\u5427',shade: 0.6,maxmin: false,anim: 2,content: html});
                }

            }else if(/taihe.com/i.test(currentUrl)){
                window.open('http://music.wandhi.com/?url=' + encodeURIComponent(currentUrl.replace("taihe","baidu")));
            }
            else
            {
                window.open('http://music.wandhi.com/?url=' + encodeURIComponent(currentUrl));
            }
        });
        $('body').on('click', '[data-cat=search]', function () {
            window.open('http://tv.wandhi.com/');
        });};
        InitMenu(menus,f);
    } else if (reAqy.test(currentUrl) || reLS.test(currentUrl) || reTX.test(currentUrl) || reTD.test(currentUrl) || reMG.test(currentUrl) || reSH.test(currentUrl) || rePP.test(currentUrl) || reYk.test(currentUrl)) {
        var menus=[{title:'\u7535\u5F71\u641C\u7D22',show:'\u7535\u5F71<br>\u641C\u7D22',type:'search'},{title:'\u89C6\u9891\u89E3\u6790',show:'\u89C6\u9891<br>\u89E3\u6790',type:'process'}];
        InitMenu(menus,function(){
        $('body').on('click', '[data-cat=process]', function () {
            window.open('http://tv.wandhi.com/go.html?url=' + encodeURIComponent(window.location.href));
        });
        $('body').on('click', '[data-cat=search]', function () {
            window.open('http://tv.wandhi.com/');
        });})
    }else if(reSXB.test(currentUrl)){
        var menus=[{title:'\u67E5\u770B\u7B54\u6848',show:'\u67E5\u770B<br>\u7B54\u6848',type:'search'},{title:'\u6253\u8D4F\u4F5C\u8005',show:'\u6253\u8D4F<br>\u4F5C\u8005',type:'process'}];
        InitMenu(menus,function(){
            $('body').on('click', '[data-cat=process]', function () {
                layer.open({type: 1,title: '\u8bf7\u6211\u559d\u4e00\u676f',shadeClose: true,area: '800px',content: '<img src="https://i.loli.net/2019/05/14/5cda672add6f594934.jpg">'});
            });
            $('body').on('click', '[data-cat=search]', function () {SXB();});
            });
    }else if(reBDY.test(currentUrl)){
        var menus=[{title:'\u79BB\u7EBF\u4E0B\u8F7D',show:'\u79BB\u7EBF<br>\u4E0B\u8F7D',type:'search'},{title:'\u6253\u8D4F\u4F5C\u8005',show:'\u6253\u8D4F<br>\u4F5C\u8005',type:'process'}];
        InitMenu(menus,function(){
            $('body').on('click', '[data-cat=process]', function () {
                layer.open({type: 1,title: '\u8bf7\u6211\u559d\u4e00\u676f',shadeClose: true,area: '800px',content: '<img src="http://i1.fuimg.com/500348/6717e02198116ae4s.png">'});
            });
            $('body').on('click', '[data-cat=search]', function () {window.location.href=window.location.href.replace('baidu.com','baiduwp.com');});
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

    function Msg(msg){layer.closeAll();layer.msg(msg, {icon: 5});}
    function InitCurrentUrl(){currentUrl = window.location.href;}
    function InitMenu(obj,init){
        var menusclass=['first','second','third','fourth','fifth'];
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
