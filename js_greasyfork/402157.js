// ==UserScript==
// @name         Points Market Value %
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Shows market value % on Points market
// @author       Rescender[2526540]
// @match        https://www.torn.com/pmarket.php
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/402157/Points%20Market%20Value%20%25.user.js
// @updateURL https://update.greasyfork.org/scripts/402157/Points%20Market%20Value%20%25.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`.d .points-market .users-list-header .market-value, .d .points-market .users-point-sell .market-value {
        width: 46px;
    }`);
     GM_addStyle(`.d .points-market .users-point-sell .market-value {
        width: 46px;
        line-height: 30px;
        margin-top: -1px;
        padding-top: 1px;
        margin-bottom: -1px;
        padding-bottom: 1px;
        border-left: #ccc 2px solid;
    }`);
    GM_addStyle(`.d .points-market .users-list-header .total-price, .d .points-market .users-point-sell .total-price {
        width: 145px;
    }`);
    GM_addStyle(`.d .points-market .users-list-header .points, .d .points-market .users-point-sell .points {
        width: 74px;
    }`);
    GM_addStyle(`.d .points-market .users-point-sell .market-value {
        font-size: 12px;
        vertical-align: middle;
        display: inline-block;
        padding: 0 10px;
        text-align: right;
    }`)

    let periodAvg = {"month":0, "month3":0, "month6":0, "month12":0, "month36":0, "alltime":0};

    $(document).ajaxComplete(function( event, xhr, settings ) {
        if ( settings.url.includes("chartData") ) {
            var data = JSON.parse(xhr.responseText);
            var sum = 0, avg = 0, zeros = 0;

            var periodKey = getQueryString("period", settings.url);

            for (var i = 0; i < data.length; i++){
                if (data[i][1] != 0) {
                  sum += data[i][1];
                } else {
                  zeros += 1;
                }
            }
            avg = sum/(data.length - zeros);

            periodAvg[periodKey] = avg;

            cell_creation(avg);

            $("[value="+periodKey+"]").change(function(){
                cell_creation(periodAvg[periodKey]);
            });
        }
    });


    function cell_creation(avg) {
        $('.market-value').remove();
        $('<li class="market-value">MV</li>').insertAfter(".users-list-header .cost-each");
        $('.expander').each(function( index ) {
            var cost = $(this).find('.cost-each').text().replace(/\D/g, '');
            var mv = (cost/avg * 100).toFixed(2) + "%";
            var e = $("<span class='market-value'><span class='wai'>Market Value</span>"+mv+"</span>");
            $(this).find(".cost-each").after(e);
        });
    }

    var getQueryString = function ( field, url ) {
        var href = url ? url : window.location.href;
        var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        var string = reg.exec(href);
        return string ? string[1] : null;
    };

})();