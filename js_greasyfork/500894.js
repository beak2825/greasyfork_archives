// ==UserScript==
// @name         p_dh Robux Spoofer
// @namespace    http://tampermonkey.net/
// @version      1.22
// @description  Combines fake Robux transactions with spoofed Robux display and formatting
// @author       p_dh
// @match        *://*.roblox.com/*
// @grant        GM.setValue
// @grant        GM.getValue
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Robux_2019_Logo_gold.svg/1883px-Robux_2019_Logo_gold.svg.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500894/p_dh%20Robux%20Spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/500894/p_dh%20Robux%20Spoofer.meta.js
// ==/UserScript==

// esc to access the menu

(function() {
    'use strict';

    var amount = 12820;
    var salesOfGoodsExtra = 460325; // Amount to add to "Sales of Goods"
    var purchasesBaseAmount = 460325; // Base amount for Purchases

    document.addEventListener('keydown', function(event){
        if(event.key === "Escape"){
            var UsernameDoc = document.querySelector(".age-bracket-label-username");
            if (UsernameDoc) {
                var newAmount = prompt("Choose the Number to set " + UsernameDoc.innerHTML + "'s Robux to:                                MINIMUM OF 1,100,000");
                if (!isNaN(newAmount)) {
                    setValue(Number(newAmount) + salesOfGoodsExtra);
                } else {
                    console.log("Invalid amount entered");
                }
            } else {
                console.log("Username element not found");
            }
        }
    });

    function setValue(amount) {
        GM.setValue("RobuxSaved", amount).then(function() {
            updateAmounts();
        }).catch(function(error) {
            console.error("Error setting RobuxSaved:", error);
        });
    }

    function getValue(key, defaultValue) {
        return GM.getValue(key, defaultValue);
    }

    function updateAmounts() {
        getValue("RobuxSaved", salesOfGoodsExtra).then(function(savedAmount) {
            amount = savedAmount;
            updateRobuxDisplay();
            replaceTransactionAmounts();
        }).catch(function(error) {
            console.error("Error getting RobuxSaved:", error);
        });
    }

    function format(num) {
        if (num < 1000) { return num.toString(); }
        if (num >= 1000 && num < 1000000) { return (num / 1000).toFixed(1) + "K+"; }
        if (num >= 1000000 && num < 1000000000) { return (num / 1000000).toFixed(1) + "M+"; }
        if (num >= 1000000000 && num < 1000000000000) { return (num / 1000000000).toFixed(1) + "B+"; }
        if (num >= 1000000000000 && num < 1000000000000000) { return (num / 1000000000000).toFixed(1) + "T+"; }
        if (num >= 1000000000000000) { return (num / 1000000000000000).toFixed(1) + "Q+"; }
    }

    function addCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function updateRobuxDisplay() {
        var robux = document.getElementById("nav-robux-amount");
        if (robux && robux.innerHTML !== format(amount)) {
            robux.innerHTML = format(amount);
        }
        var robux2 = document.getElementById("nav-robux-balance");
        if (robux2 && robux2.innerHTML && robux2.innerHTML !== amount.toLocaleString()) {
            robux2.innerHTML = amount.toLocaleString() + ' Robux';
        }
    }

    function replaceTransactionAmounts() {
        var categories = ['premium stipends', 'currency purchases', 'sales of goods', 'group payouts', 'purchases'];
        var transactionRows = document.querySelectorAll('tr');

        // Allocate a higher percentage to "Sales of Goods" and "Group Payouts"
        var salesOfGoodsPercentage = 0.5; // 50%
        var groupPayoutsPercentage = 0.2; // 20%

        var salesOfGoodsAmount = (amount * salesOfGoodsPercentage).toFixed(0);
        var groupPayoutsAmount = (amount * groupPayoutsPercentage).toFixed(0);

        salesOfGoodsAmount = Number(salesOfGoodsAmount) + salesOfGoodsExtra;

        var premiumStipendsAmount = 4400;
        var purchasesAmount = purchasesBaseAmount + amount - salesOfGoodsAmount - groupPayoutsAmount - premiumStipendsAmount;

        var replacedTotal = false;

        transactionRows.forEach(function(row) {
            var transactionLabel = row.querySelector('.summary-transaction-label');
            if (transactionLabel) {
                var label = transactionLabel.textContent.trim().toLowerCase();
                var tdBalanceElement = row.querySelector('.amount.icon-robux-container span:last-child');
                if (tdBalanceElement) {
                    if (label === 'premium stipends') {
                        tdBalanceElement.textContent = addCommas(premiumStipendsAmount);
                    } else if (label === 'sales of goods') {
                        tdBalanceElement.textContent = addCommas(salesOfGoodsAmount);
                    } else if (label === 'group payouts') {
                        tdBalanceElement.textContent = addCommas(groupPayoutsAmount);
                    } else if (label === 'purchases') {
                        tdBalanceElement.textContent = addCommas(purchasesAmount);
                    } else if (label === 'total') {
                        tdBalanceElement.textContent = addCommas(amount);
                        replacedTotal = true;
                    } else if (categories.includes(label)) {
                        var otherCategoriesAmount = (amount - premiumStipendsAmount - salesOfGoodsAmount - groupPayoutsAmount).toFixed(0);
                        tdBalanceElement.textContent = addCommas(otherCategoriesAmount);
                    }
                }
            }
        });

        var balanceElement = document.querySelector('.balance-label.icon-robux-container span');
        if (balanceElement) {
            balanceElement.innerHTML = 'My Balance: <span class="icon-robux-16x16"></span>' + addCommas(amount);
        }
    }

    function start() {
        updateRobuxDisplay();
        updateAmounts();
        setInterval(function() {
            updateAmounts();
        }, 1000);
    }

    window.onload = function() {
        start();
    };
})();