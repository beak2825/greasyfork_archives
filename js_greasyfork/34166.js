// ==UserScript==
// @name         Deposit/Withdraw
// @version      1.3
// @description  Deposit/Withdraw from the bank
// @author       A Meaty Alt
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=15
// @grant        none
// @require      https://greasyfork.org/scripts/33146-bank-requester/code/Bank%20Requester.js?version=223958
// @run-at idle
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/34166/DepositWithdraw.user.js
// @updateURL https://update.greasyfork.org/scripts/34166/DepositWithdraw.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var bankFlash = document.getElementById("flashMain1");
    var profileFlash = document.getElementById("flashAlt1");
    var rectObject = bankFlash.getBoundingClientRect();
    var params = bankFlash.querySelector("param[name=flashvars]").value;

    var withdrawHolder = document.createElement("div");
    withdrawHolder.style.textAlign = "center";
    withdrawHolder.style.position = "fixed";
    var withdrawInput = document.createElement("input");
    withdrawInput.id = "wInput";
    withdrawInput.type = "number";
    withdrawInput.value = 0;
    var withdrawBtn = document.createElement("input");
    withdrawBtn.type = "button";
    withdrawBtn.value = "Withdraw";
    withdrawBtn.addEventListener("click", function(){
        var toWithdraw = getMoneyToWithdraw();
        var params = document.getElementById("flashMain1").querySelector("param[name=flashvars]").value;
        withdraw(toWithdraw, params).then((response) => {document.getElementById("wInput").value = 0;reloadFlash(response);});
    });
    withdrawHolder.appendChild(withdrawInput);
    withdrawHolder.innerHTML += "<br>";
    withdrawHolder.appendChild(withdrawBtn);

    var depositHolder = document.createElement("div");
    depositHolder.id = "asd";
    depositHolder.style.textAlign = "center";
    depositHolder.style.position = "fixed";
    var depositInput = document.createElement("input");
    depositInput.id = "dInput";
    depositInput.type = "number";
    depositInput.value = 0;
    var depositBtn = document.createElement("input");
    depositBtn.type = "button";
    depositBtn.value = "Deposit";
    depositBtn.addEventListener("click", function(){
        var toDeposit = getMoneyToDeposit();
        deposit(toDeposit, params).then((response) => {document.getElementById("dInput").value = 0;reloadFlash(response);});
    });
    depositHolder.appendChild(depositInput);
    depositHolder.innerHTML += "<br>";
    depositHolder.appendChild(depositBtn);

    function getMoneyToWithdraw(){
        return document.getElementById("wInput").value;
    }
    function getMoneyToDeposit(){
        return document.getElementById("dInput").value;
    }

    function reloadFlash(response){

        var responseCash = response.match(/df_cash=(.*)/)[1];
        if(responseCash == "")
            return;
        var responseBank = response.match(/df_bankcash=(.*?)&/)[1];

        var profileFlash = document.getElementById("flashAlt1");
        var profileVars = profileFlash.querySelector("param[name=flashvars]");
        var profileParams = profileVars.value;

        var cashStr = profileParams.match(/df_cash=(.*?)&/)[0];
        var newCashStr = cashStr.replace(/\d+/, responseCash);
        var bankStr = profileParams.match(/df_bankcash=(.*?)&/)[0];
        var newBankStr = bankStr.replace(/\d+/, responseBank);

        profileParams = profileParams.replace(cashStr, newCashStr);
        profileParams = profileParams.replace(bankStr, newBankStr);
        profileVars.value = profileParams;
        profileFlash.innerHTML = profileFlash.innerHTML;

        bankFlash.innerHTML = bankFlash.innerHTML;
    }
    function fixPosition(){
        var rectObject = bankFlash.getBoundingClientRect();
        depositHolder.style.left = rectObject.left + "px";
        depositHolder.style.top = rectObject.top + rectObject.height -90 + "px";
        withdrawHolder.style.left = rectObject.left + rectObject.width - 140 + "px";
        withdrawHolder.style.top = rectObject.top + rectObject.height -90 + "px";
    }

    var body = document.getElementsByTagName("body")[0];
    body.appendChild(withdrawHolder);
    body.appendChild(depositHolder);
    setInterval(fixPosition, 30);
})();