// ==UserScript==
// @name         halo文章别名自动加html
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license MIT
// @description  Append ".html" to the end of the input with name="slug" if it's not already there
// @author       Nicek&文心一言
// @match        *://请将我替换成你的域名，例如www.n2zip.cn/console/posts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494671/halo%E6%96%87%E7%AB%A0%E5%88%AB%E5%90%8D%E8%87%AA%E5%8A%A8%E5%8A%A0html.user.js
// @updateURL https://update.greasyfork.org/scripts/494671/halo%E6%96%87%E7%AB%A0%E5%88%AB%E5%90%8D%E8%87%AA%E5%8A%A8%E5%8A%A0html.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkAndAppendHtml() {
        // 获取所有name="slug"的输入框
        const slugInputs = document.querySelectorAll('input[name="slug"]');

        // 遍历所有输入框
        slugInputs.forEach(function(input) {
            // 检查输入框的值是否以.html结尾
            if (!input.value.endsWith('.html')) {
                // 如果不是，就在末尾添加.html
                input.value += '.html';
            }
        });
    }

    // 初始检查
    checkAndAppendHtml();

    // 每隔1秒检查一次（可以根据需要调整时间间隔）
    setInterval(checkAndAppendHtml, 1000);
})();