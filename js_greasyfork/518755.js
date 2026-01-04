
+
// ==UserScript==
// @name         图片悬停放大工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  鼠标悬停显示放大按钮，点击放大并支持滚轮缩放
// @author       clownvary
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518755/%E5%9B%BE%E7%89%87%E6%82%AC%E5%81%9C%E6%94%BE%E5%A4%A7%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/518755/%E5%9B%BE%E7%89%87%E6%82%AC%E5%81%9C%E6%94%BE%E5%A4%A7%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

// 添加必要的样式
GM_addStyle(`
  .zoom-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0,0,0,0.5);
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 9999;
  }

  .zoom-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  }

  .zoomed-img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    transform-origin: center center;
    user-select: none;
    -webkit-user-drag: none;
  }
`);

(function() {
    'use strict';

    // 网站特定规则配置
    const siteRules = {
        'example.com': {
            selector: '.original-image', // 原图元素选择器
            attribute: 'src', // 原图URL属性
            parentSelector: '.image-wrapper', // 父元素选择器
            siblingSelector: '.hd-image', // 兄弟元素选择器
        }
    };

    // 获取当前网站的规则
    function getSiteRule() {
        const hostname = window.location.hostname;
        return siteRules[hostname];
    }

    // 智能查找原图URL
    function getOriginalImageUrl(img) {
        // 处理Twitter图片
        if (img.src && img.src.includes('twimg.com')) {
            return img.src.replace(/\?format=.+$/, '?format=jpg&name=orig');
        }

        // 1. 检查用户是否手动设置了该图片的原图URL
        const manualUrls = GM_getValue('manualImageUrls', {});
        if (manualUrls[img.src]) {
            return manualUrls[img.src];
        }

        // 2. 检查网站特定规则
        const siteRule = getSiteRule();
        if (siteRule) {
            // 根据规则查找原图
            if (siteRule.parentSelector) {
                const parent = img.closest(siteRule.parentSelector);
                if (parent) {
                    const originalImg = parent.querySelector(siteRule.selector);
                    if (originalImg && originalImg[siteRule.attribute]) {
                        return originalImg[siteRule.attribute];
                    }
                }
            }
        }

        // 3. 常见属性检查
        const commonAttributes = [
            'data-original',
            'data-src',
            'data-full',
            'data-zoom-src',
            'data-big',
            'data-actualsrc',
            'data-original-src'
        ];

        for (const attr of commonAttributes) {
            const value = img.getAttribute(attr);
            if (value) return value;
        }

        // 4. 检查父级a标签
        const parentLink = img.closest('a');
        if (parentLink && /\.(jpe?g|png|gif|webp)($|\?)/i.test(parentLink.href)) {
            return parentLink.href;
        }

        // 5. 检查兄弟节点
        const siblings = img.parentElement.children;
        for (const sibling of siblings) {
            if (sibling !== img && sibling.tagName === 'IMG') {
                const siblingUrl = sibling.src || sibling.getAttribute('data-src');
                if (siblingUrl && siblingUrl.includes('original')) {
                    return siblingUrl;
                }
            }
        }

        // 6. 尝试修改URL参数来获取大图
        const urlPatterns = [
            { pattern: /(_thumb|_small|_mini)/i, replacement: '' },
            { pattern: /\b(width|height|size)=\d+/i, replacement: '' },
            { pattern: /\bw=\d+/i, replacement: '' },
            { pattern: /\bq=\d+/i, replacement: 'q=100' }
        ];

        let originalUrl = img.src;
        for (const {pattern, replacement} of urlPatterns) {
            if (pattern.test(originalUrl)) {
                return originalUrl.replace(pattern, replacement);
            }
        }

        // 最后返回原始src
        return img.src;
    }

    // 添加右键菜单处理
    function addContextMenu(img, zoomBtn) {
        zoomBtn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const manualUrl = prompt('请输入此图片的原图URL：');
            if (manualUrl) {
                const manualUrls = GM_getValue('manualImageUrls', {});
                manualUrls[img.src] = manualUrl;
                GM_setValue('manualImageUrls', manualUrls);
                alert('设置成功！');
            }
        });
    }

    // 为所有图片添加放大功能
    function initializeImages() {
        // 处理普通的img标签
        document.querySelectorAll('img').forEach(handleImage);

        // 针对Twitter的特定选择器
        if (window.location.hostname.includes('twitter.com')) {
            document.querySelectorAll('div[style*="background-image"]').forEach(handleBackgroundImage);
        }

        // 其他网站的背景图片处理（可以根据需要添加特定选择器）
        const bgImageSelectors = [
            'div[style*="background-image"]',
            '.image-bg',  // 示例：特定类名
            '[data-bg-image]'  // 示例：特定属性
        ];

        if (!window.location.hostname.includes('twitter.com')) {
            document.querySelectorAll(bgImageSelectors.join(',')).forEach(handleBackgroundImage);
        }
    }

    // 处理背景图片元素
    function handleBackgroundImage(element) {
        if (element.dataset.zoomInitialized) return;
        element.dataset.zoomInitialized = 'true';

        // 获取背景图片URL
        const bgImage = window.getComputedStyle(element).backgroundImage;
        const url = bgImage.replace(/^url\(['"]?(.+?)['"]?\)$/, '$1');
        if (!url || url === 'none') return;

        // 创建放大按钮
        const zoomBtn = document.createElement('div');
        zoomBtn.className = 'zoom-btn';
        zoomBtn.innerHTML = '+';

        // 确保父元素是relative定位
        const position = window.getComputedStyle(element).position;
        if (position === 'static') {
            element.style.position = 'relative';
        }

        element.appendChild(zoomBtn);

        // 鼠标悬停显示放大按钮
        element.addEventListener('mouseenter', () => {
            zoomBtn.style.display = 'flex';
        });
        element.addEventListener('mouseleave', () => {
            zoomBtn.style.display = 'none';
        });

        // 点击放大按钮
        zoomBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const originalUrl = url.includes('twimg.com') ?
                url.replace(/\?format=.+$/, '?format=jpg&name=orig') :
                url;
            showZoomedImage(originalUrl);
            return false;
        }, true);
    }

    // 处理普通图片元素
    function handleImage(img) {
        if (img.dataset.zoomInitialized) return;
        img.dataset.zoomInitialized = 'true';

        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';

        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        const zoomBtn = document.createElement('div');
        zoomBtn.className = 'zoom-btn';
        zoomBtn.innerHTML = '+';
        wrapper.appendChild(zoomBtn);

        // 添加右键菜单功能
        addContextMenu(img, zoomBtn);

        wrapper.addEventListener('mouseenter', () => {
            zoomBtn.style.display = 'flex';
        });
        wrapper.addEventListener('mouseleave', () => {
            zoomBtn.style.display = 'none';
        });

        zoomBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const originalUrl = getOriginalImageUrl(img);
            showZoomedImage(originalUrl);
            return false;
        }, true);
    }

    // 更新MutationObserver以使用节流
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    const observer = new MutationObserver(
        throttle((mutations) => {
            initializeImages();
        }, 1000)  // 1秒节流
    );

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始化
    initializeImages();

    // 添加菜单命令
    GM_registerMenuCommand('清除手动设置的原图URL', () => {
        GM_setValue('manualImageUrls', {});
        alert('已清除所有手动设置的原图URL！');
    });

    // 创建放大图片的遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    document.body.appendChild(overlay);

    function showZoomedImage(src) {
        const img = document.createElement('img');
        img.className = 'zoomed-img';

        // 添加加载指示器
        const loadingDiv = document.createElement('div');
        loadingDiv.textContent = '加载中...';
        loadingDiv.style.color = 'white';
        overlay.innerHTML = '';
        overlay.appendChild(loadingDiv);
        overlay.style.display = 'flex';

        // 图片加载完成后显示
        img.addEventListener('load', () => {
            overlay.innerHTML = '';
            overlay.appendChild(img);
            overlay.style.display = 'flex';

            let scale = 1;
            let isDragging = false;
            let startX, startY;
            let translateX = 0;
            let translateY = 0;

            // 添加滚轮缩放
            img.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                scale = Math.max(0.1, scale + delta);
                updateTransform();
            });

            // 鼠标按下开始拖动
            img.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                img.style.cursor = 'grabbing';
            });

            // 鼠标移动时更新位置
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                updateTransform();
            });

            // 鼠标松开停止拖动
            document.addEventListener('mouseup', () => {
                isDragging = false;
                img.style.cursor = 'grab';
            });

            // 更新变换
            function updateTransform() {
                img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            }

            // 初始化鼠标样式
            img.style.cursor = 'grab';

            // 点击遮罩层关闭（但不包括图片）
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.style.display = 'none';
                    // 清除拖动相关的事件监听器
                    document.removeEventListener('mousemove', null);
                    document.removeEventListener('mouseup', null);
                }
            });
        });

        // 设置图片的src
        img.src = src;
    }
})();
