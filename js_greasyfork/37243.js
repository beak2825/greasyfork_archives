// ==UserScript==
// @name 2chMailGayCaptcha
// @description Майловская пидорская капча
// @include https://2ch.hk/*
// @version 1.0.3
// @grant none
// @namespace mynigga
// @downloadURL https://update.greasyfork.org/scripts/37243/2chMailGayCaptcha.user.js
// @updateURL https://update.greasyfork.org/scripts/37243/2chMailGayCaptcha.meta.js
// ==/UserScript==

$(document).ready(function () {
	
	window.nocaptchaOptions = {publicKey: "033bbbe453f794e3cb39f856277cd3ec"};
	
	var nocaptchascript = document.createElement('script');
	nocaptchascript.src = 'https://api-nocaptcha.mail.ru/nocaptcha.js';
	document.body.appendChild(nocaptchascript);
	
	nocaptchascript.onload = function() {
		nocaptcha.create('#nocaptcha1', {hidden: false, tabindex: 3});
		nocaptcha.verify('#nocaptcha1');
		nocaptcha.create('#nocaptcha2', {hidden: false, tabindex: 3});
		nocaptcha.verify('#nocaptcha2');
	}
	
	window.requestCaptchaKey = function(){ return false; };
	window.loadCaptcha = function(){ return false; };
	window.config.captchaKey = -1;
	$('input[name="captcha_type"]').val('mailru');
	$('#postform .captcha-box').empty().append('<div id="nocaptcha1"></div>');
	$('#qr-postform .captcha-box').empty().append('<div id="nocaptcha2"></div>');
	$('#qr-submit,#submit').attr('onClick','SendClickHandle();');
	$('.rules-area .rules:first-child').html('Абу - хуй, пасскодоблядь не человек.');

});

window.SendClickHandle = function() {
	nocaptcha.reset('#nocaptcha1');
	nocaptcha.verify('#nocaptcha1');
	nocaptcha.reset('#nocaptcha2');
	nocaptcha.verify('#nocaptcha2');
}
