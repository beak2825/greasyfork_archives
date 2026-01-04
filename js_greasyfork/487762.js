// ==UserScript==
// @name           部分網站強制導向到日文版面
// @namespace      部分網站強制導向到日文版面
// @version        0.3
// @description    強制導向到日文版面，並將其他語言替換為日文
// @homepageURL    https://greasyfork.org/scripts/487762/
// @match          https://supjav.com/*
// @match          https://tktube.com/*
// @match          https://jable.tv/*
// @match          https://www.jpvhub.com/*
// @exclude        https://jable.tv/*?lang=jp*
// @exclude        https://www.jpvhub.com/jp/*
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/487762/%E9%83%A8%E5%88%86%E7%B6%B2%E7%AB%99%E5%BC%B7%E5%88%B6%E5%B0%8E%E5%90%91%E5%88%B0%E6%97%A5%E6%96%87%E7%89%88%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/487762/%E9%83%A8%E5%88%86%E7%B6%B2%E7%AB%99%E5%BC%B7%E5%88%B6%E5%B0%8E%E5%90%91%E5%88%B0%E6%97%A5%E6%96%87%E7%89%88%E9%9D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const url = window.location.href;

    // 處理 supjav.com
    if (url.includes('https://supjav.com')) {
        let newUrl;

        // 條件1：替換語言路徑 (zh -> ja 或添加 ja)
        if (url.includes('/zh/')) {
            newUrl = url.replace(/\/zh\//, '/ja/');
        } else if (!url.includes('/ja/')) {
            newUrl = url.replace(/^https:\/\/supjav\.com/, 'https://supjav.com/ja');
        }

        // 條件2：處理 FC2 參數（無論是否已修改語言路徑）
        if (url.includes('s=FC2-')) {
            // 使用正則移除 FC2- 前綴，允許參數後有其他內容（如 &page=1）
            newUrl = (newUrl || url).replace(/([?&])s=FC2-(\d{6,7})(&|$)/, '$1s=$2$3');
            console.log('檢測到 FC2- 參數，已替換為:', newUrl);
        }

        // 避免無限重定向
        if (newUrl && newUrl !== url) {
            window.location.href = newUrl;
        }
    }

    // 處理 jable.tv
    else if (url.includes('https://jable.tv')) {
        let newUrl = url.replace(/\?lang=[en|zh]{2}/, '?lang=jp');
        if (!newUrl.includes('?lang=jp')) {
            newUrl = newUrl.endsWith('/') ? newUrl + '?lang=jp' : newUrl + '/?lang=jp';
        }
        window.location.href = newUrl;
    }

    // 處理 tktube.com
    else if (url.includes('https://tktube.com')) {
        if (url.includes('/ja/')) return;
        const regex = /^https:\/\/tktube\.com\/(\w{2}\/)?(.*)/;
        const match = regex.exec(url);
        if (match) {
            const newUrl = match[1]
                ? url.replace(/^https:\/\/tktube\.com\/\w{2}\//, 'https://tktube.com/ja/')
                : url.replace(/^https:\/\/tktube\.com\//, 'https://tktube.com/ja/');
            window.location.href = newUrl;
        }
    }

    // 處理 jpvhub.com
    else if (url.includes('https://www.jpvhub.com')) {
        if (url.includes('/jp/')) return;
        const newUrl = url.includes('/cn/')
            ? url.replace(/\/cn\//, '/jp/')
            : url.replace(/^https:\/\/www\.jpvhub\.com\//, 'https://www.jpvhub.com/jp/');
        window.location.href = newUrl;
    }
})();