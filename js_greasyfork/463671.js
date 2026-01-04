// ==UserScript==
// @name         BetterWeRead
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改微信读书网页端样式，包括字体，全屏，隐藏标题、浮动菜单
// @author       insv
// @match        https://weread.qq.com/web/reader/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/463671/BetterWeRead.user.js
// @updateURL https://update.greasyfork.org/scripts/463671/BetterWeRead.meta.js
// ==/UserScript==
// 参考
// https://greasyfork.org/zh-CN/scripts/419954-%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E4%BF%AE%E6%94%B9%E5%AD%97%E4%BD%93-%E8%83%8C%E6%99%AF%E9%A2%9C%E8%89%B2
// https://greasyfork.org/zh-CN/scripts/462375-%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6

/* 字体 */
GM_addStyle("*{font-family: Microsoft YaHei UI,SourceHanSerifCN-Medium,Kaiti,STKaiti,FangSong, SimSun; !important;}");

/* app_content */
GM_addStyle(".app_content{padding:0,100; !important;}");

/* 顶部工具栏 */
GM_addStyle(".readerTopBar{max-width:100%; font-family: SourceHanSerifCN-Bold !important;}");
/* 书标题 */
GM_addStyle(".readerTopBar_title .readerTopBar_title_link{font-family: SourceHanSerifCN-Bold; !important; font-weight:bold !important;}");
/* 当前章节标题 */
GM_addStyle(".readerTopBar_title .readerTopBar_title_chapter{font-family: SourceHanSerifCN-Bold !important;}");
/* 去书架查看 */
GM_addStyle(".readerTopBar_actions .addShelfItem{font-family: SourceHanSerifCN-Bold !important;}");


/* 背影色 */
GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerImage_opacity {background-color: rgba(249,243,232,100) !important;}");
GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerBackground_opacity{background-color: rgba(249,243,232,100) !important;}");
GM_addStyle(".wr_readerBackground_opacity, .wr_readerImage_opacity {opacity: 0.2 !important;}");
/* 配图不透明度 边框 */
GM_addStyle("img.wr_readerImage_opacity {opacity: 1.0 !important;border:5px solid #ccc; margin:5px; padding:5px;}");

GM_addStyle(".wr_whiteTheme .readerContent .app_content{background-color: rgba(249,243,232,100) !important;}");
GM_addStyle(".readerChapterContent{color: rgba(94,64,40,100) !important;}");
GM_addStyle(".readerChapterContent{font-weight: normal !important;}");

/* 笔记 */
//GM_addStyle(".readerNotePanel .selectionListItem{border:5px solid  #f00; font-family: '方正盛世楷书简体';!important;}");

/* 目录 */
//GM_addStyle(".readerCatalog h2.readerCatalog_bookInfo_title .readerCatalog_bookInfo_title_txt{font-family: '方正聚珍新仿简体',SourceHanSerifCN-Bold !important;}");
//GM_addStyle(".readerCatalog ul.readerCatalog_list li.chapterItem span.chapterItem_text{font-family: '方正聚珍新仿简体',SourceHanSerifCN-Light !important;}");
//GM_addStyle(".readerCatalog ul.readerCatalog_list li.chapterItem_current{border:5px solid #ccc; font-family: '方正聚珍新仿简体',SourceHanSerifCN-Bold !important;}");
//GM_addStyle(".readerCatalog ul.readerCatalog_list li.chapterItem_current span.chapterItem_text{font-family: '方正聚珍新仿简体',SourceHanSerifCN-Bold !important;}");

/* 下一页 */
//GM_addStyle(".readerFooter .readerFooter_button {font-family: SourceHanSerifCN-Bold !important;}");

/* 右移控制栏 */
GM_addStyle(".readerControls{margin-left: calc(50% - 80px) !important;}");

(function() {
    'use strict';

    /* 100% 宽度 */
    document.getElementsByClassName("app_content")[0].style.width="100%";
    document.getElementsByClassName("app_content")[0].style.maxWidth="100%";

    //隐藏右侧滚动条，让全屏的时候更加有沉浸感
    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode("body::-webkit-scrollbar { width: 0px; height: 0px;}");
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
    //文本内容
    var app = document.getElementsByClassName("app_content")[0];
    app.style.maxWidth = "100%";
    //顶部导航栏
    var readerTopBar = document.getElementsByClassName("readerTopBar")[0];
    readerTopBar.style.maxWidth = "100%";
    //右侧浮动菜单
    var readerControls = document.getElementsByClassName("readerControls")[0];
    readerControls.style.opacity = '0';
    readerControls.addEventListener('mouseenter', function () {
        readerControls.style.opacity = '1';
    });
    readerControls.addEventListener('mouseleave', function () {
        readerControls.style.opacity = '0';
    });
    //隐藏下载按钮
    document.querySelector("#routerView > div.readerControls.readerControls > button.readerControls_item.download").style.display = 'none';
    //阅读时隐藏标题
    readerTopBar.style.opacity = '0';

    readerTopBar.addEventListener('mouseenter', function () {
        readerTopBar.style.opacity = '1';
    });
    readerTopBar.addEventListener('mouseleave', function () {
        readerTopBar.style.opacity = '0';
    });
    //目录靠边
    document.querySelector("#routerView > div:nth-child(5) > div.readerCatalog").style.left = 'unset';
    document.querySelector("#routerView > div:nth-child(5) > div.readerCatalog").style.right = '0';
    //笔记靠边
    document.querySelector("#routerView > div:nth-child(6) > div.readerNotePanel").style.left = 'unset';
    document.querySelector("#routerView > div:nth-child(6) > div.readerNotePanel").style.right = '0';
    
})();