// ==UserScript==
// @name         屏蔽 mask_div 和 waterMark 显示
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  屏蔽页面上所有 class="mask_div" 和 id="waterMark" 的元素
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521528/%E5%B1%8F%E8%94%BD%20mask_div%20%E5%92%8C%20waterMark%20%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/521528/%E5%B1%8F%E8%94%BD%20mask_div%20%E5%92%8C%20waterMark%20%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查找并隐藏 class="mask_div" 和 id="waterMark" 的元素
    const hideElements = () => {
        const maskDivs = document.querySelectorAll('.mask_div');
        for (const maskDiv of maskDivs) {
            maskDiv.style.display = 'none';
        }

        const waterMark = document.getElementById('waterMark');
        if (waterMark) {
            waterMark.style.display = 'none';
        }
    };

    // 使用 MutationObserver 监听 DOM 元素的变化
    const observer = new MutationObserver(hideElements);
    observer.observe(document.body, { childList: true, subtree: true });

    // 立即隐藏所有指定的元素
    hideElements();

    // 确保在 frame 加载后执行
    window.addEventListener('load', function() {
        const viewFrame = document.getElementById('viewFrameObj');
        if (viewFrame) {
            viewFrame.addEventListener('load', function() {
                try {
                    const waterMarks = viewFrame.contentDocument.getElementsByClassName('water-mark');
                    for (const waterMark of waterMarks) {
                        waterMark.style.display = 'none';
                    }
                } catch (e) {
                    console.error('无法访问 frame 内容:', e);
                }
            });
        }
    });
})();