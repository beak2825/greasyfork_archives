// ==UserScript==
// @name         优化bing搜索bing去广告
// @version      0.0.1
// @description  优化bing搜索
// @author       bbq
// @match        https://*.bing.com/*
// @namespace https://greasyfork.org/users/1439433
// @downloadURL https://update.greasyfork.org/scripts/527944/%E4%BC%98%E5%8C%96bing%E6%90%9C%E7%B4%A2bing%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/527944/%E4%BC%98%E5%8C%96bing%E6%90%9C%E7%B4%A2bing%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        adSelectors: [
            // 类型1：b_overflow2后缀广告
            '[class*="b_overflow2"]',

            // 类型2：传统广告标识
            '.sb_adTA',
            '.b_ad',
            '.sb_add',

            // 补充：广告关联元素
            '[data-ptnid="ads"]',
            '[class*="adsupp"]'
        ],
        removeLevel: 3, // 推荐父级删除层级
        delay: 800,
        debug: false
    };

    function advancedRemove(selector) {
        try {
            document.querySelectorAll(selector).forEach(ad => {
                // 多层安全删除策略
                const container = ad.closest('li, .b_algo, .b_ad')
                    || getParentByLevel(ad, config.removeLevel);

                if (container) {
                    container.style.display = 'none'; // 先隐藏防止布局抖动
                    setTimeout(() => container.remove(), 50);
                } else {
                    ad.remove(); // 降级处理直接删除
                }

                config.debug && console.log('Removed:', selector, ad);
            });
        } catch (e) {
            console.warn('Ad remove error:', e);
        }
    }

    function getParentByLevel(element, level) {
        let parent = element;
        while (level-- > 0 && parent) {
            parent = parent.parentElement;
        }
        return parent;
    }

    // 主清理函数
    function cleanAds() {
        config.adSelectors.forEach(selector => {
            advancedRemove(selector);
        });

        // 补充处理：浮动广告栏
        const floatingBars = document.querySelectorAll('.b_adTop, .ads_footer');
        floatingBars.forEach(bar => bar.remove());
    }

    // 增强型初始化
    function init() {
        cleanAds();

        // 使用MutationObserver应对动态加载
        const observer = new MutationObserver(cleanAds);
        observer.observe(document.body, {
            subtree: true,
            childList: true,
            attributes: false
        });

        // 定时器二次清理
        setTimeout(cleanAds, 2000);
    }

    // 启动延迟加载
    window.addEventListener('load', () => {
        setTimeout(init, config.delay);
    });
})();