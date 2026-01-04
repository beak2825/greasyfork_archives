// ==UserScript==
// @license      proprietary
// @name         InfopayThankYouPage
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  password filler
// @author       You
// @match        *.ninja.ip5dev.com/customer/thankYou*
// @match        *.devn.goodcar.com/*
// @match        *.dev.propertychecker.com/*
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @require       https://unpkg.com/xhook@latest/dist/xhook.min.js
// @downloadURL https://update.greasyfork.org/scripts/461502/InfopayThankYouPage.user.js
// @updateURL https://update.greasyfork.org/scripts/461502/InfopayThankYouPage.meta.js
// ==/UserScript==


(function() {
    'use strict';
    if ($('input#newPassword').length === 1 && $('input#repeatPassword').length === 1 && $('input#newPassword').val() === '') {
		const password='password12345GG$$';
		$('input#newPassword').val(password);
		$('input#repeatPassword').val(password);
    }
})();