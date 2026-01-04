// ==UserScript==
// @name         Shopee 短網址轉換 + 商品頁自動重整
// @namespace    https://greasyfork.org/zh-TW/users/1469475-ao-ao
// @version      1.0
// @description  將 Shopee 短網址轉換為原始商品頁，並在商品頁首次可見時自動重整一次。
// @author       AO-AO
// @match        https://shopee.tw/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536814/Shopee%20%E7%9F%AD%E7%B6%B2%E5%9D%80%E8%BD%89%E6%8F%9B%20%2B%20%E5%95%86%E5%93%81%E9%A0%81%E8%87%AA%E5%8B%95%E9%87%8D%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/536814/Shopee%20%E7%9F%AD%E7%B6%B2%E5%9D%80%E8%BD%89%E6%8F%9B%20%2B%20%E5%95%86%E5%93%81%E9%A0%81%E8%87%AA%E5%8B%95%E9%87%8D%E6%95%B4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const pathname = window.location.pathname;
    const reloadFlagKey = 'shopee_auto_reload_done';

    // 功能 1：短網址轉換
    const shortUrlMatch = pathname.match(/^\/a-i\.(\d+)\.(\d+)/);
    if (shortUrlMatch) {
        const sellerId = shortUrlMatch[1];
        const itemId = shortUrlMatch[2];
        const newUrl = `https://shopee.tw/product/${sellerId}/${itemId}`;
        console.log('[Shopee Script] 偵測到短網址，轉跳至原始商品頁:', newUrl);
        window.location.replace(newUrl);
        return; // 停止執行後續邏輯
    }

    // 功能 2：商品頁自動重整
    const isProductPage = /-i\.\d+\.\d+/.test(pathname);
    if (isProductPage && !sessionStorage.getItem(reloadFlagKey)) {
        const triggerReload = () => {
            if (document.visibilityState === 'visible') {
                console.log('[Shopee Script] 商品頁可見，執行重整');
                sessionStorage.setItem(reloadFlagKey, 'true');
                location.reload();
            } else {
                console.log('[Shopee Script] 商品頁尚未可見，等待中...');
            }
        };

        if (document.visibilityState === 'visible') {
            triggerReload();
        } else {
            document.addEventListener('visibilitychange', triggerReload);
        }
    } else if (!isProductPage) {
        // 非商品頁清除重整標記
        sessionStorage.removeItem(reloadFlagKey);
    }
})();
