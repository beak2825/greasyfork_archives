// ==UserScript==
// @name		Melvor TimeRemaining
// @namespace	http://tampermonkey.net/
// @version		0.6.2.3
// @description	Shows time remaining for completing a task with your current resources. Takes into account Mastery Levels and other bonuses.
// @author		Breindahl#2660
// @match		https://melvoridle.com/*
// @match		https://www.melvoridle.com/*
// @match		https://melvoridle.com/*
// @match		https://test.melvoridle.com/*
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/400936/Melvor%20TimeRemaining.user.js
// @updateURL https://update.greasyfork.org/scripts/400936/Melvor%20TimeRemaining.meta.js
// ==/UserScript==
/* jshint esversion: 9 */

// Note that this script is made for Melvor Idle version 0.17
// Later versions might break parts of this script
// Big thanks to Xhaf#6478, Visua#9999 and TinyCoyote#1769 for helping with parts of the code and troubleshooting

// settings can be toggled from the console, or edited here
window.timeRemainingSettings = {
	// true for 12h clock (AM/PM), false for 24h clock
	IS_12H_CLOCK: false,
	// true for short clock `xxhxxmxxs`, false for long clock `xx hours, xx minutes and xx seconds`
	IS_SHORT_CLOCK: false,
	// true for alternative main display with xp/h, mastery xp/h and action count
	SHOW_XP_RATE: false,
	// true to allow final pool percentage > 100%
	UNCAP_POOL: false,
};

(function () {
	function injectScript(main) {
		var script = document.createElement('script');
		script.textContent = `try {(${main})();} catch (e) {console.log(e);}`;
		document.body.appendChild(script).parentNode.removeChild(script);
	}

	function script() {
		// Loading script
		console.log('Melvor TimeRemaining Loaded');

		// Function to check if task is complete
		function taskComplete(skillID) {
			if (window.timeLeftLast > 1 && window.timeLeftCurrent === 0) {
				notifyPlayer(skillID,"Task Done","danger");
				console.log('Melvor TimeRemaining: task done');
				let ding = new Audio("https://www.myinstants.com/media/sounds/ding-sound-effect.mp3");
				ding.volume=0.1;
				ding.play();
			}
		}

		// Create timeLeft containers
		let TempContainer = ['<div class="font-size-sm font-w600 text-uppercase text-center text-muted"><small id ="','" class="mb-2" style="display:block;clear:both;white-space: pre-line" data-toggle="tooltip" data-placement="top" data-html="true" title="" data-original-title=""></small></div>'];
		let TempContainerAlt = ['<div class="font-size-sm text-uppercase text-muted"><small id ="','" class="mt-2" style="display:block;clear:both;white-space: pre-line" data-toggle="tooltip" data-placement="top" data-html="true" title="" data-original-title=""></small></div>'];

		$("#smith-item-have").after(TempContainer[0] + "timeLeftSmithing" + TempContainer[1]);
		$("#fletch-item-have").after(TempContainer[0] + "timeLeftFletching" + TempContainer[1]);
		$("#runecraft-item-have").after(TempContainer[0] + "timeLeftRunecrafting" + TempContainer[1]);
		$("#craft-item-have").after(TempContainer[0] + "timeLeftCrafting" + TempContainer[1]);
		$("#herblore-item-have").after(TempContainer[0] + "timeLeftHerblore" + TempContainer[1]);
		$("#skill-cooking-food-selected-qty").after(TempContainerAlt[0] + "timeLeftCooking" + TempContainerAlt[1]);
		$("#skill-fm-logs-selected-qty").after(TempContainerAlt[0] + "timeLeftFiremaking" + TempContainerAlt[1]);
		$("#magic-item-have-and-div").after(TempContainer[0] + "timeLeftMagic" + TempContainer[1]);

		// Mastery Pool progress
		for(let id in SKILLS) {
			if(SKILLS[id].hasMastery) {
				let bar = $(`#mastery-pool-progress-${id}`)[0];
				$(bar).after(`<div id="mastery-pool-progress-end-${id}" class="progress-bar bg-warning" role="progressbar" style="width: 0%; background-color: #e5ae679c !important;"></div>`);
			}
		}

		// Mastery Progress bars
		for(let id in SKILLS) {
			if(SKILLS[id].hasMastery) {
				let name = skillName[id].toLowerCase();
				let bar = $(`#${name}-mastery-progress`)[0];
				$(bar).after(`<div id="${id}-mastery-pool-progress-end" class="progress-bar bg-info" role="progressbar" style="width: 0%; background-color: #5cace59c !important;"></div>`);
			}
		}

		// Mastery Skill progress
		for(let id in SKILLS) {
			if(SKILLS[id].hasMastery) {
				let bar = $(`#skill-progress-bar-${id}`)[0];
				$(bar).after(`<div id="skill-progress-bar-end-${id}" class="progress-bar bg-info" role="progressbar" style="width: 0%; background-color: #5cace59c !important;"></div>`);
			}
		}

		// Function to get unformatted number for Qty
		function getQtyOfItem(itemID) {
			for (let i = 0; i < bank.length; i++) {
				if (bank[i].id === itemID) {
					return bank[i].qty;
				}
			}
			return 0;
		}

		let appendName = (t, name, isShortClock) => {
			if (t === 0) {
				return "";
			}
			if (isShortClock) {
				return t + name[0];
			}
			let result = t + " " + name;
			if (t === 1) {
				return result;
			}
			return result + "s";
		};

		// Convert seconds to hours/minutes/seconds and format them
		function secondsToHms(d, isShortClock = timeRemainingSettings.IS_SHORT_CLOCK) {
			d = Number(d);
			// split seconds in hours, minutes and seconds
			let h = Math.floor(d / 3600);
			let m = Math.floor(d % 3600 / 60);
			let s = Math.floor(d % 3600 % 60);
			// no comma in short form
			// ` and ` if hours and minutes or hours and seconds
			// `, ` if hours and minutes and seconds
			let hDisplayComma = " ";
			if (!isShortClock && h > 0) {
				if ((m === 0 && s > 0) || (s === 0 && m > 0)) {
					hDisplayComma = " and ";
				} else if (s > 0 && m > 0) {
					hDisplayComma = ", ";
				}
			}
			// no comma in short form
			// ` and ` if minutes and seconds
			let mDisplayComma = " ";
			if (!isShortClock && m > 0 && s > 0) {
				mDisplayComma = " and ";
			}
			// append h/hour/hours etc depending on isShortClock, then concat and return
			return appendName(h, "hour", isShortClock) + hDisplayComma +
				appendName(m, "minute", isShortClock) + mDisplayComma +
				appendName(s, "second", isShortClock);
		}

		// Add seconds to date
		function AddSecondsToDate(date, seconds) {
			return new Date(date.getTime() + seconds*1000);
		}

		function daysBetween(now, then) {
			const startOfDayNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			return Math.floor((then - startOfDayNow) / 1000 / 60 / 60 / 24 + (startOfDayNow.getTimezoneOffset() - then.getTimezoneOffset()) / (60 * 24));
		}

		// Format date 24 hour clock
		function DateFormat(now, then, is12h = timeRemainingSettings.IS_12H_CLOCK, isShortClock = timeRemainingSettings.IS_SHORT_CLOCK){
			let days = daysBetween(now, then);
			days = (days == 0) ? "" : (days == 1) ? " tomorrow" : ` + ${days}` + (isShortClock ? "d" : " days");
			let hours = then.getHours();
			let minutes = then.getMinutes();
			// convert to 12h clock if required
			let amOrPm = '';
			if (is12h) {
				amOrPm = hours >= 12 ? 'pm' : 'am';
				hours = (hours % 12) || 12;
			}
			// pad numbers
			hours = hours < 10 ? '0' + hours : hours;
			minutes = minutes < 10 ? '0' + minutes : minutes;
			// concat and return remaining time
			return hours + ':' + minutes + amOrPm + days;
		}

		// Level to XP Array
		const lvlToXp = Array.from({ length: 200 }, (_, i) => exp.level_to_xp(i));

		// Convert level to XP needed to reach that level
		function convertLvlToXP(level) {
			if (level === Infinity) { return Infinity; }
			let xp = 0;
			if (level === 1) { return xp; }
			xp = lvlToXp[level] + 1;
			return xp;
		}

		// Convert XP value to level
		function convertXPToLvl(xp, noCap = false) {
			let level = 1;
			while (lvlToXp[level] < xp) { level++; }
			level--;
			if (level < 1) { level = 1; }
			else if (!noCap && level > 99) { level = 99; }
			return level;
		}

		// Get Mastery Level of given Skill and Mastery ID
		function getMasteryLevel(skill, masteryID) {
			return convertXPToLvl(MASTERY[skill].xp[masteryID]);
		}

		// Progress in current level
		function getPercentageInLevel(currentXP, finalXP, type, bar = false) {
			let currentLevel = convertXPToLvl(currentXP, true);
			if (currentLevel >= 99 && (type == "mastery" || bar == true)) return 0;
			let currentLevelXP = convertLvlToXP(currentLevel);
			let nextLevelXP = convertLvlToXP(currentLevel+1);
			let diffLevelXP = nextLevelXP - currentLevelXP;
			let currentLevelPercentage = (currentXP - currentLevelXP) / diffLevelXP * 100;
			if (bar == true) {
				let finalLevelPercentage = ((finalXP - currentXP) > (nextLevelXP - currentXP)) ? 100 - currentLevelPercentage : ((finalXP - currentXP)/diffLevelXP*100).toFixed(4);
				return finalLevelPercentage;
			}
			else {
				return currentLevelPercentage;
			}
		}

		// Main function
		function timeRemaining(skillID) {
			// Reset variables
			var masteryID = 0;
			var skillInterval = 0;
			var rhaelyxCharge = 0;
			var chargeUses = 0;
			var itemXP = 0;
			var item = 0;
			var initialTotalMasteryPoolXP = 0;
			var masteryPoolMaxXP = 0;
			var initialTotalMasteryLevelForSkill = 0;
			var initialTotalMasteryXP = 0; // Current amount of Mastery experience
			var masteryLim = []; // Xp needed to reach next level
			var skillLim = []; // Xp needed to reach next level
			var poolLim = []; // Xp need to reach next pool checkpoint
			var skillReq = []; // Needed items for craft and their quantities
			var itemCraft = []; // Amount of items craftable for each resource requirement
			var recordCraft = Infinity; // Amount of craftable items for limiting resource

			// Generate default values for script
			var timeLeftID = "timeLeft".concat(skillName[skillID]); // Field for generating timeLeft HTML
			var masteryLimLevel = Array.from({ length: 98 }, (_, i) => i + 2); //Breakpoints for mastery bonuses - default all levels starting at 2 to 99, followed by Infinity
			masteryLimLevel.push(Infinity);
			var skillLimLevel = Array.from({ length: 98 }, (_, i) => i + 2); //Breakpoints for mastery bonuses - default all levels starting at 2 to 99, followed by Infinity
			skillLimLevel.push(Infinity);
			var poolLimCheckpoints = [10,25,50,95,100,Infinity]; //Breakpoints for mastery pool bonuses followed by Infinity
			var chanceToKeep = Array.from({ length: 99 }, (_, i) => i *0.002); // Chance to keep at breakpoints - default 0.2% per level
			chanceToKeep[98] += 0.05; // Level 99 Bonus
			var now = new Date(); // Current time and day
			var initialSkillXP = skillXP[skillID]; // Current skill XP

			// Set current skill and pull matching variables from game with script
			switch (skillID) {
				case CONSTANTS.skill.Smithing:
					item = smithingItems[selectedSmith].itemID;
					itemXP = items[item].smithingXP;
					skillInterval = 2000;
					if (godUpgrade[3]) skillInterval *= 0.8;
					for (let i of items[item].smithReq) {
						skillReq.push(i);
					}
					masteryLimLevel = [20,40,60,80,99,Infinity]; // Smithing Mastery Limits
					chanceToKeep = [0,0.05,0.10,0.15,0.20,0.30]; //Smithing Mastery bonus percentages
					if(petUnlocked[5]) chanceToKeep = chanceToKeep.map(n => n + PETS[5].chance/100); // Add Pet Bonus
					break;

				case CONSTANTS.skill.Fletching:
					item = fletchingItems[selectedFletch].itemID;
					itemXP = items[item].fletchingXP;
					skillInterval = 2000;
					if (godUpgrade[0]) skillInterval *= 0.8;
					if (petUnlocked[8]) skillInterval -= 200;
					for (let i of items[item].fletchReq) {
						skillReq.push(i);
					}
					//Special Case for Arrow Shafts
					if (item == 276) {
						if (window.selectedFletchLog === undefined) {window.selectedFletchLog = 0;}
						skillReq = [skillReq[window.selectedFletchLog]];
					}
					break;

				case CONSTANTS.skill.Runecrafting:
					item = runecraftingItems[selectedRunecraft].itemID;
					itemXP = items[item].runecraftingXP;
					skillInterval = 2000;
					if (godUpgrade[1]) skillInterval *= 0.8;
					for (let i of items[item].runecraftReq) {
						skillReq.push(i);
					}
					masteryLimLevel = [99,Infinity]; // Runecrafting has no Mastery bonus
					chanceToKeep = [0,0]; //Thus no chance to keep
					if (equippedItems.includes(CONSTANTS.item.Runecrafting_Skillcape) || equippedItems.includes(CONSTANTS.item.Max_Skillcape) || equippedItems.includes(CONSTANTS.item.Cape_of_Completion)) chanceToKeep[0] += 0.35;
					if (petUnlocked[10]) chanceToKeep[0] += PETS[10].chance/100;
					chanceToKeep[1] = chanceToKeep[0];
					break;

				case CONSTANTS.skill.Crafting:
					item = craftingItems[selectedCraft].itemID;
					itemXP = items[item].craftingXP;
					skillInterval = 3000;
					if (godUpgrade[0]) skillInterval *= 0.8;
					if (equippedItems.includes(CONSTANTS.item.Crafting_Skillcape) || equippedItems.includes(CONSTANTS.item.Max_Skillcape) || equippedItems.includes(CONSTANTS.item.Cape_of_Completion)) skillInterval -= 500;
					if (petUnlocked[9]) skillInterval -= 200;
					for (let i of items[item].craftReq) {
						skillReq.push(i);
					}
					break;

				case CONSTANTS.skill.Herblore:
					item = herbloreItemData[selectedHerblore].itemID[getHerbloreTier(selectedHerblore)];
					itemXP = herbloreItemData[selectedHerblore].herbloreXP;
					skillInterval = 2000;
					if (godUpgrade[1]) skillInterval *= 0.8;
					for (let i of items[item].herbloreReq) {
						skillReq.push(i);
					}
					break;

				case CONSTANTS.skill.Cooking:
					item = selectedFood;
					itemXP = items[item].cookingXP;
					if (currentCookingFire > 0) {
						itemXP *= (1 + cookingFireData[currentCookingFire - 1].bonusXP / 100);
					}
					skillInterval = 3000;
					if (godUpgrade[3]) skillInterval *= 0.8;
					skillReq = [{id: item, qty: 1}];
					masteryLimLevel = [99,Infinity]; //Cooking has no Mastery bonus
					chanceToKeep = [0,0]; //Thus no chance to keep
					item = items[item].cookedItemID;
					break;

				case CONSTANTS.skill.Firemaking:
					item = selectedLog;
					itemXP = logsData[selectedLog].xp * (1 + bonfireBonus / 100);
					skillInterval = logsData[selectedLog].interval;
					if (godUpgrade[3]) skillInterval *= 0.8;
					skillReq = [{id: item, qty: 1}];
					chanceToKeep.fill(0); // Firemaking Mastery does not provide preservation chance
					break;

				case CONSTANTS.skill.Magic:
					skillInterval = 2000;
					//Find need runes for spell
					if (ALTMAGIC[selectedAltMagic].runesRequiredAlt !== undefined && useCombinationRunes) {
						for (let i of ALTMAGIC[selectedAltMagic].runesRequiredAlt) {
							skillReq.push({...i});
						}
					}
					else {
						for (let i of ALTMAGIC[selectedAltMagic].runesRequired) {
							skillReq.push({...i});
						}
					}

					// Get Rune discount
					for (let i = 0; i < skillReq.length; i++) {
						if (items[equippedItems[CONSTANTS.equipmentSlot.Weapon]].providesRune !== undefined) {
							if (items[equippedItems[CONSTANTS.equipmentSlot.Weapon]].providesRune.includes(skillReq[i].id)) {
								let capeMultiplier = 1;
								if (equippedItems.includes(CONSTANTS.item.Magic_Skillcape) || equippedItems.includes(CONSTANTS.item.Max_Skillcape) || equippedItems.includes(CONSTANTS.item.Cape_of_Completion)) capeMultiplier = 2; // Add cape multiplier
								skillReq[i].qty -= items[equippedItems[CONSTANTS.equipmentSlot.Weapon]].providesRuneQty * capeMultiplier;
							}
						}
					}
					skillReq = skillReq.filter(item => item.qty > 0); // Remove all runes with 0 cost

					//Other items
					if (ALTMAGIC[selectedAltMagic].selectItem == 1 && selectedMagicItem[1] !== null) { // Spells that just use 1 item
						skillReq.push({id: selectedMagicItem[1], qty: 1});
					}
					else if (ALTMAGIC[selectedAltMagic].selectItem == -1) { // Spells that doesn't require you to select an item
						if (ALTMAGIC[selectedAltMagic].needCoal) { // Rags to Riches II
							skillReq.push({id: 48, qty: 1});
						}
					}
					else if (selectedMagicItem[0] !== null && ALTMAGIC[selectedAltMagic].selectItem == 0) { // SUPERHEAT
						for (let i of items[selectedMagicItem[0]].smithReq) {
							skillReq.push({...i});
						}
						if (ALTMAGIC[selectedAltMagic].ignoreCoal) {
							skillReq = skillReq.filter(item => item.id !== 48);
						}
					}
					masteryLimLevel = [Infinity]; //AltMagic has no Mastery bonus
					chanceToKeep = [0]; //Thus no chance to keep
					break;
			}

			// Configure initial mastery values for all skills with masteries
			if (skillID != CONSTANTS.skill.Magic) {
				initialTotalMasteryPoolXP = MASTERY[skillID].pool;
				masteryPoolMaxXP = getMasteryPoolTotalXP(skillID);
				initialTotalMasteryLevelForSkill = getCurrentTotalMasteryLevelForSkill(skillID);
				masteryID = items[item].masteryID[1];
				initialTotalMasteryXP = MASTERY[skillID].xp[masteryID];
			}

			// Apply itemXP Bonuses from gear and pets
			itemXP = addXPBonuses(skillID, itemXP, true);

			// Populate masteryLim from masteryLimLevel
			for (let i = 0; i < masteryLimLevel.length; i++) {
				masteryLim[i] = convertLvlToXP(masteryLimLevel[i]);
			}
			// Populate skillLim from skillLimLevel
			for (let i = 0; i < skillLimLevel.length; i++) {
				skillLim[i] = convertLvlToXP(skillLimLevel[i]);
			}
			// Populate poolLim from masteryCheckpoints
			for (let i = 0; i < poolLimCheckpoints.length; i++) {
				poolLim[i] = masteryPoolMaxXP * poolLimCheckpoints[i] / 100;
			}

			// Check for Crown of Rhaelyx
			var RhaelyxChance = 0.15;
			if (equippedItems.includes(CONSTANTS.item.Crown_of_Rhaelyx) && skillID != CONSTANTS.skill.Magic) {
				for (let i = 0; i < masteryLimLevel.length; i++) {
					chanceToKeep[i] += 0.10; // Add base 10% chance
				}
				rhaelyxCharge = getQtyOfItem(CONSTANTS.item.Charge_Stone_of_Rhaelyx);
				chargeUses = rhaelyxCharge * 1000; // Estimated uses from Rhaelyx Charge Stones
			}

			// Get Item Requirements and Current Requirements
			for (let i = 0; i < skillReq.length; i++) {
				let	itemReq = skillReq[i].qty;
				//Check how many of required resource in Bank
				let itemQty = getQtyOfItem(skillReq[i].id);
				// Calculate max items you can craft for each itemReq
				itemCraft[i] = Math.floor(itemQty/itemReq);
				// Calculate limiting factor and set new record
				if(itemCraft[i] < recordCraft) {
					recordCraft = itemCraft[i];
				}
			}

			//Return the chanceToKeep for any mastery EXP
			function masteryChance(masteryEXP, chanceToRefTable){
				let chanceTo = chanceToRefTable;
				if (masteryEXP >= masteryLim[0]) {
					for (let i = 0; i < masteryLim.length; i++) {
						if (masteryLim[i] <= masteryEXP && masteryEXP < masteryLim[i+1]) {
							return chanceTo[i+1];
						}
					}
				} else {return chanceTo[0];}
			}

			// Adjust interval based on unlocked bonuses
			function intervalAdjustment(currentPoolMasteryXP, currentMasteryXP) {

				let adjustedInterval = skillInterval;

				switch (skillID) {
					case CONSTANTS.skill.Fletching:
						if (currentPoolMasteryXP >= poolLim[3]) adjustedInterval -= 200;
						break;

					case CONSTANTS.skill.Firemaking: {
						if (currentPoolMasteryXP >= poolLim[1]) adjustedInterval *= 0.9;
						let decreasedBurnInterval = 1 - convertXPToLvl(currentMasteryXP) * 0.001;
						adjustedInterval *= decreasedBurnInterval;
						break;
					}
				}

				return adjustedInterval;
			}

			// Adjust preservation chance based on unlocked bonuses
			function preservationAdjustment(currentPoolMasteryXP) {

				let adjustedPreservation = 0;

				switch (skillID) {
					case CONSTANTS.skill.Smithing:
						if (currentPoolMasteryXP >= poolLim[1]) adjustedPreservation += 5;
						if (currentPoolMasteryXP >= poolLim[2]) adjustedPreservation += 5;
						break;

					case CONSTANTS.skill.Runecrafting:
						if (currentPoolMasteryXP >= poolLim[2]) adjustedPreservation += 10;
						break;

					case CONSTANTS.skill.Herblore:
						if (currentPoolMasteryXP >= poolLim[2]) adjustedPreservation += 5;
						break;

					case CONSTANTS.skill.Cooking:
						if (currentPoolMasteryXP >= poolLim[2]) adjustedPreservation += 10;
						break;
				}

				return adjustedPreservation / 100;
			}

			// Adjust skill XP based on unlocked bonuses
			function skillXPAdjustment(currentPoolMasteryXP, currentMasteryXP) {

				let xpMultiplier = 1;

				switch (skillID) {
					case CONSTANTS.skill.Runecrafting:
						if (currentPoolMasteryXP >= poolLim[1] && items[item].type === "Rune") xpMultiplier += 1.5;
						break;

					case CONSTANTS.skill.Cooking: {
						let burnChance = calcBurnChance(currentMasteryXP);
						let cookXP = itemXP * (1 - burnChance);
						let burnXP = 1 * burnChance;
						return cookXP + burnXP;
					}
				}
				return itemXP * xpMultiplier;
			}

			// Calculate total number of unlocked items for skill based on current skill level
			function calcTotalUnlockedItems(currentTotalSkillXP) {
				let count = 0;
				let currentSkillLevel = convertXPToLvl(currentTotalSkillXP);
				for (let i = 0; i < MILESTONES[skillName[skillID]].length; i++) {
					if (currentSkillLevel >= MILESTONES[skillName[skillID]][i].level) count++;
				}
				return count;
			}

			// Calculate mastery xp based on unlocked bonuses
			function calcMasteryXpToAdd(timePerAction, currentTotalSkillXP, currentMasteryXP, currentPoolMasteryXP, currentTotalMasteryLevelForSkill) {
				let xpModifier = 1;
				// General Mastery XP formula
				let xpToAdd = (((calcTotalUnlockedItems(currentTotalSkillXP) * currentTotalMasteryLevelForSkill) / getTotalMasteryLevelForSkill(skillID) + convertXPToLvl(currentMasteryXP) * (getTotalItemsInSkill(skillID) / 10)) * (timePerAction / 1000)) / 2;
				// Skill specific mastery pool modifier
				if (currentPoolMasteryXP >= poolLim[0]) {
					xpModifier += 0.05;
				}
				// Firemaking pool and log modifiers
				if (skillID === CONSTANTS.skill.Firemaking) {
					// If current skill is Firemaking, we need to apply mastery progression from actions and use updated currentPoolMasteryXP values
					if (currentPoolMasteryXP >= poolLim[3]) {
						xpModifier += 0.05;
					}
					for (let i = 0; i < MASTERY[CONSTANTS.skill.Firemaking].xp.length; i++) {
						// The logs you are not burning
						if (masteryID != i) {
							if (getMasteryLevel(CONSTANTS.skill.Firemaking, i) >= 99) {
								xpModifier += 0.0025;
							}
						}
					}
					// The log you are burning
					if (convertXPToLvl(currentMasteryXP) >= 99) {
						xpModifier += 0.0025;
					}
				} else {
					// For all other skills, you use the game function to grab your FM mastery progression
					if (getMasteryPoolProgress(CONSTANTS.skill.Firemaking) >= masteryCheckpoints[3]) {
						xpModifier += 0.05;
					}
					for (let i = 0; i < MASTERY[CONSTANTS.skill.Firemaking].xp.length; i++) {
						if (getMasteryLevel(CONSTANTS.skill.Firemaking, i) >= 99) {
							xpModifier += 0.0025;
						}
					}
				}
				// Ty modifier
				if (petUnlocked[21]) {
					xpModifier += 0.03;
				}
				// AroM modifier
				if (equippedItems.includes(CONSTANTS.item.Ancient_Ring_Of_Mastery)) {
					xpModifier += items[CONSTANTS.item.Ancient_Ring_Of_Mastery].bonusMasteryXP;
				}
				// Combine base and modifiers
				xpToAdd *= xpModifier;
				if (xpToAdd < 1) {
					xpToAdd = 1;
				}
				// BurnChance affects average mastery XP
				if (skillID === CONSTANTS.skill.Cooking) {
					let burnChance = calcBurnChance(currentMasteryXP);
					xpToAdd *= (1 - burnChance);
				}
				return xpToAdd;
			}

			// Calculate pool XP based on mastery XP
			function calcPoolXPToAdd(currentTotalSkillXP, masteryXP) {
				if (convertXPToLvl(currentTotalSkillXP) >= 99) {return masteryXP / 2; }
				else { return masteryXP / 4; }
			}

			// Calculate burn chance based on mastery level
			function calcBurnChance(currentMasteryXP) {
				let burnChance = 0;
				if (equippedItems.includes(CONSTANTS.item.Cooking_Skillcape) || equippedItems.includes(CONSTANTS.item.Max_Skillcape) || equippedItems.includes(CONSTANTS.item.Cape_of_Completion)) {
					return burnChance;
				}
				if (equippedItems.includes(CONSTANTS.item.Cooking_Gloves)) {
					return burnChance;
				}
				let primaryBurnChance = (30 - convertXPToLvl(currentMasteryXP) * 0.6) / 100;
				let secondaryBurnChance = 0.01;
				if (primaryBurnChance <= 0) {
					return secondaryBurnChance;
				}
				burnChance = 1 - (1 - primaryBurnChance) * (1 - secondaryBurnChance);
				return burnChance;
			}

			// Calculates expected time, taking into account Mastery Level advancements during the craft
			function calcExpectedTime(resources){
				let sumTotalTime = 0;
				let maxPoolTime = 0;
				let maxMasteryTime = 0;
				let maxSkillTime = 0;
				let maxPoolReached = false;
				let maxMasteryReached = false;
				let maxSkillReached = false;
				let maxXP = convertLvlToXP(99);
				if (initialTotalMasteryPoolXP >= masteryPoolMaxXP) maxPoolReached = true;
				if (initialTotalMasteryXP >= maxXP) maxMasteryReached = true;
				if (initialSkillXP >= maxXP) maxSkillReached = true;
				let currentTotalMasteryXP = initialTotalMasteryXP;
				let currentTotalSkillXP = initialSkillXP;
				let currentTotalPoolXP = initialTotalMasteryPoolXP;
				let currentTotalMasteryLevelForSkill = initialTotalMasteryLevelForSkill;
				// compute current xp/h and mxp/h
				let initialInterval = intervalAdjustment(initialTotalMasteryPoolXP, initialTotalMasteryXP);
				let xph = skillXPAdjustment(initialTotalMasteryPoolXP, initialTotalMasteryXP) / initialInterval * 1000 * 3600;
				// compute current mastery xp / h using the getMasteryXpToAdd from the game
				let masteryXPh = getMasteryXpToAdd(skillID, masteryID, initialInterval) / initialInterval * 1000 * 3600;
				// alternative: compute through the calcMasteryXpToAdd method from this script, they should be the same !
				// let masteryXPh = calcMasteryXpToAdd(initialInterval, currentTotalSkillXP, currentTotalMasteryXP, currentTotalPoolXP, currentTotalMasteryLevelForSkill) / initialInterval * 1000 * 3600;

				// counter for estimated number of actions
				let actions = 0;

				while (resources > 0) {
					// Adjustments
					let currentPreservationAdjustment = preservationAdjustment(currentTotalPoolXP);
					let totalChanceToUse = 1 - masteryChance(currentTotalMasteryXP,chanceToKeep) - currentPreservationAdjustment;
					let currentInterval = intervalAdjustment(currentTotalPoolXP, currentTotalMasteryXP);

					// Current Limits
					let currentMasteryLim = masteryLim.find(element => element > currentTotalMasteryXP);
					let currentSkillLim = skillLim.find(element => element > currentTotalSkillXP);
					let currentPoolLim = poolLim.find(element => element > currentTotalPoolXP);

					// Current XP
					let currentMasteryXP = calcMasteryXpToAdd(currentInterval, currentTotalSkillXP, currentTotalMasteryXP, currentTotalPoolXP, currentTotalMasteryLevelForSkill);
					let currentSkillXP = skillXPAdjustment(currentTotalPoolXP, currentTotalMasteryXP);
					let currentPoolXP = calcPoolXPToAdd(currentTotalSkillXP, currentMasteryXP);

					// Distance to Limits
					let masteryXPToLimit = currentMasteryLim - currentTotalMasteryXP;
					let skillXPToLimit = currentSkillLim - currentTotalSkillXP;
					let poolXPToLimit = currentPoolLim - currentTotalPoolXP;

					// Actions to limits
					let masteryXPActions = masteryXPToLimit / currentMasteryXP;
					let skillXPActions = skillXPToLimit / currentSkillXP;
					let poolXPActions = poolXPToLimit / currentPoolXP;

					// estimate amount of actions
					// number of actions with rhaelyx charges
					let resourceActions = Math.min(chargeUses, resources / (totalChanceToUse - RhaelyxChance));
					// remaining resources
					let resWithoutCharge = Math.max(0, resources - chargeUses);
					// add number of actions without rhaelyx charges
					resourceActions += x / totalChanceToUse;

					// Minimum actions based on limits
					let expectedActions = Math.ceil(Math.min(masteryXPActions, skillXPActions, poolXPActions, resourceActions));

					// Take away resources based on expectedActions
					if (expectedActions == resourceActions) {
						resources = 0; // No more limits
					} else {
						let resUsed = 0;
						if (expectedActions < chargeUses) {
							// won't run out of charges yet
							resUsed = expectedActions * (totalChanceToUse - RhaelyxChance);
						} else {
							// first use charges
							resUsed = chargeUses * (totalChanceToUse - RhaelyxChance);
							// remaining actions are without charges
							resUsed += (expectedActions - chargeUses) * totalChanceToUse;
						}
						resources = Math.round(resources - resUsed);
					}

					// time for current loop
					let timeToAdd = expectedActions * currentInterval;

					// Update time and XP
					sumTotalTime += timeToAdd;
					currentTotalMasteryXP += currentMasteryXP*expectedActions;
					currentTotalSkillXP += currentSkillXP*expectedActions;
					currentTotalPoolXP += currentPoolXP*expectedActions;

					// Time for max pool, 99 Mastery and 99 Skill
					if (!maxPoolReached && currentTotalPoolXP >= masteryPoolMaxXP) {
						maxPoolTime = sumTotalTime;
						maxPoolReached = true;
					}
					if (!maxMasteryReached && maxXP <= currentTotalMasteryXP) {
						maxMasteryTime = sumTotalTime;
						maxMasteryReached = true;
					}
					if (!maxSkillReached && maxXP <= currentTotalSkillXP) {
						maxSkillTime = sumTotalTime;
						maxSkillReached = true;
					}

					// Update remaining Rhaelyx Charge uses
					chargeUses -= expectedActions;
					if ( chargeUses < 0 ) chargeUses = 0;

					// Level up mastery if hitting Mastery limit
					if ( masteryXPActions == expectedActions ) currentTotalMasteryLevelForSkill++;

					// estimate total remaining actions
					actions += expectedActions;
				}
				return {
					"timeLeft" : Math.round(sumTotalTime),
					"actions": actions,
					"finalSkillXP" : currentTotalSkillXP,
					"finalMasteryXP" : currentTotalMasteryXP,
					"finalPoolPercentage" : Math.min((currentTotalPoolXP/masteryPoolMaxXP) * 100, timeRemainingSettings.UNCAP_POOL ? Infinity : 100).toFixed(2),
					"maxPoolTime" : maxPoolTime,
					"maxMasteryTime" : maxMasteryTime,
					"maxSkillTime" : maxSkillTime,
					"masteryXPh": masteryXPh,
					"xph" : xph,
				};
			}

			//Time left
			var results = 0;
			var timeLeft = 0;
			var timeLeftPool = 0;
			var timeLeftMastery = 0;
			var timeLeftSkill = 0;
			if (skillID == CONSTANTS.skill.Magic) {
				timeLeft = Math.round(recordCraft * skillInterval / 1000);
			} else {
				results = calcExpectedTime(recordCraft);
				timeLeft = Math.round(results.timeLeft / 1000);
				timeLeftPool = Math.round(results.maxPoolTime / 1000);
				timeLeftMastery = Math.round(results.maxMasteryTime / 1000);
				timeLeftSkill = Math.round(results.maxSkillTime / 1000);
			}

			//Global variables to keep track of when a craft is complete
			window.timeLeftLast = window.timeLeftCurrent;
			window.timeLeftCurrent = timeLeft;

			//Inject timeLeft HTML
			let timeLeftElement = document.getElementById(timeLeftID);
			if(timeLeftElement !== null) {
				if (timeLeft !== 0) {
					let finishedTime = AddSecondsToDate(now, timeLeft);
					if (timeRemainingSettings.SHOW_XP_RATE) {
						timeLeftElement.textContent = "XP/h: " + formatNumber(Math.floor(results.xph)) +
							"\r\nMXP/h: " + formatNumber(Math.floor(results.masteryXPh)) +
							"\r\nActions: " + formatNumber(results.actions) +
							"\r\nTime: " + secondsToHms(timeLeft) +
							"\r\nFinish: " + DateFormat(now, finishedTime);
					} else {
						timeLeftElement.textContent = "Will take: " + secondsToHms(timeLeft) + "\r\n Expected finished: " + DateFormat(now, finishedTime);
					}
					timeLeftElement.style.display = "block";
				} else {
					// empty and reset if no time
					timeLeftElement.style.display = "none";
				}
			}
			if (skillID != CONSTANTS.skill.Magic) {
				// Generate progression Tooltips
				if (!timeLeftElement._tippy) {
					tippy(timeLeftElement, {
						allowHTML: true,
						interactive: false,
						animation: false,
					});
				}
				let wrapper = ['<div class="row"><div class="col-6" style="white-space: nowrap;"><h3 class="block-title m-1" style="color:white;" >','</h3></div><div class="col-6" style="white-space: nowrap;"><h3 class="block-title m-1 pl-1"><span class="p-1 bg-',' rounded" style="text-align:center; display: inline-block;line-height: normal;width: 70px;color:white;">','</span>','</h3></div></div>'];
				let percentageSkill = (getPercentageInLevel(results.finalSkillXP,results.finalSkillXP,"skill")).toFixed(1);
				let percentageSkillElement = (percentageSkill == 0) ? '' : ` +${percentageSkill}%`;
				let finalSkillLevelElement = wrapper[0] + 'Final Skill Level ' + wrapper[1] + 'success' + wrapper[2] + convertXPToLvl(results.finalSkillXP,true) + ' / 99' + wrapper[3] + percentageSkillElement + wrapper[4];
				let timeLeftSkillElement = '';
				if (timeLeftSkill > 0){
					let finishedTimeSkill = AddSecondsToDate(now,timeLeftSkill);
					timeLeftSkillElement = '<div class="row"><div class="col-12 font-size-sm text-uppercase text-muted mb-1" style="text-align:center"><small style="display:inline-block;clear:both;white-space:pre-line;color:white;">Time to 99: ' + secondsToHms(timeLeftSkill) + '<br> Expected finished: ' + DateFormat(now,finishedTimeSkill) + '</small></div></div>';
				}
				let percentageMastery = (getPercentageInLevel(results.finalMasteryXP,results.finalMasteryXP,"mastery")).toFixed(1);
				let percentageMasteryElement = (percentageMastery == 0) ? '' : ` +${percentageMastery}%`;
				let finalMasteryLevelElement = wrapper[0] + 'Final Mastery Level ' + wrapper[1] + 'info' + wrapper[2] + convertXPToLvl(results.finalMasteryXP) + ' / 99' + wrapper[3] + percentageMasteryElement + wrapper[4];
				let timeLeftMasteryElement = '';
				if (timeLeftMastery > 0){
					let finishedTimeMastery = AddSecondsToDate(now,timeLeftMastery);
					timeLeftMasteryElement = '<div class="row"><div class="col-12 font-size-sm text-uppercase text-muted mb-1" style="text-align:center"><small style="display:inline-block;clear:both;white-space:pre-line;color:white;">Time to 99: ' + secondsToHms(timeLeftMastery) + '<br> Expected finished: ' + DateFormat(now,finishedTimeMastery) + '</small></div></div>';
				}
				let finalPoolPercentageElement = wrapper[0] + 'Final Mastery Pool ' + wrapper[1] + 'warning' + wrapper[2] + results.finalPoolPercentage + '%' + wrapper[3] + wrapper[4];
				let timeLeftPoolElement = '';
				if (timeLeftPool > 0){
					let finishedTimePool = AddSecondsToDate(now,timeLeftPool);
					timeLeftPoolElement = '<div class="row"><div class="col-12 font-size-sm text-uppercase text-muted mb-1" style="text-align:center"><small class="" style="display:inline-block;clear:both;white-space:pre-line;color:white;">Time to 100%: ' + secondsToHms(timeLeftPool) + '<br> Expected finished: ' + DateFormat(now,finishedTimePool) + '</small></div></div>';
				}
				let tooltip = '<div class="col-12 mt-1">' + finalSkillLevelElement + timeLeftSkillElement + finalMasteryLevelElement + timeLeftMasteryElement + finalPoolPercentageElement + timeLeftPoolElement +'</div>';
				timeLeftElement._tippy.setContent(tooltip);

				let poolProgress = (results.finalPoolPercentage > 100) ? 100 - ((initialTotalMasteryPoolXP / masteryPoolMaxXP)*100) : (results.finalPoolPercentage - ((initialTotalMasteryPoolXP / masteryPoolMaxXP)*100)).toFixed(4);
				$(`#mastery-pool-progress-end-${skillID}`).css("width", poolProgress + "%");
				let masteryProgress = getPercentageInLevel(initialTotalMasteryXP,results.finalMasteryXP,"mastery",true);
				$(`#${skillID}-mastery-pool-progress-end`).css("width", masteryProgress + "%");
				let skillProgress = getPercentageInLevel(initialSkillXP,results.finalSkillXP,"skill",true);
				$(`#skill-progress-bar-end-${skillID}`).css("width", skillProgress + "%");
			}
		}

		// select and start craft overrides
		var selectRef = {};
		var startRef = {};
		[	// skill name, select names, < start name >
			["Smithing", ["Smith"]],
			["Fletching", ["Fletch"]],
			["Runecrafting", ["Runecraft"]],
			["Crafting", ["Craft"]],
			["Herblore", ["Herblore"]],
			["Cooking", ["Food"]],
			["Firemaking", ["Log"], "burnLog"],
			["Magic", ["Magic", "ItemForMagic"], "castMagic"],
		].forEach(skill => {
			let long = skill[0];
			let shorts = skill[1];
			let start = "start" + long;
			if (skill.length > 2) {
				start = skill[2];
			}
			// selects
			shorts.forEach(short => {
				selectRef[short] = window["select" + short];
				window["select" + short] = function(...args) {
					selectRef[short](...args);
					try {
						timeRemaining(CONSTANTS.skill[long]);
					} catch (e) {
						console.error(e);
					}
				};
			});
			// start
			startRef[long] = window[start];
			window[start] = function(...args) {
				startRef[long](...args);
				try {
					timeRemaining(CONSTANTS.skill[long]);
					taskComplete(CONSTANTS.skill[long]);
				} catch (e) {
					console.error(e);
				}
			};
		});
	}

	function loadScript() {
		if ((window.isLoaded && !window.currentlyCatchingUp) || (typeof unsafeWindow !== 'undefined' && unsafeWindow.isLoaded && !unsafeWindow.currentlyCatchingUp)) { // Only load script after game has opened
			clearInterval(scriptLoader);
			injectScript(script);
		}
	}

	const scriptLoader = setInterval(loadScript, 200);
})();