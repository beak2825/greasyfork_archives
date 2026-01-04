// ==UserScript==
// @name         微信读书Calibre配色
// @version      0.0.3
// @namespace    http://tampermonkey.net
// @description  适用于微信读书web版浅色主题，阅读页面采用Calibre默认配色，选书界面沿用微信默认原深色主题
// @author       Siman
// @match        https://weread.qq.com/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @icon         https://weread.qq.com/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/492229/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6Calibre%E9%85%8D%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/492229/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6Calibre%E9%85%8D%E8%89%B2.meta.js
// ==/UserScript==

/* global $ */
(function() {
    'use strict';

    /**加载前预修改**/
    //浅色模式下还原黑色主题下的默认背景色
    if (window.location.href.startsWith('https://weread.qq.com/web/bookDetail/')) {
        GM_addStyle("html, body {background-color: #262628 !important;}");
        GM_addStyle(".navBar, .wr_whiteTheme .readerContent .app_content {background-color: #1c1c1d !important;}");
    }
    else if (window.location.href.replace(/\/$/, "") === ('https://weread.qq.com/web/self')) {
        GM_addStyle("html body.wr_whiteTheme {background-color: #262628 !important;}");
    }
    else if (window.location.href.replace(/\/$/, "") === ('https://weread.qq.com')) {
        GM_addStyle("html, body {background-color: #000 !important;}");
        GM_addStyle(".navBar, .navBar_home {background-color: #111213 !important;}");
        GM_addStyle(".bookshelf_preview_item, .recommend_preview_item {background-color: #1c1c1d !important;}");
    }
    //浅色模式下的阅读页配色
    else if (window.location.href.startsWith('https://weread.qq.com/web/reader/')) {
        applyReadingPageStyles();
    }

    document.documentElement.style.visibility = 'hidden';
    // 页面主要内容加载完成后应用样式
    $(document).ready(function() {
        if (window.location.href.startsWith('https://weread.qq.com/web/reader/')) {
            applyReadingPageStyles();
        } else {
            $('body').removeClass('wr_whiteTheme');
        }
        document.documentElement.style.visibility = 'visible';
    });

    // 定义阅读页样式修改的函数
    function applyReadingPageStyles() {
        /**浅色主题**/
        //背景底色
        GM_addStyle(".wr_whiteTheme {background-color: rgba(38, 38, 40,1) !important;}");
        //阅读区背景色
        GM_addStyle(".wr_whiteTheme .readerContent .app_content{background-color: rgba(246, 243, 233,1) !important;}");
        GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerImage_opacity {background-color: rgba(246, 243, 233,1) !important;}");
        GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerBackground_opacity{background-color: rgba(246, 243, 233,1) !important;}");
        //目录弹窗背景色
        GM_addStyle(".wr_whiteTheme .readerCatalog{background-color: rgba(246, 243, 233,1) !important;}");
        //笔记弹窗背景色
        GM_addStyle(".wr_whiteTheme .readerNotePanel{background-color: rgba(246, 243, 233,1) !important;}");
        //右下角功能按钮背景色
        GM_addStyle(".wr_whiteTheme .readerControls_fontSize, .wr_whiteTheme .readerControls_item{background-color: rgba(246, 243, 233,1) !important;}");
        //标题和页尾下一章按钮背景色
        GM_addStyle(".wr_whiteTheme .readerTopBar {background-color: rgba(233, 214, 173,1) !important;}");
        GM_addStyle(".wr_whiteTheme .readerFooter_button {background-color: rgba(233, 214, 173,1)}!important;}");
        GM_addStyle(".wr_whiteTheme .readerFooter_button:hover {background-color: rgba(222, 204, 165,1)}!important;}");

        /**深色主题**/
        GM_addStyle(".readerTopBar {background-color: #3cb371;} !important;}");
        GM_addStyle(".readerChapterContent{color: rgba(0,0,0,100) !important;}");
    }

})();
