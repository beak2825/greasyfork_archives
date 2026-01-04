// ==UserScript==
// @name         一键清除我的收藏中失效内容（仅限在收藏页面中已经加载出来的博文）
// @namespace    http://tampermonkey.net/
// @version      2024-09-05
// @description  仅限在收藏页面中已经加载出来的博文
// @author       You
// @match        https://weibo.com/u/page/fav/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506883/%E4%B8%80%E9%94%AE%E6%B8%85%E9%99%A4%E6%88%91%E7%9A%84%E6%94%B6%E8%97%8F%E4%B8%AD%E5%A4%B1%E6%95%88%E5%86%85%E5%AE%B9%EF%BC%88%E4%BB%85%E9%99%90%E5%9C%A8%E6%94%B6%E8%97%8F%E9%A1%B5%E9%9D%A2%E4%B8%AD%E5%B7%B2%E7%BB%8F%E5%8A%A0%E8%BD%BD%E5%87%BA%E6%9D%A5%E7%9A%84%E5%8D%9A%E6%96%87%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/506883/%E4%B8%80%E9%94%AE%E6%B8%85%E9%99%A4%E6%88%91%E7%9A%84%E6%94%B6%E8%97%8F%E4%B8%AD%E5%A4%B1%E6%95%88%E5%86%85%E5%AE%B9%EF%BC%88%E4%BB%85%E9%99%90%E5%9C%A8%E6%94%B6%E8%97%8F%E9%A1%B5%E9%9D%A2%E4%B8%AD%E5%B7%B2%E7%BB%8F%E5%8A%A0%E8%BD%BD%E5%87%BA%E6%9D%A5%E7%9A%84%E5%8D%9A%E6%96%87%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个按钮，并设置其样式
    var button = document.createElement('button');
    button.textContent = '一键清除失效内容（仅限已经加载出来的博文）';
    button.style.position = 'fixed';
    button.style.top = '69px';
    button.style.right = '10px';
    button.style.zIndex = 9999;

    button.addEventListener('click', function() {
        // 查找页面上所有的“取消收藏”
        var elements = document.getElementsByClassName('woo-panel-main woo-panel-top deletedToolbar_toolbarFull_1dOfW')

        // 遍历elements中的每个元素
        elements.forEach(function(element) {

            // 获取“取消收藏”按钮
            var span = element.querySelector('span');
            if (span) {
                span.click(); // 点击它
            }
        });
    });

    // 将按钮添加到页面上
    document.body.appendChild(button);
})();