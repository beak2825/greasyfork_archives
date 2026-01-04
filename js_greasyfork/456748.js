// ==UserScript==
// @name         UTC Alert
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Excute a prgrm at specifque minute and seconde
// @author       MeGaBOuSsOl
// @match        *.blsspainvisa.com/*appointment.php
// @match        https://algeria.blsspainvisa.com/*
// @match        https://algeria.blsspainvisa.com/appointment_family.php
// @match        https://algeria.blsspainvisa.com/appointment.php
// @match        https://algeria.blsspainvisa.com/login.php
// @match        https://algeria.blsspainvisa.com/index.php
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        God
// @downloadURL https://update.greasyfork.org/scripts/456748/UTC%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/456748/UTC%20Alert.meta.js
// ==/UserScript==

var MyDecalage = 0;
var delaymilliseconds = 700;
var Blsdecalage = 0;
var ATminut1 = 41;
var ATminut2 = 57;


var checkminutes = setInterval(function() {
	var d = new Date();
	var minutes = d.getMinutes();
	if ((minutes == ATminut1) || (minutes == ATminut2)) {

		var checkSec = setInterval(function() {
			var d = new Date();
			var Seconds = d.getSeconds();
			if (Seconds == (Blsdecalage + MyDecalage)) {
				setTimeout(function() {
					new Audio('https://www.myinstants.com/media/sounds/ding-sound-effect_2.mp3').play();
				}, 1000);
				clearInterval(checkSec)
			}
		}, 500);;
		clearInterval(checkminutes);
	}
}, 100);