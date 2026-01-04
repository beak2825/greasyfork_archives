// ==UserScript==
// @name         2TheMoon Bittrex
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Bittrex sell orders helper
// @author       You
// @match        https://bittrex.com/Market/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32367/2TheMoon%20Bittrex.user.js
// @updateURL https://update.greasyfork.org/scripts/32367/2TheMoon%20Bittrex.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    
    var styleHTML = '<style id="2themoon-css">\
        .form-group{\
        position: relative;\
        }\
        .tothemoon-block{\
        margin: 0 15px;\
        border: 1px solid #ddd;\
        border-radius: 2px;\
        background: whitesmoke;\
        text-align: right;\
        }\
        .tothemoon-block:after{\
        content: ".";\
        display: block;\
        clear: both;\
        visibility: hidden;\
        line-height: 0;\
        height: 0;\
        }\
        .tothemoon-block ul{\
        padding: 0;\
        margin: 0;\
        list-style: none;\
        text-align: right;\
        display: inline-block;\
        }\
        .tothemoon-panel li{\
        display: inline-block;\
        cursor: pointer;\
        margin: 0;\
        padding: 2px 7px;\
        }\
        .tothemoon-panel li.active,\
        .tothemoon-panel li:hover{\
        background: #337ab7;\
        color: #fff;\
        }\
        .tothemoon-price{\
        }\
        .tothemoon-price ul{\
        display: inline-block;\
        }\
        .tothemoon-price input{\
        display: inline-block;\
        border: 1px solid #d6e2eb;\
        width: 120px;\
        height: 23px;\
        float: left;\
        }\
        @media all and (min-width: 992px){\
        .tothemoon-block{\
        margin: 0 15px 0 50px;\
        }\
        }\
        </style>';

        var $hookUnits = $('#form_Sell > div:nth-child(1)');
        var $hookPrice = $('#form_Sell > div:nth-child(2)');
        var unitsHTML = '<div class="tothemoon-block">\
        <ul class="tothemoon-panel" data-action="set-units">\
          <li data-multiplier="0.1">10%</li>\
          <li data-multiplier="0.2">20%</li>\
          <li data-multiplier="0.3">30%</li>\
          <li data-multiplier="0.5">50%</li>\
          <li data-multiplier="0.75">75%</li>\
          <li data-multiplier="1">100%</li>\
        </ul>\
        </div>';
        var priceHTML = '<div class="tothemoon-block tothemoon-price">\
        <input type="number" data-type="initial-price" placeholder="Цена закупа">\
        <ul class="tothemoon-panel" data-action="set-price">\
          <li data-multiplier="1.1">+10%</li>\
          <li data-multiplier="1.2">+20%</li>\
          <li data-multiplier="1.3">+30%</li>\
          <li data-multiplier="1.4">+40%</li>\
          <li data-multiplier="1.5">+50%</li>\
          <li data-multiplier="2">+100%</li>\
          <li data-multiplier="2.5">+150%</li>\
          <li data-multiplier="3">+200%</li>\
        </ul>\
        </div>';

    $(document).ready(function(){
        function initHTML() {
            $('body').append(styleHTML);
            $hookUnits.prepend(unitsHTML);
            $hookPrice.prepend(priceHTML);
        }
        
        function initUnitsHandler(){
            $(document).on('click', '[data-action="set-units"] li', function(e){
                var $field = $('[name="quantity_Sell"]');
                var total = +$('#availableMarketCurrency').text().trim();
                var multiplier = +$(e.target).data('multiplier');
                var part = (total * multiplier).toFixed(8);
                $field.val(part);
            });
        }
        
        function initPriceHandler(){
            $(document).on('click', '[data-action="set-price"] li', function(e){
                var $field = $('[name="price_Sell"]');
                var initialPrice = +$('[data-type="initial-price"]').val().trim();
                var multiplier = +$(e.target).data('multiplier');
                var part = (initialPrice * multiplier).toFixed(8);
                $field.val(part);
            });
        }
        
        function initHandlers(){
            initUnitsHandler();
            initPriceHandler();
        }
        
        initHTML();
        initHandlers();
    });
})(jQuery);