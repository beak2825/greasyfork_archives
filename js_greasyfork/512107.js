// ==UserScript==
// @name         dark mode-bilibili
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  b站黑暗模式
// @license MIT
// @author       Ooooh
// @match        https://*.bilibili.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/512107/dark%20mode-bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/512107/dark%20mode-bilibili.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let cssContent = `
 @charset "UTF-8"; 
 
 html, body {
    background-color: #414343 !important;
 }
 .bpx-player-progress-schedule-current {
    background-color: #2DA2CC !important;
}
:root {
    --Ga0: #47494A !important;
    --Ga9: #DFDCD6 !important;
    --bg1_rgb: #A9A9A9 !important;
    --Wh0_rgb: #A9A9A9 !important;
    --Lb1: #444647 !important;
    --Ga3: #595C5E !important;
    --Ga1:#47494A !important;
    --Lb6: #64D6FF !important;
    --brand_blue: #4ED4FF !important;
    --operate_orange: #66472D !important;
    --bg1: #414343 !important;
    --bg2: #444647 !important;
    --bg3: #4b4b4b !important;
    --bg1_float: #414343 !important;
    --bg2_float: #6598a0 !important;
    --bg3_float: #7d8765 !important;
    --graph_bg_regular_float: #47494A !important;
    --text1: #EDE9E0 !important;
    --text2: #C4BDB2 !important;
    --text3: #aca9a2 !important;
    --line_light: #595C5E !important;
    --line_regular: #595C5E !important;
    --graph_bg_bright: #00f8bc !important;
    --graph_bg_thin: #454748 !important;
    --graph_bg_regular: #464849 !important;
    --graph_bg_thick: #4F5153 !important;
}
.article-up-info, .article-container, .side-toolbar, .to-top, .fixed-top-header{
    background: #414343 !important;
}
.read-article-holder, .title-container .title, .fixed-top-header .inner>p , .fixed-top-header .inner .up-info{
    color: #DFDCD6 !important;
}

.iconfont, .toolbar-item{
    color: #989393 !important;
}

.comment-wrapper .comment-m ,.prehold-nav{
    background: #414343 !important;
}


.link-navbar .nav-item, .link-navbar a, .link-navbar .main-ctnr .nav-logo{
    color: #DFDCD6 !important;
}

#nav-searchform{
    background: #414343 !important;
    border: 1px solid #616161 !important;
}
`
     GM_addStyle(cssContent);
})();