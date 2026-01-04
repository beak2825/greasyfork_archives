// ==UserScript==
// @name         AmazonBot
// @namespace    fufuying@lihkg
// @version      1
// @description  Five demands, not one less
// @author       fufuying@lihkg
// @match        https://www.amazon.co.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396324/AmazonBot.user.js
// @updateURL https://update.greasyfork.org/scripts/396324/AmazonBot.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getSeller() {
    try {
        return document.getElementById('merchant-info').getElementsByTagName('a')[0].text
    } catch (e) {
        return null
    }
}

(async function () {
    'use strict';
    
    const password = 'your password';
    const refresh_interval = 2000;
    const product_codes = ['B07573632C', 'B016DCAOOA', 'B07MJKHYDC', 'B07571223K', 'B07T3MNKKW', 'B07T5V4TCV', 'B0015R1BL4', 'B00FX4EBS0']

    const current_url = location.href;

    if (current_url.match('/signin*') !== null) {
        document.getElementById('ap_password').value = password;
        document.getElementById('signInSubmit').click();
    } else if (current_url.match('/product*')) {
        let seller = getSeller();
        let product_id = document.getElementById('ASIN').value
        // When out of stock
        console.log(product_codes.includes(product_id))
        if (product_codes.includes(product_id)) {
            while (seller !== 'Amazon.co.jp') {
                await sleep(refresh_interval)
                location.reload()
                seller = getSeller();
            }
            // When in stock
            document.getElementById('buy-now-button').click()
        }
    } else if (current_url.match('/buy/payselect/handlers/*')) {
        document.getElementsByName('ppw-widgetEvent:SetPaymentPlanSelectContinueEvent')[0].click()
    } else if (current_url.match('/gp/buy/spc/handlers/*')) {
        document.getElementsByName('placeYourOrder1')[0].click()
    }

})()