// ==UserScript==
// @name         煎蛋 MP4 替换为 GIF
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将特定格式的MP4链接替换为GIF链接，但不替换source标签中的MP4
// @author       deepseek
// @license      MIT
// @match        *://*.jandan.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536575/%E7%85%8E%E8%9B%8B%20MP4%20%E6%9B%BF%E6%8D%A2%E4%B8%BA%20GIF.user.js
// @updateURL https://update.greasyfork.org/scripts/536575/%E7%85%8E%E8%9B%8B%20MP4%20%E6%9B%BF%E6%8D%A2%E4%B8%BA%20GIF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function selectiveMp4ToGifReplacement() {
        // 只匹配特定格式的a标签
        const links = document.querySelectorAll('a[href$=".mp4"][target="_blank"][class="img-link"]');

        links.forEach(link => {
            if (link.textContent.trim() === '[查看原图]') {
                // 替换href中的.mp4为.gif
                link.href = link.href.replace(/\.mp4($|\?)/, '.gif$1');

                // 替换整个HTML结构以确保其他属性保持不变
                const outerHTML = link.outerHTML;
                const newOuterHTML = outerHTML.replace(
                    /(<a\s[^>]*href="[^"]*)\.mp4("[^>]*>\[查看原图\]<\/a>)/g,
                    '$1.gif$2'
                );

                if (outerHTML !== newOuterHTML) {
                    link.outerHTML = newOuterHTML;
                }
            }
        });
    }

    // 初始执行
    selectiveMp4ToGifReplacement();

    // 监听DOM变化以处理动态内容
    const observer = new MutationObserver(function(mutations) {
        selectiveMp4ToGifReplacement();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();