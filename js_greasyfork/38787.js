// ==UserScript==
// @name         Talibri: Market Copy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  complete market order form with copied listing info
// @author       Amraki
// @match        https://talibri.com/trade/1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38787/Talibri%3A%20Market%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/38787/Talibri%3A%20Market%20Copy.meta.js
// ==/UserScript==

$(function() {
    'use strict';

    console.log("Copy Market Order loaded");

    var copyOrder = (e) => {
        // open order dialog
        createOrder();

        // get parent element of clicked order
        var elListing = e.target.parentNode.parentNode;

        // save order details
        var item = $(elListing).find('.name')[0].innerText;
        var itemID = $(elListing).find('.name')[0].onmouseover.toString().split(', ').pop().split(')').shift();
        var quantity = $(elListing).find('.quantity')[0].innerText.replace(/,/g, '');
        var cost = $(elListing).find('.cost')[0].innerText;
        var action = ($(elListing).find('.actions .btn')[0].innerText == "Buy") ? "Sell" : "Buy";

        setTimeout(() => {
            //// set new order details ////
            // order type
            $('#order-type option').filter(function() { return $.trim($(this).text()) == action; }).prop('selected', true);

            // order item
            $('#order-item option:eq(0)').val(itemID);
            $('#order-item option:eq(0)').text(item);

            // quantity
            $('#order-quantity').val(quantity);

            // cost
            $('#order-cost-per-item').val(cost);
        }, 500);
    };

    function init() {
        setTimeout(function() {
            if ($('.actions>button:contains("Copy")').length > 0) { return; }
            if ($('.actions>button:contains("Sell")').length === 0 &&
                $('.actions>button:contains("Buy")').length === 0) { return; }

            // add copy button
            var copyBtn = $('<button name="button" type="submit" class="btn btn-success">Copy</button>');
            $('.actions').append(copyBtn);

            // assign function to copy buttons
            $('.actions').on("click", 'button:contains("Copy")' , (function(event) {
                copyOrder(event);
            }));
        }, 500);
    }

    $('div.order-filters').on("click", "a", init);
});