// ==UserScript==
// @name        B站稍后再看链接替换
// @namespace   https://github.com/QieSen
// @version     0.3
// @description 将稍后再看视频链接替换为URL Scheme，调用App打开
// @author      QieSen
// @match       https://www.bilibili.com/watchlater/*
// @grant       none
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/506649/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/506649/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 正则表达式匹配BV号
    const bvRegex = /BV[\w\d]{10}/;

    // 替换函数
    function replaceHref(link) {
        const bv = link.href.match(bvRegex)[0];
        link.href = `bilibili://video/${bv}`;
        link.removeAttribute('target'); // 移除target属性,防止新标签页打开 by:daybreak
    }

    // 遍历所有a标签
    function processLinks() {
        document.querySelectorAll('a').forEach(link => {
            if (link.href.match(bvRegex)) {
                replaceHref(link);
            }
        });
    }

    // 初始处理
    processLinks();

    // 监听DOM变化，实时替换新加载的a标签
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.querySelectorAll) {
                        processLinks(node);
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
