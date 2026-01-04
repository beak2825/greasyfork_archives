// ==UserScript==
// @name         LNK_leader
// @namespace    LNK
// @version      1.0
// @description  показывает "вес" отрядов ГЛ - чем меньше число, тем больше набирается ХП на единицу лидерства
// @author       NemoMan
// @include     *heroeswm.ru/leader_army.php
// @include     *heroeswm.ru/leader_army.php?from_event*
// @include     *heroeswm.ru/leader_spec_army*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436154/LNK_leader.user.js
// @updateURL https://update.greasyfork.org/scripts/436154/LNK_leader.meta.js
// ==/UserScript==

(function() {
    'use strict';

function mainFunc() {
	var troops = document.querySelectorAll(".reserve_amount");
	var curTroop;
	for (var i = 0; i < troops.length; i++) {
		curTroop = troops[i];
		curTroop.innerHTML = curTroop.innerHTML + ' (' + (obj[i+1]['cost'] / obj[i+1]['maxhealth']).toFixed(1) + ')';
		obj[i+1]['maxhealth'] = obj[i+1]['maxhealth'] + '<br>Вес: ' + (obj[i+1]['cost'] / obj[i+1]['maxhealth']).toFixed(1);
	}
}

setTimeout(mainFunc, 2000);

})();// ==UserScript==
// @name         LNK_leader
// @namespace    LNK
// @version      1.0
// @description  показывает "вес" отрядов ГЛ - чем меньше число, тем больше набирается ХП на единицу лидерства
// @author       NemoMan
// @include     *heroeswm.ru/leader_army.php
// @include     *heroeswm.ru/leader_army.php?from_event*
// @include     *heroeswm.ru/leader_spec_army*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

function mainFunc() {
	var troops = document.querySelectorAll(".reserve_amount");
	var curTroop;
	for (var i = 0; i < troops.length; i++) {
		curTroop = troops[i];
		curTroop.innerHTML = curTroop.innerHTML + ' (' + (obj[i+1]['cost'] / obj[i+1]['maxhealth']).toFixed(1) + ')';
		obj[i+1]['maxhealth'] = obj[i+1]['maxhealth'] + '<br>Вес: ' + (obj[i+1]['cost'] / obj[i+1]['maxhealth']).toFixed(1);
	}
}

setTimeout(mainFunc, 2000);

})();