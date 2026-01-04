// ==UserScript==
// @name         ED Rec Combined Post Britta Ruh
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  D und Amadeus Rep
// @match        https://banking.postbank.de/*
// @match        https://www.drivehq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drivehq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488041/ED%20Rec%20Combined%20Post%20Britta%20Ruh.user.js
// @updateURL https://update.greasyfork.org/scripts/488041/ED%20Rec%20Combined%20Post%20Britta%20Ruh.meta.js
// ==/UserScript==

   // Function to parse the balance text with the correct format
    function parseBalanceText(balanceText) {
        var cleanedText = balanceText.replace(/[^\d.,-]/g, ''); // Remove non-numeric characters
        var parsedBalance = parseFloat(cleanedText.replace('.', '').replace(',', '.')); // Parse the balance with dot as the decimal separator
        return isNaN(parsedBalance) ? null : parsedBalance;
    }
