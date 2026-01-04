// ==UserScript==
// @name         Checkout form helper
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  A helper to fill development forms
// @author       Hubertokf
// @match        *://*/*
// @grant        none
// @grant		 GM_addStyle
// @grant		 GM_getValue
// @grant		 GM_setValue
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519175/Checkout%20form%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/519175/Checkout%20form%20helper.meta.js
// ==/UserScript==
setInterval(()=>{
    var account = document.getElementsByClassName('planne-widget-account')
    var checkout = document.getElementsByClassName('planne-widget-checkout')

    if (checkout?.length < 1 && account?.length < 1) {
        return;
    }

    var source = document.getElementsByTagName('html')[0].innerHTML;
    var found = source.search("Na fatura do cartão, essa compra aparece em nome de");

    if (found === -1) {
        return;
    }

    var holder = document.getElementById('holder')
    var holderIdentity = document.getElementById('holderIdentity')
    var postalCode = document.getElementById('postalCode')
    var cardNumber = document.getElementById('cardNumber')
    var securityCode = document.getElementById('securityCode')
    var cardValidity = document.getElementById('cardValidity')

    holder.value = 'Huberto Kaiser Filho'
    holderIdentity.value = '57997829091'
    postalCode.value = '96020045'
    cardNumber.value = '4481530710186111'
    securityCode.value = '123'
    cardValidity.value = '12/29'

}, 2000);
