// ==UserScript==
// @name         Listia Mass Price Updater
// @namespace    http://tampermonkey.net/
// @version      0.12.1.222
// @description  When the price of XNK per dollar changes significantly, you need to mass update prices your Listia listings sometimes quickly. This Tampermonkey script will, upon a Listia listing being opened for editing, change the GetItNow price by multiplying by a predetermined value and automatically clicking the Update button. There is also a provision in this script to prevent updating during a browsing session, but if you close Chrome and reopen a listing in Chrome again, the price will again update.
// @author       Gostud on fiverr.com
// @match        https://www.listia.com/auction/edit/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374605/Listia%20Mass%20Price%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/374605/Listia%20Mass%20Price%20Updater.meta.js
// ==/UserScript==


(function() {
    'use strict';

    window.list_log = function() {
        var log = JSON.parse(localStorage.log || "[]");
        console.log(log);
    }

    window.onload = function() {
        var multiply = 0.965;
        var title = document.querySelector("#auction_form_auction_params_title").value
        var log = JSON.parse(localStorage.log || "[]")

        if(typeof sessionStorage[title] == "undefined") {
            var val = document.querySelector("#auction_form_auction_params_buy_bid-fixed_price");
            var logRow = title + " price updated from " + val.value + " to " + val.value * multiply
            log.push(logRow)
            localStorage.log = JSON.stringify(log)

            val.value = Math.round(val.value * multiply);
            sessionStorage[title] = true;

            setTimeout(function() {
                console.log("sending form!")
                document.querySelector(".submit_l[type=submit]").click()
            }, 3000)
        } else {
            console.log("Product updated recently!");
        }
    }

})();