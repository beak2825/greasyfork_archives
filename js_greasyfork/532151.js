// ==UserScript==
// @name         懂球帝早报增加链接
// @namespace    http://tampermonkey.net/
// @version      20250506
// @description  懂球帝早报网页版增加每条新闻的链接
// @author       You
// @match        *://www.dongqiudi.com/articles/*
// @license   MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dongqiudi.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532151/%E6%87%82%E7%90%83%E5%B8%9D%E6%97%A9%E6%8A%A5%E5%A2%9E%E5%8A%A0%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/532151/%E6%87%82%E7%90%83%E5%B8%9D%E6%97%A9%E6%8A%A5%E5%A2%9E%E5%8A%A0%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentUrl = window.location.href;
    var pattern = /^https?:\/\/www\.dongqiudi\.com\/(articles)\/.*/
    if (pattern.test(currentUrl)) {
        // 获取页面中所有的 a 标签
        const aTags = document.getElementsByTagName('a');

        // 遍历所有 a 标签
        for (let i = 0; i < aTags.length; i++) {
            const aTag = aTags[i];
            // 获取当前 a 标签的 href 属性值
            const originalHref = aTag.href;
            if(originalHref.includes('dongqiudi://')){
                // 将 href 属性中的 dongqiudi:// 替换为 https://www.dongqiudi.com
            const newHref = originalHref.replace('dongqiudi://', 'https://www.dongqiudi.com');
            // 更新 a 标签的 href 属性
            aTag.href = newHref;
            // 增加下划线
            aTag.style.textDecoration = 'underline';
            // 增加颜色
            aTag.style.color = 'green';
            }
        }
    }
})();