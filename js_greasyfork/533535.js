// ==UserScript==
// @name        智能斜杠聚焦可编辑元素（视口可见优化版）
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @version     3.1
// @description 按/键聚焦首个在视口内且可见的可编辑元素
// @author      YourName
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/533535/%E6%99%BA%E8%83%BD%E6%96%9C%E6%9D%A0%E8%81%9A%E7%84%A6%E5%8F%AF%E7%BC%96%E8%BE%91%E5%85%83%E7%B4%A0%EF%BC%88%E8%A7%86%E5%8F%A3%E5%8F%AF%E8%A7%81%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/533535/%E6%99%BA%E8%83%BD%E6%96%9C%E6%9D%A0%E8%81%9A%E7%84%A6%E5%8F%AF%E7%BC%96%E8%BE%91%E5%85%83%E7%B4%A0%EF%BC%88%E8%A7%86%E5%8F%A3%E5%8F%AF%E8%A7%81%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        highlightColor: 'rgba(255,165,0,0.3)',
        excludeSelectors: [
            '.mce-edit-area',
            '.ProseMirror',
            '[data-lexical-editor]'
        ],
        // 新增视口检测阈值（0.1表示元素至少10%可见）
        intersectionThreshold: 0.1
    };

    // 判断元素是否可见（兼容隐藏/透明/尺寸为0等情况）
    function isElementVisible(el) {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               el.offsetWidth > 0 &&
               el.offsetHeight > 0 &&
               style.opacity !== '0';
    }

    // 使用IntersectionObserver检测视口内可见性
    function isInViewport(element) {
        return new Promise(resolve => {
            const observer = new IntersectionObserver(([entry]) => {
                resolve(entry.isIntersecting);
                observer.disconnect();
            }, {
                threshold: CONFIG.intersectionThreshold,
                root: null
            });
            observer.observe(element);
        });
    }

    document.addEventListener('keydown', async e => {
        if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const editables = Array.from(document.querySelectorAll(
                'input:not([type="hidden"]):not([readonly]), ' +
                'textarea:not([readonly]), ' +
                '[contenteditable="true"]:not([readonly])'
            )).filter(el => !CONFIG.excludeSelectors.some(s => el.closest(s)));

            // 按DOM顺序检查首个可见元素
            for (const el of editables) {
                if (!isElementVisible(el)) continue;

                const isVisible = await isInViewport(el);
                if (isVisible) {
                    handleFocus(el, e);
                    addVisualFeedback(el);
                    break;
                }
            }
        }
    }, { capture: true });

    // 原有焦点处理函数保持不变
    function handleFocus(target, event) {
        event.preventDefault();
        if (target.contentEditable === 'true') {
            target.focus({ preventScroll: true });
            const sel = window.getSelection();
            const range = document.createRange();
            if (target.childNodes.length > 0) {
                range.setStart(target, 0);
                range.collapse(true);
            } else {
                target.innerHTML = '&#8203;';
                range.selectNodeContents(target);
                range.collapse(false);
            }
            sel.removeAllRanges();
            sel.addRange(range);
        } else {
            target.focus({ preventScroll: true });
        }
    }

    function addVisualFeedback(element) {
        element.style.transition = 'box-shadow 0.3s';
        element.style.boxShadow = `0 0 0 2px ${CONFIG.highlightColor}`;
        setTimeout(() => element.style.boxShadow = '', 500);
    }
})();