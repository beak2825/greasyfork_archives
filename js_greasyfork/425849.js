// ==UserScript==
// @name         微信读书舒适版
// @version      0.3.2
// @namespace    http://tampermonkey.net/
// @description  修改微信读书web版的背景颜色和宽度，使之更适合浏览器阅读，尤其是竖版显示器阅读。
// @contributor  Li_MIxdown;hubzy;xvusrmqj;LossJ;JackieZheng;das2m;harmonyLife
// @author       G.Stone
// @match        https://weread.qq.com/web/reader/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @require      http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @icon         https://weread.qq.com/favicon.ico
// @grant        GM_log
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/425849/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E8%88%92%E9%80%82%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/425849/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E8%88%92%E9%80%82%E7%89%88.meta.js
// ==/UserScript==

GM_addStyle("*{font-family: STSONG !important;}");
GM_addStyle(".readerTopBar{font-family: SourceHanSerifCN-Bold !important;}");
GM_addStyle(".bookInfo_title{font-family: SourceHanSerifCN-Bold !important;}");
GM_addStyle(".readerTopBar_title_link{font-family: SourceHanSerifCN-Bold; !important; font-weight:bold !important;}");
GM_addStyle(".readerTopBar_title_chapter{font-family: SourceHanSerifCN-Bold !important;}");
GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerImage_opacity {background-color: rgba(199,237,204,1) !important;}");
GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerBackground_opacity{background-color: rgba199,237,204,1) !important;}");
GM_addStyle(".wr_whiteTheme .readerContent .app_content{background-color: rgba(199,237,204,1) !important;}");
GM_addStyle(".wr_whiteTheme .renderTargetContainer .app_content{max-width: 85%; !important;}");
GM_addStyle(".wr_whiteTheme {background-color: rgba(240,255,240,1) !important;}");


GM_addStyle(".wr_whiteTheme .readerTopBar {background-color: rgba(60,179,113,1) !important;}");
GM_addStyle(".wr_whiteTheme .readerFooter_button {background-color: #b4e08f;}!important;}");
GM_addStyle(".readerTopBar_title {height: 27px;}!important;}");
GM_addStyle(".readerTopBar {background-color: #3cb371;} !important;}");
GM_addStyle(".readerChapterContent{color: rgba(0,0,0,100) !important;}");
GM_addStyle(".readerControls{margin-bottom: -28px !important;}");