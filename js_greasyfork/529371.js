// ==UserScript==
// @name         柠檬云财务复制金额自动去除千分符
// @namespace    https://jxc.ningmengyun.com/qianfenfu
// @version      1.2
// @description  将柠檬云财务中所有复制的金额自动去除千分符
// @author       偶然好看
// @license MIT
// @match        https://jpro6.ningmengyun.com/*
// @match        https://j6.ningmengyun.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529371/%E6%9F%A0%E6%AA%AC%E4%BA%91%E8%B4%A2%E5%8A%A1%E5%A4%8D%E5%88%B6%E9%87%91%E9%A2%9D%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4%E5%8D%83%E5%88%86%E7%AC%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/529371/%E6%9F%A0%E6%AA%AC%E4%BA%91%E8%B4%A2%E5%8A%A1%E5%A4%8D%E5%88%B6%E9%87%91%E9%A2%9D%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4%E5%8D%83%E5%88%86%E7%AC%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('copy', function(e) {
        // 获取选中的文本内容
        const selectedText = window.getSelection().toString().trim();

        // 匹配标准千分位金额格式（包含逗号分隔和两位小数）
        const amountPattern = /^\d{1,3}(?:,\d{3})*\.\d{2}$/;

        if (amountPattern.test(selectedText)) {
            // 去除所有逗号
            const cleanText = selectedText.replace(/,/g, '');

            // 阻止默认复制行为
            e.preventDefault();

            // 设置修改后的剪贴板数据
            e.clipboardData.setData('text/plain', cleanText);
            console.info('[Copy] ',selectedText,'→',cleanText);
        }
    });
})();