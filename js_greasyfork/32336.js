// ==UserScript==
// @name         KissAnime Auto Captcha
// @namespace    https://github.com/KS-Auto-Captcha
// @version      1.1
// @description  Auto solve KissAnime Captcha
// @author       Cindr™
// @match        http://kissanime.ru/Special/AreYouHuman2*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/32336/KissAnime%20Auto%20Captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/32336/KissAnime%20Auto%20Captcha.meta.js
// ==/UserScript==

function tryPost() {
	$.post('/Special/AreYouHuman2', {
		reUrl: $('#formVerify > div:nth-child(2) > input[type="hidden"]:nth-child(1)').val(),
		answerCap: "2,3,"
	}, function(data, status) {
		//console.log(data);
		if(data.includes("Wrong answer.")) {
			var captchaUrl = data.split("'")[1];
			//console.log(captchaUrl);
			$.get(captchaUrl);
			tryPost();
		} else {
			window.location.assign($('#formVerify > div:nth-child(2) > input[type="hidden"]:nth-child(1)').val());
		}
	});
}
tryPost();
