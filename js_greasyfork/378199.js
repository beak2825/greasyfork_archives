// ==UserScript==
// @name         博客专注模式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  通用博客模板：博客园、CSDN、新浪博客、月光博客视觉优化
// @author       puwen
// @home-url        https://greasyfork.org/zh-TW/scripts/378199
// @match        *://www.cnblogs.com/*/p/*
// @match        *://www.cnblogs.com/*/articles/*
// @match        https://blog.csdn.net/*/article*
// @match        *://blog.sina.com.cn/*
// @match        *://www.williamlong.info/*
// @match        https://www.jb51.net/article/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/378199/%E5%8D%9A%E5%AE%A2%E4%B8%93%E6%B3%A8%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/378199/%E5%8D%9A%E5%AE%A2%E4%B8%93%E6%B3%A8%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function (){
    "use strict";
    var cm_siteHref = window.location.href;
    var cm_body = $(window.document.body);
    var cm_head = $(window.document.head);
    var cm_mainBar = null;
    var cm_otherBar = null;
    var cm_navBar = null;
    var cm_titleBar = null
    var cm_contentRow = null;
    var cm_contentBar = null;
    var cm_sideBar = null;
    var cm_commentBar = null;
    var cm_siteCss = null;
    // 自定义配置属性
    var cm_myConfig = {};
    // 默认配置属性
    var cm_defaultConfig = {
        is_active : true,
        showTitleBar: true,
        showSideBar: false,
        showCommentBar: true,
        toolCss: ".row{display:flex; flex-wrap:wrap;} @media(max-width:767px){.hidden-sm{display:none!important;} .col-sm-12{flex:0 0 100%; max-width:100%}} @media(min-width:768px){.col-md-3{flex:0 0 25%; max-width:25%;} .col-md-9{flex:0 0 75%; max-width:75%;} .col-md-12{flex:0 0 100%; max-width:100%;}}",
        myCss: "body{width:auto!important; height:auto!important; margin:auto!important; padding:auto!important; background:none!important;} a{color:#333!important;} .cm_mainBar{padding:10px 2%!important} .cm_container{width:unset!important; float:none!important;} .cm_contentBar{float:left!important; width:75%!important;} .cm_sideBar{float:right!important;}  .cm_sideBar *{width:auto!important; list-style:none!important;}"
    };
    cm_main(); // 执行主函数
    function cm_main() {
        // 加载我的配置
        cm_loadMyConfig();
        cm_addHotKey();
        // 如果不启用脚本
        if (!cm_myConfig.is_active) {
            return;
        }
        cm_mainBar = $(document.createElement("div")).addClass("cm_mainBar");
        cm_otherBar = $(document.createElement("div")).addClass("cm_otherBar");
        cm_otherBar.append(cm_body.children());
        cm_body.prepend(cm_mainBar);
        cm_mainBar.after(cm_otherBar);
        cm_initSite();
        cm_mainBar.append(cm_showNavBar());
        cm_mainBar.append(cm_showTitleBar());
        cm_mainBar.append(cm_showContentRow());
        cm_mainBar.append(cm_showCommentBar());
        cm_setCss();
        cm_otherBar.hide();
    }
    // 属性配置函数
    function cm_loadMyConfig() {
        cm_myConfig = GM_getValue("myConfig");
        if (!cm_myConfig) cm_myConfig={};
        for(var key in cm_defaultConfig){
            if(cm_myConfig[key]==undefined){
                cm_myConfig[key] = cm_defaultConfig[key];
            }
        }
        GM_setValue("myConfig", cm_myConfig);
    }
    // 初始化网站
    function cm_initSite() {
        if (cm_siteHref.indexOf("www.cnblogs.com") >= 0) { // 博客园
            cm_initCnblogs();
        } else if (cm_siteHref.indexOf("blog.csdn.net") >= 0){ // csdn
            cm_initCsdn();
        } else if (cm_siteHref.indexOf("blog.sina.com.cn") >= 0) { // 新浪博客
            cm_initSinablog();
        } else if (cm_siteHref.indexOf("www.williamlong.info") >= 0) { // 月光博客
            cm_initWilliamlong();
        } else if (cm_siteHref.indexOf("www.jb51.net") >= 0) { // 脚本之家
            cm_initJb51();
        }
    }
    // 博客园
    function cm_initCnblogs() {
        cm_navBar = $("div#navigator");
        cm_clearPosition(cm_navBar);
        cm_titleBar = $(document.createElement("div"));
        cm_titleBar.prepend($("a#cb_post_title_url"));
        cm_contentBar = $("div#post_detail");
        cm_sideBar = $("div#blog-sidecolumn");
        cm_commentBar = $("div#comment_form");
        cm_siteCss = "#cb_post_title_url{font-size:20px!important; color:#336!important;} #topics{width:-moz-available;} .postBody{width:unset!important;} #post_detail .post{width:-moz-available;} textarea#tbCommentBody{height:100px!important;} .cm_navBar{background:none!important;} div#leftcontentcontainer{width: -moz-available;}";
    }
    // csdn
    function cm_initCsdn() {
        cm_navBar = $("div#csdn-toolbar");
        cm_titleBar = $(document.createElement("div"));
        cm_titleBar.prepend($("h1.title-article"));
        cm_contentBar = $("#article_content");
        cm_commentBar = $(".comment-box");
        cm_siteCss = ".csdn-toolbar{min-width:unset!important;} .container{width:unset!important;}"
    }
    // 新浪博客
    function cm_initSinablog() {
        cm_contentBar = $("#articlebody");
        $(".articalContent").css("width", "auto");
    }
    // 月光博客
    function cm_initWilliamlong() {
        cm_contentBar = $(".entry-content");
        cm_commentBar = $("#commentsbox");
    }
    // 脚本之家
    function cm_initJb51() {
        cm_navBar = $("div.nav_top");
        cm_titleBar = $("div.title");
        cm_contentBar= $("div#content");
        cm_siteCss = "#content{width:unset!important} .lbd{width:unset!important;}";
    }
    // 快捷键
    function cm_addHotKey() {
        $(document).keyup(function(e) {
            if (e.ctrlKey && e.shiftKey) {
                switch(e.keyCode) {
                    case 66:
                        // Ctrl+Shift+B启用或关闭侧边栏
                        cm_myConfig["showSideBar"] = !cm_myConfig["showSideBar"];
                        GM_setValue("myConfig", cm_myConfig);
                        cm_flushPage();
                        break;
                }
            } else if (e.ctrlKey) {
                switch(e.keyCode) {
                    case 13:
                        // Ctrl+Enter启用或关闭脚本
                        cm_myConfig["is_active"] = !cm_myConfig["is_active"];
                        GM_setValue("myConfig", cm_myConfig);
                        cm_flushPage();
                        break;
                }
            }
        });
    }
    // 显示导航栏
    function cm_showNavBar() {
        if (!cm_navBar) return;
        if (cm_myConfig.showTitleBar) {
            cm_navBar.addClass("cm_container cm_navBar")
            cm_clearFix(cm_navBar);
        }
        return cm_navBar;
    }
    // 显示标题栏
    function cm_showTitleBar() {
        if (!cm_titleBar) return;
        if (cm_myConfig.showTitleBar) {
            cm_titleBar.addClass("cm_container cm_titleBar")
            cm_clearFix(cm_titleBar);
        }
        return cm_titleBar;
    }
    function cm_showContentRow() {
        cm_contentRow = $(document.createElement("div")).addClass("cm_container");
        var row = $(document.createElement("div")).addClass("row cm_contentRow");
        row.append(cm_showContentBar());
        row.append(cm_showSideBar());
        cm_contentRow.append(row);
        return cm_contentRow;
    }
    // 显示内容栏
    function cm_showContentBar() {
        if (!cm_contentBar) return;
        cm_contentBar.addClass("cm_contentBar col-sm-12")
        cm_clearFix(cm_contentBar);
        cm_clearPosition(cm_contentBar);
        return cm_contentBar;
    }
    // 显示侧边栏
    function cm_showSideBar() {
        if (!cm_sideBar || !cm_myConfig.showSideBar) {
            cm_contentBar.removeClass("col-md-9");
            cm_contentBar.addClass("col-md-12");
            return null;
        }
        cm_sideBar.addClass("cm_sideBar col-md-3 hidden-sm");
        cm_contentBar.removeClass("col-md-12");
        cm_contentBar.addClass("col-md-9");
        cm_clearFix(cm_sideBar);
        cm_clearPosition(cm_sideBar);
        cm_clearBackground(cm_sideBar);
        return cm_sideBar;
    }
    // 显示评论栏
    function cm_showCommentBar() {
        if (!cm_commentBar) return null;
        if (cm_myConfig.showCommentBar) {
            cm_commentBar.addClass("cm_container cm_commentBar")
            cm_clearFix(cm_commentBar);
        }
        return cm_commentBar;
    }
    // 启用自定义css
    function cm_setCss() {
        var style1 = $(document.createElement("style"));
        style1.text(cm_myConfig.toolCss);
        cm_head.append(style1);
        var style2 = $(document.createElement("style"));
        style2.text(cm_myConfig.myCss);
        cm_head.append(style2);
        var style3 = $(document.createElement("style"));
        style3.text(cm_siteCss);
        cm_head.append(style3);
    }
    // 刷新页面
    function cm_flushPage() {
        window.location.reload();
    }
    // 清除容器浮动
    function cm_clearFix(bar) {
        var clearBar = $(document.createElement("div"));
        clearBar.css("clear", "both");
        bar.append(clearBar);
    }
    // 清除定位
    function cm_clearPosition(bar) {
        bar.css("position", "unset");
        bar.css("inset", "0");
    }
    // 清除背景
    function cm_clearBackground(bar) {
        bar.css("background", "none");
    }
})();