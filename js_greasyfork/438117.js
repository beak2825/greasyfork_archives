// ==UserScript==
// @license MIT
// @name         Binance Futures USD value viewer
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script adds the USDT value for the size column in Binance USDT futures. dont worry there is no way I can steal your funds or excute trades.. all Im doing is get the pairs and entries then multiply them and display the results. Good trading!
// @author       @aowss18 / MetaMask : 0xc0FC8B388A882c38Dd2aE433d703EC0F06013E11
// @match        https://www.binance.com/en/futures/*
// @icon         https://www.google.com/s2/favicons?domain=binance.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438117/Binance%20Futures%20USD%20value%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/438117/Binance%20Futures%20USD%20value%20viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {

        //run this function every 500ms or half a second
        setInterval(function() {

            //get all the pairs
            const pairs = [];
            const pairsAmount = [];
            let totalUSD = 0;
            let amount = document.getElementsByClassName('size-buy');
            let entry = document.getElementsByClassName('entryPrice');
            let size = document.getElementsByClassName('position-row')[0].children[1].children[0].children[0];


            //push the pairs and pairs amounts in arrays
            for(let i = 0; i < amount.length ;i++){
                let amountNumber = amount[i].innerHTML.split(/(\s+)/);
                pairs.push(amountNumber[2]);
                pairsAmount.push(amountNumber[0].replace(/,/g, ''));
            }

            //calculate the price in USDT and append it to the size
            for(let i = 0; i < amount.length ;i++){
                let amountNumber = amount[i].innerHTML.split(/(\s+)/);
                let priceUSDT = parseFloat(entry[i+1].innerHTML) * parseFloat(pairsAmount[i]);
                totalUSD += priceUSDT;
                amount[i].innerHTML = pairsAmount[i] + ' ' + pairs[i] +' = '+ priceUSDT.toFixed(0) + ' USDT';
            }
            size.innerHTML = "Size =&nbsp<span style='color: rgb(14, 203, 129);'> " + totalUSD.toFixed(0) + "</span>";
        }, 500);

    });



    // Your code here...
})();