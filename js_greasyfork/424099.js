// ==UserScript==
// @name         Binance Leaderboard Sort Positions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.binance.com/en/futures-activity/leaderboard/*
// @grant        none
// @require      https://code.jquery.com/jquery-1.12.3.min.js

// @downloadURL https://update.greasyfork.org/scripts/424099/Binance%20Leaderboard%20Sort%20Positions.user.js
// @updateURL https://update.greasyfork.org/scripts/424099/Binance%20Leaderboard%20Sort%20Positions.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        var jTableToSort = $("#__APP > div > div.css-wwqjl3 > div.css-1psz1mk > div.css-4ndyle > div.css-18t1k5s > div > div > div > table");
        var jRowsToSort = jTableToSort.find("tr:gt(0)");
        jRowsToSort.sort(SortByPnL).appendTo(jTableToSort);

        function SortByPnL(zA, zB) {
            var ValA_Text = Number($(zA).find("td:eq(4)").text().split(" ")[0]);
            var ValB_Text = Number($(zB).find("td:eq(4)").text().split(" ")[0]);

            if (ValA_Text > ValB_Text)
                return -1;
            else if (ValA_Text < ValB_Text)
                return 1;
            else
                return 0;
        }
    }, 4000);
})();