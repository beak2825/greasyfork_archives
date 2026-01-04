// ==UserScript==
// @name         小霸王网站广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  实时屏蔽小霸王网站的Google广告元素
// @author       bbbyqq
// @license      MIT
// @match        *://www.yikm.net/*
// @match        *://yikm.net/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/528837/%E5%B0%8F%E9%9C%B8%E7%8E%8B%E7%BD%91%E7%AB%99%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/528837/%E5%B0%8F%E9%9C%B8%E7%8E%8B%E7%BD%91%E7%AB%99%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义隐藏广告函数
    const hideAds = () => {
        document.querySelectorAll('.adsbygoogle').forEach(ad => {
            ad.remove()
        });
        document.querySelectorAll('#google-anno-sa').forEach(ad => {
            ad.remove()
        });
        document.querySelectorAll('.google-anno-skip').forEach(ad => {
            ad.remove()
        });
        // 删除广告出现时间
        localStorage.removeItem('adsexptime')

    };

    // 初始执行隐藏
    hideAds();

    // 创建MutationObserver监听DOM变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                hideAds(); // 发现新增节点时执行隐藏
            }
        });
    });

    // 开始监听body及其子元素变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();