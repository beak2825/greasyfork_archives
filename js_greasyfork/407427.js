// ==UserScript==
// @name         掘金沉浸模式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  沉浸模式，避免干扰
// @author       lwnazg
// @match        *://juejin.im/*
// @grant        none
// @icon         https://b-gold-cdn.xitu.io/favicons/v2/favicon-32x32.png
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/407427/%E6%8E%98%E9%87%91%E6%B2%89%E6%B5%B8%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/407427/%E6%8E%98%E9%87%91%E6%B2%89%E6%B5%B8%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  setTimeout(function () {
    //删除头
    $("div.main-header-box").remove();

    // 删除左侧的分享按钮列表
    $(".article-suspended-panel.article-suspended-panel").remove();

    // 删除左侧广告“掘金小册”
    $(".index-book-collect").remove();
    $(".sidebar-bd-entry").remove();

    // 右侧目录删除
    $("div.sidebar.sidebar").remove();

    //反馈删除
    $("div.global-component-box").remove();

    // 正文最大宽屏
    // 文字宽度
    $(".main-area.article-area").css({ "width": "94%" });

    $(".container.main-container").css("max-width", "96%");
    $(".container.main-container").css("margin", "45px");

    // 隐藏掘金下载app广告
    $(".sidebar-block.app-download-sidebar-block.shadow").remove();
  }, 100);
})();