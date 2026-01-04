// ==UserScript==
// @name         Coin Market Cap volume to market cap column
// @namespace    https://github.com/deelawn/user-scripts
// @version      0.3
// @description  Add volume to market cap ratio
// @author       deelawn
// @match        https://coinmarketcap.com/
// @match        https://coinmarketcap.com/all/views/all/
// @match        https://coinmarketcap.com/currencies/
// @match        https://coinmarketcap.com/currencies/views/all/
// @match        https://coinmarketcap.com/assets/
// @match        https://coinmarketcap.com/assets/views/all/
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/31095/Coin%20Market%20Cap%20volume%20to%20market%20cap%20column.user.js
// @updateURL https://update.greasyfork.org/scripts/31095/Coin%20Market%20Cap%20volume%20to%20market%20cap%20column.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Works fine, but haven't been able to get it to sort the new column.

    $(document).ready(function() {
        var ratioHdrDef = "<th id=\"th-ratio\" class=\"sortable text-right sorting\" tabindex=\"0\" " +
            "aria-controls=\"currencies\" rowspan=\"1\" colspan=\"1\" aria-label=\"% Volume Ratio: " +
            "activate to sort column descending\" style=\"width: 117px;\">% Volume Ratio</th>";

        $("th[id='th-volume']").after(ratioHdrDef);

        $("tbody").children("tr").each(function(){
            var marketCapUSD = $(" > td.market-cap", this).attr("data-usd");
            var dailyVolUSD = $(" > td > a.volume", this).attr("data-usd");
            var ratioVal = ((dailyVolUSD / marketCapUSD) * 100).toFixed(2);
            var ratioCellDef = "<td class=\"no-wrap ratio text-right\" data-usd=\"" + ratioVal + "\">" + ratioVal + "%</td>";
            $(" > td > a.volume", this).parent().after(ratioCellDef);
        });
    });
})();
