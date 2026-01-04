// ==UserScript==
// @name         Faction Vault Balance Display
// @namespace    dingus
// @version      1.0
// @description  Displays faction vault balance for anyone!
// @author       dingus [3188789]
// @license      dingus [3188789]
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @include      https://www.torn.com/*
// @exclude      https://https://www.torn.com/war.php?step=rankreport*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/507799/Faction%20Vault%20Balance%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/507799/Faction%20Vault%20Balance%20Display.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    });
    var userid = 'USER ID HERE'
    $.ajax({
        url: 'https://api.torn.com/faction',
        data: {
            selections: 'donations',
            key: 'YOUR API KEY'
        },
        beforeSend: function () {
        },
        success: function (data) {
            var money = data;
            console.log("Faction Balance Amount: " + money.donations[userid].money_balance);
            var resultsDiv = $(`
                <div class="point-block___to3YE" style="white-space: nowrap; font-size: 12px; display: inline-block; font-weight: 700; width: 47px";>
                    ${money.donations[userid].money_balance !== null && money.donations[userid].money_balance !== 0 ? `
                    <div style="margin-top: 3px;">
                        <span>Faction:  </span>
                        <span style="font-size: 12.8px; color: #82c91e; font-weight: 400;">${formatter.format(money.donations[userid].money_balance)}</span>
                    </div>` : ''}
                </div>
            `);
            var targetNode = $('div[class^=points]');
            if (targetNode.length)
                targetNode.append(resultsDiv);
            else
                console.error("TM script => Target node not found.");
        },
        complete: function () {
        },
        error: function () {
            console.log('There was an error. Please try again.');
        }
    });
    GM_addStyle(`
        .tmJsonMashupResults {
            color: black;
            background: #f9fff9;
            margin-top: 10px;
            padding: 1.4ex 1.3ex;
            border: 1px double gray;
            border-radius: 1ex;
        }
    `);
})();
