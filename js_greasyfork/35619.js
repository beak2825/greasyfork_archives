// ==UserScript==
// @name         BinanceCNY
// @namespace    https://www.binance.com/
// @version      0.3
// @description  显示法定币价
// @author       Shevckcccc
// @match        https://www.binance.com/trade.html?symbol=*
// @downloadURL https://update.greasyfork.org/scripts/35619/BinanceCNY.user.js
// @updateURL https://update.greasyfork.org/scripts/35619/BinanceCNY.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        var current_price = parseFloat($('.kline-para ul li strong').eq(0).text());
        var country_price = parseFloat($('.kline-para ul li strong').eq(1).text().replace(/[^0-9\.]/g, ''));
        var unit_price = country_price / current_price;

        var asks = $('#askScrollBox .askTable tr .f-left .ng-binding span');
        asks.each(function (index, item) {
            var origin_price = item.innerText.split('|')[0];
            var price = parseFloat(origin_price * unit_price).toFixed(2);
            $(item).text(origin_price + '|' + price);
        });

        var bids = $('#bidScrollBox .bidTable tr .f-left .ng-binding span');
        bids.each(function (index, item) {
            var origin_price = item.innerText.split('|')[0];
            var price = parseFloat(origin_price * unit_price).toFixed(2);
            $(item).text(origin_price + '|' + price);
        });
    }, 2000);
})();