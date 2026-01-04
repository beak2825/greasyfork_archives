// ==UserScript==
// @name         Binance Futures Liquidation calculator
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Add liquidation calculator button on binance futures. Use at your own responsibility, we don't take any responsibility about that script.
// @author       trading.codes
// @match        *://www.binance.com/*futures*
// @icon         #
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457162/Binance%20Futures%20Liquidation%20calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/457162/Binance%20Futures%20Liquidation%20calculator.meta.js
// ==/UserScript==

const targetUrl = 'https://test5.trading.codes/tools/'; //?tool=binance_liquidation_calculator&submited

function postForm(params,ConfirmMessage, path, method, target)
{
	if (typeof ConfirmMessage != 'undefined' &&  ConfirmMessage != '') { if(!confirm(ConfirmMessage)){return;}}
	method = method || "POST"; //_blank
	path   = path	|| "";
	target = target || "";
	var form = document.createElement("form");form.setAttribute("method", method);form.setAttribute("action", path); form.setAttribute("target", target);
	for(var key in params) {
		if(params.hasOwnProperty(key))
		{
			var hiddenField = document.createElement("input");	hiddenField.setAttribute("type", "hidden");
			hiddenField.setAttribute("name", key);				hiddenField.setAttribute("value", params[key]);
			form.appendChild(hiddenField);
		}
	}
	document.body.appendChild(form); form.submit();
}

function checkLprice(evt){
    evt.preventDefault();
    const entryPrice = originalDocument.querySelector('[name="limitPrice"]').value;
    const pairName = originalDocument.body.innerHTML.match(/funding-history\/\d\?contract=(.*?)"/)[1];
    const leverage = (originalDocument.querySelector(".margin-leverage-or-title-row").textContent || '').replace('Isolated','').replace('Cross').replace('x','');
    const quoteCoin = pairName.includes("BUSD") ? "BUSD" : "USDT";
    const baseCoin = pairName.replace("USDT","").replace("BUSD","");
    postForm( {tool:'binance_liquidation_calculator', submited:true, entry_price:entryPrice, quote_coin: quoteCoin, base_coin:baseCoin, leverage:leverage, increasedLimitsPercentage:'', investedUsdt :'1' }, '' , targetUrl, 'GET', '_blank');
};


var originalDocument = null;
function insertLiqCaclButton(){
    document.addEventListener('readystatechange', event => {
        // When window loaded ( external resources are loaded too- `css`,`src`, etc...)
        if (event.target.readyState === "complete") {
            setTimeout( ()=>{
                originalDocument = unsafeWindow.document;
                unsafeWindow.checkLiqPrice = checkLprice;
                const unitAmount = document.querySelector('[name="unitAmount"]');
                if (unitAmount){
                    unitAmount.parentNode.insertAdjacentHTML('beforebegin', '<button style="position: absolute; top: 60px; width: 100px; z-index: 2;" onclick="checkLiqPrice(event)">calc LIQ</button>');
                    //document.querySelector("#chechLiqPriceButton").onclick = checkLiqPrice;
                }
            }, 1000);
        }
    });
}

(function() {
 insertLiqCaclButton();
})();