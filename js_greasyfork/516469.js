// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-11-08-New
// @description  на сайте ленты пересчитывает вес продукта и цену в цену за кг
// @author       You
// @match        https://lenta.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lenta.com
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516469/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/516469/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // a.product-card p.card-name_content
    // a.product-card div.product-price span.main-price
    //




    setInterval(function() {
        console.log('SCRIPT STARTS HERE');

        if (window.location.href.indexOf('product') > -1) {

             console.log('SINGLE PRODUCT PAGE');
            let product = document.querySelector('div.product-page_info-block');
            let productTitleElem = product.querySelector('h1 span.product-package');
            product.title = productTitleElem.innerText;
            let productPriceElem = product.querySelector('div.product-price span.main-price');
            product.price = productPriceElem.innerText;
            let pricesDivElem = product.querySelector('div.product-price div.old-price-product');

            let condition = false;
            let titleStr = product.title;
            let priceStr = product.price;
            let regexp = /\d+Л|\d+L|\d+Мл|\d+МЛ|\d+мл|\d+л|\d+l|\d+Г|\d+Кг|\d+КГ|\d+кг|\d+г/g;
            condition = regexp.test(titleStr);

            if (condition) {
                let match = titleStr.match(regexp);
                if (/\d+Мл|\d+МЛ|\d+мл|\d+Кг|\d+КГ|\d+кг/g.test(titleStr)) {
                    //console.log('кг или мл');
                } else if (/\d+Л|\d+L|\d+л|\d+l/g.test(titleStr)) {
                    //console.log(match);
                    if (/\d+ ₽|\d+₽/g.test(priceStr)) {
                        console.log(titleStr);
                        console.log(priceStr);
                        //let matchPrc = priceStr.match(/\d+, \d+₽|\d+, \d+ ₽|\d+,\d+₽|\d+,\d+ ₽/g);
                        let matchPrc = priceStr.match(/(\d+\s)*\d+(,)*\s*\d*/g);
                        let price = matchPrc[0];
                        price = price.replace(/\₽|\ ₽/g, '');
                        price = price.replace(/\s+/, '');
                        price = price.replace(', ', '.');
                        price = price.replace(',', '.');
                        price = parseFloat(price);
                        let quantity = titleStr.match(/(\d+.|\d+,)*\s*\d+Л|(\d+.|\d+,)*\s*\d+л|(\d+.|\d+,)*\s*\d+L|(\d+.|\d+,)*\s*\d+l/g);
                        quantity = quantity[0];
                        quantity = quantity.replace(/\s+/, '');
                        quantity = quantity.replace(',', '.');
                        quantity = parseFloat(quantity);
                        console.log(quantity + ' литров');
                        console.log(' за ' + price + ' рублей');
                        let priceof = price / quantity;
                        priceof = parseInt(priceof);
                        console.log(priceof + ' руб за литр');
                        pricesDivElem.innerText = '';
                        pricesDivElem.appendChild(document.createTextNode(priceof + ' руб за литр'));
                    }

                } else if (/\d+Г|\d+г/g.test(titleStr)) {
                    //console.log(match);
                    if (/\d+ ₽|\d+₽/g.test(priceStr)) {
                        console.log(titleStr);
                        console.log(priceStr);
                        //let matchPrc = priceStr.match(/\d+, \d+₽|\d+, \d+ ₽|\d+,\d+₽|\d+,\d+ ₽/g);
                        let matchPrc = priceStr.match(/(\d+\s)*\d+(,)*\s*\d*/g);
                        let price = matchPrc[0];
                        price = price.replace(/\₽|\ ₽/g, '');
                        price = price.replace(/\s+/, '');
                        price = price.replace(', ', '.');
                        price = price.replace(',', '.');
                        price = parseFloat(price);
                        let quantity = titleStr.match(/(\d+.|\d+,)*\s*\d+Г|(\d+.|\d+,)*\s*\d+г/g);
                        quantity = quantity[0];
                        quantity = quantity.replace(/\s+/, '');
                        quantity = quantity.replace(',', '.');
                        quantity = parseFloat(quantity);
                        console.log(quantity + ' грамм');
                        console.log(' за ' + price + ' рублей');
                        let priceof = price / quantity * 1000;
                        priceof = parseInt(priceof);
                        console.log(priceof + ' руб за кг');
                        pricesDivElem.innerText = '';
                        pricesDivElem.appendChild(document.createTextNode(priceof + ' руб за кг'));
                    }


                }
            }




                   }




            let products = document.querySelectorAll('a.product-card');
            for (let i = 0; i < products.length; i++) {
                //console.log(products[i]);
                let titleElem;
                let condition2 = true;
                if (window.location.href.indexOf('catalog') > -1) {
                    console.log('CATALOG PAGE');
                    try {
                        titleElem = products[i].querySelector('p[class=card-name_package]');
                        products[i].title = titleElem.innerText;
                    } catch (err) {
                        let condition2 = false;
                        products[i].title = '';
                    }
                } else if (window.location.href.indexOf('product') > -1) {
                    console.log('SINGLE PRODUCT PAGE');
                    try {
                        titleElem = products[i].querySelector('p[class=card-name_package]');
                        products[i].title = titleElem.innerText;
                    } catch (err) {
                        let condition2 = false;
                        products[i].title = '';
                    }
                } else {
                    console.log('MAIN PAGE');
                     try {
                        titleElem = products[i].querySelector('p[class*=card-name]');
                        products[i].title = titleElem.innerText;
                    } catch (err) {
                        let condition2 = false;
                        products[i].title = '';
                    }

                }


                let priceElem = products[i].querySelector('div.product-price span.main-price');
                products[i].price = priceElem.innerText;
                let pricesDivElem = products[i].querySelector('div.product-price');
                //console.log(titleElem);
                //console.log(priceElem);



                let condition = false;
                let titleStr = products[i].title;
                let priceStr = products[i].price;
                //let regexp = /\d+Л|\d+Мл|\d+МЛ|\d+мл|\d+л|\d+Г|\d+Кг|\d+КГ|\d+кг|\d+г/g;
                let regexp = /\d+Л|\d+L|\d+Мл|\d+МЛ|\d+мл|\d+л|\d+l|\d+Г|\d+Кг|\d+КГ|\d+кг|\d+г/g;
                condition = regexp.test(titleStr);

                console.log(titleStr);
                console.log(priceStr);

                if (condition && condition2) {
                    let match = titleStr.match(regexp);
                    if (/\d+Мл|\d+МЛ|\d+мл|\d+Кг|\d+КГ|\d+кг/g.test(titleStr)) {
                        //console.log('кг или мл');
                    } else if (/\d+Л|\d+L|\d+л|\d+l/g.test(titleStr) && !products[i]['not-firstly']) {
                        //console.log(match);
                        if (/\d+ ₽|\d+₽/g.test(priceStr)) {
                            console.log(titleStr);
                            console.log(priceStr);
                            //let matchPrc = priceStr.match(/\d+, \d+₽|\d+, \d+ ₽|\d+,\d+₽|\d+,\d+ ₽/g);
                            let matchPrc = priceStr.match(/(\d+\s)*\d+(,)*\s*\d*/g);
                            let price = matchPrc[0];
                            price = price.replace(/\₽|\ ₽/g, '');
                            price = price.replace(/\s+/, '');
                            price = price.replace(', ', '.');
                            price = price.replace(',', '.');
                            price = parseFloat(price);
                            let quantity = titleStr.match(/(\d+.|\d+,)*\s*\d+Л|(\d+.|\d+,)*\s*\d+л|(\d+.|\d+,)*\s*\d+L|(\d+.|\d+,)*\s*\d+l/g);
                            quantity = quantity[0];
                            quantity = quantity.replace(/\s+/, '');
                            quantity = quantity.replace(',', '.');
                            quantity = parseFloat(quantity);
                            console.log(quantity + ' литров');
                            console.log(' за ' + price + ' рублей');
                            let priceof = price / quantity;
                            priceof = parseInt(priceof);
                            console.log(priceof + ' руб за литр');
                            pricesDivElem.appendChild(document.createTextNode(priceof + ' руб за литр'));
                            products[i]['not-firstly'] = true;
                        }

                    } else if (/\d+Г|\d+г/g.test(titleStr)) {
                        //console.log(match);
                        if (/\d+ ₽|\d+₽/g.test(priceStr) && !products[i]['not-firstly']) {
                            console.log(titleStr);
                            console.log(priceStr);
                            //let matchPrc = priceStr.match(/\d+, \d+₽|\d+, \d+ ₽|\d+,\d+₽|\d+,\d+ ₽/g);
                            let matchPrc = priceStr.match(/(\d+\s)*\d+(,)*\s*\d*/g);
                            let price = matchPrc[0];
                            price = price.replace(/\₽|\ ₽/g, '');
                            price = price.replace(/\s+/, '');
                            price = price.replace(', ', '.');
                            price = price.replace(',', '.');
                            price = parseFloat(price);
                            let quantity = titleStr.match(/(\d+.|\d+,)*\s*\d+Г|(\d+.|\d+,)*\s*\d+г/g);
                            quantity = quantity[0];
                            quantity = quantity.replace(/\s+/, '');
                            quantity = quantity.replace(',', '.');
                            quantity = parseFloat(quantity);
                            console.log(quantity + ' грамм');
                            console.log(' за ' + price + ' рублей');
                            let priceof = price / quantity * 1000;
                            priceof = parseInt(priceof);
                            console.log(priceof + ' руб за кг');
                            pricesDivElem.appendChild(document.createTextNode(priceof + ' руб за кг'));
                            products[i]['not-firstly'] = true;
                        }


                    }
                }

            }




    }, 2500);

})();