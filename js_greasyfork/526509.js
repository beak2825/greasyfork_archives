// ==UserScript==
// @name         Ubits去广告
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  移除ubits.club网站上的两个特定广告元素
// @author       You
// @match        https://ubits.club/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ubits.club
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526509/Ubits%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/526509/Ubits%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义两个广告的特征选择器
    const adSelectors = [
        {
            selector: 'div[style*="margin-bottom: 10px"] a[href*="adredir.php"] img[src="https://ubits.club/pic/ad/zspace_2015_01.jpg"]',
            parent: 'div'
        },
        {
            selector: 'td.clear.nowrap a[href*="adredir.php"] img[src="https://ubits.club/pic/ad/JohnRay.jpg"]',
            parent: 'td'
        }
    ];

    // 广告移除函数
    function removeAds() {
        let removedCount = 0;

        adSelectors.forEach(ad => {
            const target = document.querySelector(ad.selector);
            if (target) {
                const container = target.closest(ad.parent);
                if (container) {
                    container.remove();
                    console.log(`已移除 ${ad.parent} 广告容器`);
                    removedCount++;
                }
            }
        });

        return removedCount;
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(() => {
        if (removeAds() === adSelectors.length) {
            observer.disconnect();
            console.log('所有目标广告已移除，停止监听');
        }
    });

    // 配置观察选项
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 立即执行初始清理
    const initialRemoved = removeAds();
    console.log(`初始移除广告数量：${initialRemoved}`);

    // 设置定时器检查残留
    setTimeout(() => {
        const finalCheck = removeAds();
        if (finalCheck > 0) {
            console.log(`最终检查移除广告数量：${finalCheck}`);
        }
    }, 3000);
})();