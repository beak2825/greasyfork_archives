// ==UserScript==
// @name         LG All-in-1
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  Auto LG
// @author       You
// @match        https://longtail-new.mousehuntgame.com/
// @grant        GM_info
// @run-at        document-end
// @include        http://mousehuntgame.com/*
// @include        https://mousehuntgame.com/*
// @include        http://www.mousehuntgame.com/*
// @include        https://www.mousehuntgame.com/*
// @include        http://apps.facebook.com/mousehunt/*
// @include        https://apps.facebook.com/mousehunt/*
// @include        http://hi5.com/friend/games/MouseHunt*
// @include        http://mousehunt.hi5.hitgrab.com/*
// @grant        unsafeWindow
// @grant        GM_info
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/416374/LG%20All-in-1.user.js
// @updateURL https://update.greasyfork.org/scripts/416374/LG%20All-in-1.meta.js
// ==/UserScript==

console.log('LG All-in-1 enabled');

(function() {
    const interval = setInterval(function() {
        //Insert functions here
        getStats();
        twistedCheck();
    }, 30000); // set checking interval here (in miliseconds, 5000 = 5s)
})();

//SETTINGS

var twistedMode = true; //Set to true when wanting to hunt in Twisted Garden/Cursed City/SandCrypts, or false for Living Garden/Lost City/Sand Dunes
var shatteringMode = false; //Set to true when hunting shattered bosses

var bestBase = 2620; //Prestige = 2904 | OESB = 2620 
var bestHydro = 2843; //QFT = 2843
var bestArcane = 2224; //DroidMage = 2224
var bestShadow = 2225; //IDCT = 2225

//Living Garden & Twisted Garden Settings

var minigameLG = true; //Set to true to automatically play the living garden pour minigame, otherwise false
var baitLivingGarden = 98; //SB = 114 | ESB = 1967 | BRIE = 80 | EB = 1966 | GOUDA = 98
var baseLivingGarden = 2094; //Living = 2094 | Prestige = 2904 | Desert Heater = 2952 | OESB = 2620 |
var baseCollectingLivingDews = 2094; //Base to use when collecting blue dew drops
var charmLivingGarden = 1290; //Snowball = 1290 | Charm to use when poured/not playing pour minigame

var minigameTG = true; //Set to true to automatically play the twisted garden pour minigame, otherwise false, this setting is overrided by carmineHunting below
var baseTwistedGarden = 2094; //Base to use when poured/not playing pour minigame
var baseCollectingTwistedDews = 2094; //Base to use when collected red/yellow dew drops
var charmTwistedGarden = 1290; //Charm to use when poured/not playing pour minigame

var carmineHunting = 1; //Set to 1 when not hunting carmines, 2 when hunting carmines without pouring, 3 to hunt carmines and automatically maintain poured state
var charmCarmine = 1290; //Charm to use when hunting carmines

//Lost City & Cursed City Settings

var minigameLC = true; //Set to true to automatically dispell lost city curse, otherwise false
var baseLostCity = 2094;
var baseDispellLost = 2094; //Base to use when dispelling curse
var charmLostCity = 1290; //Charm to use when curse is lifted/not playing curse minigame

var minigameCC = true; //Set to true to automatically dispell cursed city curses, otherwise false
var baseCursedCity = 2094;
var baseDispellCursed = 2094; //Base to use when dispelling curses
var charmCursedCity = 1290; //Charm to use when curses are lifted/not playing curse minigame, 1133 for safeguard

//Sand Dunes & Sand Crypts Settings

var minigameSD = true; //Set to true to automatically play stampede minigame, otherwise false
var charmStampede = 1016; //Charm to use when there is a stampede, recommended 1016 (grubling chow) for grublings
var charmNoStampede = 1131; //Charm to use when there is no stampede, 1131 (grubling bonanza) to force a stampede
var baseSandDunes = 2094; //Base to use in sand dunes
var charmSandDunes = 1290; //Charm to use when not playing sand dunes minigame

var minigameSC = true; //Set to true to automatically play the king grub minigame, otherwise false
var optimalSalt = 20; //Accepts integers between 0 and 50 inclusive, use CRE to check for optimal salt
var baseSandCrypts = 2094; //Base to use in sand crypts
var charmSandCrypts = 1290; //Charm to use when not playing sand crypts minigame
var superSalt = false; //Set to true if you want to use super salts charms for charging, make sure you have enough charms to reach optimalSalt

//SETTINGS END

/*CLASS IDs IN USE
100 = LG confirm pour
101 = TG confirm pour
*/

var currentBait = '';
var currentTrap = '';
var currentBase = '';
var currentCharm = '';
var currentLoc = '';
var dewthief = 1007;
var duskshade = 1008;
var graveblossom = 1009;
var lunaria = 1010;

function getStats() {
    currentBait = user.bait_item_id;
    currentTrap = user.weapon_item_id;
    currentBase = user.base_item_id;
    currentCharm = user.trinket_item_id;
    currentLoc = user.environment_name;
};

function twistedCheck() {
    if (currentLoc == "Twisted Garden" || currentLoc == "Sand Crypts" || currentLoc == "Cursed City") {
        if (twistedMode == false) {
            travelTo("desert_oasis")
            setBait(baitLivingGarden);
            setTrap(bestHydro);
            setBase(baseLivingGarden);
            setCharm(charmLivingGarden);
        }
        else if (twistedMode == true) {
            locationCheck();
        }
    }
    else if (currentLoc == "Living Garden" || currentLoc == "Sand Dunes" || currentLoc == "Lost City") {
        if (twistedMode == true) {
            travelTo("desert_oasis");
            setBait(duskshade);
            setTrap(bestHydro);
            setBase(baseTwistedGarden);
            setCharm(charmTwistedGarden);
        }
        else if (twistedMode == false) {
            locationCheck();
        }
    }
}
function locationCheck() {
    switch(currentLoc) {
        case "Living Garden":
            livingGarden();
            break;
        case "Lost City":
            lostCity();
            break;
        case "Sand Dunes":
            sandDunes();
            break;
        case "Twisted Garden":
            twistedGarden();
            break;
        case "Cursed City":
            cursedCity();
            break;
        case "Sand Crypts":
            sandCrypts();
            break;
        default:
            return;
    };
};

function livingGarden() {
    //Checks Trap & Cheese Setup
    setTrap(bestHydro);
    setBait(baitLivingGarden);
    //Checks for LG minigame
    if (minigameLG == true) {
        if (user.quests.QuestLivingGarden.minigame.bucket_state == "filling") {
            if (user.quests.QuestLivingGarden.minigame.dewdrops < 20) {
                setCharm(1020); //Sponge Charm
                setBase(baseCollectingLivingDews);
            }
            else if (user.quests.QuestLivingGarden.minigame.dewdrops == 20) {
                app.views.HeadsUpDisplayView.hud.livingGardenConfirmPour();
                setTimeout(function(){
                    document.getElementsByClassName('confirm button')[0].id = 100;
                    setTimeout(function() {
                        document.getElementById('100').click()
                    }, 1000);
                }, 1000);
            }
        }
        else if (user.quests.QuestLivingGarden.minigame.bucket_state == "dumped") {
            setCharm(charmLivingGarden);
            setBase(baseLivingGarden);
        }
    }
    else {
        setCharm(charmLivingGarden);
        setBase(baseLivingGarden);      
    }
};

function lostCity() {
    //Checks Cheese & Trap Setup
    setBait(dewthief);
    setTrap(bestArcane);
    //Checks for LC minigame
    if (minigameLC == true) {
        if (user.quests.QuestLostCity.minigame.is_cursed == true) {
            setCharm(1018); //Searcher Charm
            setBase(baseDispellLost);
        }
        else if (user.quests.QuestLostCity.minigame.is_cursed != true) {
            setCharm(charmLostCity);
            setBase(baseLostCity);
        }
    }
    else {
        setCharm(charmLostCity);
        setBase(baseLostCity);
    }
};

function sandDunes() {
    //Checks Cheese & Trap Setup
    setTrap(bestShadow);
    setBait(dewthief);
    setBase(baseSandDunes);
    //Checks for SD minigame
    if (minigameSD == true) {
        if (user.quests.QuestSandDunes.minigame.has_stampede == true) {
            setCharm(charmStampede);
        }
        else if (user.quests.QuestSandDunes.minigame.has_stampede != true) {
            setCharm(charmNoStampede);
        }
    }
    else {
        setCharm(charmNoStampede);
    }
};

function twistedGarden() {
    //Checks trap and cheese setup
    setTrap(bestHydro);
    //Checks for TG hunting mode
    if (carmineHunting == 1) {
        setBait(duskshade);
    //Checks for TG minigame
        if (minigameTG == true) {
            if (user.quests.QuestLivingGarden.minigame.vials_state == "filling") {
                if (user.quests.QuestLivingGarden.minigame.yellow_drops < 10) {
                    setCharm(1022);
                    setBase(baseCollectingTwistedDews);
                }
                else if (user.quests.QuestLivingGarden.minigame.red_drops < 10) {
                    setCharm(1017);
                    setBase(baseCollectingTwistedDews);
                }
                else if (user.quests.QuestLivingGarden.minigame.red_drops == 10 && user.quests.QuestLivingGarden.minigame.yellow_drops == 10) {
                    app.views.HeadsUpDisplayView.hud.livingGardenConfirmPour()
                    setTimeout(function () {
                        document.getElementsByClassName('confirm button')[0].id = 101;
                        setTimeout(function() {
                            document.getElementById('101').click()
                        }, 1000);
                    }, 1000)
                }
            }
            else if (user.quests.QuestLivingGarden.minigame.vials_state == "dumped") {
                setCharm(charmTwistedGarden);
                setBase(baseTwistedGarden);
            }
        }
        else {
            setCharm(charmTwistedGarden);
            setBase(baseTwistedGarden);
        }
    }
    else if (carmineHunting == 2) {
        setBait(lunaria);
        setCharm(charmCarmine);
        setBase(bestBase)
    }
    else if (carmineHunting == 3) {
        if (user.quests.QuestLivingGarden.minigame.vials_state == "filling") {
            setBait(duskshade);
            if (user.quests.QuestLivingGarden.minigame.yellow_drops < 10) {
                setCharm(1022);
                setBase(baseCollectingTwistedDews);
            }
            else if (user.quests.QuestLivingGarden.minigame.red_drops < 10) {
                setCharm(1017);
                setBase(baseCollectingTwistedDews);
            }
            else if (user.quests.QuestLivingGarden.minigame.red_drops == 10 && user.quests.QuestLivingGarden.minigame.yellow_drops == 10) {
                app.views.HeadsUpDisplayView.hud.livingGardenConfirmPour()
                setTimeout(function () {
                    document.getElementsByClassName('confirm button')[0].id = 101;
                    setTimeout(function() {
                        document.getElementById('101').click()
                    }, 1000);
                }, 1000)
            }
        }
        else if (user.quests.QuestLivingGarden.minigame.vials_state == "dumped") {
            setCharm(charmCarmine);
            setBase(bestBase);
            setBait(lunaria);
        }
    }
};

function cursedCity() {
    //Checks Cheese & Trap Setup
    setBait(graveblossom);
    setTrap(bestArcane);
    if (minigameCC == true) {
        if (user.quests.QuestLostCity.minigame.is_cursed == true) {
            //Checks Base setup
            setBase(baseDispellCursed);
            //Checks for fear curse
            if (user.quests.QuestLostCity.minigame.curses[0].active == "1") {
                setCharm(1011);
            }
            else if (user.quests.QuestLostCity.minigame.curses[1].active == "1") {
                setCharm(1019);
            }
            else if (user.quests.QuestLostCity.minigame.curses[2].active == "1") {
                setCharm(1012);
            }
        }
        else if (user.quests.QuestLostCity.minigame.is_cursed != true) {
            setCharm(charmCursedCity);
            setBase(baseCursedCity);
        }
    }
    else {
        setCharm(charmCursedCity);
        setBase(baseCursedCity);
    }
};

function sandCrypts() {
    setBait(graveblossom);
    setTrap(bestShadow);
    setBase(baseSandCrypts);
    //Checks for SC minigame
    if (minigameSC == true) {
        if (user.quests.QuestSandDunes.minigame.salt_charms_used < optimalSalt) {
            if (superSalt == true) {
                setCharm(1134) //super salt
            }
            else if (superSalt != true) {
                setCharm(1014) //salt charm
            }
        }
        else if (user.quests.QuestSandDunes.minigame.salt_charms_used >= optimalSalt) {
            setCharm(1015) //grub scent
        }
    }
    else {
        setCharm(charmSandCrypts);
    }
};

//Travel Control
function travelTo(location) {
    if (user.environment_type != location) {
        app.pages.TravelPage.travel(location);
        console.log("Travelled to " + location);
    }
}

//Trap Control
function setTrap(trapID) {
    if (currentTrap != trapID) {
        hg.utils.TrapControl.setWeapon(trapID).go();
        console.log("Trap " + trapID + " armed!");
    };
};

function setBait(baitID) {
    if (currentBait != baitID) {
        hg.utils.TrapControl.setBait(baitID).go();
        console.log("Bait " + baitID + " armed!");
    };
};

function setCharm(charmID) {
    if (currentCharm != charmID) {
        hg.utils.TrapControl.setTrinket(charmID).go();
        console.log("Charm " + charmID + " armed!");
    };
};

function setBase(baseID) {
    if (currentBase != baseID) {
        hg.utils.TrapControl.setBase(baseID).go();
        console.log("Base " + baseID + " armed!");
    };
};