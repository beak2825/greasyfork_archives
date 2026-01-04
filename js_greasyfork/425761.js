// ==UserScript==
// @name         BSC-Bank.Finance (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.2
// @description  Auto Claim.
// @author       Jadson Tavares
// @match        https://bsc-bank.finance/cabinet*
// @match        *://*.pescadordecripto.com/install/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425761/BSC-BankFinance%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/425761/BSC-BankFinance%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    var minedVal = $('#sapper > main > div > div > div > div > div > section > div > div > div > div.right > div.text-wrap > b');

    function checkCondition(condition) {
		const poll = resolve => {
			if(condition()) resolve();
			else setTimeout(_ => poll(resolve), 400);
		}
		return new Promise(poll);
	}

    async function bsc(){
        await checkCondition(_ => minedVal.text() == '0.00034722');
        await delay(5000);
        document.querySelector("#sapper > main > div > div > div > div > div > section > div > div > div > div.right > div.btn-wrap > button").click();
        await delay(10000);
        await checkCondition(_ => grecaptcha && grecaptcha.getResponse().length > 0);
        document.querySelector("#popup-withdraw-balance > form > div.btn-wrap > button").click();
    }

    if (window.location.href.indexOf("bsc-bank.finance/cabinet") > -1) {
        bsc();
    }
    if (window.location.href.indexOf("pescadordecripto.com/install") > -1) {
        document.getElementById('bsc-bank-finance').classList.add("faucet-active");
    }
})();