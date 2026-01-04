// ==UserScript==
// @name         Maden çekme
// @namespace    ScriptAdam
// @version      0.1
// @description  Maden çek
// @author       ScriptAdam
// @match        https://tr*.klanlar.org/game.php?*&screen=market*&mode=exchange*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/438124/Maden%20%C3%A7ekme.user.js
// @updateURL https://update.greasyfork.org/scripts/438124/Maden%20%C3%A7ekme.meta.js
// ==/UserScript==
var urlParams = new URLSearchParams(window.location.search);
var screen = urlParams.get("screen");
var mode = urlParams.get("mode");

if (mode == "exchange") {
	var odun = Number($("#premium_exchange_stock_wood").text());
	var kil = Number($("#premium_exchange_stock_stone").text());
	var iron = Number($("#premium_exchange_stock_iron").text());
	var irontr = true;

	if (kil > 64) {
		$('[name="buy_stone"]').val(kil);
		$(".btn-premium-exchange-buy").trigger("click");

		setTimeout(function () {
			$("div.confirmation-buttons > button.btn.evt-confirm-btn.btn-confirm-yes").trigger("click");

			setTimeout(function () {
				window.location.reload();
			}, 1000);
		}, 500);
	} else if (iron > 64 && irontr) {
		$('[name="buy_iron"]').val(iron);
		$(".btn-premium-exchange-buy").trigger("click");

		setTimeout(function () {
			$("div.confirmation-buttons > button.btn.evt-confirm-btn.btn-confirm-yes").trigger("click");

			setTimeout(function () {
				window.location.reload();
			}, 1000);
		}, 500);
	} else if (odun > 64) {
		$('[name="buy_wood"]').val(odun);
		$(".btn-premium-exchange-buy").trigger("click");

		setTimeout(function () {
			$("div.confirmation-buttons > button.btn.evt-confirm-btn.btn-confirm-yes").trigger("click");

			setTimeout(function () {
				window.location.reload();
			}, 1000);
		}, 500);
	} else {
		setTimeout(function () {
			window.location.reload();
		}, 500);
	}
}
