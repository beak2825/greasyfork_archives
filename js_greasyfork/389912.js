// ==UserScript==
// @name         Revive Advisor
// @namespace    http://tampermonkey.net/
// @version      1.0.16
// @description  Advise not to revive based on past donations
// @author       AlienZombie [2176352]
// @match        https://www.torn.com/profiles.php?XID=*
// @source       https://greasyfork.org/en/scripts/389899-stock-advisor
// @downloadURL https://update.greasyfork.org/scripts/389912/Revive%20Advisor.user.js
// @updateURL https://update.greasyfork.org/scripts/389912/Revive%20Advisor.meta.js
// ==/UserScript==

/*
    {
        id: ,
        timesRevived: 0,
        moneyDonated: 0,
        xanaxDonated: 0
    }
*/

(function() {
    'use strict';

    console.log('Revive Advisor Started')

    var reviveData = [{
        id: 2162942,
        timesRevived: 1,
        moneyDonated: 0,
        xanaxDonated: 0
    },{
        id: 2165434,
        timesRevived: 1,
        moneyDonated: 0,
        xanaxDonated: 1
    },{
        id: 2142029,
        timesRevived: 1,
        moneyDonated: 500000,
        xanaxDonated: 0
    },{
        id: 2220399,
        timesRevived: 1,
        moneyDonated: 0,
        xanaxDonated: 1
    },{
        id: 165392,
        timesRevived: 1,
        moneyDonated: 0,
        xanaxDonated: 0
    },{
        id: 2169906,
        timesRevived: 5,
        moneyDonated: 0,
        xanaxDonated: 5
    }];

    var saveInfo = JSON.parse(localStorage.reviveInfo || "{}");
    var reviveInfo = {};

    $(document).ready(start_up);

    function start_up () {
        var pageHeader = document.querySelector("div.content-title");
        var tornProfileUrlString = document.URL + '&';
        var userXid = tornProfileUrlString.match(/[\?\&]XID=([^\&\#]+)[\&\#]/i)[1];

        load_revive_info();

        var advisorInfo = {
            id: 0,
            timesRevived: 0,
            moneyDonated: 0,
            xanaxDonated: 0
        };
        for (var i = 0; i < reviveInfo.players.length; i++) {
            if (reviveInfo.players[i].id == userXid) {
                advisorInfo = reviveInfo.players[i];
                break;
            }
        }

        var averageDonation = ((advisorInfo.moneyDonated + (advisorInfo.xanaxDonated*840000))/advisorInfo.timesRevived);
        if (!averageDonation) {
            averageDonation = 0;
        }

        var color = "#387938";
        if (advisorInfo.timesRevived > 0 && averageDonation < 500000) {
            color = "#de0e0e";
        }

        $("div.content-title").append(`<div style='
        border: 1px solid #888;
        background-color: #b7b3b3;
        padding: 5px;
        margin-top: 10px;
        color: ` + color + `;
        font-size: 16px;'>
        <div style="
        display: inline-block;
        border: 1px solid #888;
        padding: 5px;
        border-radius: 5px;
        ">Times Revived:<span>` + advisorInfo.timesRevived + `</span></div><div style="
        margin-left: 15px;
        display: inline-block;
        border: 1px solid #888;
        padding: 5px;
        border-radius: 5px;
        ">Money Donated:<span>` + advisorInfo.moneyDonated + `</span></div><div style="
        margin-left: 15px;
        display: inline-block;
        border: 1px solid #888;
        border-radius: 5px;
        padding: 5px;
        ">Xanax Donated:<span>` + advisorInfo.xanaxDonated + `</span></div><div style="
        margin-left: 15px;
        display: inline-block;
        border: 1px solid #888;
        border-radius: 5px;
        padding: 5px;
        ">Avg Donated:<span>` + averageDonation + `</span></div></div>`);
    }

    function load_revive_info() {
        reviveInfo.players = reviveInfo.players || reviveData;
    }
    
    function save_revive_info() {
        localStorage.reviveInfo = JSON.stringify(reviveInfo);
    }
})();

