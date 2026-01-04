// ==UserScript==
// @name         移除 X.com 为你推荐
// @namespace    https://github.com/JoneWang
// @version      0.1
// @description  自动移除 X.com (原Twitter) 上的"为你推荐"内容
// @author       Jone Wang
// @match        https://x.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519722/%E7%A7%BB%E9%99%A4%20Xcom%20%E4%B8%BA%E4%BD%A0%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/519722/%E7%A7%BB%E9%99%A4%20Xcom%20%E4%B8%BA%E4%BD%A0%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeRecommendations() {
        const tablist = document.querySelector('[role="tablist"]');

        if (tablist) {
            const firstTab = tablist.querySelector('[role="presentation"]');
            if (firstTab) {
                firstTab.style.display = 'none';
            }
        }
    }

    removeRecommendations();

    const observer = new MutationObserver((mutations) => {
        removeRecommendations();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();