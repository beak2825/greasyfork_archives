// ==UserScript==
// @name         [自用]YouTube地区切换
// @namespace    http://tampermonkey.net/
// @version    1.0
// @description  Youtube地区切换
// @author       0xHugoC
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/526326/%5B%E8%87%AA%E7%94%A8%5DYouTube%E5%9C%B0%E5%8C%BA%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/526326/%5B%E8%87%AA%E7%94%A8%5DYouTube%E5%9C%B0%E5%8C%BA%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用冻结对象防止意外修改
    const REGIONS = Object.freeze({
        'US': { code: 'US', name: '美国', hl: 'en' },
        'JP': { code: 'JP', name: '日本', hl: 'ja' },
        'KR': { code: 'KR', name: '韩国', hl: 'ko' },
        'GB': { code: 'GB', name: '英国', hl: 'en-GB' },
        'IN': { code: 'IN', name: '印度', hl: 'hi' },
        'RU': { code: 'RU', name: '俄罗斯', hl: 'ru' },
        'TW': { code: 'TW', name: '台湾', hl: 'zh-TW' },
        'DE': { code: 'DE', name: '德国', hl: 'de' },
        'FR': { code: 'FR', name: '法国', hl: 'fr' }
    });

    // 缓存常用选择器
    const SELECTORS = {
        LOGO: 'ytd-topbar-logo-renderer',
        CONTAINER: 'yt-region-switcher-container'
    };

    // 避免重复创建对象
    let currentUrl = null;

    function getCurrentUrl() {
        if (!currentUrl) {
            currentUrl = new URL(window.location.href);
        }
        return currentUrl;
    }

    // 初始化地区切换器（使用文档片段优化DOM操作）
    function initRegionSwitcher() {
        if (document.querySelector(SELECTORS.CONTAINER)) return;

        const fragment = document.createDocumentFragment();

        const container = document.createElement('div');
        container.id = SELECTORS.CONTAINER;
        Object.assign(container.style, {
            display: 'inline-block',
            marginLeft: '15px',
            verticalAlign: 'middle'
        });

        const select = createSelectElement();
        container.appendChild(select);
        fragment.appendChild(container);

        // 使用更精确的插入位置
        const referenceNode = document.querySelector(SELECTORS.LOGO);
        if (referenceNode) {
            referenceNode.parentNode.insertBefore(fragment, referenceNode.nextSibling);
        }
    }

    function createSelectElement() {
        const select = document.createElement('select');
        select.title = "切换YouTube地区";
        Object.assign(select.style, {
            padding: '3px 6px',
            fontSize: '12px',
            border: '1px solid #ccc',
            borderRadius: '15px',
            background: 'rgba(255, 255, 255, 0.8)',
            cursor: 'pointer',
            transition: 'all 0.2s'
        });

        // 使用事件委托优化事件处理
        select.addEventListener('change', handleRegionChange);
        select.addEventListener('mouseover', handleHoverEffect);
        select.addEventListener('mouseout', handleHoverEffect);

        // 批量添加选项
        const options = Object.values(REGIONS).map(region => {
            const option = document.createElement('option');
            option.value = region.code;
            option.textContent = region.name;
            return option;
        });
        select.append(...options);

        // 设置初始值
        select.value = GM_getValue('yt_region', 'US');
        return select;
    }

    // 优化事件处理函数
    function handleHoverEffect(e) {
        const target = e.target;
        target.style.background = e.type === 'mouseover'
            ? 'rgba(255, 255, 255, 0.9)'
            : 'rgba(255, 255, 255, 0.8)';
        target.style.boxShadow = e.type === 'mouseover'
            ? '0 2px 5px rgba(0,0,0,0.1)'
            : 'none';
    }

    function handleRegionChange(e) {
        const regionCode = e.target.value;
        GM_setValue('yt_region', regionCode);
        reloadWithRegion(regionCode);
    }

    // 修改后的重定向逻辑
    function reloadWithRegion(regionCode) {
        const region = REGIONS[regionCode];
        if (!region) return;

        const url = getCurrentUrl();
        url.pathname = '/'; // 
        url.searchParams.delete('list');
        url.searchParams.set('gl', region.code);
        url.searchParams.set('hl', region.hl);

        // 使用replace避免历史记录堆积
        if (url.href !== window.location.href) {
            window.location.replace(url.toString());
        }
    }

    // 优化重定向检查
    function applySavedRegion() {
        const savedRegion = GM_getValue('yt_region');
        if (!savedRegion) return;

        const url = getCurrentUrl();
        const currentGl = url.searchParams.get('gl');

        if (currentGl !== savedRegion && window.location.pathname === '/') {
            reloadWithRegion(savedRegion);
        }
    }

    // 优化MutationObserver配置
    const observer = new MutationObserver(entries => {
        if (document.querySelector(SELECTORS.LOGO)) {
            // 使用RAF优化渲染
            requestAnimationFrame(initRegionSwitcher);
            observer.disconnect();
        }
    });

    (function init() {
        // 使用事件委托优化全局事件
        document.addEventListener('yt-navigate-finish', applySavedRegion);

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributeFilter: ['href']
        });

        // 初始检查
        applySavedRegion();
    })();

})();
