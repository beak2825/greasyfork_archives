// ==UserScript==
// @name         invoic-data-extractor
// @namespace    https://github.com/BaiwangTradeshift/
// @version      0.1
// @description  bwts post message solution
// @author       bwts
// @include      https://inv-veri.chinatax.gov.cn*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/29265/invoic-data-extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/29265/invoic-data-extractor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let invoiceMessageHandler = function (event) {
        let receivedData = event.data;
        if (receivedData && event.data.init && event.data.start && event.data.sourceData) {
            window.receivedData = receivedData;
            eval(`(${receivedData.init})()`);
            eval(`(${receivedData.start})(receivedData.sourceData)`);
        }
    };

    window.addEventListener('beforescriptexecute', function (event) {
        // able to display in iframe
        event.target.innerHTML = event.target.innerHTML.replace('location.href = "about:blank";', '');
    });

    window.addEventListener('message', invoiceMessageHandler, true);
})();
