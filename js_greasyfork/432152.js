// ==UserScript==
// @name		Melvor Snippets
// @namespace	http://tampermonkey.net/
// @version		0.0.18
// @description	Collection of various snippets
// @grant		none
// @author		GMiclotte
// @include		https://melvoridle.com/*
// @include		https://*.melvoridle.com/*
// @exclude		https://melvoridle.com/index.php
// @exclude		https://*.melvoridle.com/index.php
// @exclude		https://wiki.melvoridle.com/*
// @exclude		https://*.wiki.melvoridle.com/*
// @inject-into page
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/432152/Melvor%20Snippets.user.js
// @updateURL https://update.greasyfork.org/scripts/432152/Melvor%20Snippets.meta.js
// ==/UserScript==

((main) => {
    const script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {

function startSnippets() {

window.snippet = {
    name: '',
    log: (...args) => console.log('Snippets:', ...args),
    start: () => snippet.log(`Loading ${snippet.name}.`),
    end: () => snippet.log(`Loaded ${snippet.name}.`),
};

// header end

/////////////////////////////////////
//AgilityObstacleBuildsRemaining.js//
/////////////////////////////////////
snippet.name = 'AgilityObstacleBuildsRemaining.js';
snippet.start();
// show agility obstacles that have been built less than 10 times
window.listObstaclesWithFewerThanTenBuilds = () => {
    agilityObstacleBuildCount.map((_, i) => i)
        .filter(i => agilityObstacleBuildCount[i] < 10)
        .map(i => agilityObstacles[i])
        .map(x => [x.category + 1, x.name]);
}
snippet.end();

///////////////////
//BankedHealth.js//
///////////////////
snippet.name = 'BankedHealth.js';
snippet.start();
// return total healing in bank
window.bankedHealth = () => {
    return items.filter(x => x.healsFor)
        .map(x => player.getFoodHealing(x) * combatManager.bank.getQty(x.id))
        .reduce((a, b) => a + b, 0);
}
snippet.end();

//////////////////
//DefensePure.js//
//////////////////
snippet.name = 'DefensePure.js';
snippet.start();
// Various Defense Pure Calculations
window.defensePure = {};

defensePure.defLvlToHPLvl = def => {
    const hpXP = exp.level_to_xp(10) + 1;
    const minDefXP = exp.level_to_xp(def) + 1;
    const maxDefXP = exp.level_to_xp(def + 1);
    const minHpXP = hpXP + minDefXP / 3;
    const maxHpXP = hpXP + maxDefXP / 3;
    const minHp = exp.xp_to_level(minHpXP) - 1;
    const maxHp = exp.xp_to_level(maxHpXP) - 1;
    return {min: minHp, max: maxHp};
}

defensePure.defLvlToCbLvl = def => {
    const hp = defensePure.defLvlToHPLvl(def);
    const att = 1, str = 1, ran = 1, mag = 1, pray = 1;
    const minBase = (def + hp.min + Math.floor(pray / 2)) / 4;
    const maxBase = (def + hp.max + Math.floor(pray / 2)) / 4;
    const melee = (att + str) * 1.3 / 8;
    const ranged = Math.floor(1.5 * ran) * 1.3 / 8;
    const magic = Math.floor(1.5 * mag) * 1.3 / 8;
    const best = Math.max(melee, ranged, magic);
    return {min: minBase + best, max: maxBase + best};
}

defensePure.lastHitOnly = (skillID, maxLevel = 1) => {
    if (skillXP[skillID] >= exp.level_to_xp(maxLevel + 1) - 1) {
        combatManager.stopCombat();
        return;
    }
    // swap weapon based on hp left
    let itemID;
    if (combatManager.enemy.hitpoints > 1) {
        if (skillID === Skills.Magic) {
            itemID = Items.Normal_Shortbow;
        } else {
            // melee or ranged
            itemID = Items.Staff_of_Air;
        }
    } else {
        if (skillID === Skills.Ranged) {
            itemID = Items.Iron_Throwing_Knife;
        } else if (skillID === Skills.Magic) {
            itemID = Items.Staff_of_Air;
        } else {
            // melee
            itemID = -1;
        }
    }
    if (player.equipment.slots.Weapon.item.id !== itemID) {
        if (itemID === -1) {
            player.unequipItem(0, 'Weapon');
        } else {
            player.equipItem(itemID, 0);
        }
    }
    // loop
    setTimeout(() => defensePure.lastHitOnly(skillID, maxLevel), 1000);
}
snippet.end();

/////////////////////////
//GetLocalisationKey.js//
/////////////////////////
snippet.name = 'GetLocalisationKey.js';
snippet.start();
// Get Localisation Key for a given string
window.getLocalisationKey = (text) => {
    const list = []
    for (const key in loadedLangJson) {
        for (const identifier in loadedLangJson[key]) {
            if (loadedLangJson[key][identifier] === text) {
                list.push({key: key, identifier: identifier});
            }
        }
    }
    return list;
}
snippet.end();

//////////////////////
//ListRaidUnlocks.js//
//////////////////////
snippet.name = 'ListRaidUnlocks.js';
snippet.start();
// list unlocked raid items
window.listCrateItems = (unlocked = true) =>
    RaidManager.crateItemWeights.filter(x =>
        unlocked === game.golbinRaid.ownedCrateItems.has(x.itemID)
    ).forEach(x =>
        snippet.log(items[x.itemID].name)
    );
// to list the ones you have unlocked:
// listCrateItems()
// to list the ones you haven't unlocked:
// listCrateItems(false)
snippet.end();

////////////////
//LootDrops.js//
////////////////
snippet.name = 'LootDrops.js';
snippet.start();
// Loot Drops
window.lootDrops = () => {
    const loot = combatManager.loot;
    // only loot when the loot table is full
    if (loot.drops.length < loot.maxLoot) {
        return;
    }
    // when the bank is full, update the bank cache
    const bankFull = bank.length === getMaxBankSpace();
    if (bankFull) {
        for (let i = 0; i < bank.length; i++) {
            bankCache[bank[i].id] = i;
        }
    }
    loot.drops = loot.drops.filter(drop => {
        const itemID = drop.item.id;
        if (bankFull) {
            // reject all items that aren't in the bank cache
            if (bankCache[itemID] === undefined) {
                return false;
            }
        }
        if (addItemToBank(itemID, drop.qty))
            game.stats.Combat.add(CombatStats.ItemsLooted, drop.qty);
        return false;
    });
}

// hook to player.rewardGPForKill, this runs on player death and is a relatively small method
eval(player.rewardGPForKill.toString().replaceAll(
    'this',
    'player',
).replace(
    'rewardGPForKill(){',
    'window.rewardGPForKill = () => {window.lootDrops();',
));

window.hookLootDrops = () => {
    if (player) {
        player.rewardGPForKill = window.rewardGPForKill;
    } else {
        setTimeout(window.hookLootDrops, 50);
    }
}

// window.hookLootDrops();
snippet.end();

//////////////////
//MasteryBars.js//
//////////////////
snippet.name = 'MasteryBars.js';
snippet.start();
// Add Mastery Bars
setInterval(() => {
    for (const id in SKILLS) {
        if (SKILLS[id].hasMastery) {
            if ($(`#skill-nav-mastery-${id} .progress-bar`)[0]) {
                $(`#skill-nav-mastery-${id} .progress-bar`)[0].style.width =
                    (MASTERY[id].pool / getMasteryPoolTotalXP(id)) * 100 + '%';
                if (MASTERY[id].pool < getMasteryPoolTotalXP(id)) {
                    $(`#skill-nav-mastery-${id}`)[0].style.setProperty('background', 'rgb(76,80,84)', 'important');
                    $(`#skill-nav-mastery-${id} .progress-bar`)[0].className = 'progress-bar bg-warning';
                } else {
                    $(`#skill-nav-mastery-${id}`)[0].style.setProperty('background', 'rgb(48,199,141)', 'success');
                    $(`#skill-nav-mastery-${id} .progress-bar`)[0].className = 'progress-bar bg-success';
                }
                const tip = $(`#skill-nav-mastery-${id}`)[0]._tippy;
                tip.setContent((Math.min(1, MASTERY[id].pool / getMasteryPoolTotalXP(id)) * 100).toFixed(2) + '%');
            } else {
                const skillItem = $(`#skill-nav-name-${id}`)[0].parentNode;
                skillItem.style.flexWrap = 'wrap';
                skillItem.style.setProperty('padding-top', '.25rem', 'important');
                const progress = document.createElement('div');
                const progressBar = document.createElement('div');
                progress.id = `skill-nav-mastery-${id}`;
                progress.className = 'progress active pointer-enabled';
                progress.style.height = '6px';
                progress.style.width = '100%';
                progress.style.margin = '.25rem 0rem';
                if (MASTERY[id].pool < getMasteryPoolTotalXP(id)) {
                    progress.style.setProperty('background', 'rgb(76,80,84)', 'important');
                    progressBar.className = 'progress-bar bg-warning';
                } else {
                    progress.style.setProperty('background', 'rgb(48,199,141)', 'success');
                    progressBar.className = 'progress-bar bg-success';
                }
                progressBar.style.width = (MASTERY[id].pool / getMasteryPoolTotalXP(id)) * 100 + '%';
                progress.appendChild(progressBar);
                skillItem.appendChild(progress);
                tippy($(`#skill-nav-mastery-${id}`)[0], {
                    placement: 'right',
                    content: ((MASTERY[id].pool / getMasteryPoolTotalXP(id)) * 100).toFixed(2) + '%',
                });
            }
        }
    }
}, 5000);
snippet.end();

///////////////////
//MasteryBuyer.js//
///////////////////
snippet.name = 'MasteryBuyer.js';
snippet.start();
// methods to buy base mastery levels
window.masteryBuyer = {
    poolXpPerItem: 500000,
};

masteryBuyer.availXp = (skillID, minPercent = 95) => {
    let minPool = MASTERY[skillID].xp.length * masteryBuyer.poolXpPerItem * minPercent / 100;
    return MASTERY[skillID].pool - minPool;
}

masteryBuyer.currentBase = (skillID) => {
    return Math.min(...MASTERY[skillID].xp.map((_, masteryID) => getMasteryLevel(skillID, masteryID)));
}

masteryBuyer.maxAffordableBase = (skillID, minPercent = 95) => {
    let xp = masteryBuyer.availXp(skillID, minPercent);
    // make bins with mastery levels
    let bins = [];
    for (let i = 0; i < 100; i++) {
        bins[i] = [];
    }
    MASTERY[skillID].xp.forEach((_, masteryID) => {
        let level = getMasteryLevel(skillID, masteryID);
        bins[level].push(masteryID);
    });
    // level one at a time
    let maxBase = 0;
    bins.forEach((x, i) => {
        if (i >= 99) {
            return;
        }
        if (x.length === 0) {
            return;
        }
        let xpRequired = (exp.level_to_xp(i + 1) - exp.level_to_xp(i)) * x.length;
        xp -= xpRequired;
        if (xp >= 0) {
            maxBase = i + 1;
            x.forEach(y => bins[i + 1].push(y));
        }
    });
    maxBase = maxBase > 99 ? 99 : maxBase;
    return maxBase;
}

masteryBuyer.increaseBase = (skillID, minPercent = 95, levelCap = 99) => {
    // buy until goal
    let goal = masteryBuyer.maxAffordableBase(skillID, minPercent);
    if (goal === 0) {
        goal = masteryBuyer.currentBase(skillID);
    }
    if (goal > levelCap) {
        goal = levelCap;
    }
    MASTERY[skillID].xp.forEach((_, masteryID) => {
        let level = getMasteryLevel(skillID, masteryID);
        if (level >= goal) {
            return;
        }
        masteryPoolLevelUp = goal - level;
        levelUpMasteryWithPool(skillID, masteryID);
    });
    // spend remainder on goal + 1
    const xpRequired = exp.level_to_xp(goal + 1) - exp.level_to_xp(goal);
    let count = Math.floor(masteryBuyer.availXp(skillID, minPercent) / xpRequired);
    masteryPoolLevelUp = 1;
    MASTERY[skillID].xp.forEach((_, masteryID) => {
        if (count === 0) {
            return;
        }
        let level = getMasteryLevel(skillID, masteryID);
        if (level > goal || level >= levelCap) {
            return;
        }
        count--;
        levelUpMasteryWithPool(skillID, masteryID);
    });
    // update total mastery
    updateTotalMastery(skillID);
}

masteryBuyer.overview = (minPercent = 95) => {
    Object.getOwnPropertyNames(SKILLS).forEach(skillID => {
        const skill = SKILLS[skillID];
        if (!skill.hasMastery) {
            return;
        }
        const maxBase = masteryBuyer.maxAffordableBase(skillID, minPercent);
        if (maxBase === 0) {
            return;
        }
        const currentBase = masteryBuyer.currentBase(skillID);
        snippet.log(`${skill.name}: ${currentBase} -> ${maxBase}`);
    });
}

masteryBuyer.remaining = (skillID, target = 99) => {
    let xp = 0;
    let xpTarget = exp.level_to_xp(target);
    MASTERY[skillID].xp.forEach(masteryXp => {
        xp += Math.max(0, xpTarget - masteryXp);
    });
    xp = Math.round(xp)
    snippet.log(formatNumber(xp))
    return xp
}
snippet.end();

///////////////////////
//PrintSynergyList.js//
///////////////////////
snippet.name = 'PrintSynergyList.js';
snippet.start();
// functions to print synergies per category (cb vs non-cb)
window.printSynergy = (x, y) => snippet.log('- [ ]',
    x.summoningID,
    parseInt(y),
    items[x.itemID].name,
    items[summoningItems[y].itemID].name,
    SUMMONING.Synergies[x.summoningID][y].description,
    SUMMONING.Synergies[x.summoningID][y].modifiers
);

window.printCombatSynergyList = () => {
    // get combat synergies
    summoningItems.filter(x => items[x.itemID].summoningMaxHit).map(x => {
        for (y in SUMMONING.Synergies[x.summoningID]) {
            printSynergy(x, y);
        }
    });
}

window.printNonCombatSynergyList = () => {
    // get non-combat synergies
    summoningItems.filter(x => !items[x.itemID].summoningMaxHit).map(x => {
        for (y in SUMMONING.Synergies[x.summoningID]) {
            printSynergy(x, y);
        }
    });
}
snippet.end();

/////////////////////
//QuickEquipCape.js//
/////////////////////
snippet.name = 'QuickEquipCape.js';
snippet.start();
// Quick Equip Max/Comp Cape
window.quickEquipSkillcape = (skill) => {
    const capes = [
        Items.Cape_of_Completion,
        Items.Max_Skillcape,
        skillcapeItems[skill],
    ];
    for (let i = 0; i < capes.length; i++) {
        const capeId = capes[i];
        if (player.equipment.checkForItemID(capeId)) {
            notifyPlayer(skill, `${items[capeId].name} is already equipped.`, "info");
            return;
        }
        const bankId = getBankId(capeId);
        if (bankId === -1) {
            continue;
        }
        if (!player.equipItem(capeId, player.selectedEquipmentSet)) {
            continue;
        }
        notifyPlayer(skill, `${items[capeId].name} Equipped.`, "success");
        if (skill === 0) {
            updateWCRates();
        }
        return;
    }
    notifyPlayer(skill, "There's no " + setToUppercase(Skills[skill]) + " Skillcape in your bank *shrug*", "danger");
}
snippet.end();

////////////////////
//ReclaimTokens.js//
////////////////////
snippet.name = 'ReclaimTokens.js';
snippet.start();
// reclaim tokens
window.reclaimMasteryTokens = () => {
    skillXP.forEach((_, s) => {
        if (MASTERY[s] === undefined) {
            return;
        }
        const id = Items['Mastery_Token_' + Skills[s]];
        const p = Math.floor((MASTERY[s].pool - getMasteryPoolTotalXP(s) ) / Math.floor(getMasteryPoolTotalXP(s)*0.001));
        const m = game.stats.Items.statsMap.get(id).stats.get(ItemStats.TimesFound);
        const o = getBankQty(id);
        const a = Math.min(p, m - o);
        const b = getBankId(id);
        if (a > 0 && b >= 0) {
            bank[b].qty += a;
            MASTERY[s].pool -= a * Math.floor(getMasteryPoolTotalXP(s)*0.001);
            snippet.log('reclaimed', a, Skills[s], 'tokens');
        }
    });
}

snippet.end();

/////////////////////
//RemoveElements.js//
/////////////////////
snippet.name = 'RemoveElements.js';
snippet.start();
// remove various elements
// combat
document.getElementById('offline-combat-alert').remove();

// summoning marks
// green
document.getElementById('summoning-category-0').children[0].children[0].children[2].remove();
// orange and red
document.getElementById('summoning-category-0').children[0].children[0].children[1].remove();

// summoning tablets
document.getElementById('summoning-category-1').children[0].children[0].children[0].remove()

// alt. magic
document.getElementById('magic-container').children[0].children[1].remove();

// cloud saving
document.getElementById('header-cloud-save-time').remove();
document.getElementById('header-cloud-save-btn-connected').remove();
snippet.end();

/////////////////////////
//RerollJuniorFarmer.js//
/////////////////////////
snippet.name = 'RerollJuniorFarmer.js';
snippet.start();
// automate rerolling and attacking of Junior Farmer
window.rerollJuniorFarmer = () => {
    // rewardGPForKill loots drops and rerolls slayer task
    eval(player.rewardGPForKill.toString().replaceAll(
        'this',
        'player',
    ).replace(
        'rewardGPForKill(){',
        'window.rewardGPForKill = () => {' +
        'window.lootDrops();' +
        'window.rerollSlayerTaskFast([Monsters.JuniorFarmer], 0, false);',
    ));
    player.rewardGPForKill = window.rewardGPForKill;

    // process death restarts fight
    let checkDeath = combatManager.checkDeath.toString().slice(0,-1); // remove closing curly brace
    checkDeath += 'if (playerDied) {' +
        'combatManager.selectMonster(Monsters.JuniorFarmer, getMonsterArea(Monsters.JuniorFarmer));' +
        'snippet.log("player death: new fight initiated");' +
        '}';
    checkDeath += '}'; // add closing curly brace
    eval(checkDeath.replaceAll(
        'this',
        'combatManager',
    ).replace(
        'checkDeath(){',
        'window.checkDeath = () => {',
    ));
    combatManager.checkDeath = window.checkDeath;
}

// window.rerollJuniorFarmer();
snippet.end();

///////////////////
//RerollSlayer.js//
///////////////////
snippet.name = 'RerollSlayer.js';
snippet.start();
//reroll slayer task until desired task is met
window.rerollSlayerTask = (monsterIDs, tier, extend = true, loop = true) => {
    if (window.stopRerolling) {
        return;
    }
    const task = combatManager.slayerTask;
    const taskID = task.monster.id;
    const taskName = MONSTERS[taskID].name;
    if (!combatManager.slayerTask.taskTimer.active) {
        // only do something if slayer task timer is not running
        if (!combatManager.slayerTask.active || !monsterIDs.includes(taskID)) {
            // roll task if we don't have one, or if it has the wrong monster
            snippet.log(`rerolling ${taskName} for tier ${tier} task ${monsterIDs.map(monsterID => MONSTERS[monsterID].name).join(', ')}`);
            combatManager.slayerTask.selectTask(tier, true, true, false);
        } else if (extend && !task.extended) {
            // extend task if it is the right monster
            snippet.log(`extending ${taskName}`);
            combatManager.slayerTask.extendTask();
        }
    }
    if (loop) {
        setTimeout(() => rerollSlayerTask(monsterIDs, tier, extend), 1000);
    }
}

// simulate rerolling of slayer task until desired task is met
window.rerollSlayerTaskFast = (monsterIDs, tier, extend = true, verbose = false) => {
    const task = combatManager.slayerTask;
    if (task.taskTimer.active) {
        return;
    }
    // only do something if slayer task timer is not running
    if (task.active && monsterIDs.includes(task.monster.id)) {
        if (extend && !task.extended) {
            // extend task if it is the right monster
            if (verbose) {
                snippet.log(`extending ${MONSTERS[task.monster.id].name}`);
            }
            task.extendTask();
        }
        return;
    }
    // roll task if we don't have one, or if it has the wrong monster
    const monsterSelection = task.getMonsterSelection(tier).map(x => x.id);
    const monsterSelectionMap = {};
    monsterSelection.forEach(x => monsterSelectionMap[x] = true);
    monsterIDs = monsterIDs.filter(x => monsterSelectionMap[x]);
    if (monsterIDs.length === 0) {
        snippet.log(`no valid monsterIDs provided for tier ${tier}`);
        return;
    }
    // simulate rerolls until one of the target monsters is rolled
    let rerolls = 1;
    const prob = monsterIDs.length / monsterSelection.length;
    while (Math.random() > prob) {
        rerolls++;
    }
    let scAmount = 0;
    if (tier > 0) {
        scAmount = SlayerTask.data[tier].cost * rerolls;
        if (scAmount > player._slayercoins) {
            snippet.log(`insufficient slayer coins, needed ${scAmount}, have ${player._slayercoins}`);
            return;
        }
        task.player.removeSlayerCoins(scAmount, true);
    }
    // randomly pick one of the valid monsters
    const monsterID = monsterIDs[rollInteger(0, monsterIDs.length - 1)];
    // mimic task.selectTask
    task.monster = MONSTERS[monsterID];
    task.tier = tier;
    task.active = true;
    task.extended = false;
    task.killsLeft = task.getTaskLength(tier);
    task.renderRequired = true;
    task.renderNewButton = true;
    if (verbose) {
        snippet.log(`simulated ${rerolls} rerolls for tier ${tier} task ${MONSTERS[monsterID].name} costing ${scAmount}SC`);
    }
}
snippet.end();

/////////////////
//ShardsUsed.js//
/////////////////
snippet.name = 'ShardsUsed.js';
snippet.start();
// compute total shards used
window.shardsUsed = () => {
    // compute amount of gp spent on summoning shards that have been used (for summoning or agility obstacles)
    items.map((x, i) => [x, i])
        .filter(x => x[0].type === 'Shard' && x[0].category === 'Summoning')
        .map(x => x[1])
        .map(x => (itemStats[x].stats[0] - getBankQty(x) - itemStats[x].stats[1]) * items[x].buysFor)
        .reduce((a, b) => a + b, 0);
}
snippet.end();

///////////////////
//SpawnAhrenia.js//
///////////////////
snippet.name = 'SpawnAhrenia.js';
snippet.start();
// spawn Ahrenia
window.spawnAhrenia = (phaseToSpawn = 1) => {
    // run
    combatManager.runCombat();
    // set respawn to 0
    if (!petUnlocked[0]) {
        unlockPet(0);
    }
    PETS[0].modifiers.decreasedMonsterRespawnTimer = 0;
    player.computeAllStats();
    PETS[0].modifiers.decreasedMonsterRespawnTimer = 3000 - TICK_INTERVAL - player.modifiers.decreasedMonsterRespawnTimer + player.modifiers.increasedMonsterRespawnTimer;
    player.computeAllStats();
    // unlock itm
    dungeonCompleteCount[Dungeons.Fire_God_Dungeon] = Math.max(
        dungeonCompleteCount[Dungeons.Fire_God_Dungeon],
        1,
    );
    skillLevel[Skills.Slayer] = Math.max(
        skillLevel[Skills.Slayer],
        90,
    );
    // skip to desired phase
    combatManager.selectDungeon(15);
    combatManager.dungeonProgress = 19 + phaseToSpawn;
    combatManager.loadNextEnemy();
}
snippet.end();

////////////////////
//UnlimitedPool.js//
////////////////////
snippet.name = 'UnlimitedPool.js';
snippet.start();
// don't cap pool xp
eval(addMasteryXPToPool.toString()
    .replace('MASTERY[skill].pool>getMasteryPoolTotalXP(skill)', 'false')
    .replace(/^function (\w+)/, "window.$1 = function")
);

// don't cap token claiming
eval(claimToken.toString()
    .replace('qty>=tokensToFillPool', 'false')
    .replace(/^function (\w+)/, "window.$1 = function")
);
snippet.end();

/////////////
//Unsell.js//
/////////////
snippet.name = 'Unsell.js';
snippet.start();
// unsell sold items
window.unsell = (id, count = Infinity) => {
    if (count < 0) {
        return;
    }
    const timesSold = game.stats.Items.get(id, ItemStats.TimesSold);
    const gpFromSales = game.stats.Items.get(id, ItemStats.GpFromSale);
    if (timesSold === 0) {
        snippet.log("zero times sold");
        return;
    }
    // check if transaction is affordable
    const times = Math.min(count, timesSold);
    const cost = Math.ceil(gpFromSales / timesSold * times);
    if (gp < cost) {
        snippet.log("can't afford: " + times + " costs " + cost + " have " + gp);
        return;
    }
    // add item
    if (times > 0) {
        addItemToBank(id, times);
    }
    game.stats.Items.add(id, ItemStats.TimesFound, -times);
    game.stats.Items.add(id, ItemStats.TimesSold, -times);
    // remove cost
    gp = Math.floor(gp - cost);
    game.stats.Items.add(id, ItemStats.GpFromSale, -cost);
    updateGP();
    // fix statistics
    game.stats.General.add(GeneralStats.TotalItemsSold, -times);
    updateBank();
    // log transaction
    snippet.log("bought " + times + " for " + cost);
}
snippet.end();

// footer start
}

function loadScript() {
    if (typeof isLoaded !== typeof undefined && isLoaded) {
        // Only load script after game has opened
        clearInterval(scriptLoader);
        startSnippets();
    }
}

const scriptLoader = setInterval(loadScript, 200);
});