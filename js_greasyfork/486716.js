// ==UserScript==
// @name         GC - Shop Till Withdraw Keyboard Shortcut
// @namespace    https://greasyfork.org/en/users/1175371
// @version      0.5
// @description  Press enter to empty your shop till! Press enter again to go straight to the bank with your riches.
// @author       sanjix
// @match        https://www.grundos.cafe/market/till/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486716/GC%20-%20Shop%20Till%20Withdraw%20Keyboard%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/486716/GC%20-%20Shop%20Till%20Withdraw%20Keyboard%20Shortcut.meta.js
// ==/UserScript==

var withdraw = document.querySelector('input[value="Withdraw"]');
var tillTotal = document.querySelector('input[name="amount"]');
var bank = document.querySelector('.always a[href="/bank/"]');

if (withdraw == null) {
    document.addEventListener("keydown", (event) => {
        if (event.keyCode == 13) {
            console.log('enter');
            bank.click();
        }
    });
} else {
    withdraw.focus();
}