// ==UserScript==
// @name        Krypto The SuperPet
// @description Creates a new super pet
// @match       https://*.melvoridle.com/*
// @exclude     https://wiki.melvoridle.com/*
// @version     2.1.0
// @namespace https://greasyfork.org/users/946097
// @downloadURL https://update.greasyfork.org/scripts/449552/Krypto%20The%20SuperPet.user.js
// @updateURL https://update.greasyfork.org/scripts/449552/Krypto%20The%20SuperPet.meta.js
// ==/UserScript==

(() => {
	const load = () => {
		const isGameLoaded = (window.isLoaded && !window.currentlyCatchingUp) ||
		(typeof unsafeWindow !== 'undefined' && unsafeWindow.isLoaded && !unsafeWindow.currentlyCatchingUp);

		if (!isGameLoaded) {
			setTimeout(load, 50);
			return;
		}

		inject();
	}
	
	const main = () => {
		var createPetInLog = function(pet){
			const petContainer = document.getElementById('petlog-container').children[0];

			//Create the div container
			var div = document.createElement('div');
			div.id = "LR-Krypto";
			div.classList.add('monster-item', 'no-bg', 'btn-light', 'pointer-enabled', 'm-1', 'justify-vertical-center');

			//Create the image
			var img = document.createElement('img');
			img.id = "LR-kryptoPet";
			img.src = pet.media;
			img.metadata_for_pet = pet;

			img.classList.add('combat-enemy-img-sm', 'p-2');
			img.onclick = function(e){
				var metadata = document.getElementById(e.srcElement.id).metadata_for_pet;
				unlockPet(parseInt(metadata.location));
			};

			//Add the image to the container
			div.appendChild(img);

			//Add the div container to the pet container
			petContainer.appendChild(div);
		};

		var formatHelper = function(valToFormat, type, sign){
			var formattedVal = "";

			//Handle the formatting of the value itself
			if(valToFormat && type){
				if(type === "per"){
					formattedVal = valToFormat.toString() + "%"
				}
				else if(type === "ms"){
					var msToS = Math.round(valToFormat/1000*1000)/1000;
					formattedVal = msToS.toString() + " seconds";
				}
				else{
					formattedVal = valToFormat.toString();
				}
			}
			
			//Handle the sign
			if(sign){
				formattedVal = sign + formattedVal;
			}

			return formattedVal;
		};
		
		var formatter = function(valArray){
			//Start empty
			var formattedVal = "";

			//Handle the different types of values
			if(valArray){
				var val;
				var type = valArray[1];
				var sign = valArray[2];
				if(valArray[0] !== null && Array.isArray(valArray[0])){
					val = valArray[0][1];
					formattedVal = formatHelper(val, type, sign);
				}
				else if(valArray[0] !== null){
					val = valArray[0];
					formattedVal = formatHelper(val, type, sign);
				}    
			}

			return formattedVal;
		};
		
		//Format
		// [expectedValue, type, sign] - handled types (per(%), ms(ms), num())
		// for arrays <key> is the property/title, expectedValue is the value
		var mods = {
			"skills" : {
				"title" : "Skill Modifiers",
				"decreasedSkillIntervalPercent" : {
					"Runecrafting Interval" : [[Skills.Runecrafting, 100], "per", "-"],
					"Woodcutting Interval" : [[Skills.Woodcutting, 120], "per", "-"],
					"Firemaking Interval" : [[Skills.Firemaking, 100], "per", "-"],
					"Fletching Interval" : [[Skills.Fletching, 100], "per", "-"],
					"Summoning Interval" : [[Skills.Summoning, 100], "per", "-"],
					"Astrology Interval" : [[Skills.Astrology, 100], "per", "-"],
					"Smithing Interval" : [[Skills.Smithing, 100], "per", "-"],
					"Thieving Interval" : [[Skills.Thieving, 100], "per", "-"],
					"Crafting Interval" : [[Skills.Crafting, 100], "per", "-"],
					"Herblore Interval" : [[Skills.Herblore, 100], "per", "-"],
					"Fishing Interval" : [[Skills.Fishing, 120], "per", "-"],
					"Cooking Interval" : [[Skills.Cooking, 100], "per", "-"],
					"Agility Interval" : [[Skills.Agility, 100], "per", "-"],
					"Mining Interval" : [[Skills.Mining, 130], "per", "-"],
					"Magic Interval" : [[Skills.Magic, 100], "per", "-"]
				}
			},
			"player" : {
				"title" : "Player Modifiers",
				//XP
				"increasedGlobalSkillXP" : {
					"title" : "Global Skill XP",
					"values" : [100, "per", "+"]
				},
				"increasedGlobalMasteryXP" : {
					"title" : "Global Mastery XP",
					"values" : [100, "per", "+"]
				},
				//Preservation
				"increasedGlobalPreservationChance" : {
					"title" : "Global Preservation",
					"values" : [100, "per", "+"]
				},
				"increasedAmmoPreservation" : {
					"title" : "Ammo Preservation",
					"values" : [100, "per", "+"]
				},
				"increasedRunePreservation" : {
					"title" : "Rune Preservation",
					"values" : [100, "per", "+"]
				},
				"increasedChanceToPreservePrayerPoints" : {
					"title" : "Preserve Prayer Points",
					"values" : [100, "per", "+"]
				},
				"increasedSummoningChargePreservation" : {
					"title" : "Summoning Charge Preservation",
					"values" : [100, "per", "+"]
				},
				"increasedChanceToPreservePotionCharge" : {
					"title" : "Preserve Potion Charge",
					"values" : [100, "per", "+"]
				},
				//Combat
				"decreasedAttackIntervalPercent" : {
					"title" : "Player Attack Interval Reduction %",
					"values" : [100, "per", "-"]
				},
				"decreasedMonsterRespawnTimer": {
					"title" : "Monster Respawn Reduction",
					"values" : [player.getMonsterSpawnTime() - 250, "ms", "-"] // Respawn time (Recommended not to go under 100)
				},
				"increasedDamageReduction" : {
					"title" : "Damage Reduction",
					"values" : [100, "per", "-"]
				},
				"increasedMinHitBasedOnMaxHit" : {
					"title" : "Increased Min Hit Based On Max Hit",
					"values" : [75, "per", "+"]
				},
				"increasedGlobalAccuracy" : {
					"title" : "Increased Global Accuracy",
					"values" : [100, "per", "+"]
				},
				"increasedGlobalEvasion" : {
					"title" : "Increased Global Evasion",
					"values" : [100, "per", "+"]
				},
				"increasedMaxHitpoints" : {
					"title" : "Hitpoints",
					"values" : [100, "per", "+"]
				},
				"increasedDamageToAllMonsters" : {
					"title" : "Damage to all Monsters",
					"values" : [100, "per", "+"]
				},
				"increasedLifesteal" : {
					"title" : "Lifesteal",
					"values" : [100, "per", "+"]
				},
				"increasedReflectDamage" : {
					"title" : "Reflect Damage",
					"values" : [100, "per", "+"]
				},
				"increasedFoodHealingValue" : {
					"title" : "Food Healing Value",
					"values" : [100, "per", "+"]
				},
				"increasedAutoEatEfficiency"  : {
					"title" : "Auto Eat Efficiency",
					"values" : [100, "per", "+"]
				},
				"increasedSlayerAreaEffectNegationFlat" : {
					"title" : "Slayer Area Effect Negation",
					"values" : [100, "per", "+"]
				},
				//Currency
				"increasedGPGlobal" : {
					"title" : "Increased Global GP",
					"values" : [100, "per", "+"]
				},
				"increasedGPFromSales" : {
					"title" : "GP from Sales",
					"values" : [100, "per", "+"]
				},
				"increasedSlayerCoins" : {
					"title" : "Slayer Coins",
					"values" : [100, "per", "+"]
				},
				//Loot
				"increasedChanceToDoubleItemsGlobal" : {
					"title" : "Double Items Global",
					"values" : [100, "per", "+"]
				},
				"increasedOffItemChance" : {
					"title" : "Off Item Chance",
					"values" : [100, "per", "+"]
				},
				"allowLootContainerStacking" : {
					"title" : "Loot Container Stacking",
					"values" : [1, "num", "+"]
				},
				"autoLooting" : {
					"title" : "Autoloot",
					"values" : [1, "num", "+"]
				},
				"allowSignetDrops" : {
					"title" : "Signet Drops",
					"values" : [1, "num", "+"]
				},
				//Other
				"increasedThievingStealth" : {
					"title" : "Increased Stealth",
					"values" : [2500, "num", "+"]
				},
				"increasedBankSpace" : {
					"title" : "Bank Space",
					"values" : [100, "num", "+"]
				},
				"increasedChanceNoDamageMining" : {
					"title" : "Chance No Damage Mining",
					"values" : [100, "per", "+"]
				},
				"increasedChanceForElementalRune" : {
					"title" : "Chance For Elemental Rune",
					"values" : [100, "per", "+"]
				},
				"increasedTreeCutLimit" : {
					"title" : "Tree Cut Limit",
					"values" : [10, "num", "+"]
				},
				"increasedEquipmentSets" : {
					"title" : "Increased Equipment Sets",
					"values" : [2, "num", "+"]
				},
				"freeBonfires" : {
					"title" : "Free Bonfires",
					"values" : [1, "num", "+"]
				},
				"freeCompost" : {
					"title" : "Free Compost",
					"values" : [1, "num", "+"]
				},
				"itemProtection" : {
					"title" : "Item Protection",
					"values" : [1, "num", "+"]
				},
				"curseImmunity" : {
					"title" : "Curse Immunity",
					"values" : [1, "num", "+"]
				},
				"dungeonEquipmentSwapping" : {
					"title" : "Dungeon Equipment Swapping",
					"values" : [1, "num", "+"]
				},
				"autoSlayerUnlocked" : {
					"title" : "Auto Slayer Unlocked",
					"values" : [1, "num", "+"]
				},
				"bypassSlayerItems" : {
					"title" : "Bypass Slayer Items",
					"values" : [1, "num", "+"]
				}
			}
		};
		
		var createPetObjectArray = function(modLoc, property){
			var arr = [];
			if(modLoc && property){
				for(const [key,value] of Object.entries(modLoc[property])){
					if(key && value){
						arr.push(modLoc[property][key][0]);
					}
				}
			}
			return arr;
		}

		//Dynamic section creator, makes it personal to the type of mod it is
		var createSection = function(sectionProps, isArr){
			
			//metadata info to be ignored
			var reserved = ["title"];

			//Header
			var section = "";
			
			//Skills require an array of arrays, this handles it
			if(isArr){
				section = `<br><h5 class="font-w400 font-size-sm mb-1">${sectionProps.title}</h5><br>`;
				for (const [key, value] of Object.entries(sectionProps)){
					if(reserved.indexOf(key) === -1){
						for(const[innerKey, innerValue] of Object.entries(sectionProps[key])){
							section += `<h5 class="font-w400 font-size-sm mb-1 text-success">${innerKey}: ${formatter(innerValue)} </h5>`;
						}
					}
				}
			}
			
			//Else just use the standard way of doing things
			else{
				section = `<br><h5 class="font-w400 font-size-sm mb-1">${sectionProps.title}</h5><br>`;
				for (const [key, value] of Object.entries(sectionProps)) {
					if(reserved.indexOf(key) === -1){
						section += `<h5 class="font-w400 font-size-sm mb-1 text-success">${value.title}: ${formatter(value.values)} </h5>`;
						}
					}
				}

			return section;
		};

		//Creates the description for the pet unlock
		var createDescription = function(){
			//Create the heading element
			var desc = '<div class="h5 font-w400 text-info text-center m-1 mb-2">Super Pet</div>';
			desc += createSection(mods.player, false);
			desc += createSection(mods.skills, true);
			return desc;
		};
		
		//Krypto The SuperPet
		var krypto = {
			"html_img_id" : "LR-kryptoPet",  
			"name":"Krypto",
			"description":createDescription(),
			"media":"https://i.imgur.com/OuQkdW0.png",
			"acquiredBy":"Being Cool",
			"modifiers":{
				"decreasedSkillIntervalPercent" : createPetObjectArray(mods.skills, "decreasedSkillIntervalPercent"),
				"increasedSlayerAreaEffectNegationFlat" : mods.player["increasedSlayerAreaEffectNegationFlat"].values[0],
				"increasedChanceToPreservePrayerPoints" : mods.player["increasedChanceToPreservePrayerPoints"].values[0],
				"increasedChanceToPreservePotionCharge" : mods.player["increasedChanceToPreservePotionCharge"].values[0],
				"increasedSummoningChargePreservation" : mods.player["increasedSummoningChargePreservation"].values[0],
				"increasedChanceToDoubleItemsGlobal" : mods.player["increasedChanceToDoubleItemsGlobal"].values[0],
				"increasedGlobalPreservationChance" : mods.player["increasedGlobalPreservationChance"].values[0],
				"increasedChanceForElementalRune" : mods.player["increasedChanceForElementalRune"].values[0],
				"decreasedAttackIntervalPercent" : mods.player["decreasedAttackIntervalPercent"].values[0],
				"increasedChanceNoDamageMining" : mods.player["increasedChanceNoDamageMining"].values[0],
				"increasedMinHitBasedOnMaxHit" : mods.player["increasedMinHitBasedOnMaxHit"].values[0],
				"increasedDamageToAllMonsters" : mods.player["increasedDamageToAllMonsters"].values[0],
				"decreasedMonsterRespawnTimer" : mods.player["decreasedMonsterRespawnTimer"].values[0],
				"increasedAutoEatEfficiency" : mods.player["increasedAutoEatEfficiency"].values[0],
				"allowLootContainerStacking" : mods.player["allowLootContainerStacking"].values[0],
				"increasedRunePreservation" : mods.player["increasedRunePreservation"].values[0],
				"increasedAmmoPreservation" : mods.player["increasedAmmoPreservation"].values[0],
				"increasedFoodHealingValue" : mods.player["increasedFoodHealingValue"].values[0],
				"increasedThievingStealth" : mods.player["increasedThievingStealth"].values[0],
				"increasedGlobalMasteryXP" : mods.player["increasedGlobalMasteryXP"].values[0],
				"increasedDamageReduction" : mods.player["increasedDamageReduction"].values[0],
				"dungeonEquipmentSwapping" : mods.player["dungeonEquipmentSwapping"].values[0],
				"increasedGlobalAccuracy" : mods.player["increasedGlobalAccuracy"].values[0],
				"increasedGlobalSkillXP" : mods.player["increasedGlobalSkillXP"].values[0],
				"increasedGlobalEvasion" : mods.player["increasedGlobalEvasion"].values[0],
				"increasedReflectDamage" : mods.player["increasedReflectDamage"].values[0],
				"increasedOffItemChance" : mods.player["increasedOffItemChance"].values[0],
				"increasedEquipmentSets" : mods.player["increasedEquipmentSets"].values[0],
				"increasedMaxHitpoints" : mods.player["increasedMaxHitpoints"].values[0],
				"increasedTreeCutLimit" : mods.player["increasedTreeCutLimit"].values[0],
				"increasedSlayerCoins" : mods.player["increasedSlayerCoins"].values[0],
				"increasedGPFromSales" : mods.player["increasedGPFromSales"].values[0],
				"autoSlayerUnlocked" : mods.player["autoSlayerUnlocked"].values[0],
				"increasedLifesteal" : mods.player["increasedLifesteal"].values[0],
				"increasedBankSpace" : mods.player["increasedBankSpace"].values[0],
				"increasedGPGlobal" : mods.player["increasedGPGlobal"].values[0],
				"bypassSlayerItems" : mods.player["bypassSlayerItems"].values[0],
				"allowSignetDrops" : mods.player["allowSignetDrops"].values[0],
				"itemProtection" : mods.player["itemProtection"].values[0],
				"curseImmunity" : mods.player["curseImmunity"].values[0],
				"freeBonfires" : mods.player["freeBonfires"].values[0],
				"freeCompost" : mods.player["freeCompost"].values[0],
				"autoLooting" : mods.player["autoLooting"].values[0]
            },
            "activeInRaid":false
        };
		
		//Get the total amount of pets and add krypto to the end
		var curLen = JSON.stringify(PETS.length);
		krypto.location = curLen;
		PETS.push(krypto);

		//Unlock the pet
		unlockPet(parseInt(curLen));

		//Add to container
		createPetInLog(krypto);

		//Make sure player stats are updated
		updatePlayerStats();

		//Make sure equipment set change is updated
		player.updateForEquipSetChange();

		//Make sure player modifiers are updated
		updateAllPlayerModifiers();
	};
	
	const inject = () => {
		const script = document.createElement('script');
		script.textContent = `try { (${main})(); } catch (e) { console.error(e); }`;
		document.body.appendChild(script);
	}

	load();
})();
