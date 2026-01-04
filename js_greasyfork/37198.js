// ==UserScript==
// @name         GDAX Profits
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Calculates profits on past fills based on the current price and the fee.
// @author       Dan Leveille http://twitter.com/danlev
// @match        *.gdax.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/37198/GDAX%20Profits.user.js
// @updateURL https://update.greasyfork.org/scripts/37198/GDAX%20Profits.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var hasInit = false;
    $("<style type='text/css'> .profit{ width:18%;text-align:right;} .FillList_list-header_2LLZp .profit{} .profitPos {color:#84f766d9} .profitNeg {color:#ff6939}  .FillList_fill-time_3-xVy.FillList_column_29fxw {padding-right:1% !important;text-align: right !important;width:14% !important;} .UserPanel_main-panel_37NpC {flex:2 !important;}</style>").appendTo("head");
    //$('.FillList_fill_35a4E div span').ready(function(){
    function updateProfits(){
        //console.log("Taper called");
        //console.log($('.FillList_fill_35a4E'));
        var curPrice = $($($('.MarketInfo_market-stat_2xWig')[0]).find('span')[0]).text();
        curPrice = cleanPrice(curPrice);
        //console.log("curPrice",curPrice);
        $.each($('.FillList_fill_35a4E'), function( index, value ) {
            //console.log("Taper loop");
            var rowEl = $($('.FillList_fill_35a4E')[index]);
            var isBuy = $(rowEl).find('.FillList_fill-tag_29h88').hasClass('FillList_buy_98t7W');
            var size = cleanPrice($(rowEl).find('.FillList_fill-size_r82AD').text());
            var price = cleanPrice($(rowEl).find('.FillList_fill-price_1WnrV').text());
            var feeEl = $(rowEl).find('.FillList_fill-fee_kyUhj')[0];
            var fee = cleanPrice($(feeEl).text());

            var totalValue = size * price;
            var curValue = size * curPrice;
            var profit = Math.round((curValue-totalValue)*100)/100;
            var profitPerc = Math.round((profit/totalValue)*1000)/10;
            var profitString = "";
            if(isBuy){
                profitString = "<b>" + profit + "</b> (" + profitPerc + "%)";
            }
            var profitClass = 'profitNeg';
            var profitNonClass = 'profitPos';
            if(profit > 0){
                profitClass = 'profitPos';
                profitNonClass = 'profitNeg';
            }
            //console.log(profitString);
            if($(rowEl).find('.profit').length > 0){
            //if(!hasInit){
                $(rowEl).find('.profit').removeClass(profitNonClass).addClass(profitClass).html(profitString);
            } else {
                $('<div class="FillList_column_29fxw profit ' + profitClass + '">' + profitString + "</div>" ).insertAfter($(feeEl)[0]);
            }
        });
        window.setTimeout( updateProfits, 1000 );
        if(!hasInit){
            var feeHeaderEl = $('.FillList_list-header_2LLZp').find('.FillList_fill-fee_kyUhj');
            $('<div class="FillList_column_29fxw profit">Profit</div>').insertAfter($(feeHeaderEl)[0]);
        }
        hasInit = true;
    }
    //});


    window.setTimeout( updateProfits, 3000 );
    function cleanPrice(price){
        return Number(price.replace(/[^0-9\.]+/g,""));
    }



})();

