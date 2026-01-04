// ==UserScript==
// @name            Amazon_Keepa_Sakura_Button
// @name:ja         Amazonの商品画面に価格履歴とサクラチェックのボタンを追加
// @namespace       https://greasyfork.org/users/1324207
// @match           https://www.amazon.co.jp/dp/*
// @match           https://www.amazon.co.jp/*/dp/*
// @match           https://www.amazon.co.jp/gp/product/*
// @match           https://www.amazon.co.jp/exec/obidos/ASIN/*
// @match           https://www.amazon.co.jp/o/ASIN/*
// @match           https://www.amazon.co.jp/gp/aw/d/*
// @version         1.3.2
// @author          Lark8037
// @description     Add links to Keepa and Sakura Checker to the Amazon.co.jp product screen.
// @description:ja  Amazonの商品画面にKeepaとサクラチェッカーへのリンクを追加します。
// @license         MIT
// @icon            https://www.amazon.co.jp/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/498965/Amazon%E3%81%AE%E5%95%86%E5%93%81%E7%94%BB%E9%9D%A2%E3%81%AB%E4%BE%A1%E6%A0%BC%E5%B1%A5%E6%AD%B4%E3%81%A8%E3%82%B5%E3%82%AF%E3%83%A9%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%81%AE%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/498965/Amazon%E3%81%AE%E5%95%86%E5%93%81%E7%94%BB%E9%9D%A2%E3%81%AB%E4%BE%A1%E6%A0%BC%E5%B1%A5%E6%AD%B4%E3%81%A8%E3%82%B5%E3%82%AF%E3%83%A9%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%81%AE%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SELECTORS = ['#buyNow', '#add-to-cart-button', '#buybox .a-button-stack', '#add-to-cart-button-ubb', '#buybox-see-all-buying-choices', '#buybox-see-all-buying-choices-announce', '#rcx-subscribe-submit-button-announce', '#dealsAccordionRow', '#outOfStock'];

    if (!document.getElementById('checker-style')) {
        const s = document.createElement('style');
        s.id = 'checker-style';
        s.textContent = `.checker a{display:inline-block;border:0;height:4ex;line-height:4ex;margin-bottom:1.2ex;width:100%;text-align:center;color:black;border-radius:10em;text-decoration:none;font-size:1em}.sakura-checker-link{background:deeppink}.sakura-checker-link:hover{background:crimson}.price-history-link{background:deepskyblue}.price-history-link:hover{background:dodgerblue}@media screen and (max-width:768px){.checker a{height:5.5ex;line-height:5.5ex}}`;
        document.head.appendChild(s);
    }

    let lastASIN = '';
    const getASIN = () => {
        const m = location.pathname.match(/\/([A-Z0-9]{10})(?:[/?]|$)/);
        if (m) return m[1];
        const p = new URLSearchParams(location.search);
        return p.get('asin') || document.querySelector('[name="ASIN"], [name="ASIN.0"]')?.value || '';
    };

    const insertLinks = () => {
        const asin = getASIN();
        if (!asin || asin === lastASIN || document.getElementById('checker-links')) return;
        lastASIN = asin;

        let target;
        for (const sel of SELECTORS) {
            const el = document.querySelector(sel);
            if (el) {
                target = el.closest('div.a-section') || el.parentElement;
                break;
            }
        }
        if (!target) return;

        const c = document.createElement('div');
        c.id = 'checker-links';
        c.className = 'checker';

        for (const [href, text, cls] of [
            [`https://keepa.com/#!product/5-${asin}`, '価格履歴', 'price-history-link'],
            [`https://sakura-checker.jp/search/${asin}/`, 'サクラチェック', 'sakura-checker-link']
        ]) {
            const a = document.createElement('a');
            a.href = href;
            a.textContent = text;
            a.className = cls;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            c.appendChild(a);
        }
        target.after(c);
    };

    new MutationObserver(insertLinks).observe(document.body, { childList: true, subtree: true });
    insertLinks();
})();