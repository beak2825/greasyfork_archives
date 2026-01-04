// ==UserScript==
// @name         *.top *.club Free Faucet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Free Faucet to FaucetPay
// @author       KayDee
// @match        https://tronfaucet.top/*
// @match        https://ltcfaucet.top/*
// @match        https://bnbfaucet.top/*
// @match        https://ethfaucet.top/*
// @match        https://dogecoinfaucet.top/*
// @match        https://zecfaucet.net/*
// @match        https://freedash.club/*
// @match        https://freedgb.club/*
// @match        https://freebch.club/*
// @icon         https://www.google.com/s2/favicons?domain=tronfaucet.top
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/429412/%2Atop%20%2Aclub%20Free%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/429412/%2Atop%20%2Aclub%20Free%20Faucet.meta.js
// ==/UserScript==

const websites = [
    "tronfaucet.top",
    "ltcfaucet.top",
    "bnbfaucet.top",
    "dogecoinfaucet.top",
    "ethfaucet.top",
    "zecfaucet.net",
    "freedash.club",
    "freedgb.club",
    "freebch.club"/*,
"freebinancecoin.com",
    "free-tron.com",
    "freeethereum.com",
    "freedash.io"*/
]
    var wallet="YOUR_WALLET";
    var walletCSS='#dima > div > form > p > label > input[type=text]';
    var submitCSS='#dima > div > form > p > input[type=submit]';
    var i;

setTimeout(function() {
    'use strict';

   // Claim when possible
    try {
        if(checkStatus()) {
        console.log("CLAIM");
        claim();}
} catch (error) {
    console.log("CLAIM error");
  console.error(error);

}

},random(30*1000,45*1000));

setTimeout(function(){ AutoSwitch(); }, random(3*60*1000,4*60*1000)); // Automatic page switching


// Claim
        function claim() {
        var elemFound = document.querySelector(walletCSS);
        if (elemFound) {
            elemFound.value=wallet;
            console.log("set text " + wallet + " on "+ walletCSS);
                    var elem1Found = document.querySelector(submitCSS);
        if (elem1Found) {
            elem1Found.click();
            console.log("Clicked on "+ submitCSS);
                   } else {
            console.log('Element NOT FOUND for XPath:\n' + submitCSS);
        }
        } else {
            console.log('Element NOT FOUND for XPath:\n' + walletCSS);
        }
            console.log('Exit claim()');
    };
// Auto Page Switching
function AutoSwitch() {
    setTimeout(function() {
        var current_page_id = websites.indexOf(window.location.hostname);
        var next_page_id = (current_page_id < websites.length - 1) ? current_page_id + 1 : 0;
        console.log("AutoSwitch from "+websites[current_page_id]+" to "+websites[next_page_id]);
        window.location.href = window.location.protocol + "//" + websites[next_page_id] + "/?r=DAdQWaFFVcM3xKb8XS1655PjoA3Lqr5d17"
    },random(2000,3000));
}
function random(min,max){
   return min + (max - min) * Math.random();
}

function checkStatus() {
    var elemFound = document.querySelector('#dima > p.warn');
    if (elemFound) {
        console.log("Already Claimed, switching site");
        setTimeout(function(){ AutoSwitch(); }, random(30*1000,40*1000)); // Automatic page switching
        return false;
    }
    else {
        return true;
    }
}