// ==UserScript==
// @name 2chDigitGayCaptcha
// @description Цифровая капча для 2ch
// @include https://2ch.hk/*
// @version 1.0.5
// @grant none
// @namespace mynigga
// @downloadURL https://update.greasyfork.org/scripts/37655/2chDigitGayCaptcha.user.js
// @updateURL https://update.greasyfork.org/scripts/37655/2chDigitGayCaptcha.meta.js
// ==/UserScript==

$(document).ready(function(){
	window.requestCaptchaKey = window.requestCaptchaKey2ch;
	window.loadCaptcha = window.loadCaptcha2ch;
	window.config.captchaKey = -1;
	$('input[name="captcha_type"]').val('2chaptcha');
	$('.captcha-box').empty()
	.append('<div class="captcha-image captcha-reload-button"></div>')
	.append('<input name="2chaptcha_id" class="captcha-key" type="hidden">')
	.append('<input name="2chaptcha_value" id="captcha-value" type="text" autocomplete="off" maxlength="6">');
	$('#postform .captcha-image').attr('style','background: rgba(0,0,0,0.025); width: 221px; height: 91px;');
	$('#postform textarea[name="comment"]').attr('tabindex','1');
	$('#postform #captcha-value').attr('tabindex','2');
	$('#qr-postform textarea[name="comment"]').attr('tabindex','3');
	$('#qr-postform #captcha-value').attr('tabindex','4');
	$('.captcha-reload-button').on('click', loadCaptcha);
	$('.captcha-image').on('DOMSubtreeModified', function(){
		$('input[name="2chaptcha_value"]').val('').focus();
	});
});
