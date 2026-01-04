// ==UserScript==
// @name         紫曦解析
// @namespace    https://greasyfork.org/zh-CN/users/290898
// @version      0.0.3
// @description  在视频播放页悬浮VIP按钮，可在线播放vip视频；支持优酷vip，腾讯vip，爱奇艺vip，芒果vip，乐视vip等常用视频...一站式音乐搜索解决方案，网易云音乐，QQ音乐，酷狗音乐，酷我音乐，虾米音乐，百度音乐，蜻蜓FM，荔枝FM，喜马拉雅，优惠券查询
// @author       紫曦
// @icon         
// @match        *://m.youku.com/v*
// @match        *://m.youku.com/a*
// @match        *://v.youku.com/v_show/*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/w_*
// @match        *://*.iqiyi.com/a_*
// @match        *://*.iqiyi.com/adv*
// @match        *://*.iqiyi.com/dianying/*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://v.qq.com/x/cover/*
// @match        *://v.qq.com/x/page/*
// @match        *://v.qq.com/play*
// @match        *://*.tudou.com/listplay/*
// @match        *://*.tudou.com/albumplay/*
// @match        *://*.tudou.com/programs/view/*
// @match        *://*.mgtv.com/b/*
// @match        *://film.sohu.com/album/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/anime/*
// @match        *://vip.pptv.com/show/*
// @match        *://v.pptv.com/show/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.wasu.cn/Play/show/*
// @match        *://music.taihe.com/song*
// @match        *://item.taobao.com/*
// @match        *://detail.tmall.com/*
// @match        *://item.jd.com/*
// @match        *://music.163.com/song*
// @match        *://y.qq.com/*
// @match        *://www.kugou.com/*
// @match        *://www.kuwo.cn/*
// @match        *://www.xiami.com/*
// @match        *://music.baidu.com/*
// @match        *://www.qingting.fm/*
// @match        *://www.lizhi.fm/*
// @match        *://music.migu.cn/*
// @match        *://www.ximalaya.com/*
// @grant        GM_setClipboard
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/381624/%E7%B4%AB%E6%9B%A6%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/381624/%E7%B4%AB%E6%9B%A6%E8%A7%A3%E6%9E%90.meta.js
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
    var reYYT = /yinyuetai/i;
    var reTaoBao = /taobao.com/i;
    var reTmall = /tmall/i;
    var reJd = /jd/i;
    var reWY = /163(.*)song/i;
	var reQQ = /y.QQ(.*)song/i;
	var reKG = /kugou(.*)song/i;
	var reKW = /kuwo(.*)yinyue/i;
	var reXM = /xiami/i;
	var reBD = /baidu.com/i;
	var reQT = /qingting/i;
	var reLZ = /lizhi/i;
	var reMiGu = /migu/i;
	var reXMLY = /ximalaya/i;
    var html='';
    var name='';
    var t=$.now();
    $("body").append(sidenav).append($('<link rel="stylesheet" href="//cdn.wandhi.com/style/tv/asidenav.css">'))
    if(reWY.test(currentUrl)||reQQ.test(currentUrl)||reKG.test(currentUrl)||reKW.test(currentUrl)||reXM.test(currentUrl)||reBD.test(currentUrl)||reQT.test(currentUrl)||reLZ.test(currentUrl)||reMiGu.test(currentUrl)||reXMLY.test(currentUrl))
    {
        var sidenav = '<svg width="0" height="0"><defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo"></feColorMatrix><feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite></filter></defs></svg><div class="aside-nav bounceInUp animated" id="aside-nav"><label for="" class="aside-menu" title="\u6309\u4f4f\u62d6\u52a8">VIP</label><a href="javascript:void(0)" title="\u7535\u5f71\u641c\u7d22" data-cat="search" class="menu-item menu-line menu-first">\u7535\u5f71<br>\u641c\u7d22</a><a href="javascript:void(0)" title="\u97f3\u4e50\u4e0b\u8f7d" data-cat="process" class="menu-item menu-line menu-second">\u97f3\u4e50<br>\u4e0b\u8f7d</a><a href="javascript:void(0)" title="\u7edd\u4e16\u597d\u5238" data-cat="tb" class="menu-item menu-line menu-third">\u7edd\u4e16<br>\u597d\u5238</a><a href="javascript:void(0)" title="\u4eac\u4e1c\u597d\u5238" data-cat="jd" class="menu-item menu-line menu-fourth">\u4eac\u4e1c<br>\u597d\u5238</a></div>';
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
        $('body').on('click', '[data-cat=process]', function () {
            if(reXMLY.test(currentUrl))
            {
                if(__INITIAL_STATE__.SoundDetailPage!=undefined)
                {
                    window.open('http://v.zixi.ooo/music/?id='+__INITIAL_STATE__.SoundDetailPage.trackId+'&type=ximalaya');
                }else
                {
                    layer.closeAll();
                    var html='<div style="padding:0px 50px 0px 50px;"><ul class="sound-list dOi2">';
                    $.each(__INITIAL_STATE__.AlbumDetailTrackList.tracksInfo.tracks,function(index,item){html+='<li class="dOi2"><a href="http://music.wandhi.com/?id='+item.trackId+'&type=ximalaya" target="_blank">'+item.title+'</a></li>';});
                    html+='</ul></div>';
                    layer.open({type: 1,area: ['auto', '30%'],title: dde("JUU0JUI4JUJBJUU0JUJEJUEwJUU2JTg5JUJFJUU1JTg4JUIwJUU0JUJBJTg2JUU4JUJGJTk5JUU0JUJBJTlCJUU2JTlCJUIyJUU3JTlCJUFFJUU4JUE3JUEzJUU2JTlFJTkwJUUyJTgwJUE2JUUyJTgwJUE2JUU0JUJCJTgwJUU0JUI5JTg4JUVGJUJDJTlGJUU2JTg4JTkxJUU0JUI4JTkxJUVGJUJDJTlGJUU0JUJCJUE1JUU1JTkwJThFJUU1JTg2JThEJUU4JUFGJUI0JUU1JTkwJUE3"),shade: 0.6,maxmin: false,anim: 2,content: html});
                }

            }else
            {
                window.open('http://v.zixi.ooo/music/?url=' + encodeURIComponent(currentUrl));
            }
        });
        $('body').on('click', '[data-cat=search]', function () {
            window.open('http://v.zixi.ooo/');
        });
        $('body').on('click', '[data-cat=tb]', function () {
            window.open('http://gw.zixi.ooo/');
        });
        $('body').on('click', '[data-cat=jd]', function () {
            window.open('http://gw.zixi.ooo/');
        });
    }
    else if (reAqy.test(currentUrl) || reLS.test(currentUrl) || reTX.test(currentUrl) || reTD.test(currentUrl) || reMG.test(currentUrl) || reSH.test(currentUrl) || rePP.test(currentUrl) || reYk.test(currentUrl)) {
        var sidenav = '<svg width="0" height="0"><defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo"></feColorMatrix><feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite></filter></defs></svg><div class="aside-nav bounceInUp animated" id="aside-nav"><label for="" id="aside-menu" class="aside-menu" title="\u6309\u4f4f\u62d6\u52a8">VIP</label><a href="javascript:void(0)" title="\u7535\u5f71\u641c\u7d22" data-cat="search" class="menu-item menu-line menu-first">\u7535\u5f71<br>\u641c\u7d22</a><a href="javascript:void(0)" title="\u89c6\u9891\u89e3\u6790" data-cat="process" class="menu-item menu-line menu-second">\u89c6\u9891<br>\u89e3\u6790</a><a href="javascript:void(0)" title="\u7edd\u4e16\u597d\u5238" data-cat="tb" class="menu-item menu-line menu-third">\u7edd\u4e16<br>\u597d\u5238</a><a href="javascript:void(0)" title="\u4eac\u4e1c\u597d\u5238" data-cat="jd" class="menu-item menu-line menu-fourth">\u4eac\u4e1c<br>\u597d\u5238</a></div>';
        $("body").append(sidenav).append($('<link rel="stylesheet" href="//cdn.wandhi.com/style/tv/asidenav.css?v=20190225">'));
        var ua = navigator.userAgent;
        /Safari|iPhone/i.test(ua) && 0 == /chrome/i.test(ua) && $("#aside-nav").addClass("no-filter");
        var drags = { down: !1, x: 0, y: 0, winWid: 0, winHei: 0, clientX: 0, clientY: 0 }, asideNav = $("#aside-nav")[0], getCss = function (a, e) { return a.currentStyle ? a.currentStyle[e] : document.defaultView.getComputedStyle(a, !1)[e] };
        $("body").on("mousedown","#aside-menu", function (a) {
            drags.down = !0, drags.clientX = a.clientX, drags.clientY = a.clientY, drags.x = getCss(this.parentElement, "right"), drags.y = getCss(this.parentElement, "top"), drags.winHei = $(window).height(), drags.winWid = $(window).width(), $(document).on("mousemove", function (a) {
                // if (drags.winWid > 640 && (a.clientX < 120 || a.clientX > drags.winWid - 50))
                //     return !1;
                // if (a.clientY < 180 || a.clientY > drags.winHei - 120)
                //     return !1;
                var e = a.clientX - drags.clientX,
                    t = a.clientY - drags.clientY;
                asideNav.style.top = parseInt(drags.y) + t + "px";
                asideNav.style.right = parseInt(drags.x) - e + "px";
            })
        }).on("mouseup","#aside-menu", function () {
            drags.down = !1, $(document).off("mousemove")
        });
        $('body').on('click', '[data-cat=process]', function () {
            window.open('http://v.zxys.tw/?url=' +encodeURIComponent(currentUrl));
        });
        $('body').on('click', '[data-cat=search]', function () {
            window.open('http://v.zixi.ooo/');
        });
        $('body').on('click', '[data-cat=tb]', function () {
            window.open('http://gw.zixi.ooo/');
        });
        $('body').on('click', '[data-cat=jd]', function () {
            window.open('http://gw.zixi.ooo');
        });
    }
    else if (reTaoBao.test(currentUrl)||reTmall.test(currentUrl)) {
        loader();TINT();    
    } else if (reJd.test(currentUrl)) {
        var keywords = $(".sku-name").text().trim();
        $("#choose-btns").prepend('<a href="javascript:;" class="btn-special1 btn-lg btn-yhj"><span class="">\u67e5\u8be2\u4f18\u60e0\u5238</span></a>');
        $(".btn-yhj").on('click', function () { window.open("http://gw.zixi.ooo/index.php?r=l&kw=" + encodeURIComponent(keywords)); });
    }
    function loader()
    {
        $("body").append($('<script type="text/javascript" src="//lib.baomitu.com/jquery/1.12.4/jquery.min.js"></script>'));        
        $("body").append($(dde('JTNDc2NyaXB0JTIwdHlwZSUzRCUyMnRleHQlMkZqYXZhc2NyaXB0JTIyJTIwc3JjJTNEJTIyJTJGJTJGY2RuLndhbmRoaS5jb20lMkZqcyUyRmV4dGVuc3Rpb24lMkZzY3JpcHQuanMlM0Z2JTNEMSUyMiUzRQ==')));    
    }
    function de(a){return window.atob(a);}
    function dde(a){return decodeURIComponent(window.atob(a));}
    function getPar(a) {var b = location.search.match(new RegExp("[\?\&]" + a + "=([^\&]+)", "i"));if (b == null || b.length < 1) {return "";}return b[1];}
    function appendCss(url){$('head').append($('<link rel="stylesheet" href="'+url+'">'));}
    function TINT(){var bid=getPar('id');var api='/api/tb/info/'+bid;appendCss(dde("JTJGJTJGY2RuLndhbmRoaS5jb20lMkZzdHlsZSUyRmV4dGVuc3Rpb24lMkZodWkuc3R5bGUuY3Nz"));var init="<div id='wandhi_div'><table class='wandhi_tab' id='wandhi_table'><thead><tr><th><b onclick=window.open(dde('aHR0cCUzQSUyRiUyRnd3dzMuaHVpemhlay5jb20=')) style='cursor:pointer'>\u4f18\u60e0\u5238</b></th><th>\u5238\u540e</th><th>\u6709 \u6548 \u671f</th><th>\u64cd\u4f5c</th></tr></thead><tr><td colspan='4'>\u6b63\u5728\u67e5\u8be2\u4f18\u60e0\u4fe1\u606f\uff0c\u8bf7\u7a0d\u5019...</td></tr></table></div>";$('#J_LinkBasket').parent().after(init);$('.J_LinkAdd').parent().after(init);if(reTaoBao.test(currentUrl)){$('#wandhi_table').addClass('wandhi_tab_taobao');}else{$('#wandhi_table').addClass('wandhi_tab_tmall');}$.getJSON(dde('aHR0cHMlM0ElMkYlMkZ3d3cueWh4eGMuY29t')+api,function(d){$("#wandhi_table tbody tr").remove();var row="";if(d.code){row="<tr><td>"+d.data.quan_context+"</td><td>"+d.data.after_price+"</td><td>"+d.data.quan_time+"</td><td><b onclick=window.open(dde('aHR0cHMlM0ElMkYlMkZ3d3cueWh4eGMuY29tJTJGcmVkaXIlM0Z1cmwlM0Q=')+'"+d.data.quan_link+"') style='cursor:pointer'>领取</b></td></tr>";}else{row="<tr><td colspan='4'>\u8fd9\u4e2a\u5546\u54c1\u6ca1\u6709\u8d85\u503c\u4f18\u60e0\u5238\uff0c\u53bb<b onclick=window.open(dde('aHR0cCUzQSUyRiUyRnd3dzMuaHVpemhlay5jb20=')) style='cursor:pointer'>\u8fd9\u91cc</b>或<b onclick=window.open(dde('aHR0cCUzQSUyRiUyRnd3dzIuaHVpemhlay5jb20=')) style='cursor:pointer'>\u8fd9\u91cc</b>\u627e\u627e\uff0c\u6216\u8005 <b onclick=window.open(dde('aHR0cHMlM0ElMkYlMkZ3d3cueWh4eGMuY29tJTJGc2hvdXFp')) style='cursor:pointer'>\u8bd5\u8bd5\u624b\u6c14</b>。</td></tr>";}$("#wandhi_table tbody").append(row);});}
})();