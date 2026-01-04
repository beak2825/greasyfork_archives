// ==UserScript==
// @name         Melvor Idle Instant Respawn Monster
// @namespace    Alee
// @version      1.0
// @description  Speed up respawn time any monster
// @author       Alee
// @match        https://*.melvoridle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419721/Melvor%20Idle%20Instant%20Respawn%20Monster.user.js
// @updateURL https://update.greasyfork.org/scripts/419721/Melvor%20Idle%20Instant%20Respawn%20Monster.meta.js
// ==/UserScript==

function loadNewEnemy() {
    if (!idleChecker(CONSTANTS.skill.Hitpoints)) {
        isInCombat = true;
        newEnemyLoading = true;
        updateGameTitle();
        updateNav();
        $("#skill-nav-name-9").attr("class", "nav-main-link-name text-success");
        if (items[equippedItems[CONSTANTS.equipmentSlot.Weapon]].type === "Ranged Weapon" || items[equippedItems[CONSTANTS.equipmentSlot.Weapon]].isRanged) {
            $("#skill-nav-name-" + CONSTANTS.skill.Ranged).attr("class", "nav-main-link-name text-success");
        }
        if (items[equippedItems[CONSTANTS.equipmentSlot.Weapon]].isMagic) {
            $("#skill-nav-name-" + CONSTANTS.skill.Magic).attr("class", "nav-main-link-name text-success");
        } else {
            $("#skill-nav-name-" + (attackStyle + 6)).attr("class", "nav-main-link-name text-success");
        }
        resetEnemyScreen();
        let interval = 10;
        if (isGolbinRaid)
            interval /= 2;
        $("#combat-enemy-options").html('<p><button type="button" class="btn btn-lg btn-warning m-1" id="combat-btn-run" onClick="stopCombat(false, true, true); showMap();"><img class="nav-img" src="https://cdn.melvor.net/core/v018/assets/media/skills/combat/run.svg">Run / Area Select</button></p>');
        $("#combat-enemy-img").append('<div class="combat-enemy-img-spinner spinner-border text-danger" role="status"></div>');
        enemyFinder = setTimeout(function() {
            $("#combat-player-hitpoints-current").text(combatData.player.hitpoints);
            $("#combat-player-hitpoints-current-1").text(combatData.player.hitpoints);
            let enemyTrait = "";
            let enemyMediaAdjustment = "";
            let enemy;
            if (forcedEnemy === null)
                enemy = combatAreas[selectedCombatArea].monsters[Math.floor(Math.random() * combatAreas[selectedCombatArea].monsters.length)];
            else
                enemy = forcedEnemy;
            combatData.enemy.baseDamageReduction = 0;
            combatData.enemy.damageReduction = 0;
            if (isDungeon) {
                if (selectedDungeon === 15 && dungeonCount < 20) {
                    let enemySelection = [];
                    for (let i = 0; i < MONSTERS.length; i++) {
                        if (getMonsterCombatLevel(i, true) >= 165 && getMonsterCombatLevel(i, true) <= 677 && i !== 134 && i !== 135 && i !== 136)
                            enemySelection.push(i);
                    }
                    let enemyToChoose = Math.floor(Math.random() * enemySelection.length);
                    enemy = enemySelection[enemyToChoose];
                    enemyTrait = "Afflicted ";
                    combatData.enemy.damageReduction += 20;
                    combatData.enemy.baseDamageReduction += 20;
                }
                if (selectedDungeon === 15 && dungeonCount < 21)
                    enemyMediaAdjustment = "filter: saturate(15%);";
            }
            enemyInCombat = enemy;
            monsterStats[enemy].stats[8]++;
            combatData.enemy.id = enemy;
            if (!isGolbinRaid)
                combatData.enemy.attackType = MONSTERS[enemy].attackType;
            else
                combatData.enemy.attackType = Math.floor(Math.random() * 3);
            if (!isGolbinRaid) {
                combatData.enemy.maxHitpoints = MONSTERS[enemy].hitpoints * numberMultiplier;
                combatData.enemy.hitpoints = MONSTERS[enemy].hitpoints * numberMultiplier;
                combatData.enemy.attackLevel = MONSTERS[enemy].attackLevel;
                combatData.enemy.strengthLevel = MONSTERS[enemy].strengthLevel;
                combatData.enemy.defenceLevel = MONSTERS[enemy].defenceLevel;
                combatData.enemy.rangedLevel = MONSTERS[enemy].rangedLevel;
                combatData.enemy.magicLevel = MONSTERS[enemy].magicLevel;
                combatData.enemy.attackBonus = MONSTERS[enemy].attackBonus;
                combatData.enemy.strengthBonus = MONSTERS[enemy].strengthBonus;
                combatData.enemy.defenceBonus = MONSTERS[enemy].defenceBonus;
                combatData.enemy.attackBonusRanged = MONSTERS[enemy].attackBonusRanged;
                combatData.enemy.strengthBonusRanged = MONSTERS[enemy].strengthBonusRanged;
                combatData.enemy.defenceBonusRanged = MONSTERS[enemy].defenceBonusRanged;
                combatData.enemy.attackBonusMagic = MONSTERS[enemy].attackBonusMagic;
                combatData.enemy.damageBonusMagic = MONSTERS[enemy].damageBonusMagic;
                combatData.enemy.defenceBonusMagic = MONSTERS[enemy].defenceBonusMagic;
            } else {
                combatData.enemy.maxHitpoints = getGolbinLevel(true) * numberMultiplier;
                combatData.enemy.hitpoints = combatData.enemy.maxHitpoints;
                combatData.enemy.attackLevel = getGolbinLevel();
                combatData.enemy.strengthLevel = getGolbinLevel();
                combatData.enemy.defenceLevel = getGolbinLevel();
                combatData.enemy.rangedLevel = getGolbinLevel();
                combatData.enemy.magicLevel = getGolbinLevel();
                combatData.enemy.attackBonus = getGolbinBonuses();
                combatData.enemy.strengthBonus = getGolbinBonuses();
                combatData.enemy.defenceBonus = getGolbinBonuses();
                combatData.enemy.attackBonusRanged = getGolbinBonuses();
                combatData.enemy.strengthBonusRanged = getGolbinBonuses();
                combatData.enemy.defenceBonusRanged = getGolbinBonuses();
                combatData.enemy.attackBonusMagic = getGolbinBonuses();
                combatData.enemy.damageBonusMagic = 0;
                combatData.enemy.defenceBonusMagic = 0;
                combatData.enemy.magicStrengthBonus = getGolbinBonuses();
            }
            calculateEnemyAccuracy();
            calculateEnemyStrength();
            calculateEnemyDefence();
            if (isGolbinRaid)
                combatData.enemy.baseAttackSpeed = MONSTERS[enemy].attackSpeed / golbinModifier;
            else
                combatData.enemy.baseAttackSpeed = MONSTERS[enemy].attackSpeed;
            if (MONSTERS[enemy].damageReduction !== undefined) {
                combatData.enemy.damageReduction += MONSTERS[enemy].damageReduction;
                combatData.enemy.baseDamageReduction += MONSTERS[enemy].damageReduction;
            }
            updateEnemyAttackSpeed();
            if (!isGolbinRaid)
                $("#combat-enemy-name").text(enemyTrait + MONSTERS[enemy].name);
            else
                $("#combat-enemy-name").text(getGolbinName());
            $("#combat-enemy-hitpoints-max").text(formatNumber(combatData.enemy.maxHitpoints));
            $("#combat-enemy-hitpoints-current").text(formatNumber(combatData.enemy.maxHitpoints));
            $("#combat-enemy-hitpoints-bar").css("width", "100%");
            $("#combat-enemy-attack-speed").text(MONSTERS[enemy].attackSpeed / 1000 + "s");
            $("#combat-enemy-attack-bonus").text(numberWithCommas(combatData.enemy.maximumAttackRoll));
            $("#combat-enemy-strength-bonus").text(numberWithCommas(combatData.enemy.maximumStrengthRoll));
            $("#combat-enemy-defence-evasion").text(numberWithCommas(combatData.enemy.maximumDefenceRoll));
            $("#combat-enemy-ranged-evasion").text(numberWithCommas(combatData.enemy.maximumRangedDefenceRoll));
            $("#combat-enemy-magic-evasion").text(numberWithCommas(combatData.enemy.maximumMagicDefenceRoll));
            $("#combat-enemy-damage-reduction").text(numberWithCommas(combatData.enemy.damageReduction + "%"));
            $("#combat-enemy-attack-level").text(combatData.enemy.attackLevel);
            $("#combat-enemy-strength-level").text(combatData.enemy.strengthLevel);
            $("#combat-enemy-defence-level").text(combatData.enemy.defenceLevel);
            $("#combat-enemy-ranged-level").text(combatData.enemy.rangedLevel);
            $("#combat-enemy-magic-level").text(combatData.enemy.magicLevel);
            $("#combat-enemy-combat-level").text(getMonsterCombatLevel(enemy));
            if (tooltipInstances.enemyAttackType !== undefined) {
                tooltipInstances.enemyAttackType.forEach((instance)=>{
                    instance.destroy();
                }
                );
                tooltipInstances.enemyAttackType.length = 0;
            } else
                tooltipInstances.enemyAttackType = [];
            if (combatData.enemy.attackType === CONSTANTS.attackType.Melee) {
                $("#combat-enemy-attack-type").attr("src", "assets/media/skills/combat/attack.svg");
                const tooltip = tippy("#combat-enemy-attack-type", {
                    content: "Melee",
                    placement: "bottom",
                    interactive: false,
                    animation: false,
                });
                tooltipInstances.enemyAttackType = tooltipInstances.enemyAttackType.concat(tooltip);
            } else if (combatData.enemy.attackType === CONSTANTS.attackType.Ranged) {
                $("#combat-enemy-attack-type").attr("src", "assets/media/skills/ranged/ranged.svg");
                const tooltip = tippy("#combat-enemy-attack-type", {
                    content: "Ranged",
                    placement: "bottom",
                    interactive: false,
                    animation: false,
                });
                tooltipInstances.enemyAttackType = tooltipInstances.enemyAttackType.concat(tooltip);
            } else if (combatData.enemy.attackType === CONSTANTS.attackType.Magic) {
                $("#combat-enemy-attack-type").attr("src", "assets/media/skills/magic/magic.svg");
                const tooltip = tippy("#combat-enemy-attack-type", {
                    content: "Magic",
                    placement: "bottom",
                    interactive: false,
                    animation: false,
                });
                tooltipInstances.enemyAttackType = tooltipInstances.enemyAttackType.concat(tooltip);
            }
            combatData.enemy.hasSpecialAttack = false;
            combatData.enemy.specialAttackID = null;
            combatData.enemy.specialAttackChances = [];
            let specialAttack = "";
            $("#combat-enemy-special-attack").addClass("d-none");
            if (MONSTERS[enemy].hasSpecialAttack) {
                combatData.enemy.hasSpecialAttack = true;
                combatData.enemy.specialAttackID = MONSTERS[enemy].specialAttackID;
                for (let i = 0; i < combatData.enemy.specialAttackID.length; i++) {
                    if (MONSTERS[enemy].overrideSpecialChances !== undefined) {
                        combatData.enemy.specialAttackChances.push(MONSTERS[enemy].overrideSpecialChances[i]);
                        specialAttack += "<br><strong>" + enemySpecialAttacks[combatData.enemy.specialAttackID[i]].name + "</strong> (" + MONSTERS[enemy].overrideSpecialChances[i] + "%) - " + enemySpecialAttacks[combatData.enemy.specialAttackID[i]].description;
                    } else {
                        combatData.enemy.specialAttackChances.push(enemySpecialAttacks[combatData.enemy.specialAttackID[i]].chance);
                        specialAttack += "<br><strong>" + enemySpecialAttacks[combatData.enemy.specialAttackID[i]].name + "</strong> (" + enemySpecialAttacks[combatData.enemy.specialAttackID[i]].chance + "%) - " + enemySpecialAttacks[combatData.enemy.specialAttackID[i]].description;
                    }
                }
                $("#combat-enemy-special-attack").removeClass("d-none");
            }
            if (MONSTERS[enemy].hasPassive) {
                combatData.enemy.hasPassive = true;
                combatData.enemy.passiveID = MONSTERS[enemy].passiveID;
                specialAttack += `<br><h5 class="font-w700 font-size-sm text-warning m-1 mb-2 mt-3">Enemy Passive</h5><h5 class="font-w400 font-size-sm text-combat-smoke m-1 mb-2">`;
                for (let i = 0; i < MONSTERS[enemy].passiveID.length; i++) {
                    specialAttack += "<br><strong>" + combatPassive[MONSTERS[enemy].passiveID[i]].name + "</strong> (" + combatPassive[MONSTERS[enemy].passiveID[i]].chance + "%) - " + combatPassive[MONSTERS[enemy].passiveID[i]].description;
                }
                specialAttack += "</h5>";
                $("#combat-enemy-special-attack").removeClass("d-none");
            }
            $("#combat-enemy-special-attack-desc").html(specialAttack);
            combatData.enemy.attackSpeedDebuff = 0;
            combatData.enemy.attackSpeedDebuffTurns = 0;
            combatData.enemy.isBleeding = false;
            combatData.enemy.stunned = false;
            combatData.enemy.stunTurns = 0;
            updateEnemyChanceToHit();
            updatePlayerSpecialWeapon();
            updateEnemyMaxHit();
            updateTooltips();
            let monsterMedia = getMonsterMedia(enemy);
            if (isGolbinRaid) {
                if ((golbinWave + 1) % 10 === 0 && golbinEnemyCount + 1 >= Math.floor(2 + golbinWave * 0.25))
                    monsterMedia = "assets/media/monsters/golbin-boss.svg";
                else
                    monsterMedia = "assets/media/monsters/golbin-" + Math.floor(Math.random() * 21) + ".svg";
            }
            $("#combat-enemy-img").html("");
            if ((MONSTERS[enemy].isBoss && selectedDungeon !== 15) || (isDungeon && dungeonCount === DUNGEONS[selectedDungeon].monsters.length - 1) || (isDungeon && selectedDungeon === 15 && dungeonCount >= DUNGEONS[selectedDungeon].monsters.length - 3))
                $("#combat-enemy-img").append('<img class="combat-enemy-img dungeon-boss" src="' + monsterMedia + '">');
            else
                $("#combat-enemy-img").append('<img class="combat-enemy-img" src="' + monsterMedia + '">');
            if (MONSTERS[enemy].description !== undefined) {
                $("#combat-enemy-img").append('<br><span class="text-danger">' + MONSTERS[enemy].description + "</span>");
            }
            if (enemyMediaAdjustment !== "")
                $("#combat-enemy-img").prop("style", enemyMediaAdjustment);
            else
                $("#combat-enemy-img").prop("style", "");
            let combatAreaVisual = [0, 0];
            if (!isDungeon) {
                if (enemy !== 139) {
                    selectedCombatArea = findEnemyArea(enemy, true);
                    combatAreaVisual = findEnemyArea(enemy, false);
                    if (combatAreaVisual[0] === 0) {
                        $("#combat-dungeon-name").text(combatAreas[combatAreaVisual[1]].areaName);
                        $("#combat-dungeon-img").attr("src", combatAreas[combatAreaVisual[1]].media);
                    } else if (combatAreaVisual[0] === 1) {
                        $("#combat-dungeon-name").text(slayerAreas[combatAreaVisual[1]].areaName);
                        $("#combat-dungeon-img").attr("src", slayerAreas[combatAreaVisual[1]].media);
                        $("#combat-area-effect").removeClass("d-none");
                        if (slayerAreas[combatAreaVisual[1]].areaEffect) {
                            $("#combat-area-effect").text(slayerAreas[combatAreaVisual[1]].areaEffectDescription);
                            $("#combat-area-effect").attr("class", "font-w400 font-size-sm text-danger ml-2");
                        } else {
                            $("#combat-area-effect").text("No Area Effect");
                            $("#combat-area-effect").attr("class", "font-w400 font-size-sm text-success ml-2");
                        }
                    }
                } else {
                    selectedCombatArea = "Unknown Location";
                    $("#combat-dungeon-name").text("Unknown Location");
                }
            }
            newEnemyLoading = false;
            updatePlayerStats();
            updatePlayerChanceToHit();
            updateCombatInfoIcons();
            if (selectedDungeon !== 15 || (selectedDungeon === 15 && dungeonCount < 20))
                startCombat();
            else
                pauseDungeon();
        }, interval);
    }
}