// ==UserScript==
// @name         Highlight Amex Membership Reward points value
// @namespace    http://sisyphus.de/
// @version      1.0
// @description  Mark all offers with regular point/EUR ratio yellow, all with a high ratio orange!
// @author       Tobias Henöckl <hoeni-greasyfork@sisyphus.de>
// @match        https://global.americanexpress.com/rewards/points-for-charges/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=americanexpress.com
// @grant        none
// @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/475092/Highlight%20Amex%20Membership%20Reward%20points%20value.user.js
// @updateURL https://update.greasyfork.org/scripts/475092/Highlight%20Amex%20Membership%20Reward%20points%20value.meta.js
// ==/UserScript==

var threshold = 250;
var maxAttempts = 50;
var waitBetweenAttempts = 500;
var waitAfterClickMillis = 2000;

(function() {
    'use strict';

    var attempts = 0;
    var interval = setInterval(function() {
        attempts++;

        var table = document.querySelector("#roc-table");
        if (table || attempts > maxAttempts) {
            clearInterval(interval);
            highlightRows();
            setupButtonListener();
        }
    }, waitBetweenAttempts);
})();

function highlightRows() {
    var table = document.querySelector("table");
    if (!table) return;

    table.querySelectorAll("tr").forEach(function(row) {
        var cells = row.querySelectorAll("td");
        if (cells.length < 6) {
            return;
        }

        var valueCents = parseFloat(cells[5].textContent.replace(/\./g, '').replace(/,/g, '.'), 10);
        if(isNaN(valueCents)) {
           return;
        }
        var points = parseFloat(cells[6].textContent.replace(/\./g, ''), 10);
        if(isNaN(points)) {
           return;
        }
        if (Math.round(points / valueCents) >= threshold) {
           row.style.backgroundColor = "yellow";
        } else {
           row.style.backgroundColor = "orange";
        }
    });
}

function setupButtonListener() {
    var viewAllButton = document.getElementById("view-all-button");

    if (viewAllButton) {
        viewAllButton.addEventListener('click', function() {
            console.log('klickediklick');
            setTimeout(highlightRows, waitAfterClickMillis);
        });
    }
}