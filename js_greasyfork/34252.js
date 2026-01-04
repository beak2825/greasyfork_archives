// ==UserScript==
// @name         Reality's Stock Performance Tool
// @namespace    RealityStocks-Net-Return
// @version      1.2
// @description  See live net return on stock investments
// @author       RealityShift
// @include 	   *.torn.com/stockexchange.php?step=portfolio
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34252/Reality%27s%20Stock%20Performance%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/34252/Reality%27s%20Stock%20Performance%20Tool.meta.js
// ==/UserScript==
// May 15, 2017: Added total stock net value to bottom of portfolio

(function() {
    'use strict';
    let allStocksAvg = 0;

    function calculateAndSetNetValues() {

        $.map($('li.item-wrap'), function(item) {
            const $item = $(item);

            const numberOfSharesOwned = ($item.find('.b-price-wrap .first-row')[0].childNodes[2].textContent).trim().replace(/,/g, '');
            const priceCurrent = ($item.find('.b-price-wrap .second-row .prop-wrap')[0].childNodes[2].textContent).trim().replace(/,/g, '').replace('$', '');
            const pricePurchased = ($item.find('.c-price-wrap .second-row .prop-wrap')[0].childNodes[2].textContent).trim().replace(/,/g, '').replace('$', '');

            const netValue = totalProfitOrLoss(numberOfSharesOwned, priceCurrent, pricePurchased);
            const strValue = "$" + numberWithCommas(netValue);

            if (netValue > 0)
                ($('<div class="qualify-wrap" style="height:24px; text-align:right; color:green; font-style:normal" </div>').text('Profit: ' + strValue)).insertBefore($item.context.children[0].children[2].children[4]);
            else
                ($('<div class="qualify-wrap" style="height:24px; text-align:right; color:red; font-style:normal" </div>').text('Profit: ' + strValue)).insertBefore($item.context.children[0].children[2].children[4]);

            allStocksAvg += netValue;
        });

    }

    function totalProfitOrLoss(numberOfSharesOwned, priceCurrent, pricePurchased) {
        const netValue = (numberOfSharesOwned * priceCurrent) - (numberOfSharesOwned * pricePurchased);

        return (Math.ceil(netValue));
    }

    function numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    // Creats an info notice
    function createInfoNotice() {
        const msg = "Current net profit of stocks: $" + numberWithCommas(allStocksAvg);
        let color = "grey";

        if (allStocksAvg > 0)
            color = "green";
        if (allStocksAvg < 0)
            color = "red";

        return ($('<div class="info-msg-cont border-round m-top10 ' + color + '"><div class="info-msg border-round">' +
            '<i class="info-icon"></i><div class="delimiter"><div id="allStocksAvg" class="msg right-round"><p style=";margin:0px 0px 0px 380px;">' + msg + '</p></div></div></div></div>'));
    }

    calculateAndSetNetValues();
    (createInfoNotice()).insertAfter('.stock-main-wrap');
})();
