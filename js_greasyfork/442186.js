// ==UserScript==
// @name         IsThereAnyDeal - Remove DailyIndieGame bundles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filter the "All Specials" by removing the DailyIndieGame bundles from the list.
// @author       mcbyte
// @license MIT
// @match        https://isthereanydeal.com/specials/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=isthereanydeal.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442186/IsThereAnyDeal%20-%20Remove%20DailyIndieGame%20bundles.user.js
// @updateURL https://update.greasyfork.org/scripts/442186/IsThereAnyDeal%20-%20Remove%20DailyIndieGame%20bundles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $("div.bundle-container-outer").each(function(idx) {
        //console.log( index + ": " + $( this ).text() );
        if ($(this).text().indexOf("DailyIndieGame") > 0) {
            $(this).hide();
        }
    });
})();