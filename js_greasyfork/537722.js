// ==UserScript==
// @name         通用网页水印屏蔽器（结构特征识别）
// @namespace    https://chat.openai.com/
// @version      1.1
// @description  隐藏基于样式渲染的网页水印，不依赖具体文字内容
// @match        *://*.didichuxing.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/537722/%E9%80%9A%E7%94%A8%E7%BD%91%E9%A1%B5%E6%B0%B4%E5%8D%B0%E5%B1%8F%E8%94%BD%E5%99%A8%EF%BC%88%E7%BB%93%E6%9E%84%E7%89%B9%E5%BE%81%E8%AF%86%E5%88%AB%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/537722/%E9%80%9A%E7%94%A8%E7%BD%91%E9%A1%B5%E6%B0%B4%E5%8D%B0%E5%B1%8F%E8%94%BD%E5%99%A8%EF%BC%88%E7%BB%93%E6%9E%84%E7%89%B9%E5%BE%81%E8%AF%86%E5%88%AB%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const hideStyle = document.createElement('style');
    hideStyle.innerHTML = `
        /* 常见水印结构样式 */
        [style*="opacity: 0.1"],
        [style*="opacity:0.1"],
        [style*="opacity: 0.05"],
        [style*="opacity:0.05"],
        [style*="user-select: none"][style*="pointer-events: none"],
        [style*="pointer-events: none"][style*="fixed"],
        [style*="pointer-events: none"][style*="absolute"],
        [style*="z-index: 9999"],
        [class*="watermark"],
        .watermark {
            display: none !important !important;
            visibility: hidden !important;
        }
    `;
    document.head.appendChild(hideStyle);

    // 删除疑似水印元素（不看内容，只看样式）
    function removeStyleBasedWatermarks() {
        const all = document.querySelectorAll('*');
        all.forEach(el => {
            const style = getComputedStyle(el);
            const isWatermarkLike =
                (style.opacity < 0.2) &&
                (style.pointerEvents === 'none') &&
                (style.userSelect === 'none' || style.position === 'fixed' || style.position === 'absolute') &&
                (parseInt(style.zIndex) >= 9999 || style.zIndex === 'auto');

            const sizeOK =
                el.offsetWidth >= 100 && el.offsetHeight >= 40;

            if (isWatermarkLike && sizeOK) {
                el.remove();
                console.log('✅ 移除结构样式型水印:', el);
            }
        });
    }

    // 连续尝试 + 动态监听
    const timer = setInterval(removeStyleBasedWatermarks, 300);
    setTimeout(() => clearInterval(timer), 5000);

    const observer = new MutationObserver(removeStyleBasedWatermarks);
    observer.observe(document, { childList: true, subtree: true });
})();
