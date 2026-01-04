
// ==UserScript==
// @name         WEIBO排版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  WEIBO重排版
// @author       foolmos
// @match        https://weibo.com/*
// @match        https://s.weibo.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469074/WEIBO%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/469074/WEIBO%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==
 
GM_addStyle(".WB_main_r, .WB_frame_b, .fold_cont.clearfix, .fold_bg, .webim_fold.webim_fold_v2.clearfix {display:none !important;}");
GM_addStyle(".WB_main_c, .WB_frame_c, .main-full {width:850px !important;}");
GM_addStyle(".WB_main_c, .WB_frame_c, .main-full {width:850px !important;}");
GM_addStyle(".WB_frame, .WB_frame_c, .woo-box-flex.woo-box-column.Frame_wrap_3g67Q, .main-full {margin-left:10% !important;}");
GM_addStyle(".Main_full_1dfQX {width:800px !important;}");
GM_addStyle(".woo-box-flex.woo-box-column.Frame_wrap_3g67Q {margin-left:8% !important;}");
GM_addStyle(".woo-box-flex {line-height:1.7em !important;}");
GM_addStyle("body , .f-art {background-color: transparent !important; /* color: #b5b2b2 !important; */ }");
GM_addStyle(".Nav_wrap_gHB1a, .Bar_main_R1N5v.Bar_card_3Jk5b {position:relative !important;}");
GM_addStyle(".detail_wbtext_4CRf9 {line-height:1.8 !important;}");


(function() {
    'use strict';
 
    // Your code here...
})();