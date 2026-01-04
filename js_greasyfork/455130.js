// ==UserScript==
// @name         Submit for MB_Solver
// @namespace    Violentmonkey Scripts
// @version      1.4
// @description  Sending the form after solving the captcha
// @author       MultiBot
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455130/Submit%20for%20MB_Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/455130/Submit%20for%20MB_Solver.meta.js
// ==/UserScript==
(function() {
	'use strict';
	function _Search_Captcha(){
		let done_captcha = false;
		if (document.querySelector('input#antibotlinks') && !document.querySelector('input#antibotlinks').value){
			return false;
		}
		if (window.grecaptcha && window.grecaptcha.getResponse()){
			done_captcha = true;
		}
		if (typeof window.hcaptcha=="object" && window.hcaptcha.getResponse()){
			done_captcha = true;
		}
		if (typeof window.ACPuzzleInfo=="object" && document.querySelector("#adcopy_response").value){
			done_captcha = true;
		}
		if(done_captcha){
			return true;
		}
	}
	function _Search_Selector(query,action){
		if (document.querySelector(query)) {
			var timer = setInterval(function() {
				if (_Search_Captcha()) {
					document.querySelector(query)[action](); clearInterval(timer);
				}
			}, 5000);
		}
	}
	if(document.querySelector('span#clock')){
		var timer = setInterval(function() {
			if (Number(document.querySelector('span#clock').innerText.replace(/[^1-9]+/g,''))==0) {
				location.reload(); clearInterval(timer);
			}
		}, 5000);
	}
	let arr_modal = ['[data-target="#claim"]'];
	for(let key of arr_modal){
		if (document.querySelector(key)){
			document.querySelector(key).click();
			break;
		}
	}
	let arr_form = ['form[action*="/faucet/verify"]','form[action*="/firewall/verify"]','form[action*="/auth/login"]'];
	for(let key of arr_form){
		_Search_Selector(key,'submit');
	}
    let arr_click = ['.btn-success[type="submit"]'];
	for(let key of arr_click){
		_Search_Selector(key,'click');
	}
})();