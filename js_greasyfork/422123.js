// ==UserScript==
// @name        Melvor Idle Item Dashboard (MIID)
// @namespace   http://tampermonkey.net
// @match       https://melvoridle.com
// @match       https://melvoridle.com/*
// @match       https://www.melvoridle.com/*
// @match       https://test.melvoridle.com/*
// @grant       none
// @version     2.4
// @author      Gardens#3738
// @description Track -everything- over time!
// @license GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/422123/Melvor%20Idle%20Item%20Dashboard%20%28MIID%29.user.js
// @updateURL https://update.greasyfork.org/scripts/422123/Melvor%20Idle%20Item%20Dashboard%20%28MIID%29.meta.js
// ==/UserScript==

window.banked = function(itemID) {
    let qty = 0;
    if (checkBankForItem(itemID)) {
        let bankID = getBankId(itemID);
        qty = bank[bankID].qty;
    }
    return qty;
}

window.itemsOwned = function(silent = true) {
    let bulk = new Array(items.length).fill(0);
    // take everything in bank, pile it here
    for (let bankSlot of bank) {
        bulk[bankSlot.id] += bankSlot.qty;
    }

    // check equipment sets, ignore golbin loadout
    for (let equipmentSet of player.equipmentSets) {
        let slotArray = equipmentSet.slotArray;
        for (let slot of slotArray) {
            let gearID = slot.item.id;
            let qty = slot.quantity;
            // malcs, nobody uses logs in battle
            // malcs please just use -1 for no item
            if (gearID !== -1) {
                bulk[gearID] += qty;
                !silent && console.log(`gear item:${items[gearID].name} qty ${qty}`)
            }
        }
    }
    // tally food, ignore golbin food at equippedFood[3]
    for (let foodSlot of player.food.slots) {
        let foodID = foodSlot.item.id;
        let qty = foodSlot.quantity;
        if (qty > 0) {
            !silent && console.log(`food item:${items[foodID].name} qty ${qty}`);
            bulk[foodID] += qty;
        }
    }

    if (!silent) {
        for (let i = 0; i < bulk.length - 1; i++) {
            if (bulk[i] > 0) {
                console.log(`has item:${items[i].name} qty ${bulk[i]}`);
            }
        }
    }
    return bulk;
}

window.effHp = function() {
    let foodObj = player.food.slots[player.food.selectedSlot];
    // player.autoEatEfficiency
    // player.modifiers.increasedChanceToPreserveFood
    // return equippedFood.map(({ itemID, qty }) => (getFoodHealValue(itemID) || 0) * qty).reduce((a, b) => a + b)
    let calcFoodQty = foodObj.quantity * (1 + player.modifiers.increasedChanceToPreserveFood);
    let healValue = Math.floor(player.getFoodHealing(foodObj.item) * player.autoEatEfficiency / 100);
    let hp = player.hitpoints;
    if (calcFoodQty == 0)
        return hp;
    else
        return hp + calcFoodQty * healValue;
}

window.totalKills = function() {
    let kills = 0;
    for (let mon of game.stats.Monsters.statsMap) {
        kills += mon[1].stats.get(2) || 0;
    }
    return kills;
}

window.toggleIntervalSize = function() {
    if (MIIDOptions.itemTracked != -1) {
        MIIDOptions.itemTracked = -1;
        MIIDOptions.intervalTracked = 0;
    }
    MIIDOptions.intervalTracked = (MIIDOptions.intervalTracked + 1) % MIIDOptions.trackIntervals.length;
}

window.getTimeString = function(sec) {
    let s = Math.round(sec)
    let h = Math.floor(s / 3600)
    let m = Math.floor((s - h * 3600) / 60)
    s = s - 3600 * h - 60 * m;
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    // if (h == 0) {
    //     if (m == 0) {
    //         return `${s}s`;
    //     } else return `${m}m${s}s`;
    // } else return `${h}h${m}m${s}s`;
    // let timeString = ` h: ${h} m: ${m} s: ${s}`;
    return `${h}:${m}:${s}`;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////         XP            //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

levelToXp = function(level) {
    let xp = 0;
    for (let l = 1; l <= level - 1; l++) {
        xp += Math.floor(l + 300 * Math.pow(2, l / 7))
    }
    return Math.floor(xp / 4);
}

levels = []
for (let i = 0; i < 200; i++) {
    levels[i] = levelToXp(i)
}

xpToLevel = function(xp) {
    let level = 1;
    while (levels[level + 1] <= xp) level++;
    return level;
}


window.idToSkillname = {};
// number to name
for (let key of Object.keys(CONSTANTS.skill)) {
    idToSkillname[CONSTANTS.skill[key]] = key
}
// console.log(idToSkillname)

window.allXP = function(loud = false) {
    let skills = [];
    for (let i = 0; i < skillXP.length; i++) {
        skills[i] = {
            name: SKILLS[i].name,
            xp: skillXP[i],
            level: xpToLevel(skillXP[i]),
        }
        skills[i].xpToNext = levelToXp(skills[i].level + 1) - skillXP[i];
        loud && console.log("skill", i, skills[i].name)
        if (SKILLS[i].hasMastery) {
            skills[i].pool = MASTERY[i].pool;
            skills[i].mastery = MASTERY[i].xp.reduce((a, b) => a + b);
            skills[i].poolMax = getMasteryPoolTotalXP(i);
            skills[i].poolPerc = skills[i].pool / skills[i].poolMax * 100;
        }
    }
    return skills;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////      SNAPSHOTS        //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// let itemTracker = {
//     start: {
//         bulkItems: [
//             0: 34,
//             1: 356
//         ],
//         gp: 2444,
//         prayerPoints: 54243,
//     },
//     curr: {... }
window.getSnapshot = function() {
    let resources = {
        date: (new Date()).getTime(),
        bulkItems: itemsOwned(),
        skills: allXP(),
        prayerPoints: player.prayerPoints,
        slayerCoins: player.slayercoins,
        gp: gp,
        hp: effHp(),
        kills: totalKills(),
    };
    return resources;
}

window.resetItemTracker = function() {
    window.itemTracker = {
        start: getSnapshot(),
        curr: getSnapshot(),
    }
    trackerTick();
}


// resetItemTracker();

window.setupItemTracker = function() {
    let localCopy = localStorage.getItem("itemTracker")
    if (localCopy == null) {
        resetItemTracker();
    } else {
        window.itemTracker = JSON.parse(localCopy);
    }
}

window.setupOptions = function() {
    let localCopy = localStorage.getItem("MIIDOptions")
    if (localCopy == null) {
        console.log("Creating MIIDOptions")
        resetOptions();
    } else {
        console.log("Found MIIDOptions")
        window.MIIDOptions = JSON.parse(localCopy);
    }
}

window.resetOptions = function() {
    window.MIIDOptions = {
        itemTracked: -1,
        intervalTracked: 1,
        trackIntervals: [
            [0, 'reset'],
            [1, 'sec'],
            [60, 'min'],
            [3600, 'hour'],
            [3600 * 24, 'day']
        ],
        blacklistMode: false,
        blacklistItems: {

        },
    }
}

roundCustom = function(nr, roundDigits = 0, letters = true) {
    // 12345.6789 --> roundDecs:
    // 12345
    if (Math.abs(nr) < 1000 || !letters) {
        return Math.round(nr * Math.pow(10, roundDigits)) / Math.pow(10, roundDigits);
    } else if (Math.abs(nr) < 1000000) {
        // 32415 -> 32.4k
        return Math.round(nr / (Math.pow(10, 3 - roundDigits))) / Math.pow(10, roundDigits) + "k";
    } else {
        // 12345678 -> 12.3m
        return Math.round(nr / (Math.pow(10, 6 - roundDigits))) / Math.pow(10, roundDigits) + "m";
    }
}

setItemTracked = function(itemID = -1) {
    MIIDOptions.itemTracked = itemID;
}

window.resDiff = {};
trackerTick = function(silent = true) {
    itemTracker.curr = getSnapshot();
    let { start, curr } = itemTracker;
    let timePassed = (curr.date - start.date) / 1000;
    // save tracker
    localStorage.setItem("itemTracker", JSON.stringify(itemTracker));
    localStorage.setItem("MIIDOptions", JSON.stringify(MIIDOptions));
    // why did I do this?
    // itemTracker = JSON.parse(localStorage.getItem("itemTracker"));

    window.resDiff = {
        timePassed,
        intervalDur: -1,
        intervalLabel: "default",
        itemChange: new Array(items.length).fill(0),
        worthChange: new Array(items.length).fill(0),
        itemRate: new Array(items.length).fill(0),
        worthRate: new Array(items.length).fill(0),
        itemRound: 2,
        goldRound: 0,

        generalItemRate: 0,
        generalItemChange: 0,
        generalWorthChange: 0,
        generalWorthRate: 0,
        generalChanges: false,

        farmingItemRate: 0,
        farmingItemChange: 0,
        farmingWorthChange: 0,
        farmingWorthRate: 0,
        farmingChanges: false,

        totalWorthChange: 0,
        totalWorthRate: 0,

        pointChange: {},
        pointRate: {},
        pointTimeLeft: {},
        pointChanges: false,

        xpChange: new Array(skillXP.length).fill(0),
        xpRate: new Array(skillXP.length).fill(0),
        poolChange: new Array(skillXP.length).fill(0),
        poolRate: new Array(skillXP.length).fill(0),
        poolPercChange: new Array(skillXP.length).fill(0),
        poolPercRate: new Array(skillXP.length).fill(0),
        masteryChange: new Array(skillXP.length).fill(0),
        masteryRate: new Array(skillXP.length).fill(0),
        skillChanges: false,

        lossChanges: false,
        timeLeft: new Array(items.length).fill(0),
    };

    !silent && console.log(`xp change: ${resDiff.xpChange}, skillXP.length: ${skillXP.length}`)
    let rateFactor, intervalDur, intervalLabel;
    if (MIIDOptions.itemTracked == -1) {
        // time-based tracking
        let interval = MIIDOptions.trackIntervals[MIIDOptions.intervalTracked];
        resDiff.intervalDur = interval[0];
        resDiff.intervalLabel = interval[1];
        if (resDiff.intervalDur == 0) {
            rateFactor = 1;
        } else {
            rateFactor = timePassed / resDiff.intervalDur;
        }
    } else {
        // let itemTrackedChange = scrt
        if (isNaN(MIIDOptions.itemTracked)) {
            let pointNames = ["gp", "prayerPoints", "slayerCoins", "hp", "kills"];
            if (pointNames.indexOf(MIIDOptions.itemTracked) != -1) {
                rateFactor = curr[MIIDOptions.itemTracked] - start[MIIDOptions.itemTracked];
                resDiff.intervalLabel = MIIDOptions.itemTracked;
            } else
                console.log(`Error tracking by ${MIIDOptions.itemTracked}`);
            // point tracking
        } else {
            // track relative to a specific item's change
            rateFactor = itemTracker.curr.bulkItems[MIIDOptions.itemTracked] -
                itemTracker.start.bulkItems[MIIDOptions.itemTracked]

            resDiff.intervalLabel = items[MIIDOptions.itemTracked].name;
            !silent && console.log(`Tracking by ${MIIDOptions.itemTracked}`)
        }
    }

    // items
    for (let itemID = 0; itemID < items.length; itemID++) {
        let startQty = start.bulkItems[itemID] || 0;
        let currQty = curr.bulkItems[itemID] || 0;
        let change = currQty - startQty;
        if (change == 0) continue;

        // absolute change, interval rate, time left
        resDiff.itemChange[itemID] = change;
        resDiff.itemRate[itemID] = change / rateFactor;

        // register change
        !silent && console.log(`${items[itemID].name} changed by ${resDiff.itemRate[itemID]} / ${resDiff.intervalLabel}`);
        let worthChange = change * items[itemID].sellsFor;
        resDiff.worthChange[itemID] = worthChange;
        resDiff.worthRate[itemID] = worthChange / rateFactor;
        // split by farming
        // I miss you horsie
        // Daisy, where are you now
        if (items[itemID].category == "Farming") {
            resDiff.farmingChanges = true;
            resDiff.farmingItemChange += change;
            resDiff.farmingWorthChange += worthChange;
        } else {
            resDiff.generalChanges = true;
            resDiff.generalItemChange += change;
            resDiff.generalWorthChange += worthChange;
        }
        if (change < 0 && currQty > 0) {
            resDiff.lossChanges = true;
            let timeLeft = currQty / (-change / timePassed);
            resDiff.timeLeft[itemID] = timeLeft;
            !silent && console.log(`${items[itemID].name} running out in ${resDiff.timeLeft[itemID]}`);
        }
    }
    resDiff.generalItemRate = resDiff.generalItemChange / rateFactor;
    resDiff.generalWorthRate = resDiff.generalWorthChange / rateFactor;

    resDiff.farmingItemRate = resDiff.farmingItemChange / rateFactor;
    resDiff.farmingWorthRate = resDiff.farmingWorthChange / rateFactor;

    resDiff.totalWorthChange = resDiff.generalWorthChange + resDiff.farmingWorthChange;
    resDiff.totalWorthRate = resDiff.totalWorthChange / rateFactor;

    resDiff.netWealthChange = resDiff.totalWorthChange + curr.gp - start.gp;
    resDiff.netWealthRate = (resDiff.totalWorthChange + curr.gp - start.gp) / rateFactor;
    // points
    let pointNames = ["gp", "prayerPoints", "slayerCoins", "hp", "kills"];
    let trackTimeLeft = { "prayerPoints": true, "hp": true }
    for (let pointName of pointNames) {
        let startQty = start[pointName];
        let currQty = curr[pointName];
        let change = currQty - startQty;
        let rate = change / rateFactor;
        resDiff.pointRate[pointName] = rate;
        resDiff.pointChange[pointName] = change;
        if (!silent && change != 0) console.log(pointName, " differ by", rate, "/", resDiff.intervalLabel);
        if (currQty > 0 && change < 0 && trackTimeLeft[pointName]) {
            let timeLeft = currQty / (-change / timePassed);
            resDiff.pointTimeLeft[pointName] = timeLeft;
            !silent && console.log(`${pointName} point running out in ${resDiff.pointTimeLeft[pointName]}`);
        }
    }

    // XP
    for (let skillID = 0; skillID < skillXP.length; skillID++) {
        resDiff.xpChange[skillID] = itemTracker.curr.skills[skillID].xp - start.skills[skillID].xp;
        resDiff.xpRate[skillID] = resDiff.xpChange[skillID] / rateFactor

        resDiff.poolPercChange[skillID] = itemTracker.curr.skills[skillID].poolPerc - start.skills[skillID].poolPerc;
        resDiff.poolPercRate[skillID] = resDiff.poolPercChange[skillID] / rateFactor;

        resDiff.poolChange[skillID] = itemTracker.curr.skills[skillID].pool - start.skills[skillID].pool;
        resDiff.poolRate[skillID] = resDiff.poolChange[skillID] / rateFactor;

        resDiff.masteryChange[skillID] = itemTracker.curr.skills[skillID].mastery - start.skills[skillID].mastery;
        resDiff.masteryRate[skillID] = resDiff.masteryChange[skillID] / rateFactor;
    }

    resDiff.rateFactor = rateFactor;
    // glove charges (todo)
    if (document.getElementById("dashWealthChange") != null) {
        $("#dashWealthChange").text(`${roundCustom(resDiff.netWealthRate, 0)}/${resDiff.intervalLabel}`);
    }
    return resDiff;
}

checkPreservation = function(obj) {
    return (JSON.stringify(obj) === JSON.stringify(JSON.parse(JSON.stringify(obj))))
}

function blerg() {
    console.log("blerg!")
}

window.handleItemClick = function(itemID) {
    if (MIIDOptions.blacklistMode) {
        if (MIIDOptions.blacklistItems[itemID]) {
            MIIDOptions.blacklistItems[itemID] = false;
        } else {
            MIIDOptions.blacklistItems[itemID] = true;
        }
    } else {
        setItemTracked(itemID);
    }
    updateDash();
}

window.getDashContent = function() {
    let compact = $(window).width() < 1250;
    // use curr and start to generate some item rows, and change #dashItems for it
    let generalContent = ``
    let farmingContent = ``;
    let lossContent = ``;
    let pointContent = ``;
    let xpContent = ``;
    let content = ``;

    // each item row
    for (let itemID = 0; itemID < items.length; itemID++) {
        if (MIIDOptions.blacklistItems[itemID] && !MIIDOptions.blacklistMode) continue;
        let change = resDiff.itemChange[itemID];

        // each item's change, put in the right content chunk
        // display if change is nonzero or blacklisted item in blacklist mode
        if (change !== 0 || (MIIDOptions.blacklistItems[itemID] && MIIDOptions.blacklistMode)) {
            let itemRate = roundCustom(resDiff.itemRate[itemID], resDiff.itemRound);
            let worthRate = roundCustom(resDiff.worthRate[itemID], resDiff.goldRound);
            let banned = MIIDOptions.blacklistItems[itemID];
            let row;
            // create item row
            if (compact) {
                row = `
                <div class="pointer-enabled" onClick="handleItemClick(${itemID})">
                    <img width="32" height="32" src="${items[itemID].media}"></img>
                    <span>
                        ${banned ? String(itemRate).strike():itemRate}
                    </span>
                    <br>
                </div`;
            } else {
                row = `
                <div class="row">
                    <div class="col-4 pointer-enabled" onClick="handleItemClick(${itemID})">
                        <img class="nav-img" src="${items[itemID].media}"></img>
                        ${banned ? items[itemID].name.strike() : items[itemID].name}
                    </div>
                    <div class="col-4">${banned ? String(itemRate).strike():itemRate}</div>
                    <div class="col-4">
                        <img class="nav-img" src="https://cdn.melvor.net/core/v018/assets/media/main/coins.svg"></img>
                        ${banned ? String(worthRate).strike():worthRate}
                    </div>
                </div>`;
            }
            if (items[itemID].category == "Farming") {
                farmingContent += row;
            } else {
                generalContent += row;
            }
            // Items running out --> lossContent
            // add row to loss content
            if (resDiff.timeLeft[itemID] > 0) {
                let timeString = getTimeString(resDiff.timeLeft[itemID]);
                let lossRow = ``;
                if (compact) {
                    lossRow = `
                    <div class="pointer-enabled" onClick="handleItemClick(${itemID})">
                        <img width="32" height="32" src="${items[itemID].media}"></img>
                        <span>
                            ${timeString} left
                        </span>
                        <br>
                    </div`;
                } else {
                    lossRow = `
                    <div class="row pointer-enabled" onClick="handleItemClick(${itemID})">
                        <div class="col-6">
                            <img class="nav-img" src="${items[itemID].media}"></img>
                            ${roundCustom(itemTracker.curr.bulkItems[itemID], 1)}
                        </div>
                        <div class="col-6">${timeString} left</div>
                    </div>`;
                }
                lossContent += lossRow;
            }
        }
    }
    // assemble general, farming, loss content with headers
    if (compact) {
        generalContent = `
            <br>
            <div class = "row no-gutters">
                <h5 class = "font-w700 text-center text-combat-smoke col"> General items </h5>
            </div>` + generalContent;
        farmingContent = `
            <br>
            <div class = "row no-gutters">
                <h5 class = "font-w700 text-center text-combat-smoke col"> Farming items </h5>
            </div>` + farmingContent;
        lossContent = `
            <br>
            <div class = "row no-gutters">
                <h5 class = "font-w700 text-center text-combat-smoke col"> Items being used </h5>
            </div>` + lossContent;
    } else {
        generalContent = `
            <br>
            <div class = "row no-gutters">
                <h5 class = "font-w700 text-center text-combat-smoke col"> General items </h5>
                <h5 class = "font-w700 text-center text-combat-smoke col"> Change </h5>
                <h5 class = "font-w700 text-center text-combat-smoke col"> Gold Worth </h5>
            </div>` + generalContent;
        farmingContent = `
            <br>
            <div class = "row no-gutters">
                <h5 class = "font-w700 text-center text-combat-smoke col"> Farming items </h5>
                <h5 class = "font-w700 text-center text-combat-smoke col"> Change </h5>
                <h5 class = "font-w700 text-center text-combat-smoke col"> Gold Worth </h5>
            </div>` + farmingContent;
        lossContent = `
                <br>
                <div class = "row no-gutters">
                    <h5 class = "font-w700 text-center text-combat-smoke col"> Items in use </h5>
                    <h5 class = "font-w700 text-center text-combat-smoke col"> Time left </h5>
                </div>` + lossContent;
    }
    // item category rate and worth rate
    if (compact) {
        generalContent += `
        <br>
        <h5> General items </h5>
        <img width="32" height="32" src="https://cdn.melvor.net/core/v018/assets/media/main/bank_header.svg"></img>
        <br>
        <span>${roundCustom(resDiff.generalItemRate, resDiff.itemRound)}</span>
        <br>
        <h5> Item worth </h5>
        <img width="32" height="32" src="https://cdn.melvor.net/core/v018/assets/media/main/coins.svg"></img>
        <br>
        <span>${roundCustom(resDiff.generalWorthRate, resDiff.goldRound)}</span>
        <br>`
        farmingContent += `
        <br>
        <h5> Farming items </h5>
        <img width="32" height="32" src="https://cdn.melvor.net/core/v018/assets/media/skills/farming/farming.svg"></img>
        <br>
        <span>${roundCustom(resDiff.farmingItemRate, resDiff.itemRound)}</span>
        <br>
        <h5> Item worth </h5>
        <img width="32" height="32" src="https://cdn.melvor.net/core/v018/assets/media/main/coins.svg"></img>
        <br>
        <span>${roundCustom(resDiff.farmingWorthRate, resDiff.goldRound)}</span>
        <br>`
    } else {
        // total item changes
        generalContent += `
        <div class="row">
            <div class="col-4">
                <img class="nav-img" src="https://cdn.melvor.net/core/v018/assets/media/main/bank_header.svg"></img>
                General Items
            </div>
            <div class="col-4">${roundCustom(resDiff.generalItemRate, resDiff.itemRound)}</div>
            <div class="col-4">
                <img class="nav-img" src="https://cdn.melvor.net/core/v018/assets/media/main/coins.svg"></img>
                ${roundCustom(resDiff.generalWorthRate, resDiff.goldRound)}
            </div>
        </div>`;
        farmingContent += `
        <div class="row">
            <div class="col-4">
                <img class="nav-img" src="https://cdn.melvor.net/core/v018/assets/media/skills/farming/farming.svg"></img>
                Farming Items
            </div>
            <div class="col-4">${roundCustom(resDiff.farmingItemRate, resDiff.itemRound)}</div>
            <div class="col-4">
                <img class="nav-img" src="https://cdn.melvor.net/core/v018/assets/media/main/coins.svg"></img>
                ${roundCustom(resDiff.farmingWorthRate, resDiff.goldRound)}
            </div>
        </div>`;
    }

    if (resDiff.generalChanges)
        content += generalContent
    if (resDiff.farmingChanges)
        content += farmingContent
    if (resDiff.lossChanges)
        content += lossContent

    // points
    pointContent = ``;
    pointContent += makePointRow(compact, "gp", "https://cdn.melvor.net/core/v018/assets/media/main/coins.svg");
    pointContent += makePointRow(compact, "hp", "https://cdn.melvor.net/core/v018/assets/media/skills/combat/hitpoints.svg", true);
    pointContent += makePointRow(compact, "kills", "https://cdn.melvor.net/core/v018/assets/media/skills/combat/combat.svg");
    pointContent += makePointRow(compact, "prayerPoints", "https://cdn.melvor.net/core/v018/assets/media/skills/prayer/prayer.svg", true);
    pointContent += makePointRow(compact, "slayerCoins", "https://cdn.melvor.net/core/v018/assets/media/main/slayer_coins.svg");
    pointContent = `<br/>
    <div class="row no-gutters">
        <h5 class="font-w700 text-center text-combat-smoke col-sm">Others</h5>
    </div>` + pointContent;

    if (resDiff.pointChanges) {
        content += pointContent;
    }

    // xp
    xpContent = `
    <br>
    <div class = "row no-gutters">
        <h5 class = "font-w700 text-center text-combat-smoke col"> Skill </h5>
        <h5 class = "font-w700 text-center text-combat-smoke col"> XP </h5>
        <h5 class = "font-w700 text-center text-combat-smoke col"> Time to Lvl </h5>
    </div>`

    for (let skillID = 0; skillID < skillXP.length; skillID++) {
        let xpRow = ``;
        let skillName = SKILLS[skillID].name;
        let hasMastery = SKILLS[skillID].hasMastery;
        let xpRate = resDiff.xpRate[skillID];
        let xpChange = resDiff.xpChange[skillID];
        let poolPercRate = resDiff.poolPercRate[skillID]
        let masteryRate = resDiff.masteryRate[skillID]
        let xpToNext = itemTracker.curr.skills[skillID].xpToNext;
        let timeToLevel = xpToNext / (xpChange / resDiff.timePassed);
        let until100 = (itemTracker.curr.skills[skillID].poolMax / (resDiff.poolChange[skillID] - resDiff.timePassed)) * 100;

        if (xpChange == 0) {
            continue;
        } else {
            resDiff.skillChanges = true;
        }
        if (compact) {
            // TODO: mobile version
        } else {
            xpRow = `
                <div class="row">
                    <div class="col-4">
                        <img class="nav-img" src="${SKILLS[skillID].media}"></img>
                        ${skillName}
                    </div>
                    <div class="col-4">
                        ${roundCustom(xpRate, 2)}
                    </div>
                    <div class="col-4">
                        ${getTimeString(timeToLevel)}
                    </div>
                    
                </div>`
            if (hasMastery && itemTracker.curr.skills[skillID].poolPerc < 100) {
                xpRow += `
                    <div class="row">
                    <div class="col-4">
                    <img class="nav-img" src="https://cdn.melvor.net/core/v018/assets/media/main/mastery_header.svg"></img>
                    ${skillName}
                    </div>
                    <div class="col-4">
                    ${roundCustom(poolPercRate, 2)}%
                    </div>
                    <div class="col-4">
                    to 100%: ${getTimeString(until100)}
                    </div>
                    
                    </div>`
            }
        }
        xpContent += xpRow
    }
    if (resDiff.skillChanges) {
        content += xpContent;
    }

    return content;
}

makePointRow = function(compact, pointName, src) {
    if (resDiff.pointChange[pointName] != 0) {
        resDiff.pointChanges = true;
    } else {
        return ``;
    }
    let desc = {
        "hp": "Hitpoints",
        "prayerPoints": "Prayer Points",
        "slayerCoins": "Slayer Coins",
        "gp": "Cash",
        "kills": "Kills"
    }
    let pointRow = ``;
    if (compact) {
        pointRow = `
        <div class="pointer-enabled" onClick="handleItemClick('${pointName}')">
            <img width="32" height="32" src="${src}"></img>
            <span>${roundCustom(resDiff.pointRate[pointName], 1)}</span>
        </div>`
        if (resDiff.pointTimeLeft[pointName]) {
            pointRow += `<div><span>${getTimeString(resDiff.pointTimeLeft[pointName])} left</span></div`
        }
    } else {
        pointRow = `
        <div class="row no-gutters pointer-enabled" onClick="handleItemClick('${pointName}')">
            <div class="col-4">
                <img class="nav-img" src="${src}"></img>
                ${desc[pointName]}
            </div>
            <div class="col-8">
                ${roundCustom(resDiff.pointRate[pointName], 2)}
            </div>
        </div>`
        if (resDiff.pointTimeLeft[pointName]) {
            pointRow += `
            <div class="row no-gutters">
                <div class="col-4">
                    <img class="nav-img" src="${src}"></img>
                    ${roundCustom(itemTracker.curr[pointName], 2)}
                </div>
                <div class="col-8">
                    ${getTimeString(resDiff.pointTimeLeft[pointName])} left
                </div>
            </div>`
        }
    }
    return pointRow;
}

// window.dashItemRows = "";
// window.dashPointRows = "";
// window.dashContent = "";
window.toggleBlacklist = function() {
    MIIDOptions.blacklistMode = !MIIDOptions.blacklistMode
}
window.updateDash = function() {
    let interval = MIIDOptions.trackIntervals[MIIDOptions.intervalTracked];
    let intervalLabel = interval[1];
    let content = getDashContent();
    let buttonLabel = (resDiff.intervalLabel == "reset") ? "Since last" : "Per:";
    // <button type="button" class="swal2-confirm swal2-styled onClick="resetItemTracker()">Reset</button>`
    if (document.getElementById("dashContent") != null) {
        $("#dashContent").html(`
        <p>Time tracked: ${getTimeString(resDiff.timePassed)}</p>
        <button type="button" onClick="toggleIntervalSize()" class="swal2-confirm swal2-styled" aria-label="" style="display: inline-block; background-color: rgb(55, 200, 55); border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);">
            ${buttonLabel} ${resDiff.intervalLabel}
        </button>
        <button type="button" onClick="toggleBlacklist()" class="swal2-confirm swal2-styled" aria-label="" style="display: inline-block; background-color: ${MIIDOptions.blacklistMode?"rgb(200, 55, 55)" : "rgb(55, 200, 55)"}; border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);">
        Blacklisting: ${MIIDOptions.blacklistMode}
        </button>
        ${content}
        `);
    }
}

window.openItemDash = function() {
    Swal.fire({
        title: 'M.I.I.D. (Item Dash)',
        html: `<small>by Gardens</small><div id="dashContent"></div>`,
        width: "50%",
        // openItemDash();
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Reset Tracker'
    }).then((result) => {
        if (result.value) {
            console.log("Resetting item tracker")
            resetItemTracker();
            setTimeout(openItemDash, 100);
        }
    })
}

function injectItemTrackerButton() {
    if (document.getElementById("dashWealthChange") == null) {
        let dashButton = `
        <li class="nav-main-item">
        <div class="nav-main-link nav-compact pointer-enabled" onclick="openItemDash();">
        <img class="nav-img" src="https://cdn.melvor.net/core/v018/assets/media/main/statistics_header.svg">
        <span class="nav-main-link-name">Item Dash</span>
        <img src="https://cdn.melvor.net/core/v018/assets/media/main/coins.svg" style="margin-right: 4px;" width="16px" height="16px">
        <small id="dashWealthChange" class="text-warning" data-toggle="tooltip" data-html="true" data-placement="bottom" title="" data-original-title="TEST"></small>
        </div>
        </li>`
        $("#nav-menu-show").before(dashButton);
        setupOptions();
        setupItemTracker();
        window.itemTrackBot = setInterval(() => {
            trackerTick();
            updateDash();
            // HACK for initial ticker:
            // $("#dashItems").html(getDashItemRows())
        }, 1000);
    }
}

function loadItemDashboard() {
    // if ((window.isLoaded && !window.currentlyCatchingUp) ||
    //     (typeof unsafeWindow !== 'undefined' && unsafeWindow.isLoaded && !unsafeWindow.currentlyCatchingUp) ||
    //     document.getElementById("nav-menu-show") == null ||
    if (!window.isLoaded || window.currentlyCatchingUp ||
        document.getElementById("nav-menu-show") == null
        // equipmentSets[1] == undefined
    ) {
        // console.log("Retrying...")
        setTimeout(loadItemDashboard, 300);
        return;
    } else {
        injectItemTrackerButton();
    }
}
loadItemDashboard();
// window.dashboardLoaderInterval = setInterval()