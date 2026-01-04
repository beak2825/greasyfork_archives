// ==UserScript==
// @name         TaxedTransfer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Extract Tax Info
// @author       todorov
// @match        *.dugout-online.com/*
// @downloadURL https://update.greasyfork.org/scripts/516732/TaxedTransfer.user.js
// @updateURL https://update.greasyfork.org/scripts/516732/TaxedTransfer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createBidderInfoBox(amount, weeks, fixedTax, extratax, amountAfterTax){
        var bidderBox = document.createElement("div");
        bidderBox.style.position = "fixed";
        bidderBox.style.top = "10px";
        bidderBox.style.left = "200px";
        document.body.appendChild(bidderBox);
        let extraTaxInfo = weeks > 20 ? ">20 Weeks: No extra Tax" : 'Extra Tax = '+ amount.toLocaleString('de-DE') +' £ x 2% x (20 Weeks - '+ weeks + ' Weeks)';
        let fixedTaxInfo = 'Fixed Tax = '+ amount.toLocaleString('de-DE') +' £ x 15%';
        bidderBox.innerHTML =
            '<div id="wrapper">' +
            '<table border="0" cellspacing="0" cellpadding="0">' +
            '<tr><td>Amount</td><td>' + amount.toLocaleString('de-DE') + ' £</td></tr>' +
            '<tr><td>Weeks</td><td>' + weeks + ' wk</td></tr>' +
            '<tr><td class="tooltip" data-tooltip="' + fixedTaxInfo + '">Fixed Tax</td><td>' + fixedTax.toLocaleString('de-DE') + ' £</td></tr>' +
            '<tr><td class="tooltip" data-tooltip="' + extraTaxInfo + '">Extra Tax</td><td>' + extratax.toLocaleString('de-DE') + ' £</td></tr>' +
            '<tr class="final"><td><b>Amount After Tax</td><td><b>' + amountAfterTax.toLocaleString('de-DE') + ' £</b></td></tr>' +
            '</table>' +
            '</div>';

        function addGlobalStyle(css) {
            var head, style;
            head = document.getElementsByTagName('head')[0];
            if (!head) { return; }
            style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            head.appendChild(style);
        }

        let tableStyle =
            ' #wrapper table tr td {font-size: 10px; width: 90px; padding: 0; text-align: center;}' +
            ' #wrapper {position: absolute; top: 0; right: 0; width: 180px; padding: 0 0px; border: 1px solid #53714d; background: #ffffff;}'+
            ' .tooltip {position: relative; cursor: pointer;}' +
            ' .tooltip::after {content: attr(data-tooltip); position: absolute; left: 0; top: 100%; white-space: nowrap; background: #333; color: #fff; padding: 5px; border-radius: 4px; font-size: 10px; opacity: 0; transform: translateY(5px); transition: opacity 0.2s ease, transform 0.2s ease; z-index: 1; pointer-events: none;}' +
            ' .tooltip:hover::after {opacity: 1; transform: translateY(0);}'+
            ' .final {background-color: #85a57f; font-weight: bold;}';

        addGlobalStyle(tableStyle);

    }

    let amount, weeks, tax, fixedTax, extratax, amountAfterTax;
    function extractTaxInfo() {
        amount = parseInt(document.querySelector('form[name="bidForm"]').innerHTML.match(/<b>([\d\.]+ [£€\$])<\/b>/)[1].replace(/[\.\£€\$]/g, ''));
        weeks = document.documentElement.innerHTML.match(/<td[^>]*?>\s*(&nbsp;)?\s*Weeks at club\s*(&nbsp;)?\s*<\/td>\s*<td[^>]*?>\s*(\d+)\s*(&nbsp;)?\s*<\/td>/i)[3];

        fixedTax = parseInt(amount * 0.15);
        extratax = weeks > 20 ? 0 : parseInt(amount * 0.02 * (20 - weeks));

        amountAfterTax = amount - fixedTax - extratax;

        createBidderInfoBox(amount, weeks, fixedTax, extratax, amountAfterTax);

    }

    extractTaxInfo();

})();