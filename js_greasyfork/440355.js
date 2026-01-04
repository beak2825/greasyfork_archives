// ==UserScript==
// @name		Melvor Idle - Golbin Raid Cheats
// @namespace   http://tampermonkey.net/
// @version		0.2.9
// @description	Adds various cheats for Golbin Raid.
// @author		Xander#8896
// @match		https://*.melvoridle.com/*
// @exclude		https://wiki.melvoridle.com/*
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/440355/Melvor%20Idle%20-%20Golbin%20Raid%20Cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/440355/Melvor%20Idle%20-%20Golbin%20Raid%20Cheats.meta.js
// ==/UserScript==
 
 
function script() {
    let GRCMenuDropdrown;
    let GRCEquipmentItemDropdown, GRCEquipmentPassiveCheckbox, GRCEquipmentAltCheckbox, GRCEquipmentAltDropdown, GRCEquipmentQtyTextbox;
    let GRCRunesDropdown, GRCRunesQtyTextbox;
    let GRCFoodDropdown, GRCFoodQtyTextbox;
    let GRCModifierSubjectDropdown, GRCModifierDropdown, GRCModifierQtyTextbox;
    let GRCWaveQtyTextbox;
    let GRCPrayerQtyTextbox;
    let GRCRaidCoinsQtyTextbox;
    let GRCSkipItemSelectionCheckbox;
    let GRCSkipModifierSelectionCheckbox;
	let GRCSkipWaveCheckbox;
	let GRCAutoPrayCheckbox;
 
    function openGolbinCheatsMenu() {
        if (game.isGolbinRaid) {
            for (let i = 0; i < combatMenuCount; i++) {
                $('#combat-menu-' + i).addClass('d-none');
                $('#combat-menu-item-' + i).removeClass('border border-2x border-combat-outline');
            }
            $('#combat-menu-' + 4).removeClass('d-none');
            $('#combat-menu-item-' + 4).addClass('border border-2x border-combat-outline');
        }
    }
 
    function openGolbinCheatsSubMenu() {
        const subMenus = {
            0: "GRCEquipmentMenu",
            1: "GRCRunesMenu",
            2: "GRCFoodMenu",
            3: "GRCModifierMenu",
            4: "GRCWaveMenu",
            5: "GRCPrayerMenu",
            6: "GRCSetRaidCoinsMenu",
            7: "GRCSkipMenusMenu"
        }
        $('#GRCEquipmentMenu').addClass('d-none');
        $('#GRCRunesMenu').addClass('d-none');
        $('#GRCFoodMenu').addClass('d-none');
        $('#GRCModifierMenu').addClass('d-none');
        $('#GRCWaveMenu').addClass('d-none');
        $('#GRCPrayerMenu').addClass('d-none');
        $('#GRCSetRaidCoinsMenu').addClass('d-none');
        $('#GRCSkipMenusMenu').addClass('d-none');
        $('#' + subMenus[GRCMenuDropdrown.value]).removeClass('d-none');
    }
 
    function GRCEquip() {
        let item = items[GRCEquipmentItemDropdown.value]
        let itemID = item.id
        let equipmentSet = raidManager.player.selectedEquipmentSet;
 
        let itemSlot
        if (GRCEquipmentPassiveCheckbox.checked) {
            itemSlot = "Passive"
        }
        else {
            itemSlot = "Default"
        }
 
        let qty = GRCEquipmentQtyTextbox.valueAsNumber;
 
        let alts = []
        if (GRCEquipmentAltCheckbox.checked) {
            let specialAttack
            if (GRCEquipmentAltDropdown.value == -1) {
                specialAttack = getRandomArrayElement(raidManager.specialAttackSelection)
            }
            else {
                specialAttack = raidManager.specialAttackSelection.find(e => e.id == GRCEquipmentAltDropdown.value)
            }
            alts.push(specialAttack)
        }
 
        raidManager.player.equipItem(itemID, equipmentSet, itemSlot, qty, alts)
 
    }
 
    function GRCItemSelected() {
        let item = items[GRCEquipmentItemDropdown.value]
 
        if ((item.category == "Combat" || item.category == "Golbin Raid") && item.validSlots.includes("Passive")) {
            document.getElementById("GRCEquipmentPassive").style.display = "initial";
        }
        else {
            GRCEquipmentPassiveCheckbox.checked = false
            document.getElementById("GRCEquipmentPassive").style.display = "none";
        }
 
        if ((item.category == "Combat" || item.category == "Golbin Raid") && item.hasSpecialAttack) {
            document.getElementById("GRCEquipmentAlt1").style.display = "initial";
        }
        else {
            GRCEquipmentAltCheckbox.checked = false
            document.getElementById("GRCEquipmentAlt1").style.display = "none";
        }
 
        if (GRCEquipmentAltCheckbox.checked) {
            document.getElementById("GRCEquipmentAlt2").style.display = "initial";
        }
        else {
            document.getElementById("GRCEquipmentAlt2").style.display = "none";
        }
 
        if (item.validSlots.includes("Quiver")) {
            document.getElementById("GRCEquipmentQty").style.display = "initial";
        }
        else {
            GRCEquipmentQtyTextbox.value = 1;
            document.getElementById("GRCEquipmentQty").style.display = "none";
        }
    }
 
    function GRCEquipRunes() {
        let qty = GRCRunesQtyTextbox.valueAsNumber;
 
        if (GRCRunesDropdown.value == -2) {
            const AllRunes = items.filter(e => !RaidManager.bannedItems.includes(e.id) && e.type == "Rune")
 
            for (const i of AllRunes){
                raidManager.bank.addItem(i.id, qty)
            }
        }
        else if (GRCRunesDropdown.value == -1) {
            raidManager.addExistingRunesCallback(qty);
        }
        else {
            let item = items[GRCRunesDropdown.value]
            let itemID = item.id
            raidManager.bank.addItem(itemID, qty)
        }
    }
 
    function GRCEquipFood() {
        let item = items[GRCFoodDropdown.value]
        let itemID = item.id
        let qty = GRCFoodQtyTextbox.valueAsNumber;
        raidManager.player.equipFood(itemID, qty)
    }
 
    function GRCSetWave() {
        let qty = GRCWaveQtyTextbox.valueAsNumber;
        raidManager.wave = qty - 1
 
        raidManager.endFight();
        if (raidManager.spawnTimer.isActive)
            raidManager.spawnTimer.stop();
        if (raidManager.enemy.state !== 'Dead')
            raidManager.enemy.processDeath();
 
        raidManager.waveProgress = 0;
        raidManager.loadNextEnemy();
 
        raidManager.onLoad()
    }
 
    function GRCSetPrayerPoints() {
        let qty = GRCPrayerQtyTextbox.valueAsNumber;
        raidManager.player.prayerPoints = qty
        raidManager.player.rendersRequired.prayerPoints = true;
    }
 
    function GRCSetRaidCoins() {
        let qty = GRCRaidCoinsQtyTextbox.valueAsNumber;
        raidCoins = qty;
    }
 
    function GRCAddModifier() {
        let modifier = {key:GRCModifierDropdown.value, value:GRCModifierQtyTextbox.valueAsNumber}
 
        let subject = GRCModifierSubjectDropdown.value
        if (subject == 0) {
            raidManager.randomPlayerModifiers.push(modifier)
        }
        else if (subject == 1) {
            raidManager.randomEnemyModifiers.push(modifier)
        }
        raidManager.onLoad()
    }
 
    function GRSResetModifiers() {
        raidManager.randomEnemyModifiers = [];
        raidManager.randomPlayerModifiers = [];
        raidManager.onLoad()
    }
 
	raidManager.continueModifierSelectionCopy = raidManager.continueModifierSelection
	raidManager.continueModifierSelection = function (...args) {
		try {
			if (GRCSkipWaveCheckbox.checked || GRCSkipModifierSelectionCheckbox.checked) {
				if (raidManager.state == RaidState.SelectingModifiersStart) {
					raidManager.startRaid();
				} else {
					raidManager.state = RaidState.SelectingCategory;
					raidManager.render();
					raidManager.fireCategorySelectModal();
				}
			} else {
				raidManager.continueModifierSelectionCopy(...args);
			}
		} catch (err) {
			console.error(err)
			raidManager.continueModifierSelectionCopy(...args);
		}	
	}
 
	raidManager.fireCategorySelectModalCopy = raidManager.fireCategorySelectModal
	raidManager.fireCategorySelectModal = function (...args) {
		try {
			if (GRCSkipWaveCheckbox.checked || GRCSkipItemSelectionCheckbox.checked) {
				raidManager.continueRaid();
			} else {
				raidManager.fireCategorySelectModalCopy(...args);
			}
		} catch (err) {
			console.error(err)
			raidManager.fireCategorySelectModalCopy(...args);
		}
	}
	
	function autoSkip(delay) {
		if(GRCSkipWaveCheckbox.checked && raidManager.isActive && game.isGolbinRaid) {
			setTimeout(function () {
				raidManager.skipWave()
				raidManager.rendersRequired.location = true;
			}, delay)
		}
	}
	
	function clickAutoSkip() {
		if(GRCSkipWaveCheckbox.checked) {
			GRCSkipModifierSelectionCheckbox.checked = true
			GRCSkipItemSelectionCheckbox.checked = true
			autoSkip(100)
		}
	}
	
	function untoggleAll() {
		GRCSkipModifierSelectionCheckbox.checked = false;
		GRCSkipItemSelectionCheckbox.checked = false;
		GRCSkipWaveCheckbox.checked = false;
	}
	
	raidManager.continueRaidCopy = raidManager.continueRaid;
	raidManager.continueRaid = function (...args) {
		raidManager.continueRaidCopy(...args);
 
		try {
			autoSkip(1)
		} catch (err) {
			console.error(err)
		}
	}
 
	raidManager.startRaidCopy = raidManager.startRaid;
	raidManager.startRaid = function (...args) {
		try {
			untoggleAll()
		} catch (err) {
			console.error(err)
		} finally {
			raidManager.startRaidCopy(...args);
		}
	}
	
	raidManager.stopCombatCopy = raidManager.stopCombat
	raidManager.stopCombat = function (...args) {
		try {
			GRCSkipWaveCheckbox.checked = false;
		} catch (err) {
		console.error(err)
		} finally {
			setTimeout(function () {
				raidManager.stopCombatCopy(...args);
			}, 50)
			
		}
	}
	
	let protectionPrayer = null;
	function autoPray() {
		if(protectionPrayer && raidManager.player.activePrayers.has(protectionPrayer)) {
			raidManager.player.togglePrayer(protectionPrayer);
		}
		
		if (GRCAutoPrayCheckbox.checked) {
			switch (raidManager.enemy.attackType) {
			case 'melee':
				protectionPrayer = Prayers.Protect_from_Melee;
				break;
			case 'ranged':
				protectionPrayer = Prayers.Protect_from_Ranged;
				break;
			case 'magic':
				protectionPrayer = Prayers.Protect_from_Magic;
				break;
			}
		
			if(raidManager.player.activePrayers.size < 2 && !raidManager.player.activePrayers.has(protectionPrayer) && raidManager.player.computePrayerMaxCost(PRAYER[protectionPrayer]) <= raidManager.player.prayerPoints) {
				raidManager.player.togglePrayer(protectionPrayer);
			}
		}
	}
	
	raidManager.startFightCopy = raidManager.startFight;
	raidManager.startFight = function(...args) {
		try {
			if (GRCAutoPrayCheckbox.checked) {
				autoPray()
			}
		} catch (e) {
			console.error(e);
		} finally {
			raidManager.startFightCopy(...args);
		}
	}
	
    function injectGRC(){
        if (!document.getElementById("GRC")) {
            let htmlIcon = `<img class="combat-equip-img border-rounded-equip p-1 m-1 pointer-enabled" id="combat-menu-item-4" src="https://cdn.melvor.net/core/v018/assets/media/pets/golden_golbin.svg">`
            let htmlGRC = `
			<div class="block block-rounded-double bg-combat-inner-dark text-center p-3" id="GRC">
				<div class="row no-gutters">
					<div class="col-12">
						<h5 class="font-w700 text-combat-smoke m-1 mb-2">Golbin Raid Cheats</h5>
					</div>
				</div>
				<div class="row gutters-tiny">
					<div class="col-12">
						<label class="mb-1">Choose Cheat:</label>
						<select class="form-control mb-1" id="GRCMenuDropdrown">
							<option value="0">Equipment</option>
							<option value="1">Runes</option>
							<option value="2">Food</option>
							<option value="3">Modifiers</option>
							<option value="4">Set Wave</option>
							<option value="5">Set Prayer Points</option>
							<option value="6">Set Raid Coins</option>
							<option value="7">Various Toggles</option>
						</select>
					</div>
				</div>
				<hr>
				<div class="row gutters-tiny" id="GRCEquipmentMenu">
					<div class="col-12">
						<label class="mb-1">Choose Item:</label>
						<select class="form-control mb-1" id="GRCEquipmentItemDropdown"></select>
					</div>
					<div class="col-12" id="GRCEquipmentPassive">
						<input type="checkbox" id="GRCEquipmentPassiveCheckbox" name="GRCEquipmentPassiveCheckbox">
						<label for="GRCEquipmentPassiveCheckbox">Is Passive</label>
					</div>
					<div class="col-12" id="GRCEquipmentAlt1">
						<input type="checkbox" id="GRCEquipmentAltCheckbox" name="GRCEquipmentAltCheckbox">
						<label for="GRCEquipmentAltCheckbox">Has ALT</label>
					</div>
					<div class="col-12" id="GRCEquipmentAlt2">
						<label class="mb-1">Choose Alt:</label>
						<select class="form-control mb-1" id="GRCEquipmentAltDropdown">
							<option value="-1">Random</option>
						</select>
					</div>
					<div class="col-12" id="GRCEquipmentQty">
						<label for="GRCEquipmentQtyTextbox">Quantity:</label>
						<input id="GRCEquipmentQtyTextbox" type="number" min="1" max="Infinity" class="form-control mb-1" value="1">
					</div>
					<div class="col-12">
						<button type="button" id="GRCEquipmentEquip" class="btn btn-primary m-1" style="width: 100%;">
							Equip
						</button>
					</div>
				</div>
				<div class="row no-gutters" id="GRCRunesMenu">
					<div class="col-12">
						<label class="mb-1">Choose Rune:</label>
						<select class="form-control mb-1" id="GRCRunesDropdown">
							<option value="-2">All Runes</option>
							<option value="-1">Owned Runes</option>
						</select>
					</div>
					<div class="col-12" id="GRCRunesQty">
						<label for="GRCRunesQtyTextbox">Quantity:</label>
						<input id="GRCRunesQtyTextbox" type="number" min="1" max="Infinity" class="form-control mb-1" value="1">
					</div>
					<div class="col-12">
						<button type="button" id="GRCRunesEquip" class="btn btn-primary m-1" style="width: 100%;">
							Add Runes
						</button>
					</div>
				</div>
				<div class="row no-gutters" id="GRCFoodMenu">
					<div class="col-12">
						<label class="mb-1">Choose Food:</label>
						<select class="form-control mb-1" id="GRCFoodDropdown">
						</select>
					</div>
					<div class="col-12" id="GRCFoodQty">
						<label for="GRCFoodQtyTextbox">Quantity:</label>
						<input id="GRCFoodQtyTextbox" type="number" min="1" max="Infinity" class="form-control mb-1" value="1">
					</div>
					<div class="col-12">
						<button type="button" id="GRCFoodEquip" class="btn btn-primary m-1" style="width: 100%;">
							Add Food
						</button>
					</div>
				</div>
				<div class="row no-gutters" id="GRCModifierMenu">
					<div class="col-12">
						<label class="mb-1">Modifier for:</label>
						<select class="form-control mb-1" id="GRCModifierSubjectDropdown">
							<option value="0">Player</option>
							<option value="1">Golbins</option>
						</select>
					</div>
					<div class="col-12">
						<label class="mb-1">Choose Modifier:</label>
						<select class="form-control mb-1" id="GRCModifierDropdown">
						</select>
					</div>
					<div class="col-12" id="GRCModifierQty">
						<label for="GRCModifierQtyTextbox">Quantity:</label>
						<input id="GRCModifierQtyTextbox" type="number" min="1" max="Infinity" class="form-control mb-1" value="1">
					</div>
					<div class="col-12">
						<button type="button" id="GRCModifierEquip" class="btn btn-primary m-1" style="width: 100%;">
							Add Modifier
						</button>
					</div>
					<div class="col-12">
						<button type="button" id="GRCModifierReset" class="btn btn-primary m-1" style="width: 100%;">
							Reset Modifiers
						</button>
					</div>
				</div>
				<div class="row no-gutters" id="GRCWaveMenu">
					<div class="col-12" id="GRCWaveQty">
						<label for="GRCWaveQtyTextbox">Quantity:</label>
						<input id="GRCWaveQtyTextbox" type="number" min="1" max="Infinity" class="form-control mb-1" value="1">
					</div>
					<div class="col-12">
						<button type="button" id="GRCWaveChange" class="btn btn-primary m-1" style="width: 100%;">
							Change Wave
						</button>
					</div>
				</div>
				<div class="row no-gutters" id="GRCPrayerMenu">
					<div class="col-12" id="GRCPrayerQty">
						<label for="GRCPrayerQtyTextbox">Quantity:</label>
						<input id="GRCPrayerQtyTextbox" type="number" min="1" max="Infinity" class="form-control mb-1" value="1">
					</div>
					<div class="col-12">
						<button type="button" id="GRCPrayerChange" class="btn btn-primary m-1" style="width: 100%;">
							Set Prayer Points
						</button>
					</div>
				</div>
				<div class="row no-gutters" id="GRCSetRaidCoinsMenu">
					<div class="col-12" id="GRCRaidCoinsQty">
						<label for="GRCRaidCoinsQtyTextbox">Quantity:</label>
						<input id="GRCRaidCoinsQtyTextbox" type="number" min="1" max="Infinity" class="form-control mb-1" value="1">
					</div>
					<div class="col-12">
						<button type="button" id="GRCRaidCoinsChange" class="btn btn-primary m-1" style="width: 100%;">
							Set Raid Coins
						</button>
					</div>
				</div>
				<div class="row no-gutters" id="GRCSkipMenusMenu">
					<div class="col-12">
						<input type="checkbox" id="GRCSkipItemSelectionCheckbox" name="GRCSkipItemSelectionCheckbox">
						<label for="GRCSkipItemSelectionCheckbox">Skip Item Selection</label>
					</div>
					<div class="col-12">
						<input type="checkbox" id="GRCSkipModifierSelectionCheckbox" name="GRCSkipModifierSelectionCheckbox">
						<label for="GRCSkipModifierSelectionCheckbox">Skip Modifier Selection</label>
					</div>
					<div class="col-12">
						<input type="checkbox" id="GRCSkipWaveCheckbox" name="GRCSkipWaveCheckbox">
						<label for="GRCSkipWaveCheckbox">Skip Waves</label>
					</div>
					<div class="col-12">
						<input type="checkbox" id="GRCAutoPrayCheckbox" name="GRCAutoPrayCheckbox">
						<label for="GRCAutoPrayCheckbox">Auto Pray</label>
					</div>
				</div>
			</div>
		`;
 
            var template = document.createElement('template');
            template.innerHTML = htmlIcon.trim();
            let iconDivs = document.querySelector("#combat-player-container > div.block.block-rounded-double.bg-combat-inner-dark.text-center.p-3");
            iconDivs.appendChild(template.content.firstChild);
 
            template = document.createElement('template');
            template.innerHTML = htmlGRC.trim();
            let combatDivs = document.getElementById("combat-menu-4");
            combatDivs.appendChild(template.content.firstChild);
 
 
            GRCMenuDropdrown = document.getElementById('GRCMenuDropdrown');
            GRCEquipmentItemDropdown = document.getElementById('GRCEquipmentItemDropdown');
            GRCEquipmentPassiveCheckbox = document.getElementById('GRCEquipmentPassiveCheckbox');
            GRCEquipmentAltCheckbox = document.getElementById('GRCEquipmentAltCheckbox');
            GRCEquipmentAltDropdown = document.getElementById('GRCEquipmentAltDropdown');
            GRCEquipmentQtyTextbox = document.getElementById('GRCEquipmentQtyTextbox');
            GRCRunesDropdown = document.getElementById('GRCRunesDropdown');
            GRCRunesQtyTextbox = document.getElementById('GRCRunesQtyTextbox');
            GRCFoodDropdown = document.getElementById('GRCFoodDropdown');
            GRCFoodQtyTextbox = document.getElementById('GRCFoodQtyTextbox');
            GRCModifierSubjectDropdown = document.getElementById('GRCModifierSubjectDropdown');
            GRCModifierDropdown = document.getElementById('GRCModifierDropdown');
            GRCModifierQtyTextbox = document.getElementById('GRCModifierQtyTextbox');
            GRCWaveQtyTextbox = document.getElementById('GRCWaveQtyTextbox');
            GRCPrayerQtyTextbox = document.getElementById('GRCPrayerQtyTextbox');
            GRCRaidCoinsQtyTextbox = document.getElementById('GRCRaidCoinsQtyTextbox');
            GRCSkipItemSelectionCheckbox = document.getElementById('GRCSkipItemSelectionCheckbox');
            GRCSkipModifierSelectionCheckbox = document.getElementById('GRCSkipModifierSelectionCheckbox');
			GRCSkipWaveCheckbox = document.getElementById('GRCSkipWaveCheckbox');
			GRCAutoPrayCheckbox = document.getElementById('GRCAutoPrayCheckbox');
			
 
 
 
 
            const GRCitems = items.filter(e => !RaidManager.bannedItems.includes(e.id) && isEquipment(e) && !e.validSlots.includes('Summon1'))
            const GRCspecialAttacks = [...new Set(raidManager.specialAttackSelection)];
            GRCitems.sort((a, b) => (a.name > b.name) ? 1 : -1)
            GRCspecialAttacks.sort((a, b) => (a.name > b.name) ? 1 : -1)
 
            for (const i of GRCitems){
                let opt = document.createElement('option');
                opt.value = i.id;
                opt.innerHTML = i.name;
                GRCEquipmentItemDropdown.appendChild(opt);
            }
 
            for (const i of GRCspecialAttacks){
                let chanceText = formatPercent(i.defaultChance);
                if (Math.floor(i.defaultChance) !== i.defaultChance) {
                    chanceText = formatPercent(i.defaultChance, 2);
                }
 
                let opt = document.createElement('option');
                opt.value = i.id;
                opt.innerHTML = getAttackName(i) + " (" + chanceText + "): " + describeAttack(i);
                GRCEquipmentAltDropdown.appendChild(opt);
            }
 
            const GRCRunes = items.filter(e => !RaidManager.bannedItems.includes(e.id) && e.type == "Rune")
            GRCRunes.sort((a, b) => (a.name > b.name) ? 1 : -1)
 
            for (const i of GRCRunes){
                let opt = document.createElement('option');
                opt.value = i.id;
                opt.innerHTML = i.name;
                GRCRunesDropdown.appendChild(opt);
            }
 
            const GRCFood = items.filter(e => !RaidManager.bannedItems.includes(e.id) && e.type == "Food")
            GRCFood.sort((a, b) => (a.name > b.name) ? 1 : -1)
            for (const i of GRCFood){
                let opt = document.createElement('option');
                opt.value = i.id;
                opt.innerHTML = i.name;
                GRCFoodDropdown.appendChild(opt);
            }
 
            for (const i of RaidManager.possibleModifiers) {
                let opt = document.createElement('option');
                opt.value = i.key;
                opt.innerHTML = printPlayerModifier(i.key, 1)[0];
                GRCModifierDropdown.appendChild(opt);
            }
 
            GRCMenuDropdrown.addEventListener("change", openGolbinCheatsSubMenu);
            GRCEquipmentItemDropdown.addEventListener("change", GRCItemSelected);
            GRCEquipmentAltCheckbox.addEventListener("change", GRCItemSelected);
            document.getElementById('GRCEquipmentEquip').addEventListener("click", GRCEquip);
            document.getElementById('GRCRunesEquip').addEventListener("click", GRCEquipRunes);
            document.getElementById('GRCFoodEquip').addEventListener("click", GRCEquipFood);
            document.getElementById('GRCWaveChange').addEventListener("click", GRCSetWave);
            document.getElementById('GRCPrayerChange').addEventListener("click", GRCSetPrayerPoints);
            document.getElementById('GRCRaidCoinsChange').addEventListener("click", GRCSetRaidCoins);
            document.getElementById('GRCModifierEquip').addEventListener("click", GRCAddModifier);
            document.getElementById('GRCModifierReset').addEventListener("click", GRSResetModifiers);
            document.getElementById('combat-menu-item-4').addEventListener("click", openGolbinCheatsMenu);
            document.getElementById('GRCSkipWaveCheckbox').addEventListener("click", clickAutoSkip);
            document.getElementById('GRCAutoPrayCheckbox').addEventListener("click", autoPray);
			
  
            GRCItemSelected()
            openGolbinCheatsSubMenu()
        }
    }
    injectGRC()
}
 
function loadScript() {
	if (typeof confirmedLoaded !== typeof undefined && confirmedLoaded) {
		clearInterval(scriptLoader);
		const scriptElement = document.createElement('script');
		scriptElement.textContent = `try {(${script})();} catch (e) {console.log(e);}`;
		document.body.appendChild(scriptElement).parentNode.removeChild(scriptElement);
	}
}
 
const scriptLoader = setInterval(loadScript, 200);