// ==UserScript==
// @name           BvS Ally Checker
// @namespace      TheSpy
// @description    Are you missing an ally?
// @include        http*://*animecubed.com/billy/bvs/team.html
// @include        http*://*animecubedgaming.com/billy/bvs/team.html
// @version        1.19
// @history        1.19 New domain - animecubedgaming.com - Channel28
// @history        1.18 Added: ElevenCats (Updated by Channel28)
// @history        1.17 Now https compatible (Updated by Channel28)
// @history        1.16 Added: Hero Quest allies (Mimi & BugMan Lvl 2), Poker allies (Potatoes & A A Ron), more MJ allies (Dora & Mafuru) - (Updated by MeP & Channel28)
// @history        1.15 Added grant permissions (Updated by Channel28)
// @history        1.14 Added: Hanafuda allies
// @history        1.13 Fixed: BurgerNinja allies
// @history        1.12 Fixed: Ol' Whitey
// @history        1.11 Fixed: BurgerNinja now show up
// @history        1.10 Moved: Bruce Sr., Lil' Ro, Mr. Smith, Nadeshiko from General to Glowslinging
// @history        1.10 Added: Bucketface to Glowslinging
// @history        1.09 Fixed: Bruce Jr.'s max level was 1, fixed to 2 now
// @history        1.08 Fixed: Flutie, Sticky, Tobby, The Twins, Karen all show as (max 2) if you have them at level 2
// @history        1.07 Fixed: Cipher showed up as max 2 if you had him level 1
// @history        1.07 Fixed: Completed categories can be displayed again
// @history        1.06 Added: You may now hide completed categories
// @history        1.05 Fixed: K-Dog & Triple H, Pandabear
// @history        1.04 Changed: Headers show how many level ups you're missing
// @history        1.04 Added: The HoClaus
// @history        1.04 Fixed: Trapchan is now maximum level 2
// @history        1.03 Added: K-Dog & Tiple H to Mahjong
// @history        1.03 Added: Level checking
// @history        1.02 Fixed: The block doesn't show up on the "Corfirm team" page anymore
// @history        1.02 Fixed: Ol' Whitey doesn't show up when Rayne/Touchy or Olmek (no Ol' Whitey) are found
// @history        1.02 Fixed: K.Y./Smokey the Bear issue (regular expression: smo[k]e[y])
// @history        1.01 Moved the whole block to the bottom
// @history        1.01 Fixed: Strawberry Lvl. 3/Mister Tea Lvl. 3, Right Lvl. 2/Anonymous Lvl. 2, Cipher/Cipher Lvl. 2/Lulu Lvl. 2/Su-chan Lvl. 2
// @history        1.00 Initial release
// @licence        MIT; http://www.opensource.org/licenses/mit-license.php
// @copyright      2011, Lunatrius
// @grant          GM_log
// @downloadURL https://update.greasyfork.org/scripts/2493/BvS%20Ally%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/2493/BvS%20Ally%20Checker.meta.js
// ==/UserScript==

// browser compatibility
function addStyle(css){
	var head = document.getElementsByTagName("head")[0];
	if (!head)
		return;
	var style = document.createElement("style");
	style.type = "text/css";
	style.textContent = css;
	head.appendChild(style);
}

// nifty stuff
var divMain = null;
var myAllies = [];
var specialAllies = [];
var listAllies = [];
var levelAllies = [];

// table style
addStyle([
	".alliesNormal {width: 95%; border-spacing: 1px; font-size:12px; background-color: #000000; margin-bottom: 4px;}",
	".alliesNormal thead {background-color: #DCB48C;}",
	".alliesNormal thead tr th {border: 1px outset #DCB48C; cursor: pointer;}",
	".alliesNormal tbody {background-color: #DCB48C;}",
	".alliesNormal tbody tr th {background-color: #DCB48C; border: 1px outset #DCB48C; width: 50%;}",
	".alliesNormal tbody tr td {background-color: #EAD8C3; padding: 3px;}",
	".alliesNormal a {color: #A10000;}"
].join("\n"));

// remove an element from the array (with the given value)
Array.prototype.remove = function(arrayItem) {
	for(var arrayIndex = 0; arrayIndex < this.length; arrayIndex++) {
		if((new RegExp(this[arrayIndex].replace(/\./gi, "\\."), "i")).test(arrayItem)) {
			this.splice(arrayIndex, 1);
			return true;
		}
	}
	return false;
}

// is an element in the array?
Array.prototype.inArray = function(arrayItem) {
	for(var arrayIndex = 0; arrayIndex < this.length; arrayIndex++) {
		if(this[arrayIndex] == arrayItem) {
			return true;
		}
	}
	return false;
}

// create the table containing item information
function generateTable(caption, have, need, type) {
	if(!divMain)
		return;

	// table
	var table = document.createElement("table");
	table.className = ["allies", type].join("");
	divMain.appendChild(table);

	// table header
	var thead = document.createElement("thead");
	table.appendChild(thead);

	// table header - row
	var thead_tr = document.createElement("tr");
	thead.appendChild(thead_tr);

	// table header column
	var thead_tr_th = document.createElement("th");
	thead_tr_th.setAttribute("colspan", "2");
	thead_tr_th.innerHTML = caption;
	thead_tr.appendChild(thead_tr_th);

	// table body
	var tbody = document.createElement("tbody");
	tbody.style.display = "none";
	table.appendChild(tbody);

	// table body - sub header row
	var tbody_tr = document.createElement("tr");
	tbody.appendChild(tbody_tr);

	// table body - sub header column 1
	var tbody_tr_th1 = document.createElement("th");
	tbody_tr_th1.innerHTML = "Already have";
	tbody_tr.appendChild(tbody_tr_th1);

	// table body - sub header column 2
	var tbody_tr_th2 = document.createElement("th");
	tbody_tr_th2.innerHTML = "Still need";
	tbody_tr.appendChild(tbody_tr_th2);

	// table body row
	var tbody_tr = document.createElement("tr");
	tbody.appendChild(tbody_tr);

	// table body column 1
	var tbody_tr_td1 = document.createElement("td");
	tbody_tr_td1.setAttribute("valign", "top");
	tbody_tr_td1.innerHTML = have;
	tbody_tr.appendChild(tbody_tr_td1);

	// table body column 2
	var tbody_tr_td2 = document.createElement("td");
	tbody_tr_td2.setAttribute("valign", "top");
	tbody_tr_td2.innerHTML = need;
	tbody_tr.appendChild(tbody_tr_td2);

	// add the click handler
	thead_tr_th.addEventListener('click', function() {
		if(tbody.style.display == "none") {
			tbody.style.display = "";
			thead_tr_th.style.borderStyle = "inset";
			thead_tr_th.style.color = "yellow";
		}
		else {
			tbody.style.display = "none";
			thead_tr_th.style.borderStyle = "outset";
			thead_tr_th.style.color = "";
		}
	}, true);
}

// ...
function levelCheck(ally) {
	for(var i in myAllies) {
		if((new RegExp(ally.replace(/\./gi, "\\."), "i")).test(myAllies[i])) {
			if(levelAllies[ally]) {
				if(levelAllies[ally] == 1) {
					if(ally == myAllies[i]) {
						return 0;
					}
					else {
						return levelAllies[ally];
					}
				}
				else {
					if([ally, " Lvl. ", levelAllies[ally]].join("") == myAllies[i]) {
						return 0;
					}
					else {
						return levelAllies[ally];
					}
				}
			}
			else {
				// GM_log(["missing: ", ally].join("")); // debug
				return "???";
			}
		}
	}
}

// ...
function normalCheck(caption, allies) {
	var have = "";
	var need = "";
	var levels = 0;
	var allies2 = [];

	// seperate allies
	for(var i in myAllies) {
		if(allies.remove(myAllies[i])) {
			allies2.push(myAllies[i]);
		}
	}

	// have
	allies2.sort();
	for(var i = 0; i < allies2.length; i++) {
		var level = levelCheck(allies2[i].replace(/ Lvl. \d/i, ""));
		if(level == 0) {
			have = [have, "<a href=\"http://bvs.wikidot.com/allies:", allies2[i], "\" target=\"_blank\">", allies2[i], "</a><br/>"].join("");
		}
		else {
			have = [have, "<a href=\"http://bvs.wikidot.com/allies:", allies2[i], "\" target=\"_blank\" style=\"color: red; font-weight: bold;\">", allies2[i], " (max ", level, ")", "</a><br/>"].join("");
			levels++;
		}
	}

	// need
	allies.sort();
	for(var i = 0; i < allies.length; i++) {
		need = [need, "<a href=\"http://bvs.wikidot.com/allies:", allies[i], "\" target=\"_blank\">", allies[i], "</a><br/>"].join("");
	}

	generateTable([caption, ((need.length > 0 || levels > 0) ? "" : " [Complete]"), (levels > 0 ? [" [", levels, " level up(s) missing]"].join("") : "")].join(""), have.length > 0 ? have : "<i>None</i>", need.length > 0 ? need : "<i>None</i>", "Normal");
}

// main stuff
function main() {
	var node = null;
	var snap = document.evaluate("//td[contains(.,'-Current Team-')]/p/a/b[contains(text(),'Back to Top')]/../..", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i = 0; i < snap.snapshotLength; i++) {
		node = snap.snapshotItem(i);
	}

	if(node == null) {
		return;
	}

	divMain = document.createElement("div");
	divMain.setAttribute("align", "center");
	divMain.setAttribute("style", "margin-top: 5px;");
	node.parentNode.insertBefore(divMain, node);

	var snap = document.evaluate("//div[@id='teamrep']/table/tbody/tr/td/label/b/text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i = 0; i < snap.snapshotLength; i++) {
		myAllies.push(snap.snapshotItem(i).nodeValue);
	}

	levelAllies["Annie"] = 2;
	levelAllies["Big Bo"] = 2;
	levelAllies["Big Ro"] = 2;
	levelAllies["Big Shammy"] = 2;
	levelAllies["Billy"] = 3;
	levelAllies["Bruce Jr."] = 2;
	levelAllies["Bugman"] = 1;
	if(myAllies.inArray("Bugman Lvl. 2")) levelAllies["Bugman"] = 2;
	levelAllies["Emosuke"] = 3;
	levelAllies["Flipper"] = 1;
	levelAllies["J-Diddy"] = 1;
	levelAllies["K-Dog"] = 2;
	levelAllies["K.Y."] = 2;
	levelAllies["Lil' Bo"] = 2;
	levelAllies["Lil' Shammy"] = 2;
	levelAllies["Lil' Whitey"] = 3;
	levelAllies["Master P"] = 1;
	levelAllies["Meatballs"] = 2;
	levelAllies["Mr. Sandman"] = 2;
	levelAllies["Pandabear"] = 2;
	levelAllies["Pinky"] = 3;
	levelAllies["Red Rover"] = 2;
	levelAllies["Rover's Mom"] = 1;
	levelAllies["Sicko"] = 1;
	levelAllies["Smokey the Bear"] = 2;
	levelAllies["SNAKEMAN"] = 1;
	levelAllies["Spot"] = 2;
	levelAllies["Stalkergirl"] = 3;
	levelAllies["Terri"] = 3;
	levelAllies["The Rack"] = 1;
	levelAllies["The Scar"] = 1;
	levelAllies["Timmy"] = 2;
	levelAllies["Trapchan"] = 2;
	levelAllies["Triple H"] = 2;
	levelAllies["Yuri"] = 3;
	levelAllies["Z-Dog"] = 1;

	levelAllies["The HoClaus"] = 1;

	levelAllies["Tsukasa"] = 2;
	levelAllies["Kagamin"] = 1;
	levelAllies["Kona-chan"] = 1;
	levelAllies["Yuki-chan"] = 1;

	levelAllies["Dora"] = 1;
	levelAllies["Mafuru"] = 1;
	levelAllies["Lil' Rack"] = 1;
	levelAllies["Sue"] = 2;
	levelAllies["TACOS"] = 1;

	levelAllies["Cato"] = 2;
	levelAllies["Doughman"] = 3;
	levelAllies["Olmek"] = 1;
	levelAllies["Tempest Kitsune"] = 1;

	levelAllies["Proof Reader"] = 1;

	levelAllies["Hyuk"] = 1;
	levelAllies["Anonymous"] = 2;
	levelAllies["Right"] = 2;
	levelAllies["LisaLisa"] = 2;

	levelAllies["Fletch"] = 1;
	levelAllies["Hermano"] = 1;
	levelAllies["MC Stripeypants"] = 2;
	levelAllies["Mister Six"] = 1;
	levelAllies["Robogirl"] = 3;
	levelAllies["Shorty"] = 2;
	levelAllies["Strawberry"] = 3;
	if(myAllies.inArray("Mister Tea Lvl. 3")) levelAllies["Strawberry"] = 2;
	levelAllies["Tats"] = 1;
	levelAllies["TicTac"] = 1;

	levelAllies["Blind Fury"] = 1;
	levelAllies["Hotsumoto"] = 1;
	levelAllies["Miss Kitty"] = 2;
	levelAllies["Mister Tea"] = 3;
	levelAllies["Scary"] = 1;
	levelAllies["Smiley"] = 1;
	levelAllies["Sporty"] = 2;
	levelAllies["Vanilla"] = 1;

	levelAllies["Bones"] = 1;
	if(myAllies.inArray("Bones Lvl. 2")) levelAllies["Bones"] = 2;
	levelAllies["Flutie"] = 1;
	if(myAllies.inArray("Flutie Lvl. 2")) levelAllies["Flutie"] = 2;
	levelAllies["Good Boy"] = 3;
	levelAllies["Haro"] = 1;
	levelAllies["Haus"] = 1;
	levelAllies["Larry"] = 1;
	levelAllies["Sticky"] = 1;
	if(myAllies.inArray("Sticky Lvl. 2")) levelAllies["Sticky"] = 2;
	levelAllies["The Twins"] = 1;
	if(myAllies.inArray("The Twins Lvl. 2")) levelAllies["The Twins"] = 2;
	levelAllies["Tubby"] = 1;
	if(myAllies.inArray("Tubby Lvl. 2")) levelAllies["Tubby"] = 2;

	levelAllies["Chunks"] = 1;
	levelAllies["Jaws"] = 1;
	levelAllies["Palmface"] = 1;
	levelAllies["The Paper"] = 1;
	levelAllies["Threads"] = 1;
	levelAllies["Venus"] = 1;

	levelAllies["Cici"] = 2;
	levelAllies["Lulu"] = 2;
	levelAllies["Su-chan"] = 2;

	levelAllies["Blondie"] = 1;
	levelAllies["Cipher"] = 1;
	if(myAllies.inArray("Cipher Lvl. 2")) levelAllies["Cipher"] = 2;
	levelAllies["Euthanasia"] = 1;
	levelAllies["Karen"] = 1;
	if(myAllies.inArray("Karen Lvl. 2")) levelAllies["Karen"] = 2;
	levelAllies["Nana"] = 1;

	levelAllies["Bruce Sr."] = 2;
	levelAllies["Bucketface"] = 1;
	levelAllies["Lil' Ro"] = 3;
	levelAllies["Mr. Smith"] = 2;
	levelAllies["Nadeshiko"] = 2;

	levelAllies["Grandmaster P"] = 1;
	levelAllies["Rayne"] = 1;
	levelAllies["Touchy"] = 1;
	levelAllies["Ol' Whitey"] = 1;
	
	levelAllies["Potatoes"] = 1;
	if(myAllies.inArray("Potatoes Lvl. 2")) levelAllies["Potatoes"] = 2;
	levelAllies["A A Ron"] = 1;
	if(myAllies.inArray("A A Ron Lvl. 2")) levelAllies["A A Ron"] = 2;
	levelAllies["Mafuru"] = 1;
  
  levelAllies["Mimi"] = 1;
  
  levelAllies["ElevenCats"] = 1;

	listAllies["regular"] = [
		"Annie",
		"Big Bo",
		"Big Ro",
		"Big Shammy",
		"Billy",
		"Bruce Jr.",
		"Bugman",
		"Emosuke",
		"Flipper",
		"J-Diddy",
		"K-Dog",
		"K.Y.",
		"Lil' Bo",
		"Lil' Shammy",
		"Lil' Whitey",
		"Master P",
		"Meatballs",
		"Mr. Sandman",
		"Pandabear",
		"Pinky",
		"Red Rover",
		"Rover's Mom",
		"Sicko",
		"Smokey the Bear",
		"SNAKEMAN",
		"Spot",
		"Stalkergirl",
		"Terri",
		"The Rack",
		"The Scar",
		"Timmy",
		"Trapchan",
		"Triple H",
		"Yuri",
		"Z-Dog"
	];
	if(!((myAllies.inArray("Rayne") || myAllies.inArray("Touchy")) || (myAllies.inArray("Olmek") && !myAllies.inArray("Ol' Whitey"))))
		listAllies["regular"].push("Ol' Whitey");

	listAllies["partyhouse"] = [
		"Yuri",
		"The Rack",
		"J-Diddy",
		"Kagamin",
		"Kona-chan",
		"Tsukasa",
		"Yuki-chan"
	];

	listAllies["partyhousehf"] = [
		"Big Ro Lvl. 2",
		"Big Shammy Lvl. 2",
		"Big Bo Lvl. 2",
		"Yuri Lvl. 3",
		"Cato lvl. 2"
	];

	listAllies["partyhousemj"] = [
		"Lil' Rack",
		"TACOS",
		"Dora",
		"Sue Lvl. 2",
		"Mafuru",
		"K-Dog Lvl. 2",
		"Triple H Lvl. 2"
	];

	listAllies["holiday"] = [
		"The HoClaus"
	];

	listAllies["season2"] = [
		"Cato",
		"Doughman",
		"Olmek",
		"Tempest Kitsune"
	];

	listAllies["season4"] = [
		"Proof Reader"
	];

	listAllies["thetrade"] = [
		"Hyuk",
		"LisaLisa"
	];
	if(myAllies.inArray("Right Lvl. 2"))
		listAllies["thetrade"].push("Right");
	else if(myAllies.inArray("Anonymous Lvl. 2"))
		listAllies["thetrade"].push("Anonymous");
	else {
		listAllies["thetrade"].push("Right");
		listAllies["thetrade"].push("Anonymous");
	}

	listAllies["reaper"] = [
		"Fletch",
		"Hermano",
		"MC Stripeypants",
		"Mister Six",
		"Robogirl",
		"Shorty",
		"Strawberry",
		"Tats",
		"TicTac"
	];

	listAllies["monochrome"] = [
		"Blind Fury",
		"Hotsumoto",
		"Miss Kitty",
		"Scary",
		"Smiley",
		"Sporty",
		"Vanilla"
	];
	if(!myAllies.inArray("Strawberry Lvl. 3"))
		listAllies["monochrome"].push("Mister Tea");

	listAllies["outskirts"] = [
		"Bones",
		"Haro",
		"Haus",
		"Flutie",
		"Good Boy",
		"Larry",
		"Sticky",
		"The Twins",
		"Tubby"
	];

	listAllies["wasteland"] = [
		"Jaws",
		"The Paper",
		"Venus",
		"Chunks",
		"Palmface",
		"Threads"
	];

	listAllies["burgerninja"] = [
		"Cici"
	];
	if(!(myAllies.inArray("Cipher") || myAllies.inArray("Cipher Lvl. 2"))) {
		listAllies["burgerninja"].push("Lulu");
		listAllies["burgerninja"].push("Su-chan");
	}

	listAllies["pizzawitch"] = [
		"Blondie",
		"Cipher",
		"Euthanasia",
		"Karen",
		"Nana"
	];

	listAllies["eots"] = [
	];
	if(myAllies.inArray("Grandmaster P"))
		listAllies["eots"].push("Grandmaster P");
	else if(myAllies.inArray("Rayne"))
		listAllies["eots"].push("Rayne");
	else if(myAllies.inArray("Touchy"))
		listAllies["eots"].push("Touchy");
	else {
		listAllies["eots"].push("Grandmaster P");
		listAllies["eots"].push("Rayne");
		listAllies["eots"].push("Touchy");
	}

	listAllies["glowslinging"] = [
		"Bruce Sr.",
		"Bucketface",
		"Lil' Ro",
		"Mr. Smith",
		"Nadeshiko"
	];

	listAllies["perfectpoker"] = [
		"Potatoes",
		"A A Ron",
	];
       
	listAllies["heroquest"] = [
		"Bugman Lvl. 2",
		"Mimi"
	];
       
	listAllies["arena"] = [
		"ElevenCats"
	];


	var a = document.createElement("a");
	a.style.color = "#A10000";
	a.style.fontWeight = "bold";
	a.style.fontSize = "12px";
	a.style.cursor = "pointer";
	a.innerHTML = "Hide/Show completed";
	a.addEventListener('click', function() {
		var snap = document.evaluate("//table[contains(.//text(),'[Complete]')]", divMain, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var i = 0; i < snap.snapshotLength; i++) {
			if(snap.snapshotItem(i).style.display == "")
				snap.snapshotItem(i).style.display = "none";
			else
				snap.snapshotItem(i).style.display = "";
		}
	}, true);
	divMain.appendChild(a);

	normalCheck("Regular", listAllies["regular"]);
	normalCheck("Partyhouse", listAllies["partyhouse"]);
	normalCheck("Partyhouse - Hanafuda", listAllies["partyhousehf"]);
	normalCheck("Partyhouse - Mahjong", listAllies["partyhousemj"]);
	normalCheck("Holiday", listAllies["holiday"]);
	normalCheck("Season 2+", listAllies["season2"]);
	normalCheck("Season 4+", listAllies["season4"]);
	normalCheck("The Trade", listAllies["thetrade"]);
	normalCheck("Reaper", listAllies["reaper"]);
	normalCheck("Monochrome", listAllies["monochrome"]);
	normalCheck("Outskirts", listAllies["outskirts"]);
	normalCheck("Wasteland", listAllies["wasteland"]);
	normalCheck("BurgerNinja", listAllies["burgerninja"]);
	normalCheck("PizzaWitch", listAllies["pizzawitch"]);
	normalCheck("Glowslinging", listAllies["glowslinging"]);
	normalCheck("Eye of the Storm", listAllies["eots"]);
	normalCheck("Shop - Perfect Poker", listAllies["perfectpoker"]);
	normalCheck("Hero Quest", listAllies["heroquest"]);
	normalCheck("Arena", listAllies["arena"]);
}

// ...
main();