// ==UserScript==
// @name        Captcha Handler
// @description Handles captchas
// @namespace   DCI
// @include     https://www.mturk.com/mturk/previewandaccept*
// @include     https://www.mturk.com/mturk*lolzcaptcha
// @include     https://www.mturk.com/mturk/accept?*&captcha=*
// @version     1
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/21451/Captcha%20Handler.user.js
// @updateURL https://update.greasyfork.org/scripts/21451/Captcha%20Handler.meta.js
// ==/UserScript==

var CaptchaGroup = "3T4QHDVBXBLD2A4YZC57CBG4IE9ZWF"; //CopyText

if (document.querySelectorAll('input[name="userCaptchaResponse"]').length > 0){
	if (window.location.toString().indexOf('SMcaptcha') === -1){
		GM_setValue('location',window.location.toString());
		window.location.replace("https://www.mturk.com/mturk/previewandaccept?groupId=" + CaptchaGroup + "&SMcaptcha");
	}
}

if (window.location.toString().indexOf('SMcaptcha') !== -1){
    var chimeSound = new Audio("http://static1.grsites.com/archive/sounds/birds/birds005.wav");
	chimeSound.play();
    document.title = "CAPTCHA!";
}

if (window.location.toString().indexOf(CaptchaGroup) !== -1){
    var HitText = document.body.innerHTML.toString();
    if (HitText.indexOf('Automatically accept the next HIT') !== -1){
	    var returnlink = document.querySelectorAll("a[href*='mturk/return']")[0];
        window.location.replace(returnlink + '&lolzcaptcha');
    }
}

if (window.location.toString().indexOf('&lolzcaptcha') !== -1){
	window.location.replace(GM_getValue('location'));
}