// ==UserScript==
// @name         通义千问去除输入字数限制
// @name:zh-CN   通义千问去除输入字数限制
// @description  解除通义千问输入字数限制，使用 ChatGPT 编写
// @description:zh-CN  解除通义千问输入字数限制，使用 ChatGPT 编写
// @author       TC999
// @match        https://tongyi.aliyun.com/*
// @icon         https://img.alicdn.com/imgextra/i4/O1CN01FOwagl1XBpyVA2QVy_!!6000000002886-2-tps-512-512.png
// @grant        none
// @license      GPL-v3
// @version      1.0.3
// @namespace https://greasyfork.org/users/1091752
// @downloadURL https://update.greasyfork.org/scripts/500168/%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E5%8E%BB%E9%99%A4%E8%BE%93%E5%85%A5%E5%AD%97%E6%95%B0%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/500168/%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E5%8E%BB%E9%99%A4%E8%BE%93%E5%85%A5%E5%AD%97%E6%95%B0%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elements = document.querySelectorAll('textarea.ant-input.css-1r287do.ant-input-outlined');
    elements.forEach(function(element) {
        element.setAttribute('maxlength', 100000); // 输入最大值，官方默认值为 10000
    });
})();