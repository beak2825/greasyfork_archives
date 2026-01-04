// ==UserScript==
// @name         Realistic Robux Faker
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  Robux Spoofer
// @author       Johnnyy
// @match        *://www.roblox.com/*
// @match        *://roblox.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522266/Realistic%20Robux%20Faker.user.js
// @updateURL https://update.greasyfork.org/scripts/522266/Realistic%20Robux%20Faker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var desiredNumber = 5788514;

    function replaceTransactionAmounts() {
        var transactionRows = document.querySelectorAll('tr');
        var replacedTotal = false;

        transactionRows.forEach(function(row) {
            var transactionLabel = row.querySelector('.summary-transaction-label');
            if (transactionLabel) {
                var label = transactionLabel.textContent.trim().toLowerCase();
                if (label === 'sales of goods' || (!replacedTotal && label === 'total')) {
                    var tdBalanceElement = row.querySelector('.amount.icon-robux-container span:last-child');
                    if (tdBalanceElement) {
                        tdBalanceElement.textContent = desiredNumber;
                        if (label === 'total') {
                            replacedTotal = true;
                        }
                    }
                }
            }
        });

        var balanceElement = document.querySelector('.balance-label.icon-robux-container span');
        if (balanceElement) {
            balanceElement.innerHTML = 'My Balance: <span class="icon-robux-16x16"></span>' + desiredNumber;
        }
    }

    function updateNavRobuxAmount() {
        var robux = document.getElementById("nav-robux-amount");
        if (robux) {
            robux.innerHTML = "578K+";
        }
        setTimeout(updateNavRobuxAmount, 0);
    }

    window.onload = function() {
        replaceTransactionAmounts();
        updateNavRobuxAmount();

        setInterval(function() {
            replaceTransactionAmounts();
        }, 1);
    };
})();
