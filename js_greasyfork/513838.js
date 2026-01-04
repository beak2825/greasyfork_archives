// ==UserScript==
// @name         启用复制粘贴并显示密码为明文
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解除密码框的复制粘贴限制，并显示密码为明文
// @author       YourName
// @match        https://rs.jshrss.jiangsu.gov.cn/web/login*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513838/%E5%90%AF%E7%94%A8%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%B9%B6%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81%E4%B8%BA%E6%98%8E%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/513838/%E5%90%AF%E7%94%A8%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%B9%B6%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81%E4%B8%BA%E6%98%8E%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有的输入框，包括密码框
    var inputs = document.querySelectorAll('input[type="password"], input[type="text"], input[type="email"], input[type="number"]');

    // 遍历所有输入框，解除复制、粘贴和剪切的限制，并显示密码框为明文
    inputs.forEach(function(input) {
        input.removeAttribute('oncopy');
        input.removeAttribute('onpaste');
        input.removeAttribute('oncut');
        input.oncopy = null;
        input.onpaste = null;
        input.oncut = null;

        // 如果是密码框，将其类型改为文本类型显示明文
        if (input.type === 'password') {
            input.type = 'text';
        }
    });

    // 解除文档的粘贴限制
    document.addEventListener('copy', function(e) {
        e.stopImmediatePropagation();
    }, true);

    document.addEventListener('paste', function(e) {
        e.stopImmediatePropagation();
    }, true);

    document.addEventListener('cut', function(e) {
        e.stopImmediatePropagation();
    }, true);
})();
