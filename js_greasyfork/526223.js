// ==UserScript==
// @name         京东指定店铺(名)屏蔽器
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  批量屏蔽指定京东店铺的商品
// @author       操你妈的黄牛
// @match        https://*.jd.com/*

// @downloadURL https://update.greasyfork.org/scripts/526223/%E4%BA%AC%E4%B8%9C%E6%8C%87%E5%AE%9A%E5%BA%97%E9%93%BA%28%E5%90%8D%29%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/526223/%E4%BA%AC%E4%B8%9C%E6%8C%87%E5%AE%9A%E5%BA%97%E9%93%BA%28%E5%90%8D%29%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置存储系统
    const CONFIG_KEY = 'jshop_blocker_config';
    const defaultConfig = {
        targetShops: ['工作室', '经营部','小店','小铺'],  // 默认屏蔽列表
        enableRegex: false,                   // 是否启用正则表达式
        hideMethod: 'display',                // 隐藏方式
        checkInterval: 1500,                  // 检查间隔
        debugMode: false                      // 调试模式
    };

    // 动态选择器配置（需适配页面结构）
    const selectors = {
        itemWrapper: '.gl-item, .goods-item',    // 商品容器
        shopNameElem: '.J_im_icon a, .shop-name',// 店铺名称元素
        itemMain: '.gl-i-wrap'                   // 商品主区域
    };

    // 初始化配置
    let config = Object.assign({}, defaultConfig, GM_getValue(CONFIG_KEY, {}));

    // 样式增强
    const style = document.createElement('style');
    style.textContent = `
        .jshop-blocked-item {
            position: relative;
            transition: opacity 0.3s;
        }
        .jshop-blocked-item::after {
            content: "已屏蔽: " attr(data-blocked-shop);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255,0,0,0.9);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            z-index: 999;
            font-size: 14px;
            pointer-events: none;
        }
        .jshop-blocked-item:hover::after {
            display: none;
        }
    `;
    document.head.appendChild(style);

    // 店铺匹配逻辑
    function isBlockedShop(shopName) {
        return config.targetShops.some(pattern => {
            try {
                if (config.enableRegex) {
                    const regex = new RegExp(pattern);
                    return regex.test(shopName);
                }
                return shopName.includes(pattern);
            } catch (e) {
                console.error(`正则表达式错误: ${pattern}`, e);
                return false;
            }
        });
    }

    // 核心处理逻辑
    function processItems() {
        const items = document.querySelectorAll(selectors.itemWrapper);
        items.forEach(item => {
            try {
                const shopElem = item.querySelector(selectors.shopNameElem);
                if (!shopElem) return;

                const shopName = shopElem.textContent.trim();
                if (isBlockedShop(shopName)) {
                    applyBlockEffect(item, shopName);
                }
            } catch (e) {
                config.debugMode && console.warn('处理失败:', e);
            }
        });
    }

    // 应用屏蔽效果
    function applyBlockEffect(item, shopName) {
        item.dataset.blockedShop = shopName;
        item.classList.add('jshop-blocked-item');

        switch(config.hideMethod) {
            case 'display':
                item.style.display = 'none';
                break;
            case 'remove':
                item.remove();
                break;
            case 'blur':
                item.style.filter = 'blur(3px)';
                item.style.opacity = '0.2';
                break;
            default:
                item.style.opacity = '0.3';
        }
    }

    // 动态加载处理
    const observer = new MutationObserver(mutations => {
        if (mutations.some(m => m.addedNodes.length)) {
            processItems();
        }
    });

    // 页面监控系统
    function initMonitor() {
        // 初始处理
        processItems();

        // 监听DOM变化
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: false
        });

        // 定时检查
        setInterval(processItems, config.checkInterval);

        // SPA路由监控
        let lastPath = location.pathname;
        setInterval(() => {
            if (location.pathname !== lastPath) {
                lastPath = location.pathname;
                processItems();
            }
        }, 1000);
    }

    // 配置管理接口
    function updateConfig(newConfig) {
        config = Object.assign({}, config, newConfig);
        GM_setValue(CONFIG_KEY, config);
        processItems();
    }

    // 初始化执行
    window.addEventListener('load', initMonitor);

    /* 高级功能示例 */
    // 可通过控制台调用：updateConfig({targetShops: ['新店铺']})
    window.JShopBlocker = {
        addShop: (shop) => updateConfig({targetShops: [...config.targetShops, shop]}),
        removeShop: (shop) => updateConfig({
            targetShops: config.targetShops.filter(s => s !== shop)
        }),
        toggleRegex: () => updateConfig({enableRegex: !config.enableRegex}),
        getConfig: () => ({...config})
    };
})();