// ==UserScript==
// @name            Shopify Backend Show Inventory in Orders
// @description     This simple script will show the product stock level in Shopify orders pages
// @namespace       cws-shopify-show-inventory-orders
// @author          Marco Ragogna
// @create          2021-05-11
// @version         1.0.8
// @include         https://*.myshopify.com/admin/orders/*
// @require         https://code.jquery.com/jquery-3.6.0.min.js
// @compatible      chrome
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/426282/Shopify%20Backend%20Show%20Inventory%20in%20Orders.user.js
// @updateURL https://update.greasyfork.org/scripts/426282/Shopify%20Backend%20Show%20Inventory%20in%20Orders.meta.js
// ==/UserScript==

"use strict";

//console.log('start script');

waitForElementToDisplay("#fulfillment-section", function () {
    init();
}, 1000, 10000);

function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
    var startTimeInMs = Date.now();
    (function loopSearch() {
        if (document.querySelector(selector) != null) {
            callback();
            return;
        } else {
            setTimeout(function () {
                if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) {
                    return;
                }
                loopSearch();
            }, checkFrequencyInMs);
        }
    })();
}

function init() {

    try {
        
        if (document.URL.indexOf("myshopify.com/admin") < 0) {
            throw 'Shopify admin backend not loaded';
        }
        if (typeof Shopify === 'undefined') {
            throw 'Shopify object undefined';
        }
        if (typeof jQuery === 'undefined') {
            throw 'jQuery object undefined';
        }

        console.log("Shopify script initialized");

        $('#fulfillment-section .ui-stack-item--fill a').each(function (i, elem) {
            var productLine = $(this);
            var parentRow = productLine.closest('.unfulfilled-card__line_item');
            var productPath = $(this).attr('href');
            var variantDetails = parentRow.find('.unfulfilled-card__line_item__secondary-details');
            $.ajax({
                type: "GET",
                url: productPath + '?view=json',
                dataType: 'json',
                success: function (d) {
                    //console.log(d);
                    if (d.variant.inventory_quantity >= 0) {
                        //parentRow.append('<div class="ui-stack-item" style="background-color: #dafcd0">Stock:' + d.variant.inventory_quantity + '</div>');
                        variantDetails.append('<span class="ui-text-style ui-text-style--variation-subdued" style="color: #4ea833"><p>Stock:' + d.variant.inventory_quantity + '</p></span>');
                    } else {
                        //arentRow.append('<div class="ui-stack-item" style="background-color: #fcd0d0">Stock:' + d.variant.inventory_quantity + '</div>');
                        variantDetails.append('<span class="ui-text-style ui-text-style--variation-subdued" style="color: #e13333"><p>Stock:' + d.variant.inventory_quantity + '</p></span>');
                    }
                }
            });

        });

    } catch (error) {
        console.log(error);
    }

}