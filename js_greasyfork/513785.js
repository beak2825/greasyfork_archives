// ==UserScript==
// @name         Neopets Bank Autofill Withdraw and Deposit
// @version      1.0
// @description  Autofill withdrawal and deposit amounts on Neopets Bank page
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @author       Posterboy
// @match        https://www.neopets.com/bank.phtml
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace https://greasyfork.org/users/1277376
// @downloadURL https://update.greasyfork.org/scripts/513785/Neopets%20Bank%20Autofill%20Withdraw%20and%20Deposit.user.js
// @updateURL https://update.greasyfork.org/scripts/513785/Neopets%20Bank%20Autofill%20Withdraw%20and%20Deposit.meta.js
// ==/UserScript==

if (!GM_getValue) {
    GM_getValue = (key, val) => localStorage[key] ? JSON.parse(localStorage[key]) : val;
    GM_setValue = (key, val) => localStorage[key] = JSON.stringify(val);
}

if (!GM_getValue("config")) {
    let config = {
        deposit: 1000000,
    };
    GM_setValue("config", config);
}
let config = GM_getValue("config");

const url = location.href;

if (url.includes("bank")) {
    // Pulling the current balance
    const bankBalanceText = document.querySelector("#txtCurrentBalance1").innerText.replace(/[^\d]/g, "");

    // Autofill Deposit form with 1,000,000
    const depositInput = document.querySelector("#frmDeposit input[name='amount']");
    if (depositInput) {
        depositInput.value = 1000000;
    }

    // Set Withdrawal to the last 6 digits of the bank balance
    const withdrawInput = document.querySelector("#frmWithdraw input[name='amount']");
    if (withdrawInput) {
        withdrawInput.value = bankBalanceText.slice(-6);
    }
}