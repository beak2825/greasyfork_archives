// ==UserScript==
// @name         BGP Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Boardgameprices Enhancer
// @author       juancsuareza@gmail.com
// @match        *.boardgameprices.com/comparisoncart/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/374632/BGP%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/374632/BGP%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //function is run with delay because Amazon prices take longer to be fetched
    //when changes are detected in the first column (Amazon's) function runs only once
    $("body").one("DOMSubtreeModified", ".cart-prices .cart-col:eq(0)", function() {
        console.log ("changes on amazon");
        setTimeout(comparePrices, 1000);
    });

    function comparePrices() {
        var gamesCount = $(".cart-col-games div.cart-cell").not('.cart-cell-shipping,.cart-cell-total,.cart-cell-storebutton,.cart-cell-header,.cart-cell-header-placeholder').length;
        var storesCount = $(".cart-prices .cart-col").length;
        //console.log ('gamesCount'+[gamesCount] +' storesCount['+storesCount+']');

        //initialize 2d array with games X seller
        var prices = new Array(gamesCount);
        for(let i = 0; i < gamesCount; i++) {
            prices[i] = [];
        }

        //read all prices and store then in a two dimensional array
        $(".cart-prices .cart-col").each( function (i, seller) {
            $(seller).find(".cart-cell-yes,.cart-cell-no").each( function (j, price) {
                //add index with row number for easier filtering later on when changing color of cell
                $(price).attr("data-index",j);

                //append the prices
                if ( $(price).hasClass('cart-cell-yes') ) {
                    price = $(price).text().replace('$','').replace('-','');
                    prices[j].push( parseFloat (price) );
                }

            });
        });

        //find min and max values for each game and add the classes to change cell color
        for(let i = 0; i < gamesCount; i++) {
             if ( prices[i].length < 2 ) //only if game has more than 1 price available
                 continue;
            var min = Math.min.apply(null, prices[i]);
            var max = Math.max.apply(null, prices[i]);
            //console.log ('min'+[min] +' max['+max+']');

            $(".cart-cell-yes[data-index=" + i + "]:contains('"+min+"')").addClass('lowest-price');
            $(".cart-cell-yes[data-index=" + i + "]:contains('"+max+"')").addClass('highest-price');
        }
    }

//styles
GM_addStyle('.lowest-price { background-color: #04d505;}');
GM_addStyle('.highest-price { background-color: #f44336;}');
GM_addStyle('.lowest-price a, .highest-price a { color: white !important; font-weight: 500;}');
})();