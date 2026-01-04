// ==UserScript==
// @name         tofuntfAutoBuy1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hello
// @author       fvcker
// @match        https://tofunft.com/collection/thecryptoyou-role-bitcoin-holder/items?category=fixed-price&sort=price_asc
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tofunft.com
// @grant        none
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/436831/tofuntfAutoBuy1.user.js
// @updateURL https://update.greasyfork.org/scripts/436831/tofuntfAutoBuy1.meta.js
// ==/UserScript==

(function() {
'use strict';
//=================================================

//https://tofunft.com/collection/thecryptoyou-role-bitcoin-holder/items?category=fixed-price&sort=price_asc

var fPriceLine = 0.39;


var keepOpenSelectorTimerID = 0;

function openselector(){
	if(location.href.indexOf('items?category=fixed-price&sort=price_asc')==-1) return;
	let svgInButtons = document.querySelectorAll('button[aria-expanded]>svg');//button[aria-expanded="false"]>svg
	if(svgInButtons.length == 2){
		let downArrowBtn2nd = svgInButtons[1].parentNode;
		if(downArrowBtn2nd.getAttribute('aria-expanded')=='false'){
			downArrowBtn2nd.click();
		}else{		
			let strdownArrowBtn2ndID = downArrowBtn2nd.getAttribute('id');			
			if(strdownArrowBtn2ndID.indexOf('popover-trigger-')>-1){
				let strDivId = strdownArrowBtn2ndID.replace('trigger','body');
				let divLow2High = document.querySelector('#'+strDivId+'>div>div>div:nth-child(2)');
				if(divLow2High) divLow2High.click();
			}
		}
	}
}

let ele_p_price_1st = document.querySelector('p.chakra-text.css-0');
if(ele_p_price_1st){
	let strPrice_1st = ele_p_price_1st.innerText;
	if(strPrice_1st.indexOf('BNB')>-1){
		let fPrice = parseFloat(strPrice_1st);
		if(fPrice <= fPriceLine){			
			ele_p_price_1st.parentNode.parentNode.parentNode.parentNode.querySelector('button').click();
			clearInterval(keepOpenSelectorTimerID);//kill-reflash
		}
	}
}
//--------------------------------------------------------------------------
var buybuyTimerID = 0;
function buy_buyNow(){
	if(location.href.indexOf('https://tofunft.com/nft/bsc/0x')==-1) return;	
	let buyBtn = document.querySelector('section.chakra-modal__content>div.chakra-modal__body>button');
	if(buyBtn){
		buyBtn.click();
		clearInterval(buybuyTimerID);//kill-reflash
	}else{
		let all_ele = document.querySelectorAll('div>button.chakra-button');
		for(let i=0;i<all_ele.length;i++){
			if(all_ele[i].innerText=='Buy now'){
				all_ele[i].click();
				break;
			}
		}
	}
}
//-----------------------------------------------------------------------

function main(){
	keepOpenSelectorTimerID = setInterval(openselector,500);
	buybuyTimerID = setInterval(buy_buyNow,200);
}
main();



//=================================================
})();




