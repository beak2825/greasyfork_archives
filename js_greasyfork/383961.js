// ==UserScript==
// @name         HKTicketing 快达网 tickets page
// @namespace    https://www.jwang0614.top/scripts
// @version      0.2
// @description  快达网 票价，数量，寄送方式
// @author       Olivia
// @match        https://premier.hkticketing.com/events/*/venues/*/performances/*/tickets
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383961/HKTicketing%20%E5%BF%AB%E8%BE%BE%E7%BD%91%20tickets%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/383961/HKTicketing%20%E5%BF%AB%E8%BE%BE%E7%BD%91%20tickets%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //第几档票价？ Best Available Any Price Category 为0
    var price_category = 0;

    //几个人
    var people = 1;

    function timedRefresh(timeoutPeriod) {
        window.setTimeout("location.reload(true);",timeoutPeriod);
    }


    document.querySelectorAll(".seatarea li a")[price_category].click();


    document.querySelectorAll(".chooseTicketsPriceTypeQuantity select")[0].selectedIndex = people;
    document.querySelectorAll(".chooseTicketsPriceTypeQuantity select")[0].dispatchEvent(new Event('change'));



    document.querySelector("#selectDeliveryType").selectedIndex = 1;
    document.querySelector("#selectDeliveryType").dispatchEvent(new Event('change'));

    if (document.querySelector("#continueBar button").disabled == true) {
        timedRefresh(200);

    } else {
        document.querySelector("#continueBar button").click()
    }

    




})();



