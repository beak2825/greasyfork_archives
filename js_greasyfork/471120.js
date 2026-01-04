// ==UserScript==
// @name         网页宽屏模式
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  修改网站为宽屏布局，更加美观，显示更多的内容。
// @author       shadow
// @match        *://juejin.cn/book/*
// @match        *://webpack.docschina.org/*
// @match        *://vuex.vuejs.org/*
// @match        *://cn.vuejs.org/*
// @match        *://blog.csdn.net/*
// @grant        none
// @icon         https://b-gold-cdn.xitu.io/favicons/v2/favicon-32x32.png
// @require      https://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/471120/%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%B1%8F%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/471120/%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%B1%8F%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(
        function(){

            // 适配网站：*://juejin.cn/book/*
            // 移除翻页按钮
            $(".step-btn.step-btn--prev").remove();
            $(".step-btn.step-btn--next").remove();
            // 移除标题
            $(".book-content__header").remove();
            $(".book-summary__header").remove();
            $(".book-summary__footer").remove();
            $(".book-body").css({"padding-top":"0px"});
            // 小册正文宽屏
            $(".section-page.book-section-view").css({"max-width":"100%"});
            // 小册评论宽屏
            $(".book-comments .container").css({"max-width":"100%"});


            // 适配网站：*://webpack.docschina.org/*
            // webpack文档宽屏阅读
//             $(".sponsors").remove();
//             $(".site__header").remove();
            $(".flex.items-center").css({"max-width":"100%"});
//             $(".md\:max-w-\[1024px\].md\:mx-auto.md\:grid").remove();
            $(".container.site__content").css({"max-width":"100%"});


            // 适配网站：*://vuex.vuejs.org/*
            $(".page .container").css({"max-width":"100%"});


            // 适配网站：*://cn.vuejs.org/*
            $(".VPNavBar .container").css({"max-width":"100%"});
            $(".VPSidebar").css({"width":"300px", "padding-left":"50px"});
            $(".VPContent").css({"max-width":"100%", "padding-left":"300px"});
            $(".VPContentDoc").css({"max-width":"100%", "padding-left":"50px"});
            $(".VPContentDoc .container").css({"max-width":"100%", "display":"flex", "flex-direction":"column"});
            $(".VPContentDoc .container .content").css({"max-width":"100%", "padding-right":"50px"});
            $(".VPContent .aside").remove();


            // 适配网站：*://blog.csdn.net/*
            $(".toolbar-advert").remove();
            $(".blog_container_aside").remove();
            $(".recommend-right_aside").remove();
            $(".csdn-side-toolbar").remove();
            $(".recommend-right.align-items-stretch.clearfix").remove();
            $(".main_father.clearfix.d-flex.justify-content-center").css({"max-width":"100%"});
            $(".container.clearfix").css({"width":"100%"});
            $(".nodata .container main").css({"width":"100%"});

        },2000);
})();