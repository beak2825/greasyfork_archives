// ==UserScript==
// @name         隐藏123云盘广告并调整下载按钮位置
// @version      1.2
// @description  隐藏123云盘页面中的广告，并调整下载按钮的位置，提升用户体验。
// @author       ChatGPT
// @match        https://www.123pan.com/*
// @match        https://www.123pan.cn/*
// @match        https://www.123865.com/*
// @match        https://www.123684.com/*
// @run-at      document-start
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/489267/%E9%9A%90%E8%97%8F123%E4%BA%91%E7%9B%98%E5%B9%BF%E5%91%8A%E5%B9%B6%E8%B0%83%E6%95%B4%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE%E4%BD%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/489267/%E9%9A%90%E8%97%8F123%E4%BA%91%E7%9B%98%E5%B9%BF%E5%91%8A%E5%B9%B6%E8%B0%83%E6%95%B4%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE%E4%BD%8D%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个新的style元素
    var style = document.createElement('style');

    // 设置style元素的类型
    style.type = 'text/css';

    var css = `.appBottomBtn.banner-bottom {
     bottom: 0 !important; 
    }
    .ant-carousel,.banner-container-h5 {
     display: none !important; 
    }`;

    // 使用textContent属性向style元素中添加CSS文本
    style.textContent = css;

    // 将style元素添加到文档的head部分，使CSS规则生效
    document.head.appendChild(style);
})();
