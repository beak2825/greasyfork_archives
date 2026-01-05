// ==UserScript==
// @name         [BitoEX] show price per bitcoin
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  BitoEX show price per bitcoin in dashboard
// @author       SSARCandy
// @match        https://www.bitoex.com/dashboard*
// @downloadURL https://update.greasyfork.org/scripts/27219/%5BBitoEX%5D%20show%20price%20per%20bitcoin.user.js
// @updateURL https://update.greasyfork.org/scripts/27219/%5BBitoEX%5D%20show%20price%20per%20bitcoin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var bitcoins = [];
    var totalPrices = [];

    $('#tab-2 > div > table > tbody > tr > td:nth-child(4)').each((x, i) => {
        bitcoins.push( parseFloat(i.innerText));
    });
    $('#tab-2 > div > table > tbody > tr > td:nth-child(5)').each((x, i) => {
        totalPrices.push( parseInt(i.innerText.replace(/,/g, '')));
    });

    for(var i = 0; i < totalPrices.length; i++){
        var price = (totalPrices[i] / bitcoins[i]);
        $('#tab-2 > div > table > tbody > tr:nth-child('+(i+1)+') > td:nth-child(4)').after('<td>'+(price.toFixed(0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td>');
    }
    $('#tab-2 > div > table > thead > tr > th:nth-child(4)').after('<th>單價(TWD)</th>');
})();