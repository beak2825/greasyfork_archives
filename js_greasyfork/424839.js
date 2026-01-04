// ==UserScript==
// @name         掘金文章布局调整插件
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  掘金文章布局调整
// @author       Denis Ding
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @match        https://juejin.cn/post/*
// @grant        none
// @note         21-04-11 1.0 去广告
// @note         21-09-24 1.1 调整目录及主体内容宽度，添加目录滚动

// @downloadURL https://update.greasyfork.org/scripts/424839/%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/424839/%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //广告去除
    $('head').append("<style>.sidebar-block.app-download-sidebar-block,.sidebar-block.wechat-sidebar-block{display: none;}</style>");

    //布局调整
    $('head').append("<style>.main-header .container{ max-width: calc(100% - 390px) !important; margin: 0px 50px 0px 340px !important; }</style>");
    $('head').append("<style>.container.main-container{ max-width: calc(100% - 700px) !important; margin: 0px 360px 0px 340px !important; }</style>");
    $('head').append("<style>.container.main-container .main-area.article-area{ width: auto !important; }</style>");

    //个人信息等无关block
    $('head').append("<style>.container.main-container .sidebar.sidebar{ right: -21rem !important; }</style>");

    //目录结构
    $('head').append("<style>.container.main-container .sidebar .sticky-block-box{ position: fixed !important; top: 7rem !important; right: auto !important; left: 20px !important; width: 300px !important; overflow: hidden !important; }</style>");
    $('head').append("<style>.container.main-container .article-suspended-panel{ top: 7rem; right: 1rem; }</style>");
    $('head').append("<style>.container.main-container .sidebar .sticky-block-box .article-catalog .catalog-body{ height: calc(100% - 140px); position: fixed; width: 320px; overflow: hidden; overflow-y: auto; }</style>");
    $('head').append("<style>.container.main-container .sidebar .sticky-block-box .article-catalog .catalog-body::-webkit-scrollbar { display: none; }</style>");

    //点赞评论分享按钮
    $('head').append("<style>.suspension-panel.suspension-panel{ right: 3rem !important; }</style>");
    $('head').append("<style>.container.main-container .article-suspended-panel{ right: 3rem !important; }</style>");

    //置顶按钮
    $('head').append("<style>.suspension-panel.suspension-panel .btn{ width: 3rem !important; height: 3rem !important; }</style>");
})();