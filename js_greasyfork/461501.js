// ==UserScript==
// @name         InfopayCheckoutOverrides
// @license      proprietary
// @namespace    http://tampermonkey.net/
// @version      0.52
// @description  checkout auto filler
// @author       Dennes Abing
// @match        *.ninja.ip5dev.com/checkout*
// @match        *.ninja.ip5dev.com/co*
// @match        *.goodcar.com/checkout*
// @match        *.dev.propertychecker.com/*
// @match        *.statecourts.org/co*
// @match        *.infotracer.com/co*
// @match        *.infotracer.com/checkout*
// @match        *.statecourts.org/co*
// @match        *.propertychecker.com*
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @require       https://unpkg.com/xhook@latest/dist/xhook.min.js
// @downloadURL https://update.greasyfork.org/scripts/461501/InfopayCheckoutOverrides.user.js
// @updateURL https://update.greasyfork.org/scripts/461501/InfopayCheckoutOverrides.meta.js
// ==/UserScript==

(function() {
    'use strict';
	if ($('input#email').val() === '' || $('input#emailAddress').val() === '' || $('input#cardEmail').val() === '') {
		const currentDate = new Date();
		const dateTimeString = currentDate.getFullYear() +'-'+ (currentDate.getMonth() + 1) + '-' + currentDate.getDate() +'-'+ currentDate.getHours() + currentDate.getMinutes() + currentDate.getSeconds();
		let merchant = location.hostname.split('.')[0];
		if (merchant === 'checkout') {
		   merchant = location.hostname.split('.')[1];
		}
		let firstName = 'Dennes';
		let lastName = 'Infopay';
		if (location.hostname.split('.')[0] == 'idstrong') {
			firstName = 'Donald';
			lastName = 'Blair';
			merchant = 'ids';
		} else if (merchant == 'infotracer') {
			merchant = 'it';
		} else if (merchant == 'recordsfinder') {
			merchant = 'rf';
		} else if (merchant == 'staterecords') {
			merchant = 'sr';
		} else if (merchant == 'searchquarry') {
			merchant = 'sq';
		} else if (merchant == 'courtrecords') {
			merchant = 'cr';
		} else if (merchant == 'courtcasefinder') {
			merchant = 'cr';
		} else if (merchant == 'goodcar') {
			merchant = 'gc';
		} else if (merchant == 'premium') {
			merchant = 'pma';
		} else if (merchant == 'business') {
			merchant = 'bb';
		} else if (merchant == 'dennes') {
            merchant = '';
        }
		const tag = merchant + '' + dateTimeString;
		let fullName = firstName + ' ' + lastName;
			$('input#fullName').val(fullName);
			$('input[name="firstName"]').val(firstName);
			$('input[name="lastName"]').val(lastName);
			$('input#cardNumber').val('6282054565420965');
			$('input[name="cardNumber"]').val('6282054565420965');
			$('input#ccNumber').val('6282054565420965');
			$('select#expirationYear').val('2026');
			$('select#InfoPay_Core_Components_Forms_SCheckoutForm_expirationYear').val('2026');
$('select[name="InfoPay_Core_Components_Forms_SCheckoutForm[expirationYear]"]').val('2026');
			$('select#expirationMonth').val('11');
			$('select#InfoPay_Core_Components_Forms_SCheckoutForm_expirationMonth').val('11');
			$('input#expirationDate').val('112026');
			$('input#cardValidationCode').val('210');
			$('input#card_code').val('210');
			$('input#cvvCode').val('210');
			$('input[name="zip"]').val('02110');
			$('input#zip').val('02110');
$('input#cardZip').val('02110');
			$('input#email').val('dennes+'+tag+'@infopay.com');
			$('input#emailAddress').val('dennes+'+tag+'@infopay.com');
			$('input#cardEmail').val('dennes+'+tag+'@infopay.com');
		}
})();