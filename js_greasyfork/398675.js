// ==UserScript==
// @name         Melvor Bot Extension
// @version      0.1
// @description  Extension for enabling the Melvor Discord Bot features
// @author       Asthereon
// @match        https://*.melvoridle.com/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/398675/Melvor%20Bot%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/398675/Melvor%20Bot%20Extension.meta.js
// ==/UserScript==

let URL = 'https://avalar.online/dev/server/melvorEcho.php';

function sendUpdate() {
	$.ajax({
		url: URL,
		type: 'POST',
		async: true,
		crossDomain: true,
		data: {
			saveData: getSave()
		},
		success: function(data) {
			console.log(data);
		}
	});
}

setInterval(function() {
	sendUpdate();
},30000);