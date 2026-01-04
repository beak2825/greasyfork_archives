// ==UserScript==
// @name         微博荐读屏蔽脚本
// @namespace    https://github.com/catscarlet/weibo-selection-killer
// @description  屏蔽最新微博分组页面的荐读推广
// @version      0.0.2
// @author       catscarlet
// @license      GNU Affero General Public License v3.0
// @match        https://weibo.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546066/%E5%BE%AE%E5%8D%9A%E8%8D%90%E8%AF%BB%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/546066/%E5%BE%AE%E5%8D%9A%E8%8D%90%E8%AF%BB%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防抖函数 - 控制URL变化处理频率
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // 节流函数 - 控制DOM变化处理频率
    function throttle(func, limit) {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= limit) {
                lastCall = now;
                return func.apply(this, args);
            }
        };
    }

    // 检查URL是否符合目标模式
    function isTargetUrl() {
        return window.location.href.startsWith('https://weibo.com/mygroups');
    }

    // 创建并添加覆盖层，确保不会重复添加
    function createOverlay(articleElement) {
        // 检查是否已添加过覆盖层，避免重复执行
        if (articleElement.classList.contains('has-custom-overlay')) {
            //console.log(articleElement);
            //console.log('覆盖层已添加，跳过。');
            return;
        }

        console.log(articleElement);
        console.log('添加覆盖层');
        // 标记元素已添加覆盖层
        articleElement.classList.add('has-custom-overlay');

        // 设置元素定位方式
        const style = window.getComputedStyle(articleElement);
        if (style.position === 'static') {
            articleElement.style.position = 'relative';
        }

        // 创建SVG覆盖层
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'custom-overlay');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'auto'; // 阻止点击穿透
        svg.style.zIndex = '100'; // 确保覆盖在上方

        // 创建深灰色矩形（opacity=0.99）
        const rectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rectElement.setAttribute('width', '100%');
        rectElement.setAttribute('height', '100%');
        rectElement.setAttribute('fill', 'gray');
        rectElement.setAttribute('opacity', '0.99');

        svg.appendChild(rectElement);
        articleElement.appendChild(svg);

        // 额外确保元素无法被点击
        articleElement.style.pointerEvents = 'none';
    }

    // 移除所有覆盖层并清除标记
    function removeAllOverlays() {
        document.querySelectorAll('.custom-overlay').forEach(overlay => {
            const article = overlay.closest('article');
            if (article) {
                article.classList.remove('has-custom-overlay');
                article.style.pointerEvents = '';
            }
            overlay.remove();
        });
    }

    // 处理元素变化的节流版本
    const handleElementChanges = throttle(function() {
        const container = document.querySelector('.Scroll_wrap_ObsGW');
        if (!container) {
            return;
        }

        // 查找所有包含目标图标的元素
        const targetIcons = container.querySelectorAll('.morepop_cross_1Q1PF');

        targetIcons.forEach(icon => {
            const article = icon.closest('article');
            if (article) {
                //console.log('发现 article');
                //console.log(article);
                createOverlay(article);
            } else {
                //console.log('未检测到 article');
            }
        });
    }, 300); // 300ms内最多执行一次

    let domObserver;

    // 启动DOM变化监控
    function startDomObserver() {
        if (domObserver) {
            console.log('停止已有的 .Scroll_wrap_ObsGW 监视');
            domObserver.disconnect();
        }

        const container = document.querySelector('.Scroll_wrap_ObsGW');
        if (container) {
            console.log('检测到 .Scroll_wrap_ObsGW，开始监视');
            domObserver = new MutationObserver(handleElementChanges);

            const config = {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false,
            };

            domObserver.observe(container, config);
            handleElementChanges(); // 初始检查
        } else {
            // 容器不存在时重试
            console.log('未检测到 .Scroll_wrap_ObsGW');
            setTimeout(startDomObserver, 1000);
        }
    }

    // 停止DOM变化监控
    function stopDomObserver() {
        if (domObserver) {
            domObserver.disconnect();
            domObserver = null;
            //removeAllOverlays();
        }
    }

    // 处理URL变化的防抖版本
    const handleUrlChange = debounce(function() {
        if (isTargetUrl()) {
            startDomObserver();
        } else {
            console.log('分组不匹配，startsWith(https://weibo.com/mygroups) false');
            stopDomObserver();
        }
    }, 400); // 400ms防抖

    // 初始化URL变化监控
    function initUrlMonitor() {
        console.log('加载 weibo-selection-killer');
        handleUrlChange(); // 初始检查

        // 监听浏览器历史变化
        window.addEventListener('popstate', handleUrlChange);

        // 重写history方法以监控URL变化
        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            handleUrlChange();
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            handleUrlChange();
        };

        // 监控hash变化
        window.addEventListener('hashchange', handleUrlChange);
    }

    // 启动脚本
    initUrlMonitor();
})();