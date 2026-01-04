// ==UserScript==
// @name         粘贴数字时自动删除空格2.0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在创建债权人发票时自动删除粘贴的数字中的空格
// @author       YJ
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531002/%E7%B2%98%E8%B4%B4%E6%95%B0%E5%AD%97%E6%97%B6%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E7%A9%BA%E6%A0%BC20.user.js
// @updateURL https://update.greasyfork.org/scripts/531002/%E7%B2%98%E8%B4%B4%E6%95%B0%E5%AD%97%E6%97%B6%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E7%A9%BA%E6%A0%BC20.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('paste', function(event) {
        var paste = (event.clipboardData || window.clipboardData).getData('text');
        // 首先移除所有空格
        var modifiedPaste = paste.replace(/\s+/g, '');

        // 然后检查处理后的文本是否为5到20位的数字
        if (modifiedPaste.length >= 5 && modifiedPaste.length <= 20 && /^\d+$/.test(modifiedPaste)) {
            event.preventDefault(); // 阻止默认的粘贴行为
            // 手动插入处理后的文本到活动的输入元素
            if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
                var start = document.activeElement.selectionStart;
                var end = document.activeElement.selectionEnd;
                document.activeElement.value = document.activeElement.value.substring(0, start)
                                              + modifiedPaste
                                              + document.activeElement.value.substring(end);
                // 更新光标位置
                document.activeElement.setSelectionRange(start + modifiedPaste.length, start + modifiedPaste.length);
            }
        }
    });
})();
