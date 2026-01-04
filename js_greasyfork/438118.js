// ==UserScript==
// @name         网页调试控制台vconsole
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  网页调试控制台,帮助浏览器接口调试工具
// @author       wll
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @icon         https://img-blog.csdnimg.cn/20181221195058594.gif
// @match        *://*/*
// @run-at       document-start
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/438118/%E7%BD%91%E9%A1%B5%E8%B0%83%E8%AF%95%E6%8E%A7%E5%88%B6%E5%8F%B0vconsole.user.js
// @updateURL https://update.greasyfork.org/scripts/438118/%E7%BD%91%E9%A1%B5%E8%B0%83%E8%AF%95%E6%8E%A7%E5%88%B6%E5%8F%B0vconsole.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个 <script> 元素
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/vconsole@3.9.1/dist/vconsole.min.js';

    // 监听脚本加载完成的事件
    script.onload = function() {
        // 创建 vConsole 实例
        new VConsole();
        console.debug('==========vConsole init==========');
    };

    // 将 <script> 元素添加到 <head> 元素中
    document.head.appendChild(script);
})();