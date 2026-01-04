// ==UserScript==
// @name        “安娜的档案”外部下载列表自动展开
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  “安娜的档案”外部下载列表自动展开，免得每次都要点击。
// @author       kv2036
// @include      /^https?:\/\/[^\/]*\.annas-archive\.(li|se|org)\/md5\/.*$/
// @grant        none
// @icon         https://zh.annas-archive.gs/favicon-32x32.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499894/%E2%80%9C%E5%AE%89%E5%A8%9C%E7%9A%84%E6%A1%A3%E6%A1%88%E2%80%9D%E5%A4%96%E9%83%A8%E4%B8%8B%E8%BD%BD%E5%88%97%E8%A1%A8%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/499894/%E2%80%9C%E5%AE%89%E5%A8%9C%E7%9A%84%E6%A1%A3%E6%A1%88%E2%80%9D%E5%A4%96%E9%83%A8%E4%B8%8B%E8%BD%BD%E5%88%97%E8%A1%A8%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('已加载脚本');


    window.addEventListener('load', function() {
        // 使用选择器找到带有特定功能的按钮
        var targetLink = document.querySelector('a.js-show-external-button');

        // 检查元素是否存在
        if (targetLink) {

            targetLink.click();
            console.log('已经触发点击');
        } else {
            console.log('目标未找到');
        }

    });

})();
