// ==UserScript==
// @name         百度去广告+美化
// @namespace    https://www.huankong.top/
// @version      1.6.0
// @description  解决百度全家桶的众多广告~
// @author       幻空
// @match        https://www.baidu.com/*
// @match        https://fanyi.baidu.com/*
// @match        https://baike.baidu.com/*
// @match        https://wenku.baidu.com/*
// @icon         https://www.huankong.top/favicon.ico
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/426966/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%2B%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/426966/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%2B%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    //初始化变量
    let vm = 0;
    //浏览器窗口大小变化时
    window.onresize = function(){
        size();
        fresh();
    };
    function size(){
        vm = $(window).width()/100;
        console.log(vm);
    }
    function fresh(){
        if(window.location.host === "fanyi.baidu.com"){
            //百度翻译
            $(".header").css({display:"none"});
            $(".manual-trans-btn").css({display:"none"});
            $(".translate-setting").css({display:"none"});
            $(".domain-trans-wrapper").remove();
            $(".footer").remove();
            $(".trans-other-right").remove();
            $("#left-result-container").bind('DOMNodeInserted', function() {
                $("#app-read").remove();
            });
            $(".translateio").css({position:"relative",top:"15px"});
            $(".trans-operation").css({marginLeft:16.207455429497568*vm+"px"});
            $(".container").css({width:"100%"});
        }
        if(window.location.host === "baike.baidu.com"){
            //百度百科
            $("#side-share").remove();
            //$(".before-content").remove();
            $(".topbar").remove();
            $("#J-declare-wrap").remove();
            $(".J-lemma-title").html($(".J-lemma-title").find("h1"));
            $(".top-tool").remove();
            $(".posterFlag").remove();
            $(".professional-con").remove();
            $(".side-content").html($(".summary-pic"));
            $(".album-list").remove();
            $(".tashuo-bottom").remove();
            $(".after-content").remove();
            $(".wgt-footer-main").remove();
            $(".tool-buttons").remove();
            $(".user-info").remove();
            $(".help").remove();
            $(".navbar-wrapper").remove();
            $(".wgt-searchbar").css({margin:"0 auto",width:"",float:"unset"});
            $(".search").find("#searchForm").css({display:"flex"})
        }
        if(window.location.host === "wenku.baidu.com"){
            //百度文库
            setInterval(function(){
                $(".experience-card-dialog-wrap").remove();
                if(window.location.href === "https://wenku.baidu.com/"){
                    $(".content-wrapper").html($(".classification-wrapper"));
                }
                $(".propagation-wrapper").remove();
                $(".topbar-wrapper").remove();
                $(".bg-item").css({backgroundImage:"url(\"https://i0.hdslb.com/bfs/album/947f9c3049bc4eec3cf39c2b59708caf17253bbd.png\")"})
                $(".search-user-wrapper").remove();
                $(".complaint").remove();
                $(".right-box").remove();
                $(".sidebar-wrapper").remove();
                $(".doc-btns-wrap").remove();
                $(".doc-price-voucher-wrap").remove();
                $(".package-content-wrapper").remove();
                $(".search-tab-wrap").remove();
                $(".search-logo-wrap").remove();
                $(".search-input-wrap").css({margin:"15px auto",float:"unset"})
                $(".search-submit-btn").css({float:"left"});
            },500)
        }
    }
    //页面加载完成
    size();
    fresh();
})();