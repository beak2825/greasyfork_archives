// ==UserScript==
// @name         Disable close current page
// @namespace    http://tampermonkey.net/
// @version      2024-10-18
// @description  disable close current page when open devtools.
// @author       You
// @license MIT
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rawchat.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513281/Disable%20close%20current%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/513281/Disable%20close%20current%20page.meta.js
// ==/UserScript==

(function() {

        // 保存原始的 window.close 方法
        window.close.originalClose = window.close;

        // 重写 window.close 方法
        window.close = function() {
            // 在关闭之前执行的调试代码
            console.log('window.close 被调用，准备关闭窗口。');
            debugger; // 触发调试器

            // 调用原始的 window.close 方法
            window.close.originalClose();
        };
    // Your code here...
    // 保存原始的 setInterval 方法
    const originalSetInterval = window.setInterval;

    // 重写 setInterval 方法
    window.setInterval = function(callback, delay, ...args) {
        console.log('setInterval 被调用，延迟时间:', delay, '参数:', args);

        // 在此处可以添加自定义逻辑，例如：
        // - 条件限制
        // - 修改回调函数
        // - 记录日志等

        // 调用原始的 setInterval 方法
        return null;
    };

    console.log('window.setInterval 方法已被重写。');
})();