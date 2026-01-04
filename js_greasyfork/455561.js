// ==UserScript==
// @name        cryptomininggame
// @namespace   crypto mining game
// @version     1.0
// @author      sCamuh
// @description crypto mining game
// @match       https://cryptomininggame.com/*
// @downloadURL https://update.greasyfork.org/scripts/455561/cryptomininggame.user.js
// @updateURL https://update.greasyfork.org/scripts/455561/cryptomininggame.meta.js
// ==/UserScript==
const email = '';
const password = '';
let loginform = document.getElementsByClassName('form-horizontal');

setTimeout(function() {
	'use strict';

	if (document.querySelector("#main_menu_main_wrapper > div:nth-child(2) > button") && !location.href.includes('login')) {
        //location.href = '/?login=true';
		document.querySelector("#main_menu_main_wrapper > div:nth-child(2) > button").click();
		AutoLogin();
	}

	if (location.href.includes('login')) { AutoLogin();}
	if (document.querySelector("div.dailyBonusCard.pickable")) {
		document.querySelector("div.dailyBonusCard.pickable").click();
	}

	if (document.querySelector("#form_mine_tronz > button") && document.querySelector("#form_mine_tronz > button").textContent.includes('MINE')) {
		document.querySelector("#form_mine_tronz > button").click();
	}

	if (document.querySelector(".alert-success") && document.querySelector(".alert-success").textContent.includes('mine')) {
		location.href = 'boost';
	}

	if (location.href.includes('boost')) {
		if ($("button:contains('free')").length > 0) {
            $("button:contains('free')").click();
		} else location.href = 'jobs';
	}

	if ($("button:contains(' Get paid')").length > 0) {
		for (const g of $("button:contains(' Get paid')")) {
			g.click();
		}
	}

    if (location.href.includes('jobs')) {
		if (document.querySelector("#job_crystal_start_form").getAttribute('class') == 'row') {
			document.querySelector("#job_crystal_energy").value = '170';
			document.querySelector("#job_cryptocurrency_energy").value = '170';
			document.querySelector("#currencyJobChoice").selectedIndex = 8;
			document.querySelector("#currencyJobChoice").dispatchEvent(new Event('change'));
			for (const s of $("button:contains(' START')")) {
				s.click();
			}
		} else location.href = 'quests';
	}

    if (location.href.includes('quests') && document.querySelector("#btn_user_ptv")) {
        if (document.querySelectorAll(".animated.pulse.infinite").length > 0) {
            $("button:contains(' CLAIM')").click();
        } else {
            document.querySelector("#btn_user_ptv").click();
            setTimeout(() => {if ($('#modalPTV').css('display') === 'block') {$("[class='rewardDetail pickable ']").click()}},5e3);
            window.close();
        }
    }




},1e3);

// Auto Login
function AutoLogin() {
    let inputs = loginform[0].getElementsByTagName("input");
    let button = loginform[0].getElementsByTagName("button")[0];
    inputs[1].value = email;
    inputs[2].value = password;
    inputs[3].click();
    document.querySelector("#captchatype").selectedIndex = 1;
    document.querySelector("#captchatype").dispatchEvent(new Event('change'));
    setInterval(() => {if (grecaptcha.getResponse().length > 0) {button.click()}},7e3);
}