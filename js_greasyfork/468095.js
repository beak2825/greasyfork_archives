// ==UserScript==
// @name         移除头歌广告
// @namespace    wuzbre.github.io
// @version      1.0
// @description  移除广告通知
// @author       Wuzbre
// @match        https://www.educoder.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468095/%E7%A7%BB%E9%99%A4%E5%A4%B4%E6%AD%8C%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/468095/%E7%A7%BB%E9%99%A4%E5%A4%B4%E6%AD%8C%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 首先定义一个函数，该函数将检查DOM树中是否存在广告元素
    function removeAd() {
        const adTags = document.querySelectorAll('.selfdomModal___doNCF');

        if (adTags.length > 0) {
            adTags.forEach(ad => ad.parentElement.removeChild(ad));
        }
    }

    // 创建一个MutationObserver对象，该对象将监视DOM树的变化并在变化时调用removeAd函数
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                removeAd();
            }
        });
    });

    // 启动MutationObserver对象
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
