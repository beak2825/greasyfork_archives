// ==UserScript==
// @name         Enhanced GT Mapper
// @author       Xuan, Anson
// @namespace    a
// @version      5.3
// @description  Auto completes GT maps for stonks
// @include		http://mousehuntgame.com/camp.php
// @include		https://mousehuntgame.com/camp.php
// @include		http://www.mousehuntgame.com/camp.php
// @include		https://www.mousehuntgame.com/camp.php

// @downloadURL https://update.greasyfork.org/scripts/423537/Enhanced%20GT%20Mapper.user.js
// @updateURL https://update.greasyfork.org/scripts/423537/Enhanced%20GT%20Mapper.meta.js
// ==/UserScript==

/*
* This script automatically completes certain subsets of a GT Map.
*
* Version 5 is updated with a focus in single core performance.
*
*
* Objective Coverage :
* 1. Prickly Plains
* 2. Canterra Quarry (Except Nach)
* 3. Queso River (Conditional QQ)
* 4. Geyser
*       a. Cork Collecting
*       b. Pressure Building
*       c. Eruption Mice
*       d. Sizzle Pup
*
* ============ Feature List ============
* 1. Objective-Aware Automation for:
*       a. Traveling between locations.
*       b. Trap control
* 2. Enhanced Automatic Invites
*       a. Invites all favorites on each interval
*       b. Skips unnecessary invites
* 3. Resource Management
*       a. Bait replenishment
*       b. Bait-aware objective completion
*
* - Coming Soon : Leaf balancing mechanism for farming
*/

/* Patch Notes for 5.0
* 1. Two brand new modes, optimized for single medium core performance.
*       a. Cork is prioritized, preventing a trailing corky or eruption bottleneck
*       b. River is prioritized for CC hunting overnight.
*       c. Plains deprioritized, allowing for inferna assist.
*       d. QQ is taken care of if conditions are favorable.
* 2. Dropped previous medium core mode.
* 3. Added base and charm switching for certain situations
* 4. INVITE mode now no longer intereferes with trap control.
* 5. If currently catching Nach, the script will not interfere.
* 6. Improved auto invite flow where if no invites are needed, map won't be opened twice.
* 7. Auto Detection of trap preset based on user.
* 8. Improved supply management logging to reduce verbosity when no replenishment needed.

* 5.1 - Minor bug fix for base switching.
* 5.2 - QQ bug fix
* 5.3 - If no map found, will farm. Added potential fix for geyser wrong base issue.
*/

// ================================= MODES =================================
const INVITE = "Auto Invite Only";
const LOW_QUARRY = "Quarry(Low)";
const LOW_PLAINS = "Plains(Low)";
const SINGLE_CORE_TO_GEYSER = "Single Core to Geyser";
const SINGLE_CORE_FROM_GEYSER = "Single Core from Geyser";

// >>>>>> SET ME <<<<<<
const MODE = SINGLE_CORE_FROM_GEYSER;
const INTERVAL_MILLISECONDS = 600000;
const NUM_HUNTERS = 10;

var TRAP_PRESET = 2; // Auto Set Available
assignPreset();

/*
* Trap Presets
        1.  (Anson Sisters)
            Law : SLAC II
            Shadow : Manor
            Draconic : BEST
            Arcane : Acronym
            StrongBase : Ember Base
            DefaultBase : Gift of the Day

        2.  (Xuan Sisters)
            Law : SLAC II
            Shadow : Crossbow
            Draconic : BEST
            Arcane : Archmagus
            StrongBase : Ember Base
            DefaultBase : Gift of the Day

        3.  (Aaron)
            Law : Ember Prison
            Shadow : Annirp
            Draconic : CSWB
            Arcane : ANNIACRONYM
            StrongBase : Prestige Base
            DefaultBase : Gift of the Day

        4.  (Matthew and Daniel)
            Law : Meteor
            Shadow : Crossbow
            Draconic : Best
            Arcane : Archmagus
            StrongBase : Ember Base
            DefaultBase : Gift of the Day
*/

// ================================= TRAP CONSTANTS =================================
const CROSSBOW = 2225
const MANOR = 3105
const ANNIRP = 2581

const ARCHMAGUS = 2224
const ACRONYM = 35
const ANNIACRONYM = 2577

const METEOR = 2299
const SLACII = 1176
const EMBERPRISON = 2621

const BEST = 2623
const ICE_MAIDEN = 56
const CSWB = 2648

// Bases
const PRESTIGE = 2904
const EMBERSTONE = 2620
const GIFTBASE = 3150

// Charms
const GILDED = 2174
const SNOWBALL = 1290
const NYCHARM = 3153
const ULC = 473

// Set these or...
var BEST_LAW = SLACII
var BEST_SHADOW = CROSSBOW
var BEST_DRACONIC = BEST
var BEST_ARCANE = ARCHMAGUS
var BEST_BASE = EMBERSTONE
var DEFAULT_CHARM = GILDED
var BACKUP_DEFAULT_CHARM = SNOWBALL
var HIGH_POWER_CHARM = NYCHARM
var HIGH_LUCK_CHARM = ULC




// ================================= THRESHOLDS =================================
const WILDFIRE_CHEESE_MIN = 6;
const FLAMIN_CHEESE_MIN = 6;
const HOT_CHEESE_MIN = 6;
const MEDIUM_CHEESE_MIN = 6;
const MILD_CHEESE_MIN = 6;

const FLAMIN_LEAF_MIN = 30;
const HOT_LEAF_MIN = 30;
const MEDIUM_LEAF_MIN = 30;
const MILD_LEAF_MIN = 30;

// ================================= CHEESE CONSTANTS =================================
const BLAND = 2625
const MILD = 2629
const MEDIUM = 2628
const HOT = 2627
const FLAMIN = 2626
const WILDFIRE = 2630
const SB = 114
const GOUDA = 98

// ================================= MICE CONSTANTS =================================
// Prickly Plains
const PP_BLAND = [
    "Spice Seer",
    "Old Spice Collector"
];

const PP_MILD = [
    "Spice Farmer",
    "Granny Spice"
];

const PP_MED = [
    "Spice Sovereign",
    "Spice Finder"
];

const PP_HOT = [
    "Spice Raider",
    "Spice Reaper"
];

const PP_FLAMIN = [
    "Inferna, The Engulfed"
];

// Canterra Quarry
const CQ_BLAND = [
    "Chip Chiseler",
    "Tiny Toppler"
];

const CQ_MILD = [
    "Ore Chipper",
    "Rubble Rummager"
];

const CQ_MED = [
    "Nachore Golem",
    "Rubble Rouser"
];

const CQ_HOT = [
    "Fiery Crusher",
    "Grampa Golem"
];

const CQ_FLAMIN = [
    "Nachous, The Molten"
];

//Queso River
const QQ = [
    "Queen Quesada"
];

const QR_SB = [
    "Croquet Crusher",
    "Sleepy Merchant"
];

const QR_GOUDA = [
    "Pump Raider",
    "Queso Extractor",
    "Tiny Saboteur"
];

//Cork Collectors
const CORKATAUR = [
    "Corkataur"
];

const CORKY = [
    "Corky, the Collector"
];

const CORK_FLAMIN = [
    "Rambunctious Rain Rumbler"
];

const CORK_HOT = [
    "Horned Cork Hoarder"
];

const CORK_MED = [
    "Burly Bruiser"
];

const CORK_MILD = [
    "Cork Defender"
];

const CORK_BLAND= [
    "Fuzzy Drake"
];

//Pressure Set
const PRESSURE_MILD = [
    "Steam Sailor"
];

const PRESSURE_MED = [
    "Warming Wyvern"
];

const PRESSURE_HOT = [
    "Vaporior"
];

const PRESSURE_FLAMIN = [
    "Pyrehyde"
];

const PRESSURE_WILDFIRE = [
    "Emberstone Scaled"
];

//Eruption Collaterals
const COLLAT_FLAMIN = [
    "Bruticus, the Blazing"
];
const COLLAT_HOT = [
    "Ignatia"
];
const COLLAT_MED = [
    "Smoldersnap"
];
const COLLAT_MILD = [
    "Mild Spicekin"
];

// ================================= Utilities =================================
async function assignPreset() {
    TRAP_PRESET = await detectPreset();

    // use Auto preset
    switch (TRAP_PRESET) {
        case 1:
            BEST_LAW = SLACII
            BEST_SHADOW = MANOR
            BEST_DRACONIC = BEST
            BEST_ARCANE = ACRONYM
            BEST_BASE = EMBERSTONE
            break;

        case 2:
            BEST_LAW = SLACII
            BEST_SHADOW = CROSSBOW
            BEST_DRACONIC = BEST
            BEST_ARCANE = ARCHMAGUS
            BEST_BASE = EMBERSTONE
            break;

        case 3:
            BEST_LAW = EMBERPRISON
            BEST_SHADOW = ANNIRP
            BEST_DRACONIC = CSWB
            BEST_ARCANE = ANNIACRONYM
            BEST_BASE = PRESTIGE
            break;

        case 4:
            BEST_LAW = METEOR
            BEST_SHADOW = CROSSBOW
            BEST_DRACONIC = BEST
            BEST_ARCANE = ARCHMAGUS
            BEST_BASE = EMBERSTONE
            break;

        default:
            BEST_LAW = SLACII
            BEST_SHADOW = MANOR
            BEST_DRACONIC = BEST
            BEST_ARCANE = ACRONYM
            BEST_BASE = EMBERSTONE
            break;
    }
    return;
}
async function detectPreset() {
    log("Initializing trap preset.");
    await sleep(1000);
    if(user.firstname == "Daniel" || user.firstname == "Matthew") {
        log("Matthew or Daniel detected.");
        return 4;
    }

    if(user.firstname == "Aaron") {
        log("Aaron detected.");
        return 3;
    }

    if(user.firstname == "Katarina" || user.firstname == "Morgana") {
        log("Katarina or Morgana detected.");
        return 1;
    }

    if(user.firstname == "Ivy" || user.firstname == "Ashe") {
        log("Ivy or Ashe detected.");
        return 2;
    }
    return 2;
}
function sleep(n) {
    n = n || 2000;

    return new Promise(done => {
      setTimeout(() => {
        done();
      }, n);
    });
}

function log(message) {
    var d = new Date();
    console.log(d.toLocaleTimeString() + " - GT Mapper - " + message);
}

function supplyLog(message, show=true) {
    if(show) {
        var d = new Date();
        console.log(d.toLocaleTimeString() + " - Supply Management - " + message);
    }
}

function getMissingInviteCount() {
    if(IsMapOwner() == false) {
        log("Not Map Owner.")
        return 0;
    }
    let numHuntersInMap = parseInt(document.getElementsByClassName("treasureMapView-block-title")[0].textContent[9]);
    log("Checking missing invites.");
    if(document.getElementsByClassName("treasureMapView-showCancelInvitesButton").length == 0){
        log("No invites sent. Need to send " + (NUM_HUNTERS - numHuntersInMap) + " invites.");
        return NUM_HUNTERS - numHuntersInMap;
    }
    let numInvited = parseInt(document.getElementsByClassName("treasureMapView-showCancelInvitesButton")[0].textContent[14]);
    log("Found " + (NUM_HUNTERS - numHuntersInMap - numInvited) + " missing invites.");
    return NUM_HUNTERS - numHuntersInMap - numInvited;
}

function getTotalLuck() {
    return parseInt(document.getElementsByClassName("campPage-trap-trapStat luck")[0].getElementsByClassName("value")[0].textContent);
}

// ================================= UI Control =================================
async function pressCamp(){
    await sleep(1500);
    document.getElementsByClassName("mousehuntHud-menu-item root")[0].click();
    log("Soft refresh triggered, giving it time to load...");
    await sleep(1500);
    return;
}

async function refreshAfterDelay() {
    await sleep(5000);
    window.location.reload();
}

async function closePopUpIfNeeded() {
    if(document.getElementsByClassName("button jsDialogClose button").length > 0) {
        try {
            document.getElementsByClassName("button jsDialogClose button")[0].click();
            return;
        } catch (error) {
            log("Failed to close dialogue. Ignoring...");
            return;
        }
    }
}

async function closeMap() {
    await sleep(1000);
    hg.controllers.TreasureMapController.hide();
    await sleep(1000);
    return;
}


async function claimNest() {
    if((user.quests.QuestQuesoGeyser.state == "claim") && document.getElementsByClassName("quesoGeyserHUD-block-huntsRemaining").length > 0) {
        if (document.getElementsByClassName("quesoGeyserHUD-block-huntsRemaining")[0].textContent == '0') {
            try {
                if(document.getElementsByClassName("quesoGeyserHUD-block-huntsRemaining")[0].textContent == 0) {
                    log("Eruption hunted out, claiming nest soon...");
                    await sleep(2000);
                    document.getElementsByClassName("quesoGeyserHUD-claimNestButton default")[0].click();
                    await sleep(4000);
                    // Press continue after claiming nest (not sure if this is needed but whatever)
                    document.getElementsByClassName("button jsDialogClose button")[0].click();
                    log("Nest claimed.");
                    await closePopUpIfNeeded();
                    return;
                }
            } catch (error) {
                log("Failed nest claim. Refreshing soon...");
                refreshAfterDelay();
            }
        }

    }
}

async function turnOffTonic() {
    if(document.getElementsByClassName("quesoHUD-wildTonic-button selected").length != 0) {
        log("Tonic is on. Turning it off for now...");
        hg.views.HeadsUpDisplayQuesoRegionView.toggleWildTonic(this);
        await sleep(1000);
        if(document.getElementsByClassName("quesoHUD-wildTonic-button selected").length == 0) {
            log("Tonic is off now.");
            return true;
        }

        log("Failed to turn off tonic!");
        return false;
        //document.getElementsByClassName("quesoHUD-wildTonic-button")[0].click()
    }
}

async function turnOnTonic() {
    if(document.getElementsByClassName("quesoHUD-wildTonic-button selected").length == 0) {
        log("Tonic is off. Turning it on...");
        hg.views.HeadsUpDisplayQuesoRegionView.toggleWildTonic(this);
        await sleep(1000);
        if(document.getElementsByClassName("quesoHUD-wildTonic-button selected").length != 0) {
            log("Tonic is on now.");
            return true;
        }

        log("Failed to turn on tonic!");
        return false;
    }
}

async function catchingNach() {
    await sleep(1000);
    log("Checking if currently catching Nach...");
    if (user.environment_name == "Cantera Quarry"
            && user.bait_item_id == FLAMIN) {
        return true;
    }
    return false;
}

async function checkIfInviteNeeded() {
    await sleep(500);
    document.getElementsByClassName("treasureMapRootView-subTab")[1].click();
    return IsMapOwner() && getMissingInviteCount() > 0;
}

// ================================= Game Control =================================
/**
 * travelTo Helper function to travel to a specific location
 * @param {String} location String containing backend location
 * @param {String} normalName String containing UI name
*/
async function travelTo(location, normalName) {
    if(user.environment_name != normalName) {
        log("Traveling to " + normalName);
        $.post(
            "https://www.mousehuntgame.com/managers/ajax/users/changeenvironment.php",
            {
                sn: 'Hitgrab',
                hg_is_ajax: 1,
                destination: location,
                uh: user.unique_hash,
            },
            null,
            "json"
          );

        await pressCamp();
        return true;
    }
    return false;
}

/**
 * setTrap Set trap
 * @param {int} trap Integer containing trap ID
*/
async function setTrap(trap) {
    if (user.weapon_item_id != trap) {
        log("Arming trap : " + trap);
        hg.utils.TrapControl.setWeapon(trap).go();
        await sleep(500);
        return true;
    }
    return false;
}

/**
 * setBase Set base
 * @param {int} base Integer containing base ID
*/
async function setBase(base) {
    if (user.base_item_id != base) {
        log("Arming base : " + base);
        hg.utils.TrapControl.setBase(base).go();
        await sleep(500);
        return true;
    }
    return false;
}

/**
 * setCharm Set charm
 * @param {int} charm Integer containing charm ID
*/
async function setCharm(charm) {
    if (user.trinket_item_id != charm) {
        log("Arming charm : " + charm);
        hg.utils.TrapControl.setTrinket(charm).go();
        await sleep(500);
        return true;
    }
    return false;
}

/**
 * setBait Set bait
 * @param {int} bait Integer containing bait ID
*/
async function setBait(bait) {
    if (user.bait_item_id != bait) {
        log("Arming bait : " + bait);
        hg.utils.TrapControl.setBait(bait).go();
        sleep(1000);
        return true;
    }
    return false;
}

/**
 * enterSmallEruption Enter a small eruption
*/
async function enterSmallEruption() {
    log("Entering small eruption.");
    await claimNest();
    // Enter Small
    document.getElementsByClassName("quesoGeyserHUD-corkBlock cork_basic canBuild")[0].click();
    await sleep(1000);
    document.getElementsByClassName("mousehuntActionButton small")[10].click();
    await sleep(2000);
    await pressCamp();
    return;
}

/**
 * setDefaultCharm Set default charm
*/
async function setDefaultCharm() {
    if (user.trinket_item_id == DEFAULT_CHARM) {
        log("Default charm already set!")
        return true;
    }

    if (user.trinket_item_id != DEFAULT_CHARM) {
        log("Arming default charm : " + DEFAULT_CHARM);
        hg.utils.TrapControl.setTrinket(DEFAULT_CHARM).go();
        await sleep(1000);

        if (user.trinket_item_id == DEFAULT_CHARM) {
            log("Default charm successfully set!")
            return true;
        }

        log("Default charm failed to be set! Attempting back up charm : " + BACKUP_DEFAULT_CHARM);
        hg.utils.TrapControl.setTrinket(BACKUP_DEFAULT_CHARM).go();
        await sleep(1000);
        if (user.trinket_item_id == BACKUP_DEFAULT_CHARM) {
            log("Backup default charm successfully set!")
            return true;
        }
    }
    log("Default charm failed to be set!");
    return false;
}

// ================================= Resource Management =================================
function getCheeseCount(cheeseID, log=false) {
    supplyLog("Checking cheese counts for cheeseID : " + cheeseID, log);
    let currentCheeseCount = 0;
    if (user.environment_name == "Queso Geyser") {
        switch (cheeseID) {
            case BLAND:
                currentCheeseCount = user.quests.QuestQuesoGeyser.items.bland_queso_cheese.quantity;
                break;
            case MILD:
                currentCheeseCount = user.quests.QuestQuesoGeyser.items.mild_queso_cheese.quantity;
                break;
            case MEDIUM:
                currentCheeseCount = user.quests.QuestQuesoGeyser.items.medium_queso_cheese.quantity;
                break;
            case HOT:
                currentCheeseCount = user.quests.QuestQuesoGeyser.items.hot_queso_cheese.quantity;
                break;
            case FLAMIN:
                currentCheeseCount = user.quests.QuestQuesoGeyser.items.flaming_queso_cheese.quantity;
                break;
            case WILDFIRE:
                currentCheeseCount = user.quests.QuestQuesoGeyser.items.queso_river_boss_cheese.quantity;
                break;
            default:
                supplyLog("Please give valid cheese ID", true);
                break;
        }
    }else{
        switch (cheeseID) {
            case BLAND:
                currentCheeseCount = user.quests.QuestQuesoCanyon.items.bland_queso_cheese.quantity;
                break;
            case MILD:
                currentCheeseCount = user.quests.QuestQuesoCanyon.items.mild_queso_cheese.quantity;
                break;
            case MEDIUM:
                currentCheeseCount = user.quests.QuestQuesoCanyon.items.medium_queso_cheese.quantity;
                break;
            case HOT:
                currentCheeseCount = user.quests.QuestQuesoCanyon.items.hot_queso_cheese.quantity;
                break;
            case FLAMIN:
                currentCheeseCount = user.quests.QuestQuesoCanyon.items.flaming_queso_cheese.quantity;
                break;
            case WILDFIRE:
                currentCheeseCount = user.quests.QuestQuesoCanyon.items.queso_river_boss_cheese.quantity;
                break;
            default:
                supplyLog("Please give valid cheese ID", true);
                break;
        }
    }
    if(currentCheeseCount == 0) {
        supplyLog("WARNING : Cheese " + cheeseID + " has run out!", true);
        return currentCheeseCount;
    }
    supplyLog("Cheese count for " + cheeseID + " : " + currentCheeseCount, log);
    return currentCheeseCount;
}

function getLeafCount(cheeseID, log=false) {
    supplyLog("Checking leaf counts...", log);
    let currentLeafCount = 0;
    if (user.environment_name == "Queso Geyser") {
        switch (cheeseID) {
            case MILD:
                currentLeafCount = user.quests.QuestQuesoGeyser.items.mild_spice_crafting_item.quantity;
                break;
            case MEDIUM:
                currentLeafCount = user.quests.QuestQuesoGeyser.items.medium_spice_crafting_item.quantity;
                break;
            case HOT:
                currentLeafCount = user.quests.QuestQuesoGeyser.items.hot_spice_crafting_item.quantity;
                break;
            case FLAMIN:
                currentLeafCount = user.quests.QuestQuesoGeyser.items.flaming_spice_crafting_item.quantity;
                break;
            case WILDFIRE:
                currentLeafCount = Math.min(user.quests.QuestQuesoGeyser.items.ember_root_crafting_item.quantity, user.quests.QuestQuesoGeyser.items.ember_stone_crafting_item.quantity);
                break;
            default:
                supplyLog("Please give valid cheese ID", true);
                break;
        }
    } else {
        switch (cheeseID) {
            case MILD:
                currentLeafCount = user.quests.QuestQuesoCanyon.items.mild_spice_crafting_item.quantity;
                break;
            case MEDIUM:
                currentLeafCount = user.quests.QuestQuesoCanyon.items.medium_spice_crafting_item.quantity;
                break;
            case HOT:
                currentLeafCount = user.quests.QuestQuesoCanyon.items.hot_spice_crafting_item.quantity;
                break;
            case FLAMIN:
                currentLeafCount = user.quests.QuestQuesoCanyon.items.flaming_spice_crafting_item.quantity;
                break;
            case WILDFIRE:
                currentLeafCount = Math.min(user.quests.QuestQuesoCanyon.items.ember_root_crafting_item.quantity, user.quests.QuestQuesoCanyon.items.ember_stone_crafting_item.quantity);
                break;
            default:
                supplyLog("Please give valid cheese ID", true);
                break;
        }
    }

    supplyLog("Leaf count for " + cheeseID + " : " + currentLeafCount, log);
    return currentLeafCount;
}

async function craftCheese(cheeseID) {
    supplyLog("Crafting cheese : " + cheeseID);

    if (getLeafCount(cheeseID) < 10) {
        supplyLog("Insufficient leaves for cheese ID : " + cheeseID);
        return;
    }

    supplyLog("Sufficient leaves found...");
    switch (cheeseID) {
        case MILD:
            supplyLog("Crafting mild");
            document.getElementsByClassName("quesoHUD-bait-group-craftButton")[0].click();
            document.getElementsByClassName("mousehuntActionButton tiny")[0].click();
            break;
        case MEDIUM:
            supplyLog("Crafting medium");
            document.getElementsByClassName("quesoHUD-bait-group-craftButton")[1].click();
            document.getElementsByClassName("mousehuntActionButton tiny")[2].click();
            break;
        case HOT:
            supplyLog("Crafting hot");
            document.getElementsByClassName("quesoHUD-bait-group-craftButton")[2].click();
            document.getElementsByClassName("mousehuntActionButton tiny")[5].click();
            break;
        case FLAMIN:
            supplyLog("Crafting flamin");
            document.getElementsByClassName("quesoHUD-bait-group-craftButton")[3].click();
            document.getElementsByClassName("mousehuntActionButton tiny")[7].click();
            break;
        case WILDFIRE:
            supplyLog("Crafting wildfire");
            document.getElementsByClassName("quesoHUD-bait-group-craftButton")[4].click();
            document.getElementsByClassName("mousehuntActionButton tiny")[9].click();
            break;
        default:
            supplyLog("Please give valid cheese ID");
            break;
    }

    await sleep(2000);
    await closePopUpIfNeeded();
    return 0;

}

function needToReplenishCheese() {
    if(getCheeseCount(MILD) < MILD_CHEESE_MIN
    || getCheeseCount(MEDIUM) < MEDIUM_CHEESE_MIN
    || getCheeseCount(HOT) < HOT_CHEESE_MIN
    || getCheeseCount(FLAMIN) < FLAMIN_CHEESE_MIN
    || getCheeseCount(WILDFIRE) < WILDFIRE_CHEESE_MIN) {
        supplyLog("Cheese needs to be replenished!");
        return true;
    }
    supplyLog("Cheese supplies healthy.");
    return false;
}

async function replenishCheese() {
    supplyLog("Checking cheese supply status...");

    if(getCheeseCount(MILD, true) < MILD_CHEESE_MIN) {
        supplyLog("Mild cheese under threshold.");
        await craftCheese(MILD);
    }

    if(getCheeseCount(MEDIUM, true) < MEDIUM_CHEESE_MIN) {
        supplyLog("Medium cheese under threshold.");
        await craftCheese(MEDIUM);
    }

    if(getCheeseCount(HOT, true) < HOT_CHEESE_MIN) {
        supplyLog("Hot cheese under threshold.");
        await craftCheese(HOT);
    }

    if(getCheeseCount(FLAMIN, true) < FLAMIN_CHEESE_MIN) {
        supplyLog("Flamin cheese under threshold.");
        await craftCheese(FLAMIN);
    }

    if(getCheeseCount(WILDFIRE, true) < WILDFIRE_CHEESE_MIN) {
        supplyLog("Wildfire cheese under threshold.");
        await craftCheese(WILDFIRE);
    }
    supplyLog("Cheese Replenishment Complete...");
    await sleep(2000);
    return;

}

// ================================= Auto Invite =================================
// Check if is map owner
function IsMapOwner() {
    if (document.getElementsByClassName("treasureMapView-hunter-tooltip-name")[0].textContent == user.username) {
        log("User is map owner");
        return true;
    }
    log("User is not map owner");
    return false;
}

// Check if there's multiple maps
function IsMultipleMaps() {
   if (document.getElementsByClassName("treasureMapRootView-tab-name").length > 0) {
       log("More than one map");
       return true
   }
   log("Only one map");
   return false
}

async function AutoInvite() {
    log("Auto Inviting Favorites...");
   // Opens map interface
   await showMap();

   // Checks if users are in multiple maps
   if (IsMultipleMaps() == true) {
       // Checks if first map (non event map) is a GT map
       if (document.getElementsByClassName("treasureMapRootView-tab-name")[0].textContent == "Queso Canyon Grand Tour Treasure Map" || "Rare Queso Canyon Grand Tour Treasure Map") {
           log("Multiple maps, first map is GT map");

           // Clicks on first map tab
           await sleep(1000);
           document.getElementsByClassName("treasureMapRootView-tabRow")[0].children[0].click();
           await sleep(1500);


           if (getMissingInviteCount() <= 0) {
               log("All hunters are invited, skipping invite process...");
               closeMap();
               return;
           }

           if (IsMapOwner() == true) {
               log("Multiple maps, first map is GT, is map owner");
               log("Inviting all favourites");
               // Go to Hunter Page
               await sleep(1500);
               document.getElementsByClassName("treasureMapRootView-subTab")[1].click();
               await sleep(1000);
               // At Hunter Page
               document.getElementsByClassName("mousehuntActionButton treasureMapAlliesView-showInviteButton")[0].click();
               await sleep(1000);
               // Click Checkbox
               document.getElementsByClassName("treasureMapDialogView-userSelector-inviteFriendsCheckbox")[0].click();
               await sleep(1000);
               document.getElementsByClassName("treasureMapDialogView-continueButton mousehuntActionButton")[0].click();
               log("Finished inviting all favourites");
           }
       }

   } else {
       // There is only one map
       // Variables
       var currentMap;
       var currentMapName;

       // Get reward name
       currentMap = document.querySelector(".treasureMapView-mapMenu-rewardName");
       currentMapName = currentMap.textContent;

       if(currentMapName == "Queso Canyon Grand Tour Treasure Chest" || currentMapName == "Rare Queso Canyon Grand Tour Treasure Chest") {
           log("One map, is GT");
           if (IsMapOwner() == true) {
               log("One map, is GT map, is map owner");
               log("Inviting all favourites");
               // Go to Hunter Page
               await sleep(1000);
               document.getElementsByClassName("treasureMapRootView-subTab")[1].click();
               await sleep(1000);
               if (getMissingInviteCount() <= 0) {
                    log("All hunters are invited, skipping invite process...");
                    closeMap();
                    return;
                }

                // At Hunter Page
               document.getElementsByClassName("mousehuntActionButton treasureMapAlliesView-showInviteButton")[0].click();
               await sleep(1000);
               // Click Checkbox
               document.getElementsByClassName("treasureMapDialogView-userSelector-inviteFriendsCheckbox")[0].click();
               await sleep (1000);
               document.getElementsByClassName("treasureMapDialogView-continueButton mousehuntActionButton")[0].click();
               await sleep(1000);
               log("Finished inviting all favourites");
           }
       }
   }
    // Close Map
    await closeMap();

    return;
}

// ================================= GENERAL FUNCTIONS =================================
/**
 * showMap Prepare the map HUD by preloading it
 */
async function showMap() {
    // Prefetch map
    try {
        hg.controllers.TreasureMapController.show();
        log("Pulling up the map");
        await sleep(3500);
        return true;

    } catch (error) {
        log("Failed to retrieve map. Refreshing soon...");
        refreshAfterDelay();
    }

}

async function getMapName() {
    // Fetch the map name object
    let currentMap = document.querySelector(".treasureMapView-mapMenu-rewardName");

    // If it is null, means no map
    if (currentMap == null) {
        log("There is no active map.");
        return "None";
    }

    // If there is a map, attempt to extract name
    try {
        return currentMap.textContent;

    } catch (error) {
        log("Failed to read map name. Reloading soon...");
        refreshAfterDelay();
    }
}

/**
 * inGTMap Helper function to check if user is in GT map
 * @return {boolean} True if in GT map, False otherwise
 */
async function inGTMap() {
    // Open Map First
    log("Checking if we are in a GT Map.");
    await showMap();

    let currentMapName = await getMapName();

    // Check if we are in Rare OR Common GT Map
    if(currentMapName == "Queso Canyon Grand Tour Treasure Chest" || currentMapName == "Rare Queso Canyon Grand Tour Treasure Chest"){
        log("Detected a GT Map.");
        return true;
    }

    log("No GT Map Detected");
    return false;
}

/**
 * getMapMice Helper function to retrieve all mice in map
 * @return {Array} Array of uncaught mice in map
 */
function getMapMice() {
    return document.querySelectorAll(".treasureMapView-goals-group-goal");
}

function getUncaughtCountDict() {
    log("Preparing mice counts...");
    // Prepare dictionary of counts
    var miceCounts = {
        "PP_BLAND"      : 0,
        "PP_MILD"       : 0,
        "PP_MED"        : 0,
        "PP_HOT"        : 0,
        "PP_FLAMIN"     : 0,

        "CQ_BLAND"      : 0,
        "CQ_MILD"       : 0,
        "CQ_MED"        : 0,
        "CQ_HOT"        : 0,
        "CQ_FLAMIN"     : 0,

        "QR_SB"         : 0,
        "QR_GOUDA"      : 0,
        "QQ"            : 0,

        "CORKATAUR"     : 0,
        "CORKY"         : 0,
        "CORK_FLAMIN"   : 0,
        "CORK_HOT"      : 0,
        "CORK_MED"      : 0,
        "CORK_MILD"     : 0,
        "CORK_BLAND"    : 0,

        "PRESSURE_MILD"     : 0,
        "PRESSURE_MED"      : 0,
        "PRESSURE_HOT"      : 0,
        "PRESSURE_FLAMIN"   : 0,
        "PRESSURE_WILDFIRE" : 0,

        "COLLAT_FLAMIN"     : 0,
        "COLLAT_HOT"        : 0,
        "COLLAT_MED"        : 0,
        "COLLAT_MILD"       : 0
    };

    // Get list of mice
    let miceNodeList = getMapMice();

    // Loop through list of mice
    miceNodeList.forEach(currentMouse => {
        currentMouse.querySelector("span").style = "color: black; font-size: 11px;";

        // Current mouse name
        const mouseName = currentMouse.querySelector(".treasureMapView-goals-group-goal-name").textContent;
        // log(currentMouse);

        // Check if current mouse is PP_BLAND
        if(PP_BLAND.indexOf(mouseName) > -1) {
            // Check if the PP_BLAND mouse is caught
            if (currentMouse.className.indexOf(" complete ") < 0) {
                // If not caught, then increment
                miceCounts["PP_BLAND"] = (miceCounts["PP_BLAND"] || 0) + 1;
            }

        }else if(PP_MILD.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["PP_MILD"] = (miceCounts["PP_MILD"] || 0) + 1;
            }

        }else if(PP_MED.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["PP_MED"] = (miceCounts["PP_MED"] || 0) + 1;
            }

        }else if(PP_HOT.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["PP_HOT"] = (miceCounts["PP_HOT"] || 0) + 1;
            }

        }else if(PP_FLAMIN.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["PP_FLAMIN"] = (miceCounts["PP_FLAMIN"] || 0) + 1;
            }

        }else if(CQ_BLAND.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["CQ_BLAND"] = (miceCounts["CQ_BLAND"] || 0) + 1;
            }

        }else if(CQ_MILD.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["CQ_MILD"] = (miceCounts["CQ_MILD"] || 0) + 1;
            }

        }else if(CQ_MED.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["CQ_MED"] = (miceCounts["CQ_MED"] || 0) + 1;
            }

        }else if(CQ_HOT.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["CQ_HOT"] = (miceCounts["CQ_HOT"] || 0) + 1;
            }

        }else if(CQ_FLAMIN.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["CQ_FLAMIN"] = (miceCounts["CQ_FLAMIN"] || 0) + 1;
            }

        }else if(QR_SB.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["QR_SB"] = (miceCounts["QR_SB"] || 0) + 1;
            }

        }else if(QR_GOUDA.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["QR_GOUDA"] = (miceCounts["QR_GOUDA"] || 0) + 1;
            }

        }else if(QQ.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["QQ"] = (miceCounts["QQ"] || 0) + 1;
            }

        }else if(CORKATAUR.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["CORKATAUR"] = (miceCounts["CORKATAUR"] || 0) + 1;
            }

        }else if(CORKY.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["CORKY"] = (miceCounts["CORKY"] || 0) + 1;
            }

        }else if(CORK_FLAMIN.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["CORK_FLAMIN"] = (miceCounts["CORK_FLAMIN"] || 0) + 1;
            }

        }else if(CORK_HOT.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["CORK_HOT"] = (miceCounts["CORK_HOT"] || 0) + 1;
            }

        }else if(CORK_MED.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["CORK_MED"] = (miceCounts["CORK_MED"] || 0) + 1;
            }

        }else if(CORK_MILD.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["CORK_MILD"] = (miceCounts["CORK_MILD"] || 0) + 1;
            }

        }else if(CORK_BLAND.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["CORK_BLAND"] = (miceCounts["CORK_BLAND"] || 0) + 1;
            }

        }else if(PRESSURE_MILD.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["PRESSURE_MILD"] = (miceCounts["PRESSURE_MILD"] || 0) + 1;
            }

        }else if(PRESSURE_MED.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["PRESSURE_MED"] = (miceCounts["PRESSURE_MED"] || 0) + 1;
            }
        }else if(PRESSURE_HOT.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["PRESSURE_HOT"] = (miceCounts["PRESSURE_HOT"] || 0) + 1;
            }

        }else if(PRESSURE_FLAMIN.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["PRESSURE_FLAMIN"] = (miceCounts["PRESSURE_FLAMIN"] || 0) + 1;
            }
        }else if(PRESSURE_WILDFIRE.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["PRESSURE_WILDFIRE"] = (miceCounts["PRESSURE_WILDFIRE"] || 0) + 1;
            }
        }else if(COLLAT_FLAMIN.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["COLLAT_FLAMIN"] = (miceCounts["COLLAT_FLAMIN"] || 0) + 1;
            }

        }else if(COLLAT_HOT.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["COLLAT_HOT"] = (miceCounts["COLLAT_HOT"] || 0) + 1;
            }
        }else if(COLLAT_MED.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["COLLAT_MED"] = (miceCounts["COLLAT_MED"] || 0) + 1;
            }

        }else if(COLLAT_MILD.indexOf(mouseName) > -1) {
            if (currentMouse.className.indexOf(" complete ") < 0) {
                miceCounts["COLLAT_MILD"] = (miceCounts["COLLAT_MILD"] || 0) + 1;
            }
        }
    });

    log(JSON.stringify(miceCounts, undefined, 2));
    return miceCounts;
}

// ================================= Mice Left Helpers =================================
/**
 * anyCorkMiceLeft Helper function to check if cork mice are left
 * @param {Dictionary} miceCounts Dictionary containing mice counts
 * @return {boolean} True if in mice found, false otherwise
 */
 function anyCorkMiceLeft(miceCounts) {
    if(miceCounts["CORKATAUR"] > 0
        || miceCounts["CORKY"] > 0
        || miceCounts["CORK_BLAND"] > 0
        || miceCounts["CORK_MILD"] > 0
        || miceCounts["CORK_MED"] > 0
        || miceCounts["CORK_HOT"] > 0
        || miceCounts["CORK_FLAMIN"] > 0) {
            log("Found cork mice");
            return true;
    }

    log("No cork mice found");
    return false;
}

/**
 * anyCorkMiceLeft Helper function to check if plains mice are left, except for inferna
 * @param {Dictionary} miceCounts Dictionary containing mice counts
 * @return {boolean} True if in mice found, false otherwise
 */
function anyPlainsMiceLeft(miceCounts) {
    if(miceCounts["PP_BLAND"] > 0
        || miceCounts["PP_MILD"] > 0
        || miceCounts["PP_MED"] > 0
        || miceCounts["PP_HOT"] > 0
        || miceCounts["PP_FLAMIN"] > 0) {
            log("Found Plains Mice");
            return true;
    }

    log("No Plains Mice Left");
    return false;
}

/**
 * anyCorkMiceLeft Helper function to check if quarry mice are left, except for nach
 * @param {Dictionary} miceCounts Dictionary containing mice counts
 * @return {boolean} True if in mice found, false otherwise
 */
function anyQuarryMiceLeft(miceCounts) {
    if(miceCounts["CQ_BLAND"] > 0
        || miceCounts["CQ_MILD"] > 0
        || miceCounts["CQ_MED"] > 0
        || miceCounts["CQ_HOT"] > 0) {
            log("Found Quarry Mice (Not Nach)");
            return true;
    }

    log("No Quarry Mice Left (Exclude Nach)");
    return false;
}

/**
 * anyCorkMiceLeft Helper function to check if river mice are left
 * @param {Dictionary} miceCounts Dictionary containing mice counts
 * @return {boolean} True if in mice found, false otherwise
 */
function anyRiverMiceLeft(miceCounts) {
    if(miceCounts["QR_SB"] > 0 || miceCounts["QR_GOUDA"] > 0) {
        log("Found River Mice");
        return true;
    }

    log("No River Mice");
    return false;
}

function anyPressureMiceLeft(miceCounts) {
    if(miceCounts["PRESSURE_WILDFIRE"] > 0
        || miceCounts["PRESSURE_FLAMIN"] > 0
        || miceCounts["PRESSURE_HOT"] > 0
        || miceCounts["PRESSURE_MED"] > 0
        || miceCounts["PRESSURE_MILD"] > 0) {
            log("Found pressure mice.");
            return true;
        }

    return false;
}

function anyEruptionCollatLeft(miceCounts) {
    if(miceCounts["COLLAT_HOT"] > 0
        || miceCounts["COLLAT_MED"] > 0
        || miceCounts["COLLAT_MILD"] > 0) {
            log("Found eruption collat mice.");
            return true;
        }

    return false;
}

// ================================= Core Helper Functions =================================
async function geyserSmall(miceCounts) {
    log("Geyser mice (up to small eruption) detected...");
    await travelTo("queso_geyser", "Queso Geyser");
    await setTrap(BEST_DRACONIC);
    await setBase(BEST_BASE);
    await claimNest();

    // Prioritize Cork Collecting
    if(anyCorkMiceLeft(miceCounts)) {
        corkCollecting(miceCounts);
    } else if(anyEruptionCollatLeft(miceCounts) || anyPressureMiceLeft(miceCounts)) {
        // Deal with eruption and pressure only after collecting is done
        huntSmallPressureOrEruption(miceCounts);
    } else {
        log("Shouldn't see this. Geyser is done.")
    }

    return;
}

async function corkCollecting(miceCounts) {
    setBase(BEST_BASE);
    if (user.quests.QuestQuesoGeyser.state == "collecting") {
        // Waterfall down the cheeses
        if((miceCounts["CORK_FLAMIN"] > 0) && getCheeseCount(FLAMIN) > 0) {
            log("Catching Rambutan in Cork");
            await setBait(FLAMIN);

        }else if(miceCounts["CORK_HOT"] > 0 && getCheeseCount(HOT) > 0) {
            log("Catching Hot Mice in Cork");
            await setBait(HOT);

        }else if(miceCounts["CORK_MED"] > 0 && getCheeseCount(MEDIUM) > 0) {
            log("Catching Med Mice in Cork");
            await setBait(MEDIUM);

        }else if(miceCounts["CORK_MILD"] > 0 && getCheeseCount(MILD) > 0) {
            log("Catching Mild Mice in Cork");
            await setBait(MILD);

        }else if(miceCounts["CORK_BLAND"] > 0) {
            log("Catching Bland Mice in Cork");
            await setBait(BLAND);

        }else if(miceCounts["CORKATAUR"] > 0 && getCheeseCount(WILDFIRE) > 0) {
            log("Catching Corkataur in Cork");
            await setBait(WILDFIRE);

        }else if(miceCounts["CORKY"] > 0 && getCheeseCount(FLAMIN) > 0) {
            log("Catching Corky in Cork");
            await setBait(FLAMIN);
        }

    }else if (user.quests.QuestQuesoGeyser.state == "corked") {
        log("Stuck in pressure building, shall deal with it first");
        await smallPressure(miceCounts);

    } else if (user.quests.QuestQuesoGeyser.state == "eruption") {
        log("Stuck in eruption, shall deal with it first");
        await smallEruption(miceCounts);
    }

    return;
}

async function huntSmallPressureOrEruption(miceCounts) {
    log("Found either small eruption and/or small pressure mice.");
    try {
        setBase(BEST_BASE);
        if(user.quests.QuestQuesoGeyser.state == "eruption") {
            log("Currently in eruption.");
            await smallEruption(miceCounts);

        }else if(user.quests.QuestQuesoGeyser.state == "corked") {
            log("Currently corked.");
            await smallPressure(miceCounts);

        }else if(user.quests.QuestQuesoGeyser.state == "collecting") {
            log("Currently cork collecting.");
            await enterSmallEruption();
            await sleep(2000);
            await smallPressure(miceCounts);
        }
    } catch (error) {
        log("Failed in small - " + error + " - reloading page...");
        refreshAfterDelay();
    }
}

async function smallPressure(miceCounts) {
    log("Hunting out small pressure...");
    if (miceCounts["PRESSURE_MILD"] > 0 && getCheeseCount(MILD) > 0) {
        log("Catching mild pressure.");
        await setBait(MILD);

    } else if(miceCounts["PRESSURE_MED"] > 0 && getCheeseCount(MEDIUM) > 0) {
        log("Catching medium pressure.");
        await setBait(MEDIUM);

    } else if(miceCounts["PRESSURE_HOT"] > 0 && getCheeseCount(HOT) > 0) {
        log("Catching hot pressure.");
        await setBait(HOT);

    } else if(miceCounts["PRESSURE_FLAMIN"] > 0 && getCheeseCount(FLAMIN) > 0) {
        log("Catching flamin pressure.");
        await setBait(FLAMIN);

    } else if(miceCounts["PRESSURE_WILDFIRE"] > 0 && getCheeseCount(WILDFIRE) > 0) {
        log("Catching wildfire pressure.");
        await setBait(WILDFIRE);

    } else {
        log("Just getting out of pressure building.");
        await setBait(HOT);

    }

    return;
}

async function smallEruption(miceCounts) {
    log("Hunting out small eruption...");
    if(miceCounts["COLLAT_HOT"] > 0 && getCheeseCount(HOT) > 0) {
        log("Catching Ignatia");
        await setBait(HOT);

    }else if(miceCounts["COLLAT_MED"] > 0 && getCheeseCount(MEDIUM) > 0) {
        log("Catching Smoldersnap");
        await setBait(MEDIUM);

    } else if(miceCounts["COLLAT_MILD"] > 0 && getCheeseCount(MILD) > 0){
        log("Catching Mild Spicekin");
        await setBait(MILD);

    } else {
        log("Small eruption mice done, just hunting it out and farming flamin");
        await turnOnTonic();
        await setBait(HOT);

    }

    return;
}

/**
 * WILL BE DEPRECATED ONCE ENHANCED FARMING IS COMPLETE
 * plainsMildFarming Function to go back to plains and farm using bland
*/
async function plainsMildFarming() {
    await travelTo("queso_plains", "Prickly Plains");
    await setTrap(BEST_ARCANE);
    await setBase(GIFTBASE);
    await setDefaultCharm();
    await setBait(BLAND);
    return;
}

async function huntPlains(miceCounts) {
    log("Plains mice found. Proceeding to hunt in Plains...");
    await travelTo("queso_plains", "Prickly Plains");
    await setTrap(BEST_ARCANE);

    if(miceCounts["PP_BLAND"] > 0) {
        log("Hunting bland mice in plains.");
        await setBait(BLAND);

    }else if(miceCounts["PP_MILD"] > 0 && getCheeseCount(MILD) > 0) {
        log("Hunting mild mice in plains.");
        await setBait(MILD);

    }else if(miceCounts["PP_MED"] > 0 && getCheeseCount(MEDIUM) > 0) {
        log("Hunting med mice in plains.");
        await setBait(MEDIUM);

    }else if(miceCounts["PP_HOT"] > 0 && getCheeseCount(HOT) > 0) {
        log("Hunting hot mice in plains.");
        await setBait(HOT);
    }else if(miceCounts["PP_FLAMIN"] > 0 && getCheeseCount(FLAMIN) > 0) {
        log("Hunting flamin mice in plains.");
        await setBase(BEST_BASE);
        await setCharm(HIGH_POWER_CHARM)
        await setBait(FLAMIN);
    }

    return;
}

async function huntQuarry(miceCounts) {
    log("Quarry mice found. Proceeding to hunt in Quarry...");
    await travelTo("queso_quarry", "Cantera Quarry");
    await setTrap(BEST_SHADOW);
    await setBase(GIFTBASE);

    if(miceCounts["CQ_BLAND"] > 0) {
        log("Hunting bland mice in quarry.");
        await setBait(BLAND);

    }else if(miceCounts["CQ_MILD"] > 0 && getCheeseCount(MILD) > 0) {
        log("Hunting mild mice in quarry.");
        await setBait(MILD);

    }else if(miceCounts["CQ_MED"] > 0 && getCheeseCount(MEDIUM) > 0) {
        log("Hunting med mice in quarry.");
        await setBait(MEDIUM);
    }else if(miceCounts["CQ_HOT"] > 0 && getCheeseCount(HOT) > 0) {
        log("Hunting hot mice in quarry.");
        await setBait(HOT);
    }

    return;
}

async function huntRiver(miceCounts) {
    await travelTo("queso_river", "Queso River");
    await setTrap(BEST_LAW);

    if(miceCounts["QQ"] > 0 && getTotalLuck() > 43 && getCheeseCount(WILDFIRE) > 7) {
        log("Favorable conditions to catch QQ, shall attempt...")
        await huntQQ();
    }else if(miceCounts["QR_SB"] > 0) {
        log("Catching SB Mice in river.");
        await setBase(BEST_BASE);
        setDefaultCharm();
        await setBait(SB);
    }else if(miceCounts["QR_GOUDA"] > 0) {
        log("Catching Gouda Mice in river.");
        await setBase(GIFTBASE);
        setDefaultCharm();
        await setBait(GOUDA);
    }

    return;
}

async function huntQQ() {
    log("Hunting for QQ...");
    await travelTo("queso_river", "Queso River");
    await setTrap(BEST_LAW);
    await setBase(WILDFIRE)
    await setCharm(HIGH_POWER_CHARM);
    await setBait(BEST_BASE);
}

// ================================= MODE Functions =================================
async function lowPowerCore(miceCounts, quarryMode) {
    log("Low Power Core Running....");
    log("Checking mice counts...");
    log(miceCounts);
    turnOffTonic();
    setDefaultCharm();
    setBase(GIFTBASE);
    // Check Plains
    if(anyPlainsMiceLeft(miceCounts) && !quarryMode) {
        await huntPlains(miceCounts);

        // Check Quarry
    } else if(anyQuarryMiceLeft(miceCounts) && quarryMode) {
        await huntQuarry(miceCounts);

    // Else, check river
    } else if(anyRiverMiceLeft(miceCounts)) {
        await huntRiver(miceCounts);

    // Else, go to cork
    } else if(anyCorkMiceLeft(miceCounts)) {
        //TODO : CHECK CHEESE LEVELS
        await huntCork(miceCounts);

    // If we are quarry mode and there are plains mice left
    } else if(anyPlainsMiceLeft(miceCounts) && quarryMode) {
        log("Assisting with plains mice");
        await huntPlains(miceCounts);

    } else if(anyPlainsMiceLeft(miceCounts) && quarryMode) {
        log("Assisting with quarry mice");
        await huntQuarry(miceCounts);

    } else{
        log("Low power core tasks completed, returning to Plains...");
        plainsMildFarming();
    }
    log("Low Power Core Cycle Complete");
    return;
}

async function mediumFromGeyser(miceCounts) {
    log("Medium Core (From Geyser) Running...");
    log("Checking mice counts...");

    turnOffTonic();
    setDefaultCharm();
    setBase(GIFTBASE);

    if(anyCorkMiceLeft(miceCounts)
        || anyEruptionCollatLeft(miceCounts)
        || anyPressureMiceLeft(miceCounts)) {
            log("Geyser mice found...");
            await geyserSmall(miceCounts);

    }else if(anyRiverMiceLeft(miceCounts)) {
        log("River mice found...");
        await huntRiver(miceCounts);

    }else if(anyQuarryMiceLeft(miceCounts)) {
        log("Quarry mice found...");
        await huntQuarry(miceCounts);

    }else if(anyPlainsMiceLeft(miceCounts)) {
        log("Plains mice found...");
        await huntPlains(miceCounts);

    } else if(miceCounts["QQ"] > 0 && getCheeseCount(WILDFIRE) > 7) {
        log("Have some extra WF, attempt to catch QQ");
        await huntQQ();

    } else {
        log("Objective complete, returning to plains...");
        plainsMildFarming();
    }
    log("Medium Core Cycle Complete.");
    return;
}

async function mediumToGeyser(miceCounts) {
    log("Medium Core (To Geyser) Running...");
    log("Checking mice counts...");

    turnOffTonic();
    setDefaultCharm();
    setBase(GIFTBASE);

    if(anyRiverMiceLeft(miceCounts)) {
        log("River mice found...");
        await huntRiver(miceCounts);

    }else if(anyQuarryMiceLeft(miceCounts)) {
        log("Quarry mice found...");
        await huntQuarry(miceCounts);

    }else if(anyPlainsMiceLeft(miceCounts)) {
        log("Plains mice found...");
        await huntPlains(miceCounts);

    } else if(anyCorkMiceLeft(miceCounts)
    || anyEruptionCollatLeft(miceCounts)
    || anyPressureMiceLeft(miceCounts)) {
        log("Geyser mice found...");
        await geyserSmall(miceCounts);

    } else if(miceCounts["QQ"] > 0 && getCheeseCount(WILDFIRE) > 7) {
        log("Have some extra WF, attempt to catch QQ");
        await huntQQ();

    } else {
        log("Objective complete, returning to plains...");
        plainsMildFarming();
    }

    log("Medium Core Cycle Complete.");
    return;
}

// ================================= Core Functions =================================
async function run() {
    // prepare GT Map
    log("Running...");

    if(await catchingNach()) {
        log("Currently hunting Nach, will not interfere with gameplay.");
        return;
    }

    if (await inGTMap()) {
        log("We are in a GT Map, starting core...");

        let miceCounts = getUncaughtCountDict();
        let inviteNeeded = await checkIfInviteNeeded();
        await closeMap();

        if(MODE == LOW_PLAINS) {
            log("Low Power Core Plains Mode");
            await lowPowerCore(miceCounts, false);

        }else if(MODE == LOW_QUARRY) {
            log("Low Power Core Quarry Mode");
            await lowPowerCore(miceCounts, true);

        }else if(MODE == SINGLE_CORE_FROM_GEYSER) {
            log("Medium Power Core From Geyser Mode");
            await mediumFromGeyser(miceCounts);

        }else if(MODE == SINGLE_CORE_TO_GEYSER) {
            log("Medium Power Core To Geyser Mode");
            await mediumToGeyser(miceCounts);
        }

        // await pressCamp();

        supplyLog("Checking cheese status.");

        if(needToReplenishCheese() && MODE != INVITE) {
            await replenishCheese();
        }

        await sleep(1000);
        if(inviteNeeded) {
            await AutoInvite();
        }else{
            log("Invites not needed.");
        }

        log("One cycle complete...");
        return 0;
    }else {
        log("No GT Map detected, will proceed to farm.");
        plainsMildFarming();
    }

    return 1;
}

async function firstRun() {
    try {
        log("Attempting first cycle...");
        await sleep(2000);
        await run();
        await sleep(2000);
    } catch (error) {
        log("Failed first attempt - " + error);
    }
    return;
}

async function intervalRun() {
    try {
        log("Attempting to run interval cycles...");
        await run();
    } catch (error) {
        log("Cycle failed due to " + error + ". Refreshing page soon...");
        refreshAfterDelay();
    }
    return;
}

async function startUp() {
    await sleep(1000);
    log("Script Started with the following settings : "
    +"\n\tTrap Preset : " + TRAP_PRESET
    +"\n\tMode : " + MODE);
    return;
}

async function runInit() {
    await sleep(1000);
    await firstRun();
    await sleep(15000);
}
async function inviteInit() {
    await sleep(1000);
    await AutoInvite();
    await sleep(15000);
}

async function printStartUp() {
    await startUp();
}


printStartUp();

if(MODE == INVITE) {
    log("Invite Mode...");
    inviteInit();
    setInterval(async function(){
        await AutoInvite();
        log("Waiting " + INTERVAL_MILLISECONDS + "ms before next update.")
    }
    , INTERVAL_MILLISECONDS);

} else{
    runInit();
    // Run code with interval
    setInterval(async function(){
        await sleep(2000);
        await intervalRun();
        await sleep(2000);
        log("Waiting " + INTERVAL_MILLISECONDS + "ms before next update.")
    }
    , INTERVAL_MILLISECONDS);
}
