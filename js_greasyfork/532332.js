// ==UserScript==
// @name         Eruda调试页面
// @version      1.2
// @description  为当前页面加载Eruda调试工具
// @author       DeepSeek
// @match        *://*/*
// @resource     erudaJS https://cdn.jsdelivr.net/gh/damengzhu/js@refs/heads/main/eruda.min.js
// @run-at       document-end
// @grant        GM_getResourceText
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/532332/Eruda%E8%B0%83%E8%AF%95%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/532332/Eruda%E8%B0%83%E8%AF%95%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 从资源加载Eruda脚本
    var erudaCode = GM_getResourceText('erudaJS');
    var script = document.createElement('script');
    script.textContent = erudaCode;
    document.body.appendChild(script);
    
    // 延迟初始化
    setTimeout(function() {
        if (typeof eruda !== 'undefined') {
            eruda.init();
        }
    }, 100);
})();