// ==UserScript==
// @name         Amazonでバリエーション毎の価格を表示
// @namespace    https://greasyfork.org/ja/users/856234-pushback
// @version      1.0.0
// @description  Amazonでバリエーション毎にポップアップする価格を常に表示する
// @author       pushback
// @match        https://www.amazon.co.jp/*/dp/*/*
// @match        https://www.amazon.co.jp/dp/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.co.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457550/Amazon%E3%81%A7%E3%83%90%E3%83%AA%E3%82%A8%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E6%AF%8E%E3%81%AE%E4%BE%A1%E6%A0%BC%E3%82%92%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/457550/Amazon%E3%81%A7%E3%83%90%E3%83%AA%E3%82%A8%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E6%AF%8E%E3%81%AE%E4%BE%A1%E6%A0%BC%E3%82%92%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const SET_TIMEOUT_LAG = 1000;
    window.addEventListener('load', () => setTimeout(() => {
        let styles = document.body.querySelectorAll('#twister-plus-inline-twister>div:last-child .a-list-item>span') ?? [];
        styles.forEach(style => style.addEventListener('click', () => setTimeout(showPrice, SET_TIMEOUT_LAG)));
        showPrice(true);
    }, SET_TIMEOUT_LAG));
    function showPrice(isAddClickEventListener) {
        const PRICE_CLASS_NAME = 'price-text';
        let items = document.body.querySelectorAll('span.' + PRICE_CLASS_NAME) ?? [];
        items.forEach(item => item.remove());
        let colors = document.body.querySelectorAll('#twister-plus-inline-twister>div:first-child .a-list-item>span') ?? [];
        colors.forEach(color => {
            if (isAddClickEventListener) {
                color.addEventListener('click', () => setTimeout(showPrice, SET_TIMEOUT_LAG));
            }
            let price = color.querySelector('.inline-twister-swatch-price, .default-slot-unavailable')?.innerText?.trim?.() + '';
            if (price.match(/^￥\d+/)) {
                let priceElement = document.createElement('span');
                priceElement.className = PRICE_CLASS_NAME;
                priceElement.innerText = price.replace(/から.+$/, '～');
                color.appendChild?.(priceElement);
            }
            // for debug
            // console.log(color);
        });
    }
})();