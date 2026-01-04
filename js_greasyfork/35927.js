// ==UserScript==
// @name         Test Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Test 1 for the hacker experience research script
// @author       Anonymous
// @match        https://legacy.hackerexperience.com/university?id=11657626
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35927/Test%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/35927/Test%20Script.meta.js
// ==/UserScript==
window.onload = function() {
    var recaptchakey = document.getElementsByTagName("g-recaptcha")[0].getAttribute("data-sitekey");
	var urlpiece1;
	var softwareid;
	var urlpiece2;
	var url;
    urlpiece1 = "http://2captcha.com/in.php?key=e90477529f9564d76ce9e343b7095e9a&method=userrecaptcha&googlekey=";
	urlpiece2 = "&pageurl=https://legacy.hackerexperience.com/university?id=";
	softwareid = "SOFTWARE ID HERE";
	url = urlpiece1 + recaptchakey + urlpiece2 + softwareid;
	window.open(url , '_tab');
};