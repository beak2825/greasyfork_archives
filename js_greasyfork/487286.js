// ==UserScript==
// @name         IdlePixel Chance2Hit - GodofNades Fork
// @namespace    com.anwinity.idlepixel
// @version      1.2.6.2
// @description  Adds chance-to-hit indicators in combat. Updated to align with 8 Jan 2023 combat update for accuracy (result = enemy_defence/2 - hero_accuracy).
// @author       Original Author: Anwinity || Modded By: GodofNades
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idle-pixel.com
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/487286/IdlePixel%20Chance2Hit%20-%20GodofNades%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/487286/IdlePixel%20Chance2Hit%20-%20GodofNades%20Fork.meta.js
// ==/UserScript==


(function() {
    'use strict';

    class CombatBot extends IdlePixelPlusPlugin {
        constructor() {
            super("chance2hit", {
                about: {
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
            this.autoCmbEnabled = false;
            this.fightDict = {
                'field': 'field',
                'forest': 'forest',
                'cave': 'cave',
                'volcano': 'volcano',
                'northern_field': 'northern_field',
                'mansion': 'mansion',
                'beach': 'beach',
                'blood_field': 'blood_field',
                'blood_forest': 'blood_forest',
                'blood_cave': 'blood_cave',
                'blood_volcano': 'blood_volcano',
                'chicken': 'field',
                'rat': 'field',
                'spider': 'field',
                'lizard': 'field',
                'bee': 'field',
                'snake': 'forest',
                'ants': 'forest',
                'wolf': 'forest',
                'forest_ent': 'forest',
                'thief': 'forest',
                'bear': 'cave',
                'goblin': 'cave',
                'bat': 'cave',
                'skeleton': 'cave',
                'fire_hawk': 'volcano',
                'fire_snake': 'volcano',
                'fire_golem': 'volcano',
                'fire_witch': 'volcano',
                'ice_hawk': 'northern_field',
                'ice_witch': 'northern_field',
                'ice_golem': 'northern_field',
                'yeti': 'northern_field',
                'ghost': 'mansion',
                'grandma': 'mansion',
                'exorcist': 'mansion',
                'reaper': 'mansion',
                'shark': 'beach',
                'sea_soldier': 'beach',
                'puffer_fish': 'beach',
                'saltwater_crocodile': 'beach',
                'blood_chicken': 'blood_field',
                'blood_rat': 'blood_field',
                'blood_spider': 'blood_field',
                'blood_lizard': 'blood_field',
                'blood_bee': 'blood_field',
                'blood_snake': 'blood_forest',
                'blood_ants': 'blood_forest',
                'blood_wolf': 'blood_forest',
                'blood_forest_ent': 'blood_forest',
                'blood_thief': 'blood_forest',
                'blood_bear': 'blood_cave',
                'blood_goblin': 'blood_cave',
                'blood_bat': 'blood_cave',
                'blood_skeleton': 'blood_cave',
                'blood_fire_hawk': 'blood_volcano',
                'blood_fire_snake': 'blood_volcano',
                'blood_fire_golem': 'blood_volcano',
                'blood_fire_witch': 'blood_volcano',
                'fp_grind_5k': 'beach',
                'fp_grind_7k': 'beach',
                'fp_grind_10k': 'beach'
            };
            this.locationDict = {
                'field': {'fp': 300, 'energy': 10},
                'forest': {'fp': 600, 'energy': 200},
                'cave': {'fp': 900, 'energy': 500},
                'volcano': {'fp': 1500, 'energy': 1000},
                'northern_field': {'fp': 2000, 'energy': 3000},
                'mansion': {'fp': 3500, 'energy': 5000},
                'beach': {'fp': 5000, 'energy': 10000},
                'blood_field': {'fp': 1000, 'energy': 2000},
                'blood_forest': {'fp': 2000, 'energy': 4000},
                'blood_cave': {'fp': 3500, 'energy': 6000},
                'blood_volcano': {'fp': 5000, 'energy': 10000}
            };


            this.armourDict = {
                body: {0: "lizard_body", 1: "bat_body", 2: "crocodile_body", 3: "dragon_body"},
                boots: {0: "lizard_boots", 1: "bat_boots", 2: "crocodile_boots", 3: "dragon_boots"},
                gloves: {0: "lizard_gloves", 1: "bat_gloves", 2: "crocodile_gloves", 3: "dragon_gloves"},
                legs: {0: "lizard_legs", 1: "bat_legs", 2: "crocodile_legs", 3: "dragon_legs"},
                head: {0: "lizard_mask", 1: "bat_mask", 2: "crocodile_mask", 3: "sea_helmet", 4: "dragon_helmet"},
                shield: {0: "skeleton_shield", 1: "dragon_shield"}
            };
            this.caveArmourDict = {
                shield: {3: "lantern"}
            };
            this.coldArmourDict = {
                body: {4: "bear_body", 5: "frozen_crocodile_body"},
                boots: {4: "bear_boots", 5: "frozen_crocodile_boots",},
                gloves: {4: "bear_gloves", 5: "frozen_crocodile_gloves",},
                legs: {4: "bear_legs", 5: "frozen_crocodile_legs",},
                head: {5: "bear_mask", 6: "frozen_crocodile_mask",},
            };
            this.mageArmourDict = {
                body: {4: "reaper_body"},
                boots: {4: "reaper_boots"},
                gloves: {4: "reaper_gloves"},
                legs: {4: "reaper_skirt"},
                head: {5: "reaper_hood"},
            };
            this.beachArmourDict = {
                boots: {4: "flippers"},
            };
            this.weaponDict = {
                melee: {0: "wooden_sword", 1: "stinger", 2: "iron_dagger", 3: "poison_stinger", 4: "skeleton_sword", 5: "scythe", 6: "stinger_dagger", 7: "poison_stinger_dagger", 8: "rapier", 9: "poison_rapier", 10: "gold_rapier", 11: "poison_gold_rapier"},
                range: {0: "wooden_bow", 1: "long_bow", 2: "haunted_bow"},
                magic: {0: "wooden_staff"}
            };
            this.entWeaponDict = {
                melee: {12: "battle_axe"}
            };
            this.mansionWeaponDict = {
                melee: {12: "scythe", 13: "double_scythe"}
            };
            this.beachWeaponDict = {
                melee: {12: "trident", 13:"long_trident"},
            };
            this.pufferWeaponDict = {
                melee: {12: "long_spear", 13:"long_trident"},
            };

        }

        onLogin() {
            this.username = document.querySelector('item-display[data-key="username"]').innerText;
            // Add any login specific logic here

            const topBar = document.getElementById('top-bar');
            if (topBar) {
                // Combined Dropdown for Locations and Monsters
                this.fightSelect = document.createElement('select');
                Object.keys(this.fightDict).forEach(key => {
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '); // Capitalize first letter and replace underscores
                    this.fightSelect.appendChild(option);
                });
                topBar.appendChild(this.fightSelect);

                // AutoCmb Toggle Button
                this.autoCmbToggleButton = document.createElement('button');
                this.autoCmbToggleButton.textContent = 'Enable AutoCmb';
                this.autoCmbToggleButton.addEventListener('click', () => {
                    this.toggleAutoCmbFeature(this.autoCmbToggleButton, this.fightSelect.value);
                });
                topBar.appendChild(this.autoCmbToggleButton);
            }

            const badge_field_fp_reduction = IdlePixelPlus.getVar("badge_field_fp_reduction", "int");
            if (badge_field_fp_reduction === 0){
                this.locationDict['field'].fp = 400;
            }
        }

        toggleAutoCmbFeature(button, fightOption) {
            this.autoCmbEnabled = !this.autoCmbEnabled;
            button.textContent = this.autoCmbEnabled ? 'Disable AutoCmb' : 'Enable AutoCmb';

            if (this.autoCmbEnabled) {
                this.processAutoCmb();
            }

        }

        async processAutoCmb() {
            const fightOption = this.fightSelect.value;
            const location = this.fightDict[fightOption];

            if (this.autoCmbEnabled) {
                // console.log(`Processing auto combat, location: ${location}, fightOption: ${fightOption}`);
                const zoneFpCost = this.locationDict[location].fp;
                const zoneEnergyCost = this.locationDict[location].energy;

                const rareMonsterPotion = IdlePixelPlus.getVar("rare_monster_potion", "int");
                const rareMonsterPotionTimer = IdlePixelPlus.getVar("rare_monster_potion_timer", "int");
                const superRareMonsterPotion = IdlePixelPlus.getVar("super_rare_monster_potion", "int");
                const superRareMonsterPotionTimer = IdlePixelPlus.getVar("super_rare_monster_potion_timer", "int");

                const potionType = (location == "northern_field" || location == "mansion" || location == "beach") ? superRareMonsterPotion : rareMonsterPotion;
                const potionTimer = (location == "northern_field" || location == "mansion" || location == "beach") ? superRareMonsterPotionTimer : rareMonsterPotionTimer;

                const energy = IdlePixelPlus.getVar("energy", "int");
                const fightPoints = IdlePixelPlus.getVar("fight_points", "int");
                const maxFightPoints = IdlePixelPlus.getVar("max_fight_points", "int");

                const numberOfFights = Math.floor(fightPoints / zoneFpCost);
                const maxPossibleFights = Math.floor(maxFightPoints / zoneFpCost);
                // console.log(`Number of Fights: ${numberOfFights}`);
                // console.log(`Max Possible Fights: ${maxPossibleFights}`);

                if (numberOfFights * zoneEnergyCost > energy) {
                    this.autoCmbToggleButton.textContent = 'Enable AutoCmb';
                    this.autoCmbToggleButton.title = 'Insufficient energy.';
                    this.autoCmbEnabled = false;
                    // console.log("Insufficient energy");
                    return;
                }

                if (fightPoints < zoneFpCost) {
                    setTimeout(() => {
                        this.processAutoCmb();
                    }, 5000);
                    return;
                }

                let needPot = fightOption !== location;
                let drinkPot = false;

                if (needPot) {
                    if (potionTimer > 2) {
                        // console.log("Potion already active")
                    } else {
                        if (potionType <= 0 && potionTimer > 0) {
                            // If there are no potions available and the timer of said potion is > 0, meaning one is active
                            this.autoCmbToggleButton.textContent = 'Enable AutoCmb';
                            this.autoCmbToggleButton.title = 'Out of monster select potions';
                            this.autoCmbEnabled = false;
                            console.log("Out of monster select potions");
                            return;
                        }

                        if ((fightPoints === maxFightPoints || numberOfFights > maxPossibleFights) && potionTimer <= 0) {
                            // console.log("Conditions met to drink potion");
                            // console.log("Fight points == Max Fight Points: ", fightPoints === maxFightPoints);
                            // console.log("numberOfFights > Max Possible Fights: ", numberOfFights > maxPossibleFights);
                            // console.log("Rare Monster Potion Timer <= 0: ", potionTimer <= 0);
                            drinkPot = true;
                        } else if (potionTimer < 2 && potionTimer > 0) {
                            // console.log("Potion about to time out")
                        } else {
                            // console.log("Waiting until full fp to pot");
                            setTimeout(() => {
                                this.processAutoCmb();
                            }, 10000);
                            return;
                        }
                    }
                }

                await this.autoFighter(numberOfFights, location, fightOption, drinkPot);
                this.processAutoCmb();
            }
        }

        async autoFighter(numberOfFights, location, fightOption, drinkPot) {
            const printMonsterVars = false;
            let rareMonsterPotionTimer = IdlePixelPlus.getVar("rare_monster_potion_timer", "int");
            let superRareMonsterPotionTimer = IdlePixelPlus.getVar("super_rare_monster_potion_timer", "int");

            let potionTimer = (location == "northern_field" || location == "mansion" || location == "beach") ? superRareMonsterPotionTimer : rareMonsterPotionTimer;
            // console.log(numberOfFights + ", " + location + ", " + fightOption)
            // magic_ring_equipped

            // Fight loop
            let fightLoop = true;

            for (let fight = 0; fight < numberOfFights; fight++) {
                if (fightLoop){
                    if (drinkPot && fight == 0 && potionTimer <= 0){
                        // console.log("DrinkPot is True");
                        const potMonster = fightOption.replace(/^blood_/, "");
                        if (location == "northern_field" || location == "mansion" || location == "beach"){
                            IdlePixelPlus.sendMessage(`DRINK_SUPER_SELECT_POTION=${potMonster}`);
                        } else{
                            IdlePixelPlus.sendMessage(`DRINK_SELECT_POTION=${potMonster}`);
                        }
                    }
                    console.log(`Fight number: ${fight}`);
                    let drankLootPot = false;
                    if (this.autoCmbEnabled) {

                        // Set the combat area and start fight
                        Combat.modal_area_last_selected = location;
                        IdlePixelPlus.sendMessage(`START_FIGHT=${location}`);

                        // Wait for combat to start via panel visibility
                        while (document.getElementById('panel-combat-canvas').style.display === 'none') {
                            await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100ms
                        }

                        let fireCooldown = 0;
                        let reflectCooldown = 0;
                        let firstLoop = true;
                        let style;
                        // In combat loop
                        while (document.getElementById('panel-combat-canvas').style.display !== 'none') {
                            let monsterName = IdlePixelPlus.getVar("monster_name", "str");
                            let monsterSpecialMove = IdlePixelPlus.getVar("monster_special_move", "str");
                            let monsterSpecialSpeed = IdlePixelPlus.getVarOrDefault("monster_special_speed", 0, "int");
                            let monsterPause = IdlePixelPlus.getVar("monster_pause", "int");
                            let monsterHp = IdlePixelPlus.getVar("monster_hp", "str");

                            if (firstLoop){
                                const mageMin = this.mageMinHit();
                                if (mageMin >= monsterHp){
                                    style = this.equipPlayer(location, fightOption, true)
                                } else{
                                    style = this.equipPlayer(location, fightOption)
                                }
                                firstLoop = false;
                            }

                            let castFire = true;
                            if (location == "beach"){
                                castFire = false;
                            }
                            if (monsterName.includes("gem_goblin") && drankLootPot == false){
                                const lootPots = IdlePixelPlus.getVar("combat_loot_potion", "int");
                                if (lootPots > 0){
                                    IdlePixelPlus.sendMessage(`BREWING_DRINK_COMBAT_LOOT_POTION`);
                                }
                                drankLootPot = true;
                            }
                            if (monsterName == "yeti"){
                                castFire = false;
                                let playerFrozen = IdlePixelPlus.getVarOrDefault("player_frozen", 0, "int");
                                if (monsterSpecialSpeed > 0){
                                    reflectCooldown = this.castSpell('reflect');
                                }
                                if (playerFrozen > 0){
                                    castFire = true;
                                }
                            }
                            // Figure out how to fight the current monster
                            if (monsterSpecialMove == "POKE" || monsterSpecialMove == "FIRE_WITCH" || monsterSpecialMove == "ICE_WITCH" || monsterName == "ICE_HAWK" && monsterSpecialSpeed == 5 || monsterName == "reaper"  && monsterPause == 1 || monsterName == "shark"){
                                reflectCooldown = this.castSpell('reflect');
                            }

                            // Need to run this to get current fireCooldown
                            if (castFire){
                                fireCooldown = this.castSpell('fire');
                            }

                            // if fire on cooldown and in mage gear, switch out
                            // console.log(`fireCooldown: ${fireCooldown}, style: ${style}, location: ${location}`);

                            if (fireCooldown > 0 && style == "magic" || !castFire && style == "magic"){
                                // console.log("Style switching to melee");
                                style = this.equipPlayer(location, fightOption)
                            } else if (fireCooldown <= 0 && style != "magic" && castFire) {
                                // console.log("Style switching to magic");
                                style = this.equipPlayer(location, fightOption, true);
                                // fireCooldown = this.castSpell('fire');
                            }

                            if (printMonsterVars){
                                let monsterAccuracy = IdlePixelPlus.getVar("monster_accuracy", "str");
                                let monsterAttack = IdlePixelPlus.getVar("monster_attack", "str");
                                let monsterDefence = IdlePixelPlus.getVar("monster_defence", "str");
                                let monsterFrozen = IdlePixelPlus.getVar("monster_frozen", "str");
                                // let monsterHp = IdlePixelPlus.getVar("monster_hp", "str");
                                let monsterInvisible = IdlePixelPlus.getVar("monster_invisible", "str");
                                let monsterMaxHp = IdlePixelPlus.getVar("monster_max_hp", "str");
                                let monsterMegaShiny = IdlePixelPlus.getVar("monster_mega_shiny", "str");
                                // let monsterName = IdlePixelPlus.getVar("monster_name", "str");// Moved to top
                                // let monsterPause = IdlePixelPlus.getVar("monster_pause", "str");
                                let monsterShiny = IdlePixelPlus.getVar("monster_shiny", "str");
                                // let monsterSpecialMove = IdlePixelPlus.getVar("monster_special_move", "str");
                                // let monsterSpecialSpeed = IdlePixelPlus.getVar("monster_special_speed", "str");
                                let monsterSpeed = IdlePixelPlus.getVar("monster_speed", "str");
                                let monsterUnkillable = IdlePixelPlus.getVar("monster_unkillable", "str");
                                console.log(`monsterAccuracy: ${monsterAccuracy}, monsterAttack: ${monsterAttack}, monsterDefence: ${monsterDefence}, monsterFrozen: ${monsterFrozen}, monsterHp: ${monsterHp}, monsterInvisible: ${monsterInvisible}, monsterMaxHp: ${monsterMaxHp}, monsterMegaShiny: ${monsterMegaShiny}, monsterName: ${monsterName}, monsterPause: ${monsterPause}, monsterShiny: ${monsterShiny}, monsterSpecialMove: ${monsterSpecialMove}, monsterSpecialSpeed: ${monsterSpecialSpeed}, monsterSpeed: ${monsterSpeed}, monsterUnkillable: ${monsterUnkillable}`);
                            }

                            rareMonsterPotionTimer = IdlePixelPlus.getVar("rare_monster_potion_timer", "int");
                            superRareMonsterPotionTimer = IdlePixelPlus.getVar("super_rare_monster_potion_timer", "int");

                            potionTimer = (location == "northern_field" || location == "mansion" || location == "beach") ? superRareMonsterPotionTimer : rareMonsterPotionTimer;

                            if (this.checkPotionExpiry(potionTimer, location, fightOption, fight)) {
                                // console.log("Rare monster potion expiring soon");
                                fightLoop = false;
                                break;
                            }


                            // Repeat combat loop
                            await new Promise(resolve => setTimeout(resolve, 200)); // Check every 400ms

                        }
                    }
                }
            }
        }

        checkPotionExpiry(potionTimer, location, fightOption, fight) {
            if (potionTimer <= 1 && fightOption != location && fight > 0) {
                // console.log("Rare monster potion expiring soon");
                return true; // Indicate that the check passed and potentially break out of the loop
            }
            return false; // Indicate that the check did not pass
        }

        castSpell(spellName) {
            let cooldown = IdlePixelPlus.getVar(`${spellName}_cooldown`, "int");
            if (cooldown == 0) {
                Magic.cast_spell(this, spellName);
            }
            cooldown = IdlePixelPlus.getVar(`${spellName}_cooldown`, "int");
            return cooldown;
            // If there's a cooldown, the function simply returns without casting
        }

        mageMinHit() {
            const fire_upgrade_spellscroll_learnt = IdlePixelPlus.getVarOrDefault("fire_upgrade_spellscroll_learnt", 0, "int");
            const magic_ring_equipped = IdlePixelPlus.getVarOrDefault("magic_ring_equipped", 0, "int");
            let minHit;

            if (!fire_upgrade_spellscroll_learnt) {
                // If not learnt, minHit is 0
                minHit = 0;
            } else if (fire_upgrade_spellscroll_learnt && !magic_ring_equipped) {
                // If learnt and magic ring not equipped, minHit is 6
                minHit = 6;
            } else {
                // Else, implying learnt and ring is equipped, minHit is 15
                minHit = 15;
            }

            return minHit;
        }

        findBestArmour(armour) {
            let bestItems = [];
            let equipFlags = {}; // To store if the best item is already equipped

            for (let category in armour) {
                let bestItem = null;
                let isEquipped = false; // Assume not equipped by default
                let maxIndex = Math.max(...Object.keys(armour[category]).map(index => parseInt(index)));

                for (let i = maxIndex; i >= 0; i--) {
                    if (armour[category].hasOwnProperty(i)) {
                        let currentItem = armour[category][i];
                        let armourPiece = IdlePixelPlus.getVarOrDefault(currentItem, 0, "int");

                        if (armourPiece > 0) {
                            bestItem = currentItem;
                            break; // Found the best item available in inventory
                        } else {
                            let equippedItem = IdlePixelPlus.getVar(category, "str");
                            if (equippedItem === currentItem) {
                                bestItem = currentItem;
                                isEquipped = true; // Item is equipped
                                break; // Found the best item and it's equipped
                            }
                        }
                    }
                }

                if (bestItem) {
                    bestItems.push(bestItem);
                    equipFlags[category] = isEquipped; // Store whether the best item is equipped
                }
            }

            return { bestItems, equipFlags };
        }


        findBestWeapon(weapons, style) {
            let bestWeapon = null;
            let isEquipped = false; // Default to not equipped

            if (weapons[style]) {
                let maxIndex = Math.max(...Object.keys(weapons[style]).map(index => parseInt(index)));

                for (let i = maxIndex; i >= 0; i--) {
                    if (weapons[style].hasOwnProperty(i)) {
                        let currentWeapon = weapons[style][i];
                        let weaponCount = IdlePixelPlus.getVarOrDefault(currentWeapon, 0, "int");

                        if (weaponCount > 0) {
                            bestWeapon = currentWeapon;
                            break; // Found the best weapon available in inventory
                        } else {
                            let equippedWeapon = IdlePixelPlus.getVar("weapon", "str");
                            if (equippedWeapon === currentWeapon) {
                                bestWeapon = currentWeapon;
                                isEquipped = true; // Weapon is equipped
                                break; // Found the best weapon and it's equipped
                            }
                        }
                    }
                }
            }

            return { bestWeapon, isEquipped };
        }


        equipPlayer(location, monster = "", mage = false) {
            let armour = JSON.parse(JSON.stringify(this.armourDict));
            let weapons = JSON.parse(JSON.stringify(this.weaponDict));
            let style = "melee";
            let arrows = "wooden_arrows";
            let ringOfLight = IdlePixelPlus.getVarOrDefault("ring_of_light_equipped", 0, "int");
            let magic_ring_equipped = IdlePixelPlus.getVarOrDefault("magic_ring_equipped", 0, "int");

            // console.log(`In equipPlayer, location: ${location}, monster: ${monster}, mage: ${mage}`);

            if (magic_ring_equipped == 1){
                mage = false;
            }

            if (mage) {
                style = "magic";
                for (let key in this.mageArmourDict) {
                    if (this.mageArmourDict.hasOwnProperty(key)) {
                        armour[key] = { ...armour[key], ...this.mageArmourDict[key] };
                    }
                }
            } else if (monster.includes("forest_ent") && magic_ring_equipped == 1) {
                for (let key in this.entWeaponDict) {
                    if (this.entWeaponDict.hasOwnProperty(key)) {
                        weapons[key] = { ...weapons[key], ...this.entWeaponDict[key] };
                    }
                }
            } else if (location === "cave" && ringOfLight === 0) {
                for (let key in this.caveArmourDict) {
                    if (this.caveArmourDict.hasOwnProperty(key)) {
                        weapons[key] = { ...weapons[key], ...this.caveArmourDict[key] };
                    }
                }
            } else if (location === "volcano") {
                const ice_arrows = IdlePixelPlus.getVarOrDefault("ice_arrows", 0, "int");
                if (ice_arrows > 20) {
                    style = "range";
                    arrows = "ice_arrows";
                }
            } else if (location === "northern_field") {
                for (let key in this.coldArmourDict) {
                    if (this.coldArmourDict.hasOwnProperty(key)) {
                        armour[key] = { ...armour[key], ...this.coldArmourDict[key] };
                    }
                }
                const fire_arrows = IdlePixelPlus.getVarOrDefault("fire_arrows", 0, "int");
                if (fire_arrows > 20) {
                    style = "range";
                    arrows = "fire_arrows";
                }
            } else if (location === "mansion") {
                for (let key in this.mansionWeaponDict) {
                    if (this.mansionWeaponDict.hasOwnProperty(key)) {
                        weapons[key] = { ...weapons[key], ...this.mansionWeaponDict[key] };
                    }
                }
            } else if (location === "beach") {
                for (let key in this.beachArmourDict) {
                    if (this.beachArmourDict.hasOwnProperty(key)) {
                        armour[key] = { ...armour[key], ...this.beachArmourDict[key] };
                    }
                }
                if (monster === "puffer_fish") {
                    for (let key in this.pufferWeaponDict) {
                        if (this.pufferWeaponDict.hasOwnProperty(key)) {
                            weapons[key] = { ...weapons[key], ...this.pufferWeaponDict[key] };
                        }
                    }
                } else {
                    for (let key in this.beachWeaponDict) {
                        if (this.beachWeaponDict.hasOwnProperty(key)) {
                            weapons[key] = { ...weapons[key], ...this.beachWeaponDict[key] };
                        }
                    }
                }
            }

            const { bestItems, equipFlags } = this.findBestArmour(armour);
            const { bestWeapon, isWeaponEquipped } = this.findBestWeapon(weapons, style);

            bestItems.forEach((armourItem, index) => {
                let category = Object.keys(armour)[index]; // Corrected to fetch the category from original armour dict
                if (!equipFlags[category]) { // Check if not already equipped
                    IdlePixelPlus.sendMessage("EQUIP=" + armourItem);
                }
            });

            if (!isWeaponEquipped && bestWeapon) { // Check if the best weapon is not already equipped
                IdlePixelPlus.sendMessage("EQUIP=" + bestWeapon);
            }

            if (style === "range") { // For arrows, check if not already equipped
                let equippedArrows = IdlePixelPlus.getVar("arrows", "str");
                if (equippedArrows !== arrows) {
                    IdlePixelPlus.sendMessage("EQUIP=" + arrows);
                }
            }

            // console.log(`Equipped style: ${style}, Best Armour: ${bestItems.join(", ")}, Best Weapon: ${bestWeapon}, Arrows: ${arrows}`);
            return style;
        }

    }

    const plugin = new CombatBot();
    IdlePixelPlus.registerPlugin(plugin);

})();

