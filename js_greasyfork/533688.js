// ==UserScript==
// @name         Ali Total Price
// @author       AndShy
// @description  Shows Total Price on Aliexpress
// @version      2.14
// @license      GPL-3.0
// @namespace    https://github.com/AndShy
// @homepageURL  https://github.com/AndShy/Ali-Total-Price
// @match        *://*.aliexpress.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533688/Ali%20Total%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/533688/Ali%20Total%20Price.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pathRegExp1 = /\/item\//i
    var pathRegExp2 = /\/product\//i
    var pathRegExp3 = /\/w\//i;
    var pathRegExp4 = /\/af\//i;
    var pathRegExp5 = /\/wholesale/i;
    var pN = window.location.pathname;
    var currency;

    switch(true){
        case pathRegExp1.test(pN):
        case pathRegExp2.test(pN):
            itemPageObserver();
            break;

        case pathRegExp3.test(pN):
        case pathRegExp4.test(pN):
        case pathRegExp5.test(pN):
            searchPageObserver();
            break;

        default:
            return;
    }

    function searchPageObserver() {
        const searchObserverConf = {childList: true, subtree: true};
        var searchObserver = new MutationObserver(LazyLoadOnSearch);
        var timer1 = setInterval(function() {
            currency = document.querySelector('#switcher-info > span.currency');
            if (currency) {
                if (currency.innerText.length == 3) {
                    currency = currency.innerText;
                    clearInterval(timer1);
                    var listItems = document.querySelector('ul.list-items');
                    if (listItems) {searchObserver.observe (listItems,searchObserverConf)};
                    LazyLoadOnSearch();
                }
            }
        },100)
    }

    function itemPageObserver() {
        const itemObserverConf1 = {attributes: true, attributeFilter: ['value'], childList: false, subtree: false};
        const itemObserverConf2 = {attributes: true, childList: false, subtree: true, characterData: true};
        const itemObserverConf3 = {attributes: true, childList: true, subtree: true, characterData: true};
        var priceEl = document.querySelector('span.uniform-banner-box-price');
        if (!priceEl) priceEl = document.querySelector('div.product-price');
        var quantInpEl = document.querySelector('span.next-input.next-medium.next-input-group-auto-width > input');
        var shippingEl = document.querySelector('div.product-dynamic-shipping > div > div.dynamic-shipping');
        var itemObserver = new MutationObserver(refreshItemValues);
        var timer1 = setInterval(function() {
            currency = document.querySelector('#switcher-info > span.currency');
            if (currency) {
                if (currency.innerText.length == 3) {
                    currency = currency.innerText;
                    clearInterval(timer1);
                    itemInsertHTML();
                    if (quantInpEl) itemObserver.observe(quantInpEl, itemObserverConf1);
                    if (priceEl) itemObserver.observe(priceEl, itemObserverConf2);
                    if (shippingEl) itemObserver.observe(shippingEl, itemObserverConf3);
                    refreshItemValues();
                }
            }

        },100)

    }

    function itemInsertHTML() {
        var lotEl = document.querySelector('div.product-price-current.lot');
        var productInfo = document.querySelector('div.product-info');
        if (productInfo){
            var totPrice = document.createElement('div');
            totPrice.innerHTML =
            "<div class='bold' title='1 pcs/lot price = (base price * quantity + shipping cost)/quantity' style='font-size:14px; background-color:#f0f0f0'>" +
            "<span>One piece/lot price:&nbsp;&nbsp;</span><span id='pcs_prc' style='color:blue;'>---</span></div>" +
            "<div class='bold' style='font-size:24px'><span>Total Price:&nbsp;&nbsp;</span><span id='ttl_prc' style='color:red'>---</span></div>";
            productInfo.insertBefore(totPrice, productInfo.querySelector('div.product-action'));
            if (lotEl) {
                var lot_html =
                "<span class='bold' title='price for 1pcs from lot' style='font-size:14px; color:black'>&nbsp;&nbsp;&nbsp;1pcs:&nbsp;" +
                "<span id='lot_pcs_prc' style='color:green;'>---</span></span>";
                /*var lot_html =
                    "<table cellspacing='0' cellpadding='0' style='margin-left: 0;border-collapse: collapse;color:black;font-size: 10px;display: inline;' class='bold'>" +
                    "<tbody><tr align='center'><td>lot price</td><td rowspan='3'>&nbsp;=&nbsp;</td><td rowspan='3' id='lot_pcs_prc' style='font-size: 14px;'>test3</td>" +
                    "</tr><tr align='center'><td><tt>——————</tt></td></tr><tr align='center'><td>lot pcs</td></tr></tbody></table>";*/
                lotEl.insertAdjacentHTML('beforeend', lot_html);
            }
        }
    }

    function refreshItemValues() {
        var myPcsPrcEl = document.getElementById('pcs_prc');
        var myTtlPrcEl = document.getElementById('ttl_prc');
        var myLotPcsPrcEl = document.getElementById('lot_pcs_prc');
        var lotEl = document.querySelector('span.product-price-piece');
        var shCostEl = document.querySelector("div.product-dynamic-shipping > div > div > div > span > span > strong")
        var quantInpEl = document.querySelector('span.next-input.next-medium.next-input-group-auto-width > input');
        var itemPriceEl = document.querySelector('div.product-price-current > span.product-price-value');

        if (!itemPriceEl) {
            itemPriceEl = document.querySelector('div > span.oyuLA');
            if (!itemPriceEl) {itemPriceEl = document.querySelector('span.uniform-banner-box-price')}
        }
        if (!!itemPriceEl && !!shCostEl && !!quantInpEl) {
            if (!itemPriceEl.innerText.includes(' - ')) {
                var itemPriceValue, shCostValue, tmp;
                itemPriceValue = strToCurrency(itemPriceEl.innerText.split(' /')[0]);
                shCostValue = strToCurrency(shCostEl.innerText);
                tmp = (+itemPriceValue * +quantInpEl.value) + +shCostValue;
                myTtlPrcEl.innerText = calcTotalPrice(tmp, 2);
                myPcsPrcEl.innerText = calcTotalPrice(tmp/+quantInpEl.value, 2);
                if (myLotPcsPrcEl) {
                    myLotPcsPrcEl.innerText = calcTotalPrice(+itemPriceValue/+lotEl.innerText.match(/\d+/), 5);
                }
            }
            else {
                myPcsPrcEl.innerText = '---';
                myTtlPrcEl.innerText = '---';
                if (myLotPcsPrcEl) myLotPcsPrcEl.innerText = '---';
            }
        }
        else {
            myPcsPrcEl.innerText = '---';
            myTtlPrcEl.innerText = '---';
            if (myLotPcsPrcEl) myLotPcsPrcEl.innerText = '---';
        }
    }

    function priceFromEl (el) {
        if (el) {
            if (el.innerText) {
                strToCurrency(el.innerText);
            }
        }
    }

    function LazyLoadOnSearch() {
        var prodList = document.querySelectorAll('div.product-info > div.hover-help > div.item-shipping-wrap');
        var prodGallery = document.querySelectorAll('div.right-zone > div.item-shipping-wrap');
        for (var i = 0, max_i = prodList.length; i < max_i; i++) {
            if (prodList[i].dataset.edited != 'True') {
                var packagingEl;
                var ttlPriceList = document.createElement('div');
                ttlPriceList.style = 'padding-bottom: 5px';
                prodList[i].parentNode.insertBefore(ttlPriceList, prodList[i].nextElementSibling);
                ttlPriceList.innerHTML =
                "<span class='item-shipping-wrap' style='font-size:12px; font-weight:bold'>Total Price:&nbsp;&nbsp;</span>" +
                "<span class='item-shipping-wrap' style='font-size:12px; color:red; font-weight:bold'>" + SearchPageTotalPrice(ttlPriceList) + "</span>";
                packagingEl = ttlPriceList.parentNode.querySelector('div.item-price-wrap > div.item-price-row.packaging-sale');
                if (packagingEl) {
                    packagingEl.style = 'display: block';
                    packagingEl.parentNode.parentNode.parentNode.parentNode.parentNode.classList.remove('packaging_sale');
                }
                prodList[i].dataset.edited = 'True';
            }
        }
        for (var j = 0, max_j = prodGallery.length; j < max_j; j++) {
            if (prodGallery[j].dataset.edited != 'True') {
                var ttlPriceGallery = document.createElement('div');
                ttlPriceGallery.style = 'padding-bottom: 5px';
                prodGallery[j].parentNode.insertBefore(ttlPriceGallery, prodGallery[j].nextElementSibling);
                ttlPriceGallery.innerHTML =
                "<span class='item-shipping-wrap' style='font-size:12px; font-weight:bold'>Total Price:&nbsp;&nbsp;</span>" +
                "<span class='item-shipping-wrap' style='font-size:12px; color:red; font-weight:bold'>" + SearchPageTotalPrice(ttlPriceGallery) + "</span>";

                prodGallery[j].dataset.edited = 'True';
            }
        }
    }

    function SearchPageTotalPrice (myEl) {
        if (myEl.parentNode.querySelector('span.price-current') && myEl.parentNode.querySelector('span.shipping-value')){
            var itemPriceEl = myEl.parentNode.querySelector('div.item-price-wrap > div > span.price-current');
            var shCostEl = myEl.parentNode.querySelector('div.item-shipping-wrap > span.shipping-value');
            var itemPriceValue = [], shCostValue;
            shCostValue = strToCurrency(shCostEl.innerText);
            if (itemPriceEl.innerText.includes(' - ')) {
                itemPriceValue = itemPriceEl.innerText.split(' - ');
                itemPriceValue[0] = strToCurrency(itemPriceValue[0]);
                itemPriceValue[1] = strToCurrency(itemPriceValue[1]);
                return (calcTotalPrice(+itemPriceValue[0] + +shCostValue, 2) + ' - ' + calcTotalPrice(+itemPriceValue[1] + +shCostValue, 2));
            }
            else {
                itemPriceValue[0] = strToCurrency(itemPriceEl.innerText);
                return (calcTotalPrice(+itemPriceValue[0] + +shCostValue, 2));
            }
        }
    }

    function strToCurrency (str) {
        var currencyRegExp = /^\D*?([\d\s\,\.]*?)(?:[\.\,](\d{2}))?\D*$/;
        var tmp = [];
        if (!str.match(/\d/)) return 0;
        //if (str.match(/[a-zA-Z]{4,}/)) return 0;
        tmp = currencyRegExp.exec(str);
        tmp[1] = tmp[1].replace(/\D+/g,'');
        return (tmp[1] + '.' + (tmp[2]?tmp[2]:'00'));
    }

    function calcTotalPrice(value, decDigits) {
        return new Intl.NumberFormat('us-US', {style: 'currency', currency: currency, minimumFractionDigits: decDigits, maximumFractionDigits: decDigits}).format(value);
    }

})();
