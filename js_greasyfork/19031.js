// ==UserScript==
// @name         cldmineNew
// @namespace    http://your.homepage/
// @version      0.6
// @description  reload every 2 minutes, click the most profitable coin
// @author       Unregistered+IvanKalyada
// @match        https://cldmine.com/account/mining
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19031/cldmineNew.user.js
// @updateURL https://update.greasyfork.org/scripts/19031/cldmineNew.meta.js
// ==/UserScript==

var mineBtcButton = document.getElementsByClassName('setMiningID')[0];
var mineLtcButton = document.getElementsByClassName('setMiningID')[1];
var mineDogeButton = document.getElementsByClassName('setMiningID')[2];
var mineEthButton = document.getElementsByClassName('setMiningID')[3]
var mineBlackButton = document.getElementsByClassName('setMiningID')[4];
//calm 18, dash 21, feather 24, name 27, red 30
var mineClamButton = document.getElementsByClassName('setMiningID')[5];
var mineDashButton = document.getElementsByClassName('setMiningID')[6];
var mineFeatherButton = document.getElementsByClassName('setMiningID')[7];
var mineNameButton = document.getElementsByClassName('setMiningID')[8];
var mineRedButton = document.getElementsByClassName('setMiningID')[9];


setInterval(function(){location.reload();}, 360000) // run every 2 minutes (120000 ms)
setTimeout(UpdatePrices, 60000);

function UpdatePrices() {
    btcPerHour = document.getElementsByClassName('speedPerHour')[0].title;
    ltcPerHour = document.getElementsByClassName('speedPerHour')[1].title;
    dogePerHour = document.getElementsByClassName('speedPerHour')[2].title;
    ethPerHour = document.getElementsByClassName('speedPerHour')[3].title;
    blackPerHour = document.getElementsByClassName('speedPerHour')[4].title;
    clamPerHour = document.getElementsByClassName('speedPerHour')[5].title;
    dashPerHour = document.getElementsByClassName('speedPerHour')[6].title;
    featherPerHour = document.getElementsByClassName('speedPerHour')[7].title;
    namePerHour = document.getElementsByClassName('speedPerHour')[8].title;
    redPerHour = document.getElementsByClassName('speedPerHour')[9].title;

    
    priceArray = [btcPerHour, ltcPerHour, dogePerHour, blackPerHour, clamPerHour, dashPerHour, featherPerHour, namePerHour, redPerHour];
    priceArray.sort();
    highestPayout = priceArray[priceArray.length-1];
    console.log("highestPayout=" + highestPayout);
    
    if (highestPayout == btcPerHour) {console.log('1');if (!mineBtcButton.disabled) mineBtcButton.click();}
    else if (highestPayout == ltcPerHour) {console.log('2');if (!mineLtcButton.disabled) mineLtcButton.click();}
    else if (highestPayout == dogePerHour) {console.log('3');if (!mineDogeButton.disabled) mineDogeButton.click();}
    else if (highestPayout == ethPerHour) {console.log('4');if (!mineEthButton.disabled) mineEthButton.click();}
    else if (highestPayout == blackPerHour) {console.log('5');if (!mineBlackButton.disabled) mineBlackButton.click();}
    else if (highestPayout == clamPerHour) {console.log('6');if (!mineClamButton.disabled) mineClamButton.click();}
    else if (highestPayout == dashPerHour) {console.log('7');if (!mineDashButton.disabled) mineDashButton.click();}
    else if (highestPayout == featherPerHour) {console.log('8');if (!mineFeatherButton.disabled) mineFeatherButton.click();}
    else if (highestPayout == namePerHour) {console.log('9');if (!mineNameButton.disabled) mineNameButton.click();}
    else if (highestPayout == redPerHour){console.log('10'); if (!mineRedButton.disabled) mineRedButton.click();}
    else {console.log('something wrong ?');}
    
    //console.log("btc=" + btcPerHourInUSD + " usd per hour\n" + "ltc=" + ltcPerHourInUSD + " usd per hour\n" + "doge=" + dogePerHourInUSD + " usd per hour\n"  + "black=" + blackPerHourInUSD + " usd per hour")
}