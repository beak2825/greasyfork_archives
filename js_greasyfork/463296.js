// ==UserScript==
// @name         夜间模式调低对比度
// @author       ChatGPT    
// @version      3
// @description  当浏览器开启夜间模式时调低对比度。
// @match        *://*/*
// @run-at       document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/463296/%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%E8%B0%83%E4%BD%8E%E5%AF%B9%E6%AF%94%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/463296/%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%E8%B0%83%E4%BD%8E%E5%AF%B9%E6%AF%94%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // 夜间模式已开启，添加黑色遮罩
        var overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.backgroundColor = '#000';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.zIndex = '999999';
        overlay.style.pointerEvents = 'none';
        overlay.style.opacity = '0.20';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        document.body.appendChild(overlay);
    }
})();
