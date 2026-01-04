// ==UserScript==
// @name         DHM 2.0
// @namespace    com.Ethan.dhmm
// @version      1.0.0
// @description  Automate most of DHM features
// @author       Ethan
// @require      https://greasyfork.org/scripts/461221-hack-timer-js-by-turuslan/code/Hack%20Timerjs%20By%20Turuslan.js?version=1159560
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @require      https://greasyfork.org/scripts/478182-pubnub-js/code/PubNub%20JS.js?version=1269788
// @match        https://dhm.idle-pixel.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @match        https://dhm.idle-pixel.com/
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/481332/DHM%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/481332/DHM%2020.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
$("head").append('<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script><script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script><script src="https://cdn.pubnub.com/sdk/javascript/pubnub.7.4.1.js"></script><link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css" type="text/css">');
//Variables
window.scriptVars = {toggleGlobal:true, toggleMap:true, toggleGeodeOpen:false, toggleMineralIdentify:false, toggleNecklaceCharge:false, toggleTrain:false, toggleRocket:false, toggleSmelting:true, toggleRefinary:false, toggleCharcoal:false, toggleWoodcutting:true, toggleFarming:false, toggleBones:false, toggleFertilize:false, toggleDrink:false, toggleTreeUpgrade:false, toggleBrew:false, toggleExplore:false, toggleFight:false, toggleResetFight:false, toggleMonsterFind:false, toggleSpell:false, toggleCombatPotion:false, toggleHeal:true, toggleShiny:false, toggleCombatSwap:true, toggleBM:false, toggleCousin:false, toggleBags:false, toggleFieldsBags:false, toggleStatue:false, toggleArtifact:false, toggleBoat:true, toggleEvent:true, scriptTrainAmount:1, scriptRocket:'moon', scriptSmeltingOre:'copper', scriptRefinaryBar:'gold', scriptFoundryWood:'cheapest', scriptTreeIgnore:{tree:false,oakTree:false,willowTree:false,mapleTree: false,redwoodTree:false,pineTree:false,hauntedTree:false,jungleTree:true,lavaTree:false,goldTree:true,magicTree:false,appleTree:false,cactusTree:false,bananaTree:false,palmTree:false,pineappleTree:true,starfruitTree:false,none:true}, scriptBonesIgnore:{bones:true,ashes:false,iceBones:true,zombieBones:true,bloodBones:true,fishBones:true}, scriptFertilize:{redMushroomSeeds:false,dottedGreenLeafSeeds:false,greenLeafSeeds:false,limeLeafSeeds:false,goldLeafSeeds:false,crystalLeafSeeds:false,stripedGreenLeafSeeds:false,stripedGoldLeafSeeds:false,stripedCrystalLeafSeeds:false}, scriptTreeUpgrade:{tree:false,oakTree:false,willowTree:false,mapleTree:false,redwoodTree:false,pineTree:false,hauntedTree:false,jungleTree:true,lavaTree:false,goldTree:true,magicTree:false,appleTree:false,cactusTree:false,bananaTree:false,palmTree:false,pineappleTree:true,starfruitTree:false,none:false}, scriptArea:'fields', scriptResetArea:{fields:false,forests:false,caves:false,volcano:false,northernFields:false,hauntedMansion:false,desert:false,ocean:false,jungle:false,dungeonEntrance:false,dungeon:false,castle:false,cemetery:false,factory:false,hauntedWoods:false,deepOcean:false}, scriptMonster:'chicken', scriptCousinArea:'fields', scriptBoatSend:{rowBoat:true,canoeBoat:true,sailBoat:true,highWind:true,steamBoat:true,trawler:true}}
//Const
const scriptAreaEnergy = {fields:50,forests:250,caves:1000,volcano:5000,northernFields:8000,hauntedMansion:20000,desert:50000,ocean:120000,jungle:200000,dungeonEntrance:500000,dungeon:1000000,castle:3000000,cemetery:7000000,factory:10000000,hauntedWoods:14000000,deepOcean:20000000}
const scriptAreaTimer = {fields:900,forests:1800,caves:3600,volcano:5400,northernFields:3600*2,hauntedMansion:3600*3,desert:3600*4+1800,ocean:3600*6,jungle:3600*8,dungeonEntrance:3600*10,dungeon:3600*12,castle:3600*15,cemetery:3600*16,factory:3600*18,hauntedWoods:3600*20,deepOcean:3600*23}
const artifactArray = ['brokenSwordArtifact', 'cannonBallsArtifact', 'oldCannonArtifact', 'strangeLeafArtifact', 'ancientLogArtifact', 'rainbowFlowerArtifact', 'clayVaseArtifact', 'batWingArtifact', 'skullArtifact', 'sulferArtifact', 'volcanicRockArtifact', 'volcanicSmokeArtifact', 'iceArtifact', 'snowballsArtifact', 'frozenHeadArtifact', 'spiderLegsArtifact', 'broomArtifact', 'hauntedSkullArtifact', 'scorpionsTailArtifact', 'mummyArtifact', 'egyptKingArtifact', 'fossilArtifact', 'scubaArtifact', 'sharksJawArtifact', 'strangerLeafArtifact', 'mossyRockArtifact', 'monkeySkullArtifact', 'strangeJungleLeafArtifact', 'inukshukArtifact', 'hauntedMonkeySkullArtifact', 'dungeonBrickArtifact', 'candleStickArtifact', 'skeletonKingsHeadArtifact', 'lampArtifact', 'brokenShieldArtifact', 'dragonSkullArtifact', 'tombStoneArtifact', 'zombieHandArtifact', 'ancientCrossArtifact', 'cogWheelArtifact', 'robotHelmetArtifact', 'brokenTimeMachineArtifact', 'hauntedLeavesArtifact', 'eyeballArtifact', 'ghostScanPotionArtifact', 'deepFossilArtifact', 'starfishArtifact', 'ancientScubaArtifact']
const bagsArray = ['fieldsLoot', 'forestsLoot', 'cavesLoot', 'volcanoLoot', 'northernFieldsLoot', 'hauntedMansionLoot', 'desertLoot', 'oceanLoot', 'jungleLoot', 'dungeonEntranceLoot', 'dungeonLoot', 'castleLoot', 'cemeteryLoot', 'factoryLoot', 'hauntedWoodsLoot', 'deepOceanLoot', 'shinyFieldsLoot', 'shinyForestsLoot', 'shinyCavesLoot', 'shinyVolcanoLoot', 'shinyNorthernFieldsLoot', 'shinyHauntedMansionLoot', 'shinyDesertLoot', 'shinyOceanLoot', 'shinyJungleLoot', 'shinyDungeonEntranceLoot', 'shinyDungeonLoot', 'shinyCastleLoot', 'shinyCemeteryLoot', 'shinyFactoryLoot', 'shinyHauntedWoodsLoot', 'shinyDeepOceanLoot']
var scriptWaitTeleport = true
var oldEquip = []
var oldWeapon;
const melee = ['rustySword','stinger','ironDagger','skeletonSword','enchantedSkeletonSword','scythe','enchantedScythe','poisonSpear','superPoisonSpear','mace','trident','superPoisonTrident','silverScimitar']
const ranged = ['bow','superBow','enchantedSuperBow']
//const scriptComplexMonsters = ['desertLizard2', 'robotMage', 'bloodGolem', 'bloodDesertLizard2', 'bloodPufferFish']
const cookableFood = ['rawShrimp', 'rawSardine', 'rawChicken', 'rawTuna', 'rawSnail', 'rawPiranha', 'rawSwordfish', 'rawSeaTurtle', 'rawLobster', 'rawEel', 'rawShark', 'rawCrab', 'rawMantaRay', 'rawBloodChicken', 'rawWhale', 'rawRainbowFish']
const oldHideAllTabs = hideAllTabs
const blockedHTML = ['<iframe','<button','<script','<html','<link','<div','<footer','onclick','<object','<embed','<form','<meta','onmouseover','onmouseout','onmousemove','<input','<applet','javascript:']
const ding = new Audio("https://github.com/Dounford-Felipe/DHM-Audio-Alerts/raw/main/ding.wav")
 
window.hideAllTabs = function() {
	oldHideAllTabs()
	document.getElementById("tab-scriptConfig").style.display = "none";
	document.getElementById("tab-scriptConfigMining").style.display = "none";
	document.getElementById("tab-scriptConfigCrafting").style.display = "none";
	document.getElementById("tab-scriptConfigWoodcutting").style.display = "none";
	document.getElementById("tab-scriptConfigFarming").style.display = "none";
	document.getElementById("tab-scriptConfigSeeds").style.display = "none";
	document.getElementById("tab-scriptConfigBrewing").style.display = "none";
	document.getElementById("tab-scriptConfigPotions").style.display = "none";
	document.getElementById("tab-scriptConfigExploring").style.display = "none";
	document.getElementById("tab-scriptConfigCooking").style.display = "none";
}
 
function autoEvent() {
	if (eventName !== 'none' && (eventStatus == 'active' || eventStatus == 'fullActive') && eventLastClicked == 'none') {
        sendBytes('CLICKS_EVENT')
    }
	var glowingInterval = setInterval(function() {
        if (eventStatus == 'fullActive') {
            sendBytes('CLICKS_EVENT')
        } else {
            clearInterval(glowingInterval);
        }
    }, 10);
}
 
function autoMap() {
	if (treasureMap !== 0) {
		if(treasureMap == 1) {
			if (shrimp > 0) {
				sendBytes('CONSUME=shrimp~1');
			}
		}
		if(treasureMap == 2) clicksItem('timeMachine');
		if(treasureMap == 3) {
			if (smeltingCurrentOreType == 'none') {
				sendBytes("SMELT=gold~1");
			}
		}
		if(treasureMap == 4) {
			if (furnaceSpeedPotion > 0) {
				sendBytes('DRINK=furnaceSpeedPotion');
			}
		}
		if(treasureMap == 5) {
			if (dottedGreenLeaf > 0) {
				sendBytes('SELL=dottedGreenLeaf~1');
			}
		}
		if(treasureMap == 6) viewTreesChopped();
		if(treasureMap == 7) clicksItem('bloodCrystals');
	}
	if (greenTreasureMap !== 0) {
		if(greenTreasureMap == 1) {
			if (iceBones > 0) {
				sendBytes('ADD_BONEMEAL=iceBones~1')
			}
		}
		if(greenTreasureMap == 2) {
			if ((charcoalFoundryCurrentOreType == 0 || charcoalFoundryCurrentOreType == 'none') && lava > 0) {
				sendBytes('CHARCOAL_FOUNDRY=logs~1')
			}
		}
		if(greenTreasureMap == 3) {
			let oldMachineOn = crushersOn;
			sendBytes("TURN_ON=crushers~4");
			sendBytes("TURN_ON=crushers~"+oldMachineOn);
		}
		if(greenTreasureMap == 4) {
			if (goldLeaf > 0) {
				sendBytes('SELL=goldLeaf~1');
			}
		}
		if(greenTreasureMap == 5) clicksItem('titaniumMetalDetector')
		if(greenTreasureMap == 6) {
			navigate('bloodShop-enrichedPotions');
			sendBytes('VISITS_ENRICHED_POTIONS_SHOP')
		}
		if(greenTreasureMap == 7) clicksItem('wells')
	}
}
 
function autoGeodeOpen() {
	if (geode1 > 0) {
		sendBytes('OPEN_MULTIPLE_GEODE=geode1~'+geode1)
		closeSmittysDialogue('dialogue-confirm')
	}
	if (geode2 > 0) {
		sendBytes('OPEN_MULTIPLE_GEODE=geode2~'+geode2)
		closeSmittysDialogue('dialogue-confirm')
	}
	if (geode3 > 0) {
		sendBytes('OPEN_MULTIPLE_GEODE=geode3~'+geode3)
		closeSmittysDialogue('dialogue-confirm')
	}
	if (geode4 > 0) {
		sendBytes('OPEN_MULTIPLE_GEODE=geode4~'+geode4)
		closeSmittysDialogue('dialogue-confirm')
	}
	if (geode5 > 0) {
		sendBytes('OPEN_MULTIPLE_GEODE=geode5~'+geode5)
		closeSmittysDialogue('dialogue-confirm')
	}
	if (geode6 > 0) {
		sendBytes('OPEN_MULTIPLE_GEODE=geode6~'+geode6)
		closeSmittysDialogue('dialogue-confirm')
	}
}
 
function autoIdentify() {
	if (limeQuartzMineralUnidentified > 0) {
    	clicksItem('limeQuartzMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
	if (fluoriteMineralUnidentified > 0) {
    	clicksItem('fluoriteMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
	if (topazMineralUnidentified > 0) {
    	clicksItem('topazMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
	if (blueMarbleMineralUnidentified > 0) {
    	clicksItem('blueMarbleMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
	if (sulferMineralUnidentified > 0) {
    	clicksItem('sulferMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
	if (purpleQuartzMineralUnidentified > 0) {
    	clicksItem('purpleQuartzMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
	if (limoniteMineralUnidentified > 0) {
    	clicksItem('limoniteMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
	if (crystalPrismeMineralUnidentified > 0) {
    	clicksItem('crystalPrismeMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
	if (typeof clearMarbleMineralUnidentified !== 'undefined' && clearMarbleMineralUnidentified > 0) {
    	clicksItem('clearMarbleMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
	if (denseMarbleMineralUnidentified > 0) {
    	clicksItem('denseMarbleMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
	if (jadeMineralUnidentified > 0) {
    	clicksItem('jadeMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
	if (opalMineralUnidentified > 0) {
    	clicksItem('opalMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
	if (amethystMineralUnidentified > 0) {
    	clicksItem('amethystMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
	if (tashmarineMineralUnidentified > 0) {
    	clicksItem('tashmarineMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
	if (tanzaniteMineralUnidentified > 0) {
    	clicksItem('tanzaniteMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
	if (seaCrystalMineralUnidentified > 0) {
    	clicksItem('seaCrystalMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
	if (amberMineralUnidentified > 0) {
    	clicksItem('amberMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
	if (smoothPearlMineralUnidentified > 0) {
		clicksItem('smoothPearlMineralUnidentified');
    	closeSmittysDialogue('dialogue-confirm');
	}
}
 
function autoNecklaceCharge() {
	changeMineralNecklace()
}
 
function autoTrain() {
	if (train > 0 && trainTimer < 2 && oil >= 500000 * scriptVars.scriptTrainAmount) {
		sendBytes("MANAGE_TRAIN=0");
		sendBytes('COLLECT_TRAIN_FORCE');
		sendBytes('MANAGE_TRAIN='+scriptVars.scriptTrainAmount);
		closeSmittysDialogue('dialogue-confirm2');
	} else if (train > 0 && trainTimer == 1 && oil < 500000 * scriptVars.scriptTrainAmount) {
		sendBytes("MANAGE_TRAIN=0");
		sendBytes('COLLECT_TRAIN_FORCE');
		closeSmittysDialogue('dialogue-confirm2');
	}
}
 
function autoRocket() {
	if (rocketKm == 1) {
		sendBytes('MANAGE_ROCKET=collect2')
		closeSmittysDialogue('dialogue-confirm')
	} else if (rocket == 1 && rocketKm == 0) {
		if (scriptVars.scriptRocket == 'Moon' && oil >= 4000000) {
			sendBytes('MANAGE_ROCKET=send')
		} else if (scriptVars.scriptRocket == 'Mars' && oil >= 15000000) {
			sendBytes('MANAGE_ROCKET=send_mars')
		} else if (scriptVars.scriptRocket == 'Sun' & oil >= 30000000 && charcoal >= 100) {
			sendBytes('MANAGE_ROCKET=send_sun')
		}
	}
}
 
function autoSmelt() {
	if (smeltingCurrentOreType == 'none') {
    var oreItems = document.getElementById("sortableOres").getElementsByTagName("li")
 
    for (var i = 0; i < oreItems.length; i++) {
      var minimumOre = oreItems[i].querySelector(".oreMinimum").value;
      var selectedOre = oreItems[i].getAttribute("value");
      if (smeltingCurrentOreType == 'none' && window[selectedOre] >= minimumOre && (selectedOre !== 'promethium' || lava >= minimumOre) && (selectedOre !== 'titanium' || charcoal >= minimumOre) && (selectedOre !== 'ancientOre' || plasma >= minimumOre)) {
		chooseOreForFurnace(selectedOre)
		startSmelting()
		closeSmittysDialogue('dialogue-furnace2')
		console.log(selectedOre)
		break;
      }
    }
	}
}
 
function autoRefine() {
	if (barRefineryTimer < 2 && scriptVars.scriptRefinaryBar == 'gold' && oil > 500000 && goldBars > 99) {
		clicksItem('goldBarRefinery')
		sendBytes('REFINE_GOLD_BARS=goldBars')
		closeSmittysDialogue('dialogue-barRefinery');
		closeSmittysDialogue('dialogue-confirm')
 
	} else if (barRefineryTimer < 2 && scriptVars.scriptRefinaryBar == 'promethium' && oil > 2000000 && promethiumBars > 99) {
		clicksItem('goldBarRefinery')
		sendBytes('REFINE_GOLD_BARS=promethiumBars')
		closeSmittysDialogue('dialogue-barRefinery');
		closeSmittysDialogue('dialogue-confirm')
	}
}
 
function autoFoundry() {
	if (charcoalFoundryCurrentOreType == 0 || charcoalFoundryCurrentOreType == 'none') {
	let scriptFoundryWoodLocal = scriptVars.scriptFoundryWood
	if (scriptFoundryWoodLocal == 'cheapest') {
		logs > 100 ? scriptFoundryWoodLocal = 'logs'
		: oakLogs > 100 ? scriptFoundryWoodLocal = 'oakLogs'
		: willowLogs > 100 ? scriptFoundryWoodLocal = 'willowLogs'
		: mapleLogs > 100 ? scriptFoundryWoodLocal = 'mapleLogs'
		: redwoodLogs > 100 ? scriptFoundryWoodLocal = 'redwoodLogs'
		: pineLogs > 100 ? scriptFoundryWoodLocal = 'pineLogs'
		: hauntedLogs > 100 ? scriptFoundryWoodLocal = 'hauntedLogs'
		: jungleLogs > 100 ? scriptFoundryWoodLocal = 'jungleLogs'
		: lavaLogs > 100 ? scriptFoundryWoodLocal = 'lavaLogs'
		: goldLogs > 100 ? scriptFoundryWoodLocal = 'goldLogs'
		: magicLogs > 100 ? scriptFoundryWoodLocal = 'magicLogs'
		: scriptFoundryWoodLocal = 'none';
	}
	let scriptLava
	switch (scriptFoundryWoodLocal) {
		case 'logs':
		scriptLava = 1;
		break;
		case 'oakLogs':
		scriptLava = 2;
		break;
		case 'willowLogs':
		scriptLava = 3;
		break;
		case 'mapleLogs':
		scriptLava = 4;
		break;
		case 'redwoodLogs':
		scriptLava = 5;
		break;
		case 'pineLogs':
		scriptLava = 6;
		break;
		case 'hauntedLogs':
		scriptLava = 7;
		break;
		case 'jungleLogs':
		scriptLava = 8;
		break;
		case 'lavaLogs':
		scriptLava = 9;
		break;
		case 'goldLogs':
		scriptLava = 10;
		break;
		case 'magicLogs':
		scriptLava = 11;
		break;
		default:
		break;
	}
	console.log(scriptFoundryWoodLocal+' used')
	if (window[scriptFoundryWoodLocal] > 99 && lava >= scriptLava * 100 && scriptFoundryWoodLocal !== 'none') {
	sendBytes('CHARCOAL_FOUNDRY='+scriptFoundryWoodLocal+'~'+100)
	closeSmittysDialogue('dialogue-confirm')
    }
	}
}
 
function autoLumber() {
	if (scriptVars.scriptTreeIgnore[tree6] === false && treeTimer6 == 1) {
	sendBytes('CHOP_TREE=6')}
	if (scriptVars.scriptTreeIgnore[tree5] === false && treeTimer5 == 1) {
	sendBytes('CHOP_TREE=5')}
	if (scriptVars.scriptTreeIgnore[tree4] === false && treeTimer4 == 1) {
	sendBytes('CHOP_TREE=4')}
	if (scriptVars.scriptTreeIgnore[tree3] === false && treeTimer3 == 1) {
	sendBytes('CHOP_TREE=3')}
	if (scriptVars.scriptTreeIgnore[tree2] === false && treeTimer2 == 1) {
	sendBytes('CHOP_TREE=2')}
	if (scriptVars.scriptTreeIgnore[tree1] === false && treeTimer1 == 1) {
	sendBytes('CHOP_TREE=1')}
}
 
function autoPlant() {
  if (farmTimer1 < 2 || farmTimer2 < 2 || (farmTimer3 < 2 && farmUnlocked3 == 1) || (farmTimer4 < 2 && farmUnlocked4 == 1) || (farmTimer5 < 2 && farmUnlocked5 == 1) || (farmTimer6 < 2 && farmUnlocked6 == 1)) {
    var seedItems = document.getElementById("sortableSeeds").getElementsByTagName("li")
 
    for (var i = 0; i < seedItems.length; i++) {
      var seedCheckbox = seedItems[i].querySelector(".seed-checkbox");
      var selectedSeed = seedItems[i].getAttribute("value"); // Obter o valor do atributo 'value'
	  if (window[selectedSeed] >= 1 && bonemeal >= seedsArrayGlobal[selectedSeed].bonemealCost){
      if (seedCheckbox.checked) {
        setBobsAutoReplantSeed(selectedSeed);
        closeSmittysDialogue("dialogue-bob");
        sendBytes("HARVEST_AND_PLANT_ALL");
		setTimeout(function(){closeSmittysDialogue('dialogue-confirm')},300);
      }
	  }
    }
  }
}
 
function autoBones() {
	if (scriptVars.scriptBonesIgnore.bones === false && bones > 0) {
	sendBytes('ADD_BONEMEAL=bones~'+bones)}
	if (scriptVars.scriptBonesIgnore.ashes === false && ashes > 0) {
	sendBytes('ADD_BONEMEAL=ashes~'+ashes)}
	if (scriptVars.scriptBonesIgnore.iceBones === false && iceBones > 0) {
	sendBytes('ADD_BONEMEAL=iceBones~'+iceBones)}
	if (scriptVars.scriptBonesIgnore.zombieBones === false && zombieBones > 0) {
	sendBytes('ADD_BONEMEAL=zombieBones~'+zombieBones)}
	if (scriptVars.scriptBonesIgnore.bloodBones === false && bloodBones > 0) {
	sendBytes('ADD_BONEMEAL=bloodBones~'+bloodBones)}
	if (scriptVars.scriptBonesIgnore.fishBones === false && fishBones > 9) {
	sendBytes('ADD_BONEMEAL=fishBones~'+(Math.floor(fishBones/10))*10)}
}
 
function autoFertilize() {
	if (fertilizeSoilPotion >= 1) {
		if (scriptVars.scriptFertilize[farm6] === true && fertilizeSoil6 == 0) {
			sendBytes('PLANT=fertilizeSoilPotion~6')}
		if (scriptVars.scriptFertilize[farm5] === true && fertilizeSoil5 == 0) {
			sendBytes('PLANT=fertilizeSoilPotion~5')}
		if (scriptVars.scriptFertilize[farm4] === true && fertilizeSoil4 == 0) {
			sendBytes('PLANT=fertilizeSoilPotion~4')}
		if (scriptVars.scriptFertilize[farm3] === true && fertilizeSoil3 == 0) {
			sendBytes('PLANT=fertilizeSoilPotion~3')}
		if (scriptVars.scriptFertilize[farm2] === true && fertilizeSoil2 == 0) {
			sendBytes('PLANT=fertilizeSoilPotion~2')}
		if (scriptVars.scriptFertilize[farm1] === true && fertilizeSoil1 == 0) {
			sendBytes('PLANT=fertilizeSoilPotion~1')}
	}
}
 
window.getBonemealNeeded = function() {
	let bonemealNeeded = 0
	for (let i = 0; i < seedsArrayGlobal.length; i++) {
      bonemealNeeded += window[seedsArrayGlobal[i].itemName] ? seedsArrayGlobal[i].bonemealCost * window[seedsArrayGlobal[i].itemName] : 0
    }
	document.getElementById('bonemealNeeded').innerText = bonemealNeeded.toLocaleString('en-us')
}
 
window.getTimeNeeded = function() {
	let timeNeeded = 0
    let plotsUnlocked = farmUnlocked6 == 1 ? 6 : farmUnlocked5 == 1 ? 5 : farmUnlocked4 == 1 ? 4 : farmUnlocked3 == 1 ? 3 : 2
	for (let i = 0; i < seedsArrayGlobal.length; i++) {
      timeNeeded += window[seedsArrayGlobal[i].itemName] ? seedsArrayGlobal[i].growtime * window[seedsArrayGlobal[i].itemName] : 0
    }
	document.getElementById('growTimeNeeded').innerText = formatTime(timeNeeded/10/plotsUnlocked)
}
 
function autoDrink() {
    var potionItems = document.getElementById("sortablePotions").getElementsByTagName("li")
 
    for (var i = 0; i < potionItems.length; i++) {
      var drinkCheckbox = potionItems[i].querySelector(".drink-checkbox");
      var selectedPotion = potionItems[i].getAttribute("value"); // Obter o valor do atributo 'value'
 
      if (drinkCheckbox.checked && window[selectedPotion] > 0 && window[selectedPotion+'Timer'] == 0) {
		sendBytes('DRINK='+selectedPotion);
        setTimeout(function(){closeSmittysDialogue('dialogue-confirm')},300);
      }
    }
}
 
function autoTreeUpgrade() {
	if (woodcuttingUpgradePotionCooldown == 0 && woodcuttingUpgradePotion >= 1) {
		if (scriptVars.scriptTreeUpgrade[tree6] === true && woodcuttingUpgradePotionUsed6 == 0) {
			sendBytes('POTION_UPGRADE_TREE=6')}
		if (scriptVars.scriptTreeUpgrade[tree5] === true && woodcuttingUpgradePotionUsed5 == 0) {
			sendBytes('POTION_UPGRADE_TREE=5')}
		if (scriptVars.scriptTreeUpgrade[tree4] === true && woodcuttingUpgradePotionUsed4 == 0) {
			sendBytes('POTION_UPGRADE_TREE=4')}
		if (scriptVars.scriptTreeUpgrade[tree3] === true && woodcuttingUpgradePotionUsed3 == 0) {
			sendBytes('POTION_UPGRADE_TREE=3')}
		if (scriptVars.scriptTreeUpgrade[tree2] === true && woodcuttingUpgradePotionUsed2 == 0) {
			sendBytes('POTION_UPGRADE_TREE=2')}
		if (scriptVars.scriptTreeUpgrade[tree1] === true && woodcuttingUpgradePotionUsed1 == 0) {
			sendBytes('POTION_UPGRADE_TREE=1')}
	}
}
 
function autoBrew() {
    var potionItems = document.getElementById("sortablePotions").getElementsByTagName("li")
 
    for (var i = 0; i < potionItems.length; i++) {
      var drinkCheckbox = potionItems[i].querySelector(".drink-checkbox");
      var brewCheckbox = potionItems[i].querySelector(".brew-checkbox");
      var selectedPotion = potionItems[i].getAttribute("value"); // Obter o valor do atributo 'value'
 
      if (brewCheckbox.checked && drinkCheckbox.checked && window[selectedPotion] == 0) {
		sendBytes('BREW='+selectedPotion+'~1');
		setTimeout(function(){closeSmittysDialogue('dialogue-confirm')},300);
      }
    }
}
 
function autoExplore() {
	if (explorerCooldown == 0) {
		let scriptAreaLocal = scriptVars.scriptArea
		if (scriptAreaLocal == 'dungeon' && dungeonKey == 0) (scriptAreaLocal = 'dungeonEntrance')
		let areaCost = scriptAreaEnergy[scriptAreaLocal]
		if (totalDonations >= 32) {areaCost = scriptAreaEnergy[scriptAreaLocal] * 0.8}
		if (energy < areaCost) {scriptAreaLocal = 'fields'}
		sendBytes('EXPLORE='+scriptAreaLocal)
		if (scriptVars.toggleShiny == true || scriptVars.toggleMonsterFind == true) {scriptWaitTeleport = true} else {scriptWaitTeleport = false}
	}
}
 
function autoFight() {
	if (exploringArea !== 'none' && fightDone === 0) {
		var teleportCooldown = (teleportSpellUpgraded === 1) ? 300 : 900;
		scriptWaitTeleport = (explorerCooldown > teleportCooldown + 10) ? true : false;
		if (scriptWaitTeleport === false || (scriptWaitTeleport === true && teleportSpellCooldown === 0)) {
			if (infectedTimer > 0) {sendBytes('DRINK=cureInfectionPotion')}
			sendBytes('LOOK_FOR_FIGHT');
			window.autoPoison();
			setTimeout(function(){if (monsterName == 'pufferFish'){clicksItem('bow');clicksItem('superBow');clicksItem('enchantedSuperBow')}},3000); 
		};
		if (scriptVars.toggleShiny == false && scriptVars.toggleMonsterFind == false) {scriptWaitTeleport === false};
	};
};
 
/*function scriptedFight() {
	if (monsterName == robotMage) {
		 - charge and melee/ranged barrier
	} else if (monsterName == bloodGolem) {
		- needs to swap between bearfur and titanium armor
	} else if (monsterName == bloodDesertLizard2) {
		- charge
	} else if (monsterName == bloodPufferFish) {
		- bow first then trident+
	} 
}*/
 
window.autoPoison = function() {
	if (typeof poisonSpear !== 'undefined') {
		oldWeapon = weapon
		clicksItem('poisonSpear')
		const poisonInterval = setInterval(function(){
			if (poisonEnemyTimer == 1) {
				clicksItem(presetWeapon1);
				clearInterval(poisonInterval);
			}
		}, 2000);
	}
}
 
function autoReset() {
	if (exploringArea !== 'none' && fightDone == 1 && monsterName == 'none' && resetFightingPotion >= 1 && resetFightingPotionUsed == 0) {
		if (scriptVars.scriptResetArea[exploringArea] === true) {
			sendBytes('DRINK=resetFightingPotion')
		}
	}
}
 
function autoMonsterHunt() {
	if (monsterName !== 'none' && exploringArea !== 'none' && (scriptVars.toggleMonsterFind == false || !monsterName.toLocaleLowerCase().includes(scriptVars.scriptMonster.toLocaleLowerCase())) && monsterName !== 'gemGoblin' && monsterName !== 'bloodGemGoblin' && shinyMonster == 0) {
		sendBytes('CAST_COMBAT_SPELL=teleportSpell')
	}
	var teleportCooldown = (teleportSpellUpgraded === 1) ? 300 : 900;
	scriptWaitTeleport = (explorerCooldown > teleportCooldown + 10) ? true : false;
}
 
function autoHeal() {
	if (monsterName !== 'none' && heroHp == 0 && hpCombatPotionUsed == 0 && (hpCombatPotion >= 1 || hpCombatPotionFree == 1)){
		sendBytes('DRINK_COMBAT_POTION=hpCombatPotion');
	} else if (monsterName !== 'none' && heroHp == 0 && superHpCombatPotionUsed == 0 && (superHpCombatPotion >= 1 || typeof superHpCombatPotionFree !== 'undefined')) {
		sendBytes('DRINK_COMBAT_POTION=superHpCombatPotion');
	} else if (exploringArea !== 'none' && monsterName !== 'none' && heroHp == 0 && teleportSpellCooldown == 0 && teleportSpell == 1) {
		sendBytes('CAST_COMBAT_SPELL=teleportSpell')
	}
}
 
function autoSpell() {
	if (monsterName !== 'none') {
		if (monsterName !== 'none' && fireSpell == 1 && fireSpellCooldown == 0) {
			if (darkMageBottom >= 1 && darkMageHood >= 1 && darkMageTop >= 1) {
				if (head !== 'darkMageHood') {oldEquip = [head,body,leg,weapon]}
				clicksItem('darkMageHood');
				clicksItem('darkMageTop');
				clicksItem('darkMageBottom');
				if (staff >= 1) {clicksItem('staff')}
				sendBytes('CAST_COMBAT_SPELL=fireSpell');
				clicksItem(oldEquip[0]);
				clicksItem(oldEquip[1]);
				clicksItem(oldEquip[2]);
				clicksItem(oldEquip[3]);
		} else {
			sendBytes('CAST_COMBAT_SPELL=fireSpell')
		}
		}
		if (monsterName !== 'none' && reflectSpell == 1 && reflectSpellCooldown == 0) {
			if ((monsterName !== 'robotMage' || robotMageCharge !== 0) && (monsterName !== 'dragon' || dragonFireCharge == 4) && (!monsterName.includes('keletonCemetery') ||  monsterCharge !== 0)) {
				sendBytes('CAST_COMBAT_SPELL=reflectSpell')
			}
		}
		if (monsterName !== 'none' && thunderStrikeSpell == 1 && thunderStrikeSpellCooldown == 0) {
			if (darkMageBottom >= 1 && darkMageHood >= 1 && darkMageTop >= 1) {
				if (head !== 'darkMageHood') {oldEquip = [head,body,leg,weapon]}
				clicksItem('darkMageHood');
				clicksItem('darkMageTop');
				clicksItem('darkMageBottom');
				if (staff >= 1) {clicksItem('staff')}
				sendBytes('CAST_COMBAT_SPELL=thunderStrikeSpell');
				clicksItem(oldEquip[0]);
				clicksItem(oldEquip[1]);
				clicksItem(oldEquip[2]);
				clicksItem(oldEquip[3]);
			} else {
				sendBytes('CAST_COMBAT_SPELL=thunderStrikeSpell')
			}
		}
		if (monsterName !== 'none' && lifeStealSpell == 1 && lifeStealSpellCooldown == 0 && heroHp <= 8) {sendBytes('CAST_COMBAT_SPELL=lifeStealSpell')}
		if (monsterName !== 'none' && sandstormSpell == 1 && sandstormSpellCooldown == 0) {
			if (darkMageBottom >= 1 && darkMageHood >= 1 && darkMageTop >= 1) {
			if (head !== 'darkMageHood') {oldEquip = [head,body,leg,weapon]}
			clicksItem('darkMageHood');
			clicksItem('darkMageTop');
			clicksItem('darkMageBottom');
			if (staff >= 1) {clicksItem('staff')}
			sendBytes('CAST_COMBAT_SPELL=sandstormSpell');
			clicksItem(oldEquip[0]);
			clicksItem(oldEquip[1]);
			clicksItem(oldEquip[2]);
			clicksItem(oldEquip[3]);
		} else {
			sendBytes('CAST_COMBAT_SPELL=sandstormSpell')
		}
		}
	}
}
 
function autoCombatPot() {
	if (monsterName !== 'none') {
		if ((freezeCombatPotionFree == 1 || freezeCombatPotion >= 1) && freezeCombatPotionUsed == 0) {setTimeout(function(){sendBytes('DRINK_COMBAT_POTION=freezeCombatPotion')},19000);}
		if (typeof ignoreDefenceCombatPotion !== 'undefined' && (ignoreDefenceCombatPotionFree == 1 || ignoreDefenceCombatPotion >= 1) && ignoreDefenceCombatPotionUsed == 0) {sendBytes('DRINK_COMBAT_POTION=ignoreDefenceCombatPotion')}
		if ((ghostScanCombatPotionFree == 1 || ghostScanCombatPotion >= 1) && ghostScanCombatPotionUsed == 0) {sendBytes('DRINK_COMBAT_POTION=ghostScanCombatPotion')}
		setTimeout(function(){if (monsterName !== 'none' && scriptAreaEnergy[exploringArea] > 2000000 && (strengthCombatPotionFree == 1 || strengthCombatPotion >= 1) && strengthCombatPotionUsed == 0) {sendBytes('DRINK_COMBAT_POTION=strengthCombatPotion')}},3000); 
	}
}
 
function autoCombatSwap() {
	if (typeof monsterName === 'string' && monsterName !== 'none') {
	if (monsterName.includes('castleMage') || monsterName.includes('robotMage')) {
		if ((monsterName == 'castleMage2' || monsterName == 'robotMage2') && melee.includes(weapon)) {
			clicksItem('bow');
			clicksItem('superBow');
			clicksItem('enchantedSuperBow');
		} else if ((monsterName == 'castleMage3' || monsterName == 'robotMage') && ranged.includes(weapon)){
			clicksItem('scythe');
			clicksItem('mace');
			clicksItem('trident');
		}
	}
	}
}
 
function autoBM() {
	if ($('#explore-select-area').children(':last').attr("onclick") == 'setAreaScreenByIndex(17);navigate("explore");' && bloodMoonTimer <= 60) {
		sendBytes('STARE_BLOOD_MOON')
		setTimeout(function(){closeSmittysDialogue('dialogue-confirm')},300);
	}
}
 
function autoCousin() {
	if (typeof goblinExploringArea == 'undefined' || goblinExploringArea == 'none') {
		let scriptCousinAreaLocal = scriptVars.scriptCousinArea
		if (energy < scriptAreaEnergy[scriptCousinAreaLocal]) {scriptCousinAreaLocal = 'fields'}
		goblinCousin=1;
		sendBytes('EXPLORE_GOBLIN='+scriptCousinAreaLocal)		
		setTimeout(function(){closeSmittysDialogue('dialogue-confirm')},300);
	}
}
 
function autoBags() {
	for (var i = 0; i < bagsArray.length; i++) {
		var bag = bagsArray[i];
		if (window[bag] > 0) {
			sendBytes('OPEN_LOOT_MULTI='+bag+'~'+window[bag])
			closeSmittysDialogue('dialogue-confirm')
		}
	}
}
 
function autoFieldsBags() {
	if (window['fieldsLoot'] > 0) {
		sendBytes('OPEN_LOOT_MULTI=fieldsLoot~'+window['fieldsLoot'])
		closeSmittysDialogue('dialogue-confirm')
	}
	if (window['shinyFieldsLoot'] > 0) {
		sendBytes('OPEN_LOOT_MULTI=shinyFieldsLoot~'+window['shinyFieldsLoot'])
		closeSmittysDialogue('dialogue-confirm')
	}
}
 
function autoStatue() {
	for (var i = 0; i < exploringMetalDetectorStatuesGlobal.length; i++) {
		var statue = exploringMetalDetectorStatuesGlobal[i];
		if (window[statue] > 0) {
			sendBytes('SELL_ALL_STATUES');
			closeSmittysDialogue('dialogue-confirm');
			break;
		}
	}
}
 
function autoArtifact() {
	for (var i = 0; i < artifactArray.length; i++) {
		var artifact = artifactArray[i];
		if (window[artifact] > 0) {
			sendBytes('CONVERT_ALL_ARTIFACTS')
			closeSmittysDialogue('dialogue-confirm')
			break;
		}
	}
}
 
window.cookAll = function() {
    for (let i = 0; i < cookableFood.length; i++) {
      if (window[cookableFood[i]] > 0) {sendBytes('COOK='+cookableFood[i]+'~'+window[cookableFood[i]])}
    }
}
 
window.getHeatNeeded = function() {
	let heatNeeded = 0
	for (let i = 0; i < cookableFood.length; i++) {
      heatNeeded += foodArrayGlobal[cookableFood[i]].heatRequired * window[cookableFood[i]]
    }
	document.getElementById('heatNeeded').innerText = heatNeeded.toLocaleString('en-us')
}
 
function autoBoat() {
	if (rowBoat == 1 && scriptVars.scriptBoatSend.rowBoat == true && rowBoatTimer < 2) {
		if (bait > 4){
		sendBytes('CLICKS_BOAT=rowBoat')
		closeSmittysDialogue('dialogue-confirm2')
		} else {clicksItem('rowBoat');closeSmittysDialogue('dialogue-confirm2')}
	}
	if (canoeBoat == 1 && scriptVars.scriptBoatSend.canoeBoat == true && canoeBoatTimer < 2) {
		if (bait > 24) {
		sendBytes('CLICKS_BOAT=canoeBoat')
		closeSmittysDialogue('dialogue-confirm2')
		} else {clicksItem('canoeBoat');closeSmittysDialogue('dialogue-confirm2')}
	}
	if (scriptVars.scriptBoatSend.highWind == true) {
		if (sailBoat == 1 && scriptVars.scriptBoatSend.sailBoat == true && currentWind > 1 && sailBoatTimer < 2) {
		if (bait > 99) {
		sendBytes('CLICKS_BOAT=sailBoat')
		closeSmittysDialogue('dialogue-confirm2')
		} else {clicksItem('sailBoat');closeSmittysDialogue('dialogue-confirm2')}
		}
	} else if (sailBoat == 1 && scriptVars.scriptBoatSend.sailBoat == true && sailBoatTimer < 2) {
		if (bait > 99) {
		sendBytes('CLICKS_BOAT=sailBoat')
		closeSmittysDialogue('dialogue-confirm2')
		} else {clicksItem('sailBoat');closeSmittysDialogue('dialogue-confirm2')}
	}
	if (steamBoat == 1 && scriptVars.scriptBoatSend.steamBoat == true && steamBoatTimer < 2) {
		if (bait > 249) {
		sendBytes('CLICKS_BOAT=steamBoat')
		closeSmittysDialogue('dialogue-confirm2')
		} else {clicksItem('steamBoat');closeSmittysDialogue('dialogue-confirm2')}
	}
	if (trawler == 1 && scriptVars.scriptBoatSend.trawler == true && trawlerTimer < 2) {
		if (bait > 499) {
		sendBytes('CLICKS_BOAT=trawler')
		closeSmittysDialogue('dialogue-confirm2')
	} else {clicksItem('trawler');closeSmittysDialogue('dialogue-confirm2')}
	}
}
 
window.autoCityUnlock = function() {
	sendBytes('CLICKS_SHOP_VOTE=9');
	sendBytes("COLLECT_VOTES")
}
 
function loadUserVars() {
	let key = `idleAgain-${window.username}`;
	if (localStorage.getItem(key)) {
		scriptVars = JSON.parse(localStorage.getItem(key));
	}
	if (typeof scriptVars.toggleCombatSwap == 'undefined') {
		scriptVars.toggleCombatSwap = true
	}
	if (typeof scriptVars.toggleBM == 'undefined') {
		scriptVars.toggleBM = false
	}
	if (typeof scriptVars.toggleMap == 'undefined') {
		scriptVars.toggleMap = true
	}
}
 
window.autoChangeVar = function(variName,variValue,id) {
	console.log(variName+' '+variValue+' '+id)
	let key = `idleAgain-${window.username}`;
	scriptVars[variName] = variValue
	localStorage.setItem(key, JSON.stringify(scriptVars))
	if (typeof id !== 'undefined') {
		if (variValue == true) {
			document.getElementById(id).style.color = "green"
		} else {
			document.getElementById(id).style.color = "red"
		}
		console.log(id)
	}
}
 
window.autoChangeObject = function(variName,variKey,variValue,id) {
	let key = `idleAgain-${window.username}`;
	scriptVars[variName][variKey] = variValue
	localStorage.setItem(key, JSON.stringify(scriptVars))
	if (typeof id !== 'undefined') {
		if (variValue == true) {
			document.getElementById(id).style.color = "green"
		} else {
			document.getElementById(id).style.color = "red"
		}
	}
}
 
window.toggleAutoLogin = function() {
	localStorage.setItem('autoLogin', !JSON.parse(localStorage.getItem('autoLogin')))
	if (JSON.parse(localStorage.getItem('autoLogin')) == true) {
		document.getElementById('scriptLoginToggle').style.color = "green"
	} else {
		document.getElementById('scriptLoginToggle').style.color = "red"
	}
}
 
function scriptAddTabs() {
	let miscTab = document.querySelectorAll("#tab-misc > .main-button")[2];
	let scriptConfBar = `<div onclick="navigate('scriptConfig')" class="main-button" style="cursor: pointer;">
<table>
	<tbody><tr>
	<td><img src="images/whiteGear.png" class="img-small"></td>
	<td style="text-align:right;padding-right:20px;font-size:12pt;">SCRIPT CONFIG</td>
	</tr>
</tbody></table>
</div>`;
	$(scriptConfBar).insertAfter(miscTab)
	
	let chatDiv = `<div id="div-chat" style="margin-top: 10px;border: 1px solid silver;background: linear-gradient(rgb(238, 238, 238), rgb(221, 221, 221));padding: 5px;">
		<div style="margin-bottom:5px;font-weight: bold;color: black;justify-content: space-between;display: flex;">Chat Box <button onclick="window.clearChat()">Clear</button></div>
		<div id="messages" style="border: 1px solid grey;background-color: white;height: 200px;padding-left: 5px;overflow-y: auto;color:black;">
 
		</div>
		<div style="margin-top: 5px;">
			<input id="message-body" type="text" maxlength="100" size="100%" onkeydown="window.handleKeyDown(event)">
			<button onclick="window.sendChat()">Send</button>
		</div>
	</div>`
	
	let scriptConfTab = `<div id="tab-scriptConfig" style="display:none">
  <div class="main-button-lighter">
    <table>
      <tbody>
        <tr onclick="navigate('main');playPreviousMenuSound();" style="cursor: pointer;">
          <td><img src="images/back.png" class="img-small"></td>
          <td class="back-label">BACK</td>
        </tr>
      </tbody>
    </table>
  </div>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptGlobalToggle" onclick="window.autoChangeVar('toggleGlobal',!scriptVars.toggleGlobal,this.id)" style="cursor: pointer; color: green;">
        <td style="padding-left: 10px;"><img src="images/whiteGear.png" class="img-medium"></td>
        <td style="text-align:right;padding-right:20px;width:100%">SCRIPT TOGGLE</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptMiningTogglesBar" onclick="navigate('scriptConfigMining')" style="cursor: pointer; color: white;">
        <td style="padding-left: 10px;"><img src="images/miningSkill.png" class="img-medium"></td>
        <td style="text-align:right;padding-right:20px;width:100%">MINING TOGGLES</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptCraftingTogglesBar" onclick="navigate('scriptConfigCrafting')" style="cursor: pointer; color: white;">
        <td style="padding-left: 10px;"><img src="images/craftingSkill.png" class="img-medium"></td>
        <td style="text-align:right;padding-right:20px;width:100%">CRAFTING TOGGLES</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptWoodcuttingTogglesBar" onclick="navigate('scriptConfigWoodcutting')" style="cursor: pointer; color: white;">
        <td style="padding-left: 10px;"><img src="images/woodcuttingSkill.png" class="img-medium"></td>
        <td style="text-align:right;padding-right:20px;width:100%">WOODCUTTING TOGGLES</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptFarmingTogglesBar" onclick="navigate('scriptConfigFarming')" style="cursor: pointer; color: white;">
        <td style="padding-left: 10px;"><img src="images/farmingSkill.png" class="img-medium"></td>
        <td style="text-align:right;padding-right:20px;width:100%">FARMING TOGGLES</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptBrewingTogglesBar" onclick="navigate('scriptConfigBrewing')" style="cursor: pointer; color: white;">
        <td style="padding-left: 10px;"><img src="images/brewingSkill.png" class="img-medium"></td>
        <td style="text-align:right;padding-right:20px;width:100%">BREWING TOGGLES</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptExploringTogglesBar" onclick="navigate('scriptConfigExploring')" style="cursor: pointer; color: white;">
        <td style="padding-left: 10px;"><img src="images/exploringSkill.png" class="img-medium"></td>
        <td style="text-align:right;padding-right:20px;width:100%">EXPLORING TOGGLES</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptCookingTogglesBar" onclick="navigate('scriptConfigCooking')" style="cursor: pointer; color: white;">
        <td style="padding-left: 10px;"><img src="images/cookingSkill.png" class="img-medium"></td>
        <td style="text-align:right;padding-right:20px;width:100%">COOKING TOGGLES</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptCityUnlock" onclick="if(isMayor == 0) {window.autoCityUnlock();console.log('City Unlocked')}" style="cursor: pointer; color: white;">
        <td style="padding-left: 10px;"><img src="images/mayorsHouse.png" class="img-medium"></td>
        <td style="text-align:right;padding-right:20px;width:100%">CITY UNLOCK</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptLoginToggle" onclick="window.toggleAutoLogin()" style="cursor: pointer; color: green;">
        <td style="padding-left: 10px;"><img src="images/whiteGear.png" class="img-medium"></td>
        <td style="text-align:right;padding-right:20px;width:100%">AUTO LOGIN</td>
      </tr>
    </tbody>
  </table>
</div>`
 
 
	let scriptConfMiningTab  = `<div id="tab-scriptConfigMining" style="display:none">
  <div class="main-button-lighter">
    <table>
      <tbody>
        <tr onclick="navigate('scriptConfig');playPreviousMenuSound();" style="cursor: pointer;">
          <td><img src="images/back.png" class="img-small"></td>
          <td class="back-label">BACK</td>
        </tr>
      </tbody>
    </table>
  </div>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptGeodeToggle" onclick="window.autoChangeVar('toggleGeodeOpen',!scriptVars.toggleGeodeOpen,this.id)" style="cursor: pointer; color: green;">
        <td style="padding-left: 10px;"><img src="images/geode5.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">GEODE OPENING</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptMineralToggle" onclick="window.autoChangeVar('toggleMineralIdentify',!scriptVars.toggleMineralIdentify,this.id)" style="cursor: pointer; color: green;">
        <td style="padding-left: 10px;"><img src="images/tanzaniteMineral.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">MINERAL IDENTIFY</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptNecklaceToggle" onclick="window.autoChangeVar('toggleNecklaceCharge',!scriptVars.toggleNecklaceCharge,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/mineralNecklace.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">NECKLACE CHARGE</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptTrainToggle" onclick="window.autoChangeVar('toggleTrain',!scriptVars.toggleTrain,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/train.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">TRAIN</td>
      </tr>
    </tbody>
  </table>
  <table style="border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr style="color: white;width: 100%;">
        <td style="padding-left: 10px;"><img src="images/trainTracks.png" class="img-small"></td>
        <td>
          <select name="scriptTrainAmount" onchange="window.autoChangeVar('scriptTrainAmount',this.value)" id="scriptTrainAmount">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </td>
        <td style="text-align:right;padding-right:20px;width:100%">TRAINS TO SEND</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptRocketToggle" onclick="window.autoChangeVar('toggleRocket',!scriptVars.toggleRocket,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/rocket.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">ROCKET</td>
      </tr>
    </tbody>
  </table>
  <table style="border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr style="color: white;width: 100%;">
        <td style="padding-left: 10px;"><img src="images/mars.png" class="img-small"></td>
        <td>
          <select name="scriptRocketDestination" onchange="window.autoChangeVar('scriptRocket',this.value)" id="scriptRocketDestination">
            <option value="Moon">Moon</option>
            <option value="Mars">Mars</option>
            <option value="Sun">Sun</option>
          </select>
        </td>
        <td style="text-align:right;padding-right:20px;width:100%">ROCKET DESTINATION</td>
      </tr>
    </tbody>
  </table>
</div>`
 
	let scriptConfCraftingTab = `<div id="tab-scriptConfigCrafting" style="display:none">
  <div class="main-button-lighter">
    <table>
      <tbody>
        <tr onclick="navigate('scriptConfig');playPreviousMenuSound();" style="cursor: pointer;">
          <td><img src="images/back.png" class="img-small"></td>
          <td class="back-label">BACK</td>
        </tr>
      </tbody>
    </table>
  </div>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptSmeltingToggle" onclick="window.autoChangeVar('toggleSmelting',!scriptVars.toggleSmelting,this.id)" style="cursor: pointer; color: green;">
        <td style="padding-left: 10px;"><img src="images/ancientFurnace.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">SMELTING</td>
      </tr>
    </tbody>
  </table>
  <ol id="sortableOres" style="list-style: none;padding: 0px;border: 1px solid grey;border-radius: 6px;margin: 10px;font-size: 25px;" class="ui-sortable">
    <li class="ui-state-default ui-sortable-handle" value="copper" style="border-radius: 6px; background: rgb(26, 26, 26); color: white; justify-content: space-between; display: flex;">
      <img src="images/bronzeBars.png" class="img-small" style="padding-right: 10px;">Bronze Bar<input type="number" class="oreMinimum" min="1" placeholder="Minimum to Smelt" value="1">
    </li>
    <li class="ui-state-default ui-sortable-handle" value="iron" style="border-radius: 6px; background: rgb(26, 26, 26); color: white; justify-content: space-between; display: flex;">
      <img src="images/ironBars.png" class="img-small" style="padding-right: 10px;">Iron Bar<input type="number" class="oreMinimum" min="1" placeholder="Minimum to Smelt" value="1">
    </li>
    <li class="ui-state-default ui-sortable-handle" value="silver" style="border-radius: 6px; background: rgb(26, 26, 26); color: white; justify-content: space-between; display: flex;">
      <img src="images/silverBars.png" class="img-small" style="padding-right: 10px;">Silver Bar<input type="number" class="oreMinimum" min="1" placeholder="Minimum to Smelt" value="1">
    </li>
    <li class="ui-state-default ui-sortable-handle" value="gold" style="border-radius: 6px; background: rgb(26, 26, 26); color: white; justify-content: space-between; display: flex;">
      <img src="images/goldBars.png" class="img-small" style="padding-right: 10px;">Gold Bar<input type="number" class="oreMinimum" min="1" placeholder="Minimum to Smelt" value="1">
    </li>
    <li class="ui-state-default ui-sortable-handle" value="promethium" style="border-radius: 6px; background: rgb(26, 26, 26); color: white; justify-content: space-between; display: flex;">
      <img src="images/promethiumBars.png" class="img-small" style="padding-right: 10px;">Promethium Bar<input type="number" class="oreMinimum" min="1" placeholder="Minimum to Smelt" value="1">
    </li>
    <li class="ui-state-default ui-sortable-handle" value="titanium" style="border-radius: 6px; background: rgb(26, 26, 26); color: white; justify-content: space-between; display: flex;">
      <img src="images/titaniumBars.png" class="img-small" style="padding-right: 10px;">Titanium Bar<input type="number" class="oreMinimum" min="1" placeholder="Minimum to Smelt" value="1">
    </li>
    <li class="ui-state-default ui-sortable-handle" value="ancientOre" style="border-radius: 6px; background: rgb(26, 26, 26); color: white; justify-content: space-between; display: flex;">
      <img src="images/ancientBars.png" class="img-small" style="padding-right: 10px;">Ancient Bar<input type="number" class="oreMinimum" min="1" placeholder="Minimum to Smelt" value="1">
    </li>
  </ol>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptRefinaryToggle" onclick="window.autoChangeVar('toggleRefinary',!scriptVars.toggleRefinary,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/goldBarRefinery.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">REFINARY</td>
      </tr>
    </tbody>
  </table>
  <table style="border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptRefinaryBar" style="color: white;">
        <td style="padding-left: 10px;"><img src="images/refinedGoldBars.png" class="img-small"></td>
        <td style="padding-left: 50px;">
          <select name="scriptRefinaryBarOptions" onchange="window.autoChangeVar('scriptRefinaryBar',this.value)" id="scriptRefinaryOptions">
            <option value="gold">Gold</option>
            <option value="promethium">Promethium</option>
          </select>
        </td>
        <td style="text-align:right;padding-right:20px;width:100%">REFINARY BAR</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptFoundryToggle" onclick="window.autoChangeVar('toggleCharcoal',!scriptVars.toggleCharcoal,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/charcoalFoundry.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">CHARCOAL FOUNDRY</td>
      </tr>
    </tbody>
  </table>
  <table style="border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptFoundryWood" style="color: white;">
        <td style="padding-left: 10px;"><img src="images/lavaLogs.png" class="img-small"></td>
        <td style="padding-left: 50px;">
          <select name="scriptFoundryWoodOptions" onchange="window.autoChangeVar('scriptFoundryWood',this.value)" id="scriptFoundryWoodOptions">
            <option value="cheapest">Cheapest</option>
            <option value="logs">Logs</option>
            <option value="oakLogs">Oak Logs</option>
            <option value="willowLogs">Willow Logs</option>
            <option value="mapleLogs">Maple Logs</option>
            <option value="redwoodLogs">Redwood Logs</option>
            <option value="pineLogs">Pine Logs</option>
            <option value="hauntedLogs">Haunted Logs</option>
            <option value="jungleLogs">Jungle Logs</option>
            <option value="lavaLogs">Lava Logs</option>
            <option value="goldLogs">Gold Logs</option>
            <option value="magicLogs">Magic Logs</option>
          </select>
        </td>
        <td style="text-align:right;padding-right:20px;width:100%">CHARCOAL LOG</td>
      </tr>
    </tbody>
  </table>
</div>`
 
	let scriptConfWoodcuttingTab = `<div id="tab-scriptConfigWoodcutting" style="display:none">
  <div class="main-button-lighter">
    <table>
      <tbody>
        <tr onclick="navigate('scriptConfig');playPreviousMenuSound();" style="cursor: pointer;">
          <td><img src="images/back.png" class="img-small"></td>
          <td class="back-label">BACK</td>
        </tr>
      </tbody>
    </table>
  </div>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptLumberToggle" onclick="window.autoChangeVar('toggleWoodcutting',!scriptVars.toggleWoodcutting,this.id)" style="cursor: pointer; color: green;">
        <td style="padding-left: 10px;"><img src="images/lumberjack.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">LUMBERJACK</td>
      </tr>
    </tbody>
  </table>
  <table style="border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 20px;width: 97%;">
    <tbody style="display: table-row;">
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeIgnore','tree',!scriptVars.scriptTreeIgnore.tree,this.id)" id="treeIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/tree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">TREE IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeIgnore','oakTree',!scriptVars.scriptTreeIgnore.oakTree,this.id)" id="oakTreeIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/oakTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">OAK TREE IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeIgnore','willowTree',!scriptVars.scriptTreeIgnore.willowTree,this.id)" id="willowTreeIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/willowTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">WILLOW TREE IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeIgnore','mapleTree',!scriptVars.scriptTreeIgnore.mapleTree,this.id)" id="mapleTreeIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/mapleTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">MAPLE TREE IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeIgnore','redwoodTree',!scriptVars.scriptTreeIgnore.redwoodTree,this.id)" id="redwoodTreeIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/redwoodTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">REDWOOD TREE IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeIgnore','pineTree',!scriptVars.scriptTreeIgnore.pineTree,this.id)" id="pineTreeIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/pineTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">PINE TREE IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeIgnore','hauntedTree',!scriptVars.scriptTreeIgnore.hauntedTree,this.id)" id="hauntedTreeIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/hauntedTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">HAUNTED TREE IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptTreeIgnore','jungleTree',!scriptVars.scriptTreeIgnore.jungleTree,this.id)" id="jungleTreeIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/jungleTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">JUNGLE TREE IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeIgnore','lavaTree',!scriptVars.scriptTreeIgnore.lavaTree,this.id)" id="lavaTreeIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/lavaTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">LAVA TREE IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptTreeIgnore','goldTree',!scriptVars.scriptTreeIgnore.goldTree,this.id)" id="goldTreeIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/goldTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">GOLD TREE IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeIgnore','magicTree',!scriptVars.scriptTreeIgnore.magicTree,this.id)" id="magicTreeIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/magicTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">MAGIC TREE IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeIgnore','appleTree',!scriptVars.scriptTreeIgnore.appleTree,this.id)" id="appleTreeIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/appleTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">APPLE TREE IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeIgnore','cactusTree',!scriptVars.scriptTreeIgnore.cactusTree,this.id)" id="cactusTreeIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/cactusTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">CACTUS TREE IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeIgnore','bananaTree',!scriptVars.scriptTreeIgnore.bananaTree,this.id)" id="bananaTreeIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/bananaTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">BANANA TREE IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeIgnore','palmTree',!scriptVars.scriptTreeIgnore.palmTree,this.id)" id="palmTreeIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/palmTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">PALM TREE IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptTreeIgnore','pineappleTree',!scriptVars.scriptTreeIgnore.pineappleTree,this.id)" id="pineappleTreeIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/pineappleTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">PINEAPPLE TREE IGNORE</td>
      </tr>
      <tr style="color: red;" onclick="window.autoChangeObject('scriptTreeIgnore','starfuitTree',!scriptVars.scriptTreeIgnore.starfuitTree,this.id)" id="starfruitTreeIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/starfruitTree.png" class="img-small"></td>
        <td style="text-align: center;">STARFRUIT TREE IGNORE</td>
      </tr>
    </tbody>
  </table>
</div>`
 
	let scriptConfFarmingTab = `<div id="tab-scriptConfigFarming" style="display:none">
  <div class="main-button-lighter">
    <table>
      <tbody>
        <tr onclick="navigate('scriptConfig');playPreviousMenuSound();" style="cursor: pointer;">
          <td><img src="images/back.png" class="img-small"></td>
          <td class="back-label">BACK</td>
        </tr>
      </tbody>
    </table>
  </div>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptFarmingToggle" onclick="window.autoChangeVar('toggleFarming',!scriptVars.toggleFarming,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/farmer.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">HARVEST AND PLANT</td>
      </tr>
    </tbody>
  </table>
  <table style="border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;cursor: pointer;">
    <tbody>
      <tr id="scriptSeedToggleBar" onclick="navigate('scriptConfigSeeds')" style="color: white;">
        <td style="padding-left: 10px;"><img src="images/goldLeafSeeds.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">SEED SELECTOR</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptBonesToggle" onclick="window.autoChangeVar('toggleBones',!scriptVars.toggleBones,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/bonemealBin.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">BONEMEAL</td>
      </tr>
    </tbody>
  </table>
  <table style="border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 20px;width: 97%;">
    <tbody style="display: table-row;">
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptBonesIgnore','bones',!scriptVars.scriptBonesIgnore.bones,this.id)" id="bonesIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/bones.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">BONES IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptBonesIgnore','ashes',!scriptVars.scriptBonesIgnore.ashes,this.id)" id="ashesIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/ashes.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">ASHES IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptBonesIgnore','iceBones',!scriptVars.scriptBonesIgnore.iceBones,this.id)" id="iceBonesIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/iceBones.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">ICE BONES IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptBonesIgnore','zombieBones',!scriptVars.scriptBonesIgnore.zombieBones,this.id)" id="zombieBonesIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/zombieBones.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">ZOMBIE BONES IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptBonesIgnore','bloodBones',!scriptVars.scriptBonesIgnore.bloodBones,this.id)" id="bloodBonesIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/bloodBones.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">BLOOD BONES IGNORE</td>
      </tr>
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptBonesIgnore','fishBones',!scriptVars.scriptBonesIgnore.fishBones,this.id)" id="fishBonesIgnoreToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/fishBones.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">FISH BONES IGNORE</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptFertilizeToggle" onclick="window.autoChangeVar('toggleFertilize',!scriptVars.toggleFertilize,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/fertilizeSoilPotion.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">FERTILIZE</td>
      </tr>
    </tbody>
  </table>
  <table style="border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 20px;width: 97%;">
    <tbody style="display: table-row;">
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptFertilize','redMushroomSeeds',!scriptVars.scriptFertilize.redMushroomSeeds,this.id)" id="MushroomFertilizeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/redMushroomSeeds.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">RED MUSHROOM FERTILIZE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptFertilize','dottedGreenLeafSeeds',!scriptVars.scriptFertilize.dottedGreenLeafSeeds,this.id)" id="dottedGreenFertilizeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/dottedGreenLeafSeeds.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">DOTTED GREEN LEAF FERTILIZE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptFertilize','greenLeafSeeds',!scriptVars.scriptFertilize.greenLeafSeeds,this.id)" id="greenLeafFertilizeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/greenLeafSeeds.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">GREEN LEAF FERTILIZE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptFertilize','limeLeafSeeds',!scriptVars.scriptFertilize.limeLeafSeeds,this.id)" id="limeLeafFertilizeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/limeLeafSeeds.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">LIME LEAF FERTILIZE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptFertilize','goldLeafSeeds',!scriptVars.scriptFertilize.goldLeafSeeds,this.id)" id="goldLeafFertilizeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/goldLeafSeeds.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">GOLD LEAF FERTILIZE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptFertilize','crystalLeafSeeds',!scriptVars.scriptFertilize.crystalLeafSeeds,this.id)" id="crystalLeafFertilizeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/crystalLeafSeeds.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">CRYSTAL LEAF FERTILIZE</td>
      </tr>
    <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptFertilize','stripedGreenLeafSeeds',!scriptVars.scriptFertilize.stripedGreenLeafSeeds,this.id)" id="stripedGreenLeafFertilizeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/stripedGreenLeafSeeds.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">STRIPED GREEN LEAF FERTILIZE</td>
      </tr><tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptFertilize','stripedGoldLeafSeeds',!scriptVars.scriptFertilize.stripedGoldLeafSeeds,this.id)" id="stripedGoldLeafFertilizeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/stripedGoldLeafSeeds.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">STRIPED GOLD LEAF FERTILIZE</td>
      </tr><tr style="color: red;" onclick="window.autoChangeObject('scriptFertilize','stripedCrystalLeafSeeds',!scriptVars.scriptFertilize.stripedCrystalLeafSeeds,this.id)" id="stripedCrystalLeafFertilizeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/stripedCrystalLeafSeeds.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">STRIPED CRYSTAL LEAF FERTILIZE</td>
      </tr></tbody>
  </table>
</div>`
 
	let scriptConfSeedsTab = `<div id="tab-scriptConfigSeeds" style="display:none">
  <div class="main-button-lighter">
    <table>
      <tbody>
        <tr onclick="navigate('scriptConfigFarming');playPreviousMenuSound();" style="cursor: pointer;">
          <td><img src="images/back.png" class="img-small"></td>
          <td class="back-label">BACK</td>
        </tr>
      </tbody>
    </table>
  </div>
  <table style="border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptSeedsInfo" style="color: white;">
        <td style="padding-left: 10px;"></td>
        <td style="text-align: center;padding-right:20px;width: 100%;">
          <p>PRIORITY WILL BE DEFINED BASED ON THE POSITION OF THE SEED</p>
          <p>DRAG AND DROP ONCE AFTER CHECKING BOXES</p>
        </td>
      </tr>
    </tbody>
  </table>
  <ol id="sortableSeeds" style="list-style: none;padding: 0px;border: 1px solid grey;border-radius: 6px;margin: 10px;font-size: 25px;">
    <li class="ui-state-default" value="redMushroomSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Red Mushroom Seeds<img src="images/redMushroomSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="dottedGreenLeafSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Dotted Green Leaf Seeds<img src="images/dottedGreenLeafSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="greenLeafSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Green Leaf Seeds<img src="images/greenLeafSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="limeLeafSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Lime Leaf Seeds<img src="images/limeLeafSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="goldLeafSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Gold Leaf Seeds<img src="images/goldLeafSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="crystalLeafSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Crystal Leaf Seeds<img src="images/crystalLeafSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="stripedGreenLeafSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Striped Green Leaf Seeds<img src="images/stripedGreenLeafSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="stripedGoldLeafSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Striped Gold Leaf Seeds<img src="images/stripedGoldLeafSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="stripedCrystalLeafSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Striped Crystal Leaf Seeds<img src="images/stripedCrystalLeafSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="treeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Tree Seeds<img src="images/treeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="oakTreeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Oak Tree Seeds<img src="images/oakTreeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="willowTreeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Willow Tree Seeds<img src="images/willowTreeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="mapleTreeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Maple Tree Seeds<img src="images/mapleTreeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="redwoodTreeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Redwood Tree Seeds<img src="images/redwoodTreeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="pineTreeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Pine Tree Seeds<img src="images/pineTreeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="hauntedTreeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Haunted Tree Seeds<img src="images/hauntedTreeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="jungleTreeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Jungle Tree Seeds<img src="images/jungleTreeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="lavaTreeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Lava Tree Seeds<img src="images/lavaTreeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="goldTreeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Gold Tree Seeds<img src="images/goldTreeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="magicTreeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Magic Tree Seeds<img src="images/magicTreeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="appleTreeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Apple Tree Seeds<img src="images/appleTreeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="cactusTreeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Cactus Tree Seeds<img src="images/cactusTreeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="bananaTreeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Banana Tree Seeds<img src="images/bananaTreeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="palmTreeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Palm Tree Seeds<img src="images/palmTreeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="pineappleTreeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Pineapple Tree Seeds<img src="images/pineappleTreeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="starfruitTreeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Starfruit Tree Seeds<img src="images/starfruitTreeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
    <li class="ui-state-default" value="goldAppleTreeSeeds" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="seed-checkbox"> Gold Apple Tree Seeds<img src="images/goldAppleTreeSeeds.png" class="img-small" style="padding-right: 10px;">
    </li>
  </ol>
</div>`
 
	let scriptConfBrewingTab = `<div id="tab-scriptConfigBrewing" style="display:none">
  <div class="main-button-lighter">
    <table>
      <tbody>
        <tr onclick="navigate('scriptConfig');playPreviousMenuSound();" style="cursor: pointer;">
          <td><img src="images/back.png" class="img-small"></td>
          <td class="back-label">BACK</td>
        </tr>
      </tbody>
    </table>
  </div>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptDrinkToggle" onclick="window.autoChangeVar('toggleDrink',!scriptVars.toggleDrink,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/diamondBrewingKit.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">POTION DRINK</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptBrewToggle" onclick="window.autoChangeVar('toggleBrew',!scriptVars.toggleBrew,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/goldLeaf.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">POTION BREW</td>
      </tr>
    </tbody>
  </table>
  <table style="border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;cursor: pointer;">
    <tbody>
      <tr id="scriptPotionToggleBar" onclick="navigate('scriptConfigPotions')" style="color: white;">
        <td style="padding-left: 10px;"><img src="images/researchSpeedPotion.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">POTION SELECTOR</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptTreeUpgradeToggle" onclick="window.autoChangeVar('toggleTreeUpgrade',!scriptVars.toggleTreeUpgrade,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/woodcuttingUpgradePotion.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">TREE UPGRADE POTION</td>
      </tr>
    </tbody>
  </table>
  <table style="border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 20px;width: 97%;">
    <tbody style="display: table-row;">
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeUpgrade','tree',!scriptVars.scriptTreeUpgrade.tree,this.id)" id="treeUpgradeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/tree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">TREE UPGRADE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeUpgrade','oakTree',!scriptVars.scriptTreeUpgrade.oakTree,this.id)" id="oakTreeUpgradeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/oakTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">OAK TREE UPGRADE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeUpgrade','willowTree',!scriptVars.scriptTreeUpgrade.willowTree,this.id)" id="willowTreeUpgradeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/willowTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">WILLOW TREE UPGRADE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeUpgrade','mapleTree',!scriptVars.scriptTreeUpgrade.mapleTree,this.id)" id="mapleTreeUpgradeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/mapleTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">MAPLE TREE UPGRADE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeUpgrade','redwoodTree',!scriptVars.scriptTreeUpgrade.redwoodTree,this.id)" id="redwoodTreeUpgradeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/redwoodTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">REDWOOD TREE UPGRADE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeUpgrade','pineTree',!scriptVars.scriptTreeUpgrade.pineTree,this.id)" id="pineTreeUpgradeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/pineTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">PINE TREE UPGRADE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeUpgrade','hauntedTree',!scriptVars.scriptTreeUpgrade.hauntedTree,this.id)" id="hauntedTreeUpgradeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/hauntedTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">HAUNTED TREE UPGRADE</td>
      </tr>
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptTreeUpgrade','jungleTree',!scriptVars.scriptTreeUpgrade.jungleTree,this.id)" id="jungleTreeUpgradeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/jungleTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">JUNGLE TREE UPGRADE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeUpgrade','lavaTree',!scriptVars.scriptTreeUpgrade.lavaTree,this.id)" id="lavaTreeUpgradeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/lavaTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">LAVA TREE UPGRADE</td>
      </tr>
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptTreeUpgrade','goldTree',!scriptVars.scriptTreeUpgrade.goldTree,this.id)" id="goldTreeUpgradeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/goldTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">GOLD TREE UPGRADE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeUpgrade','magicTree',!scriptVars.scriptTreeUpgrade.magicTree,this.id)" id="magicTreeUpgradeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/magicTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">MAGIC TREE UPGRADE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeUpgrade','appleTree',!scriptVars.scriptTreeUpgrade.appleTree,this.id)" id="appleTreeUpgradeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/appleTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">APPLE TREE UPGRADE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeUpgrade','cactusTree',!scriptVars.scriptTreeUpgrade.cactusTree,this.id)" id="cactusTreeUpgradeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/cactusTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">CACTUS TREE UPGRADE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeUpgrade','bananaTree',!scriptVars.scriptTreeUpgrade.bananaTree,this.id)" id="bananaTreeUpgradeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/bananaTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">BANANA TREE UPGRADE</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptTreeUpgrade','palmTree',!scriptVars.scriptTreeUpgrade.palmTree,this.id)" id="palmTreeUpgradeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/palmTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">PALM TREE UPGRADE</td>
      </tr>
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptTreeUpgrade','pineappleTree',!scriptVars.scriptTreeUpgrade.pineappleTree,this.id)" id="pineappleTreeUpgradeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/pineappleTree.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">PINEAPPLE TREE UPGRADE</td>
      </tr>
      <tr style="color: red;" onclick="window.autoChangeObject('scriptTreeUpgrade','starfuitTree',!scriptVars.scriptTreeUpgrade.starfuitTree,this.id)" id="starfruitTreeUpgradeToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/starfruitTree.png" class="img-small"></td>
        <td style="text-align: center;">STARFRUIT TREE UPGRADE</td>
      </tr>
    </tbody>
  </table>
</div>`
 
	let scriptConfPotionsTab = `<div id="tab-scriptConfigPotions" style="display:none">
  <div class="main-button-lighter">
    <table>
      <tbody>
        <tr onclick="navigate('scriptConfigBrewing');playPreviousMenuSound();" style="cursor: pointer;">
          <td><img src="images/back.png" class="img-small"></td>
          <td class="back-label">BACK</td>
        </tr>
      </tbody>
    </table>
  </div>
  <table style="border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptPotionsInfo" style="color: white;">
        <td style="padding-left: 10px;"></td>
        <td style="text-align: center;padding-right:20px;width: 100%;">IT WILL ONLY BREW IF DRINK IS ALSO SELECTED AND DOES NOT CHECK THE INGREDIENTS</td>
      </tr>
    </tbody>
  </table>
  <div class="ui-state-default" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;margin: 10px;font-size: 25px;">
    <p style="
      margin-top: 0px;
      margin-bottom: 0px;
      padding-left: 10px;
      ">DRINK</p>
    <p style="
      margin-top: 0px;
      margin-bottom: 0px;
      padding-left: 0px;
      padding-right: 10px;
      ">BREW</p>
  </div>
  <ol id="sortablePotions" style="list-style: none;padding: 0px;border: 1px solid grey;border-radius: 6px;margin: 10px;font-size: 25px;">
    <li class="ui-state-default" value="furnaceSpeedPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">FURNACE SPEED POTION<img src="images/furnaceSpeedPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="seedFinderPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">SEED FINDER POTION<img src="images/seedFinderPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="compostPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">COMPOST POTION<img src="images/compostPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="treeCompostPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">TREE COMPOST POTION<img src="images/treeCompostPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="fishingSpeedPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">FISHING SPEED POTION<img src="images/fishingSpeedPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="woodcuttingXpPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">WOODCUTTING XP POTION<img src="images/woodcuttingXpPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="exploringSpeedPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">EXPLORER SPEED POTION<img src="images/exploringSpeedPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="baitPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">BAIT POTION<img src="images/baitPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="farmingXpPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">FARMING XP POTION<img src="images/farmingXpPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="fastCompostPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">FAST COMPOST POTION<img src="images/fastCompostPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="oilPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">OIL POTION<img src="images/oilPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="coinPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">COIN POTION<img src="images/coinPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="piratesPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">PIRATES POTION<img src="images/piratesPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="promethiumPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">PROMETHIUM POTION<img src="images/promethiumPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="rocketSpeedPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">ROCKET SPEED POTION<img src="images/rocketSpeedPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="fruitTreePotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">FRUIT TREE POTION<img src="images/fruitTreePotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="titaniumPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">TITANIUM POTION<img src="images/titaniumPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="researchSpeedPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">RESEARCH SPEED POTION<img src="images/researchSpeedPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
    <li class="ui-state-default" value="superRocketSpeedPotion" style="border-radius: 6px;background: #1a1a1a;color: white;justify-content: space-between;display: flex;">
      <input type="checkbox" class="drink-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">SUPER ROCKET SPEED POTION<img src="images/superRocketSpeedPotion.png" class="img-small" style="padding-right: 10px;"><input type="checkbox" class="brew-checkbox" style="margin-right: 30px;" onchange="window.savePotions()">
    </li>
  </ol>
</div>`
 
	let scriptConfExploringTab = `<div id="tab-scriptConfigExploring" style="display:none">
  <div class="main-button-lighter">
    <table>
      <tbody>
        <tr onclick="navigate('scriptConfig');playPreviousMenuSound();" style="cursor: pointer;">
          <td><img src="images/back.png" class="img-small"></td>
          <td class="back-label">BACK</td>
        </tr>
      </tbody>
    </table>
  </div>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptExploreToggle" onclick="window.autoChangeVar('toggleExplore',!scriptVars.toggleExplore,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/explorer.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">EXPLORER</td>
      </tr>
    </tbody>
  </table>
  <table style="border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptExplorerArea" style="color: white;">
        <td style="padding-left: 10px;"><img src="images/caves.png" class="img-small"></td>
        <td style="padding-left: 50px;">
          <select name="scriptAreaOptions" onchange="window.autoChangeVar('scriptArea',this.value);window.monsterOptions(this.value);window.autoChangeVar('scriptMonster',document.getElementById('scriptMonsterOptions').value)" id="scriptAreaOptions">
            <option value="fields">Fields</option>
            <option value="forests">Forests</option>
            <option value="caves">Caves</option>
            <option value="volcano">Volcano</option>
            <option value="northernFields">Northern Fields</option>
            <option value="hauntedMansion">Haunted Mansion</option>
            <option value="desert">Desert</option>
            <option value="ocean">Ocean</option>
            <option value="jungle">Jungle</option>
            <option value="dungeonEntrance">Dungeon Entrance</option>
            <option value="dungeon">Dungeon</option>
            <option value="castle">Castle</option>
            <option value="cemetery">Cemetery</option>
            <option value="factory">Factory</option>
            <option value="hauntedWoods">Haunted Woods</option>
            <option value="deepOcean">Deep Ocean</option>
          </select>
        </td>
        <td style="text-align:right;padding-right:20px;width:100%">EXPLORER AREA</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptFightToggle" onclick="window.autoChangeVar('toggleFight',!scriptVars.toggleFight,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/combat.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">FIGHT</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptResetToggle" onclick="window.autoChangeVar('toggleResetFight',!scriptVars.toggleResetFight,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/resetFightingPotion.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">RESET POTION</td>
      </tr>
    </tbody>
  </table>
  <table style="border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 20px;width: 97%;">
    <tbody>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptResetArea','fields',!scriptVars.scriptResetArea.fields,this.id)" id="fieldsResetToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/fields.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">Fields</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptResetArea','forests',!scriptVars.scriptResetArea.forests,this.id)" id="forestsResetToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/forests.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">Forests</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptResetArea','caves',!scriptVars.scriptResetArea.caves,this.id)" id="cavesResetToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/caves.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">Caves</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptResetArea','volcano',!scriptVars.scriptResetArea.volcano,this.id)" id="volcanoResetToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/volcano.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">Volcano</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptResetArea','northernFields',!scriptVars.scriptResetArea.northernFields,this.id)" id="northernFieldsResetToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/northernFields.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">Northern Fields</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptResetArea','hauntedMansion',!scriptVars.scriptResetArea.hauntedMansion,this.id)" id="hauntedMansionResetToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/hauntedMansion.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">Haunted Mansion</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptResetArea','desert',!scriptVars.scriptResetArea.desert,this.id)" id="desertResetToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/desert.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">Desert</td>
      </tr>
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptResetArea','ocean',!scriptVars.scriptResetArea.ocean,this.id)" id="oceanResetToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/ocean.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">Ocean</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptResetArea','jungle',!scriptVars.scriptResetArea.jungle,this.id)" id="jungleResetToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/jungle.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">Jungle</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptResetArea','dungeonEntrance',!scriptVars.scriptResetArea.dungeonEntrance,this.id)" id="dungeonEntranceResetToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/dungeonEntrance.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">Dungeon Entrance</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptResetArea','dungeon',!scriptVars.scriptResetArea.dungeon,this.id)" id="dungeonResetToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/dungeon.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">Dungeon</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptResetArea','castle',!scriptVars.scriptResetArea.castle,this.id)" id="castleResetToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/castle.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">Castle</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptResetArea','cemetery',!scriptVars.scriptResetArea.cemetery,this.id)" id="cemeteryResetToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/cemetery.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">Cemetery</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptResetArea','factory',!scriptVars.scriptResetArea.factory,this.id)" id="factoryResetToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/factory.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">Factory</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptResetArea','hauntedWoods',!scriptVars.scriptResetArea.hauntedWoods,this.id)" id="hauntedWoodsResetToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/hauntedWoods.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">Haunted Woods</td>
      </tr>
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptResetArea','deepOcean',!scriptVars.scriptResetArea.deepOcean,this.id)" id="deepOceanResetToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/deepOcean.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">Deep Ocean</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptMonsterFindToggle" onclick="window.autoChangeVar('toggleMonsterFind',!scriptVars.toggleMonsterFind,this.id)" style="cursor: pointer; color: green;">
        <td style="padding-left: 10px;"><img src="images/skeletonMonster.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">SEARCH FOR MONSTER</td>
      </tr>
    </tbody>
  </table>
  <table style="border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptExplorerArea" style="color: white;">
        <td style="padding-left: 10px;"><img src="images/exploringSkill.png" class="img-small"></td>
        <td style="padding-left: 50px;"><select name="scriptMonsterOptions" onchange="window.autoChangeVar('scriptMonster',this.value)" id="scriptMonsterOptions">
          </select>
        </td>
        <td style="text-align:right;padding-right:20px;width:100%">MONSTER TO SEARCH</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptShinyToggle" onclick="window.autoChangeVar('toggleShiny',!scriptVars.toggleShiny,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/shiny.gif" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">SHINY/GEM GOBLIN HUNT</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptSpellToggle" onclick="window.autoChangeVar('toggleSpell',!scriptVars.toggleSpell,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/fireSpell.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">SPELL</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptCombatPotionToggle" onclick="window.autoChangeVar('toggleCombatPotion',!scriptVars.toggleCombatPotion,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/ghostScanCombatPotion.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">COMBAT POTION</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptHealToggle" onclick="window.autoChangeVar('toggleHeal',!scriptVars.toggleHeal,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/autoTickHeal.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">TICK HEAL</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptBloodMoonToggle" onclick="window.autoChangeVar('toggleBM',!scriptVars.toggleBM,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/bloodMoonIcon.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">BLOOD MOON</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptCousinToggle" onclick="window.autoChangeVar('toggleCousin',!scriptVars.toggleCousin,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/goblinCousin.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">GOBLIN COUSIN</td>
      </tr>
    </tbody>
  </table>
  <table style="border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptCousinArea" style="color: white;">
        <td style="padding-left: 10px;"><img src="images/fields.png" class="img-small"></td>
        <td style="padding-left: 50px;">
          <select name="scriptCousinAreaOptions" onchange="window.autoChangeVar('scriptCousinArea',this.value)" id="scriptCousinAreaOptions">
            <option value="fields">Fields</option>
            <option value="forests">Forests</option>
            <option value="caves">Caves</option>
            <option value="volcano">Volcano</option>
            <option value="northernFields">Northern Fields</option>
            <option value="hauntedMansion">Haunted Mansion</option>
            <option value="desert">Desert</option>
            <option value="ocean">Ocean</option>
            <option value="jungle">Jungle</option>
            <option value="dungeonEntrance">Dungeon Entrance</option>
            <option value="dungeon">Dungeon</option>
            <option value="castle">Castle</option>
            <option value="cemetery">Cemetery</option>
            <option value="factory">Factory</option>
            <option value="hauntedWoods">Haunted Woods</option>
            <option value="deepOcean">Deep Ocean</option>
          </select>
        </td>
        <td style="text-align:right;padding-right:20px;width:100%">COUSIN AREA</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptBagsToggle" onclick="window.autoChangeVar('toggleBags',!scriptVars.toggleBags,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/oceanLoot.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">BAGS OPENING</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptFieldsBagsToggle" onclick="window.autoChangeVar('toggleFieldsBags',!scriptVars.toggleFieldsBags,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/fieldsLoot.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">FIELDS BAGS OPENING</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptStatueToggle" onclick="window.autoChangeVar('toggleStatue',!scriptVars.toggleStatue,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/bronzeStatueMetalDetector.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">STATUE SELL</td>
      </tr>
    </tbody>
  </table>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptArtifactToggle" onclick="window.autoChangeVar('toggleArtifact',!scriptVars.toggleArtifact,this.id)" style="cursor: pointer; color: red;">
        <td style="padding-left: 10px;"><img src="images/skullArtifact.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">ARTIFACT CONVERT</td>
      </tr>
    </tbody>
  </table>
</div>`
 
	let scriptConfCookingTab = `<div id="tab-scriptConfigCooking" style="display:none">
  <div class="main-button-lighter">
    <table>
      <tbody>
        <tr onclick="navigate('scriptConfig');playPreviousMenuSound();" style="cursor: pointer;">
          <td><img src="images/back.png" class="img-small"></td>
          <td class="back-label">BACK</td>
        </tr>
      </tbody>
    </table>
  </div>
  <table style="cursor: pointer;border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 32px;">
    <tbody>
      <tr id="scriptBoatToggle" onclick="window.autoChangeVar('toggleBoat',!scriptVars.toggleBoat,this.id)" style="cursor: pointer; color: green;">
        <td style="padding-left: 10px;"><img src="images/sailBoat.png" class="img-small"></td>
        <td style="text-align:right;padding-right:20px;width:100%">BOAT</td>
      </tr>
    </tbody>
  </table>
  <table style="border: 1px solid grey;border-radius: 6px;margin: 10px 7px;background: #1a1a1a;font-size: 20px;width: 97%;">
    <tbody style="display: table-row;">
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptBoatSend','rowBoat',!scriptVars.scriptBoatSend.rowBoat,this.id)" id="rowBoatSendToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/rowBoat.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">ROW BOAT</td>
      </tr>
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptBoatSend','canoeBoat',!scriptVars.scriptBoatSend.canoeBoat,this.id)" id="canoeBoatSendToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/canoeBoat.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">CANOE</td>
      </tr>
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptBoatSend','sailBoat',!scriptVars.scriptBoatSend.sailBoat,this.id)" id="sailBoatSendToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/sailBoat.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">SAIL BOAT</td>
      </tr>
      <tr style="display: inline-block; color: red; width: 50%;" onclick="window.autoChangeObject('scriptBoatSend','highWind',!scriptVars.scriptBoatSend.highWind,this.id)" id="highWindSendToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/windIcon.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">WAIT HIGH WIND</td>
      </tr>
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptBoatSend','steamBoat',!scriptVars.scriptBoatSend.steamBoat,this.id)" id="steamBoatSendToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/steamBoat.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">STEAM BOAT</td>
      </tr>
      <tr style="display: inline-block; color: green; width: 50%;" onclick="window.autoChangeObject('scriptBoatSend','trawler',!scriptVars.scriptBoatSend.trawler,this.id)" id="trawlerSendToggle">
        <td style="padding-left: 10px;width: 5%;"><img src="images/trawler.png" class="img-small"></td>
        <td style="text-align: center;width: 40%">TRAWLER</td>
      </tr>
    </tbody>
  </table>
</div>`;
	$(chatDiv).insertAfter('#tab-logout');
	$(scriptConfCookingTab).insertAfter('#tab-logout');
	$(scriptConfExploringTab).insertAfter('#tab-logout');
	$(scriptConfPotionsTab).insertAfter('#tab-logout');
	$(scriptConfBrewingTab).insertAfter('#tab-logout');
	$(scriptConfSeedsTab).insertAfter('#tab-logout');
	$(scriptConfFarmingTab).insertAfter('#tab-logout');
	$(scriptConfWoodcuttingTab).insertAfter('#tab-logout');
	$(scriptConfCraftingTab).insertAfter('#tab-logout');
	$(scriptConfMiningTab).insertAfter('#tab-logout');
	$(scriptConfTab).insertAfter('#tab-logout');
	
	let compareBar = `<a href="https://dounford-felipe.github.io/DHM-Compare/" target="_blank" style="text-decoration:none;">
		<div class="main-button">
			<table>
				<tbody><tr>
					<td><img src="https://raw.githubusercontent.com/Dounford-Felipe/DHM-Compare/main/images/favicon.ico" class="img-small"></td>
					<td class="back-label">COMPARE TOOL</td>
				</tr></tbody>
			</table>
		</div>
	</a>`;
	$(compareBar).insertAfter('#your-profile-link');
	
	let cookAllItem = `<div class="main-button-lighter" id="scriptCook" style="background-color: rgb(0, 77, 0);">
	<table>
		<tbody>
			<tr>
				<td style="width: 20%; position: relative;"><img src="images/heat.png" class="img-medium"></td>
				<td class="main-button-table-tr-td2">
					<span class="main-button-span-item-owned" id="heatNeeded">0</span><span> HEAT NEEDED</span>
					<hr class="no-space">
					<span class="main-button-span-desc" onclick="getHeatNeeded()" style="background-color: darkcyan;padding: 4px;">GET HEAT NEEDED</span>
					<span class="main-button-span-desc" onclick="cookAll()" style="background-color: darkcyan;padding: 4px;margin-left: 10px;">COOK ALL</span>
				</td>
			</tr>
		</tbody>
	</table>
	</div>`
	$(cookAllItem).insertAfter('#item-box-energy')
	
	let growTimeNeededItem = `<div class="main-button-lighter" id="scriptgrowTimeNeeded" style="background-color: rgb(26, 51, 0);">
	<table>
		<tbody>
			<tr>
				<td style="width: 20%; position: relative;"><img src="images/clock.png" class="img-medium"></td>
				<td class="main-button-table-tr-td2" style="padding-bottom: 6px;">
					<span class="main-button-span-item-owned" id="growTimeNeeded">TIME TO GROW ALL</span>
					<hr class="no-space">
					<span class="main-button-span-desc" onclick="getTimeNeeded()" style="background-color: darkcyan;padding: 4px;">	GET TIME NEEDED TO GROW ALL</span>
				</td>
			</tr>
		</tbody>
	</table>
	</div>`
	$(growTimeNeededItem).insertAfter('#item-box-bonemealBin')
	
	let bonemealNeededItem = `<div class="main-button-lighter" id="scriptBonemealNeeded" style="background-color: rgb(26, 51, 0);">
	<table>
		<tbody>
			<tr>
				<td style="width: 20%; position: relative;"><img src="images/ashes.png" class="img-medium"></td>
				<td class="main-button-table-tr-td2" style="padding-bottom: 6px;">
					<span class="main-button-span-item-owned" id="bonemealNeeded">0</span><span> BONEMEAL NEEDED</span>
					<hr class="no-space">
					<span class="main-button-span-desc" onclick="getBonemealNeeded()" style="background-color: darkcyan;padding: 4px;">	GET BONEMEAL NEEDED</span>
				</td>
			</tr>
		</tbody>
	</table>
	</div>`
	$(bonemealNeededItem).insertAfter('#item-box-bonemealBin')
}
 
function addWikiButton() {
	let itemBox = document.querySelectorAll('[id^="item-box-"]');
	itemBox = Array.from(itemBox);
	itemBox = itemBox.filter(function(element) {
		return !element.id.startsWith("item-box-amount");
	});
	for (var i = 0; i < itemBox.length; i++) {
		let wikiURL = itemBox[i].id.substr(9).replace(/([A-Z0-9])/g, ' $1').trim();
		wikiURL = wikiURL.charAt(0).toUpperCase() + wikiURL.slice(1);
		let wikiButton = document.createElement("a");
		wikiButton.href = 'https://diamondhuntmobile.fandom.com/wiki/'+wikiURL
		wikiButton.target = '_blank'
		wikiButton.style.position = 'absolute'
        wikiButton.style.top = '0';
		wikiButton.innerHTML = '<img src="images/wiki.png" style="width:25px;height:25px;">'
		itemBox[i].querySelector('td').style.position = 'relative';
		itemBox[i].querySelector('td').appendChild(wikiButton);
	}
}
 
function scriptStyleTabs() {
	document.getElementById('scriptGlobalToggle').style.color = scriptVars.toggleGlobal ? 'green' : 'red';
	document.getElementById('scriptLoginToggle').style.color = JSON.parse(localStorage.getItem('autoLogin')) ? 'green' : 'red';
	document.getElementById('scriptGeodeToggle').style.color = scriptVars.toggleGeodeOpen ? 'green' : 'red';
	document.getElementById('scriptMineralToggle').style.color = scriptVars.toggleMineralIdentify ? 'green' : 'red';
	document.getElementById('scriptNecklaceToggle').style.color = scriptVars.toggleNecklaceCharge ? 'green' : 'red';
	document.getElementById('scriptTrainToggle').style.color = scriptVars.toggleTrain ? 'green' : 'red';
	document.getElementById('scriptTrainAmount').value = scriptVars.scriptTrainAmount;
	document.getElementById('scriptRocketToggle').style.color = scriptVars.toggleRocket ? 'green' : 'red';
	document.getElementById('scriptRocketDestination').value = scriptVars.scriptRocket;
	document.getElementById('scriptSmeltingToggle').style.color = scriptVars.toggleSmelting ? 'green' : 'red';
	document.getElementById('scriptRefinaryToggle').style.color = scriptVars.toggleRefinary ? 'green' : 'red';
	document.getElementById('scriptRefinaryOptions').value = scriptVars.scriptRefinaryBar;
	document.getElementById('scriptFoundryToggle').style.color = scriptVars.toggleCharcoal ? 'green' : 'red';
	document.getElementById('scriptFoundryWoodOptions').value = scriptVars.scriptFoundryWood;
	document.getElementById('scriptLumberToggle').style.color = scriptVars.toggleWoodcutting ? 'green' : 'red';
	document.getElementById('treeIgnoreToggle').style.color = scriptVars.scriptTreeIgnore.tree ? 'green' : 'red';
	document.getElementById('oakTreeIgnoreToggle').style.color = scriptVars.scriptTreeIgnore.oakTree ? 'green' : 'red';
	document.getElementById('willowTreeIgnoreToggle').style.color = scriptVars.scriptTreeIgnore.willowTree ? 'green' : 'red';
	document.getElementById('mapleTreeIgnoreToggle').style.color = scriptVars.scriptTreeIgnore.mapleTree ? 'green' : 'red';
	document.getElementById('redwoodTreeIgnoreToggle').style.color = scriptVars.scriptTreeIgnore.redwoodTree ? 'green' : 'red';
	document.getElementById('pineTreeIgnoreToggle').style.color = scriptVars.scriptTreeIgnore.pineTree ? 'green' : 'red';
	document.getElementById('hauntedTreeIgnoreToggle').style.color = scriptVars.scriptTreeIgnore.hauntedTree ? 'green' : 'red';
	document.getElementById('jungleTreeIgnoreToggle').style.color = scriptVars.scriptTreeIgnore.jungleTree ? 'green' : 'red';
	document.getElementById('lavaTreeIgnoreToggle').style.color = scriptVars.scriptTreeIgnore.lavaTree ? 'green' : 'red';
	document.getElementById('goldTreeIgnoreToggle').style.color = scriptVars.scriptTreeIgnore.goldTree ? 'green' : 'red';
	document.getElementById('magicTreeIgnoreToggle').style.color = scriptVars.scriptTreeIgnore.magicTree ? 'green' : 'red';
	document.getElementById('appleTreeIgnoreToggle').style.color = scriptVars.scriptTreeIgnore.appleTree ? 'green' : 'red';
	document.getElementById('cactusTreeIgnoreToggle').style.color = scriptVars.scriptTreeIgnore.cactusTree ? 'green' : 'red';
	document.getElementById('bananaTreeIgnoreToggle').style.color = scriptVars.scriptTreeIgnore.bananaTree ? 'green' : 'red';
	document.getElementById('palmTreeIgnoreToggle').style.color = scriptVars.scriptTreeIgnore.palmTree ? 'green' : 'red';
	document.getElementById('pineappleTreeIgnoreToggle').style.color = scriptVars.scriptTreeIgnore.pineappleTree ? 'green' : 'red';
	document.getElementById('starfruitTreeIgnoreToggle').style.color = scriptVars.scriptTreeIgnore.starfruitTree ? 'green' : 'red';
	document.getElementById('scriptFarmingToggle').style.color = scriptVars.toggleFarming ? 'green' : 'red';
	document.getElementById('scriptBonesToggle').style.color = scriptVars.toggleBones ? 'green' : 'red';
	document.getElementById('bonesIgnoreToggle').style.color = scriptVars.scriptBonesIgnore.bones ? 'green' : 'red';
	document.getElementById('ashesIgnoreToggle').style.color = scriptVars.scriptBonesIgnore.ashes ? 'green' : 'red';
	document.getElementById('iceBonesIgnoreToggle').style.color = scriptVars.scriptBonesIgnore.iceBones ? 'green' : 'red';
	document.getElementById('zombieBonesIgnoreToggle').style.color = scriptVars.scriptBonesIgnore.zombieBones ? 'green' : 'red';
	document.getElementById('bloodBonesIgnoreToggle').style.color = scriptVars.scriptBonesIgnore.bloodBones ? 'green' : 'red';
	document.getElementById('fishBonesIgnoreToggle').style.color = scriptVars.scriptBonesIgnore.fishBones ? 'green' : 'red';
	document.getElementById('scriptFertilizeToggle').style.color = scriptVars.toggleFertilize ? 'green' : 'red';
	document.getElementById('MushroomFertilizeToggle').style.color = scriptVars.scriptFertilize.redMushroomSeeds ? 'green' : 'red';
	document.getElementById('dottedGreenFertilizeToggle').style.color = scriptVars.scriptFertilize.dottedGreenLeafSeeds ? 'green' : 'red';
	document.getElementById('greenLeafFertilizeToggle').style.color = scriptVars.scriptFertilize.greenLeafSeeds ? 'green' : 'red';
	document.getElementById('limeLeafFertilizeToggle').style.color = scriptVars.scriptFertilize.limeLeafSeeds ? 'green' : 'red';
	document.getElementById('goldLeafFertilizeToggle').style.color = scriptVars.scriptFertilize.goldLeafSeeds ? 'green' : 'red';
	document.getElementById('crystalLeafFertilizeToggle').style.color = scriptVars.scriptFertilize.crystalLeafSeeds ? 'green' : 'red';
	document.getElementById('stripedGreenLeafFertilizeToggle').style.color = scriptVars.scriptFertilize.stripedGreenLeafSeeds ? 'green' : 'red';
	document.getElementById('stripedGoldLeafFertilizeToggle').style.color = scriptVars.scriptFertilize.stripedGoldLeafSeeds ? 'green' : 'red';
	document.getElementById('stripedCrystalLeafFertilizeToggle').style.color = scriptVars.scriptFertilize.stripedCrystalLeafSeeds ? 'green' : 'red';
	document.getElementById('scriptDrinkToggle').style.color = scriptVars.toggleDrink ? 'green' : 'red';
	document.getElementById('scriptBrewToggle').style.color = scriptVars.toggleBrew ? 'green' : 'red';
	document.getElementById('scriptTreeUpgradeToggle').style.color = scriptVars.toggleTreeUpgrade ? 'green' : 'red';
	document.getElementById('treeUpgradeToggle').style.color = scriptVars.scriptTreeUpgrade.tree ? 'green' : 'red';
	document.getElementById('oakTreeUpgradeToggle').style.color = scriptVars.scriptTreeUpgrade.oakTree ? 'green' : 'red';
	document.getElementById('willowTreeUpgradeToggle').style.color = scriptVars.scriptTreeUpgrade.willowTree ? 'green' : 'red';
	document.getElementById('mapleTreeUpgradeToggle').style.color = scriptVars.scriptTreeUpgrade.mapleTree ? 'green' : 'red';
	document.getElementById('redwoodTreeUpgradeToggle').style.color = scriptVars.scriptTreeUpgrade.redwoodTree ? 'green' : 'red';
	document.getElementById('pineTreeUpgradeToggle').style.color = scriptVars.scriptTreeUpgrade.pineTree ? 'green' : 'red';
	document.getElementById('hauntedTreeUpgradeToggle').style.color = scriptVars.scriptTreeUpgrade.hauntedTree ? 'green' : 'red';
	document.getElementById('jungleTreeUpgradeToggle').style.color = scriptVars.scriptTreeUpgrade.jungleTree ? 'green' : 'red';
	document.getElementById('lavaTreeUpgradeToggle').style.color = scriptVars.scriptTreeUpgrade.lavaTree ? 'green' : 'red';
	document.getElementById('goldTreeUpgradeToggle').style.color = scriptVars.scriptTreeUpgrade.goldTree ? 'green' : 'red';
	document.getElementById('magicTreeUpgradeToggle').style.color = scriptVars.scriptTreeUpgrade.magicTree ? 'green' : 'red';
	document.getElementById('appleTreeUpgradeToggle').style.color = scriptVars.scriptTreeUpgrade.appleTree ? 'green' : 'red';
	document.getElementById('cactusTreeUpgradeToggle').style.color = scriptVars.scriptTreeUpgrade.cactusTree ? 'green' : 'red';
	document.getElementById('bananaTreeUpgradeToggle').style.color = scriptVars.scriptTreeUpgrade.bananaTree ? 'green' : 'red';
	document.getElementById('palmTreeUpgradeToggle').style.color = scriptVars.scriptTreeUpgrade.palmTree ? 'green' : 'red';
	document.getElementById('pineappleTreeUpgradeToggle').style.color = scriptVars.scriptTreeUpgrade.pineappleTree ? 'green' : 'red';
	document.getElementById('scriptExploreToggle').style.color = scriptVars.toggleExplore ? 'green' : 'red';
	document.getElementById('scriptAreaOptions').value = scriptVars.scriptArea;
	window.monsterOptions(scriptVars.scriptArea);
	document.getElementById('scriptFightToggle').style.color = scriptVars.toggleFight ? 'green' : 'red';
	document.getElementById('fieldsResetToggle').style.color = scriptVars.scriptResetArea.fields ? 'green' : 'red';
	document.getElementById('forestsResetToggle').style.color = scriptVars.scriptResetArea.forests ? 'green' : 'red';
	document.getElementById('cavesResetToggle').style.color = scriptVars.scriptResetArea.caves ? 'green' : 'red';
	document.getElementById('volcanoResetToggle').style.color = scriptVars.scriptResetArea.volcano ? 'green' : 'red';
	document.getElementById('northernFieldsResetToggle').style.color = scriptVars.scriptResetArea.northernFields ? 'green' : 'red';
	document.getElementById('hauntedMansionResetToggle').style.color = scriptVars.scriptResetArea.hauntedMansion ? 'green' : 'red';
	document.getElementById('desertResetToggle').style.color = scriptVars.scriptResetArea.desert ? 'green' : 'red';
	document.getElementById('oceanResetToggle').style.color = scriptVars.scriptResetArea.ocean ? 'green' : 'red';
	document.getElementById('jungleResetToggle').style.color = scriptVars.scriptResetArea.jungle ? 'green' : 'red';
	document.getElementById('dungeonEntranceResetToggle').style.color = scriptVars.scriptResetArea.dungeonEntrance ? 'green' : 'red';
	document.getElementById('dungeonResetToggle').style.color = scriptVars.scriptResetArea.dungeon ? 'green' : 'red';
	document.getElementById('castleResetToggle').style.color = scriptVars.scriptResetArea.castle ? 'green' : 'red';
	document.getElementById('cemeteryResetToggle').style.color = scriptVars.scriptResetArea.cemetery ? 'green' : 'red';
	document.getElementById('factoryResetToggle').style.color = scriptVars.scriptResetArea.factory ? 'green' : 'red';
	document.getElementById('hauntedWoodsResetToggle').style.color = scriptVars.scriptResetArea.hauntedWoods ? 'green' : 'red';
	document.getElementById('deepOceanResetToggle').style.color = scriptVars.scriptResetArea.deepOcean ? 'green' : 'red';
	document.getElementById('scriptResetToggle').style.color = scriptVars.toggleResetFight ? 'green' : 'red';
	document.getElementById('scriptMonsterOptions').value = scriptVars.scriptMonster;
	document.getElementById('scriptMonsterFindToggle').style.color = scriptVars.toggleMonsterFind ? 'green' : 'red';
	document.getElementById('scriptShinyToggle').style.color = scriptVars.toggleShiny ? 'green' : 'red';
	document.getElementById('scriptSpellToggle').style.color = scriptVars.toggleSpell ? 'green' : 'red';
	document.getElementById('scriptCombatPotionToggle').style.color = scriptVars.toggleCombatPotion ? 'green' : 'red';
	document.getElementById('scriptHealToggle').style.color = scriptVars.toggleHeal ? 'green' : 'red';
	document.getElementById('scriptBloodMoonToggle').style.color = scriptVars.toggleBM ? 'green' : 'red';
	document.getElementById('scriptCousinToggle').style.color = scriptVars.toggleCousin ? 'green' : 'red';
	document.getElementById('scriptCousinArea').value = scriptVars.scriptCousinArea;
	document.getElementById('scriptBagsToggle').style.color = scriptVars.toggleBags ? 'green' : 'red';
	document.getElementById('scriptFieldsBagsToggle').style.color = scriptVars.toggleFieldsBags ? 'green' : 'red';
	document.getElementById('scriptStatueToggle').style.color = scriptVars.toggleStatue ? 'green' : 'red';
	document.getElementById('scriptArtifactToggle').style.color = scriptVars.toggleArtifact ? 'green' : 'red';
	document.getElementById('scriptBoatToggle').style.color = scriptVars.toggleBoat ? 'green' : 'red';
	document.getElementById('rowBoatSendToggle').style.color = scriptVars.scriptBoatSend.rowBoat ? 'green' : 'red';
	document.getElementById('canoeBoatSendToggle').style.color = scriptVars.scriptBoatSend.canoeBoat ? 'green' : 'red';
	document.getElementById('sailBoatSendToggle').style.color = scriptVars.scriptBoatSend.sailBoat ? 'green' : 'red';
	document.getElementById('highWindSendToggle').style.color = scriptVars.scriptBoatSend.highWind ? 'green' : 'red';
	document.getElementById('steamBoatSendToggle').style.color = scriptVars.scriptBoatSend.steamBoat ? 'green' : 'red';
	document.getElementById('trawlerSendToggle').style.color = scriptVars.scriptBoatSend.trawler ? 'green' : 'red';
}
 
function saveOreOrder() {
  let key = `idleAgain-oreOrder${window.username}`;
  var oreItems = document.getElementById("sortableOres").getElementsByTagName("li");
  var oreOrder = [];
 
  for (var i = 0; i < oreItems.length; i++) {
    var oreValue = oreItems[i].getAttribute("value");
    var oreMinimum = oreItems[i].querySelector(".oreMinimum").value;
 
 
    oreOrder.push({ value: oreValue, minimum: oreMinimum });
  }
 
  localStorage.setItem(key, JSON.stringify(oreOrder));
}
 
function loadOreOrder() {
  let key = `idleAgain-oreOrder${window.username}`;
  var oreOrderData = localStorage.getItem(key);
 
  if (oreOrderData) {
    oreOrderData = JSON.parse(oreOrderData);
    var oreOrderList = document.getElementById("sortableOres");
 
    for (var i = 0; i < oreOrderData.length; i++) {
      var oreValue = oreOrderData[i].value;
      var minimum = oreOrderData[i].minimum;
      var oreItem = oreOrderList.querySelector("[value='" + oreValue + "']");
      
      oreOrderList.appendChild(oreItem);
	  var oreMinimum = oreItem.querySelector(".oreMinimum");
      oreMinimum.value = minimum
    }
  }
}
 
function saveSeedOrder() {
  let key = `idleAgain-seedOrder${window.username}`;
  var seedOrderList = document.getElementById("sortableSeeds");
  var seedItems = seedOrderList.getElementsByTagName("li");
  var seedOrder = [];
 
  for (var i = 0; i < seedItems.length; i++) {
    var seedValue = seedItems[i].getAttribute("value");
    var seedCheckbox = seedItems[i].querySelector(".seed-checkbox");
    var isChecked = seedCheckbox.checked;
 
    seedOrder.push({ value: seedValue, checked: isChecked });
  }
 
  localStorage.setItem(key, JSON.stringify(seedOrder));
}
 
function loadSeedOrder() {
  let key = `idleAgain-seedOrder${window.username}`;
  var seedOrderData = localStorage.getItem(key);
 
  if (seedOrderData) {
    seedOrderData = JSON.parse(seedOrderData);
    var seedOrderList = document.getElementById("sortableSeeds");
 
    for (var i = 0; i < seedOrderData.length; i++) {
      var seedValue = seedOrderData[i].value;
      var isChecked = seedOrderData[i].checked;
      var seedItem = seedOrderList.querySelector("[value='" + seedValue + "']");
      var seedCheckbox = seedItem.querySelector(".seed-checkbox");
 
      if (isChecked) {
        seedCheckbox.checked = true;
      } else {
        seedCheckbox.checked = false;
      }
 
      seedOrderList.appendChild(seedItem);
    }
  }
}
 
window.savePotions = function() {
  let key = `idleAgain-potionState${window.username}`;
  var potionList = document.getElementById("sortablePotions");
  var potionItems = potionList.getElementsByTagName("li");
  var potionState = [];
 
  for (var i = 0; i < potionItems.length; i++) {
    var potionValue = potionItems[i].getAttribute("value");
    var drinkCheckbox = potionItems[i].querySelector(".drink-checkbox");
    var brewCheckbox = potionItems[i].querySelector(".brew-checkbox");
    var isDrinkChecked = drinkCheckbox.checked;
    var isBrewChecked = brewCheckbox.checked;
 
    potionState.push({
      value: potionValue,
      drinkChecked: isDrinkChecked,
      brewChecked: isBrewChecked
    });
  }
 
  localStorage.setItem(key, JSON.stringify(potionState));
}
 
function loadPotions() {
  let key = `idleAgain-potionState${window.username}`;
  var potionState = localStorage.getItem(key);
 
  if (potionState) {
    potionState = JSON.parse(potionState);
    var potionList = document.getElementById("sortablePotions");
    var potionItems = potionList.getElementsByTagName("li");
 
    for (var i = 0; i < potionState.length; i++) {
      var potionValue = potionState[i].value;
      var drinkCheckbox = potionItems[i].querySelector(".drink-checkbox");
      var brewCheckbox = potionItems[i].querySelector(".brew-checkbox");
      var isDrinkChecked = potionState[i].drinkChecked;
      var isBrewChecked = potionState[i].brewChecked;
 
      drinkCheckbox.checked = isDrinkChecked;
      brewCheckbox.checked = isBrewChecked;
    }
  }
}
 
window.monsterOptions = function(monsterArea) {
    var select = document.getElementById("scriptMonsterOptions");
    select.innerHTML = "";
 
    if (monsterArea === "fields") {
        addOptions(select, ["chicken", "rat", "bee", "chickenGroup"]);
    } else if (monsterArea === "forests") {
        addOptions(select, ["snake", "ent", "thief"]);
    } else if (monsterArea === "caves") {
        addOptions(select, ["bear", "bat", "skeleton"]);
    } else if (monsterArea === "volcano") {
        addOptions(select, ["lavaSnake", "fireHawk", "fireMage", "fireHawkGroup"]);
    } else if (monsterArea === "northernFields") {
        addOptions(select, ["iceHawk", "frozenEnt", "golem", "iceHawkGroup"]);
    } else if (monsterArea === "hauntedMansion") {
        addOptions(select, ["ghost", "skeletonGhost", "reaper"]);
    } else if (monsterArea === "desert") {
        addOptions(select, ["desertLizard2", "scorpion", "lizard"]);
    } else if (monsterArea === "ocean") {
        addOptions(select, ["squid", "oceanShark", "pufferFish"]);
    } else if (monsterArea === "jungle") {
        addOptions(select, ["gorilla", "elephant", "tribe"]);
    } else if (monsterArea === "dungeonEntrance") {
        addOptions(select, ["gargoyle", "poisonTribe", "statue"]);
    } else if (monsterArea === "dungeon") {
        addOptions(select, ["skeletonMonks", "darkMage", "skeletonPrisoner"]);
    } else if (monsterArea === "castle") {
        addOptions(select, ["castleKnight", "dragon", "castleMage"]);
    } else if (monsterArea === "cemetery") {
        addOptions(select, ["angel", "zombie", "babySkeleton"]);
    } else if (monsterArea === "factory") {
        addOptions(select, ["robotArcher", "robotMage", "robotWheelie"]);
    } else if (monsterArea === "hauntedWoods") {
        addOptions(select, ["reaper2", "skeletonGhost2", "ghostPack"]);
    } else if (monsterArea === "deepOcean") {
        addOptions(select, ["poisonSquid", "tridentSoldier", "piranhas"]);
    }
}
 
function addOptions(select, optionsArray) {
    for (var i = 0; i < optionsArray.length; i++) {
        var option = document.createElement("option");
        var optionText = optionsArray[i].replace(/([A-Z0-9])/g, ' $1').trim();
        option.value = optionsArray[i];
        option.text = optionText.charAt(0).toUpperCase() + optionText.slice(1);
        select.appendChild(option);
    }
}
 
//Chat
const chatSend = () => {
        var inputValue = document.getElementById('message-body').value.slice(-100);
		if (blockedHTML.some(item => inputValue.includes(item))) {
			inputValue = '';
			showMessage("<b>Something you sent is not allowed to be send, please remove anything that can cause problems to others before try again.</b>",'ChatBot')
		} else {
			publishMessage(inputValue);
		}
        document.getElementById('message-body').value = '';
};
 
window.sendChat = chatSend
 
window.clearChat = function() {
	document.getElementById('messages').innerHTML = ''
}
 
const showMessage = (msg, sender) => {
		if (blockedHTML.some(item => msg.includes(item))) {
			msg = 'This message was blocked for safety';
		}
		if (msg.startsWith('https') || msg.startsWith('www')) {msg = '<a href='+msg+' target="_blank">'+msg+'</a>'}
        var messageContainer = document.createElement('div');
        var senderElement = document.createElement('strong');
        senderElement.innerText = sender + ": ";
        messageContainer.appendChild(senderElement);
        var message = document.createElement('span');
        message.innerHTML = msg;
		if (msg.includes('@'+username)) {
			message.style.backgroundColor = 'gold';
			ding.play()
		};
		messageContainer.style.wordWrap = "break-word";
        messageContainer.appendChild(message);
        var messageArea = document.getElementById('messages');
        messageArea.appendChild(messageContainer);
        messageArea.scrollTop = messageArea.scrollHeight;
};
 
let pubnub;
 
const setupPubNub = () => {
        // Update this block with your publish/subscribe keys
        pubnub = new PubNub({
            publishKey : "pub-c-dc687e48-701e-473a-bbce-091329dcb723",
            subscribeKey : "sub-c-feab3982-e3f8-4dec-ad9c-a82105f20783",
            userId: "myUniqueUserId"
		});
        // add listener
		const listener = {
            status: (statusEvent) => {
                if (statusEvent.category === "PNConnectedCategory") {
                    console.log("Connected");
                }
            },
            message: (messageEvent) => {
                showMessage(messageEvent.message.description, messageEvent.message.sender);
            }
        };
        pubnub.addListener(listener);
 
        // subscribe to a channel
        pubnub.subscribe({
            channels: ["hello_world"]
        });
};
 
    // publish message
const publishMessage = async (message) => {
        // With the right payload, you can publish a message, add a reaction to a message,
        // send a push notification, or send a small payload called a signal.
        const publishPayload = {
            channel : "hello_world",
            message: {
                title: "greeting",
                description: message,
                sender: username
            }
        };
        await pubnub.publish(publishPayload);
}
 
setupPubNub();
 
window.onload = function() {
	$(function() {
		$("#sortableSeeds").sortable({
			update: function(event, ui) {saveSeedOrder()}
		});
		$("#sortableSeeds").disableSelection();
		$("#sortableOres").sortable({
			update: function(event, ui) {saveOreOrder()}
		});
		$("#sortableOres").disableSelection();
	});
	var teleportCooldown = (teleportSpellUpgraded === 1) ? 300 : 900;
	scriptWaitTeleport = (explorerCooldown > teleportCooldown + 10) ? true : false
	if (JSON.parse(localStorage.getItem('IANotification')) !== 1) {
		alert('You need to config the Idle Again Script');
		localStorage.setItem('IANotification',1)
	};
	addWikiButton();
	document.getElementById('fight-button').querySelectorAll('td')[0].setAttribute('onclick', 'clicksFightButton();window.autoPoison();');
	document.getElementById('fight-button').querySelectorAll('td')[1].setAttribute('onclick', 'clicksFightButton();window.autoPoison();');
};
 
scriptAddTabs();
 
function initLoginNotifications() {
	var loginObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
			if (document.getElementById("game-screen").style.display !== "none") {
				console.log('logando');
				navigate('exploreSelect');
				navigate('main');
				onLogin();
			}
		});    
    });
		
	var loginTarget = document.getElementById('game-screen');
    loginObserver.observe(loginTarget, { attributes : true, attributeFilter : ['style'] });
	
	
	var reloadObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
			if (document.getElementById("dialogue-reconnecting").style.display !== "none") {
				console.log('reloading')
				setTimeout(function(){window.location.reload()},10000);
			}
		});    
    });
		
	var reloadTarget = document.getElementById('dialogue-reconnecting');
    reloadObserver.observe(reloadTarget, { attributes : true, attributeFilter : ['style'] });
}
 
initLoginNotifications();
 
function onLogin() {
	console.log('log in')
	loadUserVars();
	scriptStyleTabs();
	loadSeedOrder();
	loadOreOrder();
	loadPotions();
	localStorage.setItem('lastLogin',username);
}
 
function handleKeyDown2(event) {
  if (event.keyCode === 13) {
    window.sendChat();
  }
}
 
window.handleKeyDown = handleKeyDown2
 
function autoGameLoop() {
    if (scriptVars.toggleGlobal === true) {
        if (scriptVars.toggleTrain === true) autoTrain();
        if (scriptVars.toggleRocket === true) autoRocket();
        if (scriptVars.toggleSmelting === true) autoSmelt();
        if (scriptVars.toggleRefinary === true) autoRefine();
        if (scriptVars.toggleCharcoal === true) autoFoundry();
        if (scriptVars.toggleWoodcutting === true) autoLumber();
		if (scriptVars.toggleFertilize === true) autoFertilize();
        if (scriptVars.toggleFarming === true) autoPlant();
        if (scriptVars.toggleDrink === true) autoDrink();
        if (scriptVars.toggleBrew === true) autoBrew();
        if (scriptVars.toggleBM === true) autoBM();
        if (scriptVars.toggleExplore === true) autoExplore();
        if (scriptVars.toggleFight === true) autoFight();
		if (scriptVars.toggleResetFight === true) autoReset();
        if (scriptVars.toggleCousin === true) autoCousin();
        if (scriptVars.toggleBoat === true) autoBoat();
		if (scriptVars.toggleEvent === true) autoEvent();
    }
}
 
function autoGameLoopSlow() {
    if (scriptVars.toggleGlobal === true) {
        if (scriptVars.toggleGeodeOpen === true) autoGeodeOpen();
        if (scriptVars.toggleMineralIdentify === true) autoIdentify();
        if (scriptVars.toggleNecklaceCharge === true) autoNecklaceCharge();
        if (scriptVars.toggleBones === true) autoBones();
		if (scriptVars.toggleTreeUpgrade === true) autoTreeUpgrade();
		if (scriptVars.toggleBags === true) autoBags();
		if (scriptVars.toggleFieldsBags === true) autoFieldsBags();
        if (scriptVars.toggleStatue === true) autoStatue();
        if (scriptVars.toggleArtifact === true) autoArtifact();
        if (scriptVars.toggleMap === true) autoMap();
    }
}
 
function autoGameLoopFast() {
	if (scriptVars.toggleGlobal === true) {
		if (scriptVars.toggleSpell === true) autoSpell();
		if (scriptVars.toggleShiny === true || scriptVars.toggleMonsterFind === true) autoMonsterHunt();
		if (scriptVars.toggleCombatPotion === true) autoCombatPot();
		if (scriptVars.toggleCombatSwap === true) autoCombatSwap();
	}
}
 
function autoGameLoopVeryFast() {
	if (scriptVars.toggleGlobal === true) {
		if (scriptVars.toggleHeal === true) autoHeal();
	}
}
 
const gameLoopInterval = setInterval(function(){
    autoGameLoop()
}, 5000);
 
const gameLoopSlowInterval = setInterval(function(){
    autoGameLoopSlow()
}, 60000);
 
const gameLoopFastInterval = setInterval(function(){
    autoGameLoopFast()
}, 750);
 
const gameLoopVeryFastInterval = setInterval(function(){
    autoGameLoopVeryFast()
}, 250);
 
if (JSON.parse(localStorage.getItem('autoLogin')) == true) {
	let lastUser = localStorage.getItem('lastLogin')
	document.querySelector('#login-preset-'+lastUser+' tbody tr td:first-child').click();
}
 
Object.defineProperty(document, 'hidden', {
  configurable: true,
  get: function() {
    return false;
  }
});
 
})();

var VERSION_NUMBER = "1.1";
 
window.addEventListener("load", function() {
    console.log('Loading DHM Helper...');
    var loaded = false;
    loading();
    var Hinterval = setInterval(loading, 100);
 
    function loading() {
        if (loaded === false) {
            console.log("Loaded DHM Helper");
            loaded = true;
            addStyles();
            createNav();
            createMenu();
            init();
        }
    }
    
    function addStyles() {
        let style = document.createElement('style');
        style.innerHTML = `
            #dhm-helper-menu {
                position: absolute;
                background: white;
                width: 700px;
                height: 777px;
                max-width: 100%;
                max-height: 100%;
                z-index: 10000;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                box-shadow: black 0 0 15px 1px;
				overflow-y: auto;
            }
            #dhm-helper-menu h1, #dhm-helper-menu span, #dhm-helper-menu p {
                color: black;
                text-align: center;
            }
            #dhm-helper-menu h1 img {
                margin: 0 10px 0 10px;
            }
            #dhm-helper-menu h1 img:nth-child(1) {
                transform: scaleX(-1);
            }
            .dhm-helper-headerContainer {
                text-align: center;
            }
            #dhm-helper-menu hr {
                background-color: #e0e0e0;
                width: 100%;
            }
            .dhm-helper-inputContainer {
                max-width: 400px;
                margin: 0 auto;
                height: 40px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .dhm-helper-inputContainer input[type="checkbox"] {
                width: 20px;
                height: 20px;
            }
            .dhm-helper-inputContainer-sub input[type="checkbox"] {
                margin-left: 25px;
            }
            .dhm-helper-inputContainer-sub-sub input[type="checkbox"] {
                margin-left: 50px;
            }
            .dhm-helper-inputContainer label {
                color: black;
                font-size: 20px;
            }
            #dhm-helper-menu span {
                color: #5a5a5a;
                padding: 5px;
            }
			.dialogue-button {
				border:1px solid silver;
				background-color:#e6e6e6;
				border-radius:3pt;
				color:black;
				font-size:14pt;
				text-align:center;
				cursor:pointer;
				padding:10px;
			}`;
        document.head.appendChild(style);
    }
 
    function createNav() {
		let navItem = document.createElement('div');
		let miscTab = document.querySelectorAll("#tab-misc > .main-button");
		navItem.innerHTML = `<div onclick="window.toggleMenu2()" class="main-button" style="cursor: pointer;">
		<table>
			<tbody><tr>
			<td><img src="images/bronzeStarLamp.png" class="img-small"></td>
			<td style="text-align:right;padding-right:20px;font-size:12pt;">DESKTOP NOTFICATIONS</td>
			</tr>
		</tbody></table>
		</div>`;
		miscTab[2].parentNode.insertBefore(navItem,miscTab[3]);
    }
 
    function createMenu() {
        let menu = document.createElement('div');
        menu.setAttribute('id', 'dhm-helper-menu');
        menu.style.display = 'none';
        
        let closeButton = document.createElement('div');
        closeButton.setAttribute('class', 'dialogue-button');
        closeButton.innerText = "Close";
        closeButton.addEventListener('click', toggleMenu)
        menu.appendChild(closeButton);
 
        let headerContainer = document.createElement('div');
        headerContainer.setAttribute('class', 'dhm-helper-headerContainer');
 
        let header = document.createElement('h1');
        let headerImage = document.createElement('img');
        headerImage.setAttribute('src', 'images/bronzeStarLamp.png');
        headerImage.setAttribute('class', 'img-medium');
        let headerImage2 = headerImage.cloneNode(true);
        header.innerText = "DHM Helper";
        header.insertBefore(headerImage, header.firstChild);
        header.appendChild(headerImage2);
        headerContainer.appendChild(header);
 
        let version = document.createElement('span');
        version.innerText = "Version: " + VERSION_NUMBER;
        headerContainer.appendChild(version);
        
        menu.appendChild(headerContainer);
        
        let hr = document.createElement('hr');
        menu.appendChild(hr);
    
        // Global Notifications Checkbox
        let notificationsInputContainer = document.createElement('div');
        notificationsInputContainer.setAttribute('class', 'dhm-helper-inputContainer');
        let notificationsInput = document.createElement('input');
        notificationsInput.setAttribute('type', 'checkbox');
        notificationsInput.setAttribute('name', 'dhm-notificationsInput');
        notificationsInput.setAttribute('data-storage', 'hNotifications');
        
        if (localStorage.hNotifications === "true") {
            notificationsInput.setAttribute('checked', 'checked');
        }
        notificationsInput.addEventListener("change", grantNotifications);
        
        let notificationsLabel = document.createElement('label');
        notificationsLabel.setAttribute('for', 'checkbox');
        notificationsLabel.innerText = "Desktop Notifications";
 
        notificationsInputContainer.append(notificationsInput);
        notificationsInputContainer.append(notificationsLabel);
 
        menu.appendChild(notificationsInputContainer);
 
        // Daily Mission Notifications Checkbox
        let dailyInputContainer = document.createElement('div');
        dailyInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let dailyInput = document.createElement('input');
        dailyInput.setAttribute('type', 'checkbox');
        dailyInput.setAttribute('name', 'dhm-notificationsInput');
        dailyInput.setAttribute('data-storage', 'hDaily');
        
        if (localStorage.hDaily === "true") {
            dailyInput.setAttribute('checked', 'checked');
        }
        dailyInput.addEventListener("change", toggleStorage);
        
        let dailyLabel = document.createElement('label');
        dailyLabel.setAttribute('for', 'checkbox');
        dailyLabel.innerText = "Daily Mission Notifications";
 
        dailyInputContainer.append(dailyInput);
        dailyInputContainer.append(dailyLabel);
 
        menu.appendChild(dailyInputContainer);
 
        // Treasure Map Notifications Checkbox
        let mapInputContainer = document.createElement('div');
        mapInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let mapInput = document.createElement('input');
        mapInput.setAttribute('type', 'checkbox');
        mapInput.setAttribute('name', 'dhm-notificationsInput');
        mapInput.setAttribute('data-storage', 'hMap');
        
        if (localStorage.hMap === "true") {
            mapInput.setAttribute('checked', 'checked');
        }
        mapInput.addEventListener("change", toggleStorage);
        
        let mapLabel = document.createElement('label');
        mapLabel.setAttribute('for', 'checkbox');
        mapLabel.innerText = "Treasure Map Notifications";
 
        mapInputContainer.append(mapInput);
        mapInputContainer.append(mapLabel);
 
        menu.appendChild(mapInputContainer);
 
        // Event Notifications Checkbox
        let eventInputContainer = document.createElement('div');
        eventInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let eventInput = document.createElement('input');
        eventInput.setAttribute('type', 'checkbox');
        eventInput.setAttribute('name', 'dhm-notificationsInput');
        eventInput.setAttribute('data-storage', 'hEvent');
        
        if (localStorage.hEvent === "true") {
            eventInput.setAttribute('checked', 'checked');
        }
        eventInput.addEventListener("change", toggleStorage);
        
        let eventLabel = document.createElement('label');
        eventLabel.setAttribute('for', 'checkbox');
        eventLabel.innerText = "Event Notifications";
 
        eventInputContainer.append(eventInput);
        eventInputContainer.append(eventLabel);
 
        menu.appendChild(eventInputContainer);
 
        // Research Notifications Checkbox
        let researchInputContainer = document.createElement('div');
        researchInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let researchInput = document.createElement('input');
        researchInput.setAttribute('type', 'checkbox');
        researchInput.setAttribute('name', 'dhm-notificationsInput');
        researchInput.setAttribute('data-storage', 'hResearch');
        
        if (localStorage.hResearch === "true") {
            researchInput.setAttribute('checked', 'checked');
        }
        researchInput.addEventListener("change", toggleStorage);
        
        let researchLabel = document.createElement('label');
        researchLabel.setAttribute('for', 'checkbox');
        researchLabel.innerText = "Research Notifications";
 
        researchInputContainer.append(researchInput);
        researchInputContainer.append(researchLabel);
 
        menu.appendChild(researchInputContainer);
 
        // Train Notifications Checkbox
        let trainInputContainer = document.createElement('div');
        trainInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let trainInput = document.createElement('input');
        trainInput.setAttribute('type', 'checkbox');
        trainInput.setAttribute('name', 'dhm-notificationsInput');
        trainInput.setAttribute('data-storage', 'hTrain');
        
        if (localStorage.hTrain === "true") {
            trainInput.setAttribute('checked', 'checked');
        }
        trainInput.addEventListener("change", toggleStorage);
        
        let trainLabel = document.createElement('label');
        trainLabel.setAttribute('for', 'checkbox');
        trainLabel.innerText = "Train Notifications";
 
        trainInputContainer.append(trainInput);
        trainInputContainer.append(trainLabel);
 
        menu.appendChild(trainInputContainer);
 
        // Rocket Notifications Checkbox
        let rocketInputContainer = document.createElement('div');
        rocketInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let rocketInput = document.createElement('input');
        rocketInput.setAttribute('type', 'checkbox');
        rocketInput.setAttribute('name', 'dhm-notificationsInput');
        rocketInput.setAttribute('data-storage', 'hRocket');
        
        if (localStorage.hRocket === "true") {
            rocketInput.setAttribute('checked', 'checked');
        }
        rocketInput.addEventListener("change", toggleStorage);
        
        let rocketLabel = document.createElement('label');
        rocketLabel.setAttribute('for', 'checkbox');
        rocketLabel.innerText = "Rocket Notifications";
 
        rocketInputContainer.append(rocketInput);
        rocketInputContainer.append(rocketLabel);
 
        menu.appendChild(rocketInputContainer);
 
        // Furnace Notifications Checkbox
        let furnaceInputContainer = document.createElement('div');
        furnaceInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let furnaceInput = document.createElement('input');
        furnaceInput.setAttribute('type', 'checkbox');
        furnaceInput.setAttribute('name', 'dhm-notificationsInput');
        furnaceInput.setAttribute('data-storage', 'hFurnace');
        
        if (localStorage.hFurnace === "true") {
            furnaceInput.setAttribute('checked', 'checked');
        }
        furnaceInput.addEventListener("change", toggleStorage);
        
        let furnaceLabel = document.createElement('label');
        furnaceLabel.setAttribute('for', 'checkbox');
        furnaceLabel.innerText = "Furnace Notifications";
 
        furnaceInputContainer.append(furnaceInput);
        furnaceInputContainer.append(furnaceLabel);
 
        menu.appendChild(furnaceInputContainer);
 
        // Foundry Notifications Checkbox
        let foundryInputContainer = document.createElement('div');
        foundryInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let foundryInput = document.createElement('input');
        foundryInput.setAttribute('type', 'checkbox');
        foundryInput.setAttribute('name', 'dhm-notificationsInput');
        foundryInput.setAttribute('data-storage', 'hFoundry');
        
        if (localStorage.hFoundry === "true") {
            foundryInput.setAttribute('checked', 'checked');
        }
        foundryInput.addEventListener("change", toggleStorage);
        
        let foundryLabel = document.createElement('label');
        foundryLabel.setAttribute('for', 'checkbox');
        foundryLabel.innerText = "Foundry Notifications";
 
        foundryInputContainer.append(foundryInput);
        foundryInputContainer.append(foundryLabel);
 
        menu.appendChild(foundryInputContainer);
 
        // Refinary Notifications Checkbox
        let refinaryInputContainer = document.createElement('div');
        refinaryInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let refinaryInput = document.createElement('input');
        refinaryInput.setAttribute('type', 'checkbox');
        refinaryInput.setAttribute('name', 'dhm-notificationsInput');
        refinaryInput.setAttribute('data-storage', 'hRefinary');
        
        if (localStorage.hRefinary === "true") {
            refinaryInput.setAttribute('checked', 'checked');
        }
        refinaryInput.addEventListener("change", toggleStorage);
        
        let refinaryLabel = document.createElement('label');
        refinaryLabel.setAttribute('for', 'checkbox');
        refinaryLabel.innerText = "Refinary Notifications";
 
        refinaryInputContainer.append(refinaryInput);
        refinaryInputContainer.append(refinaryLabel);
 
        menu.appendChild(refinaryInputContainer);
 
        // Tree Notifications Checkbox
        let treeInputContainer = document.createElement('div');
        treeInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let treeInput = document.createElement('input');
        treeInput.setAttribute('type', 'checkbox');
        treeInput.setAttribute('name', 'dhm-notificationsInput');
        treeInput.setAttribute('data-storage', 'hTree');
        
        if (localStorage.hTree === "true") {
            treeInput.setAttribute('checked', 'checked');
        }
        treeInput.addEventListener("change", toggleStorage);
        
        let treeLabel = document.createElement('label');
        treeLabel.setAttribute('for', 'checkbox');
        treeLabel.innerText = "Tree Notifications";
 
        treeInputContainer.append(treeInput);
        treeInputContainer.append(treeLabel);
 
        menu.appendChild(treeInputContainer);
 
        // Shiny Tree Notifications Checkbox
        let shinyTreeInputContainer = document.createElement('div');
        shinyTreeInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let shinyTreeInput = document.createElement('input');
        shinyTreeInput.setAttribute('type', 'checkbox');
        shinyTreeInput.setAttribute('name', 'dhm-notificationsInput');
        shinyTreeInput.setAttribute('data-storage', 'hShinyTree');
        
        if (localStorage.hShinyTree === "true") {
            shinyTreeInput.setAttribute('checked', 'checked');
        }
        shinyTreeInput.addEventListener("change", toggleStorage);
        
        let shinyTreeLabel = document.createElement('label');
        shinyTreeLabel.setAttribute('for', 'checkbox');
        shinyTreeLabel.innerText = "Shiny Tree Notifications";
 
        shinyTreeInputContainer.append(shinyTreeInput);
        shinyTreeInputContainer.append(shinyTreeLabel);
 
        menu.appendChild(shinyTreeInputContainer);
 
        // Planter Notifications Checkbox
        let planterInputContainer = document.createElement('div');
        planterInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let planterInput = document.createElement('input');
        planterInput.setAttribute('type', 'checkbox');
        planterInput.setAttribute('name', 'dhm-notificationsInput');
        planterInput.setAttribute('data-storage', 'hPlanter');
        
        if (localStorage.hPlanter === "true") {
            planterInput.setAttribute('checked', 'checked');
        }
        planterInput.addEventListener("change", toggleStorage);
        
        let planterLabel = document.createElement('label');
        planterLabel.setAttribute('for', 'checkbox');
        planterLabel.innerText = "Planter Notifications";
 
        planterInputContainer.append(planterInput);
        planterInputContainer.append(planterLabel);
 
        menu.appendChild(planterInputContainer);
 
        // Explorer Notifications Checkbox
        let explorerInputContainer = document.createElement('div');
        explorerInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let explorerInput = document.createElement('input');
        explorerInput.setAttribute('type', 'checkbox');
        explorerInput.setAttribute('name', 'dhm-notificationsInput');
        explorerInput.setAttribute('data-storage', 'hExplorer');
        
        if (localStorage.hExplorer === "true") {
            explorerInput.setAttribute('checked', 'checked');
        }
        explorerInput.addEventListener("change", toggleStorage);
        
        let explorerLabel = document.createElement('label');
        explorerLabel.setAttribute('for', 'checkbox');
        explorerLabel.innerText = "Explorer Notifications";
 
        explorerInputContainer.append(explorerInput);
        explorerInputContainer.append(explorerLabel);
 
        menu.appendChild(explorerInputContainer);
 
        // Teleport Notifications Checkbox
        let teleportInputContainer = document.createElement('div');
        teleportInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let teleportInput = document.createElement('input');
        teleportInput.setAttribute('type', 'checkbox');
        teleportInput.setAttribute('name', 'dhm-notificationsInput');
        teleportInput.setAttribute('data-storage', 'hTeleport');
        
        if (localStorage.hTeleport === "true") {
            teleportInput.setAttribute('checked', 'checked');
        }
        teleportInput.addEventListener("change", toggleStorage);
        
        let teleportLabel = document.createElement('label');
        teleportLabel.setAttribute('for', 'checkbox');
        teleportLabel.innerText = "Teleport Notifications";
 
        teleportInputContainer.append(teleportInput);
        teleportInputContainer.append(teleportLabel);
 
        menu.appendChild(teleportInputContainer);
 
        // Shiny Monster Notifications Checkbox
        let shinyInputContainer = document.createElement('div');
        shinyInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let shinyInput = document.createElement('input');
        shinyInput.setAttribute('type', 'checkbox');
        shinyInput.setAttribute('name', 'dhm-notificationsInput');
        shinyInput.setAttribute('data-storage', 'hShiny');
        
        if (localStorage.hShiny === "true") {
            shinyInput.setAttribute('checked', 'checked');
        }
        shinyInput.addEventListener("change", toggleStorage);
        
        let shinyLabel = document.createElement('label');
        shinyLabel.setAttribute('for', 'checkbox');
        shinyLabel.innerText = "Shiny Monster Notifications";
 
        shinyInputContainer.append(shinyInput);
        shinyInputContainer.append(shinyLabel);
 
        menu.appendChild(shinyInputContainer);
 
        // Cousin Notifications Checkbox
        let cousinInputContainer = document.createElement('div');
        cousinInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let cousinInput = document.createElement('input');
        cousinInput.setAttribute('type', 'checkbox');
        cousinInput.setAttribute('name', 'dhm-notificationsInput');
        cousinInput.setAttribute('data-storage', 'hCousin');
        
        if (localStorage.hCousin === "true") {
            cousinInput.setAttribute('checked', 'checked');
        }
        cousinInput.addEventListener("change", toggleStorage);
        
        let cousinLabel = document.createElement('label');
        cousinLabel.setAttribute('for', 'checkbox');
        cousinLabel.innerText = "Cousin Notifications";
 
        cousinInputContainer.append(cousinInput);
        cousinInputContainer.append(cousinLabel);
 
        menu.appendChild(cousinInputContainer);
 
        // Boat Notifications Checkbox
        let boatInputContainer = document.createElement('div');
        boatInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let boatInput = document.createElement('input');
        boatInput.setAttribute('type', 'checkbox');
        boatInput.setAttribute('name', 'dhm-notificationsInput');
        boatInput.setAttribute('data-storage', 'hBoat');
        
        if (localStorage.hBoat === "true") {
            boatInput.setAttribute('checked', 'checked');
        }
        boatInput.addEventListener("change", toggleStorage);
        
        let boatLabel = document.createElement('label');
        boatLabel.setAttribute('for', 'checkbox');
        boatLabel.innerText = "Boat Notifications";
 
        boatInputContainer.append(boatInput);
        boatInputContainer.append(boatLabel);
 
        menu.appendChild(boatInputContainer);
 
        // Chef Notifications Checkbox
        let chefInputContainer = document.createElement('div');
        chefInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let chefInput = document.createElement('input');
        chefInput.setAttribute('type', 'checkbox');
        chefInput.setAttribute('name', 'dhm-notificationsInput');
        chefInput.setAttribute('data-storage', 'hChef');
        
        if (localStorage.hChef === "true") {
            chefInput.setAttribute('checked', 'checked');
        }
        chefInput.addEventListener("change", toggleStorage);
        
        let chefLabel = document.createElement('label');
        chefLabel.setAttribute('for', 'checkbox');
        chefLabel.innerText = "Chef Notifications";
 
        chefInputContainer.append(chefInput);
        chefInputContainer.append(chefLabel);
 
        menu.appendChild(chefInputContainer);
 
        // Goblin Shop Notifications Checkbox
        let goblinShopInputContainer = document.createElement('div');
        goblinShopInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let goblinShopInput = document.createElement('input');
        goblinShopInput.setAttribute('type', 'checkbox');
        goblinShopInput.setAttribute('name', 'dhm-notificationsInput');
        goblinShopInput.setAttribute('data-storage', 'hGoblinShop');
        
        if (localStorage.hGoblinShop === "true") {
            goblinShopInput.setAttribute('checked', 'checked');
        }
        goblinShopInput.addEventListener("change", toggleStorage);
        
        let goblinShopLabel = document.createElement('label');
        goblinShopLabel.setAttribute('for', 'checkbox');
        goblinShopLabel.innerText = "Goblin Shop Notifications";
 
        goblinShopInputContainer.append(goblinShopInput);
        goblinShopInputContainer.append(goblinShopLabel);
 
        menu.appendChild(goblinShopInputContainer);
 
        document.body.appendChild(menu);
    }
 
    function grantNotifications() {
        if (localStorage["hNotifications"] && localStorage["hNotifications"] == "true") {
            localStorage["hNotifications"] = "false";
        } else {
            if (Notification.permission !== "granted") {
                Notification.requestPermission(function(permission) {
                    if (permission === "granted") {
                        localStorage["hNotifications"] = "true";
                    } else {
                        alert("You will need to need desktop notifcations for DHM alerts to work.")
                    }
                  });
            } else {
                localStorage["hNotifications"] = "true";
            }
        }
    }
 
    function toggleStorage() {
        let name = this.getAttribute('data-storage');
        if (localStorage[name] && localStorage[name] == "true") {
            localStorage[name] = "false";
        } else {
            localStorage[name] = "true";
        }
    }
 
    function toggleMenu() {
        let menu = document.getElementById('dhm-helper-menu');
        menu.style.display = menu.style.display === 'none' ? '' : 'none';
    }
 
window.toggleMenu2 = toggleMenu 
 
	function init() {
		// Daily Mission
		var dailyObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-dailyMissionNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hDaily === "true")) {
                        var notification = new Notification("Daily Mission Available",{ icon: 'images/dailyMissions.png' });
                    }
                }
            });    
        });
		
		var dailyTarget = document.getElementById('notification-dailyMissionNotification');
        dailyObserver.observe(dailyTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Treasure Map
		var mapObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-treasureMapNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hMap === "true")) {
                        var notification = new Notification("Treasure Map Found",{ icon: 'images/treasureMap.png' });
                    }
                }
            });    
        });
		
		var mapTarget = document.getElementById('notification-treasureMapNotification');
        mapObserver.observe(mapTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Green Treasure Map
		var greenMapObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-greenTreasureMapNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hMap === "true")) {
                        var notification = new Notification("Green Treasure Map Found",{ icon: 'images/greenTreasureMap.png' });
                    }
                }
            });    
        });
		
		var greenMapTarget = document.getElementById('notification-greenTreasureMapNotification');
        greenMapObserver.observe(greenMapTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Event
		var eventObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("main-button-event").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hEvent === "true")) {
                        var notification = new Notification("Event Coming",{ icon: 'images/meteorEvent.png' });
                    }
                }
            });    
        });
		
		var eventTarget = document.getElementById('main-button-event');
        eventObserver.observe(eventTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Event Glowing
		var glowingObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-eventFullyActiveNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hEvent === "true")) {
                        var notification = new Notification("Event Glowing",{ icon: 'images/meteorActionEvent.png' });
                    }
                }
            });    
        });
		
		var glowingTarget = document.getElementById('notification-eventFullyActiveNotification');
        glowingObserver.observe(glowingTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Researcher
		var researchObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-researcherNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hResearch === "true")) {
                        var notification = new Notification("Research Ready",{ icon: 'images/researcher.png' });
                    }
                }
            });    
        });
		
		var researchTarget = document.getElementById('notification-researcherNotification');
        researchObserver.observe(researchTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Train Ready
		var trainObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-profileNotificationsOffTrain").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hTrain === "true")) {
                        var notification = new Notification("Train Ready",{ icon: 'images/train.png' });
                    }
                }
            });    
        });
		
		var trainTarget = document.getElementById('notification-profileNotificationsOffTrain');
        trainObserver.observe(trainTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Train at Destination
		var trainDestinationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-trainNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hTrain === "true")) {
                        var notification = new Notification("Train Ready To Collect",{ icon: 'images/train.png' });
                    }
                }
            });    
        });
		
		var trainDestinationTarget = document.getElementById('notification-trainNotification');
        trainDestinationObserver.observe(trainDestinationTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Rocket Ready
		var rocketObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-profileNotificationsOffRocket").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hRocket === "true")) {
                        var notification = new Notification("Rocket Ready",{ icon: 'images/rocket.png' });
                    }
                }
            });    
        });
		
		var rocketTarget = document.getElementById('notification-profileNotificationsOffRocket');
        rocketObserver.observe(rocketTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Rocket at Destination
		var rocketDestinationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-rocketNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hRocket === "true")) {
                        var notification = new Notification("Rocket Ready To Collect",{ icon: 'images/rocket.png' });
                    }
                }
            });    
        });
		
		var rocketDestinationTarget = document.getElementById('notification-rocketNotification');
        rocketDestinationObserver.observe(rocketDestinationTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Furnace Idle
		var furnaceObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-profileNotificationsOffFurnace").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hFurnace === "true")) {
                        var notification = new Notification("Furnace Empty",{ icon: 'images/goldFurnace.png' });
                    }
                }
            });    
        });
		
		var furnaceTarget = document.getElementById('notification-profileNotificationsOffFurnace');
        furnaceObserver.observe(furnaceTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Foundry Idle
		var foundryObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-charcoalFoundryPercentage").style.display == "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hFoundry === "true")) {
                        var notification = new Notification("Foundry Empty",{ icon: 'images/charcoalFoundry.png' });
                    }
                }
            });    
        });
		
		var foundryTarget = document.getElementById('notification-charcoalFoundryPercentage');
        foundryObserver.observe(foundryTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Refinary Idle
		var refinaryObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-goldBarRefineryNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hRefinary === "true")) {
                        var notification = new Notification("Refinary Ready",{ icon: 'images/goldRefinary.png' });
                    }
                }
            });    
        });
		
		var refinaryTarget = document.getElementById('notification-goldBarRefineryNotification');
        refinaryObserver.observe(refinaryTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Tree Ready
		var treeObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-treeNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hTree === "true")) {
                        var notification = new Notification("Tree Ready",{ icon: 'images/tree.png' });
                    }
                }
            });    
        });
		
		var treeTarget = document.getElementById('notification-treeNotification');
        treeObserver.observe(treeTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Shiny Tree
		var shinyTree1Observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("tree-thumbnail-img-1").style.backgroundImage == 'url("images/shiny.gif")') {
                    if ((localStorage.hNotifications === "true") && (localStorage.hShinyTree === "true")) {
                        var notification = new Notification("Shiny Tree Growing",{ icon: 'images/shiny.gif' });
                    }
                }
            });    
        });
		
		var shinyTree1Target = document.getElementById('tree-thumbnail-img-1');
        shinyTree1Observer.observe(shinyTree1Target, { attributes : true, attributeFilter : ['style'] });
		//2
		var shinyTree2Observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("tree-thumbnail-img-2").style.backgroundImage == 'url("images/shiny.gif")') {
                    if ((localStorage.hNotifications === "true") && (localStorage.hShinyTree === "true")) {
                        var notification = new Notification("Shiny Tree Growing",{ icon: 'images/shiny.gif' });
                    }
                }
            });    
        });
		
		var shinyTree2Target = document.getElementById('tree-thumbnail-img-2');
        shinyTree2Observer.observe(shinyTree2Target, { attributes : true, attributeFilter : ['style'] });
		//3
		var shinyTree3Observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("tree-thumbnail-img-3").style.backgroundImage == 'url("images/shiny.gif")') {
                    if ((localStorage.hNotifications === "true") && (localStorage.hShinyTree === "true")) {
                        var notification = new Notification("Shiny Tree Growing",{ icon: 'images/shiny.gif' });
                    }
                }
            });    
        });
		
		var shinyTree3Target = document.getElementById('tree-thumbnail-img-3');
        shinyTree3Observer.observe(shinyTree3Target, { attributes : true, attributeFilter : ['style'] });
		//4
		var shinyTree4Observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("tree-thumbnail-img-4").style.backgroundImage == 'url("images/shiny.gif")') {
                    if ((localStorage.hNotifications === "true") && (localStorage.hShinyTree === "true")) {
                        var notification = new Notification("Shiny Tree Growing",{ icon: 'images/shiny.gif' });
                    }
                }
            });    
        });
		
		var shinyTree4Target = document.getElementById('tree-thumbnail-img-4');
        shinyTree4Observer.observe(shinyTree4Target, { attributes : true, attributeFilter : ['style'] });
		//5
		var shinyTree5Observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("tree-thumbnail-img-5").style.backgroundImage == 'url("images/shiny.gif")') {
                    if ((localStorage.hNotifications === "true") && (localStorage.hShinyTree === "true")) {
                        var notification = new Notification("Shiny Tree Growing",{ icon: 'images/shiny.gif' });
                    }
                }
            });    
        });
		
		var shinyTree5Target = document.getElementById('tree-thumbnail-img-5');
        shinyTree5Observer.observe(shinyTree5Target, { attributes : true, attributeFilter : ['style'] });
		//6
		var shinyTree6Observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("tree-thumbnail-img-6").style.backgroundImage == 'url("images/shiny.gif")') {
                    if ((localStorage.hNotifications === "true") && (localStorage.hShinyTree === "true")) {
                        var notification = new Notification("Shiny Tree Growing",{ icon: 'images/shiny.gif' });
                    }
                }
            });    
        });
		
		var shinyTree6Target = document.getElementById('tree-thumbnail-img-6');
        shinyTree6Observer.observe(shinyTree6Target, { attributes : true, attributeFilter : ['style'] });
		
		// Planter Empty
		var planterObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-profileNotificationsOffPlanter").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hPlanter === "true")) {
                        var notification = new Notification("Planter Idle",{ icon: 'images/planter.png' });
                    }
                }
            });    
        });
		
		var planterTarget = document.getElementById('notification-profileNotificationsOffPlanter');
        planterObserver.observe(planterTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Explorer Idle
		var explorerObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-exploringNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hExplorer === "true")) {
                        var notification = new Notification("Explorer Idle",{ icon: 'images/explorer.png' });
                    }
                }
            });    
        });
		
		var explorerTarget = document.getElementById('notification-exploringNotification');
        explorerObserver.observe(explorerTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Teleport Ready
		var teleportObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("explorer-teleportCd-label").style.display == "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hTeleport === "true")) {
                        var notification = new Notification("Teleport Ready",{ icon: 'images/teleportSpell.png' });
                    }
                }
            });    
        });
		
		var teleportTarget = document.getElementById('explorer-teleportCd-label');
        teleportObserver.observe(teleportTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Shiny Monster
		var shinyObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("img-tag-monster-shiny").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hShiny === "true")) {
                        var notification = new Notification("Shiny Monster",{ icon: 'images/shiny.gif' });
                    }
                }
            });    
        });
		
		var shinyTarget = document.getElementById('img-tag-monster-shiny');
        shinyObserver.observe(shinyTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Cousin Idle
		var cousinObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-exploringNotification2").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hCousin === "true")) {
                        var notification = new Notification("Cousin Idle",{ icon: 'images/goblinCousin.png' });
                    }
                }
            });    
        });
		
		var cousinTarget = document.getElementById('notification-exploringNotification2');
        cousinObserver.observe(cousinTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Boat Idle
		var boatObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-rowBoatNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hBoat === "true")) {
                        var notification = new Notification("Boat Ready",{ icon: 'images/rowBoat.png' });
                    }
                }
            });    
        });
		
		var boatTarget = document.getElementById('notification-rowBoatNotification');
        boatObserver.observe(boatTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Canoe Idle
		var canoeObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-canoeBoatNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hBoat === "true")) {
                        var notification = new Notification("Canoe Ready",{ icon: 'images/canoeBoat.png' });
                    }
                }
            });    
        });
		
		var canoeTarget = document.getElementById('notification-canoeBoatNotification');
        canoeObserver.observe(canoeTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Sail Idle
		var sailObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-sailBoatNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hBoat === "true")) {
                        var notification = new Notification("Sail Ready",{ icon: 'images/sailBoat.png' });
                    }
                }
            });    
        });
		
		var sailTarget = document.getElementById('notification-sailBoatNotification');
        sailObserver.observe(sailTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Steam Idle
		var steamObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-steamBoatNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hBoat === "true")) {
                        var notification = new Notification("Steam Ready",{ icon: 'images/steamBoat.png' });
                    }
                }
            });    
        });
		
		var steamTarget = document.getElementById('notification-steamBoatNotification');
        steamObserver.observe(steamTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Trawler Idle
		var trawlerObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-trawlerNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hBoat === "true")) {
                        var notification = new Notification("Trawler Ready",{ icon: 'images/trawler.png' });
                    }
                }
            });    
        });
		
		var trawlerTarget = document.getElementById('notification-trawlerNotification');
        trawlerObserver.observe(trawlerTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Chef Ready
		var chefObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-chefNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hChef === "true")) {
                        var notification = new Notification("Chef Ready",{ icon: 'images/chef.png' });
                    }
                }
            });    
        });
		
		var chefTarget = document.getElementById('notification-chefNotification');
        chefObserver.observe(chefTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Goblin Shop
		var goblinShopObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-gemGoblinShopNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hGoblinShop === "true")) {
                        var notification = new Notification("Goblin Shop New Items",{ icon: 'images/gemGoblinShopIcon.png' });
                    }
                }
            });    
        });
		
		var goblinShopTarget = document.getElementById('notification-gemGoblinShopNotification');
        goblinShopObserver.observe(goblinShopTarget, { attributes : true, attributeFilter : ['style'] });
		
	}
});
 
