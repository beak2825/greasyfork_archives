// ==UserScript==
// @name        MouseHunt AutoBot JCres Edition
// @author      Josh Crescini
// @version    	1.3
// @description Ooiks: An advance user script to automate sounding the hunter horn in MouseHunt application in Facebook with MouseHunt version 3.0 (Longtail) supported and many other features. CnN: An enhanced version to sound horn based on selected algorithm of event or location.
// @require		https://code.jquery.com/jquery-2.2.2.min.js
// @include		http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @include		http://hi5.com/friend/games/MouseHunt*
// @include		http://mousehunt.hi5.hitgrab.com/*
// @grant		unsafeWindow
// @namespace https://greasyfork.org/users/59059
// @downloadURL https://update.greasyfork.org/scripts/22113/MouseHunt%20AutoBot%20JCres%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/22113/MouseHunt%20AutoBot%20JCres%20Edition.meta.js
// ==/UserScript==

// == Basic User Preference Setting (Begin) ==
// // The variable in this section contain basic option will normally edit by most user to suit their own preference
// // Reload MouseHunt page manually if edit this script while running it for immediate effect.

// // Extra delay time before sounding the horn. (in seconds)
// // Default: 5 - 180
var hornTimeDelayMin = 10;
var hornTimeDelayMax = 30;

// // Bot aggressively by ignore all safety measure such as check horn image visible before sounding it. (true/false)
// // Note: Highly recommended to turn off because it increase the chances of getting caught in botting.
// // Note: It will ignore the hornTimeDelayMin and hornTimeDelayMax.
// // Note: It may take a little bit extra of CPU processing power.
var aggressiveMode = false;

// // Enable trap check once an hour. (true/false)
var enableTrapCheck = true;

// // Trap check time different value (00 minutes - 45 minutes)
// // Note: Every player had different trap check time, set your trap check time here. It only take effect if enableTrapCheck = true;
// // Example: If you have XX:00 trap check time then set 00. If you have XX:45 trap check time, then set 45.
var trapCheckTimeDiff = 30;

// // Extra delay time to trap check. (in seconds)
// // Note: It only take effect if enableTrapCheck = true;
var checkTimeDelayMin = 5;
var checkTimeDelayMax = 10;

// // Play sound when encounter king's reward (true/false)
var isKingWarningSound = false;

// // Auto solve KR
var isAutoSolve = true;

// // Extra delay time before solving KR. (in seconds)
// // Default: 10 - 30
var krDelayMin = 10;
var krDelayMax = 30;

// // Time to start and stop solving KR. (in hours, 24-hour format)
// // Example: Script would not auto solve KR between 00:00 - 6:00 when krStopHour = 0 & krStartHour = 6;
// // To disable this feature, set both to the same value.
var krStopHour = 0;
var krStartHour = 0;

// // Extra delay time to start solving KR after krStartHour. (in minutes)
var krStartHourDelayMin = 10;
var krStartHourDelayMax = 30;

// // Maximum retry of solving KR.
// // If KR solved more than this number, pls solve KR manually ASAP in order to prevent MH from caught in botting
var kingsRewardRetryMax = 3;

// // State to indicate whether to save KR image into localStorage or not
var saveKRImage = true;

// // Maximum number of KR image to be saved into localStorage
var maxSaveKRImage = 100;

var pauseAtInvalidLocation = false;
// // The script will pause if player at different location that hunt location set before. (true/false)
// // Note: Make sure you set showTimerInPage to true in order to know what is happening.

// // Time to wait after trap selector clicked (in second)
var secWait = 7;

// // Stop trap arming after X retry
var armTrapRetry = 3;

// // Maximum number of log to be saved into sessionStorage
var maxSaveLog = 500;

// == Basic User Preference Setting (End) ==




// == Advance User Preference Setting (Begin) ==
// // The variable in this section contain some advance option that will change the script behavior.
// // Edit this variable only if you know what you are doing
// // Reload MouseHunt page manually if edit this script while running it for immediate effect.

// // Display timer and message in page title. (true/false)
var showTimerInTitle = true;

// // Embed a timer in page to show next hunter horn timer, highly recommanded to turn on. (true/false)
// // Note: You may not access some option like pause at invalid location if you turn this off.
var showTimerInPage = true;

// // Display the last time the page did a refresh or reload. (true/false)
var showLastPageLoadTime = true;

// // Default time to reload the page when bot encounter error. (in seconds)
var errorReloadTime = 60;

// // Time interval for script timer to update the time. May affect timer accuracy if set too high value. (in seconds)
var timerRefreshInterval = 1;

// // Trap arming status
var LOADING = -1;
var NOT_FOUND = 0;
var ARMED = 1;

// // Trap List
var objTrapList = {
	weapon : [],
	base : [],
	trinket : [],
	bait : []
};

// // Trap Collection
var objTrapCollection = {
	weapon: ["Crystal Mineral Crusher Trap","Biomolecular Re-atomizer Trap","Chrome Arcane Capturing Rod","Law Laser Trap","Zugzwang's Ultimate Move","2010 Blastoff Trap","2012 Big Boom Trap","500 Pound Spiked Crusher","Ambrosial Portal","Ambush","Ancient Box Trap","Ancient Gauntlet","Ancient Spear Gun","Arcane Blast Trap","Arcane Capturing Rod Of Never Yielding Mystery","Bandit Deflector","Birthday Candle Kaboom","Birthday Party Piñata Bonanza","Blackstone Pass Trap","Bottomless Grave","Brain Extractor","Bubbles: The Party Crasher Trap","Cackle Lantern Trap","Candy Crusher Trap","Chesla's Revenge","Christmas Cracker Trap","Chrome DeathBot","Chrome DrillBot","Chrome MonstroBot","Chrome Nannybot","Chrome Oasis Water Node Trap","Chrome Onyx Mallet","Chrome Phantasmic Oasis Trap","Chrome RhinoBot","Chrome Sphynx Wrath","Chrome Tacky Glue Trap","Clockapult of Time","Clockapult of Winter Past","Clockwork Portal Trap","Crystal Crucible Trap","Crystal Tower","Digby DrillBot","Dimensional Chest Trap","Double Diamond Adventure","Dragon Lance","Dreaded Totem Trap","Endless Labyrinth Trap","Engine Doubler","Enraged RhinoBot","Event Horizon","Explosive Toboggan Ride","Festive Gauntlet Crusher","Fluffy DeathBot","Focused Crystal Laser","The Forgotten Art of Dance","Forgotten Pressure Plate Trap","Giant Speaker","Gingerbread House Surprise","Glacier Gatler","Gorgon Trap","Grand Arcanum Trap","Grungy DeathBot","Harpoon Gun","Heat Bath","High Tension Spring","HitGrab Horsey","HitGrab Rainbow Rockin' Horse","HitGrab Rockin' Horse","Horrific Venus Mouse Trap","Ice Blaster","Ice Maiden","Icy RhinoBot","Infinite Labyrinth Trap","Isle Idol Trap","Isle Idol Trap","Isle Idol Trap","Kraken Chaos","The Law Draw","Maniacal Brain Extractor","Mouse DeathBot","Mouse Hot Tub","Mouse Mary O'Nette","Mouse Rocketine","Mouse Trebuchet","Multi-Crystal Laser","Mutated Venus Mouse Trap","Mysteriously unYielding Null-Onyx Rampart of Cascading Amperes","Mystic Pawn Pincher","Nannybot","Net Cannon","Ninja Ambush Trap","Nutcracker Nuisance Trap","NVMRC Forcefield Trap","Oasis Water Node Trap","Obelisk of Incineration","Obelisk of Slumber","Obvious Ambush Trap","Onyx Mallet","PartyBot","Phantasmic Oasis Trap","Pneumatic Tube Trap","Pumpkin Pummeler","Reaper's Perch","Rewers Riposte","RhinoBot","Rune Shark Trap","S.A.M. F.E.D. DN-5","S.L.A.C.","S.L.A.C. II","S.U.P.E.R. Scum Scrubber","Sandstorm MonstroBot","Sandtail Sentinel","School of Sharks","Scum Scrubber","Shrink Ray Trap","Sinister Portal","Snow Barrage","Snowglobe Trap","Soul Catcher","Soul Harvester","Sphynx Wrath","Stale Cupcake Golem Trap","Steam Laser Mk. I","Steam Laser Mk. II","Steam Laser Mk. II (Broken!)","Steam Laser Mk. III","Supply Grabber","Swiss Army Mouse Trap","Tacky Glue Trap","Tarannosaurus Rex Trap","Technic Pawn Pincher","Temporal Turbine","Terrifying Spider Trap","Thorned Venus Mouse Trap","Ultra MegaMouser MechaBot Trap","Veiled Vine Trap","Venus Mouse Trap","Warden Slayer Trap","Warpath Thrasher","Wrapped Gift Trap","Zugzwang's First Move","Zugzwang's Last Move","Zurreal's Folly"],
	base: ["Aqua Base","Bacon Base","Bamboozler Base","Birthday Cake Base","Birthday Dragée Cake Base","Bronze Tournament Base","Candy Cane Base","Carrot Birthday Cake Base","Cheesecake Base","Chocolate Birthday Cake Base","Claw Shot Base","Crushed Birthday Cake Base","Cupcake Birthday Base","Deep Freeze Base","Dehydration Base","Depth Charge Base","Dragon Jade Base","Eerie Base","Eerier Base","Enerchi Induction Base","Explosive Base","Extra Sweet Cupcake Birthday Base","Fan Base","Firecracker Base","Fissure Base","Fracture Base","Gingerbread Base","Golden Tournament Base","Hearthstone Base","Horse Jade Base","Hothouse Base","Jade Base","Labyrinth Base","Living Base","Magma Base","Magnet Base","Minotaur Base","Molten Shrapnel Base","Monkey Jade Base","Monolith Base","Papyrus Base","Physical Brace Base","Polar Base","Polluted Base","Refined Pollutinum Base","Remote Detonator Base","Rift Base","Runic Base","Seasonal Base","Sheep Jade Base","Silver Tournament Base","Skello-ton Base","Snake Jade Base","Soiled Base","Spellbook Base","Spiked Base","Stone Base","Tidal Base","Tiki Base","Tribal Base","Tribal Kaboom Base","Washboard Base","Wooden Base","Wooden Base with Target"],
	bait: ["Ancient Cheese","Arctic Asiago Cheese","Ascended Cheese","Brie Cheese","Brie String Cheese","Candy Corn Cheese","Checkmate Cheese","Cheddar Cheese","Cherry Cheese","Combat Cheese","Creamy Havarti Cheese","Crunchy Cheese","Crunchy Havarti Cheese","Cupcake Colby","Dewthief Camembert","Diamond Cheese","Duskshade Camembert","Extra Sweet Cupcake Colby","Festive Feta","Fishy Fromage","Fusion Fondue","Galleon Gouda","Gauntlet Cheese Tier 2","Gauntlet Cheese Tier 3","Gauntlet Cheese Tier 4","Gauntlet Cheese Tier 5","Gauntlet Cheese Tier 6","Gauntlet Cheese Tier 7","Gauntlet Cheese Tier 8","Gemstone Cheese","Ghoulgonzola Cheese","Gilded Cheese","Gingerbread Cheese","Glowing Gruyere Cheese","Glutter Cheese","Gnarled Cheese","Gouda Cheese","Graveblossom Camembert","Grilled Cheese","Gumbo Cheese","Inferno Havarti Cheese","Lactrodectus Lancashire Cheese","Limelight Cheese","Lunaria Camembert","Magical Havarti Cheese","Magical String Cheese","Maki Cheese","Maki String Cheese","Marble Cheese","Marble String Cheese","Marshmallow Monterey","Master Fusion Cheese","Mineral Cheese","Moon Cheese","Mozzarella Cheese","Null Onyx Gorgonzola","Nutmeg Cheese","Onyx Gorgonzola","Polluted Parmesan Cheese","Pungent Havarti Cheese","Radioactive Blue Cheese","Rancid Radioactive Blue Cheese","Rift Combat Cheese","Rift Glutter Cheese","Rift Rumble Cheese","Rift Susheese Cheese","Riftiago Cheese","Resonator Cheese","Rockforth Cheese","Rumble Cheese","Runic Cheese","Runny Cheese","Seasoned Gouda","Shell Cheese","Snowball Bocconcini","Spicy Havarti Cheese","SUPER|brie+","Susheese Cheese","Sweet Havarti Cheese","Swiss Cheese","Swiss String Cheese","Terre Ricotta Cheese","Toxic Brie","Toxic SUPER|brie+","Undead Emmental","Vanilla Stilton Cheese","Vengeful Vanilla Stilton Cheese","White Cheddar Cheese","Wicked Gnarly Cheese"],
	trinket: ["Gilded Charm", "Compass Magnet Charm","Extreme Wealth Charm","Lantern Oil Charm","Super Nightshade Farming Charm","2014 Charm","2015 Charm","2016 Charm","Airship Charm","Amplifier Charm","Ancient Charm","Antiskele Charm","Artisan Charm","Athlete Charm","Attraction Charm","Baitkeep Charm","Black Powder Charm","Brain Charm","Bravery Charm","Cackle Charm","Cactus Charm","Candy Charm","Champion Charm","Cherry Charm","Chrome Charm","Clarity Charm","Cupcake Charm","Dark Chocolate Charm","Derr Power Charm","Diamond Boost Charm","Door Guard Charm","Double Sponge Charm","Dragonbreath Charm","Dragonbane Charm","Dreaded Charm","Dusty Coal Charm","Eggscavator Charge Charm","Eggstra Charm","Eggstra Charge Charm","Elub Power Charm","EMP400 Charm","Empowered Anchor Charm","Extra Spooky Charm","Extra Sweet Cupcake Charm","Extreme Ancient Charm","Extreme Attraction Charm","Extreme Luck Charm","Extreme Polluted Charm","Extreme Power Charm","Festive Ultimate Luck Charm","Festive Ultimate Power Charm","Firecracker Charm","First Ever Charm","Flamebane Charm","Forgotten Charm","Freshness Charm","Gargantua Guarantee Charm","Gemstone Boost Charm","Glowing Gourd Charm","Gnarled Charm","Golden Anchor Charm","Greasy Glob Charm","Growth Charm","Grub Salt Charm","Grub Scent Charm","Grubling Bonanza Charm","Grubling Chow Charm","Haunted Ultimate Luck Charm","Horsepower Charm","Hydro Charm","Luck Charm","Lucky Power Charm","Lucky Rabbit Charm","Magmatic Crystal Charm","Mining Charm","Mobile Charm","Monger Charm","Monkey Fling Charm","Nanny Charm","Nerg Power Charm","Nightshade Farming Charm","Nitropop Charm","Oxygen Burst Charm","Party Charm","Polluted Charm","Power Charm","Prospector's Charm","Rainbow Luck Charm","Ramming Speed Charm","Red Double Sponge Charm","Red Sponge Charm","Regal Charm","Rift Power Charm","Rift Ultimate Luck Charm","Rift Ultimate Power Charm","Rift Vacuum Charm","Roof Rack Charm","Rook Crumble Charm","Rotten Charm","Safeguard Charm","Scholar Charm","Scientist's Charm","Searcher Charm","Shadow Charm","Shattering Charm","Shamrock Charm","Sheriff's Badge Charm","Shielding Charm","Shine Charm","Shortcut Charm","Smart Water Jet Charm","Snakebite Charm","Snowball Charm","Soap Charm","Softserve Charm","Spellbook Charm","Spiked Anchor Charm","Sponge Charm","Spooky Charm","Spore Charm","Stagnant Charm","Sticky Charm","Striker Charm","Super Ancient Charm","Super Attraction Charm","Super Brain Charm","Super Cactus Charm","Super Luck Charm","Super Polluted Charm","Super Power Charm","Super Regal Charm","Super Rift Vacuum Charm","Super Rotten Charm","Super Salt Charm","Super Soap Charm","Super Spore Charm","Super Warpath Archer Charm","Super Warpath Cavalry Charm","Super Warpath Commander's Charm","Super Warpath Mage Charm","Super Warpath Scout Charm","Super Warpath Warrior Charm","Super Wealth Charm","Supply Schedule Charm","Tarnished Charm","Taunting Charm","Treasure Trawling Charm","Ultimate Charm","Ultimate Anchor Charm","Ultimate Ancient Charm","Ultimate Attraction Charm","Ultimate Luck Charm","Ultimate Lucky Power Charm","Ultimate Polluted Charm","Ultimate Power Charm","Ultimate Spore Charm","Uncharged Scholar Charm","Unstable Charm","Valentine Charm","Warpath Archer Charm","Warpath Cavalry Charm","Warpath Commander's Charm","Warpath Mage Charm","Warpath Scout Charm","Warpath Warrior Charm","Water Jet Charm","Wax Charm","Wealth Charm","Wild Growth Charm","Winter Charm","Winter Builder Charm","Winter Hoarder Charm","Winter Miser Charm","Winter Screw Charm","Winter Spring Charm","Winter Wood Charm","Yellow Double Sponge Charm","Yellow Sponge Charm"]
};

// // Best weapon/base/charm/bait pre-determined by user. Edit ur best weapon/base/charm/bait in ascending order. e.g. [best, better, good]
var bestPhysical = ['Chrome MonstroBot', 'Sandstorm MonstroBot', 'Sandtail Sentinel', 'Enraged RhinoBot'];
var bestTactical = ['Chrome Sphynx Wrath', 'Sphynx Wrath', 'Zugzwang\'s Ultimate Move', 'Zugzwang\'s First Move'];
var bestHydro = ['School of Sharks', 'Rune Shark Trap', 'Chrome Phantasmic Oasis Trap', 'Phantasmic Oasis Trap', 'Oasis Water Node Trap', 'Steam Laser Mk. III', 'Steam Laser Mk. II', 'Steam Laser Mk. I', 'Ancient Spear Gun'];
var bestArcane = ['Event Horizon', 'Grand Arcanum Trap', 'Chrome Arcane Capturing Rod', 'Arcane Blast Trap', 'Arcane Capturing Rod Of Nev'];
var bestShadow = ['Temporal Turbine', 'Clockwork Portal Trap', 'Reaper\'s Perch', 'Dreaded Totem Trap', 'Candy Crusher Trap', 'Clockapult of Time', 'Clockapult of Winter Past'];
var bestForgotten = ['Infinite Labyrinth', 'Endless Labyrinth', 'Crystal Mineral Crusher Trap', 'Crystal Crucible', 'Stale Cupcake Golem', 'Tarannosaurus Rex Trap', 'The Forgotten Art of Dance'];
var bestDraconic = ['Dragon Lance', 'Ice Maiden'];
var bestRiftLuck = ['Mysteriously unYielding', 'Multi-Crystal Laser', 'Biomolecular Re-atomizer Trap', 'Crystal Tower'];
var bestRiftPower = ['Mysteriously unYielding', 'Focused Crystal Laser', 'Biomolecular Re-atomizer Trap', 'Crystal Tower'];
var bestRiftBase = ['Fissure Base', 'Rift Base', 'Fracture Base'];
var bestPowerBase = ['Minotaur Base', 'Tidal Base', 'Golden Tournament Base', 'Spellbook Base'];
var bestLuckBase = ['Minotaur Base', 'Fissure Base', 'Rift Base', 'Monkey Jade Base', 'Sheep Jade Base', 'Depth Charge Base', 'Horse Jade Base', 'Snake Jade Base', 'Dragon Jade Base', 'Eerier Base', 'Papyrus Base'];
var bestAttBase = ['Birthday Drag', 'Cheesecake Base'];
var wasteCharm = ['Tarnished', 'Wealth'];

// //Gnawnian Express Station Preference
var supplyDepotTrap = ['Supply Grabber', 'S.L.A.C. II', 'Law Laser Trap', 'The Law Draw', 'S.L.A.C.'];
var raiderRiverTrap = ['Bandit Deflector', 'S.L.A.C. II', 'Law Laser Trap', 'The Law Draw', 'S.L.A.C.'];
var daredevilCanyonTrap = ['Engine Doubler', 'S.L.A.C. II', 'Law Laser Trap', 'The Law Draw', 'S.L.A.C.'];
var coalCharm = ['Magmatic Crystal', 'Black Powder', 'Dusty Coal'];

// // Fiery Warpath Preference
var bestFWWave4Weapon = ['Warden Slayer Trap', 'Chrome MonstroBot', 'Sandstorm MonstroBot', 'Sandtail Sentinel', 'Enraged RhinoBot'];
var bestFWWave4Base = ['Physical Brace Base'].concat(bestLuckBase);
var commanderCharm = ['Super Warpath Commander\'s', 'Warpath Commander\'s'];
var objPopulation = {
	WARRIOR : 0,
	SCOUT : 1,
	ARCHER : 2,
	CAVALRY : 3,
	MAGE : 4,
	ARTILLERY : 5,
	name : ['Warrior', 'Scout', 'Archer', 'Cavalry', 'Mage', 'Artillery']
};

// // Living Garden Preference
var bestLGBase = ['Hothouse Base', 'Living Base'];
bestLGBase = bestLGBase.concat(bestLuckBase);
var bestSalt = ['Super Salt', 'Grub Salt'];
var redSpongeCharm = ['Red Double', 'Red Sponge'];
var yellowSpongeCharm = ['Yellow Double', 'Yellow Sponge'];
var spongeCharm = ['Blue Double', 'Sponge'];
var objLG = {
	isAutoPour : false,
	maxSaltCharged : 25	// Sand Crypts maximum salt for King Grub
};

// // Sunken City Preference
// // DON'T edit this variable if you don't know what are you editing
var objSCZone = {
	ZONE_NOT_DIVE : 0,
	ZONE_DEFAULT : 1,
	ZONE_CORAL : 2,
	ZONE_SCALE : 3,
	ZONE_BARNACLE : 4,
	ZONE_TREASURE : 5,
	ZONE_DANGER : 6,
	ZONE_DANGER_PP : 7,
	ZONE_OXYGEN : 8,
	ZONE_BONUS : 9
};

var bestSCBase = bestLuckBase.slice();
var indexDC = bestSCBase.indexOf('Depth Charge Base');
if (indexDC > -1)
{
	var temp = bestSCBase[0];
	bestSCBase[0] = bestSCBase[indexDC];
	bestSCBase[indexDC] = temp;
}
else
{
	bestSCBase = ['Depth Charge Base'];
	bestSCBase = bestSCBase.concat(bestLuckBase);
}

var objSCTrap = {
	scOxyBait : ['Fishy Fromage', 'Gouda'],
	TT : 'Treasure Trawling',
	EAC : 'Empowered Anchor',
	scAnchorTreasure : ['Golden Anchor', 'Empowered Anchor'],
	scAnchorDanger : ['Spiked Anchor', 'Empowered Anchor'],
	scAnchorUlti : ['Ultimate Anchor', 'Empowered Anchor']
};

// // Spring Egg Hunt
var chargeCharm = ['Eggstra Charge', 'Eggscavator'];
var chargeHigh = 17;
var chargeMedium = 12;

// // Labyrinth
var bestLabyBase = ['Minotaur Base', 'Labyrinth Base'];
bestLabyBase = bestLabyBase.concat(bestLuckBase).concat(bestPowerBase);
var objCodename = {
	FEALTY : "y",
	TECH : "h",
	SCHOLAR : "s",
	TREASURY : "t",
	FARMING : "f",
	PLAIN : "p",
	SUPERIOR : "s",
	EPIC : "e",
	SHORT : "s",
	MEDIUM : "m",
	LONG : "l"
};
var arrHallwayOrder = [
'sp','mp','lp',
'ss','ms','ls',
'se','me','le'];
var objDefaultHallwayPriorities = {
	between0and14 : ['lp'],
	between15and59  : ['sp','ls'],
	between60and100  : ['sp','ss','le'],
	chooseOtherDoors : false,
	typeOtherDoors : "SHORTEST_FEWEST",
	securityDisarm : false,
	lastHunt : 0,
	armOtherBase : 'false'
};
var objLength = {
	SHORT : 0,
	MEDIUM : 1,
	LONG : 2
};

// // Furoma Rift
var objFRBattery = {
	level : [1,2,3,4,5,6,7,8,9,10],
	name : ["one","two","three","four","five","six","seven","eight","nine","ten"],
	capacity : [20,45,75,120,200,310,450,615,790,975],
	cumulative : [20,65,140,260,460,770,1220,1835,2625,3600]
};

// == Advance User Preference Setting (End) ==



// WARNING - Do not modify the code below unless you know how to read and write the script.

// All global variable declaration and default value
var scriptVersion = "1.2 JCres Edition";
var fbPlatform = false;
var hiFivePlatform = false;
var mhPlatform = false;
var mhMobilePlatform = false;
var secureConnection = false;
var lastDateRecorded = new Date();
var hornTime = 900;
var hornTimeDelay = 0;
var checkTimeDelay = 0;
var isKingReward = false;
var lastKingRewardSumTime;
var baitQuantity = -1;
var huntLocation;
var currentLocation;
var today = new Date();
var checkTime;
var hornRetryMax = 10;
var hornRetry = 0;
var nextActiveTime = 900;
var timerInterval = 2;
var checkMouseResult = null;
var mouseList = [];
var discharge = false;
var arming = false;
var best = 0;
var kingsRewardRetry = 0;
var objSCCustom = {};
var keyKR = [];
var separator = "~";

// element in page
var titleElement;
var nextHornTimeElement;
var checkTimeElement;
var kingTimeElement;
var lastKingRewardSumTimeElement;
var optionElement;
var travelElement;
var strHornButton = 'hornbutton';
var strCampButton = 'campbutton';
var isNewUI = false;
var debugKR = false;

// console logging
function saveToSessionStorage(){
	var i;
	var str = "";
	for(i=0;i<arguments.length;i++){
		if(!isNullOrUndefined(arguments[i]) && typeof arguments[i] === 'object'){ // if it is object
			str += JSON.stringify(arguments[i]);
		}
		else
			str += arguments[i];
		if(i != arguments.length-1)
			str += " ";
	}
	var key = "";
	var arrLog = [];
	for(i=0;i<window.sessionStorage.length;i++){
		key = window.sessionStorage.key(i);
		if(key.indexOf("Log_") > -1)
			arrLog.push(key);
	}
	if (arrLog.length > maxSaveLog){
		arrLog = arrLog.sort();
		var count = Math.floor(maxSaveLog / 2);
		for(i=0;i<count;i++)
			removeSessionStorage(arrLog[i]);
	}
	try{
		setSessionStorage("Log_" + Date.now(), str);
	}
	catch (e){
		if(e.name == "QuotaExceededError"){
			for(i=0;i<window.sessionStorage.length;i++){
				key = window.sessionStorage.key(i);
				if(key.indexOf('Log_') > -1)
					removeSessionStorage(key);
			}
			saveToSessionStorage.apply(this,arguments);
		}
	}
	
}
console.plog = function(){
	saveToSessionStorage.apply(this,arguments);
	console.log.apply(console,arguments);
};
console.perror = function(){
	saveToSessionStorage.apply(this,arguments);
	console.error.apply(console,arguments);
};
console.pdebug = function(){
	saveToSessionStorage.apply(this,arguments);
	console.debug.apply(console,arguments);
};

function FinalizePuzzleImageAnswer(answer)
{
	if (answer.length != 5)
    {
	    //Get a new puzzle
	    if (kingsRewardRetry >= kingsRewardRetryMax)
	    {
	        kingsRewardRetry = 0;
			setStorage("KingsRewardRetry", kingsRewardRetry);
			var strTemp = 'Max ' + kingsRewardRetryMax + 'retries. Pls solve it manually ASAP.';
			alert(strTemp);
			displayTimer(strTemp, strTemp, strTemp);
			console.perror(strTemp);
			return;
	    }
	    else
	    {
	        ++kingsRewardRetry;
			setStorage("KingsRewardRetry", kingsRewardRetry);
	        var tagName = document.getElementsByTagName("a");
            for (var i = 0; i < tagName.length; i++)
            {
                if (tagName[i].innerText == "Click here to get a new one!")
                {
					fireEvent(tagName[i], 'click');
                    return;
                }
            }
	    }
    }
    else
    {
		//Submit answer
        var puzzleAns = document.getElementById("puzzle_answer");
		if (!puzzleAns)
		{
			console.pdebug("puzzleAns:", puzzleAns);
			return;
		}
		puzzleAns.value = "";
        puzzleAns.value = answer.toLowerCase();
        var puzzleSubmit = document.getElementById("puzzle_submit");
		if (!puzzleSubmit)
		{
			console.pdebug("puzzleSubmit:", puzzleSubmit);
			return;
		}

		fireEvent(puzzleSubmit, 'click');
		kingsRewardRetry = 0;
		setStorage("KingsRewardRetry", kingsRewardRetry);
		var myFrame = document.getElementById('myFrame');
		if (myFrame)
			document.body.removeChild(myFrame);
		window.setTimeout(function () { CheckKRAnswerCorrectness(); }, 5000);
    }
}

function receiveMessage(event)
{
	if(!debugKR && !isAutoSolve)
		return;

	console.pdebug("Event origin:", event.origin);
	if (event.origin.indexOf("mhcdn") > -1 || event.origin.indexOf("mousehuntgame") > -1 || event.origin.indexOf("dropbox") > -1)
	{
		if (event.data.indexOf("~") > -1)
		{
			var result = "";
			if (saveKRImage){
				result = event.data.substring(0, event.data.indexOf("~"));
				var processedImg = event.data.substring(event.data.indexOf("~") + 1, event.data.length);
				var strKR = "KR" + separator;
				strKR += Date.now() + separator;
				strKR += result + separator;
				strKR += "RETRY" + kingsRewardRetry;
				try{
					setStorage(strKR, processedImg);
				}
				catch (e){
					console.perror('receiveMessage',e);
				}
			}
			FinalizePuzzleImageAnswer(result);
		}
		else if(event.data.indexOf("#")>-1){
			var value = event.data.substring(1, event.data.length);
			setStorage("krCallBack",value);
		}
		else if(event.data.indexOf('Log_')>-1){
			console.plog(event.data.split('_')[1]);
		}
	}
}

window.addEventListener("message", receiveMessage, false);
if (debugKR)
	CallKRSolver();

var getMapPort;
try{
	if(!isNullOrUndefined(chrome.runtime.id)){
		getMapPort = chrome.runtime.connect({name: 'map'});
		getMapPort.onMessage.addListener(function(msg) {
			console.log(msg);
			if(msg.array.length > 0)
				checkCaughtMouse(msg.obj, msg.array);
		});
	}	
}
catch (e){
	// not chrome extension
	getMapPort = undefined;
}

exeScript();

function exeScript() {
	console.pdebug("exeScript() Start");
	browser = browserDetection();
    // check the trap check setting first
	trapCheckTimeDiff = GetTrapCheckTime();

    if (trapCheckTimeDiff == 60 || trapCheckTimeDiff === 0) {
        trapCheckTimeDiff = 00;
    }
    else if (trapCheckTimeDiff < 0 || trapCheckTimeDiff > 60) {
        // invalid value, just disable the trap check
        enableTrapCheck = false;
    }

    if (showTimerInTitle) {
        // check if they are running in iFrame
		var contentElement = undefined;
		var breakFrameDivElement = undefined;
        if (window.location.href.indexOf("apps.facebook.com/mousehunt/") != -1) {
            contentElement = document.getElementById('pagelet_canvas_content');
            if (contentElement) {
                breakFrameDivElement = document.createElement('div');
                breakFrameDivElement.setAttribute('id', 'breakFrameDivElement');
                breakFrameDivElement.innerHTML = "Timer cannot show on title page. You can <a href='http://www.mousehuntgame.com/canvas/'>run MouseHunt without iFrame (Facebook)</a> to enable timer on title page";
                contentElement.parentNode.insertBefore(breakFrameDivElement, contentElement);
            }
            contentElement = undefined;
        }
        else if (window.location.href.indexOf("hi5.com/friend/games/MouseHunt") != -1) {
            contentElement = document.getElementById('apps-canvas-body');
            if (contentElement) {
                breakFrameDivElement = document.createElement('div');
                breakFrameDivElement.setAttribute('id', 'breakFrameDivElement');
                breakFrameDivElement.innerHTML = "Timer cannot show on title page. You can <a href='http://mousehunt.hi5.hitgrab.com/'>run MouseHunt without iFrame (Hi5)</a> to enable timer on title page";
                contentElement.parentNode.insertBefore(breakFrameDivElement, contentElement);
            }
            contentElement = undefined;
        }
    }

    // check user running this script from where
    if (window.location.href.indexOf("mousehuntgame.com/canvas/") != -1) {
        // from facebook
        fbPlatform = true;
    }
    else if (window.location.href.indexOf("mousehuntgame.com") != -1) {
        // need to check if it is running in mobile version
        var version = getCookie("switch_to");
        if (version !== null && version == "mobile") {
            // from mousehunt game mobile version
            mhMobilePlatform = true;
        }
        else {
            // from mousehunt game standard version
            mhPlatform = true;
        }
        version = undefined;
    }
    else if (window.location.href.indexOf("mousehunt.hi5.hitgrab.com") != -1) {
        // from hi5
        hiFivePlatform = true;
    }

    // check if user running in https secure connection
    if (window.location.href.indexOf("https://") != -1) {
        secureConnection = true;
    }
    else {
        secureConnection = false;
    }

    if (fbPlatform) {
		// alert("This script doesnt work under Facebook MH at this moment");
		// return;
        if (window.location.href == "http://www.mousehuntgame.com/canvas/" ||
			window.location.href == "http://www.mousehuntgame.com/canvas/#" ||
			window.location.href == "https://www.mousehuntgame.com/canvas/" ||
			window.location.href == "https://www.mousehuntgame.com/canvas/#" ||
			window.location.href.indexOf("mousehuntgame.com/canvas/index.php") != -1 ||
			window.location.href.indexOf("mousehuntgame.com/canvas/turn.php") != -1 ||
			window.location.href.indexOf("mousehuntgame.com/canvas/?newpuzzle") != -1 ||
			window.location.href.indexOf("mousehuntgame.com/canvas/?") != -1) {
            // page to execute the script!

            // make sure all the preference already loaded
            loadPreferenceSettingFromStorage();

            // this is the page to execute the script
            if (!checkIntroContainer() && retrieveDataFirst()) {
                // embed a place where timer show
                embedTimer(true);

                // embed script to horn button
                embedScript();

                // start script action
                action();
            }
            else {
                // fail to retrieve data, display error msg and reload the page
                document.title = "Fail to retrieve data from page. Reloading in " + timeformat(errorReloadTime);
                window.setTimeout(function () { reloadPage(false); }, errorReloadTime * 1000);
            }
        }
        else {
            // not in huntcamp, just show the title of autobot version
            embedTimer(false);
        }
    }
    else if (mhPlatform) {
        if (window.location.href == "http://www.mousehuntgame.com/" ||
			window.location.href == "http://www.mousehuntgame.com/#" ||
			window.location.href == "http://www.mousehuntgame.com/?switch_to=standard" ||
			window.location.href == "https://www.mousehuntgame.com/" ||
			window.location.href == "https://www.mousehuntgame.com/#" ||
			window.location.href == "https://www.mousehuntgame.com/?switch_to=standard" ||
			window.location.href.indexOf("mousehuntgame.com/turn.php") != -1 ||
			window.location.href.indexOf("mousehuntgame.com/?newpuzzle") != -1 ||
			window.location.href.indexOf("mousehuntgame.com/index.php") != -1) {
            // page to execute the script!

            // make sure all the preference already loaded
            loadPreferenceSettingFromStorage();

            // this is the page to execute the script
            if (!checkIntroContainer() && retrieveDataFirst()) {
                // embed a place where timer show
                embedTimer(true);

                // embed script to horn button
                embedScript();

                // start script action
                action();
            }
            else {
                // fail to retrieve data, display error msg and reload the page
                document.title = "Fail to retrieve data from page. Reloading in " + timeformat(errorReloadTime);
                window.setTimeout(function () { reloadPage(false); }, errorReloadTime * 1000);
            }
        }
        else {
            // not in huntcamp, just show the title of autobot version
            embedTimer(false);
        }
    }
    else if (mhMobilePlatform) {
        // execute at all page of mobile version
		// page to execute the script!

		// make sure all the preference already loaded
		loadPreferenceSettingFromStorage();

		// embed a place where timer show
		embedTimer(false);
    }
    else if (hiFivePlatform) {
        if (window.location.href == "http://mousehunt.hi5.hitgrab.com/#" ||
			window.location.href.indexOf("http://mousehunt.hi5.hitgrab.com/?") != -1 ||
			window.location.href == "http://mousehunt.hi5.hitgrab.com/" ||
			window.location.href.indexOf("http://mousehunt.hi5.hitgrab.com/turn.php") != -1 ||
			window.location.href.indexOf("http://mousehunt.hi5.hitgrab.com/?newpuzzle") != -1 ||
			window.location.href.indexOf("http://mousehunt.hi5.hitgrab.com/index.php") != -1) {
            // page to execute the script!

            // make sure all the preference already loaded
            loadPreferenceSettingFromStorage();

            // this is the page to execute the script
            if (!checkIntroContainer() && retrieveDataFirst()) {
                // embed a place where timer show
                embedTimer(true);

                // embed script to horn button
                embedScript();

                // start script action
                action();
            }
            else {
                // fail to retrieve data, display error msg and reload the page
                document.title = "Fail to retrieve data from page. Reloading in " + timeformat(errorReloadTime);
                window.setTimeout(function () { reloadPage(false); }, errorReloadTime * 1000);
            }
        }
        else {
            // not in huntcamp, just show the title of autobot version
            embedTimer(false);
        }
    }
	console.pdebug("exeScript() End");
	return;
}

function GetTrapCheckTime(){
	try {
		var passiveElement = document.getElementsByClassName('passive');
		if (passiveElement.length > 0) {
			var time = passiveElement[0].textContent;
			time = time.substr(time.indexOf('m -') - 4, 2);
			setStorage("TrapCheckTimeOffset", time);
			return parseInt(time);
		}
		else throw 'passiveElement not found';
	}
	catch (e) {
		console.perror('GetTrapCheckTime',e);
		var tempStorage = getStorage('TrapCheckTimeOffset');
		if (isNullOrUndefined(tempStorage)) {
		    tempStorage = 00;
			setStorage("TrapCheckTimeOffset", tempStorage);
		}
		return parseInt(tempStorage);
	}
}

function checkIntroContainer() {
    var gotIntroContainerDiv = false;

    var introContainerDiv = document.getElementById('introContainer');
    if (introContainerDiv) {
        introContainerDiv = undefined;
        gotIntroContainerDiv = true;
    }
    else {
        gotIntroContainerDiv = false;
    }

    try {
        return (gotIntroContainerDiv);
    }
    finally {
        gotIntroContainerDiv = undefined;
    }
}

function notifyMe(notice, icon, body) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check if the user is okay to get some notification
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(notice, { 'icon': icon, 'body': body});
    }
    // Otherwise, we need to ask the user for permission
    // Note, Chrome does not implement the permission static property
    // So we have to check for NOT 'denied' instead of 'default'
    else if (Notification.permission !== 'denied')
    {
        Notification.requestPermission(function (permission)
        {
            // Whatever the user answers, we make sure we store the information
            if(!('permission' in Notification)) {
            Notification.permission = permission;
            }

            // If the user is okay, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(notice, { 'icon': icon, 'body': body});
            }
        });
    }
}

function ZTalgo() {
    retrieveMouseList();
    var intervalZT = setInterval(
        function () {
            if (mouseList.length > 0) {
                if (checkMouse("Chess Master")) {
                    //arm Uncharged Scholar Charm & Checkmate Cheese
                    //checkThenArm(null, "trinket", "Uncharged Scholar");
                    checkThenArm(null, "bait", "Checkmate");
                }
                else if (checkMouse("King")) {
                    //arm Checkmate Cheese
                    checkThenArm(null, "bait", "Checkmate");
                }
                else if (checkMouse("Queen")) {
                    //arm another charm other than rook charm
                    checkThenArm(null, "trinket", "Super Cactus");         
                }
                else if (checkMouse("Rook")) {
                    //arm rook charm (if available)
                    checkThenArm(null, "trinket", "Rook Crumble");
                }
                else if (checkMouse("Mystic Knight")) {
                    //arm Sphynx Wrath
                    checkThenArm(null, "weapon", "Sphynx Wrath");
                    checkThenArm('best', 'base', bestPowerBase);
                }
                clearInterval(intervalZT);
                intervalZT = null;
                mouseList = [];
                return;
            }
        }, 1000);
    return;
}

function eventLocationCheck(caller) {
    var selAlgo = getStorageToVariableStr("eventLocation", "None");
	console.pdebug('Algorithm Selected:', selAlgo, 'Call From:', caller);
	var temp = "";
    switch (selAlgo)
    {
        case 'Charge Egg 2015':
            checkCharge(12); break;
        case 'Charge Egg 2015(17)':
            checkCharge(17); break;
		case 'Charge Egg 2016 Medium + High':
            checkCharge2016(chargeMedium); break;
        case 'Charge Egg 2016 High':
            checkCharge2016(chargeHigh); break;
		case 'Burroughs Rift(Red)':
			BurroughRift(19, 20); break;
		case 'Burroughs Rift(Green)':
			BurroughRift(6, 18); break;
		case 'Burroughs Rift(Yellow)':
			BurroughRift(1, 5); break;
		case 'Burroughs Rift Custom':
			BRCustom(); break;
		case 'Halloween 2015':
			Halloween2015(); break;
		case 'All LG Area':
			temp = getStorageToVariableStr("LGArea", "false,25");
			temp = temp.split(",");
			objLG.isAutoPour = (temp[0] == "true");
			objLG.maxSaltCharged = parseInt(temp[1]);
			LGGeneral(objLG.isAutoPour);
			break;
		case 'SG/ZT':
			sgOrZT(); break;
		case 'Sunken City':
			SunkenCity(false); break;
		case 'Sunken City Aggro':
			SunkenCity(true); break;
		case 'Sunken City Custom':
			SCCustom(); break;
		case 'Labyrinth':
			labyrinth(); break;
		case 'Zokor':
			zokor(); break;
		case 'Fiery Warpath':
			fw(); break;
		case 'Furoma Rift':
			fRift(); break;
		case 'BC/JOD':
			balackCoveJOD(); break;
		case 'FG/AR':
			forbiddenGroveAR(); break;
        case 'Gnawnian Express(Hoard)':
            gnawnianExpress(false);
            break;
        case 'Gnawnian Express(Load)':
            gnawnianExpress(true);
        case 'Zugzwang Tower':
            ZTower();
            break;
		case 'Test':
			checkThenArm(null, 'base', undefined);
			break;
        default:
            break;
    }
}

function mapHunting(){
	var objDefaultMapHunting = {
		status : false,
		selectedMouse : [],
		logic : 'OR',
		weapon : 'Remain',
		base : 'Remain',
		trinket : 'Remain',
		bait : 'Remain'
	};
	var objMapHunting = JSON.parse(getStorageToVariableStr('MapHunting', JSON.stringify(objDefaultMapHunting)));
	var strViewState = getPageVariable('user.quests.QuestRelicHunter.view_state');
	var bHasMap = (strViewState == 'hasMap' || strViewState == 'hasReward');
	if(!objMapHunting.status || !bHasMap || objMapHunting.selectedMouse.length === 0)
		return;

	checkCaughtMouse(objMapHunting);
}

function checkCaughtMouse(obj, arrUpdatedUncaught){
	var arrUncaughtMouse = [];
	if(!(Array.isArray(arrUpdatedUncaught)))
		arrUpdatedUncaught = [];

	var bHasReward = (getPageVariable('user.quests.QuestRelicHunter.view_state') == 'hasReward');
	if(!bHasReward && arrUpdatedUncaught.length === 0){
		var nRemaining = -1;
		var classTreasureMap = document.getElementsByClassName('mousehuntHud-userStat treasureMap')[0];
		if(classTreasureMap.children[2].textContent.toLowerCase().indexOf('remaining') > -1)
			nRemaining = parseInt(classTreasureMap.children[2].textContent);
		
		if(Number.isNaN(nRemaining) || nRemaining == -1)
			return;

		var temp = getStorageToVariableStr('Last Record Uncaught', null);
		if(!isNullOrUndefined(temp))
			arrUncaughtMouse = temp.split(",");	
		
		if(arrUncaughtMouse.length != nRemaining){
			// get updated uncaught mouse list
			arrUncaughtMouse = [];
			var objData = {
				sn : 'Hitgrab',
				hg_is_ajax : 1,
				action : 'info',
				uh : getPageVariable('user.unique_hash')
			};
			if(isNullOrUndefined(getMapPort)){
				// direct call jquery
				ajaxPost(window.location.origin + '/managers/ajax/users/relichunter.php', objData, function (data){
					console.log(data.treasure_map);
					if(!isNullOrUndefined(data.treasure_map.groups)){
						var arrUncaught = [];
						for(var i=0;i<data.treasure_map.groups.length;i++){
							if(data.treasure_map.groups[i].is_uncaught === true){
								for(var j=0;j<data.treasure_map.groups[i].mice.length;j++){
									arrUncaught.push(data.treasure_map.groups[i].mice[j].name);
								}
							}
						}
						if(arrUncaught.length > 0)
							checkCaughtMouse(obj, arrUncaught);
					}
				}, function (error){
					console.error('ajax:',error);
				});
			}
			else{
				getMapPort.postMessage({
					request: "getUncaught",
					data: objData,
					url: window.location.origin + '/managers/ajax/users/relichunter.php',
					objMapHunting : obj
				});
			}
			return;
		}
	}
	else{
		if(bHasReward)
			setStorage('Last Record Uncaught', '');
		else
			setStorage('Last Record Uncaught', arrUpdatedUncaught.join(","));
		arrUncaughtMouse = arrUpdatedUncaught.slice();
	}
	
	console.pdebug('Uncaught:', arrUncaughtMouse);
	var i;
	var bChangeTrap = false;
	var arrIndex = [];
	for(i=0;i<obj.selectedMouse.length;i++){
		arrIndex.push(arrUncaughtMouse.indexOf(obj.selectedMouse[i]));
	}
	if(obj.logic == 'AND'){
		bChangeTrap = (countArrayElement(-1, arrIndex) == arrIndex.length || bHasReward);
	}
	else{
		bChangeTrap = (countArrayElement(-1, arrIndex) > 0 || bHasReward);
	}

	if(bChangeTrap){
		for(i=arrIndex.length-1;i>=0;i--){
			if(arrIndex[i] == -1)
				obj.selectedMouse.splice(i,1);
		}
		setStorage('MapHunting', JSON.stringify(obj));
		for (var prop in obj) {
			if(obj.hasOwnProperty(prop) && 
				(prop == 'weapon' || prop == 'base' || prop == 'trinket' || prop == 'bait')) {
				if(obj[prop] != 'Remain'){
					if(obj[prop] == 'None')
						disarmTrap(prop);
					else
						checkThenArm(null, prop, obj[prop]);
				}
			}
		}
	}
}

function GetCurrentLocation(){
	var loc = getPageVariable('user.location');
    console.pdebug('Current Location:', loc);
	return loc;
}

function Halloween2015()
{
	if (GetCurrentLocation().indexOf("Haunted Terrortories") > -1)
	{
		var areaName = document.getElementsByClassName('halloweenHud-areaDetails-name')[0].innerHTML;
		var warning = document.getElementsByClassName('halloweenHud-areaDetails-warning active').length;
		var isWarning = (warning > 0);
		console.pdebug('Current Area Name:', areaName, 'Warning:', isWarning);
		if (isWarning)
		{
			var trickContainer = document.getElementsByClassName('halloweenHud-bait trick_cheese clear-block')[0];
			var treatContainer = document.getElementsByClassName('halloweenHud-bait treat_cheese clear-block')[0];
			if (trickContainer.children[2].getAttribute('class') == 'armNow active')
			{
				console.pdebug('Currently armed: Trick cheese, Going to arm Treat cheese');
				fireEvent(treatContainer.children[2], 'click');
			}
			else
			{
				console.pdebug('Currently armed: Treat cheese, Going to arm Trick cheese');
				fireEvent(trickContainer.children[2], 'click');
			}
		}
	}
}

function BurroughRift(minMist, maxMist, nToggle)
{
	 var currentLocation = getPageVariable("user.location");
    console.debug(currentLocation);
    if (currentLocation.indexOf("Burroughs Rift") > -1) {
        //Tier 0: 0 Mist Canisters
        //Tier 1/Yellow: 1-5 Mist Canisters
        //Tier 2/Green: 6-18 Mist Canisters
        //Tier 3/Red: 19-20 Mist Canisters

        var currentMistQuantity = parseInt(document.getElementsByClassName('mistQuantity')[0].textContent);
        var isMisting = getPageVariable('user.quests.QuestRiftBurroughs.is_misting');
        var mistButton = document.getElementsByClassName('mistButton')[0];
        console.debug('Current Mist Quantity: ' + currentMistQuantity);
        console.debug('Is Misting: ' + isMisting);
        console.debug('Min Mist: ' + minMist + " Max Mist: " + maxMist);
        if (currentMistQuantity >= maxMist && isMisting == 'true') {
            console.debug('Stop mist...');
            fireEvent(mistButton, 'click');
        } else if (currentMistQuantity <= minMist && isMisting == 'false') {
            console.debug('Start mist...');
            fireEvent(mistButton, 'click');
        }
        return;
    }
}

function BRCustom(){
	if (GetCurrentLocation().indexOf('Burroughs Rift') < 0)
		return;

	var objBR = getStorageToVariableStr('BRCustom', "");
	if(objBR === "")
		return;

	objBR = JSON.parse(objBR);
	var mistQuantity = 0;
	if(objBR.hunt == 'Red')
		mistQuantity = BurroughRift(19, 20, objBR.toggle);
	else if(objBR.hunt == 'Green')
		mistQuantity = BurroughRift(6, 18);
	else if(objBR.hunt == 'Yellow')
		mistQuantity = BurroughRift(1, 5);
	else
		mistQuantity = BurroughRift(0, 0);

	var currentTier = '';
	if(mistQuantity >= 19)
		currentTier = 'Red';
	else if(mistQuantity >= 6)
		currentTier = 'Green';
	else if(mistQuantity >= 1)
		currentTier = 'Yellow';
	else
		currentTier = 'None';

	if(currentTier != objBR.hunt)
		return;

	var nIndex = objBR.name.indexOf(currentTier);
	checkThenArm(null, 'weapon', objBR.weapon[nIndex]);
	checkThenArm(null, 'base', objBR.base[nIndex]);
	checkThenArm(null, 'bait', objBR.bait[nIndex]);
	if(objBR.trinket[nIndex] == 'NoAbove'){
		var charmArmed = getPageVariable("user.trinket_name");
		var optionTrinket = document.getElementById('selectBRTrapTrinket').children;
		for(var i=0;i<optionTrinket.length;i++){
			if (charmArmed.indexOf(optionTrinket[i].value) === 0){
				disarmTrap('trinket');
				break;
			}
		}
	}
	else if(objBR.trinket[nIndex] == 'None'){
		disarmTrap('trinket');
	}
	else
		checkThenArm(null, 'trinket', objBR.trinket[nIndex]);
}

function LGGeneral(isAutoPour) {
    var loc = GetCurrentLocation();
	switch (loc)
    {
        case 'Living Garden':
            livingGarden(isAutoPour); break;
        case 'Lost City':
            lostCity(); break;
        case 'Sand Dunes':
            sandDunes(); break;
        case 'Twisted Garden':
            twistedGarden(isAutoPour); break;
        case 'Cursed City':
            cursedCity(); break;
        case 'Sand Crypts':
            sandCrypts(); break;
        default:
            return;
    }
	DisarmLGSpecialCharm(loc);
}

function sgOrZT(){
	var strLocation = GetCurrentLocation();
	var objSGZTDefault = {
		useZUMIn: 'None'
	};
	var objSGZT = JSON.parse(getStorageToVariableStr('SGZT', JSON.stringify(objSGZTDefault)));
	if(strLocation.indexOf("Seasonal Garden") > -1)
		seasonalGarden(objSGZT.useZUMIn);
	else if(strLocation.indexOf("Zugzwang's Tower") > -1)
		zugzwangTower(objSGZT.useZUMIn);
}

function seasonalGarden(useZUMIn){
	var cheeseArmed = getPageVariable('user.bait_name');
	if(cheeseArmed.indexOf('Checkmate') > -1)
		checkThenArm(null, 'bait', 'Gouda');
	
	var objSG = {
		season : ['Spring', 'Summer', 'Fall', 'Winter'],
		trap : [bestPhysical.slice(), bestTactical.slice(), "Terrifying Spider Trap", bestHydro.slice()]
	};
	var nTimeStamp = Date.parse(new Date())/1000;
	var nFirstSeasonTimeStamp = 1283328000;
	var nSeasonLength = 288000; // 80hr
	var nSeason = Math.floor((nTimeStamp - nFirstSeasonTimeStamp)/nSeasonLength) % objSG.season.length;
	var nSeasonNext = nSeasonLength - ((nTimeStamp - nFirstSeasonTimeStamp) % nSeasonLength);
	console.plog('Current Season:', objSG.season[nSeason], 'Next Season In:', timeformat(nSeasonNext));
	if(nSeasonNext <= nextActiveTime){ // total seconds left to next season less than next active time
		nSeason++;
		if(nSeason >= objSG.season.length)
			nSeason = 0;
	}

	if(useZUMIn == 'ALL' || useZUMIn == objSG.season[nSeason].toUpperCase())
		objSG.trap[nSeason].unshift('Zugzwang\'s Ultimate Move');
	checkThenArm(null, 'weapon', objSG.trap[nSeason]);
}

function zugzwangTower(useZUMIn){
	
}

function ZTower() {
    var location = getPageVariable('user.location');
    console.debug(location);
    if (location.indexOf('Zugzwang\'s Tower') == -1 && location.indexOf('Seasonal Garden') == -1) {
        console.debug('Not in Zugzwang\'s Tower or Seasonal Garden.');
        return;
    }

    if (location.indexOf('Seasonal Garden') > -1) {
        checkThenArm(null, 'bait', 'Gouda');
        checkThenArm(null, 'trinket', 'Amplifier');
        checkThenArm('best', 'base', ['Seasonal', 'Fissure', 'Golden Tournament']);

        var season = nobCalculateOfflineTimers('seasonal');
        console.debug('It is ' + season + ' in Seasonal Gardens right now.');
        switch (season) {
            case 'Spring':
                checkThenArm('best', 'weapon', bestPhysical);
                checkThenArm('best', 'weapon', bestPhysicalBase);
                break;
            case 'Summer':
                checkThenArm('best', 'weapon', bestTactical);
                checkThenArm('best', 'weapon', bestPowerBase);
                break;
            case 'Autumn':
                checkThenArm('best', 'weapon', bestShadow);
                checkThenArm('best', 'weapon', bestPowerBase);
                break;
            case 'Winter':
                checkThenArm('best', 'weapon', bestHydro);
                checkThenArm('best', 'weapon', bestPowerBase);
                break;
            default:
                break;
        }

        season = null;
        return;
    } else if (location.indexOf('Zugzwang\'s Tower') > -1) {
        var ztTriesLeft = 5;
        retrieveMouseList();
        var intervalZT = setInterval(
            function () {
                if (mouseList.length > 0) {
                    if (checkMouse("Chess Master")) {
                        //arm Uncharged Scholar Charm & Checkmate Cheese
                        checkThenArm(null, "trinket", "Uncharged Scholar");
                        checkThenArm(null, "bait", "Checkmate");
                    } else if (checkMouse("King")) {
                        //arm Checkmate Cheese
                        checkThenArm(null, "bait", "Checkmate");
                    } else if (checkMouse("Queen")) {
                        //arm another charm other than rook charm
                        checkThenArm(null, "trinket", "Super Power");
                        disarmTrap('trinket');
                    } else if (checkMouse("Rook")) {
                        //arm rook charm (if available)
                        checkThenArm(null, "trinket", "Rook Crumble");
                    } else if (checkMouse("Knight")) {
                        //arm Sphynx Wrath
                        checkThenArm(null, "weapon", "Sphynx Wrath");
                        checkThenArm('best', 'base', bestPowerBase);
                    }
                    clearInterval(intervalZT);
                    intervalZT = null;
                    mouseList = [];
                    return;
                } else {
                    if (debug) console.log("Count down to ZT bot give up: " + ztTriesLeft);
                    if (ztTriesLeft == 0) {
                        clearInterval(intervalZT);
                        intervalZT = null;
                        mouseList = [];
                        ztTriesLeft = null;
                    }
                    return;
                }
            }, 3000);
        return;
    }
}


function balackCoveJOD(){
	var curLoc = GetCurrentLocation();
	if(curLoc.indexOf('Jungle') > -1){
		checkThenArm(null, 'bait', 'Gouda');
		checkThenArm('best', 'weapon', bestShadow);
	}
	else if(curLoc.indexOf('Balack') > -1){
		var i = 0;
		var objBC = {
			arrTide : ['Low Rising', 'Mid Rising', 'High Rising', 'High Ebbing', 'Mid Ebbing', 'Low Ebbing'],
			arrLength : [24, 3, 1, 1, 3, 24],
			arrAll : []
		};
		var nTimeStamp = Math.floor(Date.now()/1000);
		var nFirstTideTimeStamp = 1294708860;
		var nTideLength = 1200; // 20min
		for(i=0;i<objBC.arrTide.length;i++){
			objBC.arrAll = objBC.arrAll.concat(new Array(objBC.arrLength[i]).fill(objBC.arrTide[i]));
		}
		var nTideTotalLength = sumData(objBC.arrLength);
		var nDiff = nTimeStamp - nFirstTideTimeStamp;
		var nIndexCurrentTide = Math.floor(nDiff/nTideLength) % nTideTotalLength;
		var tideNameCurrent = objBC.arrAll[nIndexCurrentTide];
		var tideNameNext;
		if(tideNameCurrent.indexOf('Low') > -1)
			tideNameNext = 'Mid Rising';
		else if(tideNameCurrent.indexOf('High') > -1)
			tideNameNext = 'Mid Ebbing';
		else if(tideNameCurrent == 'Mid Rising')
			tideNameNext = 'High Rising';
		else if(tideNameCurrent == 'Mid Ebbing')
			tideNameNext = 'Low Ebbing';
		
		var nTideDist = objBC.arrAll.indexOf(tideNameNext) + nTideTotalLength - nIndexCurrentTide;
		nTideDist = nTideDist % nTideTotalLength;
		var nNextTideTime = nTideDist*nTideLength - nDiff%nTideLength;
		console.plog('Current Tide:', objBC.arrAll[nIndexCurrentTide], 'Next Tide:', tideNameNext, 'In', timeformat(nNextTideTime));
		if(nNextTideTime <= nextActiveTime && tideNameNext.indexOf('High') > -1){ // total seconds left to next high tide less than next active time
			checkThenArm(null, 'bait', 'Vanilla Stilton');
		}
	}
}

function forbiddenGroveAR(){
	var curLoc = GetCurrentLocation();
	if(curLoc.indexOf('Acolyte Realm') > -1){
		checkThenArm('best', 'weapon', bestForgotten);
		checkThenArm(null, 'bait', 'Runic Cheese');
	}
}

function SunkenCity(isAggro) {
	if (GetCurrentLocation().indexOf("Sunken City") < 0)
		return;
	
	var zone = document.getElementsByClassName('zoneName')[0].innerText;
	console.pdebug('Current Zone:', zone);
	var currentZone = GetSunkenCityZone(zone);
	checkThenArm('best', 'weapon', bestHydro);
	if (currentZone == objSCZone.ZONE_NOT_DIVE)
	{
		checkThenArm('best', 'base', bestLuckBase);
		checkThenArm(null, 'trinket', 'Oxygen Burst');
		checkThenArm('best', 'bait', objSCTrap.scOxyBait);
		return;
	}
	
	checkThenArm('best', 'base', bestSCBase);
	var distance = parseInt(getPageVariable('user.quests.QuestSunkenCity.distance'));
	console.pdebug('Dive Distance(m):', distance);
	var charmArmed = getPageVariable("user.trinket_name");
	var charmElement = document.getElementsByClassName('charm');
	var isEACArmed = (charmArmed.indexOf('Empowered Anchor') > -1);
	var isWJCArmed = (charmArmed.indexOf('Water Jet') > -1);
	if (currentZone == objSCZone.ZONE_OXYGEN || currentZone == objSCZone.ZONE_TREASURE || currentZone == objSCZone.ZONE_BONUS)
	{
		if (isAggro && (currentZone == objSCZone.ZONE_TREASURE))
			checkThenArm('best', 'trinket', objSCTrap.scAnchorTreasure);
		else
		{
			// arm Empowered Anchor Charm
			if (!isEACArmed)
			{
				if (parseInt(charmElement[0].innerText) > 0)
					fireEvent(charmElement[0], 'click');
			}
		}
		
		checkThenArm(null, 'bait', 'SUPER');
	}
	else if (currentZone == objSCZone.ZONE_DANGER_PP)
	{
		if (!isAggro)
		{
			// arm Empowered Anchor Charm
			if (!isEACArmed && !isAggro)
			{
				if (parseInt(charmElement[0].innerText) > 0)
					fireEvent(charmElement[0], 'click');
			}
		}
		else
			checkThenArm('best', 'trinket', objSCTrap.scAnchorDanger);
		checkThenArm(null, 'bait', 'Gouda');
	}
	else if ((currentZone == objSCZone.ZONE_DEFAULT) && isAggro)
	{
		var depth = parseInt(getPageVariable('user.quests.QuestSunkenCity.zones[1].length'));
		if (depth >= 500)
		{
			var nextZoneName = getPageVariable('user.quests.QuestSunkenCity.zones[2].name');
			var nextZoneLeft = parseInt(getPageVariable('user.quests.QuestSunkenCity.zones[2].left'));
			var nextZone = GetSunkenCityZone(nextZoneName);
			var distanceToNextZone = parseInt((nextZoneLeft - 80) / 0.6);
			console.pdebug('Distance to next zone(m):', distanceToNextZone);
			if (distanceToNextZone >= 480 || (distanceToNextZone >= 230 && nextZone == objSCZone.ZONE_DEFAULT))
			{
				// arm Water Jet Charm
				checkThenArm('best', 'trinket', ['Smart Water Jet', 'Water Jet']);
			}
			else
			{
				DisarmSCSpecialCharm(charmArmed);
			}
		}
		else
			DisarmSCSpecialCharm(charmArmed);
		
		checkThenArm(null, 'bait', 'Gouda');
	}
	else
	{
		DisarmSCSpecialCharm(charmArmed);
		checkThenArm(null, 'bait', 'Gouda');
	}
}

function SCCustom() {
	if (GetCurrentLocation().indexOf("Sunken City") < 0)
		return;
	
	var zone = document.getElementsByClassName('zoneName')[0].innerText;
	var zoneID = GetSunkenCityZone(zone);
	checkThenArm('best', 'weapon', bestHydro);
	if (zoneID == objSCZone.ZONE_NOT_DIVE){
		checkThenArm('best', 'base', bestLuckBase);
		checkThenArm(null, 'trinket', 'Oxygen Burst');
		checkThenArm('best', 'bait', objSCTrap.scOxyBait);
		return;
	}

	var objSCCustomDefault = {
		zone : ['ZONE_NOT_DIVE','ZONE_DEFAULT','ZONE_CORAL','ZONE_SCALE','ZONE_BARNACLE','ZONE_TREASURE','ZONE_DANGER','ZONE_DANGER_PP','ZONE_OXYGEN','ZONE_BONUS'],
		zoneID : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
		isHunt : new Array(9).fill(true),
		bait : new Array(9).fill('Gouda'),
		trinket : new Array(9).fill('None'),
		useSmartJet : false
	};
	objSCCustom = JSON.parse(getStorageToVariableStr('SCCustom', JSON.stringify(objSCCustomDefault)));
	console.pdebug(objSCCustom);
	var distance = parseInt(getPageVariable('user.quests.QuestSunkenCity.distance'));
	console.plog('Current Zone:', zone, 'at meter', distance);
	checkThenArm('best', 'base', bestSCBase);
	var canJet = false;
	if (!objSCCustom[zoneID].isHunt){
		var nextZoneName = [];
		var nextZoneLeft = [];
		var nextZoneID = [];
		var distanceToNextZone = [];
		var isNextZoneInHuntZone = [];
		var i;
		for (i = 0; i < 2; i++){
			nextZoneName[i] = getPageVariable('user.quests.QuestSunkenCity.zones[' + (i+2) + '].name');
			nextZoneLeft[i] = parseInt(getPageVariable('user.quests.QuestSunkenCity.zones[' + (i+2) + '].left'));
			nextZoneID[i] = GetSunkenCityZone(nextZoneName[i]);
			distanceToNextZone[i] = parseInt((nextZoneLeft[i] - 80) / 0.6);
			isNextZoneInHuntZone[i] = (objSCCustom[nextZoneID[i]].isHunt);
			console.plog('Next Zone:', nextZoneName[i], 'in meter', distanceToNextZone[i], 'Is In Hunt Zone:', isNextZoneInHuntZone[i]);
		}
		
		// jet through
		var charmElement = document.getElementsByClassName('charm');
		var charmArmed = getPageVariable("user.trinket_name");
		var isWJCArmed = (charmArmed.indexOf('Water Jet') > -1);
		if (distanceToNextZone[0] >= 480 || (distanceToNextZone[1] >= 480 && (!isNextZoneInHuntZone[0])) || (!(isNextZoneInHuntZone[0]||isNextZoneInHuntZone[1]))) {
			// arm Water Jet Charm
			var bSmartJet = false;
			var bNormalJet = (parseInt(charmElement[1].innerText) > 0);
			if(objSCCustom.useSmartJet){
				getTrapList('trinket');
				for(i=0;i<objTrapList.trinket.length;i++){
					if(!bSmartJet)
						bSmartJet = (objTrapList.trinket[i].indexOf('Smart Water Jet') === 0);
					if(!bNormalJet)
						bSmartJet = (objTrapList.trinket[i].indexOf('Water Jet') === 0);
				}
				canJet = (bSmartJet || bNormalJet);
				checkThenArm('best', 'trinket', ['Smart Water Jet', 'Water Jet']);
			}
			else{
				canJet = bNormalJet;
				if (!isWJCArmed) {
					if (canJet)
						fireEvent(charmElement[1], 'click');
				}
			}
			checkThenArm(null, 'bait', 'Gouda');
		}
	}
	
	if (objSCCustom[zoneID].isHunt || !canJet){
		// hunt here
		var bestOrNull = Array.isArray(objSCCustom[zoneID].bait) ? 'best' : null;
		checkThenArm(bestOrNull, 'bait', objSCCustom[zoneID].bait);
		if (objSCCustom[zoneID].trinket == "NoSC")
			DisarmSCSpecialCharm();
		else if (objSCCustom[zoneID].trinket == "None")
			disarmTrap('trinket');
		else {
			if(objSCTrap.hasOwnProperty(objSCCustom[zoneID].trinket)){
				bestOrNull = Array.isArray(objSCTrap[objSCCustom[zoneID].trinket]) ? 'best' : null;
				checkThenArm(bestOrNull, 'trinket', objSCTrap[objSCCustom[zoneID].trinket]);
			}
		}
	}
}

function DisarmSCSpecialCharm(charmArmedName)
{
	var specialCharms = ['Golden Anchor', 'Spiked Anchor', 'Ultimate Anchor', 'Oxygen Burst', 'Empowered Anchor', 'Water Jet'];	
	for (var i = 0; i < specialCharms.length; i++)
	{
		if (charmArmedName.indexOf(specialCharms[i]) > -1)
		{
			disarmTrap('trinket');
			break;
		}
	}
}

function GetSunkenCityZone(zoneName)
{
	var returnZone = 0;
	switch (zoneName)
	{
		case 'Sand Dollar Sea Bar':
		case 'Pearl Patch':
		case 'Sunken Treasure':
			returnZone = objSCZone.ZONE_TREASURE;
			break;
		case 'Feeding Grounds':
		case 'Carnivore Cove':
			returnZone = objSCZone.ZONE_DANGER;
			break;
		case 'Monster Trench':
		case 'Lair of the Ancients':
			returnZone = objSCZone.ZONE_DANGER_PP;
			break;
		case 'Deep Oxygen Stream':
		case 'Oxygen Stream':
			returnZone = objSCZone.ZONE_OXYGEN;
			break;
		case 'Magma Flow':
			returnZone = objSCZone.ZONE_BONUS;
			break;
		case 'Coral Reef':
		case 'Coral Garden':
		case 'Coral Castle':
			returnZone = objSCZone.ZONE_CORAL;
			break;
		case 'School of Mice':
		case 'Mermouse Den':
		case 'Lost Ruins':
			returnZone = objSCZone.ZONE_SCALE;
			break;
		case 'Rocky Outcrop':
		case 'Shipwreck':
		case 'Haunted Shipwreck':
			returnZone = objSCZone.ZONE_BARNACLE;
			break;
		case 'Shallow Shoals':
		case 'Sea Floor':
		case 'Murky Depths':
			returnZone = objSCZone.ZONE_DEFAULT;
			break;
		default:
			returnZone = objSCZone.ZONE_NOT_DIVE;
			break;
	}
	return returnZone;
}

function labyrinth() {
	if (GetCurrentLocation().indexOf("Labyrinth") < 0)
		return;

	checkThenArm('best', 'weapon', bestForgotten);
	var labyStatus = getPageVariable("user.quests.QuestLabyrinth.status");
	var isAtEntrance = (labyStatus=="intersection entrance");
	var isAtHallway = (labyStatus=="hallway");
	var isAtIntersection = (labyStatus=="intersection");
	var isAtExit = (labyStatus=="exit");
	var lastHunt = document.getElementsByClassName('labyrinthHUD-hallway-tile locked').length + 1;
	var totalClue = parseInt(document.getElementsByClassName('labyrinthHUD-clueBar-totalClues')[0].innerText);
	console.pdebug("Entrance:", isAtEntrance, "Intersection:", isAtIntersection, "Exit:", isAtExit);
	var districtFocus = getStorageToVariableStr('Labyrinth_DistrictFocus', 'None');
	console.pdebug('District to focus:', districtFocus);
	var objHallwayPriorities = JSON.parse(getStorageToVariableStr('Labyrinth_HallwayPriorities', JSON.stringify(objDefaultHallwayPriorities)));
	if(objHallwayPriorities.armOtherBase != 'false'){
		var charmArmed = getPageVariable('user.trinket_name');
		if(charmArmed.indexOf('Compass Magnet') === 0){
			checkThenArm(null, 'base', objHallwayPriorities.armOtherBase);
		}
		else
			checkThenArm('best', 'base', bestLabyBase);
	}
	else
		checkThenArm('best', 'base', bestLabyBase);
	
	if(isAtHallway){
		if(objHallwayPriorities.securityDisarm){
			var strCurHallwayTier = document.getElementsByClassName('labyrinthHUD-hallwayName')[0].textContent.split(' ')[1].toUpperCase();
			var maxCluePerHunt = 0;
			if(strCurHallwayTier == 'PLAIN')
				maxCluePerHunt = 1;
			else if(strCurHallwayTier == 'SUPERIOR')
				maxCluePerHunt = 2;
			else
				maxCluePerHunt = 3;
			var classLantern = document.getElementsByClassName('labyrinthHUD-toggleLantern mousehuntTooltipParent');
			var bLanternActive = true;
			if(classLantern.length < 1)
				bLanternActive = (getPageVariable('user.quests.QuestLabyrinth.lantern_status') == 'active');
			else
				bLanternActive = (classLantern[0].getAttribute('class').indexOf('inactive') < 0);
			if(bLanternActive)
				maxCluePerHunt++;
			console.plog('Hallway Last Hunt :', lastHunt, 'Total Clues:', totalClue, 'Max Clue Per Hunt:', maxCluePerHunt);
			if(lastHunt <= objHallwayPriorities.lastHunt && totalClue >= (100-maxCluePerHunt*lastHunt)) // each hunt will loot max 3 clues
				disarmTrap('bait');
		}
		return;
	}

	if(isAtEntrance || isAtExit || districtFocus.indexOf('None') > -1){
		checkThenArm(null, 'bait', 'Gouda');
		disarmTrap('trinket');
		return;
	}

	var doorsIntersect = document.getElementsByClassName('labyrinthHUD-door');
	var doorsExit = document.getElementsByClassName('labyrinthHUD-exit');
	var objDoors = {
		name : [],
		length : [],
		tier : [],
		clue : [],
		code : [],
		priorities : [],
		debug : []
	};
	var temp = "";
	for (var i=0;i<doorsIntersect.length;i++){
		if (doorsIntersect[i].getAttribute('class').indexOf('mystery') > -1){
			isAtIntersection = false;
			return;
		}
		
		if (doorsIntersect[i].getAttribute('class').indexOf('broken') > -1 || doorsIntersect[i].children.length<2){
			objDoors.length.push("LONG");
			objDoors.tier.push("PLAIN");
			objDoors.name.push("BROKEN");
			objDoors.debug.push("LONG PLAIN BROKEN");
			objDoors.code.push("");
			objDoors.clue.push(Number.MAX_SAFE_INTEGER);
			objDoors.priorities.push(Number.MAX_SAFE_INTEGER);
		}
		else {
			temp = doorsIntersect[i].children[1].innerText.toUpperCase();
			objDoors.debug.push(temp);
			temp = temp.split(" ");
			objDoors.length.push(temp[0]);
			objDoors.tier.push(temp[1]);
			objDoors.name.push(temp[2]);
			objDoors.code.push(objCodename[temp[0]] + objCodename[temp[1]]);
			objDoors.clue.push(Number.MAX_SAFE_INTEGER);
			objDoors.priorities.push(Number.MAX_SAFE_INTEGER);
		}
		isAtIntersection = true;
	}

	console.plog(objDoors.debug.join(","));
	if(parseInt(getPageVariable("user.bait_quantity"))<3)
		checkThenArm(null, 'bait', 'Gouda');

	var userVariable = undefined;
	temp = "";
	var range = "";
	var index = [];
	try	{
		userVariable = JSON.parse(getPageVariable('JSON.stringify(user.quests.QuestLabyrinth)'));
		for (var i=0;i<userVariable.all_clues.length;i++){
			temp = userVariable.all_clues[i].name.toUpperCase();
			if (temp.indexOf("DEAD") > -1)
				continue;
			index = getAllIndices(objDoors.name, temp);
			for(var j=0;j<index.length;j++){
				objDoors.clue[index[j]] = userVariable.all_clues[i].quantity;
			}
		}

		index = objDoors.name.indexOf(districtFocus);
		if(index<0){
			if(objHallwayPriorities.chooseOtherDoors){
				console.pdebug(objDoors);
				temp = min(objDoors.clue);
				var objFewestClue = {
					num : temp,
					indices : getAllIndices(objDoors.clue, temp),
					count : countArrayElement(temp, objDoors.clue)
				};
				var objShortestLength = {
					type : "SHORT",
					indices : [],
					count : 0
				};
				if(objDoors.length.indexOf("SHORT") > -1)
					objShortestLength.type = "SHORT";
				else if(objDoors.length.indexOf("MEDIUM") > -1)
					objShortestLength.type = "MEDIUM";
				else if(objDoors.length.indexOf("LONG") > -1)
					objShortestLength.type = "LONG";
				objShortestLength.indices = getAllIndices(objDoors.length, objShortestLength.type);
				objShortestLength.count = objShortestLength.indices.length;
				console.pdebug(JSON.stringify(objShortestLength));
				console.pdebug(JSON.stringify(objFewestClue));
				if(objShortestLength.indices.length < 1 || objFewestClue.indices.length < 1){
					checkThenArm(null, 'bait', 'Gouda');
					disarmTrap('trinket');
					return;
				}

				var arrTemp = [];
				var nMin = Number.MAX_SAFE_INTEGER;
				var nMinIndex = -1;
				if(objHallwayPriorities.typeOtherDoors.indexOf("SHORTEST") === 0){ // SHORTEST_ONLY / SHORTEST_FEWEST
					if(objShortestLength.count > 1 && objHallwayPriorities.typeOtherDoors.indexOf("FEWEST") > -1){
						for(var i=0;i<objShortestLength.indices.length;i++){
							if(objDoors.clue[objShortestLength.indices[i]] < nMin){
								nMin = objDoors.clue[objShortestLength.indices[i]];
								nMinIndex = objShortestLength.indices[i];
							}
						}
						if(nMinIndex > -1)
							arrTemp.push(nMinIndex);
					}
					else
						arrTemp = objShortestLength.indices;
				}
				else if(objHallwayPriorities.typeOtherDoors.indexOf("FEWEST") === 0){ // FEWEST_ONLY / FEWEST_SHORTEST
					if(objFewestClue.count > 1 && objHallwayPriorities.typeOtherDoors.indexOf("SHORTEST") > -1){
						var strTemp = "";
						for(var i=0;i<objFewestClue.indices.length;i++){
							strTemp = objDoors.length[objFewestClue.indices[i]].toUpperCase();
							if(objLength.hasOwnProperty(strTemp) && objLength[strTemp] < nMin){
								nMin = objLength[strTemp];
								nMinIndex = objFewestClue.indices[i];
							}
						}
						if(nMinIndex > -1)
							arrTemp.push(nMinIndex);
					}
					else
						arrTemp = objFewestClue.indices;
				}
				for(var i=0;i<arrTemp.length;i++){
					if(objDoors.name[arrTemp[i]].indexOf("BROKEN") < 0){
						fireEvent(doorsIntersect[arrTemp[i]], 'click');
						window.setTimeout(function () { fireEvent(document.getElementsByClassName('mousehuntActionButton confirm')[0], 'click'); }, 1500);
						break;
					}
				}
			}
			else{
				checkThenArm(null, 'bait', 'Gouda');
				disarmTrap('trinket');
			}
			return;
		}
		else{
			if(objDoors.clue[index]<15)
				range = 'between0and14';
			else if(objDoors.clue[index]<60)
				range = 'between15and59';
			else
				range = 'between60and100';
		}

		var arr;
		var arrAll = [];
		for (var i=0;i<objHallwayPriorities[range].length;i++){
			// i = 0/1/2 = plain/superior/epic
			arr = [];
			for (var j=0;j<3;j++)
				arr.push(j+1 + (objHallwayPriorities[range].length-1-i)*3);
			
			if(objHallwayPriorities[range][i].indexOf(objCodename.LONG) === 0)
				arrAll = arrAll.concat(arr.reverse());
			else
				arrAll = arrAll.concat(arr);
		}

		for (var i=arrAll.length;i<arrHallwayOrder.length;i++)
			arrAll.push(Number.MAX_SAFE_INTEGER);

		for (var i=0;i<objDoors.code.length;i++){
			if(objDoors.name[i].indexOf(districtFocus)>-1){
				index = arrHallwayOrder.indexOf(objDoors.code[i]);
				if(index > -1){
					objDoors.priorities[i] = arrAll[index];
				}
			}
		}

		console.pdebug(objDoors);
		var sortedDoorPriorities = sortWithIndices(objDoors.priorities, "ascend");
		fireEvent(doorsIntersect[sortedDoorPriorities.index[0]], 'click');
		window.setTimeout(function () { fireEvent(document.getElementsByClassName('mousehuntActionButton confirm')[0], 'click'); }, 1500);
	}
	catch (e){
		console.perror('labyrinth',e);
		checkThenArm(null, 'bait', 'Gouda');
		disarmTrap('trinket');
		return;
	}
}

function zokor(){
	var loc = GetCurrentLocation();
	if (loc.indexOf("Labyrinth") > -1){
		setStorage('eventLocation', 'Labyrinth');
		labyrinth();
		return;
	}
	else if (loc.indexOf("Zokor") < 0)
		return;
	
	var objZokorDefault = {
		bossStatus : ['INCOMING', 'ACTIVE', 'DEFEATED'],
		bait : new Array(3).fill('Gouda'),
		trinket : new Array(3).fill('None')
	};

	var objZokor = JSON.parse(getStorageToVariableStr('Zokor', JSON.stringify(objZokorDefault)));
	var objAncientCity = JSON.parse(getPageVariable('JSON.stringify(user.quests.QuestAncientCity)'));
	objAncientCity.boss = objAncientCity.boss.toUpperCase();
	var nIndex = objZokor.bossStatus.indexOf(objAncientCity.boss);
	console.plog('District Tier:', objAncientCity.district_tier, 'Boss Status:', objAncientCity.boss);
	if(objAncientCity.district_tier < 3)
		return;

	checkThenArm('best', 'weapon', bestForgotten);
	checkThenArm('best', 'base', bestLuckBase);
	if(nIndex > -1){
		checkThenArm(null, 'bait', objZokor.bait[nIndex]);
		if(objZokor.trinket[nIndex] == 'None')
			disarmTrap('trinket');
		else
			checkThenArm(null, 'trinket', objZokor.trinket[nIndex]);
	}
}

function fw(){
	if (GetCurrentLocation().indexOf("Fiery Warpath") < 0)
		return;

	var wave = getPageVariable('user.viewing_atts.desert_warpath.wave');
	wave = parseInt(wave);
    
    if (wave == 4){
		checkThenArm('best', 'weapon', bestFWWave4Weapon);
		checkThenArm('best', 'base', bestFWWave4Base);
		checkThenArm(null, 'bait', 'Gouda');
        return;
    }

	checkThenArm('best', 'base', bestLuckBase);
	var nStreakLength = document.getElementById('selectFWStreak').children.length;
	var objDefaultFW = {
		focusType : 'NORMAL',
		priorities : 'HIGHEST',
		cheese : new Array(nStreakLength),
		charmType : new Array(nStreakLength),
		special : new Array(nStreakLength),
		lastSoldierConfig : 'CONFIG_GOUDA'
	};
	var objFW = JSON.parse(getStorageToVariableStr('FW_Wave'+wave,JSON.stringify(objDefaultFW)));
	objFW.streak = parseInt(document.getElementsByClassName('streak_quantity')[0].innerText);
    console.pdebug('Wave:', wave, 'Streak:', objFW.streak);
	if(Number.isNaN(objFW.streak) || objFW.streak < 0 || objFW.streak >= nStreakLength)
		return;

	if(objFW.cheese[objFW.streak] === null)
		objFW.cheese[objFW.streak] = 'Gouda';
	if(objFW.charmType[objFW.streak] === null)
		objFW.charmType[objFW.streak] = 'Warpath';
	if(objFW.special[objFW.streak] === null)
		objFW.special[objFW.streak] = 'None';

	objFW.streakMouse = getPageVariable('user.viewing_atts.desert_warpath.streak.mouse_type');
	if(objFW.streakMouse.indexOf('desert_') > -1)
		objFW.streakMouse = capitalizeFirstLetter(objFW.streakMouse.split('_')[1]);

    console.pdebug('Current streak mouse type:', objFW.streakMouse);
	var population = document.getElementsByClassName('population');
	objFW.population = {
		all : [],
		normal : [],
		special : [],
		active : []
	};
	objFW.soldierActive = false;
	var temp;
	for(var i=0;i<population.length;i++){
		temp = parseInt(population[i].innerText);
		if(Number.isNaN(temp))
			temp = 0;
		objFW.population.all.push(temp);
		if(temp > 0)
			objFW.population.active.push(1);
		else
			objFW.population.active.push(0);
		if(i == objPopulation.WARRIOR || i == objPopulation.SCOUT || i == objPopulation.ARCHER){
			objFW.population.normal.push(temp);
			objFW.soldierActive |= (temp > 0);
		}
		else{
			objFW.population.special.push(temp);
		}
	}

	if(!objFW.soldierActive && objFW.focusType == 'NORMAL')
		objFW.focusType = 'SPECIAL';

	console.pdebug(objFW);
	var index = -1;
	var charmArmed = getPageVariable('user.trinket_name');
	var nSum = sumData(objFW.population.active);
	if(nSum == 1){ // only one soldier type left
		if(objFW.lastSoldierConfig == 'CONFIG_STREAK')
			objFW.priorities = 'HIGHEST';
		else{
			if(objFW.lastSoldierConfig == 'CONFIG_GOUDA'){
				index = objFW.population.active.indexOf(1);
				if(index == objPopulation.CAVALRY)
					checkThenArm('best', 'weapon', bestTactical);
				else if(index == objPopulation.MAGE)
					checkThenArm('best', 'weapon', bestHydro);
				else if(index == objPopulation.ARTILLERY)
					checkThenArm('best', 'weapon', bestArcane);
				else
					checkThenArm('best', 'weapon', bestPhysical);
				if(charmArmed.indexOf('Warpath') > -1)
					disarmTrap('trinket');
			}
			return;
		}
	}
	if(objFW.special[objFW.streak] == 'COMMANDER')
		checkThenArm(null, 'trinket', objFW.charmType[objFW.streak] + ' Commander\'s');
	else if(objFW.special[objFW.streak] == 'GARGANTUA'){
		checkThenArm('best', 'weapon', bestDraconic);
		if(charmArmed.indexOf('Warpath') > -1)
			disarmTrap('trinket');
	}
	else{
		var bCurrentStreakZeroPopulation = false;
		var bWrongSoldierTypeStreak = false;
		var indexMinMax;
		objFW.focusType = objFW.focusType.toLowerCase();
		if(objFW.priorities == 'HIGHEST')
			indexMinMax = maxIndex(objFW.population[objFW.focusType]);
		else{
			temp = objFW.population[objFW.focusType].slice();
			for(var i=0;i<temp.length;i++){
				if(temp[i] < 1)
					temp[i] = Number.MAX_SAFE_INTEGER;
			}
			indexMinMax = minIndex(temp);
		}
		index = objPopulation.name.indexOf(objFW.streakMouse);
		if(index > -1){
			bCurrentStreakZeroPopulation = (objFW.population.all[index] < 1);
			if(objFW.soldierActive && index >=3 && objFW.focusType.toUpperCase() == 'NORMAL'){
				bWrongSoldierTypeStreak = !(objFW.streak == 2 || objFW.streak >= 5);
			}
			else if(!objFW.soldierActive && objFW.focusType.toUpperCase() == 'SPECIAL'){
				bWrongSoldierTypeStreak = (index != (indexMinMax+3) && objFW.streak < 2);
			}
		}

		if(objFW.streak === 0 || bCurrentStreakZeroPopulation || bWrongSoldierTypeStreak){
			objFW.streak = 0;
			// objFW.focusType = objFW.focusType.toLowerCase();
			// if(objFW.priorities == 'HIGHEST')
				// index = maxIndex(objFW.population[objFW.focusType]);
			// else{
				// temp = objFW.population[objFW.focusType].slice();
				// for(var i=0;i<temp.length;i++){
					// if(temp[i] < 1)
						// temp[i] = Number.MAX_SAFE_INTEGER;
				// }
				// index = minIndex(temp);
			// }

			temp = objFW.population[objFW.focusType][indexMinMax];
			if(objFW.focusType.toUpperCase() == 'NORMAL'){
				checkThenArm('best', 'weapon', bestPhysical);
				var count = countArrayElement(temp, objFW.population[objFW.focusType]);
				if(count > 1){
					if(objFW.population[objFW.focusType][objPopulation.SCOUT] == temp)
						checkThenArm(null, 'trinket', objFW.charmType[0] + ' Scout');
					else if(objFW.population[objFW.focusType][objPopulation.ARCHER] == temp)
						checkThenArm(null, 'trinket', objFW.charmType[0] + ' Archer');
					else if(objFW.population[objFW.focusType][objPopulation.WARRIOR] == temp)
						checkThenArm(null, 'trinket', objFW.charmType[0] + ' Warrior');
				}
				else{
					checkThenArm(null, 'trinket', objFW.charmType[0] + ' ' + objPopulation.name[indexMinMax]);
				}
			}
			else{
				if((indexMinMax+3) == objPopulation.ARTILLERY && nSum !=1){
					temp = objFW.population.special.slice();
					temp.splice(indexMinMax,1);
					indexMinMax = minIndex(temp);
				}
				indexMinMax += 3;
				if(indexMinMax == objPopulation.CAVALRY){
					checkThenArm('best', 'weapon', bestTactical);
					checkThenArm(null, 'trinket', objFW.charmType[0] + ' Cavalry');
				}
				else if(indexMinMax == objPopulation.MAGE){
					checkThenArm('best', 'weapon', bestHydro);
					checkThenArm(null, 'trinket', objFW.charmType[0] + ' Mage');
				}
				else if(indexMinMax == objPopulation.ARTILLERY){
					checkThenArm('best', 'weapon', bestArcane);
					if(charmArmed.indexOf('Warpath') > -1)
						disarmTrap('trinket');
				}
			}
		}
		else{
			if(index == objPopulation.ARTILLERY && charmArmed.indexOf('Warpath') > -1)
				disarmTrap('trinket');
			else{
				if(objFW.charmType[objFW.streak].indexOf('Super') > -1){
					temp = [objFW.charmType[objFW.streak] + ' ' + objPopulation.name[index], 'Warpath ' + objPopulation.name[index]];
					checkThenArm('best', 'trinket', temp);
				}
				else{
					checkThenArm(null, 'trinket', objFW.charmType[objFW.streak] + ' ' + objPopulation.name[index]);
				}
			}

			if(index == objPopulation.CAVALRY)
				checkThenArm('best', 'weapon', bestTactical);
			else if(index == objPopulation.MAGE)
				checkThenArm('best', 'weapon', bestHydro);
			else if(index == objPopulation.ARTILLERY)
				checkThenArm('best', 'weapon', bestArcane);
			else
				checkThenArm('best', 'weapon', bestPhysical);
		}
	}
	checkThenArm(null, 'bait', objFW.cheese[objFW.streak]);
}

function fRift(){
	if(GetCurrentLocation().indexOf('Furoma Rift') < 0)
		return;
	
	var objFRDefault = {
		enter : 0,
		retreat : 0,
		weapon : new Array(11).fill(''),
		base : new Array(11).fill(''),
		trinket : new Array(11).fill(''),
		bait : new Array(11).fill('')
	};

	var objFR = JSON.parse(getStorageToVariableStr('FRift', JSON.stringify(objFRDefault)));
	objFR.enter = parseInt(objFR.enter);
	objFR.retreat = parseInt(objFR.retreat);
	var bInPagoda = (getPageVariable('user.quests.QuestRiftFuroma.view_state') == 'pagoda');
	var i;
	if(bInPagoda){
		var nCurBatteryLevel = 0;
		var nRemainingEnergy = parseInt(getPageVariable('user.quests.QuestRiftFuroma.droid.remaining_energy'));
		if(Number.isNaN(nRemainingEnergy)){
			console.plog('Remaining Energy:', nRemainingEnergy);
			return;
		}
		for(i=objFRBattery.cumulative.length-1;i>=0;i--){
			if(nRemainingEnergy <= objFRBattery.cumulative[i])
				nCurBatteryLevel = i+1;
			else
				break;
		}
		console.plog('In Pagoda, Current Battery Level:', nCurBatteryLevel, 'Remaining Energy:', nRemainingEnergy);
		if(nCurBatteryLevel <= objFR.retreat){
			fRiftArmTrap(objFR, 0);
			if(nCurBatteryLevel !== 0){
				// retreat
				fireEvent(document.getElementsByClassName('riftFuromaHUD-leavePagoda')[0], 'click');
				window.setTimeout(function () { fireEvent(document.getElementsByClassName('mousehuntActionButton confirm')[0], 'click'); }, 1500);
			}
		}
		else{
			fRiftArmTrap(objFR, nCurBatteryLevel);
		}
	}
	else{
		var nFullBatteryLevel = 0;
		var classBattery = document.getElementsByClassName('riftFuromaHUD-battery');
		var nStoredEnerchi = parseInt(document.getElementsByClassName('total_energy')[0].children[1].innerText);
		if(classBattery.length < 1 || Number.isNaN(nStoredEnerchi))
			return;
		for(i=0;i<objFRBattery.cumulative.length;i++){
			if(nStoredEnerchi >= objFRBattery.cumulative[i])
				nFullBatteryLevel = i+1;
			else
				break;
		}
		console.log('In Training Ground, Fully Charged Battery Level:', nFullBatteryLevel, 'Stored Enerchi:', nStoredEnerchi);
		if(nFullBatteryLevel >= objFR.enter){
			fRiftArmTrap(objFR, nFullBatteryLevel);
			// enter
			fireEvent(classBattery[nFullBatteryLevel-1], 'click');
			window.setTimeout(function () { fireEvent(document.getElementsByClassName('mousehuntActionButton confirm')[0], 'click'); }, 1500);
		}
		else{
			fRiftArmTrap(objFR, 0);
		}
	}
}

function fRiftArmTrap(obj, nIndex){
	checkThenArm(null, 'weapon', obj.weapon[nIndex]);
	checkThenArm(null, 'base', obj.base[nIndex]);
	checkThenArm(null, 'bait', obj.bait[nIndex]);
	if(obj.trinket[nIndex] == 'NoAbove'){
		var charmArmed = getPageVariable("user.trinket_name");
		var optionTrinket = document.getElementById('selectFRTrapTrinket').children;
		for(var i=0;i<optionTrinket.length;i++){
			if (charmArmed.indexOf(optionTrinket[i].value) === 0){
				disarmTrap('trinket');
				break;
			}
		}
	}
	else if(obj.trinket[nIndex] == 'None'){
		disarmTrap('trinket');
	}
	else
		checkThenArm(null, 'trinket', obj.trinket[nIndex]);
}



function gnawnianExpress(load) {
    var currentLocation = getPageVariable("user.location");
    console.debug(currentLocation);
    if (currentLocation.indexOf("Gnawnian Express") > -1) {
        var onTrain = getPageVariable('user.quests.QuestTrainStation.on_train');
        var charmArmed = getPageVariable('user.trinket_name');
        var trapArmed = getPageVariable('user.weapon_name');
        if (onTrain == 'false' || onTrain == 0) {
           // if (charmArmed.indexOf('Supply Schedule') > -1 || charmArmed.indexOf('Roof Rack') > -1 || charmArmed.indexOf('Greasy Glob') > -1 || charmArmed.indexOf('Door Guard') > -1 || charmArmed.indexOf('Dusty Coal') > -1 || charmArmed.indexOf('Black Powder') > -1 || charmArmed.indexOf('Magmatic Crystal') > -1)
                //disarmTrap('trinket');

            //if (trapArmed.indexOf('Supply Grabber') > -1 || trapArmed.indexOf('Bandit Deflector') > -1 || trapArmed.indexOf('Engine Doubler') > -1)
                checkThenArm('best', 'weapon', ['S.L.A.C. II', 'Law Laser Trap', 'S.L.A.C.']);
                checkThenArm(null, 'trinket', 'Super Luck');
        } else {
            var phase = document.getElementsByClassName('phaseName')[0].textContent;
            phase = phase.substr(7, phase.length);
            console.debug('Current Active Train Phase: ' + phase);
            switch (phase) {
                case 'Supply Depot':
                    checkThenArm('best', 'weapon', supplyDepotTrap);
                    var supplyHoarder = parseInt(document.getElementsByClassName('supplyHoarderTab')[0].textContent.substr(0, 1));
                    if (supplyHoarder == 0) {
                        console.debug("Looking for supply hoarder");
                        checkThenArm(null, 'trinket', 'Supply Schedule');
                    } else {
                        console.debug("Supply hoarder is present. Disarming charm now...");
                        disarmTrap('trinket');
                    }
                    loadTrain('depot', load);
                    break;
                case 'Raider River':
                    checkThenArm('best', 'weapon', raiderRiverTrap);
                    var attacking = document.getElementsByClassName('attacked');
                    for (var i = 0; i < attacking.length; i++) {
                        if (attacking[i].tagName == 'DIV')
                            attacking = attacking[i].className.substr(0, attacking[i].className.indexOf(' '));
                    }
                    console.debug("Raiders are attacking " + attacking);
                    switch (attacking) {
                        case 'roof':
                            checkThenArm(null, 'trinket', 'Roof Rack', 'disarm');
                            break;
                        case 'door':
                            checkThenArm(null, 'trinket', 'Door Guard', 'disarm');
                            break;
                        case 'rails':
                            checkThenArm(null, 'trinket', 'Greasy Glob', 'disarm');
                            break;
                        default:
                            console.debug('Bot is confused, raiders are not attacking?');
                            disarmTrap('trinket');
                            break;
                    }
                    loadTrain('raider', load);
                    break;
                case 'Daredevil Canyon':
                    checkThenArm('best', 'weapon', daredevilCanyonTrap);
                    checkThenArm('best', 'trinket', coalCharm);
                    loadTrain('canyon', load);
                    break;
                default:
                    break;
            }
        }
    }
}

function loadTrain(location, load) {
    try {
        if (load) {
            switch (location) {
                case 'raider':
                    var repellents = parseInt(document.getElementsByClassName('mouseRepellent')[0].getElementsByClassName('quantity')[0].textContent);
                    if (repellents >= 10)
                        fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
                    break;
                case 'canyon':
                    var timeLeft = document.getElementsByClassName('phaseTimer')[0].textContent.substr(10);
                    // Fire only when time left is less than 16 mins :P (needs checking if works)
                    if (parseInt(timeLeft.substr(0, timeLeft.indexOf(':'))) == 0 && parseInt(timeLeft.substr(timeLeft.indexOf(':') + 1)) <= 16)
                        fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
                    break;
                default:
                    fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
                    break;
            }
        }
        return;
    } catch (e) {
        console.debug(e.message);
        return;
    }
}


function livingGarden(isAutoPour) {
    checkThenArm('best', 'weapon', bestHydro);
	checkThenArm('best', 'base', bestLGBase);
	var pourEstimate = document.getElementsByClassName('pourEstimate')[0];
    if (pourEstimate.innerText !== "")
    {
        // Not pouring
		console.pdebug('Filling...');
        var estimateHunt = parseInt(pourEstimate.innerText);
        console.pdebug('Estimate Hunt:', estimateHunt);
        if (estimateHunt >= 35)
        {
			if (isAutoPour) {
				console.pdebug('Going to click Pour...');
				var pourButton = document.getElementsByClassName('pour')[0];
				if (pourButton)
				{
					fireEvent(pourButton, 'click');
					if (document.getElementsByClassName('confirm button')[0])
						window.setTimeout(function () { fireEvent(document.getElementsByClassName('confirm button')[0], 'click'); }, 1000);
				}
			}
			
			if (getPageVariable('user.trinket_name').indexOf('Sponge') > -1 || getPageVariable('user.trinket_name').indexOf('Blue Double') > -1 )
				checkThenArm(null, 'trinket', 'Super Luck');
        }
		else if (estimateHunt >= 28)
			checkThenArm('best', 'trinket', spongeCharm);
        else
            checkThenArm('best', 'trinket', spongeCharm);
    }
    else
    {
        // Pouring
		console.pdebug('Pouring...');
        if (getPageVariable('user.trinket_name').indexOf('Sponge') > -1)
            checkThenArm(null, 'trinket', 'Super Luck');
            //disarmTrap('trinket');
    }
	
    return;
}


function lostCity() {
	var isCursed = (document.getElementsByClassName('stateBlessed hidden').length > 0);
    console.pdebug('Cursed:', isCursed);
    
	//disarm searcher charm when cursed is lifted
    if (!isCursed) {
        if (getPageVariable('user.trinket_name').indexOf('Searcher') > -1)
            checkThenArm(null, 'trinket', 'Super Luck');
    }
    else
        checkThenArm(null, 'trinket', 'Searcher');
	
	checkThenArm('best', 'weapon', bestArcane);
	checkThenArm('best', 'base', bestLGBase);
	checkThenArm(null, 'bait', 'Dewthief');
    return;
}

function sandDunes() {
    var hasStampede = getPageVariable('user.quests.QuestSandDunes.minigame.has_stampede');
    console.pdebug('Has Stampede:', hasStampede);

    //disarm grubling chow charm when there is no stampede
    if (hasStampede == 'false')
    {
        if (getPageVariable('user.trinket_name').indexOf('Chow') > -1)
            disarmTrap('trinket');
        checkThenArm(null, 'trinket', 'Grubling Bonanza');
    }
    else
        checkThenArm(null, 'trinket', 'Grubling Chow');
	
	checkThenArm('best', 'weapon', bestShadow);
	checkThenArm('best', 'base', bestLGBase);
	checkThenArm(null, 'bait', 'Dewthief');
    return;
}

function twistedGarden(isAutoPour) {
    var red = parseInt(document.getElementsByClassName('itemImage red')[0].innerText);
    var yellow = parseInt(document.getElementsByClassName('itemImage yellow')[0].innerText);
    var charmArmed = getPageVariable('user.trinket_name');
    var baitArmed = getPageVariable('user.bait_name')
    console.pdebug('Red:', red, 'Yellow:', yellow);
	checkThenArm('best', 'weapon', bestHydro);
	var redPlusYellow = redSpongeCharm.concat(yellowSpongeCharm);
	if (red <= 8 && yellow <= 8)
		checkThenArm('best', 'trinket', redPlusYellow);
    else if (red < 10)
    {
        if (red <= 8)
            checkThenArm('best', 'trinket', redSpongeCharm);
        else
            checkThenArm(null, 'trinket', 'Red Sponge');
    }
    else if (red == 10 && yellow < 10)
    {
        if (yellow <=8)
            checkThenArm('best', 'trinket', yellowSpongeCharm);
        else
            checkThenArm(null, 'trinket', 'Yellow Sponge');
    }
    else {
        if (charmArmed.indexOf('Red') > -1 || charmArmed.indexOf('Yellow') > -1)
            checkThenArm(null, 'trinket', 'Super Luck');    
		
		if (isAutoPour) {
			var pourButton = document.getElementsByClassName('pour')[0];
			if (pourButton)
			{
				fireEvent(pourButton, 'click');
				if (document.getElementsByClassName('confirm button')[0])
					window.setTimeout(function () { fireEvent(document.getElementsByClassName('confirm button')[0], 'click'); }, 1000);
			}
		}
    }
    return;
}

function cursedCity() {
    var cursed = getPageVariable('user.quests.QuestLostCity.minigame.is_cursed');
    var curses = "";
    var charmArmed = getPageVariable('user.trinket_name');
    if (cursed == 'false')
    {
        if (charmArmed.indexOf('Bravery') > -1 || charmArmed.indexOf('Shine') > -1 || charmArmed.indexOf('Clarity') > -1)
            checkThenArm('best', 'trinket', ['Super Cactus', 'Safeguard']);
    }
    else
    {
        var cursedCityCharm = [];
		for (var i = 0; i < 3; ++i)
        {
            curses = getPageVariable('user.quests.QuestLostCity.minigame.curses[' + i + '].active');
            if (curses == 'true')
            {
				switch (i)
                {
                    case 0:
                        console.pdebug("Fear Active");
						checkThenArm(null, 'trinket', 'Bravery');
                        //cursedCityCharm.push('Bravery');
						break;
                    case 1:
                        console.pdebug("Darkness Active");
						checkThenArm(null, 'trinket', 'Shine');
                        //cursedCityCharm.push('Shine');
						break;
                    case 2:
						console.pdebug("Mist Active");
						checkThenArm(null, 'trinket', 'Clarity');
                        //cursedCityCharm.push('Clarity');
						break;
                }
            }
        }
		//checkThenArm(null, 'trinket', cursedCityCharm);
    }
	
	checkThenArm('best', 'weapon', bestArcane);
	checkThenArm('best', 'base', bestLGBase);
	checkThenArm(null, 'bait', 'Graveblossom');
    return;
}

function sandCrypts() {
    var salt = parseInt(document.getElementsByClassName('salt_charms')[0].innerText);
    console.pdebug('Salted:', salt);
    if (salt >= objLG.maxSaltCharged)
        checkThenArm(null, 'trinket', 'Grub Scent');
    else {
		if ((objLG.maxSaltCharged - salt) == 1)
			checkThenArm(null, 'trinket', 'Grub Salt');
		else
			checkThenArm('best', 'trinket', bestSalt);
    }
	
	checkThenArm('best', 'weapon', bestShadow);
	checkThenArm('best', 'base', bestLGBase);
	checkThenArm(null, 'bait', 'Graveblossom');
    return;
}

function DisarmLGSpecialCharm(locationName)
{
	var obj = {};
	obj['Living Garden'] = spongeCharm.slice();
	obj['Lost City'] = ['Searcher'];
	obj['Sand Dunes'] = ['Grubling Chow'];
	obj['Twisted Garden'] = redSpongeCharm.concat(yellowSpongeCharm);
	obj['Cursed City'] = ['Bravery', 'Shine', 'Clarity'];
	obj['Sand Crypts'] = bestSalt.slice();
	delete obj[locationName];
	var charmArmed = getPageVariable("user.trinket_name");
	for (var prop in obj)
	{
		if(obj.hasOwnProperty(prop))
		{
			for (var i = 0; i < obj[prop].length; ++i)
			{
				if (charmArmed.indexOf(obj[prop][i]) === 0)
				{
					disarmTrap('trinket');
					return;
				}
			}
		}
	}
}

function retrieveMouseList() {
    fireEvent(document.getElementById('effectiveness'), 'click');
    var sec = secWait;
    var intervalRML = setInterval(
        function () {
            if (document.getElementsByClassName('thumb').length > 0)
            {
                mouseList = [];
                var y = document.getElementsByClassName('thumb');
                for (var i = 0; i < y.length; ++i) {
                    mouseList.push(y[i].getAttribute('title'));
                }
                fireEvent(document.getElementById('trapSelectorBrowserClose'), 'click');
                clearInterval(intervalRML);
                intervalRML = null;
                return;
            }
            else
            {
                --sec;
                if (sec <= 0) {
                    fireEvent(document.getElementById('effectiveness'), 'click');
                    sec = secWait;
                }
            }
        }, 1000);
    return;
}

function checkMouse(mouseName) {
    for (var i = 0; i < mouseList.length; ++i) {
        if (mouseList[i].indexOf(mouseName) > -1) {
            return true;
        }
        return false;
    }
}

function checkCharge2016(stopDischargeAt){
	try {
		var charge = parseInt(document.getElementsByClassName('springHuntHUD-charge-quantity')[0].innerText);
		var isDischarge = (getStorage("discharge") == "true");
		console.pdebug('Current Charge:', charge, 'Discharging:', isDischarge, 'Stop Discharge At:', stopDischargeAt);
		var charmContainer = document.getElementsByClassName('springHuntHUD-charmContainer')[0];
		var eggstra = {};
		eggstra.quantity = parseInt(charmContainer.children[0].children[0].innerText);
		eggstra.link = charmContainer.children[0].children[1];
		eggstra.isArmed = (eggstra.link.getAttribute('class').indexOf('active') > 0);
		eggstra.canArm = (eggstra.quantity > 0 && !eggstra.isArmed);
		var eggstraCharge = {};
		eggstraCharge.quantity = parseInt(charmContainer.children[1].children[0].innerText);
		eggstraCharge.link = charmContainer.children[1].children[1];
		eggstraCharge.isArmed = (eggstraCharge.link.getAttribute('class').indexOf('active') > 0);
		eggstraCharge.canArm = (eggstraCharge.quantity > 0 && !eggstraCharge.isArmed);
		var eggscavator = {};
		eggscavator.quantity = parseInt(charmContainer.children[2].children[0].innerText);
		eggscavator.link = charmContainer.children[2].children[1];
		eggscavator.isArmed = (eggscavator.link.getAttribute('class').indexOf('active') > 0);
		eggscavator.canArm = (eggscavator.quantity > 0 && !eggscavator.isArmed);

        if (charge == 20) {
            setStorage("discharge", "true");
			if (eggstra.canArm) fireEvent(eggstra.link, 'click');
        }
        else if (charge < 20 && charge > stopDischargeAt) {
            if (isDischarge) {
				if (eggstra.canArm) fireEvent(eggstra.link, 'click');
            }
            else {
				if (charge >= chargeHigh) {
					if (eggstraCharge.quantity > 0){
						if (!eggstraCharge.isArmed) fireEvent(eggstraCharge.link, 'click');
					}
					else{
						if (eggscavator.canArm) fireEvent(eggscavator.link, 'click');
					}
				}
				else {
					if (eggscavator.canArm) fireEvent(eggscavator.link, 'click');
				}
            }
        }
		else if (charge <= stopDischargeAt) {
			if (charge >= chargeHigh) {
				if (eggstraCharge.quantity > 0){
					if (!eggstraCharge.isArmed) fireEvent(eggstraCharge.link, 'click');
				}
				else{
					if (eggscavator.canArm) fireEvent(eggscavator.link, 'click');
				}
			}
			else {
				if (eggscavator.canArm) fireEvent(eggscavator.link, 'click');
			}
			setStorage("discharge", "false");
		}
    }
    catch (e) {
        console.perror('checkCharge2016',e);
    }
}
function checkCharge(stopDischargeAt) {
    try {
        var charge = parseInt(document.getElementsByClassName("chargeQuantity")[0].innerText);
		console.pdebug('Current Charge:', charge);
        if (charge == 20) {
            setStorage("discharge", true.toString());
            checkThenArm(null, "trinket", "Eggstra Charm");
        }

        else if (charge < 20 && charge > stopDischargeAt) {
            if (getStorage("discharge") == "true") {
                checkThenArm(null, "trinket", "Eggstra Charm");
            }
            else {
				if (stopDischargeAt == 17) {
					checkThenArm('best', "trinket", chargeCharm);
				}
				else {
					checkThenArm(null, "trinket", "Eggscavator");
				}
            }
        }
		else if (charge == stopDischargeAt) {
			if (stopDischargeAt == 17) {
				checkThenArm('best', "trinket", chargeCharm);
			}
			else {
				checkThenArm(null, "trinket", "Eggscavator");
			}
			setStorage("discharge", false.toString());
		}
        else if (charge < stopDischargeAt) {
            setStorage("discharge", false.toString());
			checkThenArm(null, "trinket", "Eggscavator");
        }
        return;
    }
    catch (e) {
        console.perror('checkCharge',e);
    }
}

function checkThenArm(sort, category, name, isForcedRetry)   //category = weapon/base/charm/trinket/bait
{
	if(isNullOrUndefined(name))
		return;

	if (category == "charm")
        category = "trinket";
	
	if(isNullOrUndefined(isForcedRetry))
		isForcedRetry = true;

    var trapArmed = undefined;
	var userVariable = getPageVariable("user." + category + "_name");
    if (sort == 'best') {
		getTrapList(category);
		if (objTrapList[category].length === 0){
			var intervalCTA1 = setInterval(
				function (){
					if (!arming){
						getTrapListFromTrapSelector(sort, category, name, isForcedRetry);
						clearInterval(intervalCTA1);
						intervalCTA1 = null;
						return;
					}
				}, 1000);
			return;
		}
		else{
			var nIndex = -1;
			for (var i = 0; i < name.length; i++) {
				for (var j = 0; j < objTrapList[category].length; j++) {
					nIndex = objTrapList[category][j].indexOf("...");
					if(nIndex > -1)
						name[i] = name[i].substr(0,nIndex);
					if (objTrapList[category][j].indexOf(name[i]) === 0){
						console.plog('Best', category, 'found:', name[i], 'Currently Armed:', userVariable);
						if (userVariable.indexOf(name[i]) === 0) {
							trapArmed = true;
							arming = false;
							closeTrapSelector(category);
							return;
						}
						else {
							trapArmed = false;
							break;
						}
					}
				}
				if (trapArmed === false)
					break;
			}
		}
    }
    else
    {
        trapArmed = (userVariable.indexOf(name) === 0);
    }

	if (trapArmed === undefined && isForcedRetry){
		console.plog(name.join("/"), "not found in TrapList", capitalizeFirstLetter(category));
		clearTrapList(category);
		checkThenArm(sort, category, name, false);
	}
    else if (trapArmed === false)
    {
        var intervalCTA = setInterval(
            function ()
            {
                if (arming === false)
                {
                    clickThenArmTrapInterval(sort, category, name);
                    clearInterval(intervalCTA);
                    intervalCTA = null;
                    return;
                }
            }, 1000);
    }

    return;
}

function clickThenArmTrapInterval(sort, trap, name) //sort = power/luck/attraction
{
    clickTrapSelector(trap);
    var sec = secWait;
	var armStatus = LOADING;
	var retry = armTrapRetry;
    var intervalCTATI = setInterval(
        function ()
        {
            armStatus = armTrap(sort, trap, name);
			if (armStatus != LOADING)
            {
                clearInterval(intervalCTATI);
                arming = false;
                intervalCTATI = null;
				if (armStatus == NOT_FOUND){
					//clearTrapList(trap);
					if (trap == 'trinket')
						disarmTrap('trinket');
					else
						closeTrapSelector(trap);
				}
                return;
            }
            else
            {
                --sec;
                if (sec <= 0)
                {
                    clickTrapSelector(trap);
                    sec = secWait;
					--retry;
					if (retry <= 0)
					{
						clearInterval(intervalCTATI);
						arming = false;
						intervalCTATI = null;
						return;
					}
                }
            }
        }, 1000);
    return;
}

// name = Brie/Gouda/Swiss (brie = wrong)
function armTrap(sort, trap, name) {
    var tagGroupElement = document.getElementsByClassName('tagGroup');
    var tagElement;
    var nameElement;
	var nIndex = -1;
	var nameArray = name;
	
    if (sort == 'best')
        name = name[0];
    
    if (tagGroupElement.length > 0)
    {
        console.pdebug('Try to arm', name);
        for (var i = 0; i < tagGroupElement.length; ++i)
        {
            tagElement = tagGroupElement[i].getElementsByTagName('a');
            for (var j = 0; j < tagElement.length; ++j)
            {
                nameElement = tagElement[j].getElementsByClassName('name')[0].innerText;
				nIndex = nameElement.indexOf("...");
				if(nIndex > -1)
					name = name.substr(0, nIndex);
                if (nameElement.indexOf(name) === 0)
                {
                    if(tagElement[j].getAttribute('class').indexOf('selected')<0)	// only click when not arming
						fireEvent(tagElement[j], 'click');
					else
						closeTrapSelector(trap);
					
					if(objTrapList[trap].indexOf(nameElement) < 0){
						objTrapList[trap].unshift(nameElement);
						setStorage("TrapList" + capitalizeFirstLetter(trap), objTrapList[trap].join(","));
					}
					
					console.pdebug(name, 'armed');
					return ARMED;
                }
            }
        }
		console.pdebug(name, 'not found');
		for(var i=0;i<objTrapList[trap].length;i++){
			if(objTrapList[trap][i].indexOf(name) === 0){
				objTrapList[trap].splice(i,1);
				setStorage("TrapList" + capitalizeFirstLetter(trap), objTrapList[trap].join(","));
				break;
			}
		}
        if (sort == 'best')
        {
			nameArray.shift();
            if (nameArray.length > 0)
                return armTrap(sort, trap, nameArray);
			else
				return NOT_FOUND;
        }
		else
			return NOT_FOUND;
    }
	else
		return LOADING;
}

function clickTrapSelector(strSelect){ //strSelect = weapon/base/charm/trinket/bait
	if(document.getElementsByClassName("showComponents " + strSelect).length > 0){ // trap selector opened
		arming = true;
		return (console.pdebug('Trap selector', strSelect, 'opened'));
	}

	if (strSelect == "base") {
        fireEvent(document.getElementsByClassName('trapControlThumb')[0], 'click');
    }
    else if (strSelect == "weapon") {
        fireEvent(document.getElementsByClassName('trapControlThumb')[1], 'click');
    }
    else if (strSelect == "charm" || strSelect == "trinket") {
        fireEvent(document.getElementsByClassName('trapControlThumb')[2], 'click');
    }
    else if (strSelect == "bait") {
        fireEvent(document.getElementsByClassName('trapControlThumb')[3], 'click');
    }
    else {
        return (console.pdebug("Invalid trapSelector"));
    }
    arming = true;
    return (console.pdebug("Trap selector", strSelect, "clicked"));
}

function closeTrapSelector(category){
	if(document.getElementsByClassName("showComponents " + category).length > 0)
		fireEvent(document.getElementById('trapSelectorBrowserClose'), 'click');
}

function retrieveDataFirst() {
	try {
		var gotHornTime = false;
		var gotPuzzle = false;
		var gotBaitQuantity = false;
		var retrieveSuccess = false;

		var scriptElementList = document.getElementsByTagName('script');
		
		if (scriptElementList) {
			var i;
			for (i = 0; i < scriptElementList.length; ++i) {
				var scriptString = scriptElementList[i].innerHTML;

				// get next horn time
				var hornTimeStartIndex = scriptString.indexOf("next_activeturn_seconds");
				if (hornTimeStartIndex >= 0) {
					var nextActiveTime = 900;
					hornTimeStartIndex += 25;
					var hornTimeEndIndex = scriptString.indexOf(",", hornTimeStartIndex);
					var hornTimerString = scriptString.substring(hornTimeStartIndex, hornTimeEndIndex);
					nextActiveTime = parseInt(hornTimerString);

					hornTimeDelay = hornTimeDelayMin + Math.round(Math.random() * (hornTimeDelayMax - hornTimeDelayMin));

					if (!aggressiveMode) {
						// calculation base on the js in Mousehunt
						var additionalDelayTime = Math.ceil(nextActiveTime * 0.1);

						// need to found out the mousehunt provided timer interval to determine the additional delay
						var timerIntervalStartIndex = scriptString.indexOf("hud.timer_interval");
						if (timerIntervalStartIndex >= 0) {
							timerIntervalStartIndex += 21;
							var timerIntervalEndIndex = scriptString.indexOf(";", timerIntervalStartIndex);
							var timerIntervalString = scriptString.substring(timerIntervalStartIndex, timerIntervalEndIndex);
							var timerInterval = parseInt(timerIntervalString);

							// calculation base on the js in Mousehunt
							if (timerInterval == 1) {
								additionalDelayTime = 2;
							}

							timerIntervalStartIndex = undefined;
							timerIntervalEndIndex = undefined;
							timerIntervalString = undefined;
							timerInterval = undefined;
						}

						// safety mode, include extra delay like time in horn image appear
						//hornTime = nextActiveTime + additionalDelayTime + hornTimeDelay;
						hornTime = nextActiveTime + hornTimeDelay;
						lastDateRecorded = undefined;
						lastDateRecorded = new Date();

						additionalDelayTime = undefined;
					}
					else {
						// aggressive mode, no extra delay like time in horn image appear
						hornTime = nextActiveTime;
						lastDateRecorded = undefined;
						lastDateRecorded = new Date();
					}

					gotHornTime = true;

					hornTimeStartIndex = undefined;
					hornTimeEndIndex = undefined;
					hornTimerString = undefined;
					nextActiveTime = undefined;
				}

				// get is king's reward or not
				var hasPuzzleStartIndex = scriptString.indexOf("has_puzzle");
				if (hasPuzzleStartIndex >= 0) {
					hasPuzzleStartIndex += 12;
					var hasPuzzleEndIndex = scriptString.indexOf(",", hasPuzzleStartIndex);
					var hasPuzzleString = scriptString.substring(hasPuzzleStartIndex, hasPuzzleEndIndex);
					isKingReward = (hasPuzzleString != 'false');

					gotPuzzle = true;

					hasPuzzleStartIndex = undefined;
					hasPuzzleEndIndex = undefined;
					hasPuzzleString = undefined;
				}

				// get cheese quantity
				var baitQuantityStartIndex = scriptString.indexOf("bait_quantity");
				if (baitQuantityStartIndex >= 0) {
					baitQuantityStartIndex += 15;
					var baitQuantityEndIndex = scriptString.indexOf(",", baitQuantityStartIndex);
					var baitQuantityString = scriptString.substring(baitQuantityStartIndex, baitQuantityEndIndex);
					baitQuantity = parseInt(baitQuantityString);

					gotBaitQuantity = true;

					baitQuantityStartIndex = undefined;
					baitQuantityEndIndex = undefined;
					baitQuantityString = undefined;
				}

				var locationStartIndex;
				var locationEndIndex;
				locationStartIndex = scriptString.indexOf("location\":\"");
				if (locationStartIndex >= 0) {
					locationStartIndex += 11;
					locationEndIndex = scriptString.indexOf("\"", locationStartIndex);
					var locationString = scriptString.substring(locationStartIndex, locationEndIndex);
					currentLocation = locationString;

					locationStartIndex = undefined;
					locationEndIndex = undefined;
					locationString = undefined;
				}

				scriptString = undefined;
			}
			i = undefined;
		}
		scriptElementList = undefined;

		if (gotHornTime && gotPuzzle && gotBaitQuantity) {
			// get trap check time
			CalculateNextTrapCheckInMinute();

			// get last location
			var huntLocationCookie = getStorage("huntLocation");
			if (isNullOrUndefined(huntLocationCookie)) {
				huntLocation = currentLocation;
				setStorage("huntLocation", currentLocation);
			}
			else {
				huntLocation = huntLocationCookie;
				setStorage("huntLocation", huntLocation);
			}
			huntLocationCookie = undefined;

			// get last king reward time
			var lastKingRewardDate = getStorage("lastKingRewardDate");
			if (isNullOrUndefined(lastKingRewardDate)) {
				lastKingRewardSumTime = -1;
			}
			else {
				var lastDate = new Date(lastKingRewardDate);
				lastKingRewardSumTime = parseInt((new Date() - lastDate) / 1000);
				lastDate = undefined;
			}
			lastKingRewardDate = undefined;

			retrieveSuccess = true;
		}
		else {
			retrieveSuccess = false;
		}

		// clean up
		gotHornTime = undefined;
		gotPuzzle = undefined;
		gotBaitQuantity = undefined;
		return (retrieveSuccess);
	}
	catch (e) {
		console.perror('retrieveDataFirst',e);
	}
	finally {
		retrieveSuccess = undefined;
	}
}

function GetHornTime() {
	var huntTimerElement = document.getElementById('huntTimer');
	if (huntTimerElement !== null) {
		huntTimerElement = huntTimerElement.textContent;
		if (huntTimerElement.length == 4) huntTimerElement = '0' + huntTimerElement;
		var totalSec;
		if (isNewUI) {
			var strTemp = new Date().toDateString() + ' 00:' + huntTimerElement;
			var huntingTime = new Date(strTemp);
			totalSec = huntingTime.getMinutes() * 60 + huntingTime.getSeconds();
		}
		else {
			var temp = parseInt(huntTimerElement);
			if (!isNaN(temp)) {
				totalSec = temp * 60;
			}
			else {
				totalSec = 0;
			}
		}
		return totalSec;
	}
	else {
		return 900;
	}
}

function getKingRewardStatus() {
	var headerOrHud = (isNewUI) ? document.getElementById('mousehuntHud') : document.getElementById('header');
	if (header !== null) {
		var textContentLowerCase = header.textContent.toLowerCase();
		if (textContentLowerCase.indexOf("king reward") > -1 ||
			textContentLowerCase.indexOf("king's reward") > -1 ||
			textContentLowerCase.indexOf("kings reward") > -1) {
			return true;
		}
		else
			return (getPageVariable('user.has_puzzle') == 'true');
	}
	else
		return false;
}

function getBaitQuantity() {
	var hudBaitQuantity = document.getElementById('hud_baitQuantity');
	if (hudBaitQuantity !== null) {
		return parseInt(hudBaitQuantity.textContent);
	}
	else {
		return 0;
	}
}

function getCurrentLocation() {
	var tempLocation;
	if (isNewUI) {
		tempLocation = document.getElementsByClassName('mousehuntHud-environmentName');
		if (tempLocation.length > 0)
			return tempLocation[0].textContent;
		else
			return "";
	}
	else {
		tempLocation = document.getElementById('hud_location');
		if (!isNullOrUndefined(tempLocation))
			return tempLocation.textContent;
		else
			return "";
	}
}

function retrieveData() {
	try {
		// get next horn time
		browser = browserDetection();
		if (!(browser == 'firefox' || browser == 'opera' || browser == 'chrome')) {
			window.setTimeout(function () { reloadWithMessage("Browser not supported. Reloading...", false); }, 60000);
		}
		
		currentLocation = getCurrentLocation();
		isKingReward = getKingRewardStatus();
		baitQuantity = getBaitQuantity();
		nextActiveTime = GetHornTime();

		if (nextActiveTime === "" || isNaN(nextActiveTime)) {
			// fail to retrieve data, might be due to slow network

			// reload the page to see it fix the problem
			window.setTimeout(function () { reloadWithMessage("Fail to retrieve data. Reloading...", false); }, 5000);
		}
		else {
			// got the timer right!

			// calculate the delay
			hornTimeDelay = hornTimeDelayMin + Math.round(Math.random() * (hornTimeDelayMax - hornTimeDelayMin));

			if (!aggressiveMode) {
				// calculation base on the js in Mousehunt
				var additionalDelayTime = Math.ceil(nextActiveTime * 0.1);
				if (timerInterval !== "" && !isNaN(timerInterval) && timerInterval == 1) {
					additionalDelayTime = 2;
				}

				// safety mode, include extra delay like time in horn image appear
				//hornTime = nextActiveTime + additionalDelayTime + hornTimeDelay;
				hornTime = nextActiveTime + hornTimeDelay;
				lastDateRecorded = undefined;
				lastDateRecorded = new Date();

				additionalDelayTime = undefined;
			}
			else {
				// aggressive mode, no extra delay like time in horn image appear
				hornTime = nextActiveTime;
				lastDateRecorded = undefined;
				lastDateRecorded = new Date();
			}
		}

		// get trap check time
		CalculateNextTrapCheckInMinute();
		eventLocationCheck('retrieveData()');
		mapHunting();
	}
	catch (e) {
		console.perror('retrieveData',e);
	}
}

function checkJournalDate() {
    var reload = false;

    var journalDateDiv = document.getElementsByClassName('journaldate');
    if (journalDateDiv) {
        var journalDateStr = journalDateDiv[0].innerHTML.toString();
        var midIndex = journalDateStr.indexOf(":", 0);
        var spaceIndex = journalDateStr.indexOf(" ", midIndex);

        if (midIndex >= 1) {
            var hrStr = journalDateStr.substring(0, midIndex);
            var minStr = journalDateStr.substr(midIndex + 1, 2);
            var hourSysStr = journalDateStr.substr(spaceIndex + 1, 2);

            var nowDate = new Date();
            var lastHuntDate = new Date();
            if (hourSysStr == "am") {
                lastHuntDate.setHours(parseInt(hrStr), parseInt(minStr), 0, 0);
            }
            else {
                lastHuntDate.setHours(parseInt(hrStr) + 12, parseInt(minStr), 0, 0);
            }
            if (parseInt(nowDate - lastHuntDate) / 1000 > 900) {
                reload = true;
            }
            hrStr = undefined;
            minStr = undefined;
            nowDate = undefined;
            lastHuntDate = undefined;
        }
        else {
            reload = true;
        }

        journalDateStr = undefined;
        midIndex = undefined;
        spaceIndex = undefined;
    }
    journalDateDiv = undefined;

    if (reload) {
        reloadWithMessage("Timer error. Try reload to fix.", true);
    }

    try {
        return (reload);
    }
    finally {
        reload = undefined;
    }
}

function action() {
    if (isKingReward) {
        kingRewardAction();
    }
    else if (pauseAtInvalidLocation && (huntLocation != currentLocation)) {
        // update timer
        displayTimer("Out of pre-defined hunting location...", "Out of pre-defined hunting location...", "Out of pre-defined hunting location...");

        if (fbPlatform) {
            if (secureConnection) {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            }
            else {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            }
        }
        else if (hiFivePlatform) {
            if (secureConnection) {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            }
            else {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            }
        }
        else if (mhPlatform) {
            if (secureConnection) {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            }
            else {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            }
        }

        displayKingRewardSumTime(null);

        // pause script
    }
    else if (baitQuantity === 0) {
        // update timer
        displayTimer("No more cheese!", "Cannot hunt without the cheese...", "Cannot hunt without the cheese...");
        displayLocation(huntLocation);
        displayKingRewardSumTime(null);

        // pause the script
    }
    else {
        // update location
        displayLocation(huntLocation);

        var isHornSounding = false;

        // check if the horn image is visible
        var headerElement = (isNewUI) ? document.getElementById('mousehuntHud').firstChild : document.getElementById('header');
        if (headerElement) {
            var headerStatus = headerElement.getAttribute('class');
			headerStatus = headerStatus.toLowerCase();
            if (headerStatus.indexOf("hornready") != -1) {
                // if the horn image is visible, why do we need to wait any more, sound the horn!
                soundHorn();

                // make sure the timer don't run twice!
                isHornSounding = true;
            }
            headerStatus = undefined;
        }
        headerElement = undefined;

        if (isHornSounding === false) {
            // start timer
            window.setTimeout(function () { countdownTimer(); }, timerRefreshInterval * 1000);
        }

        isHornSounding = undefined;
		eventLocationCheck('action()');
		mapHunting();
    }
}

function countdownTimer() {
	try {
		if (isKingReward) {
			// update timer
			displayTimer("King's Reward!", "King's Reward!", "King's Reward");
			displayKingRewardSumTime("Now");

			// record last king's reward time
			var nowDate = new Date();
			setStorage("lastKingRewardDate", nowDate.toString());
			nowDate = undefined;
			lastKingRewardSumTime = 0;

			// reload the page so that the sound can be play
			// simulate mouse click on the camp button
			fireEvent(document.getElementsByClassName(strCampButton)[0].firstChild, 'click');

			// reload the page if click on camp button fail
			window.setTimeout(function () { reloadWithMessage("Fail to click on camp button. Reloading...", false); }, 5000);
		}
		else if (pauseAtInvalidLocation && (huntLocation != currentLocation)) {
			// update timer
			displayTimer("Out of pre-defined hunting location...", "Out of pre-defined hunting location...", "Out of pre-defined hunting location...");
			if (fbPlatform) {
				if (secureConnection) {
					displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
				}
				else {
					displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
				}
			}
			else if (hiFivePlatform) {
				if (secureConnection) {
					displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
				}
				else {
					displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
				}
			}
			else if (mhPlatform) {
				if (secureConnection) {
					displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
				}
				else {
					displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
				}
			}
			displayKingRewardSumTime(null);

			// pause script
		}
		else if (baitQuantity === 0) {
			// update timer
			displayTimer("No more cheese!", "Cannot hunt without the cheese...", "Cannot hunt without the cheese...");
			displayLocation(huntLocation);
			displayKingRewardSumTime(null);

			// pause the script
		}
		else {
			var dateNow = new Date();
			var intervalTime = timeElapsed(lastDateRecorded, dateNow);
			lastDateRecorded = undefined;
			lastDateRecorded = dateNow;
			dateNow = undefined;

			if (enableTrapCheck) checkTime -= intervalTime;
			
			// update time
			hornTime -= intervalTime;
			if (lastKingRewardSumTime != -1) {
				lastKingRewardSumTime += intervalTime;
			}
			
			intervalTime = undefined;

			if (hornTime <= 0) {
				// blow the horn!
				hornTime = 0;
				if(getBaitQuantity() > 0)
					soundHorn();
				else
					displayTimer("No more cheese!", "Cannot hunt without the cheese...", "Cannot hunt without the cheese...");
			}
			else if (enableTrapCheck && checkTime <= 0) {
				// trap check!
				trapCheck();
			}
			else {
				if (enableTrapCheck) {
					// update timer
					if (!aggressiveMode) {
						displayTimer("Horn: " + timeformat(hornTime) + " | Check: " + timeformat(checkTime),
							timeformat(hornTime) + "  <i>(included extra " + timeformat(hornTimeDelay) + " delay & +/- 5 seconds different from MouseHunt timer)</i>",
							timeformat(checkTime) + "  <i>(included extra " + timeformat(checkTimeDelay) + " delay)</i>");
					}
					else {
						displayTimer("Horn: " + timeformat(hornTime) + " | Check: " + timeformat(checkTime),
							timeformat(hornTime) + "  <i>(lot faster than MouseHunt timer)</i>",
							timeformat(checkTime) + "  <i>(included extra " + timeformat(checkTimeDelay) + " delay)</i>");
					}
				}
				else {
					// update timer
					if (!aggressiveMode) {
						displayTimer("Horn: " + timeformat(hornTime),
							timeformat(hornTime) + "  <i>(included extra " + timeformat(hornTimeDelay) + " delay & +/- 5 seconds different from MouseHunt timer)</i>",
							"-");

						// check if user manaually sounded the horn
						var scriptNode = document.getElementById("scriptNode");
						if (scriptNode) {
							var isHornSounded = scriptNode.getAttribute("soundedHornAtt");
							if (isHornSounded == "true") {
								// sound horn function do the rest
								soundHorn();

								// stop loopping
								return;
							}
							isHornSounded = undefined;
						}
						scriptNode = undefined;
					}
					else {
						displayTimer("Horn: " + timeformat(hornTime),
							timeformat(hornTime) + "  <i>(lot faster than MouseHunt timer)</i>",
							"-");

						// agressive mode should sound the horn whenever it is possible to do so.
						var headerElement = (isNewUI) ? document.getElementById('mousehuntHud').firstChild : document.getElementById('header');
						if (headerElement) {
							var headerStatus = headerElement.getAttribute('class');
							headerStatus = headerStatus.toLowerCase();
							// the horn image appear before the timer end
							if (headerStatus.indexOf("hornready") != -1) {
								// who care, blow the horn first!
								soundHorn();

								headerElement = undefined;

								// skip all the code below
								return;
							}
						}
						headerElement = undefined;
					}
				}

				// set king reward sum time
				displayKingRewardSumTime(timeFormatLong(lastKingRewardSumTime));

				window.setTimeout(function () { (countdownTimer)(); }, timerRefreshInterval * 1000);
			}
		}
	}
	catch (e) {
		console.perror('countdownTimer',e);
	}
}

function reloadPage(soundHorn) {
    // reload the page
    if (fbPlatform) {
        // for Facebook only

        if (secureConnection) {
            if (soundHorn) {
                window.location.href = "https://www.mousehuntgame.com/canvas/turn.php";
            }
            else {
                window.location.href = "https://www.mousehuntgame.com/canvas/";
            }
        }
        else {
            if (soundHorn) {
                window.location.href = "http://www.mousehuntgame.com/canvas/turn.php";
            }
            else {
                window.location.href = "http://www.mousehuntgame.com/canvas/";
            }
        }
    }
    else if (hiFivePlatform) {
        // for Hi5 only

        if (secureConnection) {
            if (soundHorn) {
                window.location.href = "https://mousehunt.hi5.hitgrab.com/turn.php";
            }
            else {
                window.location.href = "https://mousehunt.hi5.hitgrab.com/";
            }
        }
        else {
            if (soundHorn) {
                window.location.href = "http://mousehunt.hi5.hitgrab.com/turn.php";
            }
            else {
                window.location.href = "http://mousehunt.hi5.hitgrab.com/";
            }
        }
    }
    else if (mhPlatform) {
        // for mousehunt game only

        if (secureConnection) {
            if (soundHorn) {
                window.location.href = "https://www.mousehuntgame.com/turn.php";
            }
            else {
                window.location.href = "https://www.mousehuntgame.com/";
            }
        }
        else {
            if (soundHorn) {
                window.location.href = "http://www.mousehuntgame.com/turn.php";
            }
            else {
                window.location.href = "http://www.mousehuntgame.com/";
            }
        }
    }

    soundHorn = undefined;
}

function reloadWithMessage(msg, soundHorn) {
    // display the message
    displayTimer(msg, msg, msg, msg);

    // reload the page
    reloadPage(soundHorn);

    msg = undefined;
    soundHorn = undefined;
}

// ################################################################################################
//   Timer Function - Start
// ################################################################################################

function embedTimer(targetPage) {
    if (showTimerInPage) {
        var headerElement;
        if (fbPlatform || hiFivePlatform || mhPlatform) {
            headerElement = document.getElementById('noscript');
        }
        else if (mhMobilePlatform) {
            headerElement = document.getElementById('mobileHorn');
        }

        if (headerElement) {
            var timerDivElement = document.createElement('div');

            var hr1Element = document.createElement('hr');
            timerDivElement.appendChild(hr1Element);
            hr1Element = null;

            // show bot title and version
            var titleElement = document.createElement('div');
            titleElement.setAttribute('id', 'titleElement');
            if (targetPage && aggressiveMode) {
                titleElement.innerHTML = "<a href=\"http://devcnn.wordpress.com\" target=\"_blank\"><b>MouseHunt AutoBot (version " + scriptVersion + ")</b></a> - <font color='red'>Aggressive Mode</font>";
            }
			else if (targetPage && browser != 'chrome')
				titleElement.innerHTML = "<a href=\"http://devcnn.wordpress.com\" target=\"_blank\"><b>MouseHunt AutoBot (version " + scriptVersion + ")</b></a> - <font color='red'><b>Pls use Chrome browser for fully working features</b></font>";
            else {
                titleElement.innerHTML = "<a href=\"http://devcnn.wordpress.com\" target=\"_blank\"><b>MouseHunt AutoBot (version " + scriptVersion + ")</b></a>";
            }
            timerDivElement.appendChild(titleElement);
            titleElement = null;

            if (targetPage) {
                nextHornTimeElement = document.createElement('div');
                nextHornTimeElement.setAttribute('id', 'nextHornTimeElement');
                nextHornTimeElement.innerHTML = "<b>Next Hunter Horn Time:</b> Loading...";
                timerDivElement.appendChild(nextHornTimeElement);

                checkTimeElement = document.createElement('div');
                checkTimeElement.setAttribute('id', 'checkTimeElement');
                checkTimeElement.innerHTML = "<b>Next Trap Check Time:</b> Loading...";
                timerDivElement.appendChild(checkTimeElement);

                if (pauseAtInvalidLocation) {
                    // location information only display when enable this feature
                    travelElement = document.createElement('div');
                    travelElement.setAttribute('id', 'travelElement');
                    travelElement.innerHTML = "<b>Target Hunt Location:</b> Loading...";
                    timerDivElement.appendChild(travelElement);
                }

                var lastKingRewardDate = getStorage("lastKingRewardDate");
                var lastDateStr;
                if (isNullOrUndefined(lastKingRewardDate)) {
                    lastDateStr = "-";
                }
                else {
                    var lastDate = new Date(lastKingRewardDate);
                    lastDateStr = lastDate.toDateString() + " " + lastDate.toTimeString().substring(0, 8);
                    lastDate = null;
                }

                kingTimeElement = document.createElement('div');
                kingTimeElement.setAttribute('id', 'kingTimeElement');
                kingTimeElement.innerHTML = "<b>Last King's Reward:</b> " + lastDateStr + " ";
                timerDivElement.appendChild(kingTimeElement);

                lastKingRewardSumTimeElement = document.createElement('font');
                lastKingRewardSumTimeElement.setAttribute('id', 'lastKingRewardSumTimeElement');
                lastKingRewardSumTimeElement.innerHTML = "(Loading...)";
                kingTimeElement.appendChild(lastKingRewardSumTimeElement);

                lastKingRewardDate = null;
                lastDateStr = null;

                if (showLastPageLoadTime) {
                    var nowDate = new Date();

                    // last page load time
                    var loadTimeElement = document.createElement('div');
                    loadTimeElement.setAttribute('id', 'loadTimeElement');
                    loadTimeElement.innerHTML = "<b>Last Page Load: </b>" + nowDate.toDateString() + " " + nowDate.toTimeString().substring(0, 8);
                    timerDivElement.appendChild(loadTimeElement);

                    loadTimeElement = null;
                    nowDate = null;
                }
            }
            else {
                // player currently navigating other page instead of hunter camp
                var helpTextElement = document.createElement('div');
                helpTextElement.setAttribute('id', 'helpTextElement');
                if (fbPlatform) {
                    if (secureConnection) {
                        helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='https://www.mousehuntgame.com/canvas/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                    }
                    else {
                        helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='http://www.mousehuntgame.com/canvas/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                    }
                }
                else if (hiFivePlatform) {
                    if (secureConnection) {
                        helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='https://mousehunt.hi5.hitgrab.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                    }
                    else {
                        helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='http://mousehunt.hi5.hitgrab.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                    }
                }
                else if (mhPlatform) {
                    if (secureConnection) {
                        helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='https://www.mousehuntgame.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                    }
                    else {
                        helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='http://www.mousehuntgame.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                    }
                }
                else if (mhMobilePlatform) {
                    if (secureConnection) {
                        helpTextElement.innerHTML = "<b>Note:</b> Mobile version of Mousehunt is not supported currently. Please use the <a href='https://www.mousehuntgame.com/?switch_to=standard'>standard version of MouseHunt</a>.";
                    }
                    else {
                        helpTextElement.innerHTML = "<b>Note:</b> Mobile version of Mousehunt is not supported currently. Please use the <a href='http://www.mousehuntgame.com/?switch_to=standard'>standard version of MouseHunt</a>.";
                    }
                }
                timerDivElement.appendChild(helpTextElement);

                helpTextElement = null;
            }

            var showPreference = getStorage('showPreference');
			if (isNullOrUndefined(showPreference)) {
                showPreference = false;
                setStorage("showPreference", showPreference);
            }

            var showPreferenceLinkDiv = document.createElement('div');
            showPreferenceLinkDiv.setAttribute('id', 'showPreferenceLinkDiv');
            showPreferenceLinkDiv.setAttribute('style', 'text-align:right');
            timerDivElement.appendChild(showPreferenceLinkDiv);

            var showPreferenceSpan = document.createElement('span');
			var showPreferenceLinkStr = '<a id="showPreferenceLink" name="showPreferenceLink" onclick="\
				if (document.getElementById(\'showPreferenceLink\').innerHTML == \'<b>[Hide Preference]</b>\'){\
					document.getElementById(\'preferenceDiv\').style.display=\'none\';\
					document.getElementById(\'showPreferenceLink\').innerHTML=\'<b>[Show Preference]</b>\';\
				}\
				else{\
					setLocalToSession();\
					var selectedAlgo = window.sessionStorage.getItem(\'eventLocation\');\
					showOrHideTr(selectedAlgo);\
					document.getElementById(\'preferenceDiv\').style.display=\'block\';\
					document.getElementById(\'showPreferenceLink\').innerHTML=\'<b>[Hide Preference]</b>\';\
					document.getElementById(\'eventAlgo\').value = selectedAlgo;\
				}\
				">';
            if (showPreference === true)
                showPreferenceLinkStr += '<b>[Hide Preference]</b>';
            else
                showPreferenceLinkStr += '<b>[Show Preference]</b>';
            showPreferenceLinkStr += '</a>';
            showPreferenceLinkStr += '&nbsp;&nbsp;&nbsp;';
			var getLogPreferenceStr = '<a id="idGetLogAndPreference" name="GetLogAndPreference" title="Click to get saved log & preference" onclick="onIdGetLogPreferenceClicked();">';
			getLogPreferenceStr += '<b>[Get Log & Preference]</b></a>&nbsp;&nbsp;&nbsp;';
			var clearTrapListStr = '<a id="clearTrapList" name="clearTrapList" title="Click to clear trap list from localStorage and trap list will be updated on the next arming by script" onclick="\
				window.localStorage.removeItem(\'TrapListWeapon\');\
				window.localStorage.removeItem(\'TrapListBase\');\
				window.localStorage.removeItem(\'TrapListTrinket\');\
				window.localStorage.removeItem(\'TrapListBait\');\
				document.getElementById(\'clearTrapList\').getElementsByTagName(\'b\')[0].innerHTML = \'[Done!]\';\
				window.setTimeout(function () { document.getElementById(\'clearTrapList\').getElementsByTagName(\'b\')[0].innerHTML = \'[Clear Trap List]\'; }, 1000);\
				">';
			clearTrapListStr += '<b>[Clear Trap List]</b></a>&nbsp;&nbsp;&nbsp;';
            showPreferenceSpan.innerHTML = getLogPreferenceStr + clearTrapListStr + showPreferenceLinkStr;
            showPreferenceLinkDiv.appendChild(showPreferenceSpan);
            showPreferenceLinkStr = null;
            showPreferenceSpan = null;
            showPreferenceLinkDiv = null;

            var hr2Element = document.createElement('hr');
            timerDivElement.appendChild(hr2Element);
            hr2Element = null;

			var temp = "";
			var preferenceHTMLStr = '<table border="0" width="100%">';
			preferenceHTMLStr += '<tr>';
			preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
			preferenceHTMLStr += '<a title="Bot aggressively by ignore all safety measure such as check horn image visible before sounding it"><b>Aggressive Mode</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="AggressiveModeInput" onchange="var isDisable = (value == \'true\') ? \'disabled\' : \'\'; document.getElementById(\'HornTimeDelayMinInput\').disabled=isDisable; document.getElementById(\'HornTimeDelayMaxInput\').disabled=isDisable;">';
			if (aggressiveMode) {
				preferenceHTMLStr += '<option value="false">False</option>';
				preferenceHTMLStr += '<option value="true" selected>True</option>';
				temp = 'disabled';
			}
			else {
				preferenceHTMLStr += '<option value="false" selected>False</option>';
				preferenceHTMLStr += '<option value="true">True</option>';
				temp = '';
			}
			preferenceHTMLStr += '</select>&nbsp;&nbsp;<a title="Extra delay time before sounding the horn (in seconds)"><b>Delay:</b></a>&emsp;';
			preferenceHTMLStr += '<input type="number" id="HornTimeDelayMinInput" min="0" max="360" size="5" value="' + hornTimeDelayMin.toString() + '" ' + temp + '> seconds ~ ';
			preferenceHTMLStr += '<input type="number" id="HornTimeDelayMaxInput" min="1" max="361" size="5" value="' + hornTimeDelayMax.toString() + '" ' + temp + '> seconds';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr>';
			preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
			preferenceHTMLStr += '<a title="Enable trap check once an hour"><b>Trap Check</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="TrapCheckInput" onchange="var isDisable = (value == \'false\') ? \'disabled\' : \'\'; document.getElementById(\'TrapCheckTimeDelayMinInput\').disabled=isDisable; document.getElementById(\'TrapCheckTimeDelayMaxInput\').disabled=isDisable;">';
			if (enableTrapCheck) {
				preferenceHTMLStr += '<option value="false">False</option>';
				preferenceHTMLStr += '<option value="true" selected>True</option>';
				temp = '';
			}
			else {
				preferenceHTMLStr += '<option value="false" selected>False</option>';
				preferenceHTMLStr += '<option value="true">True</option>';
				temp = 'disabled';
			}
			preferenceHTMLStr += '</select>&nbsp;&nbsp;<a title="Extra delay time to trap check (in seconds)"><b>Delay:</b></a>&emsp;';
			preferenceHTMLStr += '<input type="number" id="TrapCheckTimeDelayMinInput" min="0" max="360" size="5" value="' + checkTimeDelayMin.toString() + '" ' + temp + '> seconds ~ ';
			preferenceHTMLStr += '<input type="number" id="TrapCheckTimeDelayMaxInput" min="1" max="361" size="5" value="' + checkTimeDelayMax.toString() + '" ' + temp + '> seconds';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr>';
			preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
			preferenceHTMLStr += '<a title="Play sound when encounter king\'s reward"><b>Play King Reward Sound</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="PlayKingRewardSoundInput" >';
			if (isKingWarningSound) {
				preferenceHTMLStr += '<option value="false">False</option>';
				preferenceHTMLStr += '<option value="true" selected>True</option>';
			}
			else {
				preferenceHTMLStr += '<option value="false" selected>False</option>';
				preferenceHTMLStr += '<option value="true">True</option>';
			}
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '</tr>';
			
            preferenceHTMLStr += '<tr>';
			preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
			preferenceHTMLStr += '<a title="Solve King Reward automatically"><b>Auto Solve King Reward</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="AutoSolveKRInput" onchange="var isDisable = (value == \'false\') ? \'disabled\' : \'\'; document.getElementById(\'AutoSolveKRDelayMinInput\').disabled=isDisable; document.getElementById(\'AutoSolveKRDelayMaxInput\').disabled=isDisable;">';
			if (isAutoSolve) {
				preferenceHTMLStr += '<option value="false">False</option>';
				preferenceHTMLStr += '<option value="true" selected>True</option>';
				temp = '';
			}
			else {
				preferenceHTMLStr += '<option value="false" selected>False</option>';
				preferenceHTMLStr += '<option value="true">True</option>';
				temp = 'disabled';
			}
			preferenceHTMLStr += '</select>&nbsp;&nbsp;<a title="Extra delay time to solve King Reward (in seconds)"><b>Delay:</b></a>&emsp;';
			preferenceHTMLStr += '<input type="number" id="AutoSolveKRDelayMinInput" min="0" max="360" size="5" value="' + krDelayMin.toString() + '" ' + temp + '> seconds ~ ';
			preferenceHTMLStr += '<input type="number" id="AutoSolveKRDelayMaxInput" min="1" max="361" size="5" value="' + krDelayMax.toString() + '" ' + temp + '> seconds';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr>';
			preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
			preferenceHTMLStr += '<a title="Save King Reward image into localStorage"><b>Save King Reward Image</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="SaveKRImageInput" >';
			if (saveKRImage) {
				preferenceHTMLStr += '<option value="false">False</option>';
				preferenceHTMLStr += '<option value="true" selected>True</option>';
			}
			else {
				preferenceHTMLStr += '<option value="false" selected>False</option>';
				preferenceHTMLStr += '<option value="true">True</option>';
			}
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr>';
			preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
			preferenceHTMLStr += '<a title="View Saved King Reward Image from localStorage"><b>View King Reward Image</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="viewKR">';
			var replaced = "";
			temp = [];
			var nTimezoneOffset = -(new Date().getTimezoneOffset()) * 60000;
			var count = 1;
			var maxLen = keyKR.length.toString().length;
			for(var i=0;i<keyKR.length;i++){
				if (keyKR[i].indexOf("KR" + separator) > -1){
					temp = keyKR[i].split(separator);
					temp.splice(0,1);
					temp[0] = parseInt(temp[0]);
					if (Number.isNaN(temp[0]))
						temp[0] = 0;
					
					temp[0] += nTimezoneOffset;
					temp[0] = (new Date(temp[0])).toISOString();
					replaced = temp.join("&nbsp;&nbsp;");
					temp = count.toString();
					while(temp.length < maxLen){
						temp = '0' + temp;
					}
					replaced = temp + '. ' + replaced;
					preferenceHTMLStr += '<option value="' + keyKR[i] +'"' + ((i == keyKR.length - 1) ? ' selected':'') + '>' + replaced +'</option>';
					count++;
				}
			}
            preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<input type="button" id="buttonViewKR" value="View" onclick="var value = window.localStorage.getItem(document.getElementById(\'viewKR\').value); if(value.indexOf(\'data:image/png;base64,\') > -1 || value.indexOf(\'i.imgur.com\') > -1){ var win = window.open(value, \'_blank\'); if(win) win.focus(); else alert(\'Please allow popups for this site\'); }">';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr>';
			preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
			preferenceHTMLStr += '<a title="The script will pause if player at different location that hunt location set before"><b>Remember Location</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="PauseLocationInput" >';
			if (pauseAtInvalidLocation) {
				preferenceHTMLStr += '<option value="false">False</option>';
				preferenceHTMLStr += '<option value="true" selected>True</option>';
			}
			else {
				preferenceHTMLStr += '<option value="false" selected>False</option>';
				preferenceHTMLStr += '<option value="true">True</option>';
			}
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;" colspan="2">';
            preferenceHTMLStr += '(Changes above this line only take place after user save the preference) ';
            preferenceHTMLStr += '<input type="button" id="PreferenceSaveInput" value="Save" onclick="\
				window.localStorage.setItem(\'AggressiveMode\', 		document.getElementById(\'AggressiveModeInput\').value);\
				window.localStorage.setItem(\'HornTimeDelayMin\', 		document.getElementById(\'HornTimeDelayMinInput\').value);\
				window.localStorage.setItem(\'HornTimeDelayMax\', 		document.getElementById(\'HornTimeDelayMaxInput\').value);\
				window.localStorage.setItem(\'TrapCheck\', 				document.getElementById(\'TrapCheckInput\').value);\
				window.localStorage.setItem(\'TrapCheckTimeDelayMin\',	document.getElementById(\'TrapCheckTimeDelayMinInput\').value);\
				window.localStorage.setItem(\'TrapCheckTimeDelayMax\', 	document.getElementById(\'TrapCheckTimeDelayMaxInput\').value);\
				window.localStorage.setItem(\'PlayKingRewardSound\', 	document.getElementById(\'PlayKingRewardSoundInput\').value);\
				window.localStorage.setItem(\'AutoSolveKR\', 			document.getElementById(\'AutoSolveKRInput\').value);\
				window.localStorage.setItem(\'AutoSolveKRDelayMin\', 	document.getElementById(\'AutoSolveKRDelayMinInput\').value);\
				window.localStorage.setItem(\'AutoSolveKRDelayMax\', 	document.getElementById(\'AutoSolveKRDelayMaxInput\').value);\
				window.localStorage.setItem(\'SaveKRImage\', 			document.getElementById(\'SaveKRImageInput\').value);\
				window.localStorage.setItem(\'PauseLocation\', 			document.getElementById(\'PauseLocationInput\').value);\
				for(var i=0;i<window.sessionStorage.length;i++){\
					window.sessionStorage.removeItem(window.sessionStorage.key(i));\
				}\
				';
            if (fbPlatform) {
                if (secureConnection)
                    temp = 'window.location.href=\'https://www.mousehuntgame.com/canvas/\';';
                else
                    temp = 'window.location.href=\'http://www.mousehuntgame.com/canvas/\';';
            }
            else if (hiFivePlatform) {
                if (secureConnection)
                    temp = 'window.location.href=\'https://www.mousehunt.hi5.hitgrab.com/\';';
                else
                    temp = 'window.location.href=\'http://www.mousehunt.hi5.hitgrab.com/\';';
            }
            else if (mhPlatform) {
                if (secureConnection)
                    temp = 'window.location.href=\'https://www.mousehuntgame.com/\';';
                else
                    temp = 'window.location.href=\'http://www.mousehuntgame.com/\';';
            }
            preferenceHTMLStr += temp + '"/>&nbsp;&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px" colspan="2">';
            preferenceHTMLStr += '<div style="width: 100%; height: 1px; background: #000000; overflow: hidden;">';
            preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Turn on/off Map Hunting feature"><b>Season 4 Map Hunting</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectMapHunting" onChange="onSelectMapHuntingChanged();">';
            preferenceHTMLStr += '<option value="false">False</option>';
			preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trUncaughtMouse" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Click button Get to retrieve all uncaught mouse"><b>Uncaught Mouse</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectMouseList"></select>';
			preferenceHTMLStr += '<input type="button" id="inputSelectMouse" title="Click to select the mouse from the left dropdown list" value="Select This Mouse" onclick="onInputSelectMouse();" disabled>&nbsp;&nbsp;';
			preferenceHTMLStr += '<input type="button" id="inputGetMouse" title="Click to Get all uncaught mouse from treasure map" value="Refresh Uncaught Mouse List" onclick="onInputGetMouse();">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trSelectedUncaughtMouse" style="display:none;">';
			preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select desired uncaught mouse"><b>Selected Mouse</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
			preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<input type="text" id="inputUncaughtMouse" value="" disabled>&nbsp;&nbsp;';
			preferenceHTMLStr += '<input type="button" id="inputClearUncaughtMouse" title="Click to clear the selected mouse" value="Clear" onclick="onInputClearUncaughtMouse();">';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trCatchLogic" style="display:none;">';
			preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select desired catch logic"><b>Catch Logic</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
			preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="selectCatchLogic" onchange="onSelectCatchLogicChanged();">';
			preferenceHTMLStr += '<option value="OR">When either one of the Selected Mouse was caught</option>';
			preferenceHTMLStr += '<option value="AND">When all of the Selected Mouse were caught</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trMapHuntingTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select trap setup after a mouse was caught"><b>After Caught</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectWeapon" style="width: 75px" onchange="onSelectWeaponChanged();">';
			preferenceHTMLStr += '<option value="Remain">Remain</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectBase" style="width: 75px" onchange="onSelectBaseChanged();">';
			preferenceHTMLStr += '<option value="Remain">Remain</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectTrinket" style="width: 75px" onchange="onSelectTrinketChanged();">';
			preferenceHTMLStr += '<option value="Remain">Remain</option>';
			preferenceHTMLStr += '<option value="None">None</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectBait" style="width: 75px" onchange="onSelectBaitChanged();">';
			preferenceHTMLStr += '<option value="Remain">Remain</option>';
			preferenceHTMLStr += '<option value="None">None</option>';
			preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

			preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px" colspan="2">';
            preferenceHTMLStr += '<div style="width: 100%; height: 1px; background: #FFFFFF; overflow: hidden;">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select the script algorithm based on certain event / location"><b>Event or Location</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="eventAlgo" onChange="window.sessionStorage.setItem(\'eventLocation\', value); showOrHideTr(value);">';
            preferenceHTMLStr += '<option value="None" selected>None</option>';
			preferenceHTMLStr += '<option value="All LG Area">All LG Area</option>';
			preferenceHTMLStr += '<option value="BC/JOD">BC => JOD</option>';
			preferenceHTMLStr += '<option value="Burroughs Rift(Red)">Burroughs Rift(Red)</option>';
			preferenceHTMLStr += '<option value="Burroughs Rift(Green)">Burroughs Rift(Green)</option>';
			preferenceHTMLStr += '<option value="Burroughs Rift(Yellow)">Burroughs Rift(Yellow)</option>';
			preferenceHTMLStr += '<option value="Burroughs Rift Custom">Burroughs Rift Custom</option>';
            preferenceHTMLStr += '<option value="Charge Egg 2016 Medium + High">Charge Egg 2016 Medium + High</option>';
            preferenceHTMLStr += '<option value="Charge Egg 2016 High">Charge Egg 2016 High</option>';
			preferenceHTMLStr += '<option value="FG/AR">FG => AR</option>';
			preferenceHTMLStr += '<option value="Fiery Warpath">Fiery Warpath</option>';
			preferenceHTMLStr += '<option value="Furoma Rift">Furoma Rift</option>';
			preferenceHTMLStr += '<option value="Halloween 2015">Halloween 2015</option>';
			preferenceHTMLStr += '<option value="Labyrinth">Labyrinth</option>';
            preferenceHTMLStr += '<option value="Gnawnian Express(Hoard)">Gnawnian Express(Hoard)</option>';
            preferenceHTMLStr += '<option value="Gnawnian Express(Load)">Gnawnian Express(Load)</option>';
			preferenceHTMLStr += '<option value="SG/ZT">Seasonal Garden</option>';
			preferenceHTMLStr += '<option value="Sunken City">Sunken City</option>';
			preferenceHTMLStr += '<option value="Sunken City Custom">Sunken City Custom</option>';
			preferenceHTMLStr += '<option value="Test">Test</option>';
			preferenceHTMLStr += '<option value="Zokor">Zokor</option>';
            preferenceHTMLStr += '<option value="Zugzwang Tower">Zugzwang Tower</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trFREnterBattery" style="display:none;">';
			preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select which battery level to enter Pagoda"><b>Enter at Battery</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
			preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="selectEnterAtBattery" onchange="onSelectEnterAtBattery();">';
			for(var i=1;i<=10;i++)
				preferenceHTMLStr += '<option value="' + i + '">' + i + '</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trFRRetreatBattery" style="display:none;">';
			preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select which battery level to retreat from  Pagoda"><b>Retreat at Battery</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
			preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="selectRetreatAtBattery" onchange="onSelectRetreatAtBattery();">';
			for(var i=0;i<=10;i++)
				preferenceHTMLStr += '<option value="' + i + '">' + i + '</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trFRTrapSetupAtBattery" style="display:none;">';
			preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select trap setup for each battery"><b>Trap Setup at Battery</b></a>&nbsp;&nbsp;';
			preferenceHTMLStr += '<select id="selectTrapSetupAtBattery" onchange="onSelectTrapSetupAtBattery();">';
			for(var i=0;i<=10;i++)
				preferenceHTMLStr += '<option value="' + i + '">' + i + '</option>';
			preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="selectFRTrapWeapon" onchange="onSelectFRTrapWeaponChanged();">';
			preferenceHTMLStr += '<option value="Mysteriously unYielding">MYNORCA</option>';
			preferenceHTMLStr += '<option value="Focused Crystal Laser">FCL</option>';
			preferenceHTMLStr += '<option value="Multi-Crystal Laser">MCL</option>';
			preferenceHTMLStr += '<option value="Biomolecular Re-atomizer Trap">BRT</option>';
			preferenceHTMLStr += '<option value="Crystal Tower">CT</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectFRTrapBase" onchange="onSelectFRTrapBaseChanged();">';
			preferenceHTMLStr += '<option value="Fissure Base">Fissure</option>';
			preferenceHTMLStr += '<option value="Rift Base">Rift</option>';
			preferenceHTMLStr += '<option value="Fracture Base">Fracture</option>';
			preferenceHTMLStr += '<option value="Enerchi Induction Base">Enerchi</option>';
			preferenceHTMLStr += '<option value="Attuned Enerchi Induction Base">A. Enerchi</option>';
			preferenceHTMLStr += '<option value="Minotaur Base">Minotaur</option>';
            preferenceHTMLStr += '<option value="Tidal Base">Tidal</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectFRTrapTrinket" onchange="onSelectFRTrapTrinketChanged();">';
			preferenceHTMLStr += '<option value="Rift Ultimate Luck">Rift Ultimate Luck</option>';
			preferenceHTMLStr += '<option value="Rift Ultimate Power">Rift Ultimate Power</option>';
			preferenceHTMLStr += '<option value="Ultimate Luck">Ultimate Luck</option>';
			preferenceHTMLStr += '<option value="Ultimate Power">Ultimate Power</option>';
			preferenceHTMLStr += '<option value="Rift Power">Rift Power</option>';
			preferenceHTMLStr += '<option value="Super Rift Vacuum">Super Rift Vacuum</option>';
			preferenceHTMLStr += '<option value="Rift Vacuum">Rift Vacuum</option>';
			preferenceHTMLStr += '<option value="Enerchi">Enerchi</option>';
			preferenceHTMLStr += '<option value="Super Cactus">Super Cactus</option>';
            preferenceHTMLStr += '<option value="Extreme Wealth">Extreme Wealth</option>';
			preferenceHTMLStr += '<option value="NoAbove">None of the above</option>';
			preferenceHTMLStr += '<option value="None">None</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectFRTrapBait" onchange="onSelectFRTrapBaitChanged();">';
			preferenceHTMLStr += '<option value="Ascended">Ascended</option>';
			preferenceHTMLStr += '<option value="Null Onyx Gorgonzola">Null Onyx Gorgonzola</option>';
			preferenceHTMLStr += '<option value="Rift Rumble">Rift Rumble</option>';
			preferenceHTMLStr += '<option value="Rift Glutter">Rift Glutter</option>';
			preferenceHTMLStr += '<option value="Rift Susheese">Rift Susheese</option>';
			preferenceHTMLStr += '<option value="Rift Combat">Rift Combat</option>';
			preferenceHTMLStr += '<option value="Master Fusion">Master Fusion</option>';
			preferenceHTMLStr += '<option value="Maki String">Maki</option>';
			preferenceHTMLStr += '<option value="Magical String">Magical</option>';
			preferenceHTMLStr += '<option value="Brie String">Brie</option>';
			preferenceHTMLStr += '<option value="Swiss String">Swiss</option>';
			preferenceHTMLStr += '<option value="Marble String">Marble</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trUseZum" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select to arm Zugzwang\'s Ultimate Move whenever possible"><b>Use ZUM in</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="selectUseZUM" onChange="onSelectUseZUMChanged();">';
			preferenceHTMLStr += '<option value="None">None</option>';
			preferenceHTMLStr += '<option value="ALL">All Season</option>';
			// preferenceHTMLStr += '<option value="ZT_ONLY">ZT Only</option>';
			// preferenceHTMLStr += '<option value="SG_ZT">SG & ZT</option>';
			preferenceHTMLStr += '<option value="SPRING">Spring</option>';
			preferenceHTMLStr += '<option value="SUMMER">Summer</option>';
			preferenceHTMLStr += '<option value="FALL">Fall</option>';
			preferenceHTMLStr += '<option value="WINTER">Winter</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

			preferenceHTMLStr += '<tr id="lgArea" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select auto pour status"><b>Auto Pour</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="lgAutoPour" onChange="saveLG();">';
			preferenceHTMLStr += '<option value="false">False</option>';
			preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;<a title="Max number of salt before hunting King Grub"><b>Salt Charge:</b></a>&emsp;';
			preferenceHTMLStr += '<input type="number" id="lgSalt" min="1" max="50" size="5" value="" onchange="saveLG();">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

			preferenceHTMLStr += '<tr id="trSCCustom" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select custom algorithm"><b>SC Custom Algorithm</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="selectSCHuntZone" onChange="initControlsSCCustom();">';
			preferenceHTMLStr += '<option value="ZONE_DEFAULT">Default</option>';
			preferenceHTMLStr += '<option value="ZONE_CORAL">Coral</option>';
			preferenceHTMLStr += '<option value="ZONE_SCALE">Scale</option>';
			preferenceHTMLStr += '<option value="ZONE_BARNACLE">Barnacle</option>';
			preferenceHTMLStr += '<option value="ZONE_TREASURE">Treasure</option>';
			preferenceHTMLStr += '<option value="ZONE_DANGER">Danger</option>';
			preferenceHTMLStr += '<option value="ZONE_DANGER_PP">Danger PP</option>';
			preferenceHTMLStr += '<option value="ZONE_OXYGEN">Oxygen</option>';
			preferenceHTMLStr += '<option value="ZONE_BONUS">Bonus</option>';
            preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectSCHuntZoneEnable" onChange="onSelectSCHuntZoneEnable();">';
			preferenceHTMLStr += '<option value="true">Hunt</option>';
			preferenceHTMLStr += '<option value="false">Jet Through</option>';
            preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectSCHuntBait" onchange="onSelectSCHuntBait();">';
			preferenceHTMLStr += '<option value="Gouda">Gouda</option>';
			preferenceHTMLStr += '<option value="SUPER">SUPER|brie+</option>';
            preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectSCHuntTrinket" onchange="onSelectSCHuntTrinket();">';
			preferenceHTMLStr += '<option value="None">No Charm</option>';
			preferenceHTMLStr += '<option value="NoSC">No SC Charm</option>';
			preferenceHTMLStr += '<option value="TT">Treasure Trawling</option>';
			preferenceHTMLStr += '<option value="EAC">EAC</option>';
			preferenceHTMLStr += '<option value="scAnchorTreasure">GAC, EAC</option>';
			preferenceHTMLStr += '<option value="scAnchorDanger">SAC, EAC</option>';
			preferenceHTMLStr += '<option value="scAnchorUlti">UAC, EAC</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trSCCustomUseSmartJet" style="display:none;">';
			preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select to always use Smart Water Jet Charm"><b>Use Smart Jet</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
			preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="selectSCUseSmartJet" onchange="onSelectSCUseSmartJet();">';
			preferenceHTMLStr += '<option value="false">False</option>';
			preferenceHTMLStr += '<option value="true">True</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="labyrinth" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select a district to focus on"><b>District to Focus</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="labyrinthDistrict" onChange="saveDistrictFocus(value); loadLabyrinthHallway();">';
			preferenceHTMLStr += '<option value="None">None</option>';
			preferenceHTMLStr += '<option value="FEALTY">Fealty</option>';
			preferenceHTMLStr += '<option value="TECH">Tech</option>';
			preferenceHTMLStr += '<option value="SCHOLAR">Scholar</option>';
			preferenceHTMLStr += '<option value="TREASURY">Treasury</option>';
			preferenceHTMLStr += '<option value="FARMING">Farming</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trLabyrinthDisarm" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select to disarm cheese at X last hunt in hallway when total clues near 100"><b>Security Disarm</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="selectLabyrinthDisarm" onChange="onSelectLabyrinthDisarm();">';
			preferenceHTMLStr += '<option value="false">False</option>';
			preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;At Last&nbsp;';
			preferenceHTMLStr += '<input type="number" id="inputLabyrinthLastHunt" min="2" max="10" style="width:40px" value="2" onchange="onInputLabyrinthLastHuntChanged();">&nbsp;Hunt(s) in Hallway Near 100 Total Clues';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trLabyrinthArmOtherBase" style="display:none;">';
			preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select to arm other base if Compass Magnet Charm is currently armed"><b>Arm Other Base</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
			preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="selectLabyrinthOtherBase" style="width: 75px" onchange="onSelectLabyrinthOtherBase();">';
			preferenceHTMLStr += '<option value="false">False</option>';
			preferenceHTMLStr += '</select>&nbsp;&nbsp;If Compass Magnet Charm is armed';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trPriorities15" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select hallway priorities when focus-district clues less than 15"><b>Priorities (Focus-District Clues < 15)</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="selectHallway15Plain" onChange="saveLabyrinthHallway();">';
			preferenceHTMLStr += '<option value="lp">Long Plain Hallway First</option>';
			preferenceHTMLStr += '<option value="sp">Short Plain Hallway First</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

			preferenceHTMLStr += '<tr id="trPriorities1560" style="display:table-row;">';
			preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
			preferenceHTMLStr += '<a title="Select hallway priorities when focus-district clues within 15 and 60"><b>Priorities (15 < Focus-District Clues < 60)</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
			preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="selectHallway1560Superior" onchange="saveLabyrinthHallway();">';
			preferenceHTMLStr += '<option value="ls">Long Superior Hallway First</option>';
			preferenceHTMLStr += '<option value="ss">Short Superior Hallway First</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectHallway1560Plain" onchange="saveLabyrinthHallway();">';
			preferenceHTMLStr += '<option value="lp">Long Plain Hallway First</option>';
			preferenceHTMLStr += '<option value="sp">Short Plain Hallway First</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '</tr>';
				
			preferenceHTMLStr += '<tr id="trPriorities60" style="display:none;">';
			preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
			preferenceHTMLStr += '<a title="Select hallway priorities when focus-district clues more than 60"><b>Priorities (Focus-District Clues > 60)</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
			preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="selectHallway60Epic" onchange="saveLabyrinthHallway();">';
			preferenceHTMLStr += '<option value="le">Long Epic Hallway First</option>';
			preferenceHTMLStr += '<option value="se">Short Epic Hallway First</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectHallway60Superior" onchange="saveLabyrinthHallway();">';
			preferenceHTMLStr += '<option value="ls">Long Superior Hallway First</option>';
			preferenceHTMLStr += '<option value="ss">Short Superior Hallway First</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectHallway60Plain" onchange="saveLabyrinthHallway();">';
			preferenceHTMLStr += '<option value="lp">Long Plain Hallway First</option>';
			preferenceHTMLStr += '<option value="sp">Short Plain Hallway First</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '</td>';
			preferenceHTMLStr += '</tr>';

			preferenceHTMLStr += '<tr id="labyrinthOtherHallway" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Choose doors other than focused door when there is no available focused door to be choosen"><b>Open Non-Focus Door</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="chooseOtherDoors" onChange="\
				saveLabyrinthHallway();\
				document.getElementById(\'typeOtherDoors\').disabled = (value == \'false\') ? \'disabled\' : \'\'; ">';
			preferenceHTMLStr += '<option value="false">False</option>';
			preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;<a title="Select a choosing type for non-focused doors"><b>Choosing Type:</b></a>&emsp;';
			preferenceHTMLStr += '<select id="typeOtherDoors" onChange="saveLabyrinthHallway();">';
			preferenceHTMLStr += '<option value="SHORTEST_ONLY">Shortest Length Only</option>';
			preferenceHTMLStr += '<option value="FEWEST_ONLY">Fewest Clue Only</option>';
			preferenceHTMLStr += '<option value="SHORTEST_FEWEST">Shortest Length => Fewest Clue</option>';
			preferenceHTMLStr += '<option value="FEWEST_SHORTEST">Fewest Clue => Shortest Length </option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trZokorTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select trap setup under different boss status"><b>Trap Setup When</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="selectZokorBossStatus" onChange="onSelectZokorBossStatus();">';
			preferenceHTMLStr += '<option value="INCOMING">Boss Incoming</option>';
			preferenceHTMLStr += '<option value="ACTIVE">Boss Active</option>';
			preferenceHTMLStr += '<option value="DEFEATED">Boss Defeated</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;';
			preferenceHTMLStr += '<select id="selectZokorBait" onChange="onSelectZokorBait();">';
			preferenceHTMLStr += '<option value="Glowing Gruyere">GG</option>';
			preferenceHTMLStr += '<option value="SUPER">SB+</option>';
			preferenceHTMLStr += '<option value="Gouda">Gouda</option>';
			preferenceHTMLStr += '<option value="Brie">Brie</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;';
			preferenceHTMLStr += '<select id="selectZokorTrinket" onChange="onSelectZokorTrinket();">';
			preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trFWWave" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select FW wave"><b>Wave</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="selectFWWave" onChange="onSelectFWWaveChanged();">';
			preferenceHTMLStr += '<option value="1">1</option>';
			preferenceHTMLStr += '<option value="2">2</option>';
			preferenceHTMLStr += '<option value="3">3</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trFWFocusType" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select either Normal (Warrior, Scout, Archer) or Special (Cavalry, Mage)"><b>Soldier Type to Focus</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="selectFWFocusType" onChange="onSelectFWFocusTypeChanged();">';
			preferenceHTMLStr += '<option value="NORMAL">Normal</option>';
			preferenceHTMLStr += '<option value="SPECIAL">Special</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;<a title="Select which soldier type comes first based on population"><b>Priorities:</b></a>&emsp;';
			preferenceHTMLStr += '<select id="selectFWPriorities" onChange="onSelectFWPrioritiesChanged();">';
			preferenceHTMLStr += '<option value="HIGHEST">Highest Population First</option>';
			preferenceHTMLStr += '<option value="LOWEST">Lowest Population First</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trFWStreak" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select streak"><b>Streak</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
			preferenceHTMLStr += '<select id="selectFWStreak" onChange="onSelectFWStreakChanged();">';
			preferenceHTMLStr += '<option value="0">0</option>';
			preferenceHTMLStr += '<option value="1">1</option>';
			preferenceHTMLStr += '<option value="2">2</option>';
			preferenceHTMLStr += '<option value="3">3</option>';
			preferenceHTMLStr += '<option value="4">4</option>';
			preferenceHTMLStr += '<option value="5">5</option>';
			preferenceHTMLStr += '<option value="6">6</option>';
			preferenceHTMLStr += '<option value="7">7</option>';
			preferenceHTMLStr += '<option value="8">8</option>';
			preferenceHTMLStr += '<option value="9">9</option>';
			preferenceHTMLStr += '<option value="10">10</option>';
			preferenceHTMLStr += '<option value="11">11</option>';
			preferenceHTMLStr += '<option value="12">12</option>';
			preferenceHTMLStr += '<option value="13">13</option>';
			preferenceHTMLStr += '<option value="14">14</option>';
			preferenceHTMLStr += '<option value="15">15</option>';
            preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectFWCheese" onChange="onSelectFWCheeseChanged();">';
			preferenceHTMLStr += '<option value="Brie">Brie</option>';
			preferenceHTMLStr += '<option value="Gouda">Gouda</option>';
			preferenceHTMLStr += '<option value="SUPER">SUPER|brie+</option>';
            preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectFWCharmType" onChange="onSelectFWCharmTypeChanged();">';
			preferenceHTMLStr += '<option value="Warpath">Warpath</option>';
			preferenceHTMLStr += '<option value="Super Warpath">Super Warpath</option>';
            preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectFWSpecial" onChange="onSelectFWSpecialChanged();">';
			preferenceHTMLStr += '<option value="None">None</option>';
			preferenceHTMLStr += '<option value="COMMANDER">Commander</option>';
			preferenceHTMLStr += '<option value="GARGANTUA">Gargantua</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trFWLastType" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select config when there is only one soldier type left"><b>Last Soldier Type</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px;">';
			preferenceHTMLStr += '<select id="selectFWLastTypeConfig" onChange="onSelectFWLastTypeConfigChanged();">';
			preferenceHTMLStr += '<option value="CONFIG_STREAK">Follow Streak Config</option>';
			preferenceHTMLStr += '<option value="CONFIG_GOUDA">Gouda & No Warpath Charm</option>';
			preferenceHTMLStr += '<option value="CONFIG_UNCHANGED">Trap Setup Unchanged</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trBRConfig" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select the mist tier to hunt"><b>Hunt At</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px;">';
			preferenceHTMLStr += '<select id="selectBRHuntMistTier" onChange="onSelectBRHuntMistTierChanged();">';
			preferenceHTMLStr += '<option value="Red">Red</option>';
			preferenceHTMLStr += '<option value="Green">Green</option>';
			preferenceHTMLStr += '<option value="Yellow">Yellow</option>';
			preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;Mist Tier';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trBRToggle" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select the amount of hunt to toggle canister"><b>Toggle Canister Every</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px;">';
            preferenceHTMLStr += '<input type="number" id="ToggleCanisterInput" min="1" max="10" value="1" onchange="onInputToggleCanisterChanged();">&nbsp;&nbsp;Hunt(s)';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
			
			preferenceHTMLStr += '<tr id="trBRTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select trap setup combination for respective mist tier"><b>Trap Setup</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px;">';
			preferenceHTMLStr += '<select id="selectBRTrapWeapon" onchange="onSelectBRTrapWeaponChanged();">';
			preferenceHTMLStr += '<option value="Mysteriously unYielding">MYNORCA</option>';
			preferenceHTMLStr += '<option value="Focused Crystal Laser">FCL</option>';
			preferenceHTMLStr += '<option value="Multi-Crystal Laser">MCL</option>';
			preferenceHTMLStr += '<option value="Biomolecular Re-atomizer Trap">BRT</option>';
			preferenceHTMLStr += '<option value="Crystal Tower">CT</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectBRTrapBase" onchange="onSelectBRTrapBaseChanged();">';
			preferenceHTMLStr += '<option value="Fissure Base">Fissure</option>';
			preferenceHTMLStr += '<option value="Rift Base">Rift</option>';
			preferenceHTMLStr += '<option value="Fracture Base">Fracture</option>';
			preferenceHTMLStr += '<option value="Enerchi Induction Base">Enerchi</option>';
			preferenceHTMLStr += '<option value="Attuned Enerchi Induction Base">A. Enerchi</option>';
			preferenceHTMLStr += '<option value="Minotaur Base">Minotaur</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectBRTrapTrinket" onchange="onSelectBRTrapTrinketChanged();">';
			preferenceHTMLStr += '<option value="Rift Ultimate Luck">Rift Ultimate Luck</option>';
			preferenceHTMLStr += '<option value="Rift Ultimate Power">Rift Ultimate Power</option>';
			preferenceHTMLStr += '<option value="Ultimate Luck">Ultimate Luck</option>';
			preferenceHTMLStr += '<option value="Ultimate Power">Ultimate Power</option>';
			preferenceHTMLStr += '<option value="Rift Power">Rift Power</option>';
			preferenceHTMLStr += '<option value="Super Rift Vacuum">Super Rift Vacuum</option>';
			preferenceHTMLStr += '<option value="Rift Vacuum">Rift Vacuum</option>';
			preferenceHTMLStr += '<option value="Enerchi">Enerchi</option>';
			preferenceHTMLStr += '<option value="NoAbove">None of the above</option>';
			preferenceHTMLStr += '<option value="None">None</option>';
			preferenceHTMLStr += '</select>';
			preferenceHTMLStr += '<select id="selectBRTrapBait" onchange="onSelectBRTrapBaitChanged();">';
			preferenceHTMLStr += '<option value="Polluted Parmesan">PP</option>';
			preferenceHTMLStr += '<option value="Terre Ricotta">Terre</option>';
			preferenceHTMLStr += '<option value="Magical String">Magical</option>';
			preferenceHTMLStr += '<option value="Brie String">Brie</option>';
			preferenceHTMLStr += '<option value="Swiss String">Swiss</option>';
			preferenceHTMLStr += '<option value="Marble String">Marble</option>';
			preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

			preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;" colspan="2">';
            preferenceHTMLStr += '<input type="button" id="AlgoConfigSaveInput" title="Save changes of Event or Location without reload, take effect after current hunt" value="Apply" onclick="setSessionToLocal();">&nbsp;&nbsp;&nbsp;';
			preferenceHTMLStr += '<input type="button" id="AlgoConfigSaveReloadInput" title="Save changes of Event or Location with reload, take effect immediately" value="Apply & Reload" onclick="setSessionToLocal();' + temp + '">&nbsp;&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
            preferenceHTMLStr += '</table>';

            var preferenceDiv = document.createElement('div');
            preferenceDiv.setAttribute('id', 'preferenceDiv');
            if (showPreference === true)
                preferenceDiv.setAttribute('style', 'display: block');
            else
                preferenceDiv.setAttribute('style', 'display: none');
            preferenceDiv.innerHTML = preferenceHTMLStr;
            timerDivElement.appendChild(preferenceDiv);
            preferenceHTMLStr = null;
            showPreference = null;

            var hr3Element = document.createElement('hr');
            preferenceDiv.appendChild(hr3Element);
            hr3Element = null;
            preferenceDiv = null;

            // embed all msg to the page
            headerElement.parentNode.insertBefore(timerDivElement, headerElement);

            timerDivElement = null;
			
			var scriptElement = document.createElement("script");
			scriptElement.setAttribute('type', "text/javascript");
			scriptElement.innerHTML = functionToHTMLString(bodyJS);
			headerElement.parentNode.insertBefore(scriptElement, headerElement);
			scriptElement = null;
			
			// set KR entries color
			var nCurrent, nNext;
			var selectViewKR = document.getElementById('viewKR');
			for(var i=0;i<selectViewKR.children.length-1;i++){
				nCurrent = parseInt(selectViewKR.children[i].value.split('~')[1]);
				nNext = parseInt(selectViewKR.children[i+1].value.split('~')[1]);
				if(Math.round((nNext-nCurrent)/60000) < 2)
					selectViewKR.children[i].style = 'color:red';
			}
			
			// insert trap list
			var selectZokorTrinket = document.getElementById('selectZokorTrinket');
			var selectWeapon = document.getElementById('selectWeapon');
			var selectBase = document.getElementById('selectBase');
			var selectTrinket = document.getElementById('selectTrinket');
			var selectBait = document.getElementById('selectBait');
			var selectLabyrinthOtherBase = document.getElementById('selectLabyrinthOtherBase');
			var optionEle, optionEle2;
			for (var prop in objTrapCollection) {
				if(objTrapCollection.hasOwnProperty(prop)) {
					objTrapCollection[prop] = objTrapCollection[prop].sort();
					for(var i=0;i<objTrapCollection[prop].length;i++){
						optionEle = document.createElement("option");
						optionEle.setAttribute('value', objTrapCollection[prop][i]);
						optionEle.innerText = objTrapCollection[prop][i];
						if(prop == 'weapon'){
							if(!isNullOrUndefined(selectWeapon))
								selectWeapon.appendChild(optionEle);
						}
						else if(prop == 'base'){
							if(!isNullOrUndefined(selectBase))
								selectBase.appendChild(optionEle);
							if(!isNullOrUndefined(selectLabyrinthOtherBase)){
								optionEle2 = optionEle.cloneNode(true);
								selectLabyrinthOtherBase.appendChild(optionEle2);
							}
						}
						else if(prop == 'trinket'){
							if(!isNullOrUndefined(selectZokorTrinket))
								selectZokorTrinket.appendChild(optionEle);
							if(!isNullOrUndefined(selectTrinket)){
								optionEle2 = optionEle.cloneNode(true);
								selectTrinket.appendChild(optionEle2);
							}
						}
						else if(prop == 'bait'){
							if(!isNullOrUndefined(selectBait))
								selectBait.appendChild(optionEle);
						}
					}
				}
			}
        }
        headerElement = null;
    }

    targetPage = null;

}

function loadPreferenceSettingFromStorage() {
	aggressiveMode = getStorageToVariableBool("AggressiveMode", aggressiveMode);
	hornTimeDelayMin = getStorageToVariableInt("HornTimeDelayMin", hornTimeDelayMin);
	hornTimeDelayMax = getStorageToVariableInt("HornTimeDelayMax", hornTimeDelayMax);
	enableTrapCheck = getStorageToVariableBool("TrapCheck", enableTrapCheck);
	checkTimeDelayMin = getStorageToVariableInt("TrapCheckTimeDelayMin", checkTimeDelayMin);
	checkTimeDelayMiax = getStorageToVariableInt("TrapCheckTimeDelayMax", checkTimeDelayMax);
	isKingWarningSound = getStorageToVariableBool("PlayKingRewardSound", isKingWarningSound);
	isAutoSolve = getStorageToVariableBool("AutoSolveKR", isAutoSolve);
	krDelayMin = getStorageToVariableInt("AutoSolveKRDelayMin", krDelayMin);
	krDelayMax = getStorageToVariableInt("AutoSolveKRDelayMax", krDelayMax);
	kingsRewardRetry = getStorageToVariableInt("KingsRewardRetry", kingsRewardRetry);
	pauseAtInvalidLocation = getStorageToVariableBool("PauseLocation", pauseAtInvalidLocation);
	saveKRImage = getStorageToVariableBool("SaveKRImage", saveKRImage);
    discharge = getStorageToVariableBool("discharge", discharge);
	try{
		keyKR = [];
		var keyName = "";
		var keyRemove = [];
		var i;
		for(i = 0; i<window.localStorage.length;i++){
			keyName = window.localStorage.key(i);
			if(keyName.indexOf("KR-") > -1){ // remove old KR entries
				keyRemove.push(keyName);
			}
			else if(keyName.indexOf("KR" + separator) > -1){
				keyKR.push(keyName);
			}
		}

		for(i = 0; i<keyRemove.length;i++){
			removeStorage(keyRemove[i]);
		}

		if (keyKR.length > maxSaveKRImage){
			keyKR = keyKR.sort();
			var count = Math.floor(maxSaveKRImage / 2);
			for(i=0;i<count;i++)
				removeStorage(keyKR[i]);
		}

		// Backward compatibility of SCCustom
		var keyValue = "";
		var objSCCustomBackward = {
			zone : ['ZONE_NOT_DIVE'],
			zoneID : [0],
			isHunt : [true],
			bait : ['Gouda'],
			trinket : ['None'],
			useSmartJet : false
		};
		for (var prop in objSCZone) {
			if(objSCZone.hasOwnProperty(prop)) {
				keyName = "SCCustom_" + prop;
				keyValue = window.localStorage.getItem(keyName);
				if(!isNullOrUndefined(keyValue)){
					keyValue = keyValue.split(',');
					objSCCustomBackward.zone[objSCZone[prop]] = prop;
					objSCCustomBackward.zoneID[objSCZone[prop]] = objSCZone[prop];
					objSCCustomBackward.isHunt[objSCZone[prop]] = (keyValue[0] === 'true' || keyValue[0] === true);
					objSCCustomBackward.bait[objSCZone[prop]] = keyValue[1];
					objSCCustomBackward.trinket[objSCZone[prop]] = keyValue[2];
					removeStorage(keyName);
				}
			}
		}
		if(objSCCustomBackward.zone.length > 0)
			setStorage('SCCustom', JSON.stringify(objSCCustomBackward));
	}
	catch (e){
		console.perror('loadPreferenceSettingFromStorage',e);
	}
	getTrapList();
}

function getTrapList(category){
	var temp = "";
	var arrObjList;
	if (category === null || category === undefined)
		arrObjList = Object.keys(objTrapList);
	else
		arrObjList = [category];

	for (var i=0;i<arrObjList.length;i++){
		temp = getStorageToVariableStr("TrapList" + capitalizeFirstLetter(arrObjList[i]), "");
		if (temp === ""){
			objTrapList[arrObjList[i]] = [];
		}
		else{
			try{
				objTrapList[arrObjList[i]] = temp.split(",");
			}
			catch (e) {
				objTrapList[arrObjList[i]] = [];
			}
		}
	}
}

function clearTrapList(category){
	var arrObjList;
	if (category === null || category === undefined)
		arrObjList = Object.keys(objTrapList);
	else
		arrObjList = [category];

	for (var i=0;i<arrObjList.length;i++){
		removeStorage("TrapList" + capitalizeFirstLetter(arrObjList[i]));
		objTrapList[arrObjList[i]] = [];
	}
}

function capitalizeFirstLetter(strIn){
	return strIn.charAt(0).toUpperCase() + strIn.slice(1);
}

function getTrapListFromTrapSelector(sort, category, name, isForcedRetry){
	clickTrapSelector(category);
	objTrapList[category] = [];
	var sec = secWait;
	var retry = armTrapRetry;
	var tagGroupElement, tagElement, nameElement;
    var intervalGTLFTS = setInterval(
        function (){
            tagGroupElement = document.getElementsByClassName('tagGroup');
			if (tagGroupElement.length > 0){
				for (var i = 0; i < tagGroupElement.length; ++i){
					tagElement = tagGroupElement[i].getElementsByTagName('a');
					for (var j = 0; j < tagElement.length; ++j){
						nameElement = tagElement[j].getElementsByClassName('name')[0].innerText;
						objTrapList[category].push(nameElement);
					}
				}
				setStorage("TrapList" + capitalizeFirstLetter(category), objTrapList[category].join(","));
				clearInterval(intervalGTLFTS);
				arming = false;
				intervalGTLFTS = null;
				checkThenArm(sort, category, name, isForcedRetry);
				return;
			}
            else{
                --sec;
                if (sec <= 0){
                    clickTrapSelector(category);
                    sec = secWait;
					--retry;
					if (retry <= 0){
						clearInterval(intervalGTLFTS);
						arming = false;
						intervalGTLFTS = null;
						return;
					}
                }
            }
        }, 1000);
    return;
}

function getStorageToVariableInt(storageName, defaultInt)
{
	var temp = getStorage(storageName);
	var tempInt = defaultInt;
    if (isNullOrUndefined(temp)) {
        setStorage(storageName, defaultInt);
    }
    else {
		tempInt = parseInt(temp);
		if(Number.isNaN(tempInt))
			tempInt = defaultInt;
    }
	return tempInt;
}

function getStorageToVariableStr(storageName, defaultStr)
{
	var temp = getStorage(storageName);
    if (isNullOrUndefined(temp)) {
        setStorage(storageName, defaultStr);
        temp = defaultStr;
    }
    return temp;
}

function getStorageToVariableBool(storageName, defaultBool)
{
	var temp = getStorage(storageName);
	if (isNullOrUndefined(temp)) {
        setStorage(storageName, defaultBool.toString());
		return defaultBool;
    }
    else if (temp === true || temp.toLowerCase() == "true") {
        return true;
    }
    else {
        return false;
    }
}

function displayTimer(title, nextHornTime, checkTime) {
    if (showTimerInTitle) {
        document.title = title;
    }

    if (showTimerInPage) {
        nextHornTimeElement.innerHTML = "<b>Next Hunter Horn Time:</b> " + nextHornTime;
        checkTimeElement.innerHTML = "<b>Next Trap Check Time:</b> " + checkTime;
    }

    title = null;
    nextHornTime = null;
    checkTime = null;
}

function displayLocation(locStr) {
    if (showTimerInPage && pauseAtInvalidLocation) {
        travelElement.innerHTML = "<b>Hunt Location:</b> " + locStr;
    }

    locStr = null;
}

function displayKingRewardSumTime(timeStr) {
    if (showTimerInPage) {
        if (timeStr) {
            lastKingRewardSumTimeElement.innerHTML = "(" + timeStr + ")";
        }
        else {
            lastKingRewardSumTimeElement.innerHTML = "";
        }
    }

    timeStr = null;
}

// ################################################################################################
//   Timer Function - End
// ################################################################################################

// ################################################################################################
//   Horn Function - Start
// ################################################################################################

function soundHorn() {
	var isAtCampPage = (isNewUI)? (document.getElementById('journalContainer') !== null) : (document.getElementById('huntingTips') !== null) ;
	if (!isAtCampPage) {
		displayTimer("Not At Camp Page", "Not At Camp Page", "Not At Camp Page");
		return;
	}

	// update timer
    displayTimer("Ready to Blow The Horn...", "Ready to Blow The Horn...", "Ready to Blow The Horn...");

    var scriptNode = document.getElementById("scriptNode");
    if (scriptNode) {
        scriptNode.setAttribute("soundedHornAtt", "false");
    }
    scriptNode = null;

    if (!aggressiveMode) {
        // safety mode, check the horn image is there or not before sound the horn
        var headerElement = (isNewUI) ? document.getElementById('mousehuntHud').firstChild : document.getElementById('header');
        if (headerElement) {
            // need to make sure that the horn image is ready before we can click on it
            var headerStatus = headerElement.getAttribute('class');
			headerStatus = headerStatus.toLowerCase();
            if (headerStatus.indexOf("hornready") != -1) {
                // found the horn image, let's sound the horn!

                // update timer
                displayTimer("Blowing The Horn...", "Blowing The Horn...", "Blowing The Horn...");

                // simulate mouse click on the horn
                var hornElement = document.getElementsByClassName(strHornButton)[0].firstChild;
                fireEvent(hornElement, 'click');
                hornElement = null;

                // clean up
                headerElement = null;
                headerStatus = null;

                // double check if the horn was already sounded
                window.setTimeout(function () { afterSoundingHorn(); }, 5000);
            }
            else if (headerStatus.indexOf("hornsounding") != -1 || headerStatus.indexOf("hornsounded") != -1) {
                // some one just sound the horn...

                // update timer
                displayTimer("Synchronizing Data...", "Someone had just sound the horn. Synchronizing data...", "Someone had just sound the horn. Synchronizing data...");

                // clean up
                headerElement = null;
                headerStatus = null;

                // load the new data
                window.setTimeout(function () { afterSoundingHorn(); }, 5000);
            }
            else if (headerStatus.indexOf("hornwaiting") != -1) {
                // the horn is not appearing, let check the time again

                // update timer
                displayTimer("Synchronizing Data...", "Hunter horn is not ready yet. Synchronizing data...", "Hunter horn is not ready yet. Synchronizing data...");

                // sync the time again, maybe user already click the horn
                retrieveData();

                checkJournalDate();

                // clean up
                headerElement = null;
                headerStatus = null;

                // loop again
                window.setTimeout(function () { countdownTimer(); }, timerRefreshInterval * 1000);
            }
            else {
                // some one steal the horn!

                // update timer
                displayTimer("Synchronizing Data...", "Hunter horn is missing. Synchronizing data...", "Hunter horn is missing. Synchronizing data...");

                // try to click on the horn
                var hornElement = document.getElementsByClassName(strHornButton)[0].firstChild;
                fireEvent(hornElement, 'click');
                hornElement = null;

                // clean up
                headerElement = null;
                headerStatus = null;

                // double check if the horn was already sounded
                window.setTimeout(function () { afterSoundingHorn(); }, 5000);
            }
        }
        else {
            // something wrong, can't even found the header...

            // clean up
            headerElement = null;

            // reload the page see if thing get fixed
            reloadWithMessage("Fail to find the horn header. Reloading...", false);
        }

    }
    else {
        // aggressive mode, ignore whatever horn image is there or not, just sound the horn!

        // simulate mouse click on the horn
        fireEvent(document.getElementsByClassName(strHornButton)[0].firstChild, 'click');

        // double check if the horn was already sounded
        window.setTimeout(function () { afterSoundingHorn(); }, 3000);
    }
}

function afterSoundingHorn() {
    var scriptNode = document.getElementById("scriptNode");
    if (scriptNode) {
        scriptNode.setAttribute("soundedHornAtt", "false");
    }
    scriptNode = null;

    var headerElement = (isNewUI) ? document.getElementById('mousehuntHud').firstChild : document.getElementById('header');
    if (headerElement) {
        // double check if the horn image is still visible after the script already sound it
        var headerStatus = headerElement.getAttribute('class');
		headerStatus = headerStatus.toLowerCase();
        if (headerStatus.indexOf("hornready") != -1) {
            // seen like the horn is not functioning well

            // update timer
            displayTimer("Blowing The Horn Again...", "Blowing The Horn Again...", "Blowing The Horn Again...");

            // simulate mouse click on the horn
            var hornElement = document.getElementsByClassName(strHornButton)[0].firstChild;
            fireEvent(hornElement, 'click');
            hornElement = null;

            // clean up
            headerElement = null;
            headerStatus = null;

            // increase the horn retry counter and check if the script is caugh in loop
            ++hornRetry;
            if (hornRetry > hornRetryMax) {
                // reload the page see if thing get fixed
                reloadWithMessage("Detected script caught in loop. Reloading...", true);

                // reset the horn retry counter
                hornRetry = 0;
            }
            else {
                // check again later
                window.setTimeout(function () { afterSoundingHorn(); }, 1000);
            }
        }
        else if (headerStatus.indexOf("hornsounding") != -1) {
            // the horn is already sound, but the network seen to slow on fetching the data

            // update timer
            displayTimer("The horn sounding taken extra longer than normal...", "The horn sounding taken extra longer than normal...", "The horn sounding taken extra longer than normal...");

            // clean up
            headerElement = null;
            headerStatus = null;

            // increase the horn retry counter and check if the script is caugh in loop
            ++hornRetry;
            if (hornRetry > hornRetryMax) {
                // reload the page see if thing get fixed
                reloadWithMessage("Detected script caught in loop. Reloading...", true);

                // reset the horn retry counter
                hornRetry = 0;
            }
            else {
                // check again later
                window.setTimeout(function () { afterSoundingHorn(); }, 3000);
            }
        }
        else {
            // everything look ok

            // update timer
            displayTimer("Horn sounded. Synchronizing Data...", "Horn sounded. Synchronizing data...", "Horn sounded. Synchronizing data...");

            // reload data
            retrieveData();

            // clean up
            headerElement = null;
            headerStatus = null;

            // script continue as normal
            window.setTimeout(function () { countdownTimer(); }, timerRefreshInterval * 1000);

            // reset the horn retry counter
            hornRetry = 0;
        }
    }
    // eventLocationCheck('afterSoundingHorn()');
}

function embedScript() {
    // create a javascript to detect if user click on the horn manually
    var scriptNode = document.createElement('script');
    scriptNode.setAttribute('id', 'scriptNode');
    scriptNode.setAttribute('type', 'text/javascript');
    scriptNode.setAttribute('soundedHornAtt', 'false');
    scriptNode.innerHTML = '														\
		function soundedHorn()														\
		{																			\
			var scriptNode = document.getElementById("scriptNode");					\
			if (scriptNode)															\
			{																		\
				scriptNode.setAttribute("soundedHornAtt", "true");					\
			}																		\
			scriptNode = null;														\
		}																			\
		';

    // find the head node and insert the script into it
    var headerElement;
    if (fbPlatform || hiFivePlatform || mhPlatform) {
        headerElement = document.getElementById('noscript');
    }
    else if (mhMobilePlatform) {
        headerElement = document.getElementById('mobileHorn');
    }
    headerElement.parentNode.insertBefore(scriptNode, headerElement);
    scriptNode = null;
    headerElement = null;

    // change the function call of horn
	var testNewUI = document.getElementById('header');
	if (!isNullOrUndefined(testNewUI)) {
		// old UI
		isNewUI = false;
		strHornButton = 'hornbutton';
		strCampButton = 'campbutton';
	}
	else {
		// new UI
		isNewUI = true;
		strHornButton = 'mousehuntHud-huntersHorn-container';
        strCampButton = 'camp';
		alert("New UI might not work properly with this script. Use at your own risk");
		document.getElementById('titleElement').innerHTML += " - <font color='red'><b>Pls use Classic UI(i.e. Non-FreshCoat Layout) for fully working features</b></font>";
	}
	setStorage('NewUI', isNewUI);

	var hornButtonLink = document.getElementsByClassName(strHornButton)[0].firstChild;
    var oriStr = hornButtonLink.getAttribute('onclick').toString();
    var index = oriStr.indexOf('return false;');
    var modStr = oriStr.substring(0, index) + 'soundedHorn();' + oriStr.substring(index);
    hornButtonLink.setAttribute('onclick', modStr);

    hornButtonLink = null;
    oriStr = null;
    index = null;
    modStr = null;
}

// ################################################################################################
//   Horn Function - End
// ################################################################################################



// ################################################################################################
//   King's Reward Function - Start
// ################################################################################################

function kingRewardAction() {
    // update timer
    displayTimer("King's Reward!", "King's Reward", "King's Reward!");
    displayLocation("-");

    // play music if needed
    playKingRewardSound();

    // focus on the answer input
    var inputElementList = document.getElementsByTagName('input');
    if (inputElementList) {
        var i;
        for (i = 0; i < inputElementList.length; ++i) {
            // check if it is a resume button
            if (inputElementList[i].getAttribute('name') == "puzzle_answer") {
                inputElementList[i].focus();
                break;
            }
        }
        i = null;
    }
    inputElementList = null;

    // record last king's reward time
    var nowDate = new Date();
    setStorage("lastKingRewardDate", nowDate.toString());

	if (!isAutoSolve)
	{
		var intervalCRB = setInterval(
			function ()
			{
				if (checkResumeButton())
				{
					clearInterval(intervalCRB);
					intervalCRB = null;
					return;
				}
			}, 1000);
		return;
	}

	var krDelaySec = krDelayMax;
	if (kingsRewardRetry > 0){
		var nMin = krDelayMin / (kingsRewardRetry * 2);
		var nMax = krDelayMax / (kingsRewardRetry * 2);
		krDelaySec = nMin + Math.floor(Math.random() * (nMax - nMin));
	}
	else
		krDelaySec = krDelayMin + Math.floor(Math.random() * (krDelayMax - krDelayMin));

	var krStopHourNormalized = krStopHour;
	var krStartHourNormalized = krStartHour;
	if (krStopHour > krStartHour) // e.g. Stop to Start => 22 to 06
	{
		var offset = 24 - krStopHour;
		krStartHourNormalized = krStartHour + offset;
		krStopHourNormalized = 0;
		nowDate.setHours(nowDate.getHours() + offset);
    }

	if (nowDate.getHours() >= krStopHourNormalized && nowDate.getHours() < krStartHourNormalized)
	{
		var krDelayMinute = krStartHourDelayMin + Math.floor(Math.random() * (krStartHourDelayMax - krStartHourDelayMin));
		krDelaySec += krStartHour * 3600 - (nowDate.getHours() * 3600 + nowDate.getMinutes() * 60 + nowDate.getSeconds());
		krDelaySec += krDelayMinute * 60;
		var timeNow = new Date();
		kingRewardCountdownTimer(krDelaySec, true);
	}
	else{
		kingRewardCountdownTimer(krDelaySec, false);
	}
}

function playKingRewardSound() {
    if (isKingWarningSound) {
		unsafeWindow.hornAudio = new Audio('https://raw.githubusercontent.com/devcnn88/MHAutoBotEnhanced/master/resources/Girtab.mp3');
		hornAudio.loop = true;
        hornAudio.play();
    }
}

function kingRewardCountdownTimer(interval, isReloadToSolve)
{
	var strTemp = (isReloadToSolve) ? "Reload to solve KR in " : "Solve KR in (extra few sec delay) ";
	strTemp = strTemp + timeformat(interval);
	displayTimer(strTemp, strTemp, strTemp);
	interval -= timerRefreshInterval;
	if (interval < 0)
	{
		if (isReloadToSolve)
		{
			strTemp = "Reloading...";
			displayTimer(strTemp, strTemp, strTemp);
			// simulate mouse click on the camp button
			var campElement = document.getElementsByClassName(strCampButton)[0].firstChild;
			fireEvent(campElement, 'click');
			campElement = null;

			// reload the page if click on the camp button fail
			window.setTimeout(function () { reloadWithMessage("Fail to click on camp button. Reloading...", false); }, 5000);
		}
		else
		{
			strTemp = "Solving...";
			displayTimer(strTemp, strTemp, strTemp);
			var intervalCRB = setInterval(
				function ()
				{
					if (checkResumeButton())
					{
						clearInterval(intervalCRB);
						intervalCRB = null;
						return;
					}
				}, 1000);
			CallKRSolver();
		}
	}
	else
	{
        if (!checkResumeButton()) {
            window.setTimeout(function () { kingRewardCountdownTimer(interval, isReloadToSolve); }, timerRefreshInterval * 1000);
        }
    }
}

function checkResumeButton() {
    var found = false;

    var linkElementList = document.getElementsByTagName('img');
    if (linkElementList) {
        var i;
        for (i = 0; i < linkElementList.length; ++i) {
            // check if it is a resume button
            if (linkElementList[i].getAttribute('src').indexOf("resume_hunting_blue.gif") != -1) {
                // found resume button

                // simulate mouse click on the horn
                var resumeElement = linkElementList[i].parentNode;
                fireEvent(resumeElement, 'click');
                resumeElement = null;

                // reload url if click fail
                window.setTimeout(function () { reloadWithMessage("Fail to click on resume button. Reloading...", false); }, 6000);

                // recheck if the resume button is click because some time even the url reload also fail
                window.setTimeout(function () { checkResumeButton(); }, 10000);

                found = true;
                break;
            }
        }
        i = null;
    }

    linkElementList = null;

    try {
        return (found);
    }
    finally {
        found = null;
    }
}

function CallKRSolver()
{
	var frame = document.createElement('iframe');
	frame.setAttribute("id", "myFrame");
	var img = document.getElementById('puzzleImage');
	if (debugKR){
		//frame.src = "https://dl.dropboxusercontent.com/s/4u5msso39hfpo87/Capture.PNG";
		//frame.src = "https://dl.dropboxusercontent.com/s/og73bcdsn2qod63/download%20%2810%29Ori.png";
		frame.src = "https://dl.dropboxusercontent.com/s/ppg0l35h25phrx3/download%20(16).png";
	}
	else
		frame.src = img.src;
	document.body.appendChild(frame);
}

function CheckKRAnswerCorrectness()
{
	var pageMsg = document.getElementById('pagemessage');
	if (!isNullOrUndefined(pageMsg) && pageMsg.innerText.toLowerCase().indexOf("unable to claim reward") > -1) // KR answer not correct, re-run OCR
	{
		if (kingsRewardRetry >= kingsRewardRetryMax)
	    {
	        kingsRewardRetry = 0;
			setStorage("KingsRewardRetry", kingsRewardRetry);
			var strTemp = 'Max ' + kingsRewardRetryMax + 'retries. Pls solve it manually ASAP.';
			alert(strTemp);
			displayTimer(strTemp, strTemp, strTemp);
			console.perror(strTemp);
			return;
	    }
		++kingsRewardRetry;
		setStorage("KingsRewardRetry", kingsRewardRetry);
		CallKRSolver();
	}
	else
		window.setTimeout(function () { CheckKRAnswerCorrectness(); }, 1000);
}

// ################################################################################################
//   King's Reward Function - End
// ################################################################################################



// ################################################################################################
//   Trap Check Function - Start
// ################################################################################################

function trapCheck() {
    // update timer
    displayTimer("Checking The Trap...", "Checking trap now...", "Checking trap now...");

    // simulate mouse click on the camp button
    var campElement = document.getElementsByClassName(strCampButton)[0].firstChild;
    fireEvent(campElement, 'click');
    campElement = null;

    // reload the page if click on camp button fail
    // window.setTimeout(function () { reloadWithMessage("Fail to click on camp button. Reloading...", false); }, 5000);
	retrieveData();
	window.setTimeout(function () { countdownTimer(); }, timerRefreshInterval * 1000);
    // eventLocationCheck();
}

function CalculateNextTrapCheckInMinute() {
    if (enableTrapCheck) {
        var now = new Date();
        var temp = (trapCheckTimeDiff * 60) - (now.getMinutes() * 60 + now.getSeconds());
        checkTimeDelay = checkTimeDelayMin + Math.round(Math.random() * (checkTimeDelayMax - checkTimeDelayMin));
        checkTime = (now.getMinutes() >= trapCheckTimeDiff) ? 3600 + temp : temp;
        checkTime += checkTimeDelay;
        now = undefined;
        temp = undefined;
    }
}

// ################################################################################################
//   Trap Check Function - End
// ################################################################################################


// ################################################################################################
//   General Function - Start
// ################################################################################################

function ajaxPost(postURL, objData, callback, throwerror){
	try {
		jQuery.ajax({
			type: 'POST',
			url: postURL,
			data: objData,
			contentType: 'application/x-www-form-urlencoded',
			dataType: 'json',
			xhrFields: {
				withCredentials: false
			},
			success: callback,
			error: throwerror,
		});
	}
	catch (e) {
		throwerror(e);
	}
}

function isNullOrUndefined(obj){
	return (obj === null || obj === undefined);
}

function getAllIndices(arr, val) {
    var indices = [];
    for(var i = 0; i < arr.length; i++){
        if (arr[i] === val)
            indices.push(i);
	}
    return indices;
}

function range(value, min, max){
	if(value > max)
		value = max;
	else if(value < min)
		value = min;
	else if(Number.isNaN(value))
		value = min + Math.floor(Math.random() * (max - min));
	
	return value;
}

function min(data){
	var value = Number.MAX_SAFE_INTEGER;
	for (var i=0;i<data.length;i++){
		if (data[i] < value)
			value = data[i];
	}
	return value;
}

function minIndex(data){
	var value = Number.MAX_SAFE_INTEGER;
	var index = -1;
	for (var i=0;i<data.length;i++){
		if (data[i] < value){
			value = data[i];
			index = i;
		}
	}
	return index;
}

function max(data){
	var value = Number.MIN_SAFE_INTEGER;
	for (var i=0;i<data.length;i++){
		if (data[i] > value)
			value = data[i];
	}
	return value;
}

function maxIndex(data){
	var value = Number.MIN_SAFE_INTEGER;
	var index = -1;
	for (var i=0;i<data.length;i++){
		if (data[i] > value){
			value = data[i];
			index = i;
		}
	}
	return index;
}

function countUnique(arrIn){
	var  objCount = {
		value : [],
		count : [],
	};

	arrIn.forEach(function(i) {
		var index = objCount.value.indexOf(i);
		if (index < 0){
			objCount.value.push(i);
			objCount.count.push(1);
		}
		else {
			objCount.count[index]++;
		}
	});

	return objCount;
}

function hasDuplicate(arrIn){
	var obj = countUnique(arrIn);
	for (var i=0;i<obj.count.length;i++){
		if(obj.count[i] > 1)
			return true;
	}
	return false;
}

function countArrayElement(value, arrIn){
	var count = 0;
	for (var i=0;i<arrIn.length;i++){
		if (arrIn[i] == value)
			count++;
	}
	return count;
}

function sortWithIndices(toSort, sortType) {
	var arr = toSort.slice();
	var objSorted = {
		value : [],
		index : []
	};
	for (var i = 0; i < arr.length; i++) {
		arr[i] = [arr[i], i];
	}

	if (sortType == "descend"){
		arr.sort(function(left, right) {
			return left[0] > right[0] ? -1 : 1;
		});
	}
	else {
		arr.sort(function(left, right) {
			return left[0] < right[0] ? -1 : 1;
		});
	}
	
	for (var j = 0; j < arr.length; j++) {
		objSorted.value.push(arr[j][0]);
		objSorted.index.push(arr[j][1]);
	}
	return objSorted;
}

function standardDeviation(values){
	var avg = average(values);
	var squareDiffs = values.map(function(value){
		var diff = value - avg;
		var sqrDiff = diff * diff;
		return sqrDiff;
	});

	var avgSquareDiff = average(squareDiffs);
	var stdDev = Math.sqrt(avgSquareDiff);
	return stdDev;
}

function sumData(data){
	var sum = data.reduce(function(sum, value){
		return sum + value;
	}, 0);

	return sum;
}

function average(data){
	var avg = sumData(data) / data.length;
	return avg;
}

function functionToHTMLString(func){
	var str = func.toString();
	str = str.substring(str.indexOf("{")+1, str.lastIndexOf("}"));
	str = replaceAll(str, '"', '\'');
	return str;
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function browserDetection() {
    var browserName = "unknown";

    var userAgentStr = navigator.userAgent.toString().toLowerCase();
    if (userAgentStr.indexOf("firefox") >= 0) {
        browserName = "firefox";
    }
    else if (userAgentStr.indexOf("opera") >= 0) {
        browserName = "opera";
    }
    else if (userAgentStr.indexOf("chrome") >= 0) {
        browserName = "chrome";
    }
	setStorage('UserAgent', userAgentStr);
    userAgentStr = null;

    try {
        return (browserName);
    }
    finally {
        browserName = null;
    }
}

function setSessionStorage(name, value) {
    // check if the web browser support HTML5 storage
    if ('sessionStorage' in window && !isNullOrUndefined(window.sessionStorage)) {
        window.sessionStorage.setItem(name, value);
    }

    name = undefined;
    value = undefined;
}

function removeSessionStorage(name) {
    // check if the web browser support HTML5 storage
    if ('sessionStorage' in window && !isNullOrUndefined(window.sessionStorage)) {
        window.sessionStorage.removeItem(name);
    }
    name = undefined;
}

function getSessionStorage(name) {
    // check if the web browser support HTML5 storage
    if ('sessionStorage' in window && !isNullOrUndefined(window.sessionStorage)) {
        return (window.sessionStorage.getItem(name));
    }
    name = undefined;
}

function clearSessionStorage() {
    // check if the web browser support HTML5 storage
    if ('sessionStorage' in window && !isNullOrUndefined(window.sessionStorage))
        window.sessionStorage.clear();
}

function setStorage(name, value) {
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && !isNullOrUndefined(window.localStorage)) {
        window.localStorage.setItem(name, value);
    }

    name = undefined;
    value = undefined;
}

function removeStorage(name) {
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && !isNullOrUndefined(window.localStorage)) {
        window.localStorage.removeItem(name);
    }
    name = undefined;
}

function getStorage(name) {
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && !isNullOrUndefined(window.localStorage)) {
        return (window.localStorage.getItem(name));
    }
    name = undefined;
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }

            var cookieString = unescape(document.cookie.substring(c_start, c_end));

            // clean up
            c_name = null;
            c_start = null;
            c_end = null;

            try {
                return cookieString;
            }
            finally {
                cookieString = null;
            }
        }
        c_start = null;
    }
    c_name = null;
    return null;
}

function disarmTrap(trapSelector) {
    if(trapSelector == 'weapon' || trapSelector == 'base')
		return;
	var x;
	var strTemp = "";
	var intervalDisarm = setInterval(
		function (){
			if(arming === false){
				clickTrapSelector(trapSelector);
				var intervalDT = setInterval(
					function () {
						x = document.getElementsByClassName(trapSelector + ' canDisarm');
						if (x.length > 0) {
							for (var i = 0; i < x.length; ++i) {
								strTemp = x[i].getAttribute('title');
								if (strTemp.indexOf('Click to disarm') > -1) {
									if(strTemp.indexOf('not armed') > -1){
										// no charm armed, close trap selector
										closeTrapSelector(trapSelector);
										console.pdebug('No', trapSelector, 'armed');
									}
									else{
										fireEvent(x[i], 'click');
										console.pdebug('Disarmed');
									}
									arming = false;
									clearInterval(intervalDT);
									intervalDT = null;
									return;
								}
							}
						}
					}, 1000);
				clearInterval(intervalDisarm);
				intervalDisarm = null;
			}
		}, 1000);
    return;
}

function fireEvent(element, event) {
    var evt;
	if (document.createEventObject) {
        // dispatch for IE
        evt = document.createEventObject();

        try {
            return element.fireEvent('on' + event, evt);
        }
        finally {
            element = null;
            event = null;
            evt = null;
        }
    }
    else {
        // dispatch for firefox + others
        evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true); // event type,bubbling,cancelable

        try {
            return !element.dispatchEvent(evt);
        }
        finally {
            element = null;
            event = null;
            evt = null;
        }
    }
}

function getPageVariable(variableName) {
    var value;
	try {
		if (browser == 'chrome') {
			// google chrome only
			var scriptElement = document.createElement("script");
			scriptElement.setAttribute('id', "scriptElement");
			scriptElement.setAttribute('type', "text/javascript");
			scriptElement.innerHTML = "document.getElementById('scriptElement').innerText=" + variableName + ";";
			document.body.appendChild(scriptElement);

			value = scriptElement.innerHTML;
			document.body.removeChild(scriptElement);
			scriptElement = null;
			variableName = null;
		}
		else {
			value = eval(variableName + ';');
		}
		return value;
	}
	catch (e) {
		console.perror('getPageVariable',e);
		return "";
	}
}

function timeElapsed(dateA, dateB) {
    var elapsed = 0;

    var secondA = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate(), dateA.getHours(), dateA.getMinutes(), dateA.getSeconds());
    var secondB = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate(), dateB.getHours(), dateB.getMinutes(), dateB.getSeconds());
    elapsed = (secondB - secondA) / 1000;

    secondA = null;
    secondB = null;
    dateA = null;
    dateB = null;

    try {
        return (elapsed);
    }
    finally {
        elapsed = null;
    }
}

function timeformat(time) {
    var timeString;
    var hr = Math.floor(time / 3600);
    var min = Math.floor((time % 3600) / 60);
    var sec = (time % 3600 % 60) % 60;

    if (hr > 0) {
        timeString = hr.toString() + " hr " + min.toString() + " min " + sec.toString() + " sec";
    }
    else if (min > 0) {
        timeString = min.toString() + " min " + sec.toString() + " sec";
    }
    else {
        timeString = sec.toString() + " sec";
    }

    time = null;
    hr = null;
    min = null;
    sec = null;

    try {
        return (timeString);
    }
    finally {
        timeString = null;
    }
}

function timeFormatLong(time) {
    var timeString;

    if (time != -1) {
        var day = Math.floor(time / 86400);
        var hr = Math.floor((time % 86400) / 3600);
        var min = Math.floor((time % 3600) / 60);

        if (day > 0) {
            timeString = day.toString() + " day " + hr.toString() + " hr " + min.toString() + " min ago";
        }
        else if (hr > 0) {
            timeString = hr.toString() + " hr " + min.toString() + " min ago";
        }
        else if (min > 0) {
            timeString = min.toString() + " min ago";
        }

        day = null;
        hr = null;
        min = null;
    }
    else {
        timeString = null;
    }

    time = null;

    try {
        return (timeString);
    }
    finally {
        timeString = null;
    }
}
// ################################################################################################
//   General Function - End
// ################################################################################################

// ################################################################################################
//   HTML Function - Start
// ################################################################################################
function refreshTrapList() {
	try {
		var objUserHash = {
			uh : user.unique_hash
		};
		
		jQuery.ajax({
			type: 'POST',
			url: '/managers/ajax/users/gettrapcomponents.php',
			data: objUserHash,
			contentType: 'text/plain',
			dataType: 'json',
			xhrFields: {
				withCredentials: false
			},
			timeout: 10000,
			statusCode: {
				200: function () {}
			},
			success: function (data){
				var objTrap = {
					weapon : [],
					base : [],
					trinket : [],
					bait : []
				};
				for (var i=0;i<data.components.length;i++){
					if (data.components[i].classification == 'skin')
						continue;
					objTrap[data.components[i].classification].push(data.components[i].name);
				}
				window.localStorage.setItem('TrapListWeapon', objTrap.weapon.join());
				window.localStorage.setItem('TrapListBase', objTrap.base.join());
				window.localStorage.setItem('TrapListTrinket', objTrap.trinket.join());
				window.localStorage.setItem('TrapListBait', objTrap.bait.join());
			},
			error: function (error){
				console.perror('refreshTrapList:',error);
			}
		});
	} catch (e) {
		console.perror('refreshTrapList',e);
	}
}

function bodyJS(){
	function onIdGetLogPreferenceClicked(){
		var i;
		var str = "";
		var temp;
		var arrLog = [];
		for(i=0;i<window.localStorage.length;i++){
			temp = window.localStorage.key(i);
			if(temp.indexOf('KR') === 0)
				continue;
			str += temp + '|' + window.localStorage.getItem(temp);
			str += "\r\n";
		}
		for(i=0;i<window.sessionStorage.length;i++){
			temp = window.sessionStorage.key(i);
			if(temp.indexOf('Log_') > -1)
				arrLog.push(temp);
		}
		arrLog = arrLog.sort();
		for(i=0;i<arrLog.length;i++){
			temp = parseInt(arrLog[i].split('_')[1]);
			temp = (Number.isInteger(temp)) ? (new Date(temp)).toISOString() : arrLog[i];
			str += temp + "|" + window.sessionStorage.getItem(arrLog[i]);
			str += "\r\n";
		}
		saveFile(str,'log_preference.txt');
	}

	function saveFile(content, filename){
		var pom = document.createElement('a');
		pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
		pom.setAttribute('download', filename);

		if (document.createEvent) {
			var event = document.createEvent('MouseEvents');
			event.initEvent('click', true, true);
			pom.dispatchEvent(event);
		}
		else {
			pom.click();
		}
	}
	
	function onSelectMapHuntingChanged(){
		saveMapHunting();
		initControlsMapHunting();
	}
	
	function saveMapHunting(){
		var selectMapHunting = document.getElementById('selectMapHunting');
		var selectMouseList = document.getElementById('selectMouseList');
		var selectWeapon = document.getElementById('selectWeapon');
		var selectBase = document.getElementById('selectBase');
		var selectTrinket = document.getElementById('selectTrinket');
		var selectBait = document.getElementById('selectBait');
		var inputUncaughtMouse = document.getElementById('inputUncaughtMouse');
		var selectCatchLogic = document.getElementById('selectCatchLogic');
		var objDefaultMapHunting = {
			status : false,
			selectedMouse : [],
			logic : 'OR',
			weapon : 'Remain',
			base : 'Remain',
			trinket : 'Remain',
			bait : 'Remain'
		};
		var storageValue = JSON.parse(window.sessionStorage.getItem('MapHunting'));
		if(storageValue === null || storageValue === undefined)
			storageValue = objDefaultMapHunting;
		storageValue.status = (selectMapHunting.value == 'true');
		if(inputUncaughtMouse.value === '')
			storageValue.selectedMouse = [];
		else
			storageValue.selectedMouse = inputUncaughtMouse.value.split(',');
		storageValue.logic = selectCatchLogic.value;
		storageValue.weapon = selectWeapon.value;
		storageValue.base = selectBase.value;
		storageValue.trinket = selectTrinket.value;
		storageValue.bait = selectBait.value;
		window.sessionStorage.setItem('MapHunting', JSON.stringify(storageValue));
	}
	
	function initControlsMapHunting(){
		var trUncaughtMouse = document.getElementById('trUncaughtMouse');
		var trSelectedUncaughtMouse = document.getElementById('trSelectedUncaughtMouse');
		var trCatchLogic = document.getElementById('trCatchLogic');
		var selectMapHunting = document.getElementById('selectMapHunting');
		var selectMouseList = document.getElementById('selectMouseList');
		var trMapHuntingTrapSetup = document.getElementById('trMapHuntingTrapSetup');
		var inputUncaughtMouse = document.getElementById('inputUncaughtMouse');
		var selectCatchLogic = document.getElementById('selectCatchLogic');
		var selectWeapon = document.getElementById('selectWeapon');
		var selectBase = document.getElementById('selectBase');
		var selectTrinket = document.getElementById('selectTrinket');
		var selectBait = document.getElementById('selectBait');
		var storageValue = window.sessionStorage.getItem('MapHunting');
		if(storageValue === null || storageValue === undefined){
			selectMapHunting.selectedIndex = 0;
			trUncaughtMouse.style.display = 'none';
			trMapHuntingTrapSetup.style.display = 'none';
			inputUncaughtMouse.value = '';
			selectCatchLogic.selectedIndex = -1;
			selectWeapon.selectedIndex = -1;
			selectBase.selectedIndex = -1;
			selectTrinket.selectedIndex = -1;
			selectBait.selectedIndex = -1;
		}
		else{
			storageValue = JSON.parse(storageValue);
			selectMapHunting.value = storageValue.status;
			trUncaughtMouse.style.display = (storageValue.status) ? 'table-row' : 'none';
			trSelectedUncaughtMouse.style.display = (storageValue.status) ? 'table-row' : 'none';
			trCatchLogic.style.display = (storageValue.status) ? 'table-row' : 'none';
			trMapHuntingTrapSetup.style.display = (storageValue.status) ? 'table-row' : 'none';
			inputUncaughtMouse.value = storageValue.selectedMouse.join(',');
			selectCatchLogic.value = storageValue.logic;
			selectWeapon.value = storageValue.weapon;
			selectBase.value = storageValue.base;
			selectTrinket.value = storageValue.trinket;
			selectBait.value = storageValue.bait;
		}
		storageValue = window.localStorage.getItem('Last Record Uncaught');
		if(storageValue !== null && storageValue !== undefined){
			storageValue = storageValue.split(",");
			var i;
			for(i = selectMouseList.options.length-1 ; i >= 0 ; i--){
				selectMouseList.remove(i);
			}
			var optionEle;
			for(i=0;i<storageValue.length;i++){
				optionEle = document.createElement("option");
				optionEle.setAttribute('value', storageValue[i]);
				optionEle.textContent = storageValue[i];
				selectMouseList.appendChild(optionEle);
			}
		}
		document.getElementById('inputSelectMouse').disabled = (selectMouseList.options.length > 0) ? '' : 'disabled';
	}
	
	function onInputSelectMouse(){
		var inputUncaughtMouse = document.getElementById('inputUncaughtMouse');
		var selectMouseList = document.getElementById('selectMouseList');
		if(inputUncaughtMouse.value.indexOf(selectMouseList.value) < 0){
			if(inputUncaughtMouse.value.length !== 0)
				inputUncaughtMouse.value = selectMouseList.value + ',' + inputUncaughtMouse.value;
			else
				inputUncaughtMouse.value = selectMouseList.value;
		}
		saveMapHunting();
	}
	
	function onInputGetMouse(){
		var classTreasureMap = document.getElementsByClassName('mousehuntHud-userStat treasureMap')[0];
		if(classTreasureMap.children[2].textContent.toLowerCase().indexOf('remaining') < 0)
			return;

		document.getElementById('inputGetMouse').value = 'Processing...';
		document.getElementById('inputGetMouse').disabled = 'disabled';
		try {
			var objData = {
				sn : 'Hitgrab',
				hg_is_ajax : 1,
				action : 'info',
				uh : user.unique_hash
			};
			
			jQuery.ajax({
				type: 'POST',
				url: '/managers/ajax/users/relichunter.php',
				data: objData,
				contentType: 'application/x-www-form-urlencoded',
				dataType: 'json',
				xhrFields: {
					withCredentials: false
				},
				success: function (data){
					document.getElementById('inputGetMouse').value = 'Refresh Uncaught Mouse List';
					document.getElementById('inputGetMouse').disabled = '';
					console.log(data.treasure_map);
					if(data.treasure_map.groups !== null && data.treasure_map.groups !== undefined){
						var arrUncaught = [];
						for(var i=0;i<data.treasure_map.groups.length;i++){
							if(data.treasure_map.groups[i].is_uncaught === true){
								for(var j=0;j<data.treasure_map.groups[i].mice.length;j++){
									arrUncaught.push(data.treasure_map.groups[i].mice[j].name);
								}
							}
						}
						window.localStorage.setItem('Last Record Uncaught', arrUncaught.join(","));
						initControlsMapHunting();
					}
				},
				error: function (error){
					document.getElementById('inputGetMouse').value = 'Refresh Uncaught Mouse List';
					document.getElementById('inputGetMouse').disabled = '';
					console.error('onInputGetMouse ajax:',error);
				}
			});
		}
		catch (e) {
			document.getElementById('inputGetMouse').value = 'Refresh Uncaught Mouse List';
			document.getElementById('inputGetMouse').disabled = '';
			console.error('onInputGetMouse',e);
		}
	}
	
	function onInputClearUncaughtMouse(){
		document.getElementById('inputUncaughtMouse').value = "";
		saveMapHunting();
	}
	
	function onSelectCatchLogicChanged(){
		saveMapHunting();
	}
	
	function onSelectWeaponChanged(){
		saveMapHunting();
	}
	
	function onSelectBaseChanged(){
		saveMapHunting();
	}
	
	function onSelectTrinketChanged(){
		saveMapHunting();
	}
	
	function onSelectBaitChanged(){
		saveMapHunting();
	}
	
	function setLocalToSession(){
		var key;
		for(var i=0;i<window.localStorage.length;i++){
			key = window.localStorage.key(i);
			if(key.indexOf("SCCustom")>-1 || key.indexOf("Labyrinth_")>-1 ||
				key.indexOf("LGArea")>-1 || key.indexOf("eventLocation")>-1 ||
				key.indexOf("FW_")>-1 || key.indexOf("BRCustom")>-1 ||
				key.indexOf("SGZT")>-1 || key.indexOf("Zokor")>-1 ||
				key.indexOf("FRift")>-1 || key.indexOf("MapHunting")>-1){
				window.sessionStorage.setItem(key, window.localStorage.getItem(key));
			}
		}
	}

	function setSessionToLocal(){
		if(window.sessionStorage.length===0)
			return;
		
		window.localStorage.setItem('eventLocation', window.sessionStorage.getItem('eventLocation'));
		var key;
		for(var i=0;i<window.sessionStorage.length;i++){
			key = window.sessionStorage.key(i);
			if(key.indexOf("SCCustom")>-1 || key.indexOf("Labyrinth_")>-1 ||
				key.indexOf("LGArea")>-1 || key.indexOf("eventLocation")>-1 ||
				key.indexOf("FW_")>-1 || key.indexOf("BRCustom")>-1 ||
				key.indexOf("SGZT")>-1 || key.indexOf("Zokor")>-1 ||
				key.indexOf("FRift")>-1 || key.indexOf("MapHunting")>-1){
				window.localStorage.setItem(key, window.sessionStorage.getItem(key));
			}
		}
	}

	function onSelectSCHuntZoneEnable(){
		saveSCCustomAlgo();
	}
	
	function onSelectSCHuntBait(){
		saveSCCustomAlgo();
	}
	
	function onSelectSCHuntTrinket(){
		saveSCCustomAlgo();
	}
	
	function onSelectSCUseSmartJet(){
		saveSCCustomAlgo();
	}
	
	function initControlsSCCustom(){
		var selectSCHuntZone = document.getElementById('selectSCHuntZone');
		var selectSCHuntZoneEnable = document.getElementById('selectSCHuntZoneEnable');
		var selectSCHuntBait = document.getElementById('selectSCHuntBait');
		var selectSCHuntTrinket = document.getElementById('selectSCHuntTrinket');
		var selectSCUseSmartJet = document.getElementById('selectSCUseSmartJet');
		var storageValue = window.sessionStorage.getItem('SCCustom');
		if (storageValue === null || storageValue === undefined){
			var objSCCustomDefault = {
				zone : ['ZONE_NOT_DIVE','ZONE_DEFAULT','ZONE_CORAL','ZONE_SCALE','ZONE_BARNACLE','ZONE_TREASURE','ZONE_DANGER','ZONE_DANGER_PP','ZONE_OXYGEN','ZONE_BONUS'],
				zoneID : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
				isHunt : new Array(10).fill(true),
				bait : new Array(10).fill('Gouda'),
				trinket : new Array(10).fill('None'),
				useSmartJet : false
			};
			storageValue = JSON.stringify(objSCCustomDefault);
		}
		
		storageValue = JSON.parse(storageValue);
		var nIndex = storageValue.zone.indexOf(selectSCHuntZone.value);
		if(nIndex < 0)
			nIndex = 0;
		selectSCHuntZoneEnable.value = storageValue.isHunt[nIndex];
		selectSCHuntBait.value = storageValue.bait[nIndex];
		selectSCHuntTrinket.value = storageValue.trinket[nIndex];
		selectSCUseSmartJet.value = storageValue.useSmartJet;
	}
	
	function saveSCCustomAlgo(){	
		var selectSCHuntZone = document.getElementById('selectSCHuntZone');
		var selectSCHuntZoneEnable = document.getElementById('selectSCHuntZoneEnable');
		var selectSCHuntBait = document.getElementById('selectSCHuntBait');
		var selectSCHuntTrinket = document.getElementById('selectSCHuntTrinket');
		var selectSCUseSmartJet = document.getElementById('selectSCUseSmartJet');
		var storageValue = window.sessionStorage.getItem('SCCustom');
		if (storageValue === null || storageValue === undefined){
			var objSCCustomDefault = {
				zone : ['ZONE_NOT_DIVE','ZONE_DEFAULT','ZONE_CORAL','ZONE_SCALE','ZONE_BARNACLE','ZONE_TREASURE','ZONE_DANGER','ZONE_DANGER_PP','ZONE_OXYGEN','ZONE_BONUS'],
				zoneID : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
				isHunt : new Array(10).fill(true),
				bait : new Array(10).fill('Gouda'),
				trinket : new Array(10).fill('None'),
				useSmartJet : false
			};
			storageValue = JSON.stringify(objSCCustomDefault);
		}
		
		storageValue = JSON.parse(storageValue);
		var nIndex = storageValue.zone.indexOf(selectSCHuntZone.value);
		if(nIndex < 0)
			nIndex = 0;
		storageValue.isHunt[nIndex] = (selectSCHuntZoneEnable.value === 'true');
		storageValue.bait[nIndex] = selectSCHuntBait.value;
		storageValue.trinket[nIndex] = selectSCHuntTrinket.value;
		storageValue.useSmartJet = (selectSCUseSmartJet.value === 'true');
		window.sessionStorage.setItem('SCCustom', JSON.stringify(storageValue));
	}

	function saveDistrictFocus(value){
		window.sessionStorage.setItem('Labyrinth_DistrictFocus',value);
	}
	
	function onSelectLabyrinthDisarm(){
		var inputLabyrinthLastHunt = document.getElementById('inputLabyrinthLastHunt');
		var selectLabyrinthDisarm = document.getElementById('selectLabyrinthDisarm');
		inputLabyrinthLastHunt.disabled = (selectLabyrinthDisarm.value == 'true') ? '' : 'disabled';
		saveLabyrinthHallway();
	}
	
	function onSelectLabyrinthOtherBase(){
		saveLabyrinthHallway();
	}
	
	function onInputLabyrinthLastHuntChanged(){
		saveLabyrinthHallway();
	}

	function saveLabyrinthHallway(){
		var selectHallway15Plain = document.getElementById('selectHallway15Plain');
		var selectHallway1560Plain = document.getElementById('selectHallway1560Plain');
		var selectHallway1560Superior = document.getElementById('selectHallway1560Superior');
		var selectHallway60Plain = document.getElementById('selectHallway60Plain');
		var selectHallway60Superior = document.getElementById('selectHallway60Superior');
		var selectHallway60Epic = document.getElementById('selectHallway60Epic');
		var selectLabyrinthOtherBase = document.getElementById('selectLabyrinthOtherBase');
		var objDefaultHallwayPriorities = {
			between0and14 : ['LP'],
			between15and59  : ['SP','LS'],
			between60and100  : ['SP','SS','LE'],
			chooseOtherDoors : false,
			typeOtherDoors : "SHORTEST_ONLY",
			securityDisarm : false,
			lastHunt : 0,
			armOtherBase : 'false'
		};
		var storageValue = JSON.parse(window.sessionStorage.getItem('Labyrinth_HallwayPriorities'));
		if(storageValue === null || storageValue === undefined)
			storageValue = objDefaultHallwayPriorities;
		
		storageValue.between0and14 = [selectHallway15Plain.value];
		storageValue.between15and59 = [selectHallway1560Plain.value, selectHallway1560Superior.value];
		storageValue.between60and100 = [selectHallway60Plain.value, selectHallway60Superior.value, selectHallway60Epic.value];
		storageValue.chooseOtherDoors = (document.getElementById('chooseOtherDoors').value == 'true');
		storageValue.typeOtherDoors = document.getElementById('typeOtherDoors').value;
		storageValue.securityDisarm = (document.getElementById('selectLabyrinthDisarm').value == 'true');
		storageValue.lastHunt = parseInt(document.getElementById('inputLabyrinthLastHunt').value);
		storageValue.armOtherBase = selectLabyrinthOtherBase.value;
		window.sessionStorage.setItem('Labyrinth_HallwayPriorities', JSON.stringify(storageValue));
	}

	function loadDistricFocus(){
		var storageValue = window.sessionStorage.getItem('Labyrinth_DistrictFocus');
		if(storageValue === null || storageValue === undefined)
			storageValue = 'None';
		
		document.getElementById('labyrinthDistrict').value = storageValue;
	}

	function loadLabyrinthHallway(){
		var selectedDistrict = document.getElementById('labyrinthDistrict').value;
		var inputLabyrinthLastHunt = document.getElementById('inputLabyrinthLastHunt');
		var selectLabyrinthDisarm = document.getElementById('selectLabyrinthDisarm');
		document.getElementById('trPriorities15').style.display = (selectedDistrict == 'None') ? 'none' : 'table-row';
		document.getElementById('trPriorities1560').style.display = (selectedDistrict == 'None') ? 'none' : 'table-row';
		document.getElementById('trPriorities60').style.display = (selectedDistrict == 'None') ? 'none' : 'table-row';
		document.getElementById('labyrinthOtherHallway').style.display = (selectedDistrict == 'None') ? 'none' : 'table-row';
		var selectHallway15Plain = document.getElementById('selectHallway15Plain');
		var selectHallway1560Plain = document.getElementById('selectHallway1560Plain');
		var selectHallway1560Superior = document.getElementById('selectHallway1560Superior');
		var selectHallway60Plain = document.getElementById('selectHallway60Plain');
		var selectHallway60Superior = document.getElementById('selectHallway60Superior');
		var selectHallway60Epic = document.getElementById('selectHallway60Epic');
		var selectChooseOtherDoors = document.getElementById('chooseOtherDoors');
		var typeOtherDoors = document.getElementById('typeOtherDoors');
		var selectLabyrinthOtherBase = document.getElementById('selectLabyrinthOtherBase');
		var storageValue = JSON.parse(window.sessionStorage.getItem('Labyrinth_HallwayPriorities'));
		var objDefaultHallwayPriorities = {
			between0and14 : ['LP'],
			between15and59  : ['SP','LS'],
			between60and100  : ['SP','SS','LE'],
			chooseOtherDoors : false,
			typeOtherDoors : "SHORTEST_ONLY",
			securityDisarm : false,
			lastHunt : 0,
			armOtherBase : 'false'
		};
		if(storageValue === null || storageValue === undefined){
			storageValue = JSON.stringify(objDefaultHallwayPriorities);
			storageValue = JSON.parse(storageValue);
		}
		
		inputLabyrinthLastHunt.value = storageValue.lastHunt;
		inputLabyrinthLastHunt.disabled = (storageValue.securityDisarm) ? '' : 'disabled';
		selectLabyrinthDisarm.value = (storageValue.securityDisarm) ? 'true' : 'false';
		if(selectedDistrict == 'None')
			return;
		
		selectHallway15Plain.value = storageValue.between0and14[0];
		selectHallway1560Plain.value = storageValue.between15and59[0];
		selectHallway1560Superior.value = storageValue.between15and59[1];
		selectHallway60Plain.value = storageValue.between60and100[0];
		selectHallway60Superior.value = storageValue.between60and100[1];
		selectHallway60Epic.value = storageValue.between60and100[2];

		selectHallway60Epic.style = (selectedDistrict == 'TREASURY' || selectedDistrict == 'FARMING') ? 'display:none' : 'display:inline';
		selectChooseOtherDoors.value = (storageValue.chooseOtherDoors) ? 'true' : 'false';
		typeOtherDoors.value = storageValue.typeOtherDoors;
		document.getElementById('typeOtherDoors').disabled = (storageValue.chooseOtherDoors)? '' : 'disabled';
		selectLabyrinthOtherBase.value = storageValue.armOtherBase;
	}

	function saveLG(){
		var isPour = (document.getElementById('lgAutoPour').value == 'true');
		var maxSalt = document.getElementById('lgSalt').value;
		window.sessionStorage.setItem('LGArea', isPour + ',' + maxSalt);
	}

	function loadLG(){
		var storageValue = window.sessionStorage.getItem('LGArea');
		if(storageValue === null || storageValue === undefined){
			storageValue = 'true,25';
			window.sessionStorage.setItem('LGArea', storageValue);
		}

		storageValue = storageValue.split(',');
		document.getElementById('lgAutoPour').value = storageValue[0];
		document.getElementById('lgSalt').value = parseInt(storageValue[1]);
	}

	function onSelectFWWaveChanged(){
		// show wave X settings
		var nWave = parseInt(document.getElementById('selectFWWave').value);
		var option = document.getElementById('selectFWFocusType').children;
		for(var i=0;i<option.length;i++){
			if(option[i].innerText.indexOf('Special') > -1)
				option[i].style = (nWave==1) ? 'display:none' : '';
		}
		initControlsFW();
	}

	function onSelectFWStreakChanged(){
		initControlsFW();
	}

	function onSelectFWCheeseChanged(){
		saveFW();
	}

	function onSelectFWFocusTypeChanged(){
		saveFW();
	}

	function onSelectFWCharmTypeChanged(){
		saveFW();
	}

	function onSelectFWSpecialChanged(){
		saveFW();
	}

	function onSelectFWPrioritiesChanged(){
		saveFW();
	}
	
	function onSelectFWLastTypeConfigChanged(){
		saveFW();
	}

	function initControlsFW(){
		var selectFWStreak = document.getElementById('selectFWStreak');
		var selectFWFocusType = document.getElementById('selectFWFocusType');
		var selectFWPriorities = document.getElementById('selectFWPriorities');
		var selectFWCheese = document.getElementById('selectFWCheese');
		var selectFWCharmType = document.getElementById('selectFWCharmType');
		var selectFWSpecial = document.getElementById('selectFWSpecial');
		var selectFWLastTypeConfig = document.getElementById('selectFWLastTypeConfig');
		var storageValue = window.sessionStorage.getItem('FW_Wave' + document.getElementById('selectFWWave').value);
		if(storageValue === null || storageValue === undefined){
			selectFWFocusType.selectedIndex = -1;
			selectFWPriorities.selectedIndex = -1;
			selectFWCheese.selectedIndex = -1;
			selectFWCharmType.selectedIndex = -1;
			selectFWSpecial.selectedIndex = -1;
			selectFWLastTypeConfig.selectedIndex = -1;
		}
		else{
			storageValue = JSON.parse(storageValue);
			selectFWFocusType.value = storageValue.focusType;
			selectFWPriorities.value = storageValue.priorities;
			selectFWCheese.value = storageValue.cheese[selectFWStreak.selectedIndex];
			selectFWCharmType.value = storageValue.charmType[selectFWStreak.selectedIndex];
			selectFWSpecial.value = storageValue.special[selectFWStreak.selectedIndex];
			selectFWLastTypeConfig.value = storageValue.lastSoldierConfig;
		}
	}

	function saveFW(){
		var nWave = document.getElementById('selectFWWave').value;
		var selectFWStreak = document.getElementById('selectFWStreak');
		var nStreak = parseInt(selectFWStreak.value);
		var nStreakLength = selectFWStreak.children.length;
		var selectFWFocusType = document.getElementById('selectFWFocusType');
		var selectFWPriorities = document.getElementById('selectFWPriorities');
		var selectFWCheese = document.getElementById('selectFWCheese');
		var selectFWCharmType = document.getElementById('selectFWCharmType');
		var selectFWSpecial = document.getElementById('selectFWSpecial');
		var selectFWLastTypeConfig = document.getElementById('selectFWLastTypeConfig');
		var storageValue = window.sessionStorage.getItem('FW_Wave' + nWave);
		if(storageValue === null || storageValue === undefined){
			var obj = {
				focusType : 'NORMAL',
				priorities : 'HIGHEST',
				cheese : new Array(nStreakLength),
				charmType : new Array(nStreakLength),
				special : new Array(nStreakLength),
				lastSoldierConfig : 'CONFIG_GOUDA'
			};
			storageValue = JSON.stringify(obj);
		}
		storageValue = JSON.parse(storageValue);
		storageValue.focusType = selectFWFocusType.value;
		storageValue.priorities = selectFWPriorities.value;
		storageValue.cheese[nStreak] = selectFWCheese.value;
		storageValue.charmType[nStreak] = selectFWCharmType.value;
		storageValue.special[nStreak] = selectFWSpecial.value;
		storageValue.lastSoldierConfig = selectFWLastTypeConfig.value;
		window.sessionStorage.setItem('FW_Wave' + nWave, JSON.stringify(storageValue));
	}

	function onInputToggleCanisterChanged(){
		saveBR();
	}
	
	function onSelectBRHuntMistTierChanged(){
		var hunt = document.getElementById('selectBRHuntMistTier').value;
		var storageValue = window.sessionStorage.getItem('BRCustom');
		if(storageValue === null || storageValue === undefined){
			var objBR = {
				hunt : '',
				toggle : 1,
				name : ['Red', 'Green', 'Yellow', 'None'],
				weapon : new Array(4),
				base : new Array(4),
				trinket : new Array(4),
				bait : new Array(4)
			};
			storageValue = JSON.stringify(objBR);
		}
		storageValue = JSON.parse(storageValue);
		storageValue.hunt = hunt;
		window.sessionStorage.setItem('BRCustom', JSON.stringify(storageValue));
		initControlsBR();
	}
	
	function onSelectBRTrapWeaponChanged(){
		saveBR();
	}
	
	function onSelectBRTrapBaseChanged(){
		saveBR();
	}
	
	function onSelectBRTrapTrinketChanged(){
		saveBR();
	}
	
	function onSelectBRTrapBaitChanged(){
		saveBR();
	}
	
	function initControlsBR(){
		var hunt = document.getElementById('selectBRHuntMistTier');
		var toggle = document.getElementById('ToggleCanisterInput');
		var weapon = document.getElementById('selectBRTrapWeapon');
		var base = document.getElementById('selectBRTrapBase');
		var trinket = document.getElementById('selectBRTrapTrinket');
		var bait = document.getElementById('selectBRTrapBait');
		var storageValue = window.sessionStorage.getItem('BRCustom');
		if(storageValue === null || storageValue === undefined){
			toggle.value = 1;
			hunt.selectedIndex = 0;
			weapon.selectedIndex = -1;
			base.selectedIndex = -1;
			trinket.selectedIndex = -1;
			bait.selectedIndex = -1;
		}
		else{
			storageValue = JSON.parse(storageValue);
			hunt.value = storageValue.hunt;
			toggle.value = storageValue.toggle;
			var nIndex = storageValue.name.indexOf(hunt.value);
			weapon.value = storageValue.weapon[nIndex];
			base.value = storageValue.base[nIndex];
			trinket.value = storageValue.trinket[nIndex];
			bait.value = storageValue.bait[nIndex];
		}
		document.getElementById('trBRToggle').style.display = (hunt.value == 'Red')? 'table-row' : 'none';
	}
	
	function saveBR(){
		var hunt = document.getElementById('selectBRHuntMistTier').value;
		var nToggle = parseInt(document.getElementById('ToggleCanisterInput').value);
		var weapon = document.getElementById('selectBRTrapWeapon').value;
		var base = document.getElementById('selectBRTrapBase').value;
		var trinket = document.getElementById('selectBRTrapTrinket').value;
		var bait = document.getElementById('selectBRTrapBait').value;
		var storageValue = window.sessionStorage.getItem('BRCustom');
		if(storageValue === null || storageValue === undefined){
			var objBR = {
				hunt : '',
				toggle : 1,
				name : ['Red', 'Green', 'Yellow', 'None'],
				weapon : new Array(4),
				base : new Array(4),
				trinket : new Array(4),
				bait : new Array(4)
			};
			storageValue = JSON.stringify(objBR);
		}
		storageValue = JSON.parse(storageValue);
		var nIndex = storageValue.name.indexOf(hunt);
		if(nIndex < 0)
			nIndex = 0;
		storageValue.hunt = hunt;
		storageValue.toggle = nToggle;
		storageValue.weapon[nIndex] = weapon;
		storageValue.base[nIndex] = base;
		storageValue.trinket[nIndex] = trinket;
		storageValue.bait[nIndex] = bait;
		window.sessionStorage.setItem('BRCustom', JSON.stringify(storageValue));
	}

	function onSelectUseZUMChanged(){
		saveSGZT();
	}
	
	function saveSGZT(){
		var selectUseZUM = document.getElementById('selectUseZUM');
		var storageValue = window.sessionStorage.getItem('SGZT');
		if(storageValue === null || storageValue === undefined){
			var objSGZT = {
				useZUMIn : 'None'
			};
			storageValue = JSON.stringify(objSGZT);
		}
		storageValue = JSON.parse(storageValue);
		storageValue.useZUMIn = selectUseZUM.value;
		window.sessionStorage.setItem('SGZT', JSON.stringify(storageValue));
	}
	
	function initControlsSGZT(){
		var selectUseZUM = document.getElementById('selectUseZUM');
		var storageValue = window.sessionStorage.getItem('SGZT');
		if(storageValue === null || storageValue === undefined){
			selectUseZUM.selectedIndex = -1;
		}
		else{
			storageValue = JSON.parse(storageValue);
			selectUseZUM.value = storageValue.useZUMIn;
		}
	}
	
	function onSelectZokorBossStatus(){
		initControlsZokor();
	}
	
	function onSelectZokorBait(){
		saveZokor();
	}
	
	function onSelectZokorTrinket(){
		saveZokor();
	}
	
	function saveZokor(){
		var selectZokorBossStatus = document.getElementById('selectZokorBossStatus');
		var selectZokorBait = document.getElementById('selectZokorBait');
		var selectZokorTrinket = document.getElementById('selectZokorTrinket');
		var storageValue = window.sessionStorage.getItem('Zokor');
		if(storageValue === null || storageValue === undefined){
			var objZokor = {
				bossStatus : ['INCOMING', 'ACTIVE', 'DEFEATED'],
				bait : new Array(3).fill('Gouda'),
				trinket : new Array(3).fill('None')
			};
			storageValue = JSON.stringify(objZokor);
		}
		storageValue = JSON.parse(storageValue);
		var nIndex = storageValue.bossStatus.indexOf(selectZokorBossStatus.value);
		if(nIndex < 0)
			nIndex = 0;
		storageValue.bait[nIndex] = selectZokorBait.value;
		storageValue.trinket[nIndex] = selectZokorTrinket.value;
		window.sessionStorage.setItem('Zokor', JSON.stringify(storageValue));
	}
	
	function initControlsZokor(){
		var selectZokorBossStatus = document.getElementById('selectZokorBossStatus');
		var selectZokorBait = document.getElementById('selectZokorBait');
		var selectZokorTrinket = document.getElementById('selectZokorTrinket');
		var storageValue = window.sessionStorage.getItem('Zokor');
		if(storageValue === null || storageValue === undefined){
			selectZokorBait.selectedIndex = -1;
			selectZokorTrinket.selectedIndex = -1;
		}
		else{
			storageValue = JSON.parse(storageValue);
			var nIndex = storageValue.bossStatus.indexOf(selectZokorBossStatus.value);
			if(nIndex < 0)
				nIndex = 0;
			selectZokorBait.value = storageValue.bait[nIndex];
			selectZokorTrinket.value = storageValue.trinket[nIndex];
		}
	}
	
	function onSelectEnterAtBattery(){
		saveFR();
	}
	
	function onSelectRetreatAtBattery(){
		saveFR();
	}
	
	function onSelectTrapSetupAtBattery(){
		initControlsFR();
	}
	
	function onSelectFRTrapWeaponChanged(){
		saveFR();
	}
	
	function onSelectFRTrapBaseChanged(){
		saveFR();
	}
	
	function onSelectFRTrapTrinketChanged(){
		saveFR();
	}
	
	function onSelectFRTrapBaitChanged(){
		saveFR();
	}
	
	function saveFR(){
		var selectEnterAtBattery = document.getElementById('selectEnterAtBattery');
		var selectRetreatAtBattery = document.getElementById('selectRetreatAtBattery');
		var nIndex = document.getElementById('selectTrapSetupAtBattery').selectedIndex;
		var weapon = document.getElementById('selectFRTrapWeapon').value;
		var base = document.getElementById('selectFRTrapBase').value;
		var trinket = document.getElementById('selectFRTrapTrinket').value;
		var bait = document.getElementById('selectFRTrapBait').value;
		var storageValue = window.sessionStorage.getItem('FRift');
		if(storageValue === null || storageValue === undefined){
			var objFR = {
				enter : 0,
				retreat : 0,
				weapon : new Array(11).fill(''),
				base : new Array(11).fill(''),
				trinket : new Array(11).fill(''),
				bait : new Array(11).fill('')
			};
			storageValue = JSON.stringify(objFR);
		}
		storageValue = JSON.parse(storageValue);
		storageValue.enter = parseInt(selectEnterAtBattery.value);
		storageValue.retreat = parseInt(selectRetreatAtBattery.value);
		storageValue.weapon[nIndex] = weapon;
		storageValue.base[nIndex] = base;
		storageValue.trinket[nIndex] = trinket;
		storageValue.bait[nIndex] = bait;
		window.sessionStorage.setItem('FRift', JSON.stringify(storageValue));
	}
	
	function initControlsFR(nCurBatteryLevel){
		var selectEnterAtBattery = document.getElementById('selectEnterAtBattery');
		var selectRetreatAtBattery = document.getElementById('selectRetreatAtBattery');
		var selectTrapSetupAtBattery = document.getElementById('selectTrapSetupAtBattery');
		var selectFRTrapWeapon = document.getElementById('selectFRTrapWeapon');
		var selectFRTrapBase = document.getElementById('selectFRTrapBase');
		var selectFRTrapTrinket = document.getElementById('selectFRTrapTrinket');
		var selectFRTrapBait = document.getElementById('selectFRTrapBait');
		var storageValue = window.sessionStorage.getItem('FRift');
		if(Number.isInteger(nCurBatteryLevel))
			selectTrapSetupAtBattery.value = nCurBatteryLevel;
		if(storageValue === null || storageValue === undefined){
			selectEnterAtBattery.selectedIndex = -1;
			selectRetreatAtBattery.selectedIndex = -1;
			selectFRTrapWeapon.selectedIndex = -1;
			selectFRTrapBase.selectedIndex = -1;
			selectFRTrapTrinket.selectedIndex = -1;
			selectFRTrapBait.selectedIndex = -1;
			selectTrapSetupAtBattery.selectedIndex = 0;
		}
		else{
			storageValue = JSON.parse(storageValue);
			selectEnterAtBattery.value = storageValue.enter;
			selectRetreatAtBattery.value = storageValue.retreat;
			var nIndex = selectTrapSetupAtBattery.selectedIndex;
			selectFRTrapWeapon.value = storageValue.weapon[nIndex];
			selectFRTrapBase.value = storageValue.base[nIndex];
			selectFRTrapTrinket.value = storageValue.trinket[nIndex];
			selectFRTrapBait.value = storageValue.bait[nIndex];
		}
	}
	
	function showOrHideTr(algo){
		document.getElementById('lgArea').style.display = 'none';
		document.getElementById('trSCCustom').style.display = 'none';
		document.getElementById('trSCCustomUseSmartJet').style.display = 'none';
		document.getElementById('labyrinth').style.display = 'none';
		document.getElementById('trPriorities15').style.display = 'none';
		document.getElementById('trPriorities1560').style.display = 'none';
		document.getElementById('trPriorities60').style.display = 'none';
		document.getElementById('labyrinthOtherHallway').style.display = 'none';
		document.getElementById('trLabyrinthDisarm').style.display = 'none';
		document.getElementById('trLabyrinthArmOtherBase').style.display = 'none';
		document.getElementById('trFWWave').style.display = 'none';
		document.getElementById('trFWStreak').style.display = 'none';
		document.getElementById('trFWFocusType').style.display = 'none';
		document.getElementById('trFWLastType').style.display = 'none';
		document.getElementById('trBRConfig').style.display = 'none';
		document.getElementById('trBRToggle').style.display = 'none';
		document.getElementById('trBRTrapSetup').style.display = 'none';
		document.getElementById('trUseZum').style.display = 'none';
		document.getElementById('trZokorTrapSetup').style.display = 'none';
		document.getElementById('trFREnterBattery').style.display = 'none';
		document.getElementById('trFRRetreatBattery').style.display = 'none';
		document.getElementById('trFRTrapSetupAtBattery').style.display = 'none';
		if(algo == 'All LG Area'){
			document.getElementById('lgArea').style.display = 'table-row';
			loadLG();
		}
		else if(algo == 'Sunken City Custom'){
			document.getElementById('trSCCustom').style.display = 'table-row';
			document.getElementById('trSCCustomUseSmartJet').style.display = 'table-row';
			initControlsSCCustom();
		}
		else if(algo == 'Labyrinth'){
			document.getElementById('labyrinth').style.display = 'table-row';
			document.getElementById('trPriorities15').style.display = 'table-row';
			document.getElementById('trPriorities1560').style.display = 'table-row';
			document.getElementById('trPriorities60').style.display = 'table-row';
			document.getElementById('labyrinthOtherHallway').style.display = 'table-row';
			document.getElementById('trLabyrinthDisarm').style.display = 'table-row';
			document.getElementById('trLabyrinthArmOtherBase').style.display = 'table-row';
			loadDistricFocus();
			loadLabyrinthHallway();
		}
		else if(algo == 'Fiery Warpath'){
			document.getElementById('trFWWave').style.display = 'table-row';
			document.getElementById('trFWStreak').style.display = 'table-row';
			document.getElementById('trFWFocusType').style.display = 'table-row';
			document.getElementById('trFWLastType').style.display = 'table-row';
			document.getElementById('selectFWWave').selectedIndex = 0;
			onSelectFWWaveChanged();
		}
		else if(algo == 'Burroughs Rift Custom'){
			document.getElementById('trBRConfig').style.display = 'table-row';
			document.getElementById('trBRToggle').style.display = 'table-row';
			document.getElementById('trBRTrapSetup').style.display = 'table-row';
			initControlsBR();
		}
		else if(algo == 'SG/ZT'){
			document.getElementById('trUseZum').style.display = 'table-row';
			initControlsSGZT();
		}
		else if(algo == 'Furoma Rift'){
			document.getElementById('trFREnterBattery').style.display = 'table-row';
			document.getElementById('trFRRetreatBattery').style.display = 'table-row';
			document.getElementById('trFRTrapSetupAtBattery').style.display = 'table-row';
			var nCurBatteryLevel = 0;
			try{
				var bInPagoda = ((user.quests.QuestRiftFuroma.view_state) == 'pagoda');
				if(bInPagoda){
					var classCharge = document.getElementsByClassName('riftFuromaHUD-droid-charge');
					if(classCharge.length > 0){
						var nRemainingEnergy = parseInt(classCharge[0].innerText);
						if(Number.isInteger(nRemainingEnergy)){
							var arrCumulative = [20,65,140,260,460,770,1220,1835,2625,3600];
							for(var i=arrCumulative.length-1;i>=0;i--){
								if(nRemainingEnergy <= arrCumulative[i])
									nCurBatteryLevel = i+1;
								else
									break;
							}
						}
					}
				}
			}
			catch(e){
				console.log('Not in Furoma Rift');
			}
			finally{
				initControlsFR(nCurBatteryLevel);
			}
		}
		else if(algo == 'Zokor'){
			document.getElementById('trZokorTrapSetup').style.display = 'table-row';
			initControlsZokor();
		}
		initControlsMapHunting();
	}
}
// ################################################################################################
//   HTML Function - End
// ################################################################################################