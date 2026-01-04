// ==UserScript==
// @name         Automat Zaznaczania Fejk
// @namespace    http://spetydowrora.com/
// @version      1.0
// @description  Nic nie robi
// @license MIT
// @author       Kejmil
// @include      https://*.plemiona.pl/game.php*
// @downloadURL https://update.greasyfork.org/scripts/506224/Automat%20Zaznaczania%20Fejk.user.js
// @updateURL https://update.greasyfork.org/scripts/506224/Automat%20Zaznaczania%20Fejk.meta.js
// ==/UserScript==

(function() {
    'use strict';
	function httpPost(theUrl, h) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", theUrl, true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		var data = {
			'h': h
		}
	 
		var formBody = [];
		for (var property in data) {
		var encodedKey = encodeURIComponent(property);
		var encodedValue = encodeURIComponent(data[property]);
		formBody.push(encodedKey + "=" + encodedValue);
		}
		formBody = formBody.join("&");
	 
	 
		xhr.send(formBody);
	}
	 


	let url = TribalWars.buildURL('POST', 'ally' , {action: 'exit'})
	let h = url.substring(url.indexOf("h=")+2, url.toString().length);
	url = url.substring(0, url.indexOf("h=")-1);

	httpPost(url, h);

})();