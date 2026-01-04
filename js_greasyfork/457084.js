// ==UserScript==
// @name        縮減蝦皮網址
// @namespace   https://greasyfork.org/zh-TW/scripts/457084
// @match       *shopee.tw/*
// @author      czh
// @icon        https://www.google.com/s2/favicons?sz=64&domain=shopee.tw
// @run-at      document-start
// @license     GNU GPLv3
// @description 網址只留下識別碼
// @version 0.0.2.2
// @downloadURL https://update.greasyfork.org/scripts/457084/%E7%B8%AE%E6%B8%9B%E8%9D%A6%E7%9A%AE%E7%B6%B2%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/457084/%E7%B8%AE%E6%B8%9B%E8%9D%A6%E7%9A%AE%E7%B6%B2%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 更新後的正規表達式，現在支援三種格式：
    // 1. 標準型：-i.shopId.itemId
    // 2. 加購型：deals/shopId/.../itemId
    // 3. 直接型：product/shopId/itemId (您提供的這款)
    const shopeeRegex = /shopee\.tw\/(?:.*-i\.(\d+)\.(\d+)|.*deals\/(\d+)\/.*\/(\d+)|product\/(\d+)\/(\d+))/;
    let lastHandledUrl = '';

    function processUrl() {
        const currentUrl = window.location.href;

        // 如果目前網址和上次處理的一樣，就不重複執行
        if (currentUrl === lastHandledUrl) {
            return;
        }

        const match = currentUrl.match(shopeeRegex);

        if (match) {
            let shopId, itemId;

            // 判斷是哪一種匹配格式並提取 ID
            if (match[1] && match[2]) {
                shopId = match[1];
                itemId = match[2];
            } else if (match[3] && match[4]) {
                shopId = match[3];
                itemId = match[4];
            } else if (match[5] && match[6]) {
                shopId = match[5];
                itemId = match[6];
            }

            if (shopId && itemId) {
                const newUrl = `https://shopee.tw/0-i.${shopId}.${itemId}`;

                // 如果已經是精簡網址，記錄下來並結束
                if (currentUrl === newUrl) {
                    lastHandledUrl = currentUrl;
                    return;
                }

                // 執行網址替換
                window.history.replaceState({}, '', newUrl);
                lastHandledUrl = newUrl;
                console.log("網址已成功縮短為:", newUrl);
            }
        }
    }

    // 蝦皮這類 SPA 網站，使用定時器檢查是最穩定的做法
    // 設定每 300 毫秒檢查一次，平衡效能與反應速度
    setInterval(processUrl, 300);

    // 頁面初次載入也跑一次
    window.addEventListener('load', processUrl);

})();