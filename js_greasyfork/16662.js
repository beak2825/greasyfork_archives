// ==UserScript==
// @name         Mining
// @namespace    https://greasyfork.org/en/scripts/16662-mining
// @version      1.0e
// @description  Minink cickink pickink
// @author       M
// @match        https://cldmine.com/mining
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16662/Mining.user.js
// @updateURL https://update.greasyfork.org/scripts/16662/Mining.meta.js
// ==/UserScript==


var mineBtcButton = document.getElementsByTagName('input')[6];
var mineLtcButton = document.getElementsByTagName('input')[9];
var mineDogeButton = document.getElementsByTagName('input')[12];
var mineRddButton = document.getElementsByTagName('input')[36];



var   RddPerHour, RddPrice, btcPerHour, btcPrice, ltcPrice, ltcPerHour, dogePerHour, dogePrice;

UpdatePrices();

function UpdatePrices() {
   
    btcPerHour = parseFloat(document.getElementById('3').childNodes[3].childNodes[9].childNodes[1].childNodes[1].innerHTML);
    btcPrice = parseFloat(document.getElementById('3').childNodes[3].childNodes[11].childNodes[1].childNodes[1].innerHTML);
     //document.getElementById('3').childNodes[3].childNodes[9].childNodes[1].childNodes[1].innerHTML = btcPerHour * btcPrice * 24 + " usd per day";
    ltcPerHour = parseFloat(document.getElementById('4').childNodes[3].childNodes[9].childNodes[1].childNodes[1].innerHTML);
    ltcPrice = parseFloat(document.getElementById('4').childNodes[3].childNodes[11].childNodes[1].childNodes[1].innerHTML);
    dogePerHour = parseFloat(document.getElementById('5').childNodes[3].childNodes[9].childNodes[1].childNodes[1].innerHTML);
    dogePrice = parseFloat(document.getElementById('5').childNodes[3].childNodes[11].childNodes[1].childNodes[1].innerHTML);
    RddPerHour = parseFloat(document.getElementById('13').childNodes[3].childNodes[9].childNodes[1].childNodes[1].innerHTML);
    RddPrice = parseFloat(document.getElementById('13').childNodes[3].childNodes[11].childNodes[1].childNodes[1].innerHTML);
    
    btcPerHourInUSD = btcPerHour * btcPrice;
    ltcPerHourInUSD = ltcPerHour * ltcPrice;
    dogePerHourInUSD = dogePerHour * dogePrice;
    RddPerHourInUSD = RddPerHour * RddPrice;
    
    priceArray = [btcPerHourInUSD, ltcPerHourInUSD, dogePerHourInUSD, RddPerHourInUSD];
    priceArray.sort();
    highestPayout = priceArray[3];
    if (highestPayout == btcPerHourInUSD) {if (mineBtcButton.value == "Mining") mineBtcButton.click();}
    else if (highestPayout == ltcPerHourInUSD) {if (mineLtcButton.value == "Mining") mineLtcButton.click();}
    else if (highestPayout == dogePerHourInUSD) {if (mineDogeButton.value == "Mining") mineDogeButton.click();}
    else if (highestPayout == RddPerHourInUSD) {if (mineRddButton.value == "Mining") mineRddButton.click();}
    
    //console.log(priceArray[3]);
    //console.log("mining btc makes " + btcPerHour * btcPrice + " per hour");
    //console.log("mining ltc makes " + ltcPerHour * ltcPrice + " per hour"); 
    //console.log("mining doge makes " + dogePerHour * dogePrice + " per hour"); 
    
    //alert("btc=" + btcPerHour * btcPrice + " usd per hour\n" + "ltc=" + ltcPerHour * ltcPrice + " usd per hour" + "doge=" + dogePerHour * dogePrice + " usd per hour");

    console.log("btc=" + btcPerHour * btcPrice + " usd per hour\n" + "ltc=" + ltcPerHour * ltcPrice + " usd per hour\n" + "doge=" + dogePerHour * dogePrice + " usd per hour\n" + "Rdd=" + RddPerHour * RddPrice + " usd per hour\n")

setTimeout(function(){ location.reload(); }, 70000); // run every 70k ms
setTimeout(function(){ UpdatePrices(); }, 70000); // 
}