// ==UserScript==
// @name         隱藏特定學校文章 - Dcard
// @name:en      Hide Specific School Posts - Dcard
// @description  在 Dcard 隱藏來自特定學校的文章
// @description:en This script hides posts from specific schools on Dcard.
// @namespace    http://tampermonkey.net/
// @version      0.4.4
// @match        https://www.dcard.tw/*
// @grant        none
// @author       Franky
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516827/%E9%9A%B1%E8%97%8F%E7%89%B9%E5%AE%9A%E5%AD%B8%E6%A0%A1%E6%96%87%E7%AB%A0%20-%20Dcard.user.js
// @updateURL https://update.greasyfork.org/scripts/516827/%E9%9A%B1%E8%97%8F%E7%89%B9%E5%AE%9A%E5%AD%B8%E6%A0%A1%E6%96%87%E7%AB%A0%20-%20Dcard.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 設定要屏蔽的學校名稱
    const blockedSchools = [
        "國立清華大學",
        "國立中正大學",
        "玄奘大學",
        "國立空中大學",
        "臺北醫學大學 醫學系"
    ];

    // 改進：使用正則表達式來處理學校名稱，忽略可能的空格或大小寫差異
    function matchSchool(schoolName) {
        return blockedSchools.some(blockedSchool =>
            new RegExp(`^${blockedSchool}$`, 'i').test(schoolName)
        );
    }

    // 隱藏文章的功能
    function hideBlockedSchoolPosts() {
        // 隱藏主頁文章
        const articles = document.querySelectorAll("article");
        articles.forEach(article => {
            const schoolElement = article.querySelector(".d_xa_2b.d_tx_2c.d_lc_1u.ljv2to8");
            if (schoolElement) {
                const schoolName = schoolElement.textContent.trim();
                if (matchSchool(schoolName)) {
                    article.style.display = "none";
                }
            }
        });

        // 隱藏列表中的特定文章
        const listArticles = document.querySelectorAll("div[role=article]");
        listArticles.forEach(article => {
            const schoolElement = article.querySelector(".d_xa_2b.d_tx_2c.d_lc_1u.ljv2to8");
            if (schoolElement) {
                const schoolName = schoolElement.textContent.trim();
                if (matchSchool(schoolName)) {
                    article.style.display = "none";
                }
            }
        });
    }

    // 初始化監聽器
    function initObserver() {
        if (window.articleObserver) {
            window.articleObserver.disconnect();
        }

        hideBlockedSchoolPosts();

        const observer = new MutationObserver(hideBlockedSchoolPosts);
        observer.observe(document.body, { childList: true, subtree: true });
        window.articleObserver = observer;
    }

    // 初次執行與設定觀察器
    initObserver();

    // 監測 URL 變化以處理單頁應用
    let lastPathname = location.pathname;
    setInterval(() => {
        if (location.pathname !== lastPathname) {
            lastPathname = location.pathname;
            initObserver();
        }
    }, 1000);
})();
