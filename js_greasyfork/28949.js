// ==UserScript==
// @name			★moomoo.io ChangeWeapon
// @version			0.3
// @description		Switch the weapon with the tab key.
// @author			nekosan
// @match			*://moomoo.io/*
// @grant			none
// @namespace		https://greasyfork.org/en/scripts/28949-moomoo-io-changeweapon
// @downloadURL https://update.greasyfork.org/scripts/28949/%E2%98%85moomooio%20ChangeWeapon.user.js
// @updateURL https://update.greasyfork.org/scripts/28949/%E2%98%85moomooio%20ChangeWeapon.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var bow = false;
	
	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 9) {
			e.preventDefault();
			if (bow) {
				$('#actionBarItem0').click();
				$('#actionBarItem1').click();
				$('#actionBarItem2').click();
			} else {
				$('#actionBarItem3').click();
			}
			bow = !bow;
		}
	});

})();