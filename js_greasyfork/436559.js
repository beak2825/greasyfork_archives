// ==UserScript==
// @name         Precise chance to hit
// @namespace    melvor_hcco
// @version      0.1.1
// @description  Shows 4 significant digits in chance of hit, instead of an integer%
// @author       mazunki
// @match	 https://*.melvoridle.com/*
// @exclude	 https://wiki.melvoridle.com*
// @grant        none
// @noframes
// @license      MIT
/* globals jquery, $, game */
// @downloadURL https://update.greasyfork.org/scripts/436559/Precise%20chance%20to%20hit.user.js
// @updateURL https://update.greasyfork.org/scripts/436559/Precise%20chance%20to%20hit.meta.js
// ==/UserScript==

// Made for version 1.0

(function() {
	const melvor_hcco_significant_digits = 4;

	function significant_digits(n, places=2) {
		let sd = 0;
		const s = String(n).replace("0.", "")
		while (s[sd] == "9" || s[sd] == "0") sd++;
		return sd+places;
	}
	function chance_to_hit(offender_acc, defender_ev) {
		return (defender_ev > offender_acc) ? 0.5*offender_acc/defender_ev : 1-0.5*defender_ev/offender_acc;
	}

	var player_chanceToHitUpdater = () => {
		if ($("#combat-player-chance-to-hit")) {
			let player_accuracy = game.combat.player.valueOf().stats.accuracy;
			let enemy_evasion = game.combat.enemy.valueOf().stats.evasion[game.combat.player.attackType];

			let chance = chance_to_hit(player_accuracy, enemy_evasion);
			let places = significant_digits(chance, melvor_hcco_significant_digits);

			$("#combat-player-chance-to-hit").html((100*chance).toFixed(places-2) + "%");
		}
	};

	var enemy_chanceToHitUpdater = () => {
		if ($("#combat-enemy-chance-to-hit")) {
			let enemy_accuracy = game.combat.enemy.valueOf().stats.accuracy;
			let player_evasion = game.combat.player.valueOf().stats.evasion[game.combat.enemy.attackType];

			let chance = chance_to_hit(enemy_accuracy, player_evasion);
			let places = significant_digits(chance, melvor_hcco_significant_digits);

			$("#combat-enemy-chance-to-hit").html((100*chance).toFixed(places-2) + "%");
		}
	};

	setTimeout( () => setInterval(enemy_chanceToHitUpdater, 50), 5000 );
	setTimeout( () => setInterval(player_chanceToHitUpdater, 50), 5000 );
})();
