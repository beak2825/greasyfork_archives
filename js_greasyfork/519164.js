// ==UserScript==
// @name         隐藏微信公众号二维码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏微信公众号文章页面的二维码
// @author       Ethan-J
// @match        https://mp.weixin.qq.com/s*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519164/%E9%9A%90%E8%97%8F%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/519164/%E9%9A%90%E8%97%8F%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 方法1：直接添加display:none样式
    function hideQRCode() {
        const qrCode = document.querySelector('.qr_code_pc');
        if (qrCode) {
            qrCode.style.display = 'none';
        }
    }

    // 方法2：添加隐藏类
    function addCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .qr_code_pc {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        // 使用方法1或方法2都可以
        // hideQRCode();
        addCSS();
    });

    // 为了确保元素被隐藏，可以在DOMContentLoaded时也执行一次
    document.addEventListener('DOMContentLoaded', function() {
        // hideQRCode();
        addCSS();
    });
})();