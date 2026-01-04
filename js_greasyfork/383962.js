// ==UserScript==
// @name         HKTicketing 快达网 seatmap page
// @namespace    https://www.jwang0614.top/scripts
// @version      0.1
// @description  快达网 Choose tickets -> Go to payment
// @author       Olivia
// @match        https://premier.hkticketing.com/events/*/venues/*/performances/*/seatmap
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383962/HKTicketing%20%E5%BF%AB%E8%BE%BE%E7%BD%91%20seatmap%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/383962/HKTicketing%20%E5%BF%AB%E8%BE%BE%E7%BD%91%20seatmap%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelector("#goToPaymentButton").click();
})();