// ==UserScript==
// @name         微信读书网页版字体和阅读样式修改
// @version      0.1
// @license MIT
// @namespace    http://tampermonkey.net/
// @description  强制修改微信读书网页版字体和页面背景色
// @contributor  Li_MIxdown;hubzy;xvusrmqj;LossJ;JackieZheng;das2m;harmonyLife
// @author       Kaka+ChatGPT
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
// @downloadURL https://update.greasyfork.org/scripts/497925/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E5%AD%97%E4%BD%93%E5%92%8C%E9%98%85%E8%AF%BB%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/497925/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E5%AD%97%E4%BD%93%E5%92%8C%E9%98%85%E8%AF%BB%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==


(function () {


    'use strict';
    GM_addStyle("*{font-family:FZYOUSS_508R--GB1-0!important;}");
    GM_addStyle(".readerTopBar{font-family: FZYOUSS_508R--GB1-0!important;}");
    GM_addStyle(".bookInfo_title{font-family: FZYOUSS_508R--GB1-0!important;}");
    GM_addStyle(".readerTopBar_title_link{font-family: FZYOUSS_508R--GB1-0;!important; }");
    GM_addStyle(".readerTopBar_title_chapter{font-family: FZYOUSS_508R--GB1-0!important;}");
    //GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerImage_opacity {background-color: #E2EADC  !important;}");
    //GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerBackground_opacity{background-color: #E2EADC  !important;}");
    //GM_addStyle(".wr_whiteTheme .readerContent .app_content{background-color:#E2EADC  !important;}");
    //GM_addStyle(".wr_whiteTheme .renderTargetContainer .app_content{max-width: 85%; !important;}");
    //GM_addStyle(".wr_whiteTheme {background-color: #d6e0d1  !important;}");
    //GM_addStyle(".wr_whiteTheme .readerTopBar {background-color:#E1EAE1!important;}");
    //GM_addStyle(".wr_whiteTheme .readerFooter_button {background-color: #E2EADC  ! important;}");
    GM_addStyle(".wr_whiteTheme .readerFooter_button {height:60px ;width:100px ;    border-style:solid;border-width:2px;}!important;}");
    GM_addStyle(".readerTopBar {height: 60px ;}!important;}");
})();