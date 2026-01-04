// ==UserScript==
// @name         CSDN 阅读优化
// @namespace    https://starudream.cn
// @version      1.0.4
// @description  CSDN 阅读优化，关闭侧边栏和广告
// @author       StarUDream
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @grant        none
// @icon         https://csdnimg.cn/public/favicon.ico
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/378170/CSDN%20%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/378170/CSDN%20%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var $ = window.jQuery;

    // csdn
    $('aside').remove();
    $('.recommend-right').remove();
    $('.tool-box').remove();
    $('.recommend-box').remove();
    $('.csdn-toolbar').remove();
    $('.more-toolbox').remove();
    $('.template-box').remove();
    $('.hide-article-box').remove();
    $('.person-messagebox').remove();
    $('.login-box').css('display', 'none');
    $('.login-mark').css('display', 'none');
    $('body').css('cssText', 'background: none #f5f6f7;');
    $('main').css('cssText', 'width:100% !important;');
    $('#article_content').css('cssText', 'height: 100% !important;');
})();
