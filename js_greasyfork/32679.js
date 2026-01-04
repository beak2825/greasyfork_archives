// ==UserScript==
// @name         Sprawdzanie stanu magazynowego Hile.pl
// @namespace    http://hile.pl/
// @version      0.2
// @description  Adding a button to check quantities of selected product
// @author       Eryk Wróbel
// @match        http://hile.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32679/Sprawdzanie%20stanu%20magazynowego%20Hilepl.user.js
// @updateURL https://update.greasyfork.org/scripts/32679/Sprawdzanie%20stanu%20magazynowego%20Hilepl.meta.js
// ==/UserScript==

// Changelog:
// v0.1 Added script, not working in real time, maybe in second version.
// v0.2 Added automatically change

(function() {
    'use strict';

    /*function quantityByIdCombination(query, combinations) {
        for (var i=0 ; i<combinations.length; i++) {
            if (combinations[i]['idCombination'] === query) {
                return combinations[i]['quantity'];
            }
        }
    }*/

    function quantityByIdAttr(query, combinations) {
        for (var i=0 ; i<combinations.length; i++) {
            if (combinations[i]['idsAttributes'][0] === query) {
                return combinations[i]['quantity'];
            }
        }
    }

    var attr_id = '';
    $('.box-cart-bottom').prepend('<div class="exclusive btn btn-outline"> Dostępne sztuki: <span id="product_qnt"></span></div>');
    $('.color_pick').on('click', function(){
        attr_id = $(this).attr('id').replace(/\D/g,'')*1; // make it a number 
        $('#product_qnt').html(quantityByIdAttr(attr_id, combinations));
    });

})();