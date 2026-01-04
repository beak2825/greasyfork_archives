// ==UserScript==
// @name         Maskify
// @namespace    shawnzhang31
// @license      MIT
// @version      0.1
// @description  Ensitive Data Anonymizer
// @author       守着瓜的猹
// @match        http://10.250.186.247:20201/project/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507924/Maskify.user.js
// @updateURL https://update.greasyfork.org/scripts/507924/Maskify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 正则表达式匹配IP地址
    const ipRegex = /(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/g;

    // 正则表达式匹配电话号码（简单示例，可以根据实际情况调整）
   //const phoneRegexCN = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}\b/g;
   //const phoneRegexCN = /(?:\+?0?86)?1[3-9]\d{9}\b/g; // 支持+86前缀
    const phoneRegexCN = /(\+?0?86)?(1[3-9]\d{1})\d{5}(\d{3})\b/g;


    // 遍历页面的所有文本节点，并替换内容
    function maskSensitiveData() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            let newText = node.nodeValue;

            // 替换IP地址的中间部分为*
            newText = newText.replace(ipRegex, (match, p1, p2, p3, p4) => {
                return `${p1}.*.*.${p4}`;
            });


            // 替换电话号码中间部分为*
            newText = newText.replace(phoneRegexCN, (match, countryCode, firstPart, lastPart) => {
                return `${countryCode || ''}${firstPart}*****${lastPart}`;
            });


            // 更新文本节点
            if (newText !== node.nodeValue) {
                node.nodeValue = newText;
            }
        }
    }

    // 执行替换
    // maskSensitiveData();
    const observer = new MutationObserver(maskSensitiveData);
    observer.observe(document.body, { childList: true, subtree: true });
})();