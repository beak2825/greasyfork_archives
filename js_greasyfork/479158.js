// ==UserScript==
// @name         批改网 复制粘贴启用
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  批改网
// @author       MinkeSKL
// @match        *://*.pigai.org/*?c=v2*&a=write*
// @match        *://*.pigai.org/*?c=v2*&a=view*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479158/%E6%89%B9%E6%94%B9%E7%BD%91%20%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%90%AF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/479158/%E6%89%B9%E6%94%B9%E7%BD%91%20%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%90%AF%E7%94%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 等待页面完全加载后执行
    window.onload = function() {
        // 设置document.onpaste属性
        document.onpaste = 1;
        console.log('document.onpaste is set to 1');
    };
})();
