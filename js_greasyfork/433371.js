// ==UserScript==
// @name         Scan bol.com category speelgoed
// @namespace    https://www.bol.com/nl/nl/l/speelgoed/
// @version      0.1
// @description  This will scan bol.com category speelgoed
// @author       angelo.ndira@gmail.com
// @match        https://www.bol.com/nl/nl/*
// @icon         https://www.google.com/s2/favicons?domain=bol.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433371/Scan%20bolcom%20category%20speelgoed.user.js
// @updateURL https://update.greasyfork.org/scripts/433371/Scan%20bolcom%20category%20speelgoed.meta.js
// ==/UserScript==
/*global jQuery $*/
var pageReloadInterval = 480000;

function strContains(text, searchFor) {
    return trimStringToLowerCase(text).includes(searchFor);
}

function trimStringToLowerCase(str) {
    return jQuery.trim(str).toLowerCase();
}

function readProductSnapshot(rowNode) {
    'use strict';
    console.log('----------');
    var productSnapshot = {};
    rowNode.find('ul.product-creator').each(function () {
        var rowNode_tmp = $(this);
        rowNode_tmp.find('a[itemprop|="name"]').each(function () {
            var rowNode_a_tmp = $(this);
            productSnapshot.make = jQuery.trim(rowNode_a_tmp.text());
            // console.log('creator: ' + productSnapshot.make);
        });
    });
    rowNode.find('a.product-title.px_list_page_product_click').each(function () {
        var rowNode_tmp = $(this);
        productSnapshot.product = jQuery.trim(rowNode_tmp.text());
        productSnapshot.product_link = window.location.protocol + '//' + window.location.host + rowNode_tmp.attr('href');
        // console.log('product: ' + productSnapshot.product);
        // console.log('product link: ' + productSnapshot.product_link);
    });
    rowNode.find('ul[data-test|="product-specs"]').each(function () {
        var rowNode_tmp = $(this);
        productSnapshot.product_specs = '';
        rowNode_tmp.find('li').each(function () {
            var rowNode_li = $(this);
            productSnapshot.product_specs = productSnapshot.product_specs + '|' + jQuery.trim(rowNode_li.text());
            if (typeof productSnapshot.product_age_group === 'undefined' && strContains(rowNode_li.text(), 'jaar')) {
                productSnapshot.product_age_group = jQuery.trim(rowNode_li.text());
                // console.log('product_age_group: ' + productSnapshot.product_age_group);
                return;
            }
            if (typeof productSnapshot.product_num_players === 'undefined' && strContains(rowNode_li.text(), 'spelers')) {
                productSnapshot.product_num_players = jQuery.trim(rowNode_li.text());
                // console.log('product_num_players: ' + productSnapshot.product_num_players);
                return;
            }
            if (typeof productSnapshot.product_play_time === 'undefined' && strContains(rowNode_li.text(), 'minuten')) {
                productSnapshot.product_play_time = jQuery.trim(rowNode_li.text());
                // console.log('product_play_time: ' + productSnapshot.product_play_time);
                return;
            }
            if (typeof productSnapshot.product_num_parts === 'undefined' && strContains(rowNode_li.text(), 'onderdelen')) {
                productSnapshot.product_num_parts = jQuery.trim(rowNode_li.text());
                // console.log('product_num_parts: ' + productSnapshot.product_num_parts);
                return;
            }
            if (typeof productSnapshot.product_num_minifigures === 'undefined' && strContains(rowNode_li.text(), 'minifiguren')) {
                productSnapshot.product_num_minifigures = jQuery.trim(rowNode_li.text());
                // console.log('product_num_minifigures: ' + productSnapshot.product_num_minifigures);
                return;
            }
            if (typeof productSnapshot.product_dimensions === 'undefined' && strContains(rowNode_li.text(), '(lxbxh)')) {
                productSnapshot.product_dimensions = jQuery.trim(rowNode_li.text());
                // console.log('product_dimensions: ' + productSnapshot.product_dimensions);
                return;
            }
        });
        productSnapshot.product_specs = productSnapshot.product_specs.substr(1);
        // console.log('product_specs: ' + productSnapshot.product_specs);
    });
    rowNode.find('p[data-test|="product-description"]').each(function () {
        var rowNode_tmp = $(this);
        productSnapshot.product_description = jQuery.trim(rowNode_tmp.contents().first().text());
        // console.log('product_description: ' + productSnapshot.product_description);
    });
    rowNode.find('meta[itemprop|="price"]').each(function () {
        var rowNode_tmp = $(this);
        productSnapshot.price = jQuery.trim(rowNode_tmp.attr('content'));
        // console.log('price: ' + productSnapshot.price);
    });
    rowNode.find('p[data-test|="discount-amount"]').each(function () {
        var rowNode_tmp = $(this);
        productSnapshot.discount_terms = jQuery.trim(rowNode_tmp.text());
        // console.log('discount_terms: ' + productSnapshot.discount_terms);
    });
    rowNode.find('div[data-test|="product-delivery-highlight"]').each(function () {
        var rowNode_tmp = $(this);
        productSnapshot.availability = jQuery.trim(rowNode_tmp.text());
        // console.log('availability: ' + productSnapshot.availability);
    });
    rowNode.find('a.product-seller__name').each(function () {
        var rowNode_tmp = $(this);
        productSnapshot.seller = jQuery.trim(rowNode_tmp.text());
        productSnapshot.seller_link = window.location.protocol + '//' + window.location.host + rowNode_tmp.attr('href');
        // console.log('seller: ' + productSnapshot.seller);
        // console.log('seller link: ' + productSnapshot.seller_link);
    });
    console.log(JSON.stringify(productSnapshot));
    sendJson(productSnapshot);
}

function repeatedExecution(elapsedTimeMillis) {
    'use strict';
    console.log("repeatedExecution()");
    if (elapsedTimeMillis > pageReloadInterval) {
        window.location.reload(false);
        return;
    }

    $(document).find('#js_items_content > li.product-item--row.js_item_root').each(function () {
        var rowNode_tmp = $(this);
        readProductSnapshot(rowNode_tmp);
    });

    let next_page_link;
    $(document).find('lu.pagination > li.pagination__controls.pagination__controls--next.js_pagination_item > a').each(function () {
        var rowNode_tmp = $(this);
        next_page_link = window.location.protocol + '//' + window.location.host + rowNode_tmp.attr('href');
    });
    if (typeof next_page_link === 'undefined') {
        $(document).find('lu.pagination > li.pagination__controls.pagination__controls--prev.js_pagination_item > a').each(function () {
            var rowNode_tmp = $(this);
            const regex = /page=\d+&/i;
            let href = rowNode_tmp.attr('href').replace(regex, 'page=1&')
            next_page_link = window.location.protocol + '//' + window.location.host + href;
            console.log('going back to page 1');
        });
    }
    if (typeof next_page_link === 'undefined') {
        console.log('could not find link to next page.');
    } else {
        console.log('next page link: ' + next_page_link);
    }
    // lu.pagination > li.pagination__controls.pagination__controls--prev.js_pagination_item > a
    // lu.pagination > li.pagination__controls.pagination__controls--next.js_pagination_item data-page-number="2" > a

    //console.log(JSON.stringify(pageSnapshot, null, 4));
    //elapsedTimeMillis += repeatExecutionInterval;
    //setTimeout(repeatedExecution, repeatExecutionInterval, elapsedTimeMillis);
}

function sendJson(pageSnapshot) {
    var url = "http://localhost:8080/api/user";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }

        console.log('status: ' + xhr.status);
        console.log('responseText: ' + xhr.responseText);
    };

    var data = JSON.stringify(pageSnapshot);
    console.log(data);
    xhr.send(data);
}

function start() {
    'use strict';
    console.log("start()");
    var elapsedTimeMillis = 0;
    setTimeout(repeatedExecution, 0, elapsedTimeMillis);
}

(function () {
    'use strict';
    console.log("document loaded()");
    setTimeout(start, 3000);
})();
