// ==UserScript==
// @name         Auto click redirector
// @namespace    https://greasyfork.org/en/users/158832
// @version      1.2
// @description  Skip menantisenja, pafpaf, gametime
// @author       Riztard
// @match        *menantisenja.com*
// @include      *menantisenja.com*
// @match        *pafpaf.info*
// @include      *pafpaf.info*
// @match        *gametime.web.id*
// @include      *gametime.web.id*
// @grant        none
// @icon         https://www.shareicon.net/download/2015/08/23/89640_forward.ico
// @downloadURL https://update.greasyfork.org/scripts/374997/Auto%20click%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/374997/Auto%20click%20redirector.meta.js
// ==/UserScript==

if (window.top != window.self) //-- Don't run on frames or iframes
return;

(function() {
    'use strict';

	if (window.location.href.indexOf("menantisenja.com/?") != -1) {

		$('.sorasubmitss')[0].click();

    }

	else if (window.location.href.indexOf("menantisenja.com/2") != -1) {

		location.href = "javascript:void(changeLink());";

    }

	else if (window.location.href.indexOf("pafpaf") != -1) {

		window.location.href = $('#myy-buttons').attr('href');

    }

	else if (window.location.href.indexOf("gametime") != -1) {

		$('#klik')[0].click();
		window.location.href = $('#generate a').attr('href');

    }





})();