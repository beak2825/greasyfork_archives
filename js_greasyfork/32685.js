// ==UserScript==
// @name         Stan magazynowy MeblujDom.pl
// @namespace    https://meblujdom.pl
// @version      0.2.2
// @description  Adding special kolumn with quantities of products;
// @author       Eryk Wróbel
// @match        https://meblujdom.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32685/Stan%20magazynowy%20MeblujDompl.user.js
// @updateURL https://update.greasyfork.org/scripts/32685/Stan%20magazynowy%20MeblujDompl.meta.js
// ==/UserScript==

// Changelog:
// v0.1 Created basic script without join names of attributes
// v0.2 - much more prettier, joined attributed names, some preg replace
// v0.2.1 - added limitation of combinations
// v0.2.2 - prepend to different element


/*
_    _  _____ _______  __          _______ ______ _   _ _____
| |  | |/ ____|__   __|/\ \        / /_   _|  ____| \ | |_   _|   /\
| |  | | (___    | |  /  \ \  /\  / /  | | | |__  |  \| | | |    /  \
| |  | |\___ \   | | / /\ \ \/  \/ /   | | |  __| | . ` | | |   / /\ \
| |__| |____) |  | |/ ____ \  /\  /   _| |_| |____| |\  |_| |_ / ____ \
\____/|_____/   |_/_/    \_\/  \/   |_____|______|_| \_|_____/_/    \_\

*/

var maximum_combination = 20; //define how much is maximum combination to check


(function() {
    'use strict';

    /*
     usefull functions
     */

    function ucwords(text) {
        var split = text.split(" "),
            res = [],
            i,
            len,
            component;

        $(split).each(function (index, element) {

            component = (element + "").trim();
            var first = component.substring(0, 1).toUpperCase();
            var remain = component.substring(1).toLowerCase();

            res.push(first);
            res.push(remain);
            res.push(" ");

        });

        return res.join("").trim();
    }

    /*
     var query is value for which you looking for
     var look_for in name of array which you look for value from query
     var get is what You want
     array is array where You looking for
     */
    function findInArray(query, look_in, get, array) {
        for (var i=0 ; i<array.length; i++) {
            if (array[i][look_in] === query) {
                return array[i][get];
            }
        }
    }


    /* -------------------------------
    Begining of code
    --------------------------------- */

    if (combinations.length < maximum_combination) {
        var main_to_append = $('.wysylka');
        //var main_to_append = '#center_column > section > div.primary_block.row > div:nth-child(2) > div.content_prices > div';
        main_to_append.append('<span style="cursor:pointer" id="products_quantities" title="Kliknij aby rozwinąć lub schować"> | <i class="icon-archive"></i> <strong>Magazyn</strong></span>');

        $(main_to_append).after('<div><ul id="product_qnt_list" class="dn"></ul></div>');
        $.each(combinations, function (key, val) {
            var available_date = (val.available_date.date && val.quantity <= 0) ? '(po ' + val.available_date.date + ') ' : '';

            // get full combination name
            var full_attr_name = [];
            $.each(combinations[key].idsAttributes, function(attr_key, attr_val){
                attr_val = attr_val + ''; //make it string because it doesnt work without it :/
                full_attr_name.push(findInArray(attr_val, 'id_attribute', 'attribute', attributesCombinations ));
            });
            full_attr_name = ucwords(full_attr_name.join(', ')+'').replace(/\_/g,' '); // another hack, eh.

            $('#product_qnt_list').append('<li style="margin-bottom: 5px;border-radius: 3px; padding: 3px 10px 3px 12px;background: #ecf0f1; color: #444">' + full_attr_name + ' ' + available_date + '<strong>'  + val.quantity + ' szt.</strong></li>');
        });

        $('#products_quantities').on('click', function () {
            $('#product_qnt_list').slideToggle();
        });
    }


})();
