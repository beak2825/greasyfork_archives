// ==UserScript==
// @name         Export etoro people stats
// @namespace    https://www.etoro.com/people/
// @version      1.0
// @description  Export etoro people stats!
// @author       angelo.ndira@gmail.com
// @match        https://www.etoro.com/people/*/stats
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/421636/Export%20etoro%20people%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/421636/Export%20etoro%20people%20stats.meta.js
// ==/UserScript==

// console.print: console.log without filename/line number
console.print = function (...args) {
    queueMicrotask (console.log.bind (console, ...args));
}

function readMarketDataSnapshot(rowNode) {
    'use strict';
    var record = "";
    var amount_set = false;
    rowNode.find('div.performance-chart-slot.amount').each(function () {
        var amountNode = $(this);
        if(amount_set==false) {
            amount_set = true;
            record = amountNode.text() + "|" + record;
        }
    });
    rowNode.find('div.performance-chart-slot.year').each(function () {
        var yearNode = $(this);
        record = yearNode.text() + "|" + record;
    });

    console.print(record);
}

function readRows(rowNode) {
    console.clear();
    $(document).find('body > ui-layout > div > div > div.main-app-view.ng-scope > et-user > div > div > et-user-header > div > div.user-market-head-content-ph > div.user-market-head-content.no-user-gain > div > h1').each(function () {
        var rowNode = $(this);
        console.print("|"+rowNode.text());
    });

    $(document).find('body > ui-layout > div > div > div.main-app-view.ng-scope > et-user > div > div > div > div.instrument-body-wrapper.minimize > div > et-user-stats > et-user-performance-chart > et-card > section > et-card-content > div.performance-info.ng-star-inserted.see-more > div.performance-chart-info.ng-star-inserted').each(function () {
        var rowNode = $(this);
        readMarketDataSnapshot(rowNode);
    });

}

function start() {
    'use strict';
    $(document).find('body > ui-layout > div > div > div.main-app-view.ng-scope > et-user > div > div > div > div.instrument-body-wrapper.minimize > div > et-user-stats > et-user-performance-chart > et-card > et-card-footer > div.performance-chart-extend > div > span.ng-star-inserted').each(function () {
        var rowNode = $(this);
        rowNode.click();
    });
    setTimeout(readRows, 3000);
}

(function () {
    'use strict';
    console.log("\n\n\n");
    console.log("document loaded(). Export etoro will start in 10 seconds");
    setTimeout(start, 10000);
})();