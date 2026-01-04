// ==UserScript==
// @name         AmazonBot
// @namespace    fufuying@lihkg
// @version      2.1
// @description  Five demands, not one less
// @author       fufuying@lihkg
// @match        https://www.amazon.co.jp/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/396332/AmazonBot.user.js
// @updateURL https://update.greasyfork.org/scripts/396332/AmazonBot.meta.js
// ==/UserScript==
(async function () {
    'use strict';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getSeller() {
        try {
            return document.getElementsByClassName('olpSellerName')[0].getElementsByTagName('img')[0].alt
        } catch (e) {
            return null
        }
    }

    function getPrice() {
        try {
            return Number(document.getElementsByClassName('olpOfferPrice')[0].innerHTML.replace(/,|￥/, '').trim())
        } catch (e) {
            return -1
        }
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const refresh_interval = getRandomInt(1, 3) * 1000;
    const product_ids = ['B07T5V4TCV','B07T3MNKKW','B07571223K','B07MJKHYDC','B07YY9T1FQ','B07YXX6SJF','B074KG65R9','B01HNYW39G','B07YXX7ZDN','B07YY9Q6LK','B074KBQXNW']
// const product_ids = ['B07YXX6SJF', 'B07YY9T1FQ', 'B07573632C', 'B016DCAOOA', 'B07MJKHYDC', 'B07571223K', 'B07T3MNKKW', 'B07T5V4TCV', 'B00FX4EBS0', 'B083JK8ZYD']
    const max_price = 2000;
    const password = 'your password'

    const current_url = location.href;
    let product_id = sessionStorage.getItem('id')
    let product_offer_list_url = `https://www.amazon.co.jp/gp/offer-listing/${product_id}`;
    let product_page_url = `https://www.amazon.co.jp/gp/product/${product_id}`;


    if (current_url.match('/activate_bot')) {
        for (const _product_id of product_ids) {
            GM_openInTab(`https://www.amazon.co.jp/gp/offer-listing/${_product_id}`);
        }
        document.getElementsByClassName('sans')[0].innerHTML = 'Bot has started successfully'
    } else if (current_url.match('/signin*')) {
        document.getElementById('ap_password').value = password
        document.getElementById('signInSubmit').click();
    } else if (current_url.match('/offer-listing/*')) {
        const product_id = current_url.substring('https://www.amazon.co.jp/gp/offer-listing/'.length, 'https://www.amazon.co.jp/gp/offer-listing/'.length + 10)
        sessionStorage.setItem('id', product_id)
        let seller = getSeller();
        // When out of stock
        if (product_ids.includes(product_id)) {
            while (seller !== 'Amazon.co.jp') {
                await sleep(refresh_interval)
                location.reload(true)
                seller = getSeller();
            }
            // When in stock
            const price = getPrice();
            if (price < max_price && price > 0) {
                location.assign(product_page_url)
            } else {
                location.reload(true);
            }
        }
    } else if (current_url.match('/product/*')) {
        const one_click_btn = document.getElementById('oneClickBuyButton');
        const buy_now_btn = document.getElementById('buy-now-button');

        if (one_click_btn){
            if (product_ids.includes(product_id)) {
                one_click_btn.click();
            }
        } else if (buy_now_btn) {
            if (product_ids.includes(product_id)) {
                buy_now_btn.click();
            }
        } else {
            location.replace(product_offer_list_url);
        }
    } else if (current_url.match('/buy/payselect/handlers/*')) {
        document.getElementsByName('ppw-widgetEvent:SetPaymentPlanSelectContinueEvent')[0].click();
    } else if (current_url.match('/gp/buy/spc/handlers/*')) {
        document.getElementsByName('placeYourOrder1')[0].click()
    } else if (current_url.match('/cart*')) {
        if (product_id) {
            location.replace(product_offer_list_url);
        }
    }

})();