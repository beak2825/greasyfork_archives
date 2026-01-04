// ==UserScript==
// @name         John Lewis show prices with staff discount
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removing the need to alt-tab to the calculator
// @author       Bzly
// @license      GNU GPLv3
// @match        https://www.johnlewis.com/*/p*
// @icon         data:image/svg+xml;utf-8,%3Csvg viewBox='0 0 144 92' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E:root %7Bfill: %23000;%7D@media (prefers-color-scheme:dark)%7B:root %7Bfill: %23fff;%7D%7D%3C/style%3E%3Crect x='52' width='92' height='92'%3E%3C/rect%3E%3Crect x='33' width='13' height='92'%3E%3C/rect%3E%3Crect x='16' width='8' height='92'%3E%3C/rect%3E%3Crect width='4' height='92'%3E%3C/rect%3E%3C/svg%3E
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443014/John%20Lewis%20show%20prices%20with%20staff%20discount.user.js
// @updateURL https://update.greasyfork.org/scripts/443014/John%20Lewis%20show%20prices%20with%20staff%20discount.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
/*jshint asi: true */

(function() {
    'use strict';

    const list = document.querySelectorAll('p.price:not(p.price-included-additional-services)')
    const product_code = document.querySelector("p.product-code").textContent.replace("Product code: ", "")
    const dissection = Number(product_code.slice(0,3))
    const twelve_perc = [583,584,614,689,815,855,856,868,817,857,865,866,873,887,888,889,890,823,831,835,859,867,897,824,825,828,837,858,898,704,708,802,826,827,829,830,834,838,869,893,894,895,896,884,101,899]
    const zero_perc = [860,861,833,519] //I think 813 and 519 are Apple/Android mobiles

    if (document.querySelector('span.price__previous') === null) { // if reduced to clear, don't bother
        list.forEach(e => { // they shouldn't be different prices, but hey, this is cheap
            const price = Number(e.textContent.trim().replace("£", ""))
            let discount = 0
            let disc_symb = " 🛇"
            if (twelve_perc.includes(dissection)) {
                discount = 0.12
                disc_symb = "⭣"
            } else if (!zero_perc.includes(dissection)) {
                discount = 0.25
                disc_symb = "⮇"
            }
            e.textContent = Intl.NumberFormat('en-GB', {style: 'currency', currency:'GBP'}).format(price * (1 - discount)) + disc_symb
            if (discount > 0) {
                e.style.color = 'green'
                e.textContent = e.textContent + " (was £" + price + ")"
            } else {
                e.style.color = 'red'
            }
        })
    }
})();