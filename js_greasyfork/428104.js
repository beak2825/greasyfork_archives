// ==UserScript==
// @name         BSC-Staking.Finance (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.2
// @description  Auto Claim.
// @author       Jadson Tavares
// @match        https://bsc-staking.finance/dashboard*
// @match        *://*.pescadordecripto.com/install/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428104/BSC-StakingFinance%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428104/BSC-StakingFinance%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    var minedVal = $('#sapper > main > div.tabs > div > div > div:nth-child(2) > div > div > div > div.my-deposits__items > div > div > div.my-deposits__information > div.my-deposits__balancy > p');

    function checkCondition(condition) {
		const poll = resolve => {
			if(condition()) resolve();
			else setTimeout(_ => poll(resolve), 400);
		}
		return new Promise(poll);
	}

    async function bsc(){
        await checkCondition(_ => minedVal.text() == '0.00003472 BNB');
        await delay(5000);
        document.querySelector("#sapper > main > div.tabs > div > div > div:nth-child(2) > div > div > div > div.my-deposits__items > div > div > a").click();
        await delay(10000);
        await checkCondition(_ => grecaptcha && grecaptcha.getResponse().length > 0);
        document.querySelector("#popup-withdraw-balance > form > div.btn-wrap.svelte-9w1pc0 > button").click();
        await delay(3000);
        window.history.go(0);
    }

    if (window.location.href.indexOf("https://bsc-staking.finance/dashboard") > -1) {
        bsc();
    }
    if (window.location.href.indexOf("pescadordecripto.com/install") > -1) {
        document.getElementById('bsc-staking-finance').classList.add("faucet-active");
    }
})();