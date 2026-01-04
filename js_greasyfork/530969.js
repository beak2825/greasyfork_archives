// ==UserScript==
// @name         虎扑图片屏蔽
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  精准检测虎扑各种图片容器结构，增强右键菜单触发逻辑
// @author       YourName
// @match        *://*.hupu.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/530969/%E8%99%8E%E6%89%91%E5%9B%BE%E7%89%87%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/530969/%E8%99%8E%E6%89%91%E5%9B%BE%E7%89%87%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let savedImages = GM_getValue('savedImages') || [];
    let currentImg = null;

    const customMenuDiv = document.createElement('div');
    customMenuDiv.id = 'hupu-img-helper-menu';
    customMenuDiv.style.cssText = `
        position: fixed;
        background: #ffffff;
        border: 1px solid #09f;
        border-radius: 4px;
        padding: 8px 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        z-index: 9999999;
        display: none;
        font-family: system-ui;
        color: #333;
        min-width: 160px;
        opacity: 1;
        visibility: visible;
        transition: background 0.2s; /* 添加背景色过渡效果 */
    `;
    customMenuDiv.innerHTML = `
        <div class="menu-item" style="padding: 6px; cursor: pointer;">
            🖼️ 隐藏该图片
        </div>
    `;
    document.body.appendChild(customMenuDiv);

    // 鼠标悬停时改变整个菜单背景色
    customMenuDiv.addEventListener('mouseover', () => {
        customMenuDiv.style.background = '#f0f8ff';
    });
    customMenuDiv.addEventListener('mouseout', () => {
        customMenuDiv.style.background = '#ffffff';
    });

    function setupImageListeners() {
        const images = document.querySelectorAll('img.thread-img');
        images.forEach(img => {
            img.addEventListener('contextmenu', handleContextMenu, { capture: true });
        });
    }

    function handleContextMenu(e) {
        let target = e.target;
        while (target && target.nodeName !== 'IMG') {
            target = target.parentElement;
        }

        if (target && target.classList.contains('thread-img')) {
            e.preventDefault();
            e.stopPropagation();

            currentImg = {
                element: target,
                container: target.parentElement
            };

            const menuWidth = customMenuDiv.offsetWidth || 160;
            const menuHeight = customMenuDiv.offsetHeight || 44;
            const viewportWidth = document.documentElement.clientWidth;
            const viewportHeight = document.documentElement.clientHeight;

            let adjustedLeft = e.pageX;
            let adjustedTop = e.pageY;

            if (e.pageX + menuWidth > viewportWidth) {
                adjustedLeft = e.pageX - menuWidth;
            }
            if (e.pageY + menuHeight > viewportHeight) {
                adjustedTop = e.pageY - menuHeight;
            }

            adjustedLeft = Math.max(0, Math.min(adjustedLeft, viewportWidth - menuWidth));
            adjustedTop = Math.max(0, Math.min(adjustedTop, viewportHeight - menuHeight));

            customMenuDiv.style.left = `${adjustedLeft}px`;
            customMenuDiv.style.top = `${adjustedTop}px`;
            customMenuDiv.style.display = 'block';
        } else {
            customMenuDiv.style.display = 'none';
        }
    }

    setupImageListeners();

    new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches('img.thread-img')) {
                        node.addEventListener('contextmenu', handleContextMenu, { capture: true });
                    }
                    node.querySelectorAll('img.thread-img').forEach(img => {
                        img.addEventListener('contextmenu', handleContextMenu, { capture: true });
                    });
                }
            });
        });
    }).observe(document.body, {
        childList: true,
        subtree: true
    });

    customMenuDiv.querySelector('.menu-item').addEventListener('click', function() {
        if (!currentImg) return;

        const src = currentImg.element.src;
        const cleanSrc = src.replace(/(?:\?|&)x-oss-process=.*$/, '');

        if (!savedImages.includes(cleanSrc)) {
            savedImages.push(cleanSrc);
            GM_setValue('savedImages', savedImages);
        }

        if (currentImg.container) {
            currentImg.container.style.display = 'none';
        } else {
            currentImg.element.style.display = 'none';
        }

        customMenuDiv.style.display = 'none';
        currentImg = null;
    });

    document.addEventListener('click', (e) => {
        if (!customMenuDiv.contains(e.target)) {
            customMenuDiv.style.display = 'none';
        }
    });

    new MutationObserver(() => {
        savedImages.forEach(src => {
            document.querySelectorAll(`img[src^="${src}"]`).forEach(img => {
                const container = img.parentElement;
                if (container) {
                    container.style.display = 'none';
                }
            });
        });
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();