// ==UserScript==
// @name         CSDN 优化显示及解除复制限制
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除CSDN博客详细内容页面的弹框、广告及侧边栏, 优化显示效果; 去除不能复制内容的限制
// @author       laohoo
// @match        *://blog.csdn.net/*/article/details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ysfxla.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479841/CSDN%20%E4%BC%98%E5%8C%96%E6%98%BE%E7%A4%BA%E5%8F%8A%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/479841/CSDN%20%E4%BC%98%E5%8C%96%E6%98%BE%E7%A4%BA%E5%8F%8A%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Let us go.');
    let style = `<style>
        /* #content_views pre code { */
        * {
            -webkit-touch-callout: text !important;
            -webkit-user-select: text !important;
            -khtml-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }

        .recommend-right,
        .csdn-side-toolbar,
        .recommend-box,
        .recommend-nps-box,
        .blog_container_aside,
        .passport-login-mark,
        .passport-auto-tip-login-container,
        .passport-container,
        .passport-login-container,
        .passport-login-tip-container,
        #csdn-toolbar-write,
        .hljs-button.signin {
            display: none !important;
        }

        .article_content {
            height: auto !important
        }

        #mainBox {
            display: flex  !important;
            justify-content: center !important;
            width: 100% !important;
            padding: 10px !important;
        }

        main {
            width: 85% !important;
        }

        .container{
            margin: 0 !important;
        }

        .article_content {
            height: auto !important
        }
    </style>`;

    document.head.insertAdjacentHTML('beforeend', style);

    document.addEventListener('contextmenu', function(e){
        return e.stopPropagation()
    }, true);

    document.addEventListener('copy', function(e){
        return e.stopPropagation()
    }, true);

    document.addEventListener('selectstart', function(e){
        return e.stopPropagation()
    }, true);


    // Your code here...
})();