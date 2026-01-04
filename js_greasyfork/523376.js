// ==UserScript==
// @name         fsm图片增加蒙版
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  为fsm所有图片增加了一个蒙版
// @author       heihei
// @match        https://fsm.name/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523376/fsm%E5%9B%BE%E7%89%87%E5%A2%9E%E5%8A%A0%E8%92%99%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/523376/fsm%E5%9B%BE%E7%89%87%E5%A2%9E%E5%8A%A0%E8%92%99%E7%89%88.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .tampermonkey-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.3s ease;
        }
        .tampermonkey-container:hover .tampermonkey-overlay {
            opacity: 0;
        }
        .tampermonkey-container {
            position: relative;
            display: inline-block;
        }
    `;
    document.head.appendChild(style);

    // 处理所有图片
    function applyBlurToImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // 如果已经处理过则跳过
            if (img.parentElement.classList.contains('tampermonkey-container')) {
                return;
            }

            // 创建容器
            const container = document.createElement('div');
            container.className = 'tampermonkey-container';

            // 创建蒙版
            const overlay = document.createElement('div');
            overlay.className = 'tampermonkey-overlay';

            // 包裹图片
            img.parentNode.insertBefore(container, img);
            container.appendChild(img);
            container.appendChild(overlay);
        });
    }

    // 初始应用
    applyBlurToImages();

    // 监听动态加载的图片
    const observer = new MutationObserver(applyBlurToImages);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();