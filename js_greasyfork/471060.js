// ==UserScript==
// @name         双击空白处返回主页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  双击网页空白处返回主页
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471060/%E5%8F%8C%E5%87%BB%E7%A9%BA%E7%99%BD%E5%A4%84%E8%BF%94%E5%9B%9E%E4%B8%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/471060/%E5%8F%8C%E5%87%BB%E7%A9%BA%E7%99%BD%E5%A4%84%E8%BF%94%E5%9B%9E%E4%B8%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    // 判断是否已经点击过
    let clicked = false;

    // 添加事件监听，当双击空白处时执行返回主页的操作
    document.addEventListener('dblclick', function(event) {
        // 阻止默认行为，避免误触发其他双击事件
        event.preventDefault();

        // 判断是否点击在页面的空白处（不包含链接、按钮等元素）
        if (!clicked && event.target === document.documentElement) {
            // 设置为已点击状态，避免重复触发
            clicked = true;

            // 执行返回主页的操作，你可以将此处的链接替换为你的主页链接
            window.location.href = 'https://www.example.com';
        }
    });
})();
