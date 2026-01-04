// ==UserScript==
// @name         精准关键词链接屏蔽器
// @namespace    
// @version      1.1
// @description  精准替换包含敏感词的单条超链接为纯文本
// @author       jiaming888
// @match        *://*/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532274/%E7%B2%BE%E5%87%86%E5%85%B3%E9%94%AE%E8%AF%8D%E9%93%BE%E6%8E%A5%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532274/%E7%B2%BE%E5%87%86%E5%85%B3%E9%94%AE%E8%AF%8D%E9%93%BE%E6%8E%A5%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEYWORDS = ["伪娘", "扶她","雌堕"];        // 敏感词库
    const REPLACE_MODE = "TEXT";              // 替换模式：TEXT-纯文本 / REMOVE-完全移除
    const OBSERVER_CONFIG = { subtree: true, childList: true };

    const dynamicRegex = new RegExp(
        KEYWORDS.map(word => 
            word.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')
        ).join('|'),
        'i'
    );

    function processLinks(root = document) {
        root.querySelectorAll('a').forEach(link => {
            if(dynamicRegex.test(link.textContent)) {
                replaceLink(link);
            }
        });
    }

    function replaceLink(targetLink) {
        const span = document.createElement('span');
        span.textContent = targetLink.textContent;
        
        span.style.cssText = `
            color: inherit;
            text-decoration: inherit;
            cursor: text;
        `;

        switch(REPLACE_MODE) {
            case "TEXT":
                targetLink.replaceWith(span);
                break;
            case "REMOVE":
                targetLink.remove();
                break;
        }
    }

    // 初始化执行（参考网页2的@match配置）
    processLinks();

    // 动态内容监听（参考网页1的MutationObserver实现）
    const observer = new MutationObserver(mutations => {
        observer.disconnect();
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if(node.nodeType === Node.ELEMENT_NODE) {
                    processLinks(node);
                }
            });
        });
        observer.observe(document.body, OBSERVER_CONFIG);
    });

    observer.observe(document.body, OBSERVER_CONFIG);
})();