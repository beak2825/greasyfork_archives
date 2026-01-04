// ==UserScript==
// @name         雪球纯净复制
// @namespace    xueqiu-clean-copy
// @version      1.0
// @description  去除雪球网复制内容中的作者/链接/声明等冗余信息
// @match        https://xueqiu.com/*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535311/%E9%9B%AA%E7%90%83%E7%BA%AF%E5%87%80%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/535311/%E9%9B%AA%E7%90%83%E7%BA%AF%E5%87%80%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 定义需要删除的标识正则表达式
    const patterns = [
        /^作者：.*\n链接：.*\n来源：雪球.*\n著作权归作者所有.*\n风险提示：.*$/gm,
        /风险提示：[\s\S]*?$/m
    ];

    document.addEventListener('copy', function(e) {
        const selection = document.getSelection().toString();
        let cleanedText = selection;

        // 执行多重过滤
        patterns.forEach(regex => {
            cleanedText = cleanedText.replace(regex, '');
        });

        // 去除首尾空行
        cleanedText = cleanedText.replace(/^\s+|\s+$/g, '');

        // 将处理后的文本写入剪贴板
        e.clipboardData.setData('text/plain', cleanedText);
        e.preventDefault();
    });
})();