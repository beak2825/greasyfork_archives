// ==UserScript==
// @name         微信读书网页版修改字体、背景颜色
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  模仿移动端表现，书籍内容字体修改为苍耳今楷，修改标题等字体，更改背景颜色，更改字体颜色。
// @author       Li_Mixdown
// @match        https://weread.qq.com/web/reader/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/419954/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E4%BF%AE%E6%94%B9%E5%AD%97%E4%BD%93%E3%80%81%E8%83%8C%E6%99%AF%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/419954/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E4%BF%AE%E6%94%B9%E5%AD%97%E4%BD%93%E3%80%81%E8%83%8C%E6%99%AF%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

GM_addStyle("*{font-family: TsangerJinKai05 !important;}");
GM_addStyle(".readerTopBar{font-family: SourceHanSerifCN-Bold !important;}");
GM_addStyle(".bookInfo_title{font-family: SourceHanSerifCN-Bold !important;}");
GM_addStyle(".readerTopBar_title_link{font-family: SourceHanSerifCN-Bold; !important; font-weight:bold !important;}");
GM_addStyle(".readerTopBar_title_chapter{font-family: SourceHanSerifCN-Bold !important;}");
GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerImage_opacity {background-color: rgba(249,243,232,100) !important;}");
GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerBackground_opacity{background-color: rgba(249,243,232,100) !important;}");
GM_addStyle(".wr_readerBackground_opacity, .wr_readerImage_opacity {opacity: 0.2 !important;}");
GM_addStyle(".wr_whiteTheme .readerContent .app_content{background-color: rgba(249,243,232,100) !important;}");
GM_addStyle(".readerChapterContent{color: rgba(0,0,0,100) !important;}");
//GM_addStyle(".readerChapterContent{font-weight: bold !important;}");

(function() {
    'use strict';

    // Your code here...
})();