
// ==UserScript==
// @name         FreeFaucet AutoRoll Script.FREE CRYPTO EVERY 15min!!!
// @namespace    https://greasyfork.org/en/users/1001944-faucetpay
// @version      1.01
// @description  AutoRoll Script autoroll and autocloseing
// @author       Faucetpay
// @match        https://bigbtc.win/*
// @match        https://cryptowin.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @create       23/12/2022
// @downloadURL https://update.greasyfork.org/scripts/457064/FreeFaucet%20AutoRoll%20ScriptFREE%20CRYPTO%20EVERY%2015min%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/457064/FreeFaucet%20AutoRoll%20ScriptFREE%20CRYPTO%20EVERY%2015min%21%21%21.meta.js
// ==/UserScript==


const websites = [
    "bigbtc.win",
    "cryptowin.io"
]

setTimeout( function() {
    'use strict';

    if(document.querySelector(".h-captch > ifram").getAttribute("data-hcaptcha-response").length > 0) {
        document.querySelector( ".btn-success" ).click();
        Auto();
    } else {
        setTimeout( function() {
            // auto reload page
            window.location.reload();
        }, 100000 );
    }


}, 4000 );


// Auto Page Switching
function Auto() {
    setTimeout( function() {
        var current_page_id = websites.indexOf( window.location.hostname )
        var next_page_id = ( current_page_id < websites.length - 1 ) ? current_page_id + 1 : 0;
        window.location.href = window.location.protocol + "//" + websites[ next_page_id ]
    }, 5000 );
}