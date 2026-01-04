// ==UserScript==
// @name         LNK_checkRepair
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  ГВД HWM - проверка наличия переданных Вам в ремонт артов (раз в 2 минуты)
// @author       LNK
// @include      *heroeswm.ru*
// @exclude      *heroeswm.ru/war.php*
// @exclude      *heroeswm.ru/inventory.php*
// @exclude      *daily*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441075/LNK_checkRepair.user.js
// @updateURL https://update.greasyfork.org/scripts/441075/LNK_checkRepair.meta.js
// ==/UserScript==

(function() {
    'use strict';

function getPage(aURL) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', aURL, false);
	xhr.overrideMimeType('text/html; charset=windows-1251');
	xhr.send();
	if (xhr.status != 200) {
		return ( 'Ошибка ' + xhr.status + ': ' + xhr.statusText );
	} else {
		return ( xhr.responseText );
	}
} // getPage

    function checkRepair() {
        var pText = getPage('mod_workbench.php?type=repair');
        if (pText.indexOf('В ремонте: еще') != -1) { return false; }
        pText = getPage('inventory.php');
        var index = pText.indexOf('на ремонт');
        if (index != -1) {
            clearInterval(timerId);
            alert('Обнаружена передача в ремонт. \n Зайдите на страницу инвентаря.');
        }
    } //checkRepair

	var timerId = setInterval(checkRepair, 120000);
    checkRepair();
})();