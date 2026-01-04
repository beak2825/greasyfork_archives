// ==UserScript==
// @name         Off-shore Assist
// @namespace    http://knightsradiant.pw/
// @version      0.2
// @description  Auto-populate values for sending resources off-shore.
// @author       Talus
// @match        https://politicsandwar.com/alliance/id=*&display=bank*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/430995/Off-shore%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/430995/Off-shore%20Assist.meta.js
// ==/UserScript==

(async function() {
    var $ = window.jQuery;

// Modify values below this line

    // How much of each resource you want to keep. Ex. to keep 1000 money, you would set '2 : 1000, // money'
    var RESERVE_AMOUNTS = {
        2 : 0, // money
        3 : 0, // food
        4 : 0, // coal
        5 : 0, // oil
        6 : 0, // uranium
        7 : 0, // lead
        8 : 0, // iron
        9 : 0, // bauxite
        10 : 0, // gasoline
        11 : 0, // munitions
        12 : 0, // steel
        13 : 0 // aluminum
    };
    var TARGET_ALLIANCE_NAME = '';

// Do not modify below this line

    var AVAILABLE_REGEX = /([^ $]+)\)$/;
    var RESOURCE_AVAILABLE_JQ = '#rightcolumn > div.row > div:nth-child(2) > form > table > tbody > tr:nth-child(${i}) > td:nth-child(1)';
    var RESOURCE_SEND_JQ = '#rightcolumn > div.row > div:nth-child(2) > form > table > tbody > tr:nth-child(${i}) > td:nth-child(2) > input';
    var NATION_ALLIANCE_JQ = '#rightcolumn > div.row > div:nth-child(2) > form > table > tbody > tr:nth-child(14) > td > p:nth-child(2) > select';
    var SEND_TARGET_JQ = '#rightcolumn > div.row > div:nth-child(2) > form > table > tbody > tr:nth-child(14) > td > p:nth-child(2) > input[type=text]';
    var WITHDRAWAL_JQ = '#withdrawal';
    $(WITHDRAWAL_JQ).append('&nbsp;<div id="offshore" class="btn btn-primary pull-right">Populate for Off-shore</div>');

    $('#offshore').on("click", function() {
        for (let i = 2; i <= 13; i++) {
            var currentAmount = $(RESOURCE_AVAILABLE_JQ.replace('${i}',i)).text().match(AVAILABLE_REGEX)[1].replaceAll(',','');
            var allowedAmount = RESERVE_AMOUNTS[i];
            var sendAmount = Math.max(0, (currentAmount - allowedAmount).toFixed(2));
            $(RESOURCE_SEND_JQ.replace('${i}',i)).val(sendAmount);
        }

        $(NATION_ALLIANCE_JQ).val('Alliance');
        $(SEND_TARGET_JQ).val(TARGET_ALLIANCE_NAME);
    });
})();
