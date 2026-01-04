// ==UserScript==
// @namespace   dang.gos
// @name        Gates of Survival - Combat Assist Extended
// @description Extended version of Dex's Combat Assist: https://greasyfork.org/scripts/22569-gates-of-survival-combat-assist
// @include     https://www.gatesofsurvival.com/game/index.php?page=main
// @grant       none
// @version     1.14
// @downloadURL https://update.greasyfork.org/scripts/31725/Gates%20of%20Survival%20-%20Combat%20Assist%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/31725/Gates%20of%20Survival%20-%20Combat%20Assist%20Extended.meta.js
// ==/UserScript==

// The game does everything by AJAX requests, so the standard way to make the script only run on certain pages doesn't apply. Use this to hook into each AJAX call and make the
// script run each time the correct "page" loads.
function callbackIfPageMatched(matchUrlRegEx, callback) {
	$(document).ajaxSuccess(
		function(event, xhr, settings) {
			var result = matchUrlRegEx.exec(settings.url);
			if(result != null) {
				// Wait 250 milliseconds before calling the function so that the page has hopefully had time to update.
				window.setTimeout(callback, 250);
			}
		}
	);
}

var logging = true;
var collectStats = false;
// Buffers automatically when created.
//var snd = new Audio("http://soundbible.com/mp3/Air Horn-SoundBible.com-964603082.mp3");  // This one is a little loud.
//snd.volume = 0.5;  //?
//var snd = new Audio("http://soundbible.com/mp3/Bike Horn-SoundBible.com-602544869.mp3");
//snd.volume = 0.75;  //?
var snd = new Audio("http://soundbible.com/mp3/Horn Honk-SoundBible.com-1634776698.mp3");
//var snd = new Audio("http://soundbible.com/mp3/Police Siren 2-SoundBible.com-2063505282.mp3");
//var snd = new Audio("http://soundbible.com/mp3/Industrial Alarm-SoundBible.com-1012301296.mp3");
if (typeof(Storage) !== "undefined") {
	// Local storage is allowed. Set the flag to collect stats.
	collectStats = true;
	console.log("dang.combat_assist_extended    Local storage available; combat stats will be collected.");
} else {
	console.log("dang.combat_assist_extended    Local storage not available; combat stats will *not* be collected.");
}

function dtrmnHlthStl(curHlth, maxHlth) {
	if (logging) {
		console.log("dang.combat_assist_extended    curHlth: " + curHlth + "; maxHlth: " + maxHlth);
	}
	// Default style, if health is critically low or if the max health could not be found.
	var hlthStyle = "'color: red; font-size: 300%;'";

	if (maxHlth > 0) {
		var prcntg = curHlth / maxHlth;
		if (logging) {
			console.log("dang.combat_assist_extended    prcntg: " + prcntg);
		}

		if (prcntg <= 0.15) {
			// Health is critical. Play the warning sound effect.
			snd.play();
		}
		// If health is dangerously low, set the slightly smaller, orange style (for now, this may be overridden in a bit if the health percentage is high enough)
		if (prcntg > 0.15) {
			hlthStyle = "'color: orange; font-size: 250%;'";
		}
		// If health is in bad shape, set the still smaller, yellow style (for now, this may be overridden in a bit if the health percentage is high enough)
		// This provides the upper bounds for the previous style. Doing it this way is a little less efficient, but much easier to modify the percentage scale for the styles (or add a new style).
		if (prcntg > 0.25) {
			hlthStyle = "'color: yellow; font-size: 200%;'";
		}
		// If health is good, set the slightly enlarged, green style.
		// This provides the upper bounds for the previous style. Doing it this way is a little less efficient, but much easier to modify the percentage scale for the styles (or add a new style).
		if (prcntg > 0.50) {
			hlthStyle = "'color: green; font-size: 150%;'";
		}
	}

	return hlthStyle;
}

function highlightHlth() {
	var healthFnd = false;
	var rgxHlthRplc = /./;
	var newHlthStr = "";
	var maxHealth = 0;

	// Get the html of the appropriate section of the page as a string.
	page = $("#end_result");
	var pageContent = page.html();

	// Look for the first health report (how much you had left after the fight).
	var rgxHealth = /still have <b>(\d+)<\/b> \/ <b>(\d+)<\/b> health/i;
	var result = rgxHealth.exec(pageContent);
	if (result != null) {
		temp = parseInt(result[2], 10);
		if (temp > 0) {
			maxHealth = temp;
		}

		healthFnd = true;
		rgxHlthRplc = rgxHealth;

		curHealth = parseInt(result[1], 10);
		var hlthStyle = dtrmnHlthStl(curHealth, maxHealth);

		newHlthStr = "still have <span style=" + hlthStyle + ">$1</span> \/ <b>$2<\/b> health";
	}

	// Look for the second health report (how much you had left after eating).
	var rgxHealth = /now have <b>(\d+) HP<\/b>/i;
	result = rgxHealth.exec(pageContent);
	if (result != null) {
		healthFnd = true;
		rgxHlthRplc = rgxHealth;

		curHealth = parseInt(result[1], 10);
		var hlthStyle = dtrmnHlthStl(curHealth, maxHealth);

		newHlthStr = "now have <span style=" + hlthStyle + ">$1</span> <b>HP<\/b>";
	}

	/*    This is no longer in the game.
	// Look for the third health report (how much you had left after spontaneous regeneration).
	var rgxHealth = /now have <b>(\d+) HP<\/b>!/i;
	result = rgxHealth.exec(pageContent);
	if (result != null) {
		healthFnd = true;
		rgxHlthRplc = rgxHealth;

		curHealth = parseInt(result[1], 10);
		var hlthStyle = dtrmnHlthStl(curHealth, maxHealth);

		newHlthStr = "now have <span style=" + hlthStyle + ">$1</span> <b>HP<\/b>!";
	}
	*/

	if (healthFnd) {
		pageContent = pageContent.replace(rgxHlthRplc, newHlthStr);
		page.html(pageContent);
	}
}

function addMnstrCoinStats(monsterStats, endResult) {
	var monsterObj;

	// Look for the coin loot from the fight.
	var rgxCoin = /and <b>([\d,]+) coin<\/b> from killing the <b>([^<]+)<\/b>!/i;
	result = rgxCoin.exec(endResult);

	if (result != null) {
		// Found the monster and coin data. Create the new object to hold this data.
		monsterObj = {};
		monsterObj.midasBoost = false;

		// Pull the data out.
		var coins = result[1].replace(/,/g, "");
		monster = result[2];
		if (logging) {
			console.log("dang.combat_assist_extended    Coins earned: " + coins + "; Monster fought: " + monster);
		}
		monsterObj.coins = coins;

		var monsterObjList = [];
		if (monsterStats[monster] == null) {
			// This monster has no stats yet. Assign the currently empty object list to this monster.
			monsterStats[monster] = monsterObjList;
			console.log("dang.combat_assist_extended    Created monster object list.");
		} else {
			monsterObjList = monsterStats[monster];
		}

		// Determine if the Midas boost is on. If it is, it skews the data, so it needs to be flagged.
		var boostsString = $("div.alert-pet_box.boost_show").html();
		var rgxMidas = /Hand of Midas \(x2 Coin\)/i;
		result = rgxMidas.exec(boostsString);
		if (result != null) {
			// The boost is on.
			if (logging) {
				console.log("dang.combat_assist_extended    The Midas boost is on.");
			}
			monsterObj.midasBoost = true;
		}

		// Add this new stat object to the list of stat objects for this monster.
		monsterObjList.push(monsterObj);
	}

	return monsterObj;
}

function addMnstrCombatStats(monsterObj, pageContent) {
	// Look for the rounds and damage done from the fight.
	var rgxRnds = /Monster Rounds.*?<b>([^<]*)<\/b>/i;
	var rgxDmgTkn = /Monster Damage Dealt.*?<b>([^<]*)<\/b>/i;

	result = rgxRnds.exec(pageContent);
	if (result != null) {
		// Found the monster rounds data. Pull the data out.
		var rnds = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Monster rounds: " + rnds);
		}
		monsterObj.rounds = rnds;
	}

	result = rgxDmgTkn.exec(pageContent);
	if (result != null) {
		// Found the total monster damage data. Pull the data out.
		var dmgTkn = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Damage taken: " + dmgTkn);
		}
		monsterObj.ttlDmg = dmgTkn;
	}

	// Get the current time in EST (server time)
	monsterObj.datetime = new Date().toLocaleString('en-US', {timeZone: 'America/Toronto'}).replace(',', '');
}

function addPlrTotalStats(pageContent) {
	var playerStats = {};

	// Look for the rounds and damage done from the fight.
	var rgxRnds = /Player Rounds.*?<b>([^<]*)<\/b>/i;
	var rgxDmgDlt = /Total Damage Dealt.*?<font[^>]*?color.*?>([^<]*)<\/font>/i;

	var result = rgxRnds.exec(pageContent);
	if (result != null) {
		// Found the Player rounds data. Pull the data out.
		var rounds = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Player rounds: " + rounds);
		}
		playerStats.rounds = rounds;
	}

	result = rgxDmgDlt.exec(pageContent);
	if (result != null) {
		// Found the Damage dealt data. Pull the data out.
		var ttlDmg = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Damage dealt: " + ttlDmg);
		}
		playerStats.ttlDmg = ttlDmg;
	}

	return playerStats;
}

function addPlrSklAtkStats(playerStats, pageContent) {
	// Look for the number of attacks done with each skill from the fight.
	var rgxAtkNml = /Normal Attacks.*?<b>([^<]*)<\/b>/i;
	var rgxAtkDef = /Defense Attacks.*?<b>([^<]*)<\/b>/i;
	var rgxAtkStr = /Strength Attacks.*?<b>([^<]*)<\/b>/i;
	var rgxAtkCrt = /Criticals Attacks.*?<b>([^<]*)<\/b>/i;
	var rgxAtkAcn = /Arcane Attacks.*?<b>([^<]*)<\/b>/i;
	var rgxAtkAch = /Archery Attacks.*?<b>([^<]*)<\/b>/i;

	var result = rgxAtkNml.exec(pageContent);
	if (result != null) {
		// Found the number of normal attacks data. Pull the data out.
		var atkNml = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Normal Attacks: " + atkNml);
		}
		playerStats.atkNml = atkNml;
	}

	result = rgxAtkDef.exec(pageContent);
	if (result != null) {
		// Found the number of defense attacks data. Pull the data out.
		var atkDef = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Defense Attacks: " + atkDef);
		}
		playerStats.atkDef = atkDef;
	}

	result = rgxAtkStr.exec(pageContent);
	if (result != null) {
		// Found the number of strength attacks data. Pull the data out.
		var atkStr = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Strength Attacks: " + atkStr);
		}
		playerStats.atkStr = atkStr;
	}

	result = rgxAtkCrt.exec(pageContent);
	if (result != null) {
		// Found the number of critical attacks data. Pull the data out.
		var atkCrt = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Critical Attacks: " + atkCrt);
		}
		playerStats.atkCrt = atkCrt;
	}

	result = rgxAtkAcn.exec(pageContent);
	if (result != null) {
		// Found the number of critical attacks data. Pull the data out.
		var atkAcn = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Arcane Attacks: " + atkAcn);
		}
		playerStats.atkAcn = atkAcn;
	}

	result = rgxAtkAch.exec(pageContent);
	if (result != null) {
		// Found the number of critical attacks data. Pull the data out.
		var atkAch = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Arcane Attacks: " + atkAch);
		}
		playerStats.atkAch = atkAch;
	}
}

function addPlrSklDmgStats(playerStats, pageContent) {
	// Look for the amount of damage done with each skill from the fight.
	var rgxDmgNml = /Attacks Damage.*?<b>([^<]*)<\/b>/i;
	var rgxDmgDef = /Defended Damage.*?<b>([^<]*)<\/b>/i;
	var rgxDmgStr = /Strength Damage.*?<b>([^<]*)<\/b>/i;
	var rgxDmgCrt = /Critical Damage.*?<b>([^<]*)<\/b>/i;
	var rgxDmgAcn = /Arcane Damage.*?<b>([^<]*)<\/b>/i;
	var rgxDmgAch = /Archery Damage.*?<b>([^<]*)<\/b>/i;

	var result = rgxDmgNml.exec(pageContent);
	if (result != null) {
		// Found the Attack damage data. Pull the data out.
		var dmgNml = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Attack Damage: " + dmgNml);
		}
		playerStats.dmgNml = dmgNml;
	}

	result = rgxDmgDef.exec(pageContent);
	if (result != null) {
		// Found the Defense damage data. Pull the data out.
		var dmgDef = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Defense Damage: " + dmgDef);
		}
		playerStats.dmgDef = dmgDef;
	}

	result = rgxDmgStr.exec(pageContent);
	if (result != null) {
		// Found the Strength damage data. Pull the data out.
		var dmgStr = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Strength Damage: " + dmgStr);
		}
		playerStats.dmgStr = dmgStr;
	}

	result = rgxDmgCrt.exec(pageContent);
	if (result != null) {
		// Found the Critical damage data. Pull the data out.
		var dmgCrt = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Defense Damage: " + dmgCrt);
		}
		playerStats.dmgCrt = dmgCrt;
	}

	result = rgxDmgAcn.exec(pageContent);
	if (result != null) {
		// Found the Arcane damage data. Pull the data out.
		var dmgAcn = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Arcane Experience: " + dmgAcn);
		}
		playerStats.dmgAcn = dmgAcn;
	}

	result = rgxDmgAch.exec(pageContent);
	if (result != null) {
		// Found the Archery damage data. Pull the data out.
		var dmgAch = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Archery Damage: " + dmgAch);
		}
		playerStats.dmgAch = dmgAch;
	}
}

function addPlrSklExpStats(playerStats, pageContent) {
	// Look for the experience gained from the fight.
	var rgxExpAtk = /Attack Experience.*?<b>([^<]*)<\/b>/i;
	var rgxExpDef = /Defense Experience.*?<b>([^<]*)<\/b>/i;
	var rgxExpStr = /Strength Experience.*?<b>([^<]*)<\/b>/i;
	var rgxExpCrt = /Critcal Experience \(all skills\).*?<b>([^<]*)<\/b>/i;
	var rgxExpAcn = /Arcane Experience.*?<b>([^<]*)<\/b>/i;
	var rgxExpAch = /Archery Experience.*?<b>([^<]*)<\/b>/i;
	var rgxExpHlt = /You've also earned .*?<b>([^<]*)<\/b>.*health experience from this fight!/i;

	var result = rgxExpAtk.exec(pageContent);
	if (result != null) {
		// Found the Attack experience data. Pull the data out.
		var expAtk = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Attack Experience: " + expAtk);
		}
		playerStats.expAtk = expAtk;
	}

	result = rgxExpDef.exec(pageContent);
	if (result != null) {
		// Found the Defense experience data. Pull the data out.
		var expDef = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Defense Experience: " + expDef);
		}
		playerStats.expDef = expDef;
	}

	result = rgxExpStr.exec(pageContent);
	if (result != null) {
		// Found the Strength experience data. Pull the data out.
		var expStr = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Strength Experience: " + expStr);
		}
		playerStats.expStr = expStr;
	}

	result = rgxExpCrt.exec(pageContent);
	if (result != null) {
		// Found the Critical experience data. Pull the data out.
		var expCrt = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Defense Experience: " + expCrt);
		}
		playerStats.expCrt = expCrt;
	}

	result = rgxExpAcn.exec(pageContent);
	if (result != null) {
		// Found the Arcane experience data. Pull the data out.
		var expAcn = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Arcane Experience: " + expAcn);
		}
		playerStats.expAcn = expAcn;
	}

	result = rgxExpAch.exec(pageContent);
	if (result != null) {
		// Found the Archery experience data. Pull the data out.
		var expAch = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Archery Experience: " + expAch);
		}
		playerStats.expAch = expAch;
	}

	result = rgxExpHlt.exec(pageContent);
	if (result != null) {
		// Found the Health experience data. Pull the data out.
		var expHlt = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Health Experience: " + expHlt);
		}
		playerStats.expHlt = expHlt;
	}
}

function addPlrClnExpStats(playerStats, pageContent) {
	// Look for the clan experience gained from the fight.
	var rgxClnAtk = /<b>Clans Stats \(Experience Gained\)<\/b>: <hr.*?<b>([\d,]+)<\/b>\s*attack XP/;
	var rgxClnAch = /<b>Clans Stats \(Experience Gained\)<\/b>: <hr.*?<b>([\d,]+)<\/b>\s*archery XP/;
	var rgxClnAcn = /<b>Clans Stats \(Experience Gained\)<\/b>: <hr.*?<b>([\d,]+)<\/b>\s*arcane XP/;
	var rgxClnDef = /<b>Clans Stats \(Experience Gained\)<\/b>: <hr.*?<b>([\d,]+)<\/b>\s*defense XP/;
	var rgxClnHlt = /<b>Clans Stats \(Experience Gained\)<\/b>: <hr.*?<b>([\d,]+)<\/b>\s*health XP/;
	var rgxClnStr = /<b>Clans Stats \(Experience Gained\)<\/b>: <hr.*?<b>([\d,]+)<\/b>\s*strength XP/;

	var result = rgxClnAtk.exec(pageContent);
	if (result != null) {
		// Found the clan attack experience data. Pull the data out.
		var clnAtk = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Clan attack XP: " + clnAtk);
		}
		playerStats.clnAtk = clnAtk;
	}

	result = rgxClnAch.exec(pageContent);
	if (result != null) {
		// Found the clan archery experience data. Pull the data out.
		var clnAch = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Clan archery XP: " + clnAch);
		}
		playerStats.clnAch = clnAch;
	}

	result = rgxClnAcn.exec(pageContent);
	if (result != null) {
		// Found the clan arcane experience data. Pull the data out.
		var clnAcn = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Clan arcane XP: " + clnAcn);
		}
		playerStats.clnAcn = clnAcn;
	}

	result = rgxClnDef.exec(pageContent);
	if (result != null) {
		// Found the clan defense experience data. Pull the data out.
		var clnDef = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Clan defense XP: " + clnDef);
		}
		playerStats.clnDef = clnDef;
	}

	result = rgxClnHlt.exec(pageContent);
	if (result != null) {
		// Found the clan health experience data. Pull the data out.
		var clnHlt = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Clan health XP: " + clnHlt);
		}
		playerStats.clnHlt = clnHlt;
	}

	result = rgxClnStr.exec(pageContent);
	if (result != null) {
		// Found the clan strength experience data. Pull the data out.
		var clnStr = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Clan strength XP: " + clnStr);
		}
		playerStats.clnStr = clnStr;
	}
}

function addPlrPrmPetStats(playerStats, pageContent){
	// Look for the primary pet stats.
	var prmPets = [
		{
			type: "Dragon",
			regExp: /<div class="csstable">.*<br><b>.*?<\/b> gained your clan an extra <b>([\d,]+?) XP<\/b> for every pool shown!.*has gained itself <b>([\d,]+?) XP<\/b> as well!/
		},
		{
			type: "Rabbit",
			regExp: /;"><b>.*?<\/b> has gained you <b>([\d,]+?)<\/b> luck experience from this action, and <b>([\d,]+?)<\/b> experience for itself!/
		}
	];
	var prmPetsLen = prmPets.length;

	for (var i = 0; i < prmPetsLen; i++) {
		var prmPet = prmPets[i];
		var result = prmPet.regExp.exec(pageContent);

		if (result != null) {
			// Found the primary pet data. Pull the data out.
			var prmPetType = prmPet.type;
			if (logging) {
				console.log("dang.combat_assist_extended    Primary pet type: " + prmPetType);
			}
			playerStats.prmPetType = prmPetType;

			var prmPetPlrExp = result[1].replace(/,/g, "");
			if (logging) {
				console.log("dang.combat_assist_extended    Player Exp from primary pet: " + prmPetPlrExp);
			}
			playerStats.prmPetPlrExp = prmPetPlrExp;

			var prmPetExp = result[2].replace(/,/g, "");
			if (logging) {
				console.log("dang.combat_assist_extended    Primary pet exp for itself: " + prmPetExp);
			}
			playerStats.prmPetExp = prmPetExp;
		}
	}
}

function addPlrSecPetStats(playerStats, pageContent){
	// Look for the secondary pet stats.
	var rgxSecPet = /Your <b>(.*)<\/b> has gained you <b>([\d,]+)<\/b> experience from this action, and <b>([\d,]+) XP<\/b> for itself!/

	var result = rgxSecPet.exec(pageContent);
	if (result != null) {
		// Found the secondary pet data. Pull the data out.
		var secPetType = result[1];
		if (logging) {
			console.log("dang.combat_assist_extended    Secondary pet type: " + secPetType);
		}
		playerStats.secPetType = secPetType;

		var secPetPlrExp = result[2].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Player Exp from secondary pet: " + secPetPlrExp);
		}
		playerStats.secPetPlrExp = secPetPlrExp;

		var secPetExp = result[3].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Secondary pet exp for itself: " + secPetExp);
		}
		playerStats.secPetExp = secPetExp;
	} else {
		// It's not a standard exp pet, look through specific ones
		var secPets = [
			{
				type: "Naga",
				regExp: /<hr.*?<\/b> healed you over <b>([\d,]+) times<\/b> for <b>([\d,]+) health<\/b>! <b>.*?<\/b> gained <b>([\d,]+) XP<\/b>!/
			}
		];
		var secPetsLen = secPets.length;

		for (var i = 0; i < secPetsLen; i++) {
			var secPet = secPets[i];
			var result = secPet.regExp.exec(pageContent);

			if (result != null) {
				// Found the secondary pet data. Pull the data out.
				var secPetType = secPet.type;
				if (logging) {
					console.log("dang.combat_assist_extended    Secondary pet type: " + secPetType);
				}
				playerStats.secPetType = secPetType;

				if (secPetType === 'Naga') {
					// Times healed
					var secPetData1 = result[1].replace(/,/g, "");
					if (logging) {
						console.log("dang.combat_assist_extended    Times healed (secPetData1): " + secPetData1);
					}
					playerStats.secPetData1 = secPetData1;

					// Health healed
					var secPetData2 = result[2].replace(/,/g, "");
					if (logging) {
						console.log("dang.combat_assist_extended    Health healed (secPetData2): " + secPetData2);
					}
					playerStats.secPetData2 = secPetData2;

					var secPetExp = result[3].replace(/,/g, "");
					if (logging) {
						console.log("dang.combat_assist_extended    Secondary pet exp for itself: " + secPetExp);
					}
					playerStats.secPetExp = secPetExp;
				}
			}
		}
	}
}

function addPlrSklSmnStats(playerStats, pageContent){
	// Look for the summon stats.
	var rgxSmnName = /<b>(.*?) (Summoned)<\/b>/;
	var rgxSmnStats = /Your summon attacked <b>([\d,]+) times<\/b> for <b>([\d,]+) damage<\/b>, and gained you <b>([\d,]+) summoning experience<\/b>!/;

	var result = rgxSmnName.exec(pageContent);
	if (result != null) {
		// Found the summon name. Pull the name out.
		var smnName = result[1];
		if (logging) {
			console.log("dang.combat_assist_extended    Summon name: " + smnName);
		}
		playerStats.smnName = smnName;
	}

	result = rgxSmnStats.exec(pageContent);
	if (result != null) {
		// Found the summon data. Pull the data out.
		var smnAtk = result[1].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Summon attacks: " + smnAtk);
		}
		playerStats.smnAtk = smnAtk;

		var smnDmg = result[2].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Summon damage: " + smnDmg);
		}
		playerStats.smnDmg = smnDmg;

		var smnExp = result[3].replace(/,/g, "");
		if (logging) {
			console.log("dang.combat_assist_extended    Summon exp: " + smnExp);
		}
		playerStats.smnExp = smnExp;
	}
}

function collectPlrStats(monsterObj, pageContent) {
	/*
	playerStats = {
		"<player>" = [{
			"rounds" = <number of rounds for the player this combat>
			"ttlDmg" = <total amount of damage the player dealt this combat>
			"atkNml" = <number of normal attacks done by the player this combat>
			"atkDef" = <number of defense attacks done by the player this combat>
			"atkStr" = <number of strength attacks done by the player this combat>
			"atkCrt" = <number of critical attacks done by the player this combat>
			"atkAcn" = <number of arcane attacks done by the player this combat>
			"atkAch" = <number of archery attacks done by the player this combat>
			"dmgNml" = <amount of damage dealt by normal attacks done by the player this combat>
			"dmgDef" = <amount of damage defended by the player this combat>
			"dmgStr" = <amount of damage dealt by strength attacks done by the player this combat>
			"dmgCrt" = <amount of damage dealt by critical attacks done by the player this combat>
			"dmgAcn" = <amount of damage dealt by arcane attacks done by the player this combat>
			"dmgAch" = <amount of damage dealt by archery attacks done by the player this combat>
			"expAtk" = <amount of Attack Experience gained by the player this combat>
			"expDef" = <amount of Defense Experience gained by the player this combat>
			"expStr" = <amount of Strength Experience gained by the player this combat>
			"expCrt" = <amount of Critical Experience gained by the player this combat>
			"expAcn" = <amount of Arcane Experience gained by the player this combat>
			"expAch" = <amount of Archery Experience gained by the player this combat>
			"expHlt" = <amount of Health Experience gained by the player this combat>
			"clnAtk" = <amount of clan Attack Experience gained this combat>
			"clnAch" = <amount of clan Archery Experience gained this combat>
			"clnAcn" = <amount of clan Arcane Experience gained this combat>
			"clnDef" = <amount of clan Defense Experience gained this combat>
			"clnHlt" = <amount of clan Health Experience gained this combat>
			"clnStr" = <amount of clan Strength Experience gained this combat>
			"secPetType" = <type of secondary pet active this combat>
			"secPetPlrExp" = <amount of experience gained from secondary pet this combat>
			"secPetExp" = <amount of experience gained by secondary pet for itself this combat>
		}]
		...
	}
	*/
	/*
	// This should be used after player obj gets separated from monster obj.
	var playerStatsString = localStorage.getItem("playerStats");
	if (logging) {
		console.log("dang.combat_assist_extended    Stringified playerStats from storage: " + playerStatsString);
	}

	var playerStats = {};
	if (playerStatsString == null) {
		// This is the first time running this or the stats have been cleared. (Re)create the player stats object.
		console.log("dang.combat_assist_extended    Created playerStats object.");
	} else {
		playerStats = JSON.parse(playerStatsString);
	}
	*/


	// Collect the player stats. Start with the number of rounds and total damage dealt.
	var playerObj = addPlrTotalStats(pageContent);
	if (playerObj != null) {
		// Now add the skill experience stats.
		addPlrSklAtkStats(playerObj, pageContent);
		addPlrSklDmgStats(playerObj, pageContent);
		addPlrSklExpStats(playerObj, pageContent);
		addPlrClnExpStats(playerObj, pageContent);
		addPlrPrmPetStats(playerObj, pageContent);
		addPlrSecPetStats(playerObj, pageContent);
		addPlrSklSmnStats(playerObj, pageContent);
	}

	/*
	// This should be used after player obj gets separated from monster obj.
	playerStatsString = JSON.stringify(playerStats);
	if (logging) {
		console.log("dang.combat_assist_extended    Stringified playerStats: " + playerStatsString);
	}
	localStorage.playerStats = playerStatsString;
	*/
	monsterObj.playerStats = playerObj;
}

function collectMnstrStats(htmlContent) {
	/*
	monsterStats = {
		"<monster>" = [{
			"coins" = <number of coins dropped this combat>
			"midasBoost" = <true or false for if the Midas boost was active this combat>
			"rounds" = <number of rounds for the monster this combat>
			"ttlDmg" = <total amount of damage the monster dealt this combat>
			"datetime" = <time of combat in server time (EST)>
		}]
		...
	}
	*/
	var monsterStatsString = localStorage.getItem("monsterStats");
	if (logging) {
		console.log("dang.combat_assist_extended    Stringified monsterStats from storage: " + monsterStatsString);
	}

	var monsterStats = {};
	if (monsterStatsString == null) {
		// This is the first time running this or the stats have been cleared. (Re)create the monster stats object.
		console.log("dang.combat_assist_extended    Created monsterStats object.");
	} else {
		monsterStats = JSON.parse(monsterStatsString);
	}

	// Collect the monster stats. Start with the coin drop stat (this is also the most reliable way to get the monster name.
	var monsterObj = addMnstrCoinStats(monsterStats, htmlContent.endResult);
	if (monsterObj != null) {
		// Now add the monster rounds and total damage stats.
		addMnstrCombatStats(monsterObj, htmlContent.pageContent);
		// Add player stats
		collectPlrStats(monsterObj, htmlContent.pageContent);
	}

	monsterStatsString = JSON.stringify(monsterStats);
	if (logging) {
		console.log("dang.combat_assist_extended    Stringified monsterStats: " + monsterStatsString);
	}
	localStorage.monsterStats = monsterStatsString;
}

function collectAllStats() {
	var htmlContent = {
		pageContent: $("#page2").html(),
		endResult: $("#end_result").html()
	};

	collectMnstrStats(htmlContent);
}

function CSVExport() {
	console.log("dang.combat_assist_extended    Gathering data for export.");
	var monsterStatsString = localStorage.getItem("monsterStats");
	if (monsterStatsString == null) {
		// No monster stats collected. Abort.
		alert("There are no monster stats to export.");
		return;
	} else {
		var monsterStats = JSON.parse(monsterStatsString);

		var csvArray = [[
			"Monster Name",
			"Combat time (EST)",
			"Normal Coin Drops",
			"Midas Coin Drops",
			"Monster Rounds",
			"Monster Damage Dealt (Total)",
			"Player rounds",
			"Player Damage Dealt (Total)",
			"Normal Attacks",
			"Defense Attacks",
			"Strength Attacks",
			"Critical Attacks",
			"Arcane Attacks",
			"Archery Attacks",
			"Attacks Damage",
			"Defended Damage",
			"Strength Damage",
			"Critical Damage",
			"Arcane Damage",
			"Archery Damage",
			"Attack Experience",
			"Defense Experience",
			"Strength Experience",
			"Critical Experience (all skills)",
			"Arcane Experience",
			"Archery Experience",
			"Health Experience",
			"Clan attack experience",
			"Clan archery experience",
			"Clan arcane experience",
			"Clan defense experience",
			"Clan health experience",
			"Clan strength experience",
			"Primary pet type",
			"Experience from primary pet",
			"Experience gained by primary pet",
			"Secondary pet type",
			"Experience from secondary pet",
			"Experience gained by secondary pet",
			"Secondary pet data 1",
			"Secondary pet data 2",
			"Summon name",
			"Summon Attacks",
			"Summon Damage",
			"Summon Experience"
		]];

		for (var monster in monsterStats) {
			var monsterObjList = monsterStats[monster];

			for (var index in monsterObjList) {
				var monsterObj = monsterObjList[index];
				var playerObj = monsterObj.playerStats;

				var normalCoin = "";
				var boostCoin = "";
				if (monsterObj.midasBoost) {
					boostCoin = monsterObj.coins;
				} else {
					normalCoin = monsterObj.coins;
				}

				var csvRow = [
					monster,
					(monsterObj.datetime) ? monsterObj.datetime.replace(',', '') : monsterObj.datetime,
					normalCoin,
					boostCoin,
					monsterObj.rounds,
					monsterObj.ttlDmg
				];

				if (playerObj != null) {
					csvRow = csvRow.concat([
						playerObj.rounds,
						playerObj.ttlDmg,
						playerObj.atkNml,
						playerObj.atkDef,
						playerObj.atkStr,
						playerObj.atkCrt,
						playerObj.atkAcn,
						playerObj.atkAch,
						playerObj.dmgNml,
						playerObj.dmgDef,
						playerObj.dmgStr,
						playerObj.dmgCrt,
						playerObj.dmgAcn,
						playerObj.dmgAch,
						playerObj.expAtk,
						playerObj.expDef,
						playerObj.expStr,
						playerObj.expCrt,
						playerObj.expAcn,
						playerObj.expAch,
						playerObj.expHlt,
						playerObj.clnAtk,
						playerObj.clnAch,
						playerObj.clnAcn,
						playerObj.clnDef,
						playerObj.clnHlt,
						playerObj.clnStr,
						playerObj.prmPetType,
						playerObj.prmPetPlrExp,
						playerObj.prmPetExp,
						playerObj.secPetType,
						playerObj.secPetPlrExp,
						playerObj.secPetExp,
						playerObj.secPetData1,
						playerObj.secPetData2,
						playerObj.smnName,
						playerObj.smnAtk,
						playerObj.smnDmg,
						playerObj.smnExp
					]);
				}

				csvArray.push(csvRow);
			}
		}
		console.log("dang.combat_assist_extended    Data gathered.");

		csvGenerator = new CsvGenerator(csvArray, 'Monster_Stats.csv');
		csvGenerator.download(true);
		console.log("dang.combat_assist_extended    Exported.");
	}
}



function combatLogic() {
	highlightHlth();

	if (collectStats) {
		collectAllStats();

		$("#page2").append('<div id="dex_gos_combat_buttons" style="text-align:center"><span id="dex_gos_export_combat_stats" class="btn1" style="display: inline-block; width: 40%">Export Combat Stats</span><span id="dex_gos_spacer" style="display: inline-block; width: 15%"/><span id="dex_gos_clear_combat_stats" class="btn2">Clear Combat Stats</span></div>');
		$("#dex_gos_export_combat_stats").click(CSVExport);

		$("#dex_gos_clear_combat_stats").click(function() {
			console.log("dang.combat_assist_extended    Clearing all combat stats.");
			localStorage.removeItem("monsterStats");
			alert("Stats cleared.");
		});
	}
}

callbackIfPageMatched(/^fight.php/i, combatLogic);

// This CSV creation library came from https://github.com/AlexLibs/client-side-csv-generator
// It is inlined here because GreasyFork wouldn't let me upload my script with the reference to this site/library.
function CsvGenerator(dataArray, fileName, separator, addQuotes) {
	this.dataArray = dataArray;
	this.fileName = fileName;
	this.separator = separator || ',';
	this.addQuotes = !!addQuotes;

	if (this.addQuotes) {
		this.separator = '"' + this.separator + '"';
	}

	this.getDownloadLink = function () {
		var separator = this.separator;
		var addQuotes = this.addQuotes;

		var rows = this.dataArray.map(function (row) {
			var rowData = row.join(separator);

			if (rowData.length && addQuotes) {
				return '"' + rowData + '"';
			}

			return rowData;
		});

		var type = 'data:text/csv;charset=utf-8';
		var data = rows.join('\n');

		if (typeof btoa === 'function') {
			type += ';base64';
			data = btoa(data);
		} else {
			data = encodeURIComponent(data);
		}

		return this.downloadLink = this.downloadLink || type + ',' + data;
	};

	this.getLinkElement = function (linkText) {
		var downloadLink = this.getDownloadLink();
		var fileName = this.fileName;
		this.linkElement = this.linkElement || (function() {
			var a = document.createElement('a');
			a.innerHTML = linkText || '';
			a.href = downloadLink;
			a.download = fileName;
			return a;
		}());
		return this.linkElement;
	};

	// call with removeAfterDownload = true if you want the link to be removed after downloading
	this.download = function (removeAfterDownload) {
		var linkElement = this.getLinkElement();
		linkElement.style.display = 'none';
		document.body.appendChild(linkElement);
		linkElement.click();
		if (removeAfterDownload) {
			document.body.removeChild(linkElement);
		}
	};
}
