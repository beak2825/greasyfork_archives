// ==UserScript==
// @name         HKTicketing 自動揀飛價
// @namespace    https://www.jwang0614.top/scripts
// @version      0.5
// @description  快达网 票价，数量，寄送方式
// @author       Derek
// @match        https://*.hkticketing.com/events/*/venues/*/performances/*/tickets
// @icon         https://www.google.com/s2/favicons?sz=128&domain=hkticketing.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459687/HKTicketing%20%E8%87%AA%E5%8B%95%E6%8F%80%E9%A3%9B%E5%83%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/459687/HKTicketing%20%E8%87%AA%E5%8B%95%E6%8F%80%E9%A3%9B%E5%83%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $( document ).ready(function() {
        //第几档票价？ Best Available Any Price Category 为0
        var price_category = 1;

        //几个人
        var people = 2;

        // choose which price
        document.querySelectorAll(".seatarea li a")[price_category].click();

        document.querySelectorAll(".chooseTicketsPriceTypeQuantity select")[0].selectedIndex = people;
        document.querySelectorAll(".chooseTicketsPriceTypeQuantity select")[0].dispatchEvent(new Event('change'));

        document.querySelector("#selectDeliveryType").selectedIndex = 1;
        document.querySelector("#selectDeliveryType").dispatchEvent(new Event('change'));

        var loopClick = setInterval(function(){
            document.querySelector("#continueBar button").click()
        },1100);
    });
})();