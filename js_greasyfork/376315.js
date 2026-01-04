/* This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.*/

// ==UserScript==
// @name         SkatePro sort
// @license      WTFPL; http://www.wtfpl.net/
// @namespace    http://ttmyller.azurewebsites.net/
// @version      0.1
// @description  Enable sorting for SkatePro items
// @author       ttmyller
// @match        https://www.skatepro.fi/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376315/SkatePro%20sort.user.js
// @updateURL https://update.greasyfork.org/scripts/376315/SkatePro%20sort.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var filter = $('#custom_filter_button');
    if (filter && filter.length) return;

    var productContainer = $('#product_content .grid_rows');
    var items = $('.column', productContainer);

    // Yeah, I wasn't too keen to make it look awesome..
//    $('head').append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">');
    $('head').append('<link rel="stylesheet" href="https://lysidia.blob.core.windows.net/cdn/goutlet.css">');

    // create links for sorting items
    function sortLinks(key) {
        return ' <a href="#" class="goutlet-sort glyphicon glyphicon-hand-up" onclick="sortItems(\'' + key + '\', true)" ></a>' +
               ' <a href="#" class="goutlet-sort glyphicon glyphicon-hand-down" onclick="sortItems(\'' + key + '\', false)"></a>';
    }

    function option(key, title) {
        var opt = $('<option value="' + key + '">' + title + '</option>');
        return opt;
    }
    var sortLinksContainer = $('<div>');
    var filterSelect = $('<select id="filterSelect" onchange="sortItems()">');
    filterSelect.append(option('price', 'Sale price'));
    filterSelect.append(option('percent', 'Sale percent'));
    filterSelect.append(option('normal', 'Normal price'));
    var ascSelect = $('<select id="ascSelect" onchange="sortItems()"><option value="true">Ascending</option><option value="false">Descending</option></select>');
    sortLinksContainer.append(filterSelect);
    sortLinksContainer.append(ascSelect);
    sortLinksContainer.insertBefore(productContainer);

    // Loop items
    items.each(function () {
        var item = $(this);
        // Get prices and percent from elements and save them in data
        var salePrice = $('.grid_price_sale_new', item).text().replace(/[^0-9\,]/g, '');
        var normalPrice = $('.grid_price_before', item).text().replace(/[^0-9\,]/g, '');

        var price = parseFloat(salePrice.replace(',','.'));
        var normal = parseFloat(normalPrice.replace(',','.'));
        var percent = Math.round((1-price/normal)*100);
        console.log("item: " + normal + "€ -> " + price + "€ = -" + percent + "%");
        item.data('price', price);
        item.data('normal', normal);
        item.data('percent', percent);
    });

    window.sortItems = function() {
        var key = $('#filterSelect option:selected').val();
        var asc = $('#ascSelect option:selected').val() == 'true';

        // Detach items from their parents
        items.each(function() { $(this).detach(); });

        // sort items ascending or descending
        items.sort(function(a, b) {
            if (asc)
                return $(a).data(key)-$(b).data(key);
            else
                return $(b).data(key)-$(a).data(key);
        });

        var products = $('#product_content .grid_rows');
        // Loop items and add them to columns in sorted order
        items.each(function() {
            products.append($(this));
        });
    };

    sortItems();
})();