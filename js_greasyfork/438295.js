// ==UserScript==
// @name         WeRead
// @namespace    https://github.com/Ohhu
// @version      fix_1.1
// @description  More Easier!
// @author       中出zc
// @match        https://weread.qq.com/web/reader/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/438295/WeRead.user.js
// @updateURL https://update.greasyfork.org/scripts/438295/WeRead.meta.js
// ==/UserScript==

/* 字体 */
GM_addStyle("@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;700&display=swap')");

GM_addStyle("*{font-family: 'Noto Serif SC','方正宋三简体',FZS3JW,SourceHanSerifCN-Medium,Kaiti,STKaiti,FangSong, SimSun; !important;}");
//GM_addStyle("*{font-family: Kaiti,STKaiti,FangSong, SimSun; !important;}");

/* app_content */
GM_addStyle(".app_content{padding:0,100; !important;}");

/* 上一章按钮隐藏 */
GM_addStyle(".readerHeader.navBarOffset{visibility:hidden; !important;}");

/* 顶部工具栏 */
GM_addStyle(".readerTopBar{max-width:100%; font-family: SourceHanSerifCN-Bold !important;}");
/* 顶部工具栏 消除 */
//GM_addStyle(".readerTopBar{display:none; !important;}");

/* 书标题 */
GM_addStyle(".readerTopBar_title .readerTopBar_title_link{font-family: SourceHanSerifCN-Bold; !important; font-weight:bold !important;}");
/* 当前章节标题 */
GM_addStyle(".readerTopBar_title .readerTopBar_title_chapter{font-family: SourceHanSerifCN-Bold !important;}");
/* 去书架查看 */
GM_addStyle(".readerTopBar_actions .addShelfItem{font-family: SourceHanSerifCN-Bold !important;}");

/* 背影色 */
//GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerImage_opacity {background-color: rgba(249,243,232,100) !important;}");
GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerImage_opacity {background-color: rgba(234,234,239,100) !important;}");
GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerBackground_opacity{background-color: rgba(234,234,239,100) !important;}");
GM_addStyle(".wr_readerBackground_opacity, .wr_readerImage_opacity {opacity: 0.2 !important;}");
/* 配图不透明度 边框 */
GM_addStyle("img.wr_readerImage_opacity {opacity: 1.0 !important;border:5px solid #ccc; margin:5px; padding:5px;}");

//GM_addStyle(".wr_whiteTheme .readerContent .app_content{background-color: rgba(249,243,232,100) !important;}");
GM_addStyle(".wr_whiteTheme .readerContent .app_content{background-color: rgba(234,234,239,100) !important;}");

/* 字体色 */
GM_addStyle(".readerChapterContent{color: rgba(0,0,0,100) !important;}");
GM_addStyle(".readerChapterContent{font-weight: normal !important;}");

/* 笔记 */
GM_addStyle(".readerNotePanel .selectionListItem{border:5px solid  #f00; font-family: '方正聚珍新仿简体';!important;}");

/* 目录 */
GM_addStyle(".readerCatalog h2.readerCatalog_bookInfo_title .readerCatalog_bookInfo_title_txt{font-family: '方正聚珍新仿简体',SourceHanSerifCN-Bold !important;}");
GM_addStyle(".readerCatalog ul.readerCatalog_list li.chapterItem span.chapterItem_text{font-family: '方正聚珍新仿简体',SourceHanSerifCN-Light !important;}");
GM_addStyle(".readerCatalog ul.readerCatalog_list li.chapterItem_current{border:5px solid #ccc; font-family: '方正聚珍新仿简体',SourceHanSerifCN-Bold !important;}");
GM_addStyle(".readerCatalog ul.readerCatalog_list li.chapterItem_current span.chapterItem_text{font-family: '方正聚珍新仿简体',SourceHanSerifCN-Bold !important;}");

/* 下一页 */
GM_addStyle(".readerFooter .readerFooter_button {font-family: SourceHanSerifCN-Bold !important;}");

(function() {
    'use strict';

    /* 100% 宽度 */

    document.getElementsByClassName("app_content")[0].style.width="100%";
    document.getElementsByClassName("app_content")[0].style.maxWidth="100%";

    //document.getElementsByClassName("readerFooter")[0].style.display="none";

    /* 顶部工具条 想要让它左右各有 100 的 margin 或 padding 但总不成功*/
    //document.getElementsByClassName("readerTopbar")[0].style.width="100%";
    //document.getElementsByClassName("readerTopbar")[0].style.maxWidth="100%";

    /* 内容容器 */
    //document.getElementsByClassName("renderTargetContainer")[0].style.width="100%";
    //document.getElementsByClassName("renderTargetContainer")[0].style.maxWidth="100%";

    /* 内容 */
    //document.getElementsByClassName("renderTargetContent")[0].style.width="100%";
    //document.getElementsByClassName("renderTargetContent")[0].style.maxWidth="100%";

    var windowTop=0;
    $(window).scroll(function(){
        let scrollS = $(this).scrollTop();
        let selBtn = document.querySelector('.readerTopBar');
        let readerControl = document.querySelector(".readerControls");
        if(scrollS >= windowTop){
            // 上划显示
            selBtn.style.opacity = 0;
            readerControl.style.opacity = 0;
            windowTop = scrollS;
        }else{
            // 下滑隐藏
            selBtn.style.opacity = 1;
            readerControl.style.opacity = 1;
            windowTop=scrollS;
        }
    });
})();
