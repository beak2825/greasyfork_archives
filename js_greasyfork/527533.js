// ==UserScript==
// @name         左键直接打开网页内的地址文本
// @namespace    onezhuanone.com
// @version      1.1.0
// @description  自动识别文本中的URL并转换为可点击链接
// @author       bijike.com
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527533/%E5%B7%A6%E9%94%AE%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5%E5%86%85%E7%9A%84%E5%9C%B0%E5%9D%80%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/527533/%E5%B7%A6%E9%94%AE%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5%E5%86%85%E7%9A%84%E5%9C%B0%E5%9D%80%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 改进的正则：匹配文本中的 URL（包括被标点包围的情况）
    const urlPattern = /(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;*\u2010\u2011\u2012\u2013\u2014]+[-A-Z0-9+&@#\/%=~_|])/gi;

    // 遍历页面所有文本节点，替换URL为可点击链接
    function convertTextLinks() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while ((node = walker.nextNode())) {
            if (node.parentNode.nodeName === 'A') continue; // 跳过已有链接

            const text = node.nodeValue;
            if (urlPattern.test(text)) {
                const parent = node.parentNode;
                const html = text.replace(urlPattern, '<a href="$1" class="auto-link">$1</a>');
                const temp = document.createElement('div');
                temp.innerHTML = html;
                parent.replaceChild(temp, node);
            }
        }
    }

    // 页面加载完成后执行转换
    window.addEventListener('load', convertTextLinks);

    // 动态内容监听（可选）
    const observer = new MutationObserver(convertTextLinks);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 点击事件处理
    document.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('auto-link')) {
            window.open(target.href, '_blank');
            event.preventDefault();
        }
    });
})();