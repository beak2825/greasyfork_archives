// ==UserScript==
// @name         缩小标题字体，缩小图片，并允许通过快捷键取消更改
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  摸鱼的艺术,更新hover时恢复图片大小, Alt+Shift+F 取消更改
// @author       chenjiamian
// @match        http://*/*
// @match        https://*/*
// @exclude      *.png
// @exclude      *.jpg
// @exclude      *.gif
// @exclude      *.webp
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453640/%E7%BC%A9%E5%B0%8F%E6%A0%87%E9%A2%98%E5%AD%97%E4%BD%93%EF%BC%8C%E7%BC%A9%E5%B0%8F%E5%9B%BE%E7%89%87%EF%BC%8C%E5%B9%B6%E5%85%81%E8%AE%B8%E9%80%9A%E8%BF%87%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%8F%96%E6%B6%88%E6%9B%B4%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/453640/%E7%BC%A9%E5%B0%8F%E6%A0%87%E9%A2%98%E5%AD%97%E4%BD%93%EF%BC%8C%E7%BC%A9%E5%B0%8F%E5%9B%BE%E7%89%87%EF%BC%8C%E5%B9%B6%E5%85%81%E8%AE%B8%E9%80%9A%E8%BF%87%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%8F%96%E6%B6%88%E6%9B%B4%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isEnabled = true;
    const originalFontSizes = new WeakMap();
    let originalStyles = new Map(); // 用于存储原始样式
    let processing = false; // 节流标志

    // 保存元素的原始样式
    function saveOriginalStyle(element) {
        if (!originalStyles.has(element)) {
            originalStyles.set(element, {
                fontSize: element.style.fontSize,
                fontWeight: element.style.fontWeight,
                maxWidth: element.style.maxWidth,
                height: element.style.height
            });
        }
    }

    // 恢复元素的原始样式
    function restoreOriginalStyle(element) {
        if (originalStyles.has(element)) {
            const styles = originalStyles.get(element);
            element.style.fontSize = styles.fontSize;
            element.style.fontWeight = styles.fontWeight;
            element.style.maxWidth = styles.maxWidth;
            element.style.height = styles.height;
            originalStyles.delete(element);
        }
    }

    // 记录原始字体大小
    function recordOriginalFontSizes() {
        document.querySelectorAll('*').forEach(ele => {
            if (!['HTML', 'HEAD', 'BODY', 'SCRIPT', 'STYLE'].includes(ele.tagName)) {
                const fontSize = parseFloat(getComputedStyle(ele).fontSize);
                originalFontSizes.set(ele, fontSize);
                saveOriginalStyle(ele);
            }
        });
    }

    function isDescendantOfPhotoShowViewer(element) {
        let parent = element.parentElement;
        while (parent) {
            if (parent.id === 'photoShowViewer') {
                return true;
            }
            parent = parent.parentElement;
        }
        return false;
    }

    function processElements() {
        if (!isEnabled || processing) return; // 如果禁用或正在处理，则不处理元素
        processing = true;

        requestAnimationFrame(() => {
            document.querySelectorAll('*').forEach(ele => {
                if (!['HTML', 'HEAD', 'BODY', 'SCRIPT', 'STYLE'].includes(ele.tagName)) {
                    if (!originalFontSizes.has(ele)) {
                        const fontSize = parseFloat(getComputedStyle(ele).fontSize);
                        originalFontSizes.set(ele, fontSize);
                        saveOriginalStyle(ele);
                    }

                    const originalFontSize = originalFontSizes.get(ele);
                    if (originalFontSize > 17) {
                        ele.style.fontWeight = 'bold';
                    } else {
                        ele.style.fontWeight = '';
                    }
                    ele.style.fontSize = '16px';
                }

                if (ele.tagName === 'IMG' && !isDescendantOfPhotoShowViewer(ele)) {
                    const imgWidth = parseFloat(getComputedStyle(ele).width);
                    if (imgWidth > 500) {
                        if(!ele.dataset.originalWidth){
                           ele.dataset.originalWidth = ele.style.width || getComputedStyle(ele).width;
                           ele.dataset.originalHeight = ele.style.height || getComputedStyle(ele).height;
                           saveOriginalStyle(ele); // 保存原始样式
                        }
                        ele.style.setProperty('max-width', '150px', 'important');
                        ele.style.setProperty('height', 'auto', 'important');
                    }
                }
            });

            processing = false;
        });
    }

    // 恢复所有元素的原始样式
    function restoreAllOriginalStyles() {
        document.querySelectorAll('*').forEach(ele => {
            restoreOriginalStyle(ele);
            if (ele.tagName === 'IMG') {
                if(ele.dataset.originalWidth){
                    ele.style.removeProperty('max-width');
                    ele.style.removeProperty('height');
                    ele.style.width = ele.dataset.originalWidth;
                    ele.style.height = ele.dataset.originalHeight;
                    delete ele.dataset.originalWidth;
                    delete ele.dataset.originalHeight;
                }
             }
        });
    }

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
        if (!isEnabled) return;
        processElements();
    });

    // 快捷键处理函数
    function handleKeyPress(event) {
        if (event.altKey && event.shiftKey && event.key === 'F') {
            isEnabled = !isEnabled;
            if (isEnabled) {
                // 重新启用时，不需要清空 originalStyles，因为processElements 会处理新元素
                // recordOriginalFontSizes(); // 不需要重新记录，因为 observer 会处理
                processElements();
                console.log('字体和图片缩小已启用');
            } else {
                restoreAllOriginalStyles();
                console.log('字体和图片缩小已禁用，已恢复原始样式');
            }
        }
    }

    // 确保在 DOM 加载完成后执行初始化
    function initialize() {
        recordOriginalFontSizes();
        processElements();
        observer.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('keydown', handleKeyPress);
        console.log('字体和图片缩小脚本已启用，按 Alt+Shift+F 切换');
    }

    // 在 DOMContentLoaded 事件触发时执行初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // 处理动态加载的内容
    window.addEventListener('hashchange', processElements);
    window.addEventListener('popstate', processElements);
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        processElements();
    };
})();