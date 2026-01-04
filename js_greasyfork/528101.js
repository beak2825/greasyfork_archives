// ==UserScript==
// @name         MT  繁体自动转简体
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动将 M-Team 网站的繁体中文转换为简体中文
// @author       softOS
// @match        https://kp.m-team.cc/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528101/MT%20%20%E7%B9%81%E4%BD%93%E8%87%AA%E5%8A%A8%E8%BD%AC%E7%AE%80%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/528101/MT%20%20%E7%B9%81%E4%BD%93%E8%87%AA%E5%8A%A8%E8%BD%AC%E7%AE%80%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加简繁转换库 (OpenCC)
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/t2cn.js';
    document.head.appendChild(script);

    script.onload = function() {
        // 确保库加载完成后执行转换
        const converter = OpenCC.Converter({ from: 'hk', to: 'cn' });

        // 转换函数
        function convertToCN() {
            // 转换页面中的文本节点
            const textNodes = [];
            const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while (node = walk.nextNode()) {
                // 排除脚本和样式中的文本
                if (node.parentElement &&
                    node.parentElement.tagName !== 'SCRIPT' &&
                    node.parentElement.tagName !== 'STYLE') {
                    textNodes.push(node);
                }
            }

            // 对所有文本节点进行繁体到简体的转换
            textNodes.forEach(node => {
                if (node.nodeValue.trim()) {
                    node.nodeValue = converter(node.nodeValue);
                }
            });

            // 转换页面标题
            if (document.title) {
                document.title = converter(document.title);
            }
        }

        // 初次执行转换
        convertToCN();

        // 监听动态内容变化，对新内容进行转换
        const observer = new MutationObserver(mutations => {
            let needConvert = false;

            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    needConvert = true;
                    break;
                }
            }

            if (needConvert) {
                // 使用延迟以确保DOM完全更新
                setTimeout(convertToCN, 100);
            }
        });

        // 开始监听页面变化
        observer.observe(document.body, { childList: true, subtree: true });
    };
})();
