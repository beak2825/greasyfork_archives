// ==UserScript==
// @name        Timely PayPal links
// @namespace   Timely PayPal links
// @description Adds PayPal Links in Timely which doesn't currently
// @license     MIT
// @author      joeltron
// @version     0.04
// @grant       none
// gettimley
// @include     *://gettimely.*
// @match       *://app.gettimely.com/Billing/ViewInvoice/*

// @downloadURL https://update.greasyfork.org/scripts/448209/Timely%20PayPal%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/448209/Timely%20PayPal%20links.meta.js
// ==/UserScript==
 
// Fix links
function doStuff() {
    console.log('running timely urler');
    console.log($('.view-invoice-info ul:first li').html());

    $('.view-invoice-info ul:first li').each(function(text) {
        var text=this.innerHTML.replace(/\(ref (.*?)\)/g, "(ref <a target=\"_BLANK\" href=\"https://www.paypal.com/activity/payment/$1\">$1</a>) [<a target=\"_BLANK\" href=\"https://www.paypal.com/activity/actions/refund/edit/$1\">REFUND</a>]");
        this.innerHTML=text;
    });
}
 
// Page loaded
setTimeout(doStuff, 1000);