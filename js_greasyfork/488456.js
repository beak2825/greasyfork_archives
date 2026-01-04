// ==UserScript==
// @name         Get Total Purchase Value
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Get total purchase value from API and display it
// @author       You
// @match        https://*.battle.net/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/488456/Get%20Total%20Purchase%20Value.user.js
// @updateURL https://update.greasyfork.org/scripts/488456/Get%20Total%20Purchase%20Value.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create button
    var button = document.createElement('button');
    button.textContent = 'Get Total Purchase Value';
    document.body.appendChild(button);

    // Create text element to display total value
    var totalValueText = document.createElement('p');
    document.body.appendChild(totalValueText);

    // Add click event listener to button
    button.addEventListener('click', function() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://account.battle.net/api/transactions?regionId=2',
            onload: function(response) {
                var data = JSON.parse(response.responseText);
                var purchases = data['purchases'];
                var totalValue = 0;

                // Loop through purchases and add up total value
                for (var i = 0; i < purchases.length; i++) {
                    totalValue += purchases[i]['total'].value;
                    console.log(purchases[i]['total'].value);
                }

                // Display total value
                totalValueText.textContent = 'Total Purchase Value: ' + totalValue;
            }
        });
    });
})();