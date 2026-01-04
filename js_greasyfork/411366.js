// ==UserScript==
// @name         Charity Corner 2020
// @namespace    neopets
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.neopets.com/charitycorner/2020/quickdonation/itemdiscardchecklist.phtml*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/411366/Charity%20Corner%202020.user.js
// @updateURL https://update.greasyfork.org/scripts/411366/Charity%20Corner%202020.meta.js
// ==/UserScript==

////////////////////////////////////////////////////////////////
// Toggle delay time here

const min = 1500;
const max = 3500;

////////////////////////////////////////////////////////////////

const delay = Math.floor(Math.random() * (max - min)) + min;

if (!GM_getValue) {
	GM_getValue = function (key, def) {
		return localStorage[key] || def;
	};
	GM_setValue = function (key, value) {
		return localStorage[key] = value;
	};
}

if (!GM_getValue("Mode")) {
	let Mode = {
		immediate: false,
		auto: false
	};
	GM_setValue("Mode", Mode);
}
var Mode = GM_getValue("Mode");

$.fn.exists = function () {
	return this.length > 0;
};

if ($("div[onclick='dismissDataPopup()']").exists()) {
	dismissDataPopup();
}

$($.parseHTML('&nbsp;&nbsp;<div class="np-quick-prize-shop-button"><div class="button-default__2020 nc-item-checklist" id="first15">First 15</div></div>&nbsp;<div style="align-self: center;"><input type="checkbox" id="immediateSubmit">Donate on click</div>&nbsp;<div style="align-self: center;"><input type="checkbox" id="autoDonate">Auto</div>')).appendTo($(".np-item-checklist-container"));

const immediate = $("#immediateSubmit");
const autoDonate = $("#autoDonate");
const first15 = $("#first15");

$(immediate).prop("checked", Mode.immediate);
$(immediate).on("click", function () {
	if ($(this).prop("checked") === true) {
		if (!window.confirm("If you enable this setting, the first 15 items will be donated IMMEDIATELY when you click on \"First 15\"!")) {
			$(this).prop("checked", false);
			Mode.immediate = $(this).prop("checked");
			GM_setValue("Mode", Mode);
			return false;
		}
	}
	Mode.immediate = $(this).prop("checked");
	GM_setValue("Mode", Mode);
});

$(autoDonate).prop("checked", Mode.auto);
$(autoDonate).on("click", function () {
	Mode.auto = $(this).prop("checked");
	GM_setValue("Mode", Mode);
});
GM_setValue("Mode", Mode);

$(first15).on("click", function () {
	for (let i = 0; i < 15; i++) {
		try {
			$(".ccrbutton").get(i).click();
		} catch (e) {
			// Prevent error if less than 15 items
		}
	}
	if ($(immediate).prop("checked") === true) {
		setTimeout(submitDonation, delay);
	} else {
		$("#liveWithoutThis").get(0).click();
	}
});

if (Mode.auto === true && $(first15).exists()) {
	$(first15).click();
}