// ==UserScript==
// @name        CAPTCHAs.IO OnlineBooking UserScript
// @namespace   https://app.captchas.io/ssmms/
// @include     https://onlinebooking.sand.telangana.gov.in/Masters/Home.aspx
// @include     *
// @connect     app.captchas.io
// @grant       GM_xmlhttpRequest
// @version     1.0.3
// @description This script is a UserScript to auto solve captchas in http://onlinebooking.sand.telangana.gov.in/Masters/Home.aspx the SSMMS or Sand Sale Management and Monitoring System website.
// @downloadURL https://update.greasyfork.org/scripts/381896/CAPTCHAsIO%20OnlineBooking%20UserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/381896/CAPTCHAsIO%20OnlineBooking%20UserScript.meta.js
// ==/UserScript==

function getBase64(img) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	canvas.width = img.width
	canvas.height = img.height
	ctx.drawImage(img, 0, 0)

	return canvas.toDataURL();
}

function doAnswer(k, b) {
	var __data = new FormData();
	__data.append("key", k);
	__data.append("body", b);

	GM_xmlhttpRequest ({
		method: "POST",
		data: __data,
		url: 'https://app.captchas.io/ssmms/validator.php',
		onload: function(response) {
			var result = JSON.parse(response.responseText);

			if (result.status == 'OK') {
				document.querySelector('#txtEnterCode').value = result.answer;
			} else {
				console.log(response.responseText);
			}
		}
	});
};

(function() {
	'use strict';
	
	var key = '<YOUR_CAPTCHAs_IO_SSMMMS_KEY>';
	var base64 = getBase64(document.getElementById("imgCaptcha"));

	doAnswer(key, base64);
})();