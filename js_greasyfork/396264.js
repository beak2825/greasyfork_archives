// ==UserScript==
// @name         AmazonBot
// @namespace    fufuying@lihkg
// @version      3.11
// @description  :)
// @author       fufuying@lihkg
// @match        https://www.amazon.co.jp/*
// @downloadURL https://update.greasyfork.org/scripts/396264/AmazonBot.user.js
// @updateURL https://update.greasyfork.org/scripts/396264/AmazonBot.meta.js
// ==/UserScript==
(async function () {
    'use strict';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function isSoldByAmazon() {
        try {
            const current_page_type = sessionStorage.getItem('current_page_type');
            if (current_page_type == 'product') {
                return document.getElementById('merchant-info').children[0].innerText == 'Amazon.co.jp';
            } else if (current_page_type == 'offer_list') {
                return document.getElementsByClassName('olpSellerName')[0].getElementsByTagName('img')[0].alt == 'Amazon.co.jp';
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    function getPrice() {
        try {
            return Number(document.getElementsByClassName('olpOfferPrice')[0].innerText.replace(/(\D+)/g, ''));
        } catch (e) {
            return -1;
        }
    }

    async function reload() {
        const product_offer_list_url = `https://www.amazon.co.jp/gp/offer-listing/${product_id}`;
        const product_page_url = `https://www.amazon.co.jp/gp/product/${product_id}`;
        const current_page_type = sessionStorage.getItem('current_page_type');
        await sleep(refresh_interval);
        if (current_page_type == 'product') {
            location.replace(product_offer_list_url);
        } else if (current_page_type == 'offer_list') {
            location.replace(product_page_url);
        } else if (current_page_type == 'cart') {
            location.replace(cart_url);
        }
    }

    const refresh_interval = 2500;
    const product_ids = ['B07YXX6SJF', 'B07573632C', 'B016DCAOOA', 'B07MJKHYDC',
                         'B07571223K', 'B07T3MNKKW', 'B07T5V4TCV', 'B00FX4EBS0', 'B083JK8ZYD',
                         'B074KG65R9', 'B074KBQXNW', 'B083JKRB36'];

    const max_price = 2500;
    const password = 'your password';

    const current_url = location.href;
    const cart_url = 'https://www.amazon.co.jp/gp/cart/view.html?ref_=nav_cart';

    let product_id = sessionStorage.getItem('id');

    if (current_url.match('/activate_bot')) {
        for (const _product_id of product_ids) {
            window.open(`https://www.amazon.co.jp/gp/offer-listing/${_product_id}`, _product_id, 'height=500,width=516');
        }
        window.open(cart_url, 'cart', 'height=500,width=516');
        document.getElementsByClassName('sans')[0].innerHTML = 'Bot has started successfully';
    } else if (current_url.match('/signin*')) {
        document.getElementById('ap_password').value = password;
        document.getElementById('signInSubmit').click();
    } else if (current_url.match('/offer-listing/*')) {
        product_id = current_url.substring('https://www.amazon.co.jp/gp/offer-listing/'.length, 'https://www.amazon.co.jp/gp/offer-listing/'.length + 10);
        sessionStorage.setItem('id', product_id);
        sessionStorage.setItem('current_page_type', 'offer_list');
        if (product_ids.includes(product_id)) {
            if (isSoldByAmazon()) {
                const price = getPrice();
                if (price > 0 && price < max_price) {
                    document.getElementsByName('submit.addToCart')[0].click();
                } else {
                    reload();
                }
            } else {
                console.log('out of stock');
                reload();
            }
        }
    } else if (current_url.match('/product/*')) {
        sessionStorage.setItem('current_page_type', 'product');
        if (product_ids.includes(product_id)) {
            const one_click_btn = document.getElementById('oneClickBuyButton');
            const buy_now_btn = document.getElementById('buy-now-button');
            const add_to_cart_btn = document.getElementById('add-to-cart-button');

            if (isSoldByAmazon()) {
                if (one_click_btn) {
                    one_click_btn.click();
                } else if (buy_now_btn) {
                    buy_now_btn.click();
                } else if (add_to_cart_btn) {
                    add_to_cart_btn.click();
                } else {
                    reload();
                }
            } else {
                console.log('out of stock');
                reload();
            }
        }

    } else if (current_url.match('/buy/payselect/handlers/*')) {
        document.getElementsByName('ppw-widgetEvent:SetPaymentPlanSelectContinueEvent')[0].click();
    } else if (current_url.match('/buy/spc/handlers/*')) {
        document.getElementsByName('placeYourOrder1')[0].click();
    } else if (current_url.match('/huc/*')) {
        document.getElementById('hlb-ptc-btn-native').click();
    } else if (current_url.match('/item-dispatch/*')) {
        const chk_out_button = document.getElementById('hlb-ptc-btn-native');
        if (chk_out_button) {
            location.replace(chk_out_button.href);
        } else {
            reload();
        }
    } else if (current_url.match('/buy/addressselect/*')) {
        document.querySelector('.ship-to-this-address > span > a').click();
    } else if (current_url.match('/buy/shipoptionselect/*')) {
        document.getElementsByClassName('sosp-continue-button')[0].click();
    } else if (current_url.match('/buy/thankyou/handlers/*')) {
        const current_page_type = sessionStorage.getItem('current_page_type');
        if (current_page_type == 'cart'){
            reload();
        } else {
            window.close()
        }
    } else if (current_url.match('/cart/view.html')) {
        if (product_id) {
            reload();
        } else {
            sessionStorage.setItem('current_page_type', 'cart');
            let is_found = false;
            const save_for_later_product_rows = document.getElementsByClassName('sc-list-item');
            for (const save_for_later_product_row of save_for_later_product_rows) {
                if (product_ids.includes(save_for_later_product_row.getAttribute('data-asin'))) {
                   const move_to_cart_btn = save_for_later_product_row.querySelector('.sc-action-move-to-cart > span > input');
                   if (move_to_cart_btn) {
                       is_found = true;
                       move_to_cart_btn.click();
                       document.getElementsByName('proceedToRetailCheckout')[0].click();
                   }
                }
            }
            if (!is_found){
                reload();
            }
        }
    }

})();