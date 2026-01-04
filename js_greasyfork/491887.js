// ==UserScript==
// @name         onedrive去文件历史版本-单文件夹版
// @namespace    http://your.namespace.com
// @version      0.1
// @description  狗贼微软 10年不修复
// @match        *://*.sharepoint.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491887/onedrive%E5%8E%BB%E6%96%87%E4%BB%B6%E5%8E%86%E5%8F%B2%E7%89%88%E6%9C%AC-%E5%8D%95%E6%96%87%E4%BB%B6%E5%A4%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/491887/onedrive%E5%8E%BB%E6%96%87%E4%BB%B6%E5%8E%86%E5%8F%B2%E7%89%88%E6%9C%AC-%E5%8D%95%E6%96%87%E4%BB%B6%E5%A4%B9%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 创建按钮
        var button = document.createElement('button');
        button.textContent = '收集版本历史记录链接';

        // 获取目标位置的节点
        var targetNode = document.evaluate('/html/body/form/div[12]/div/div[2]/div/div/div/div[1]/h1/span/span/span[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        // 确保目标位置存在并且是一个元素节点
        if (targetNode && targetNode.nodeType === Node.ELEMENT_NODE) {
            // 将按钮添加到目标位置之后
            targetNode.parentNode.insertBefore(button, targetNode.nextSibling);
        } else {
            // 如果找不到目标位置，将按钮添加到 body 的末尾
            document.body.appendChild(button);
        }

        // 查找所有内容为‘版本历史记录’的a标签
        var versionLinks = document.querySelectorAll('a');
        var collectedLinks = [];
        versionLinks.forEach(function(link) {
            if (link.textContent.trim() === '版本历史记录') {
                collectedLinks.push(link.href);
            }
        });

        // 添加按钮点击事件监听器
        button.addEventListener('click', function() {
            // 将链接复制到系统剪贴板
            var linksText = collectedLinks.join('\n'); // 每个链接之间换行分隔
            navigator.clipboard.writeText(linksText)
                .then(function() {
                    console.log('链接已复制到剪贴板');
                })
                .catch(function(error) {
                    console.error('复制链接到剪贴板时出错:', error);
                });
        });
    });
})();
