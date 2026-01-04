// ==UserScript==
// @name         ShowDoc 粘贴
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解决 ShowDoc 经常无法粘贴内容到编辑器中的问题
// @author       Honest
// @match        http://192.168.1.77:4999/web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1.77
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468540/ShowDoc%20%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/468540/ShowDoc%20%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('paste', function(event) {
        // 获取粘贴板中的数据
        var clipboardData = event.clipboardData || window.clipboardData;
        var pastedData = clipboardData.getData('text');

        // 处理粘贴的内容
        const editor = document.querySelector('#page-editor');
        if (editor && editor.__vue__ && editor.__vue__.insertValue) {
            editor.__vue__.insertValue(pastedData);
        }
    });
})();