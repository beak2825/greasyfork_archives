// ==UserScript==
// @name         lazada-MR2RS
// @namespace    http://www.lazada.com.my/
// @version      0.7
// @description  Malaysian Lazada price in NPR
// @author       himalay
// @match        *://*.lazada.com.my/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31649/lazada-MR2RS.user.js
// @updateURL https://update.greasyfork.org/scripts/31649/lazada-MR2RS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sNumberWithCommas = x => {
        x = x.split('.');
        x[0] = x[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return x.join('.');
    };
    setTimeout(() => {
        fetch('https://api.eremit.com.my/EremitService.svc/GetExchangeRates')
            .then(res => res.json())
            .then(json => {
            const exchangeRateNp = json.ExchangeRatesList[5].ExchangeRate;
            console.log('Exchange rate for Np: ', exchangeRateNp);
            [...document.querySelectorAll('#special_currency_box')].map(e => e.parentElement.removeChild(e));
            [...document.querySelectorAll('.c-product-card__price-final,.c-product-card__old-price,#price_box,#special_price_box,.c-product-item__price,.c-product-item__price-old,.sale-price,.summary-subtotal .txt-right,.summary-total .txt-right,.total-price,[class*="sel-cart-item-total-"],.total_item .right_align')].map(p => {
                p.innerHTML = `Rs. ${sNumberWithCommas(((+p.textContent.replace(/[^\d.]/g, '')) * exchangeRateNp).toFixed(2))}`;
            });
        });
    }, 2000);
})();