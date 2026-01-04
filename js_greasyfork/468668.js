// ==UserScript==
// @name         美师优课优化
// @namespace    msykmhbyccd
// @version      1.1
// @description  美师优课排版美化+黑暗模式+自动跳转www
// @author       CreamyCandy
// @homepage  https://github.com/creamycd/WebPlayground/tree/main/msyk
// @supportURL  mailto:CreamyCandy@frontiers.ac
// @match        https://*.msyk.cn/*
// @match        http://msyk.cn/*
// @match        https://msyk.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=msyk.cn
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license     GPL-3.0-or-later
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/468668/%E7%BE%8E%E5%B8%88%E4%BC%98%E8%AF%BE%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/468668/%E7%BE%8E%E5%B8%88%E4%BC%98%E8%AF%BE%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 重定向无www至有www
    if (window.location.href.indexOf("http://msyk.cn") == 0 || window.location.href.indexOf("https://msyk.cn") == 0) {
        window.location.href = "https://www.msyk.cn" + window.location.pathname + window.location.search;
    }


    // Load Darkmode.js from CDN, Darkmode,js is shared under MIT licence. See https://github.com/sandoche/Darkmode.js
    var dmScript = document.createElement('script');
    dmScript.src = 'https://cdn.jsdelivr.net/npm/darkmode-js@1.5.7/lib/darkmode-js.min.js';
    document.head.appendChild(dmScript);
    // Wait for the script to load
    dmScript.onload = function() {
        // Create a new Darkmode instance with some options
        var options = {
            bottom: '32px',
            right: '32px',
            mixColor: '#fff',
            backgroundColor: '#fff',
            buttonColorDark: '#100f2c',
            buttonColorLight: '#fff',
            saveInCookies: true,
            label: '🌓',
            autoMatchOsTheme: true
        };
        var darkmode = new Darkmode(options);
        // Show the widget
        darkmode.showWidget();
    };
    // Create a style element
    var style = document.createElement('style');
    // Add your custom CSS code here
    style.textContent = `
/* Mainpage */

div.topbar, div.bimg, div.introduce-box, div.tl-footer, ul.tl-header-nav, #js-ewm, .header-g-line{
    display: none;
}

ul.tl-header-nav.tl-header-nav-login {
    display: block;
    position: fixed;
    top: 45%;
    left: 45%;
    font-size: 2em;
    margin: 0;
    border: #00aaff solid 0.1em;
    background: rgba(0,0,0,0);
    padding: 0.65em 00.5em 0.65em 0.5em;

}
ul.tl-header-nav.tl-header-nav-login>li>a {
    color: #00aaff;
    font-size: 1em !important;
}
.logo-2 {
    position: fixed;
    top: 30%;
    left: 43%;
}

.link-login-btn {
    position: fixed;
    top: 45%;
    left: 46%;
    width: 5em;
    font-size: 2em;
    height: 2.5em;
    padding: 0.65em 0.5em 0.65em 0.5em;
    margin: 0;
    border: #00aaff solid 0.1em;
    background: rgba(0,0,0,0);
    color: #00aaff;
}

.link-login-btn:hover {
    border: none;
    padding: 0.75em 0 0.75em 0;
}

/* Login Page */

.login-container {
    background: none !important;
    padding-left: 0;
}

#footer {
    display: none;
}

.header-inner .logo {
    height: 48px;
    line-height: 48px;
    font: 600 32px "Noto Sans SC";
    color: #fff;
}

/* Global Styles (Font+width)*/
* {
    font-family: "Noto Sans SC" !important;
}

div.main-content {
    margin-left: 0 !important;
    min-width: 950px !important;
}

html {
    min-width: 300px !important;
}

.col-m-6 {
    min-width: 30em;
}
.widget-main.clearfix>.pull-right {
    display: none;
}


/* Global Userpage */
/* Navbar */
#navbar{
    background: white;
    border-bottom: grey solid 0.5px;
    position: fixed;
}

a.navbar-brand{
    color: #49B949;
    font-weight: 600 !important;
    font-size: 2.21em !important;
    padding-left: 0;
}

a.navbar-brand:hover{
    color: #49B949;
}

.dropdown-modal, dropdown-toggle, .nav-user-photo, .user-info, .fa-caret-down, .tl_errorq_bg {
    display: none;
}

/* List of Homework&Classes */
.padding-20 {
    background: none !important;
    border: grey solid 1px;
}

.tl-item-data, button.btn-green, .icon-question-grey, .widget-body.padding-20>.widget-main.clearfix>.tl-paper-op>.btn-orange {
    display: none;
}

.widget-main.clearfix>.pull-left {
    float:right !important
}

.teacher-expediting-tip {
    border: #FF7400 solid 0.75px;
    background: none;
}

div.widget-body.padding-20 {
    z-index: 1 !important;
}

.ellipsis {
    line-height: 40px;
    height: 40px;
    padding: 0;
}

/*Sidebar*/

#sidebar {
    z-index: 114514 !important;
    background: rgba(0,0,0,0);
    width: 0 !important;
}

span.menu-text, span.corner-marker-only {
    display: none !important;
}

i.menu-icon {
    margin: 0;
    padding: 0;
}

.skin-stu .nav-list>li:before {
    display: none !important;
}

.skin-stu .nav-list>li.active>a,
.skin-stu .nav-list>li.active:hover>a,
.skin-stu .nav-list>li.active>a:focus {
    color: #48b750;
    background: rgba(0,0,0,0) !important;
}

.nav-list>li>a {
    font-size: 16px;
    padding: 0;
}

.skin-stu .nav-list>li>a:hover,
.skin-stu .nav-list>li>a:focus {
    color: #48b750;
    background: rgba(0,0,0,0) !important;
}

#studentPersonal, #myHomework, #myWrongQuestion, #myliveCourse, .fa-icon-news, .fa-icon-xquan, #liveCourse, #courseHistory{
    position: fixed !important;
    z-index: 114514 !important;
    top:13px !important;
}

#studentPersonal {
    right: 240px;
}

#myHomework {
    right: 200px;
}

#myWrongQuestion {
    right: 160px;
}

.fa-icon-news, #myInformation {
    right: 120px;
}

.fa-icon-xquan {
    right: 80px;
}

#liveCourse, #myliveCourse {
    right: 40px !important;
}

#courseHistory {
    right: 0px;
}

/* Homework page selector*/

.scroll-more {
    width: 100%;
    left: 0;
    padding: 20px 43px
}

#subject-select {
    z-index: 114514;
}

/* Notifications */
.tl-nav-tab-wrap.tl-nav-tabs-fixed.clearfix {
    left: 0;
}

/* Question Center */
#learning>#question-plaza>a, #project-learning>a, #project-typicalCase>a {
    padding-left: 5px
}

/* History Class */
#searchArea>a.pull-left.btn.link-btn.col-green {
    display: none;
}

h4.cursor_p.clearfix.no-margin-top, div.tl-paper-title.clearfix.no-border-right.no-margin-left, .tl-paper-title.clearfix.no-border-right.no-margin-left>.cursor_p.clearfix.no-margin-top>a.live-tit.ellipsis.pull-left {
    height: 25px;
}

    .darkmode-layer, .darkmode-toggle {
         z-index: 1145141919810;
    }
    .darkmode-toggle {
         width: 40px !important;
         height: 40px !important;
         font-size: 20px;
    }

`;
    // Append the style element to the document head
    document.head.appendChild(style);

})();