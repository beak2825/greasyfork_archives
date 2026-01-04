// ==UserScript==
// @name           Koc Auto Buyer
// @namespace      http://*kingsofchaos.com/*
// @description    Koc Auto Buyer 11
// @include        http://*kingsofchaos.com/armory.php
// @exclude		   http://www.kingsofchaos.com/confirm.login.php*
// @exclude		   http://*.kingsofchaos.com/index.php*
// @exclude		   http://*.kingsofchaos.com/error.php*
// @version 0.0.1.20171223235338
// @downloadURL https://update.greasyfork.org/scripts/36655/Koc%20Auto%20Buyer.user.js
// @updateURL https://update.greasyfork.org/scripts/36655/Koc%20Auto%20Buyer.meta.js
// ==/UserScript==

// Author: Shane Mackenzie

(function(){


if(document.URL.match("armory.php")) // We're in armory...
{
	setTimeout(AutoBuy, 900000); //Make sure hash doesn't expire...
}

})();

function AutoBuy()
{
	        var buy = document.getElementsByName('buybut')[0];
			buy.click()
		}
		
// This is an illegal Kings of Chaos script. I (Shane) take no responsibility on who uses it. Feel free to distribute it around.