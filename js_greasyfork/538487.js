// ==UserScript==
// @name         Pick Your Own prices
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      20250606
// @description  Shows prices from Virtupets in Pick Your Own
// @match        https://www.grundos.cafe/medieval/pickyourown*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @require https://update.greasyfork.org/scripts/512407/1463866/GC%20-%20Virtupets%20API%20library.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538487/Pick%20Your%20Own%20prices.user.js
// @updateURL https://update.greasyfork.org/scripts/538487/Pick%20Your%20Own%20prices.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }



    (async () => {
        var itemStockArray = [];
        var itemName = $('.margin-1.center p').text();
        itemName = itemName.substring(
            itemName.indexOf("You found one ") + 14
        );
        itemStockArray.push(itemName)


        try {
            console.log(itemStockArray)
            const response = await bulkShopWizardPrices(itemStockArray);
            const data = await response.json();
            console.log(data);

                      $('.margin-1.center p').append(`<br>Virtupets: ${data[0]['price']}`);

        } catch (error) {
            console.error('Failed to fetch prices:', error);
        }
    })();


})();