// ==UserScript==
// @name         微信读书网页版使用谷歌思源宋体
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  书籍内容字体修改为谷歌思源宋体，修改标题等字体，更改背景颜色，更改字体颜色。
// @author       Ryan
// @match        https://weread.qq.com/web/reader/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/428161/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E4%BD%BF%E7%94%A8%E8%B0%B7%E6%AD%8C%E6%80%9D%E6%BA%90%E5%AE%8B%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/428161/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E4%BD%BF%E7%94%A8%E8%B0%B7%E6%AD%8C%E6%80%9D%E6%BA%90%E5%AE%8B%E4%BD%93.meta.js
// ==/UserScript==
//GM_addStyle("@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;700&display=swap');")
GM_addStyle("@import url('https://fonts.loli.net/css2?family=Noto+Serif+SC:wght@500;700&display=swap');")
GM_addStyle("*{font-family: 'Noto Serif SC' !important;}");
GM_addStyle(":not(.wr_whiteTheme) *{color: rgba(49,243,49,100) !important;}");
GM_addStyle(".wr_whiteTheme *{color: rgba(49,49,49,100) !important;}");
GM_addStyle(".readerTopBar{font-family: 'Noto Serif SC' !important;}");
GM_addStyle(".bookInfo_title{font-family: 'Noto Serif SC' !important;}");
GM_addStyle(".readerTopBar_title_link{font-family: 'Noto Serif SC'; !important; font-weight:bold !important;}");
GM_addStyle(".readerTopBar_title_chapter{font-family: 'Noto Serif SC' !important;}");
GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerImage_opacity {background-color: rgba(249,243,232,100) !important;}");
GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerBackground_opacity{background-color: rgba(249,243,232,100) !important;}");
GM_addStyle(".wr_readerBackground_opacity, .wr_readerImage_opacity {opacity: 0.2 !important;}");
GM_addStyle(".wr_whiteTheme .readerContent .app_content{background-color: rgba(249,243,232,100) !important;}");
GM_addStyle(".readerChapterContent{font-family: 'Noto Serif SC' !important;color: rgba(0,0,0,100) !important;}");
// GM_addStyle(".readerChapterContent{font-weight: bold !important;}");

(function() {
    'use strict';

    // Your code here...
})();