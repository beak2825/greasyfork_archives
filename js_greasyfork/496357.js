// ==UserScript==
// @name         隐藏国际版csp素材商店已下载的素材
// @namespace    https://github.com/asteltis/Hide-clip-studio-assets-purchased-materials
// @version      0.1
// @description  隐藏国际版csp素材商店已下载的素材|Hide clip-studio assets purchased materials
// @author       asteltis
// @match        https://assets.clip-studio.com/*
// @grant        none
// @license      GPL-3.0
// @supportURL   https://github.com/asteltis/Hide-clip-studio-assets-purchased-materials/issues
// @downloadURL https://update.greasyfork.org/scripts/496357/%E9%9A%90%E8%97%8F%E5%9B%BD%E9%99%85%E7%89%88csp%E7%B4%A0%E6%9D%90%E5%95%86%E5%BA%97%E5%B7%B2%E4%B8%8B%E8%BD%BD%E7%9A%84%E7%B4%A0%E6%9D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/496357/%E9%9A%90%E8%97%8F%E5%9B%BD%E9%99%85%E7%89%88csp%E7%B4%A0%E6%9D%90%E5%95%86%E5%BA%97%E5%B7%B2%E4%B8%8B%E8%BD%BD%E7%9A%84%E7%B4%A0%E6%9D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用于隐藏已购买的材料卡片
    const hidePurchasedCards = () => {
        const cardPanel = document.querySelector('.layput__cardPanel');
        if (!cardPanel) return;

        const materialCards = cardPanel.querySelectorAll('.materialCard');
        materialCards.forEach(card => {
            const isPurchased = card.querySelector('.fa-check-circle');
            if (isPurchased) {
                card.style.display = 'none';
            }
        });
    };

    const observerCallback = mutations => {
        const cardPanel = document.querySelector('.layput__cardPanel');
        if (!cardPanel) return;

        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                hidePurchasedCards();
            }
        });
    };

    const observer = new MutationObserver(observerCallback);

    window.addEventListener('load', () => {
        const cardPanel = document.querySelector('.layput__cardPanel');
        if (cardPanel) {
            observer.observe(cardPanel, { childList: true, subtree: true });
            hidePurchasedCards();
        }
    });
})();
