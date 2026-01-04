// ==UserScript==
// @name        Kimi.ai 宽度自适应
// @namespace    http://tampermonkey.net/
// @version      V0.2410.181459
// @description  Kimi 宽度自适应
// @author       ns-cn
// @match        https://kimi.moonshot.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moonshot.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513030/Kimiai%20%E5%AE%BD%E5%BA%A6%E8%87%AA%E9%80%82%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/513030/Kimiai%20%E5%AE%BD%E5%BA%A6%E8%87%AA%E9%80%82%E5%BA%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个新的样式元素
    const style = document.createElement('style');
    style.textContent = `
        #scroll-list > div:nth-child(2) > div.css-jdjpte {
            max-width: none !important;
            width: 100% !important;
        }
    `;

    // 将样式添加到文档头部
    document.head.appendChild(style);

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 调整布局的函数
    function adjustLayout() {
        const targetElement = document.querySelector('#scroll-list > div:nth-child(2) > div.css-jdjpte');
        if (targetElement) {
            targetElement.style.maxWidth = 'none';
            targetElement.style.width = '100%';
        }

        const mainContainers = document.querySelectorAll('.main-container');
        mainContainers.forEach(mainContainer => {
            if (mainContainer.children.length === 3 && !mainContainer.dataset.adjusted) {
                requestAnimationFrame(() => {
                    const children = Array.from(mainContainer.children);
                    mainContainer.innerHTML = '';
                    for (let i = children.length - 1; i >= 0; i--) {
                        mainContainer.appendChild(children[i]);
                    }
                    const secondChild = mainContainer.children[1];
                    if (secondChild) {
                        secondChild.style.alignItems = 'flex-start';
                    }
                    if (secondChild.children.length > 1) {
                        secondChild.children[1].style.justifyContent = 'flex-start';
                    }
                    mainContainer.dataset.adjusted = 'true';
                });
            }
        });
    }

    // 使用防抖包装调整布局函数
    const debouncedAdjustLayout = debounce(adjustLayout, 200);

    // 监听DOM变化
    const observer = new MutationObserver(debouncedAdjustLayout);

    observer.observe(document.body, { childList: true, subtree: true });

    // 初始调用一次以处理已加载的内容
    debouncedAdjustLayout();
})();
