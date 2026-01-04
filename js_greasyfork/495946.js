// ==UserScript==
// @name         Bandai
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Take over ariel
// @author       Ken Kwok
// @match        https://p-bandai.com/hk/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=p-bandai.com
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/495946/Bandai.user.js
// @updateURL https://update.greasyfork.org/scripts/495946/Bandai.meta.js
// ==/UserScript==
var myJq = $.noConflict();
(async function() {
    // Set the URL of the item page to navigate to
    const itemUrl = "https://p-bandai.com/hk/item/N2712172001001",
          cartUrl = "https://p-bandai.com/hk/cart",
          checkoutUrl = "https://p-bandai.com/hk/checkout/orderinformation",
          checkoutUrlPayment = "https://p-bandai.com/hk/checkout/orderinformation/#paymentinfo",
          confirmUrl = "https://p-bandai.com/hk/checkout/confirm";

    // Check if the current page is the item page
    if (window.location.href === itemUrl) {
        // Find the "Add to Cart" button and click it
        var addToCartButton = myJq('#addToCartButton');
        var prdouctName = myJq('.o-product__name');
        while(prdouctName.length == 0)
        {
            await sleep(100);
            prdouctName = myJq('.o-product__name');
        }
        if(addToCartButton)
        {
            if(addToCartButton.attr('disabled'))
            {
                setTimeout(function(){
                    location.reload();
                }, 500);
                console.log(addToCartButton.attr('disabled'));
            }
            else if(addToCartButton.length > 0)
            {
                addToCartButton.click();
                await sleep(1000);
                window.location.href = '/hk/cart';
            }
            else
            {
                location.reload();
            }
        }
        else
        {
            //location.reload();
        }
    } else if (window.location.href === cartUrl) {
        let emptyAlert = myJq(".a-alert.a-alert--danger.a-alert--center"),
            purchaseButton = myJq('.m-cart--foot__fee__btn');
        console.log(purchaseButton);
        if(emptyAlert.length > 0)
        {
            window.location.href = itemUrl;
        }
        else if(purchaseButton.length > 0)
        {
            window.location.href = purchaseButton.find('a').attr('href');
        }
        else
        {
            location.reload();
        }
    } else if(window.location.href === checkoutUrl || window.location.href === checkoutUrlPayment){
        let paymentMethod = myJq('label[for="radio-0"]');
        console.log(paymentMethod);
        if(paymentMethod){
            if(paymentMethod.hasClass('is-radio-checked'))
            {
                document.getElementById("confirmOrderInfo").click();
            }
            else
            {
                paymentMethod.click();
            }
        }
        else
        {
            location.reload();
        }
    } else if (window.location.href === confirmUrl){
        try{
            document.getElementsByClassName('a-input-checkbox')[0].click();
            document.getElementById("orderInfoConfirmBtn").click();
        }catch(err){
            console.log(err);
            window.location.href = confirmUrl
        }
    }
})();

async function sleep(ms = 3000)
{
    return new Promise(r => setTimeout(r, ms));
}