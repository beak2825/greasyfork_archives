// ==UserScript==
// @name         GeoCheck auto Captcha
// @namespace    http://technetium.be
// @version      1.3.3
// @description  Automagicly fills in the Captcha for GeoCheck
// @author       Toni Cornelissen (github@technetium.be)
// @match        *://*.geocheck.org/geo_inputchkcoord.php*
// @match        *://*.geotjek.dk/geo_inputchkcoord.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377402/GeoCheck%20auto%20Captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/377402/GeoCheck%20auto%20Captcha.meta.js
// ==/UserScript==

(function() {
	function captcha() {
		if (!hex_md5) { window.setTimeout(captcha, 103); return }
		var i = -1;
		var md5 = document.getElementsByName('geoform')[0].outerHTML.match(/validateChkCoordsForm\(this,.*?(\w{32})/)[1];
		while(hex_md5(("0000"+(++i)).slice(-5)) !== md5);
		document.getElementsByName('usercaptcha')[0].type = 'text';
		document.getElementsByName('usercaptcha')[0].value = ("0000"+i).slice(-5);
	}
	captcha();
})();
