

    // ==UserScript==
    // @name         贴吧列表页面的宽度
    // @version      1.0
    // @author       amer0798
    // @icon         https://tieba.baidu.com/favicon.ico
    // @description  贴吧列表页面的宽度以适合宽屏显示
    // @match        *://tieba.baidu.com/f?*
    // @match        *://tieba.baidu.com/p*
    // @grant        GM_log
    // @grant        GM_getResourceText
    // @grant        GM_addStyle
    // @grant        none
    // @namespace https://greasyfork.org/users/740997
// @downloadURL https://update.greasyfork.org/scripts/458935/%E8%B4%B4%E5%90%A7%E5%88%97%E8%A1%A8%E9%A1%B5%E9%9D%A2%E7%9A%84%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/458935/%E8%B4%B4%E5%90%A7%E5%88%97%E8%A1%A8%E9%A1%B5%E9%9D%A2%E7%9A%84%E5%AE%BD%E5%BA%A6.meta.js
    // ==/UserScript==
     
    (function() {
        'use strict';
        var css = `
            .head_main .head_middle,
            .head_main .head_content,
            .content,
            .foot,
            .frs_content_footer_pagelet,
            .l_container,
            .pb_content,
            .thread_theme_5,
            .nav_wrap_add_border,
            .topic-wrapper {
                width:1550px;
            }
            .tbui_aside_float_bar {
                margin-left: 790px;
            }
            .forum_content .main,
            .left_section {
                width: 1360px;
            }
            .card_banner,
            .forum_recommend {
                display: none;
            }
            .forum_content,
            .pb_content {
                background-image: none;
            }
            #thread_list,
            .left_section,
            #frs_good_nav {
                border-right:1px solid #dedede;
            }
            .thread_top_list>li {
                border-bottom: 1px dotted #e4e6eb;
            }
            .core_title_wrap,
            .l_post {
                width: 1358px;
            }
            .l_post {
                background: none;
            }
            .l_post .d_post_content_main {
                width: 1203px;
            }
            .l_post .core_reply_wrapper {
                width: 1188px;
            }
            .pb_footer,
            .left_section {
                width: 1359px;
            }
            .topic-body .main {
                width: 1359px;
            }
            #post-chandelier {
                width: 1319px;
            }
     
            #j_core_title_wrap{
                width: 1359px;
            }
     
            #thread_theme_7{
                width: 1359px;
            }
         
            `;
        var style=document.createElement("style");
        style.innerText=css;
        document.getElementsByTagName('head')[0].appendChild(style);
    })();

