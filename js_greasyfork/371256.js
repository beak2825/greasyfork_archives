// ==UserScript==
// @name         Avito Cleaner
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Unchecks commercial services and hides some intrusive ads
// @author       hant0508
// @include      https://www.avito.ru/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/371256/Avito%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/371256/Avito%20Cleaner.meta.js
// ==/UserScript==

function uncheck (elm) {
	if (elm !== null && elm !== undefined) {
    	elm.checked = false;
	}
}

function hide (elm) {
	elm.setAttribute('style', 'display: none !important;');
}

function hideArr (arr) {
	for(var i = 0; i < arr.length; ++i) {
		hide(arr[i]);
	}
}

(function() {
	var elm = document.getElementsByClassName('packages-tab_free')[0];
	if (elm !== null && elm !== undefined) {
		elm.closest('.packages-tab').click();
	}

	uncheck(document.getElementById('service-premium'));
	uncheck(document.getElementById('service-up-x2'));
	uncheck(document.getElementById('service-vip'));
	uncheck(document.getElementById('service-highlight'));

	hideArr(document.getElementsByClassName('profile-item-promo'));
	hideArr(document.getElementsByClassName('profile-item-warning'));

	elm = document.getElementsByClassName('js-packages')[0];
	if (elm.children[1].innerHTML.includes('Примените к объявлению пакет услуг')) {
		hide(elm);
	}
})();
