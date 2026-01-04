// ==UserScript==
// @name         屏蔽HJ广告
// @namespace    http://tampermonkey.net/
// @version      2025-05-28
// @description  屏蔽一些广告
// @author       You
// @match        *://haijiao.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532417/%E5%B1%8F%E8%94%BDHJ%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/532417/%E5%B1%8F%E8%94%BDHJ%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 屏蔽函数
    function hideAds() {
        // 查找所有 class 为 containeradvertising haslist 的 div
        const ads = document.querySelectorAll('div.containeradvertising.haslist');

        // 遍历并隐藏这些元素
        ads.forEach(ad => {
            ad.style.display = 'none';
            console.log('已屏蔽广告元素:', ad);
        });
    }

    // 页面加载时执行一次
    hideAds();

    // 使用 MutationObserver 监听 DOM 变化，防止动态加载的广告
    const observer = new MutationObserver(hideAds);

    // 配置观察选项
    const config = {
        childList: true,
        subtree: true
    };

    // 开始观察 document 的变化
    observer.observe(document.body, config);


    // Your code here...
})();