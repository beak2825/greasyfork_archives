// ==UserScript==
// @name         BTC to USD Balance Alpha
// @namespace    http://tampermonkey.net/
// @version      Alpha
// @description  try to take over the world!
// @author       You
// @match        https://bittrex.com/Balance
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30873/BTC%20to%20USD%20Balance%20Alpha.user.js
// @updateURL https://update.greasyfork.org/scripts/30873/BTC%20to%20USD%20Balance%20Alpha.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i=0;
    var rate=1;


    $('tbody td:nth-child(8)').each(function(index){
        i+=parseFloat($(this).text());
    });

    
    $.ajax({
        type: 'GET',
        dataType:'json',
        url: 'https://bittrex.com/Api/v2.0/pub/currencies/GetBTCPrice',
        success: function(responseData) {
            rate=parseFloat(responseData.result.bpi.USD.rate_float);
            $('.row:first-child .section-header-in-row span').remove();
            $('.row:first-child .section-header-in-row').append("<span>- "+(i).toFixed(5)+" BTC ($"+(i*rate).toFixed(2)+" USD)</span>");
        }
    });
    
    
    $.ajax({
        type: 'GET',
        dataType:'json',
        url: 'https://bittrex.com/api/v2.0/pub/Markets/GetMarketSummaries?_=1497747876909',
        success: function(responseData) {
            // Count the number of currencies...
            console.table(responseData.result);

        }
    });
    // Your code here...
})();