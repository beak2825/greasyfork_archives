// ==UserScript==
// @name         HKTicketing 快达网 show page
// @namespace    https://www.jwang0614.top/scripts
// @version      0.2
// @description  快达网 进入主页自动点击“Get Tickets"
// @author       Olivia
// @match        https://premier.hkticketing.com/shows/show.aspx?sh=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383973/HKTicketing%20%E5%BF%AB%E8%BE%BE%E7%BD%91%20show%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/383973/HKTicketing%20%E5%BF%AB%E8%BE%BE%E7%BD%91%20show%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var date = 1;

    if (document.querySelectorAll(".buyTicketsInformation select").length > 0) {
        document.querySelectorAll(".buyTicketsInformation select")[0].selectedIndex = date;
        document.querySelectorAll(".buyTicketsInformation select")[0].dispatchEvent(new Event('change'));

        sleep(2000).then(() => {
            console.log(document.querySelector("#buyButton input"));
            document.querySelector("#buyButton input").click();
        });
    } else {
        document.querySelector("#buyButton input").click();

    }

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

})();