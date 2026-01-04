// ==UserScript==
// @name         Broodbode orderer
// @namespace    http://tampermonkey.net/
// @version      2024-08-02
// @description  Order Broodbode sandwiches
// @author       Julian Quispel
// @match        *://bestellen.broodbode.nl/*
// @icon         https://www.broodbode.nl/wp-content/uploads/2019/01/icoon-600.png
// @grant        window.onurlchange
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503848/Broodbode%20orderer.user.js
// @updateURL https://update.greasyfork.org/scripts/503848/Broodbode%20orderer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BREAD_TYPES = ['wit', 'grain', 'foca', 'spelt', 'g-vrij'];

    const order = new Map();

    function parseOrder(queryParams) {
        queryParams.entries().forEach(([key, amount]) => {
            console.log(key);
            const [product, type] = key.split("_");
            const productKey = product.trim().toLowerCase();

            const productOrder = order.get(productKey) ?? BREAD_TYPES.reduce((obj, type) => ({ [type]: 0, ...obj }), {});
            productOrder[type] += parseInt(amount);

            order.set(productKey, productOrder);
        });
    }

    async function doSomethingOnPage(path, queryParams) {
        if (path == '/') {
            parseOrder(queryParams);
            prefillDateAndPostalCode();
        }
        if (path == '/products') return prefillSandwiches();
    }

    async function prefillDateAndPostalCode() {
        document.querySelector('.react-datepicker__input-container input').click();
        document.querySelector('.react-datepicker__day--keyboard-selected').click();
        document.querySelector('input[name=postcode]').value = '7418AG';
        document.querySelector('input[value=bezorgen]').parentElement.parentElement.parentElement.click();
        document.querySelector('form button[type=submit]').click();
    }

    function prefillSandwiches() {
        const productMap = [...document.querySelectorAll('.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-5')]
            .filter((item) => !!item.textContent)
            .reduce((map, item) => ({ [item.textContent.trim().toLowerCase()]: item, ...map }), {});

        console.log(productMap);

        [...order.entries()].forEach(async ([key, values]) => {
            const valuesSorted = BREAD_TYPES.map((breadType) => values[breadType]);

            let element = productMap[key].nextSibling;

            for (const value of valuesSorted) {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        element = element.nextSibling;
                        const select = element.firstChild;
                        select.value = value;
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                        resolve();
                    }, 100);
                })
            }
        })
    }

    window.onload = () => {
        setTimeout(() => {
            doSomethingOnPage(document.location.pathname, new URLSearchParams(document.location.search));
        }, 500);
    };

    if (window.onurlchange === null) {
        window.addEventListener('urlchange', () => {
            doSomethingOnPage(document.location.pathname, new URLSearchParams(document.location.search));
        });
    }
})();