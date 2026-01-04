// ==UserScript==
// @name         recruit script
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.2
// @description  Provides info on a users activity over the past month!
// @author       qez
// @match        https://www.torn.com/profiles.php?XID=*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476637/recruit%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/476637/recruit%20script.meta.js
// ==/UserScript==

var api_key = "API KEY HERE";

async function fetchPersonalStats(id, time){
    var url;
    var stats = "xantaken,energydrinkused,useractivity,refills,attackswon,respectforfaction,retals,traveltimes,statenhancersused,networth";

    if (time != undefined){
        url = 'https://api.torn.com/user/' + id + '?selections=personalstats&stat=' + stats + '&timestamp=' + time +'&key=' + api_key;
    }else{
        url = 'https://api.torn.com/user/' + id + '?selections=personalstats&key=' + api_key;
    }

    //console.log(url);
    var resp = await fetch(url);

    return resp.json();
}

(function() {
    'use strict';

    console.log("TEST");
    var d = new Date();
    d.setMonth(d.getMonth()-1);

  //  console.log(~~(d / 1000));
    var monthAgo = ~~(d / 1000);
   // console.log(window.location.href.split("=")[1]);
    var id = window.location.href.split("=")[1];

    var d2 = new Date();
    var days = ~~(d2/1000) - monthAgo;
    days = days/86400;

    var promises = [];
    promises.push(fetchPersonalStats(id, monthAgo));
    promises.push(fetchPersonalStats(id));
    Promise.all(promises).then((p) => {
        console.log(p[0]);
        console.log(p[1]);

        var p0 = p[0].personalstats;
        var p1 = p[1].personalstats;

        var xanaxTaken = p1.xantaken - p0.xantaken;
        var edrinkTaken = p1.energydrinkused - p0.energydrinkused;
        var userActivity = (p1.useractivity - p0.useractivity)/86400;
        var refills = p1.refills - p0.refills;
        var attacks = p1.attackswon - p0.attackswon;
        var totalRespect = p1.respectforfaction - p0.respectforfaction;
        var retals = p1.retals - p0.retals;
        //var bountiesRecived = p1.bountiesreceived - p0.bountiesreceived;
        //var bountiesPlaced = p1.bountiesplaced - p0.bountiesplaced;
        //var bountiesCollected = p1.bountiescollected - p0.bountiescollected;
        var travel = p1.traveltimes - p0.traveltimes;
        var se = p1.statenhancersused - p0.statenhancersused;
        var networth = p1.networth - p0.networth;

        var outputStr = "";
        outputStr += ("Activity: " + (userActivity).toFixed(2) + " hrs/day");
        outputStr += "\n<br>";
        outputStr += ("Xanax: " + xanaxTaken + " ( " +(xanaxTaken/days).toFixed(2) + "/day )" );
        outputStr += "\n<br>";
        outputStr += ("Refills: " + refills + " ( " +(refills/days).toFixed(2) + "/day )" );
        outputStr += "\n<br>";
        outputStr += ("Cans: " + edrinkTaken + " ( " +(edrinkTaken/days).toFixed(2) + "/day )" );
        outputStr += "\n<br>";
        outputStr += "Attacks: " + attacks;
        outputStr += "\n<br>";
        outputStr += "Respect: " + totalRespect;
        outputStr += "\n<br>";
        outputStr += "Retals: " + retals;
        outputStr += "\n<br>";
        //outputStr += "Bounties:  placed: " + bountiesPlaced + " recived: " + bountiesRecived + " claimed: " + bountiesCollected;
        //outputStr += "\n<br>";
        outputStr += "Travel: " + travel;
        outputStr += "\n<br>";
        outputStr += "Networth: " + (p1.networth/1000000000).toFixed(2) + "b ( " + (networth/1000000000).toFixed(2) + "b )";
        outputStr += "\n<br>";
        outputStr += "SEs: " + se;
        outputStr += "\n<br>";
//        console.log(outputStr);

        var output = document.createElement("div");
        output.innerHTML = outputStr;
        document.querySelector(".profile-wrapper").appendChild(output);

    }, function(err) {
    // error occurred
        console.log(err);
    });
})();