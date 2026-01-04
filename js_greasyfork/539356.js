// ==UserScript==
// @name         Buy Allしようとした時に確認ダイアログを表示させる。
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Display a confirmation dialog when attempting to 'Buy All' in Milky Way Idle
// @author       Osyaburiman
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539356/Buy%20All%E3%81%97%E3%82%88%E3%81%86%E3%81%A8%E3%81%97%E3%81%9F%E6%99%82%E3%81%AB%E7%A2%BA%E8%AA%8D%E3%83%80%E3%82%A4%E3%82%A2%E3%83%AD%E3%82%B0%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%95%E3%81%9B%E3%82%8B%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/539356/Buy%20All%E3%81%97%E3%82%88%E3%81%86%E3%81%A8%E3%81%97%E3%81%9F%E6%99%82%E3%81%AB%E7%A2%BA%E8%AA%8D%E3%83%80%E3%82%A4%E3%82%A2%E3%83%AD%E3%82%B0%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%95%E3%81%9B%E3%82%8B%E3%80%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ボタンのクリックイベントを監視
    document.addEventListener('click', function(e) {
        // クリックされた要素が指定のボタンクラスを持つか確認
        if (e.target.classList.contains('Button_button__1Fe9z') &&
            e.target.classList.contains('Button_fullWidth__17pVU') &&
            e.target.classList.contains('Button_small__3fqC7')) {

            const buttonText = e.target.textContent.trim();

            // "All"ボタンの処理
            if (buttonText === 'All') {
                const buyNowHeader = document.querySelector('div.MarketplacePanel_header__yahJo');
                if (buyNowHeader && buyNowHeader.textContent.trim() === 'Buy Now') {
                    if (!confirm('本当に全て購入しますか？')) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            }

            // "Max"ボタンの処理
            if (buttonText === 'Max') {
                const buyListingHeader = document.querySelector('div.MarketplacePanel_header__yahJo');
                if (buyListingHeader && buyListingHeader.textContent.trim() === 'Buy Listing') {
                    if (!confirm('本当に最大数購入しますか？')) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            }
        }
    }, true);
})();