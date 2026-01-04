// ==UserScript==
// @name febbit autocliker 2019
// @namespace febbit
// @description Auto refresh the energy of the monster and the boost. Works only on mining page (/miner)
// @author GtTeam
// @match https://febbit.com/miner
// @run-at document-end
// @version 1.0.2
// @icon
// @credit https://febbit.com/?ref=5cefc4a2462c52000132f955
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/387358/febbit%20autocliker%202019.user.js
// @updateURL https://update.greasyfork.org/scripts/387358/febbit%20autocliker%202019.meta.js
// ==/UserScript==

//If you like this script, please signup through the following link https://febbit.com/?ref=5cefc4a2462c52000132f955
//Or throw a couple of satoshi my way "1KZcmd3tmh6fDPzG9hHNCmcZ7sfwGg3rsy"

//settings
var timer = undefined;
var counter = 0;
var website_url = "https://febbit.com/miner";

var sec_05 = 5000;
var sec_10 = 10000;
var sec_30 = 30000;
var min_01 = 60000;
var min_02 = 120000;
var min_03 = 180000;
var min_05 = 300000;
var min_10 = 600000;
var min_15 = 900000;
var min_20 = 1200000;
var min_30 = 1800000;
var min_45 = 2700000;
var min_60 = 3600000;

function clearBoost(){
    setTimeout(closeReward(), 500);
    setTimeout(function(){}, 1000);
    var boost = document.getElementsByClassName("boost-icon-flashing ng-tns-c30-11 ng-star-inserted");
    if(boost.length){
        boost[0].click();
    }
    closeReward();
}

function checkCollectCase(){
    setTimeout(closeReward(), 500);
    //console.log("Collect Case");
    var collect = document.getElementsByClassName("timer-text ng-tns-c30-11 ng-star-inserted");
    if (collect[0].innerText === "Collect"){
        collect[0].click();
    }
    closeReward();
}
//"miner-cart"

function closeReward(){
    //console.log("Close reward");
    setTimeout(function(){
        //console.log("rewards");
        var close_r = document.getElementsByClassName("btn btn-primary btn-lg center");
        //console.log(close_r.length);
        if(close_r.length === 1){
            close_r[0].click();
        }
    }, 3000);

    //jQuery.event.trigger({ type : 'keypress', which : 27 });
}

function try_refresh(){
    closeReward();
    //setTimeout(function(){}, 2000);
    //console.log("Start refresh");
    var refresh = document.getElementsByClassName("fa fa-refresh");
    if(refresh){
        refresh[0].click();
        setTimeout(closeReward(), 4000);
    }
    //console.log("End refresh");
}

function try_clearBoost(){
    setTimeout(function(){}, 1000);
    closeReward();
    //console.log("Try to clear boost");
    clearBoost();
    setTimeout(closeReward(), sec_05);
}

var timerVar = setInterval (function() {try_refresh (); }, sec_10);
var timerVar2 = setInterval (function() {try_clearBoost (); }, sec_05);
