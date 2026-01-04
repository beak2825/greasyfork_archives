// ==UserScript==
// @name         掘金界面宽屏布局
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  修改掘金文章页面布局，更加美观，显示更多的内容。
// @author       misterchou@qq.com
// @match        *://juejin.im/*
// @grant        none
// @icon        https://b-gold-cdn.xitu.io/favicons/v2/favicon-32x32.png
// @require      https://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/386796/%E6%8E%98%E9%87%91%E7%95%8C%E9%9D%A2%E5%AE%BD%E5%B1%8F%E5%B8%83%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/386796/%E6%8E%98%E9%87%91%E7%95%8C%E9%9D%A2%E5%AE%BD%E5%B1%8F%E5%B8%83%E5%B1%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    setTimeout(
        function(){
            // 删除左侧的分享按钮列表
            $(".article-suspended-panel.article-suspended-panel").remove();
            // 删除左侧广告“掘金小册”
            $(".index-book-collect").remove();
            $(".sidebar-bd-entry").remove();

            // 正文最大宽屏
//             $(".container.main-container").css({"max-width":"92%"});
//             $(".container.main-container").css({"margin-left":"6%"});
            // 文字宽度
            $(".main-area.article-area").css({"width":"95%"});

            // 右侧目录定位
            $(".sidebar.sidebar").css({"right":"-16%"});


            // 新掘金布局    margin: 0 2%;
            // https://juejin.im/entry/5a426dd3518825696f7e4374
            $(".container.main-container").css("max-width","83%");
            $(".container.main-container").css("margin","2%");
            $(".entry-public-main.shadow").css("max-width","82%");

            // 隐藏掘金下载app广告
            $(".sidebar-block.app-download-sidebar-block.shadow").remove();



        },1000);
})();