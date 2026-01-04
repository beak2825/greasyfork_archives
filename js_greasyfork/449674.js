// ==UserScript==
// @name         Kadena Meme Coins MarketCaps
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.4
// @description  View marketcaps for Kadena Meme Coins
// @author       xiownthisp
// @match        https://swap.ecko.finance/*
// @match        *://swap.ecko.finance/*
// @match        *://www.kdswap.exchange/*
// @match        *://kdswap.exchange/*
// @icon         https://pbs.twimg.com/profile_images/1559288937297784832/08KQAd0a_400x400.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449674/Kadena%20Meme%20Coins%20MarketCaps.user.js
// @updateURL https://update.greasyfork.org/scripts/449674/Kadena%20Meme%20Coins%20MarketCaps.meta.js
// ==/UserScript==

// MARKETCAP DISPLAY HAS A 5 SECOND DELAY*********************************

// Currently only displaying KAPY, KISHK and JDE MC

function waitForPriceToLoadEcko() {
    'use strict';
    var findPrice = document.getElementsByClassName("FlexContainer__STYFlexContainer-sc-16sly3k-0 esIlnH flex align-fs column");
    var rawPrice = findPrice[0].innerHTML;
    var slimPrice = rawPrice.substring(2);
    var slimPrice2 = slimPrice.slice(0,14);

    if (document.URL.indexOf("KAPY") >= 0){
        // IS THIS KAPY PAGE?

        var marketCapKapy = slimPrice2*600000000000;
        var getLocationKapy = document.getElementsByClassName("Label__STYText-sc-18cfvha-0 fcOtWE");
        getLocationKapy[0].innerHTML += "\n MARKET CAP = $"+marketCapKapy.toLocaleString()+"";
    }

    else if (document.URL.indexOf("KISHK") >= 0){
        // IS THIS KISHK PAGE?

        var marketCapKishk = slimPrice2*690000000000000;
        var getLocationKishk = document.getElementsByClassName("Label__STYText-sc-18cfvha-0 fcOtWE");
        getLocationKishk[0].innerHTML += "\n MARKET CAP = $"+marketCapKishk.toLocaleString()+"";
    }

    else if (document.URL.indexOf("JDE") >= 0){
        // IS THIS JODIE PAGE?

        var marketCapJodie = slimPrice2*3000000000;
        var getLocationJodie = document.getElementsByClassName("Label__STYText-sc-18cfvha-0 fcOtWE");
        getLocationJodie[0].innerHTML += "\n MARKET CAP = $"+marketCapJodie.toLocaleString()+"";
    }

    else{}

};

function waitForPriceToLoadKDSwap() {
    'use strict';
    var findPrice = document.getElementsByClassName("sc-eCYdqJ flGscM");
    var rawPrice = findPrice[0].innerHTML;
    var slimPrice = rawPrice.substring(2);
    var slimPrice2 = slimPrice.slice(0,14);

    if (document.URL.indexOf("kapy") >= 0){
        // IS THIS KAPY PAGE?

        var marketCapKapy = slimPrice2*600000000000;
        findPrice[0].innerHTML += "\n MARKET CAP = $"+marketCapKapy.toLocaleString()+"";
    }

    else if (document.URL.indexOf("kishk") >= 0){
        // IS THIS KISHK PAGE?

        var marketCapKishk = slimPrice2*690000000000000;
        findPrice[0].innerHTML += "\n MARKET CAP = $"+marketCapKishk.toLocaleString()+"";
    }

    else if (document.URL.indexOf("jde") >= 0){
        // IS THIS JODIE PAGE?

        var marketCapJodie = slimPrice2*3000000000;
        findPrice[0].innerHTML += "\n MARKET CAP = $"+marketCapJodie.toLocaleString()+"";
    }

    else{}

};

// We are waiting 5 seconds for the price to load on the page

if(document.URL.indexOf("swap.ecko.finance/token-info/") >= 0){
	setTimeout(waitForPriceToLoadEcko, 5000);
}
else if(document.URL.indexOf("kdswap.exchange/token/") >= 0){
	setTimeout(waitForPriceToLoadKDSwap, 5000);
}
else{};