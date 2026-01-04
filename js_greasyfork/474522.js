// ==UserScript==
// @name         移除蝦皮廣告 (Remove Shopee Ads)
// @version      1.5.0
// @description  移除蝦皮廣告，移除那些容易誤點的廣告，避免使用者誤點商品。
// @author       Danny H.
// @match        https://shopee.tw/*
// @match        https://shopee.vn/*
// @match        https://shopee.co.id/*
// @match        https://shopee.com.my/*
// @match        https://shopee.co.th/*
// @match        https://shopee.ph/*
// @match        https://shopee.sg/*
// @match        https://shopee.com.br/*
// @icon         https://freepngimg.com/save/109004-shopee-logo-free-transparent-image-hq/128x128
// @grant        GM_addStyle
// @license      MIT
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @namespace    https://greasyfork.org/users/1166167
// @downloadURL https://update.greasyfork.org/scripts/474522/%E7%A7%BB%E9%99%A4%E8%9D%A6%E7%9A%AE%E5%BB%A3%E5%91%8A%20%28Remove%20Shopee%20Ads%29.user.js
// @updateURL https://update.greasyfork.org/scripts/474522/%E7%A7%BB%E9%99%A4%E8%9D%A6%E7%9A%AE%E5%BB%A3%E5%91%8A%20%28Remove%20Shopee%20Ads%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 新增高亮樣式
    GM_addStyle(`
        .highlight-region {
            background-color: yellow !important;
            font-weight: bold;
        }
    `);

    // 處理廣告移除
    function removeAds() {
        const $ads = $(':contains("AD"), :contains("Ad"), :contains("廣告")');
        $ads.each(function() {
            $(this).closest('.col-xs-2-4.shopee-search-item-result__item').hide();
            $(this).closest('.shopee_ic').hide();
            $(this).closest('.shopee_ic').parent().hide();
            $(this).closest('.Qnex0a').hide();
            $(this).closest('.QDF8HH.col-xs-2').hide();
            $(this).closest('.shopee-header-section.shopee-header-section--simple').hide();
        });
    }

    // 高亮特定區域
    function highlightRegions() {
        $('span.align-middle').each(function() {
            const text = $(this).text();
            if (text.includes("桃園市蘆竹區") || text.includes("桃園市大園區")) {
                $(this).addClass('highlight-region');
            }
        });
    }

    // 初始化 DOM 監聽
    function initObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    setTimeout(() => {
                        removeAds();
                        highlightRegions();
                    }, 500);  // 每次 DOM 變化後延遲 500ms 執行
                }
            });
        });

        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    }

    function onPageLoad() {
        setTimeout(() => {
            removeAds();
            highlightRegions();
            initObserver();
        }, 500);  // 頁面加載完成後延遲 500ms 執行
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onPageLoad);
    } else {
        onPageLoad();
    }

    // 應對網址變更
    window.addEventListener('locationchange', () => setTimeout(() => {
        removeAds();
        highlightRegions();
    }, 500));
})();
