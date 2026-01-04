// ==UserScript==
// @name         Prevent Zoom on Focus
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Prevents zoom on focus for input fields on mobile devices
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516187/Prevent%20Zoom%20on%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/516187/Prevent%20Zoom%20on%20Focus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个<style>元素以包含CSS规则
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        /* 防止输入框在移动设备上聚焦时自动放大 */
        @media only screen and (min-device-width: 320px) and (max-device-width: 1024px) {
            select:focus,
            textarea:focus,
            input:focus {
                font-size: 16px !important;
            }
        }
    `;

    // 将<style>元素插入到页面<head>中
    document.head.appendChild(style);
})();
