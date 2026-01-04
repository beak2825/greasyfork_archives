// ==UserScript==
// @name         Switchere Add Apple Pay to your wallet
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world
// @author       You
// @match        https://switchere.com/de/onramp?sw_mode=cabinet&btcv=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      Luna-Lolita
// @downloadURL https://update.greasyfork.org/scripts/540492/Switchere%20Add%20Apple%20Pay%20to%20your%20wallet.user.js
// @updateURL https://update.greasyfork.org/scripts/540492/Switchere%20Add%20Apple%20Pay%20to%20your%20wallet.meta.js
// ==/UserScript==


/* https://switchere.com/de/onramp?btcv=5.00&sw_mode=cabinet#/ */

 setTimeout(function() {
    const queryString = window.location.search;
    console.log(queryString);
    const urlParams = new URLSearchParams(queryString);

    if ( ! urlParams.has('btca') ) {
        urlParams.append('btca', 'bc1qhlt2mtxfep2va9fmrlj6jy6q8fajl26sa2yuhf');
    }

    if ( ! urlParams.has('btcv') ) {
        urlParams.append('btcv', '5.00');
    }

    var btca = urlParams.get('btca');
    var btcv = urlParams.get('btcv');

    //alert(btcv);

    // https://switchere.com/de/onramp?sw_mode=cabinet#/

    var el = document.querySelector(".sw-payment-amount-input.sw-payment-input-group__amount-input");

    document.querySelector(".sw-payment-amount-input.sw-payment-input-group__amount-input").value=btcv;
    document.querySelector(".sw-payment-amount-input.sw-payment-input-group__amount-input").dispatchEvent(new KeyboardEvent('keydown', {'key': '0'}));
    document.querySelector(".sw-payment-amount-input.sw-payment-input-group__amount-input").dispatchEvent(new KeyboardEvent('keyup', {'key': '0'}));
    var evt = new CustomEvent('keyup');
    evt.which = 13;
    evt.keyCode = 13;
    el.dispatchEvent(evt);

    // document.querySelector(".sw-payment-currency-list .sw-payment-currency-list__item:nth-child(3)").click()
    // document.querySelector(".sw-payment-currency-list .sw-payment-currency-list__item:nth-child(2)").click()

    el = document.querySelector(".sw-payment-method-select.exchange-step__payment-method .sw-payment-method-select__image--applepay")
    if (el === undefined || el === null) {
        el = document.querySelector(".sw-payment-method-select.exchange-step__payment-method .sw-payment-method-select__image--googlepay")
    }

    setTimeout(function() {
        el.click()
    }, 500)

    setTimeout(function() {
        document.querySelector("button.btn-sw-primary").click()
    }, 500)

    setTimeout(function() {
        //#sele = document.querySelector(".sw-input__input.sw-input__input--simple")
        document.querySelector(".sw-select-wallet__list .sw-select-wallet__item").click()
        //sele = document.querySelector(".dst-address__input input[name='wallet']")
        // sele.value = btca
        setTimeout(function() {
            document.querySelector("button.btn-sw-primary").click()
        }, 500)
    }, 1000)
}, 1000);