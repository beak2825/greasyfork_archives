// ==UserScript==
// @name         动态文章宽度调整按钮
// @namespace    http://tampermonkey.net/
// @version      2024年8月16日06点04分
// @description  动态文章宽度调整
// @author       onionycs
// @license      MIT
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @match        https://www.bilibili.com/opus/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503776/%E5%8A%A8%E6%80%81%E6%96%87%E7%AB%A0%E5%AE%BD%E5%BA%A6%E8%B0%83%E6%95%B4%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/503776/%E5%8A%A8%E6%80%81%E6%96%87%E7%AB%A0%E5%AE%BD%E5%BA%A6%E8%B0%83%E6%95%B4%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    var jquery = document.createElement('script');
    jquery.src = "https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js";//若调试页面是https的这里也修改为https.
    document.getElementsByTagName('head')[0].appendChild(jquery);
    */

    /* globals jQuery, $, waitForKeyElements */
    var docs= $('.opus-module-author');
    $('<button class="increase-width" style="margin-right: 100px">增加200px</button>').insertBefore(docs);
    $('<button class="decrease-width">减少200px</button>').insertBefore(docs);
    $('.increase-width').click(function() {
        addWidth('.opus-detail','width');
        addWidth('.right-sidebar-wrap','margin-left');
    });

    // 为减少宽度的按钮添加点击事件
    $('.decrease-width').click(function() {
        deWidth('.opus-detail','width');
        deWidth('.right-sidebar-wrap','margin-left');
    });
    // Your code here...

    function addWidth(className,prop){
        var width = parseInt($(className).first().css(prop), 10) || 0; // 获取当前宽度，如果无法获取则默认为0
        $(className).first().css(prop, width + 200 + 'px'); // 增加200px
    }
    function deWidth(className,prop){
        var width = parseInt($(className).first().css(prop), 10) || 0; // 获取当前宽度，如果无法获取则默认为0
        $(className).first().first().css(prop, Math.max(0, width - 200) + 'px'); // 减少200px，并确保宽度不会小于0
    }
})();