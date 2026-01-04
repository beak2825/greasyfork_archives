// ==UserScript==
// @name         万宝楼剑网3剩余时间转换为结束时间点
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  将万宝楼剑网3页面上的剩余时间转换为结束时间点
// @author       zx he
// @match        https://jx3.seasunwbl.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523633/%E4%B8%87%E5%AE%9D%E6%A5%BC%E5%89%91%E7%BD%913%E5%89%A9%E4%BD%99%E6%97%B6%E9%97%B4%E8%BD%AC%E6%8D%A2%E4%B8%BA%E7%BB%93%E6%9D%9F%E6%97%B6%E9%97%B4%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/523633/%E4%B8%87%E5%AE%9D%E6%A5%BC%E5%89%91%E7%BD%913%E5%89%A9%E4%BD%99%E6%97%B6%E9%97%B4%E8%BD%AC%E6%8D%A2%E4%B8%BA%E7%BB%93%E6%9D%9F%E6%97%B6%E9%97%B4%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function formatTime(endTime) {
        const month = String(endTime.getMonth() + 1).padStart(2, '0');
        const day = String(endTime.getDate()).padStart(2, '0');
        const hours = String(endTime.getHours()).padStart(2, '0');
        const minutes = String(endTime.getMinutes()).padStart(2, '0');
        return `${month}-${day} ${hours}:${minutes}`;
    }

    function convertRemainingTime() {
        const now = new Date();
        const selectors = [
            '[class*="app-web-page-buyer-components-skin-list-index-m__countingContainer--"]',
            '[class*="app-web-page-buyer-components-coin-list-components-list-item-index-m__tableItemChild--"]',
            '[class*="app-web-page-buyer-components-role-list-index-m__roleItemColumn--1Edir app-web-page-buyer-components-role-list-index-m__roleItemLeftTime--"]',
            '[class*="app-web-page-follow-components-styles-components-m_ponents-m_"]',
            '[class*="app-web-page-follow-components-styles-components-m__directionColumn--"]',
            '[class*="app-web-components-data-table-styles-skin_consignment_item-m__flexWrap--19dss app-web-components-data-table-styles-skin_consignment_item-m__jcCenter--HhQBr"]',
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                const timeText = element.textContent.trim();
                const timeMatch = timeText.match(/(\d+)时(\d+)分/);

                if (timeMatch) {
                    const hours = parseInt(timeMatch[1], 10);
                    const minutes = parseInt(timeMatch[2], 10);
                    const endTime = new Date(now.getTime() + hours * 3600000 + minutes * 60000);
                    element.textContent = formatTime(endTime);
                }
            });
        });
    }

    const observer = new MutationObserver(convertRemainingTime);
    observer.observe(document.body, { childList: true, subtree: true });
})();