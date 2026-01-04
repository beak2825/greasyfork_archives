// ==UserScript==
// @name              隐藏/显示页面图片
// @name:en           hide/display image
// @namespace         None
// @version           2.0
// @description       在网页右下角添加一个按钮，可以隐藏和显示页面上的所有img标签
// @description:en    Add a button for all websites which can back to the top and go to the bottom,and there is a sliding effecct.
// @author            mofiter
// @create            2023-06-06
// @lastmodified      2023-06-06
// @include           http*://*/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468025/%E9%9A%90%E8%97%8F%E6%98%BE%E7%A4%BA%E9%A1%B5%E9%9D%A2%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/468025/%E9%9A%90%E8%97%8F%E6%98%BE%E7%A4%BA%E9%A1%B5%E9%9D%A2%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 确保只在顶层窗口运行
    if (window.top !== window.self) return;

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        #image-toggle-btn {
            position: fixed !important;
            bottom: 60px !important;
            right: 100px !important;
            width: 40px !important;
            height: 40px !important;
            border-radius: 50% !important;
            border: none !important;
            background: rgba(0, 0, 0, 0.8) !important;
            color: white !important;
            cursor: pointer !important;
            z-index: 999999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
            transition: all 0.3s ease !important;
            backdrop-filter: blur(10px) !important;
            font-size: 0 !important;
            outline: none !important;
        }

        #image-toggle-btn:hover {
            transform: scale(1.1) !important;
            background: rgba(0, 0, 0, 0.9) !important;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
        }

        #image-toggle-btn:active {
            transform: scale(0.95) !important;
        }

        #image-toggle-btn.hidden-images {
            background: rgba(220, 38, 38, 0.8) !important;
            color: white !important;
        }

        #image-toggle-btn.hidden-images:hover {
            background: rgba(220, 38, 38, 0.9) !important;
        }

        #image-toggle-btn svg {
            width: 24px !important;
            height: 24px !important;
            fill: currentColor !important;
        }

        /* 图片隐藏样式 */
        .ace-image-hidden {
            opacity: 0 !important;
            pointer-events: none !important;
            transition: opacity 0.2s ease !important;
        }

        .ace-image-visible {
            opacity: 1 !important;
            pointer-events: auto !important;
            transition: opacity 0.2s ease !important;
        }
    `;
    document.head.appendChild(style);

    // 创建控制按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'image-toggle-btn';
    toggleBtn.title = '隐藏图片';

    // 眼睛图标 SVG
    const eyeOpenSvg = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
    `;

    // 眼睛关闭图标 SVG
    const eyeClosedSvg = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
        </svg>
    `;

    toggleBtn.innerHTML = eyeOpenSvg;

    // 图片显示状态
    let imagesHidden = false;

    // 获取所有图片元素的函数
    function getAllImages() {
        const images = [];

        // 获取所有 img 标签
        document.querySelectorAll('img').forEach(img => {
            if (img.src || img.srcset) {
                images.push(img);
            }
        });

        // 获取所有带背景图片的元素
        document.querySelectorAll('*').forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.backgroundImage && style.backgroundImage !== 'none') {
                images.push(el);
            }
        });

        // 获取所有 SVG 中的图片
        document.querySelectorAll('svg image').forEach(img => {
            images.push(img);
        });

        // 获取所有 picture 元素中的图片
        document.querySelectorAll('picture img').forEach(img => {
            images.push(img);
        });

        return images;
    }

    // 切换图片显示/隐藏的函数
    function toggleImages() {
        imagesHidden = !imagesHidden;
        const images = getAllImages();

        images.forEach(img => {
            if (imagesHidden) {
                img.classList.add('ace-image-hidden');
                img.classList.remove('ace-image-visible');
            } else {
                img.classList.remove('ace-image-hidden');
                img.classList.add('ace-image-visible');
            }
        });

        // 更新按钮状态
        toggleBtn.classList.toggle('hidden-images', imagesHidden);
        toggleBtn.innerHTML = imagesHidden ? eyeClosedSvg : eyeOpenSvg;
        toggleBtn.title = imagesHidden ? '显示图片' : '隐藏图片';
    }

    // 处理动态加载的图片
    function handleDynamicImages() {
        if (imagesHidden) {
            const newImages = getAllImages();
            newImages.forEach(img => {
                if (!img.classList.contains('ace-image-hidden')) {
                    img.classList.add('ace-image-hidden');
                    img.classList.remove('ace-image-visible');
                }
            });
        }
    }

    // 监听DOM变化
    const observer = new MutationObserver((mutations) => {
        let hasNewImages = false;
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'IMG' ||
                            node.querySelector('img') ||
                            window.getComputedStyle(node).backgroundImage !== 'none') {
                            hasNewImages = true;
                        }
                    }
                });
            }
        });

        if (hasNewImages) {
            setTimeout(handleDynamicImages, 100); // 延迟处理确保图片加载完成
        }
    });

    // 绑定点击事件
    toggleBtn.addEventListener('click', toggleImages);

    // 等待DOM完全加载
    function initButton() {
        if (document.body) {
            document.body.appendChild(toggleBtn);

            // 开始监听DOM变化
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            setTimeout(initButton, 100);
        }
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initButton);
    } else {
        initButton();
    }

    // 页面卸载时清理
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
    });
})();