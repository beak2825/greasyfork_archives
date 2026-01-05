// ==UserScript==
// @name        AmazonSE
// @namespace   MrBrax
// @description proper swedish prices on amazon
// @include     https://www.amazon.de/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28204/AmazonSE.user.js
// @updateURL https://update.greasyfork.org/scripts/28204/AmazonSE.meta.js
// ==/UserScript==

var ourPrice = document.getElementById("priceblock_ourprice");

if(ourPrice){

	var pPrice = parseFloat( ourPrice.innerHTML.substr(4) );

	var sweTax = pPrice + ( pPrice * 0.05 );

	var rPrice = Math.round( sweTax * 100 ) / 100;

	ourPrice.innerHTML = '<span style="color:#7899EC">SE EUR ' + rPrice + '</span> <small style="font-size: 80%">(DE EUR ' + pPrice + ')</span>';

}

var vatMsg = document.getElementById("vatMessage");
if(vatMsg){
	var l = vatMsg.children[1];
	l.innerHTML += '<br>Prices have been modified to include Swedish VAT.';
}

var q = "span.sc-price"; // regular price label
q += ", span.p13n-sc-price"; // also bought
q += ", div.acs_product-price span.a-color-price";
q += ", div.s-item-container span.a-color-price";
q += ", div.twisterSlotDiv span.a-color-price"; // current sel
q += ", div.twisterSlotDiv span.a-color-secondary span.a-size-mini"; // other sel
q += ", #olp_feature_div span.a-color-price"; // new/old
q += ", #regularprice_savings .a-color-price"; // "you save"

var prices = document.querySelectorAll(q);
for(var i = 0; i < prices.length; i++){
	var pPrice = parseFloat( prices[i].innerText.trim().substr(4) );
	var sweTax = pPrice + ( pPrice * 0.0532 );
	var rPrice = ( Math.round( sweTax * 100 ) / 100 );

	prices[i].innerHTML = '<span style="color:#7899EC">EUR</span> ' + rPrice + ' <small style="font-size: 80%; opacity:.5;">(EUR ' + pPrice + ')</small>';

}