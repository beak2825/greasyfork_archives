// ==UserScript==
// @name         copyToNasXunLei
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  send magnet to xunlei
// @author       peter
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javbus.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520271/copyToNasXunLei.user.js
// @updateURL https://update.greasyfork.org/scripts/520271/copyToNasXunLei.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 监听所有点击事件
    document.addEventListener('click', function(event) {
        // 检查点击的元素是否是磁力链接
        if (event.target.tagName === 'A' && event.target.href.startsWith('magnet:')) {
             event.preventDefault(); // 阻止默认行为
            const magnetLink = event.target.href;
            // 构建新的请求地址
            const redirectUrl = `https://pan.xunlei.com/yc?taskLink=${encodeURIComponent(magnetLink)}`;

           window.open(redirectUrl,'_blank')
        }
    }, false);
})();