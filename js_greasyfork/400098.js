// ==UserScript==
// @name         精简爱词霸
// @namespace    https://greasyfork.org/users/481318
// @version      0.4
// @description  去除爱词霸的广告和所有非必要元素。
// @author       Crexyer
// @match        *://www.iciba.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400098/%E7%B2%BE%E7%AE%80%E7%88%B1%E8%AF%8D%E9%9C%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/400098/%E7%B2%BE%E7%AE%80%E7%88%B1%E8%AF%8D%E9%9C%B8.meta.js
// ==/UserScript==

/* globals $, Cookies */

(function() {
    $("html").css("overflow-y", "auto");

    $(".goto-top").css({
        "left": "auto",
        "right": "5%",
        "bottom": "5%",
        "margin-left": "auto"
    });

    $(".search-bar").css("width", "calc(100% - 22px)");
    $(".search-input").css("width", "calc(100% - 117px)");
    $(".search-history").css({
        "width": "calc(100% - 40px)",
        "padding-left": "20px",
        "padding-right": "20px"
    });
    $(".search-clear").css("width", "48px");

    $(".container-left").css("width", "100%");
    $(".container").css({
        "width": "calc(100% - 20px)",
        "min-height": "auto",
        "padding-bottom": "0",
        "padding-left": "10px",
        "padding-right": "10px"
    });

    $(".in-base-top").css("width", "100%");
    $(".base-list p").css("width", "100%");
    $(".in-base-top > h1").css({
        "width": "100%",
        "word-wrap" : "break-word"
    });
    $(".in-base-top > div").css({
        "width": "100%",
        "word-wrap" : "break-word"
    });

    $(".common-top").css("display", "none");
    $(".search-line").css("display", "none");
    $(".search-hot").css("display", "none");
    $(".container-right").css("display", "none");
    $(".menu").css("display", "none");
    $(".cb-downloadbar").css("display", "none");
    $(".foot-top-seo").css("display", "none");
    $(".foot").css("display", "none");

    // 主页样式修改
    $(".home .nav").css("display", "none");
    $(".home-func").css("display", "none");
    $(".home-download").css("display", "none");
    $(".home-pc").css("display", "none");
    $(".footer").css("display", "none");
    $(".home").css({
        "min-width": "auto",
        "background": "none"
    });
    $(".home .nav").css("min-width", "auto");
    $(".home-banner").css({
        "min-width": "auto",
        "background": "none",
        "padding-top": "0"
    });
    $(".home-banner-content").css("width", "100%");
    $(".home-banner-content > h1").css("display", "none");
    $(".home-banner-content > p").css("display", "none");
    $(".home-search-tab").css("display", "none");
    $(".home-search").css({
        "margin-top": "10px",
        "margin-left": "10px",
        "margin-right": "10px",
        "height": "42px",
        "border": "1px solid #e1e1e1",
        "border-radius": "4px"
    });
    $('.home-search form').css({
        "height": "42px",
        "margin-top": "0px"
    });

    var searchButtom = $(".home-search form div");
    var searchInput = $(".home-search form input");
    searchInput.insertAfter(searchButtom);
    searchButtom.css({
        "float": "left",
        "width": "21px",
        "height": "21px",
        "margin": "11px 12px 0",
        "background": "url(/images/search.png) no-repeat -170px -190px"
    });
    searchInput.css({
        "width": "calc(100% - 45px)",
        "height": "24px",
        "box-sizing": "content-box",
        "line-height": "24px",
        "padding": "9px 0",
        "font-size": "14px"
    });

    // 汉语样式
    $(".hanyu-section").css({"width": "100%"});
    $(".hanci-table").css({"width": "100%"});

    $(window).on('load', function() {
        // 禁用划词功能
        window.ICIBA_HUAYI_ALLOW = 0;
        Cookies.set("search-menu-button-status", 0);

        // 添加查词界面图标
        $('head').append('<link href="/view/new/dist/favicon.ico" rel="shortcut icon" type="image/x-icon" />');
    });

    $("body").bind("DOMSubtreeModified", function() {
        $(".info-product").removeAttr("style").css("display", "none");
        $(".info-hotwords").removeAttr("style").css("display", "none");

        // 主页样式修改
        $(".home-search-list").css({
            "top": "42px",
            "left": "-1px",
            "padding": "0",
            "position": "absolute",
            "width": "100%",
            "box-shadow": "0 10px 10px -2px rgba(0,0,0,.2)",
            "border": "1px solid #dedede",
            "border-radius": "3px"
        });
        $(".home-search-list li").css({
            "display": "block",
            "padding-left": "10px",
            "padding-right": "30px",
            "height": "30px",
            "line-height": "30px",
            "cursor": "pointer",
            "transition": ".25s"
        });
        $(".home-search-list li em").css({
            "float": "left",
            "margin-right": "15px",
        });
        $(".home-search-list li span").css({
            "float": "left",
            "margin-left": "0px",
        });

        // 去除广告
        $(".search-ad").css("display", "none");
        $(".ad-left").css("display", "none");
        $(".cb-downmask").css("display", "none");
    });
})();