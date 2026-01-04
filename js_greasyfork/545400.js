// ==UserScript==
// @name         zhihusurprise
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  知乎嘲讽回来罢
// @author       You
// @match        *://*.zhihu.com/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/545400/zhihusurprise.user.js
// @updateURL https://update.greasyfork.org/scripts/545400/zhihusurprise.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置要替换的图片地址
    const imageReplacements = {
        // 原始地址: 新地址
        'https://pic1.zhimg.com/v2-5c9b7521eb16507c9d2f747f3a32a813.png': 'https://raw.githubusercontent.com/yizhibaize1/zhihusurprise/refs/heads/main/surprise.jpg',
        // 可以添加更多替换规则
        // '原始地址2': '新地址2',
    };

    // 主替换函数
    function replaceImages() {
        // 处理所有<img>标签
        document.querySelectorAll('img').forEach(img => {
            const src = img.src;
            // 检查是否需要替换
            for (const [oldUrl, newUrl] of Object.entries(imageReplacements)) {
                if (src.includes(oldUrl)) {
                    // 避免重复替换
                    if (!img.dataset.replaced) {
                        console.log(`替换图片: ${src} -> ${newUrl}`);
                        img.src = newUrl;
                        img.dataset.replaced = 'true'; // 标记已替换
                    }
                    break;
                }
            }
        });

        // 处理CSS背景图片
        const styleElements = document.querySelectorAll('*[style]');
        styleElements.forEach(element => {
            const style = element.getAttribute('style');
            for (const [oldUrl, newUrl] of Object.entries(imageReplacements)) {
                if (style.includes(oldUrl)) {
                    const newStyle = style.replace(
                        new RegExp(`url\\(["']?${escapeRegExp(oldUrl)}["']?\\)`, 'gi'),
                        `url("${newUrl}")`
                    );
                    element.setAttribute('style', newStyle);
                    element.dataset.bgReplaced = 'true'; // 标记已替换
                    break;
                }
            }
        });
    }

    // 辅助函数：转义正则特殊字符
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 初始替换
    replaceImages();

    // 监听DOM变化以处理动态加载的内容
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                replaceImages();
            }
        });
    });

    // 开始观察整个文档的变化
    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // 监听URL变化（适用于单页应用）
    let lastUrl = location.href;
    setInterval(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            // 添加延时确保新页面内容加载完成
            setTimeout(replaceImages, 1000);
        }
    }, 500);
})();