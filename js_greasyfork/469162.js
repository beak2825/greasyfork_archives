// ==UserScript==
// @name         FLASH DIA SIGUIENTE
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Muestra las flash del día siguiente con los precios
// @author       xxdamage
// @match        https://www.miravia.es/flashsale*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=miravia.es
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/469162/FLASH%20DIA%20SIGUIENTE.user.js
// @updateURL https://update.greasyfork.org/scripts/469162/FLASH%20DIA%20SIGUIENTE.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                setTimeout(function () { resolve(document.querySelector(selector)) }, 200);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

(function() {
    'use strict';
    (function(open) {

        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("readystatechange", async function() {
                try {
                    if (this.response && typeof this.response === 'string' && this.response.includes("elements")) {
                        await waitForElm('[class^=ProductList--product_list] [class^=ProductCard--product_container]');

                        const elems = $('[class^=ProductList--product_list] [class^=ProductCard--product_container]');

                        let elements = null;

                        try {
                            elements = JSON.parse(this.response).data.result[1].elements;
                        } catch(err) {}

                        if (!Array.isArray(elements)) return true;

                        for (const element of elements) {
                            if (JSON.stringify(element).includes("itemUrl")) {
                                var item = element.data[0];
                                let divAdded = false;

                                elems.each(function() {
                                    const attachProduct = $(this).attr('data-attach-product');
                                    if (attachProduct == item.id && !$(this).hasClass('divAdded')) {
                                        $(this).addClass('divAdded');
                                        let [integer, decimal] = item.itemDiscountPrice.split(',');
                                        let priceElem = $(this).find('[class^=Price--price--]');
                                        let priceIntegerElem = priceElem.find('[class^=Price--price_integer]');
                                        priceIntegerElem.text(integer);

                                        let priceDecimalElem = priceElem.find('[class^=Price--price_decimal]');


                                        if (decimal) priceDecimalElem.text(`,${decimal}€`);
                                        priceElem.css({ color: 'blue' })
                                        priceIntegerElem.css({ fontSize: '22px' })
                                        priceDecimalElem.css({ fontSize: '22px' })

                                    }
                                });
                            }
                        }
                    }
                } catch (error) { console.log(error); }
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);
})();