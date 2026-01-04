// ==UserScript==
// @name         ET Hit Collection
// @version      0.2
// @description  Collect hit chance data for eternity tower
// @author       Jimborinot
// @match        http*://*.eternitytower.net/*
// @grant        none
// @namespace https://greasyfork.org/users/156118
// @downloadURL https://update.greasyfork.org/scripts/370916/ET%20Hit%20Collection.user.js
// @updateURL https://update.greasyfork.org/scripts/370916/ET%20Hit%20Collection.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

	var battleHitData = {};
	var battleState = null;

	// wait some time for meteor to be ready
	setTimeout(init, 3000);

    function init() {
		console.log("ET Hit Collection initialized");
		if(isInBattle()) {
			if(localStorage.getItem("hitData")) {
				battleHitData = JSON.parse(localStorage.getItem("hitData"));
			}
		}

		createListener();
	}

	function createListener() {
		Meteor.connection._stream.on("message", json => {
			let message = JSON.parse(json);

			if(message.msg == "changed" && message.collection == "redis") {
				battleState = JSON.parse(message.fields.value);

				if(battleState.units.concat(battleState.deadUnits).length > 1) return;

				var tick = battleState.tick;

				let livingEntities = battleState.units.concat(battleState.enemies);

				livingEntities.forEach(entity => {
					let tickOffset = entity.tickOffset;
					let attackSpeedTicks = entity.stats.attackSpeedTicks;

					// autoattack will occur this tick
					if((tick - tickOffset - 1) % attackSpeedTicks === 0) {
						let target = entity.hasOwnProperty("target") ? getEntityById(entity.target) : battleState.enemies[0];

						if(target === undefined) {
							target = battleState.deadEnemies[battleState.deadEnemies.length - 1];
						}

						if(entityIsInvulnerable(target))
							return;

						if(!battleHitData.hasOwnProperty(entity.stats.accuracy)) {
							battleHitData[entity.stats.accuracy] = {};
							battleHitData[entity.stats.accuracy][target.stats.defense] = { total: 0, misses: 0 };
						} else if(!battleHitData[entity.stats.accuracy].hasOwnProperty(target.stats.defense)) {
							battleHitData[entity.stats.accuracy][target.stats.defense] = { total: 0, misses: 0 };
						}

						battleHitData[entity.stats.accuracy][target.stats.defense].total++;
					}
				});

				battleState.tickEvents.forEach(event => {
					if(event.eventType !== "damage") return;

					let from = getEntityById(event.from);
					let to = getEntityById(event.to);

					// any 0.0 hitEvent is an autoattack as long as target doesn't have an evasion buff
					if(event.label == "0.0" && !entityIsInvulnerable(to)) {
						if(!battleHitData.hasOwnProperty(from.stats.accuracy)) {
							battleHitData[from.stats.accuracy] = {};
							battleHitData[from.stats.accuracy][to.stats.defense] = { total: 0, misses: 0 };
						} else if(!battleHitData[from.stats.accuracy].hasOwnProperty(to.stats.defense)) {
							battleHitData[from.stats.accuracy][to.stats.defense] = { total: 0, misses: 0 };
						}

						battleHitData[from.stats.accuracy][to.stats.defense].misses++;
					}
				});
			}

			if(message.msg == "removed" && message.collection == "redis") {
				localStorage.setItem("hitData", JSON.stringify(battleHitData));
				battleHitData = {};
			}

			if(message.msg == "added" && message.collection == "redis") {
				if(localStorage.getItem("hitData")) {
					battleHitData = JSON.parse(localStorage.getItem("hitData"));
				}
			}
		})
	}

	function getEntityById(id) {
		let allEntities = battleState.units.concat(battleState.enemies, battleState.deadUnits, battleState.deadEnemies);

		return allEntities.find(entity => entity.id == id);
	}

	function entityIsInvulnerable(entity) {
		return entity.buffs.find(buff => {
			// used by both ninja and spirit, as well as players
			if(buff.id == "evasive_maneuvers") return true;
		});
	}

    function isInBattle() {
        let battlesList = Meteor.connection._mongo_livedata_collections.battlesList.find().fetch();
        return battlesList.length > 0;
    }


})();