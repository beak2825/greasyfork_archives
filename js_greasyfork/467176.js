// ==UserScript==
// @name         Neopets Shop Till Max Withdrawal
// @namespace    https://greasyfork.org/en/users/977735-naud
// @version      0.1
// @description  Automatically sets the withdrawal amount to the amount of NP in your till.
// @author       Naud
// @license      MIT
// @match        *://www.neopets.com/market.phtml?type=till
// @downloadURL https://update.greasyfork.org/scripts/467176/Neopets%20Shop%20Till%20Max%20Withdrawal.user.js
// @updateURL https://update.greasyfork.org/scripts/467176/Neopets%20Shop%20Till%20Max%20Withdrawal.meta.js
// ==/UserScript==

var d = document;

var input = document.querySelector("#content > table > tbody > tr > td.content > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > input[type=text]");
input.value = getNp();

function getNp() {
    var npTxt = document.querySelector("#content > table > tbody > tr > td.content > p:nth-child(9) > b").innerHTML;
    var np = parseInt(npTxt.split(" ")[0].replaceAll(",", ""));
    return np;
}
