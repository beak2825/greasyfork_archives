// ==UserScript==
// @name         Eruda Debugger Injector（开启“开发者工具”）
// @namespace    https://viayoo.com/
// @version      0.2
// @description  为所有网页注入Eruda调试工具
// @author       https://linux.do/t/topic/454883
// @run-at       document-end
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528514/Eruda%20Debugger%20Injector%EF%BC%88%E5%BC%80%E5%90%AF%E2%80%9C%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7%E2%80%9D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528514/Eruda%20Debugger%20Injector%EF%BC%88%E5%BC%80%E5%90%AF%E2%80%9C%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7%E2%80%9D%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建第一个script标签加载eruda库
    const script1 = document.createElement('script');
    script1.src = 'https://cdnjs.webstatic.cn/ajax/libs/eruda/3.2.1/eruda.min.js';
    
    // 库加载完成后初始化eruda
    script1.onload = function() {
        const script2 = document.createElement('script');
        script2.textContent = 'eruda.init();';
        document.body.appendChild(script2);
    };

    // 将脚本添加到页面
    document.body.appendChild(script1);
})();