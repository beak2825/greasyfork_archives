// ==UserScript==
// @name         Withdraw and Deposit All (Bank and Shop Till)
// @namespace    http://neopat.ch
// @license      GNU GPLv3
// @version      1.0
// @description  Adds a withdraw all option for the shop till and a deposit all button to the bank to deposit all NP on-hand
// @author       Lamp
// @match        https://www.neopets.com/bank.phtml
// @match        https://www.neopets.com/market.phtml?type=till
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500326/Withdraw%20and%20Deposit%20All%20%28Bank%20and%20Shop%20Till%29.user.js
// @updateURL https://update.greasyfork.org/scripts/500326/Withdraw%20and%20Deposit%20All%20%28Bank%20and%20Shop%20Till%29.meta.js
// ==/UserScript==

(function() {

    if (document.querySelector("#frmDeposit > div.bank-input-grid > input.button-default__2020.button-yellow__2020.bank-btn")){
    document.querySelector("#frmDeposit > div.bank-input-grid > input.button-default__2020.button-yellow__2020.bank-btn").outerHTML+=`
<input class="button-default__2020 button-yellow__2020 bank-btn" onclick="document.querySelector('#frmDeposit > div.bank-input-grid > input[type=text]:nth-child(1)').value=document.querySelector('#npanchor').innerHTML.replace(',', '');document.querySelector('#frmDeposit > div.bank-input-grid > input.button-default__2020.button-yellow__2020.bank-btn').click()" value="Deposit All">`;
    }


    if (document.querySelector("#content > table > tbody > tr > td > form > table > tbody > tr:nth-child(3) > td > input[type=submit]")){

        document.querySelector("#content > table > tbody > tr > td > form > table > tbody > tr:nth-child(3) > td > input[type=submit]").outerHTML+=`<input type="button" onclick="document.querySelector('#content > table > tbody > tr > td > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > input[type=text]').value=document.querySelector('#content > table > tbody > tr > td > p:nth-child(9) > b').innerHTML.replace(',', '').replace(' NP', '');document.querySelector('#content > table > tbody > tr > td > form > table > tbody > tr:nth-child(3) > td > input[type=submit]').click()" value="Withdraw All">`
    }
})();