// ==UserScript==
// @name         GC Bank Deposit Math
// @namespace    https://greasyfork.org/en/users/1175371
// @version      0.6
// @description  Calculates how many of your np to deposit so that you have a set amount left in your wallet (default 50k).
// @author       sanjix
// @match        https://www.grundos.cafe/bank/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476374/GC%20Bank%20Deposit%20Math.user.js
// @updateURL https://update.greasyfork.org/scripts/476374/GC%20Bank%20Deposit%20Math.meta.js
// ==/UserScript==

const leave = 50000;
var wallet = document.querySelector('a[href="/inventory/"]').textContent.replace(/,/g,'');

const deposit = document.querySelector('input[id="depositamount"]');

const withdraw = document.querySelector('input[id="withdrawalamount"]');

var interestButton = document.querySelector('form[action="/bank/collect_interest/"] input[type="submit"]');
if (interestButton != null && wallet != 0) {
    deposit.value = wallet;
    deposit.focus();
} else if (interestButton != null && wallet == 0) {
    interestButton.focus();
} else if (wallet > leave) {
    deposit.value = wallet - leave;
    deposit.focus();
} else if (wallet < leave) {
    withdraw.value = leave - wallet;
    withdraw.focus();
}
