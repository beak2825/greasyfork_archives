// ==UserScript==
// @name         vault stake
// @description  vault profit after reach desired percent
// @namespace    namtt007
// @version      1.0.0
// @author       namtt007
// @match        https://stake.com/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/409642/vault%20stake.user.js
// @updateURL https://update.greasyfork.org/scripts/409642/vault%20stake.meta.js
// ==/UserScript==

var accessToken = localStorage.getItem('session').replace(/"/g, '');
var initBalance = checkBalance();
var profitPercentVault = 1;
function getCurrency() {
    return JSON.parse(localStorage.getItem("v2_currency")).currency;
}
function getRate(cur) {
    return JSON.parse(localStorage.getItem('v2_currency')).conversions.rates[cur];
}

function depositBal(depositAmount) {
	var curr = getCurrency();
	var data = [{
	operationName: "CreateVaultDeposit",
	query: "mutation CreateVaultDeposit($amount: Float!, $currency: CurrencyEnum!) { createVaultDeposit(amount: $amount, currency: $currency) { id amount currency user { id balances { available { amount currency __typename } vault { amount currency __typename } __typename } __typename } __typename } } ",
	variables: {
	amount: depositAmount,
	currency: curr,}}]
	return fetch("https://api.stake.com/graphql", {
	"credentials": "omit",
	"headers": {
	"content-type": "application/json",
	'x-access-token': accessToken,
	'x-lockdown-token': undefined},
	"referrer": "https://stake.com/?currency=" + curr + "&modal=vault&operation=deposit",
	"body": JSON.stringify(data),
	"method": "POST",
	"mode": "cors"});
}

function checkBalance() {
	var curBalEle = document.querySelector(".styles__Cashier-puey40-2.dMSTdD .styles__Content-rlm06o-1.ixoRjG").innerText;
    console.log("curBalEle: " + curBalEle);
	return curBalEle;
}

function Vault() {
	var curr = getCurrency();
	console.log("initBalance: "+ initBalance + " " + curr);
	var currentBalance = checkBalance();	
	if((currentBalance - initBalance)/initBalance*100 >= profitPercentVault){
		var depositAmount = currentBalance - initBalance;
		depositBal(depositAmount);
		console.log("vaulted: "+ depositAmount + " " + curr);
	}
}

window.setInterval(Vault, 1200);