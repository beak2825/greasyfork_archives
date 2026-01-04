// ==UserScript==
// @name         Deposit/Withdraw Market version
// @version      1.30
// @description  Deposit/Withdraw from the bank (cough, market)
// @author       A Meaty Alt
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @grant        none
// @require      https://greasyfork.org/scripts/33146-bank-requester/code/Bank%20Requester.js?version=223958
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/34168/DepositWithdraw%20Market%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/34168/DepositWithdraw%20Market%20version.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var marketFlash = document.getElementById("flashMain1");
    var marketVars = marketFlash.children[0];
    var params = marketVars.value;

    var container = document.createElement("div");
    marketFlash.parentElement.prepend(container);
    var depositHolder = createHolder("Deposit", deposit);
    container.style.top = "35px";
    container.style.right = "105px";
    container.style.position = "relative";
    var withdrawHolder = createHolder("Withdraw", withdraw);
    withdrawHolder.style.float = "right";

    function createHolder(text, handler) {
        var holder = document.createElement("div");
        holder.style.textAlign = "center";
        holder.style.position = "relative";
        holder.style.display = "inline-block";
        var input = document.createElement("input");
        input.type = "number";
        input.value = 0;
        holder.appendChild(input);
        var btn = document.createElement("input");
        btn.type = "button";
        btn.value = text;
        btn.addEventListener("click", function(){
            handler(input.value, marketVars.value).then((response) => {
                input.value = 0;
                reloadFlash(response);
            });
        });
        holder.appendChild(document.createElement("br"));
        holder.appendChild(btn);
        container.append(holder);
        return holder;
    }

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
        params = params.replace(cashStr, newCashStr);
        params = params.replace(bankStr, newBankStr);

        profileVars.value = profileParams;
        profileFlash.innerHTML = profileFlash.innerHTML;
        marketVars.value = params;
        marketFlash.innerHTML = marketFlash.innerHTML;
    }
})();