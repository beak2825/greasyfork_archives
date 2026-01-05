// ==UserScript==
// @name           BvS Data Analyser
// @namespace      TheSpy
// @description    Collect information from miscellaneous pages and send it to a remote server for further statistics
// @include        http*://*animecubed.com/billy/bvs/playerstandings.html
// @include        http*://*animecubed.com/billy/bvs/playerstandings.html?rankid=*
// @include        http*://*animecubed.com/billy/bvs/playerstandings.html?rankname=*
// @include        http*://*animecubed.com/billy/bvs/vlookup.html
// @include        http*://*animecubed.com/billy/bvs/vlookup.html?village=*
// @include        http*://*animecubed.com/billy/bvs/lookup.html
// @include        http*://*animecubed.com/billy/bvs/lookup.html?player=*
// @include        http*://*animecubed.com/billy/bvs/arena.html
// @include        http*://*animecubed.com/billy/bvs/bingofight.html
// @include        http*://*animecubed.com/billy/
// @include        http*://*animecubedgaming.com/billy/bvs/playerstandings.html
// @include        http*://*animecubedgaming.com/billy/bvs/playerstandings.html?rankid=*
// @include        http*://*animecubedgaming.com/billy/bvs/playerstandings.html?rankname=*
// @include        http*://*animecubedgaming.com/billy/bvs/vlookup.html
// @include        http*://*animecubedgaming.com/billy/bvs/vlookup.html?village=*
// @include        http*://*animecubedgaming.com/billy/bvs/lookup.html
// @include        http*://*animecubedgaming.com/billy/bvs/lookup.html?player=*
// @include        http*://*animecubedgaming.com/billy/bvs/arena.html
// @include        http*://*animecubedgaming.com/billy/bvs/bingofight.html
// @include        http*://*animecubedgaming.com/billy/
// @version	   1.12
// @history        1.12 New domain - animecubedgaming.com - Channel28
// @history        1.11 Now https compatible (Updated by Channel28)
// @history        1.10 Added grant permissions (Updated by Channel28)
// @history        1.09 Fixed: top item count
// @history        1.08 Fixed: searching for a player threw an error
// @history        1.07 Fixed: sponsor awesome is now subtracted from total awesome
// @history        1.06 Fixed: asterisk on ranking broke the script (winsock)
// @history        1.05 Fixed: version string
// @history        1.04 Added: Protagonist rank (winsock)
// @history        1.03 Fixed: a DOM issue (temporary fix)
// @history        1.02 Added: this hour's top item count
// @history        1.02 Changed: exception handling
// @history        1.01 Fixed: A few bugs
// @history        1.00 Initial release
// @licence        MIT; http://www.opensource.org/licenses/mit-license.php
// @copyright      2011-2012, TheSpy
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/2490/BvS%20Data%20Analyser.user.js
// @updateURL https://update.greasyfork.org/scripts/2490/BvS%20Data%20Analyser.meta.js
// ==/UserScript==


/***************************************************************
* DOM Storage Wrapper Class
* 
* Public members:
*     ctor({"session"|"local"}[, <namespace>])
*     setItem(<key>, <value>)
*     getItem(<key>, <default value>)
*     removeItem(<key>)
*     keys()
***************************************************************/
function Storage(type, namespace) {
	var object = this;

	if(typeof(type) != "string")
		type = "session";

	switch(type) {
		case "local": {
			object.storage = localStorage;
		} break;

		case "session": {
			object.storage = sessionStorage;
		} break;

		default: {
			object.storage = sessionStorage;
		} break;
	}

	if (!namespace || (typeof(namespace) != "string" && typeof(namespace) != "number"))
		namespace = "ScriptStorage";

	object.namespace = [namespace, "."].join("");

	object.setItem = function(key, value) {
		try {
			object.storage.setItem(escape([object.namespace, key].join("")), uneval(value));
		}
		catch(e) {
		}
	}

	object.getItem = function(key, defaultValue) {
		try {
			var value = object.storage.getItem(escape([object.namespace, key].join("")));
			if(value)
				return eval(value);
			else
				return defaultValue;
		}
		catch(e) {
			return defaultValue;
		}
	}

	object.removeItem = function(key) {
		try {
			object.storage.removeItem(escape([object.namespace, key].join("")));
		}
		catch(e) {
		}
	}

	object.keys = function() {
		var array = [];
		var i = 0;
		do {
			try {
				var key = unescape(object.storage.key(i++));
				if(key.indexOf(object.namespace) == 0 && object.storage.getItem(key))
					array.push(key.slice(object.namespace.length));
			}
			catch(e) {
				break;
			}
		} while(true);
		return array;
	}
}

// UI (credits: http://userscripts.org/users/dtkarlsson)
function Window(id, storage) {
	var my = this;
	my.id = id;
	my.offsetX = 0;
	my.offsetY = 0;
	my.moving = false;
	my.element = document.createElement("div");
	my.elementContainer = document.createElement("div");

	// Window dragging events
	my.drag = function(event) {
		if (my.moving) {
			my.elementContainer.style.left = (event.clientX - my.offsetX)+'px';
			my.elementContainer.style.top = (event.clientY - my.offsetY)+'px';
			event.preventDefault();
		}
	}
	my.stopDrag = function(event) {
		if (my.moving) {
			my.moving = false;
			var x = parseInt(my.elementContainer.style.left);
			var y = parseInt(my.elementContainer.style.top);
			if(x < 0) x = 0;
			if(y < 0) y = 0;
			storage.setItem(my.id + ".coord.x", x);
			storage.setItem(my.id + ".coord.y", y);
			my.elementContainer.style.opacity = 1;
			my.elementContainer.removeEventListener('mouseup', my.stopDrag, true);
			my.elementContainer.removeEventListener('mousemove', my.drag, true);
		}
	}
	my.startDrag = function(event) {
		if (event.button != 0) {
			my.moving = false;
			return;
		}
		my.offsetX = event.clientX - parseInt(my.elementContainer.style.left);
		my.offsetY = event.clientY - parseInt(my.elementContainer.style.top);
		my.moving = true;
		my.elementContainer.style.opacity = 0.75;
		event.preventDefault();
		my.elementContainer.addEventListener('mouseup', my.stopDrag, true);
		my.elementContainer.addEventListener('mousemove', my.drag, true);
	}

	my.elementContainer.id = id;
	my.elementContainer.className = "drag";
	document.body.appendChild(my.elementContainer);
	my.elementContainer.appendChild(my.element);
	my.elementContainer.addEventListener('mousedown', my.startDrag, true);

	if (storage.getItem(my.id + ".coord.x"))
		my.elementContainer.style.left = storage.getItem(my.id + ".coord.x") + "px";
	else
		my.elementContainer.style.left = "6px";
	if (storage.getItem(my.id + ".coord.y"))
		my.elementContainer.style.top = storage.getItem(my.id + ".coord.y") + "px";
	else
		my.elementContainer.style.top = "6px";
}

function FloatingAnalyser() {
	var my = this;
	my.window = new Window("BvSDataAnalyser", analyserSettings);
	GM_addStyle("#BvSDataAnalyser {border: 2px solid #00FF00; position: fixed; z-index: 100; font-size: 12px; font-family: courier new; color: #00FF00; background-color: black; padding: 6px; text-align: left; min-height: 16px; cursor: move;} #BvSDataAnalyser div div {border: 2px solid #00FF00; margin-top: 6px;}");

	my.addText = function(text) {
		if(my.window.element.innerHTML.length > 0)
			my.window.element.innerHTML = [my.window.element.innerHTML, text].join("<br/>");
		else
			my.window.element.innerHTML = text;
	}

	my.setText = function(text) {
		my.window.element.innerHTML = text;
	}
}

var analyserSettings = new Storage("local", "BvSDataAnalyser");
var analyserWindow = new FloatingAnalyser();
analyserWindow.setText("<blink>Loading...</blink>");

// StripString(string)
function StripString(string) {
	string = string.replace(/^\s+/g, "");
	string = string.replace(/\s+$/g, "");
	string = string.replace(/\s+/g, " ");
	return string;
}

// QueryServer(arguments)
function QueryServer(arguments) {
	try {
		arguments = [arguments, "version=1.03"].join("&");
		GM_xmlhttpRequest({
			method: "POST",
			url: "http://bvs.ecansol.com/analyser/",
			headers: {
				"User-Agent": "Mozilla/5.0",
				"Accept": "text/xml",
				"Content-type": "application/x-www-form-urlencoded"
			},
			data: encodeURI(arguments),
			onerror: function(response) {
				analyserWindow.setText(["<b>Error:</b> ", response.status].join(""));
			},
			onload: function(response) {
				try {
					analyserWindow.setText(response.responseText);
				}
				catch(e) {
					throw ["QueryServer(arguments)|sub: ", e].join("");
				}
			}
		});
	}
	catch(e) {
		throw ["QueryServer(arguments): ", e].join("");
	}
}

// AwesomeAnalyser()
function AwesomeAnalyser() {
	try {
		var arguments = new Array();
		var players = new Array();
		var player;
		var deleted = true;
		var regexp = location.href.match(/playerstandings.html.rankname=(.*)$/i);
		if(regexp && regexp[1]) {
			player = decodeURI(regexp[1]).replace(/_/g, " ");
		}
		var snap = document.evaluate("//font/table[contains(translate(@bgcolor, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'ffffff')]/tbody/tr[position() > 1]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for(var i = 0; i < snap.snapshotLength; i++) {
			try {
				var regexp = StripString(snap.snapshotItem(i).textContent.replace(/,/gi, "")).match(/^(\d+).\s([a-z0-9 ]{3,10})(\*?)\s(\d+)\s\d+\s\d+$/i);
				if(regexp) {
					players.push(["players[", regexp[2], "]=", regexp[3] == "*" ? regexp[4] - 11 : regexp[4]].join(""));
					if(regexp[2].toLowerCase() == player.toLowerCase()) {
						deleted = false;
					}
				}
			}
			catch(e) {
			}
		}
		if(players.length > 0) {
			arguments.push(players.join("&"));
		}
		else if(player) {
			arguments.push(["idle=", player].join(""));
		}
		if(deleted == true) {
			arguments.push(["deleted=", player].join(""));
		}
		arguments.push("page=playerstandings");
		QueryServer(arguments.join("&"));
	}
	catch(e) {
		throw ["AwesomeAnalyser(): ", e].join("");
	}
}

// VillageAnalyser()
function VillageAnalyser() {
	try {
		var arguments = new Array();
		var players = new Array();
		var village;
		var regexp = location.href.match(/vlookup.html.village=(.*)$/i);
		if(regexp && regexp[1]) {
			village = decodeURI(regexp[1]).replace(/_/g, " ");
		}
		var snap = document.evaluate("//b[contains(text(), 'Village') and contains(../text(), 'Village Hidden')]/..", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if(snap.snapshotLength == 1) {
			try {
				var regexp = StripString(snap.snapshotItem(0).textContent.replace(/,/gi, "")).match(/^([a-z0-9 ]{3,10}) Village-The Village Hidden in ([a-z0-9 ]{3,15}) -/i);
				if(regexp) {
					arguments.push(["village=", regexp[1]].join(""));
					arguments.push(["description=", regexp[2]].join(""));
				}
			}
			catch(e) {
			}
		}
		else if(village) {
			arguments.push(["deleted=", village].join(""));
		}
		var snap = document.evaluate("//a[contains(@href, 'lookup.html')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for(var i = 0; i < snap.snapshotLength; i++) {
			try {
				players.push(["players[]=", StripString(snap.snapshotItem(i).textContent)].join(""));
			}
			catch(e) {
			}
		}
		var snap = document.evaluate("//b[contains(../text(), 'Number of Upgrades')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if(snap.snapshotLength == 1) {
			try {
				arguments.push(["upgrades=", StripString(snap.snapshotItem(0).textContent)].join(""));
			}
			catch(e) {
			}
		}
		if(players.length > 0) {
			arguments.push(players.join("&"));
		}
		arguments.push("page=vlookup");
		QueryServer(arguments.join("&"));
	}
	catch(e) {
		throw ["VillageAnalyser(): ", e].join("");
	}
}

// PlayerAnalyser()
function PlayerAnalyser() {
	try {
		var arguments = new Array();
		var stringArray = new Array();
		var player;
		var regexp = location.href.match(/lookup.html.player=(.*)$/i);
		if(regexp && regexp[1]) {
			player = decodeURI(regexp[1]).replace(/_/g, " ");
		}
		var snap = document.evaluate("//center/table/tbody/tr[2]/td/font/table//text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for(var i = 0; i < snap.snapshotLength; i++) {
			try {
				if(snap.snapshotItem(i).nodeValue.length > 0)
					stringArray.push(snap.snapshotItem(i).nodeValue);
			}
			catch(e) {
			}
		}
		if(stringArray.length > 0) {
			var string = StripString(stringArray.join(" ")).replace(/,/gi, "");
			if(/The slightest thought of them has you quaking in fear!/.test(string)) {
				if(!player) {
					player = document.evaluate("//center/i/b/font/text()", document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue.nodeValue.replace(/,/gi, "");
				}
				arguments.push(["player=", player].join(""));
				var match = null;
				if(match = string.match(new RegExp(["The (\\d+).. Immortal Kaiju ", player, " (.*) Village - The Village Hidden in (.*) - "].join(""), "i"))) {
					arguments.push(["kaiju=", match[1]].join(""));
					arguments.push(["village=", match[2]].join(""));
					arguments.push(["description=", match[3]].join(""));
				}
				else if(match = string.match(new RegExp(["The (\\d+).. Immortal Kaiju ", player, " No Village "].join(""), "i"))) {
					arguments.push(["kaiju=", match[1]].join(""));
				}

				if(match = string.match(/Permanent Items: (\d+)/i))
					arguments.push(["permanent=", match[1]].join(""));
				if(match = string.match(/Trophies: (\d+)/i))
					arguments.push(["trophies=", match[1]].join(""));
				if(match = string.match(/Season (\d+)/i))
					arguments.push(["season=", match[1]].join(""));
				if(match = string.match(/Player Ranking: Idle/i))
					arguments.push("idle=1");
				if(match = string.match(/Students: (\d+)/i))
					arguments.push(["students=", match[1]].join(""));
			}
			else {
				arguments.push("kaiju=0");
				if(!player) {
					player = document.evaluate("//td[contains(translate(@bgcolor, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'04470a')]/font[contains(translate(@color, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'ffffff')]/b/text()", document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue.nodeValue.replace(/,/gi, "");
				}
				arguments.push(["player=", player].join(""));
				var ranks = new Array("Genin", "Chunin", "Special Jonin \\(Genjutsu\\)", "Special Jonin \\(Ninjutsu\\)", "Special Jonin \\(Taijutsu\\)", "Jonin", "Sannin", "R00t", "Protagonist");
				var match = null;
				for(var i = 0; i < ranks.length; i++) {
					if(match = string.match(new RegExp(["Level: (\\d+) - ", ranks[i], " (.*) Village - The Village Hidden in (.*) - "].join(""), "i"))) {
						arguments.push(["level=", match[1]].join(""));
						arguments.push(["village=", match[2]].join(""));
						arguments.push(["description=", match[3]].join(""));
						arguments.push(["rank=", ranks[i]].join(""));
						break;
					}
					else if(match = string.match(new RegExp(["Level: (\\d+) - ", ranks[i], " No Village "].join(""), "i"))) {
						arguments.push(["level=", match[1]].join(""));
						arguments.push(["rank=", ranks[i]].join(""));
						break;
					}
				}

				if(match = string.match(/Permanent Items: (\d+)/i))
					arguments.push(["permanent=", match[1]].join(""));
				if(match = string.match(/Trophies: (\d+)/i))
					arguments.push(["trophies=", match[1]].join(""));
				if(match = string.match(/Season (\d+)!/i))
					arguments.push(["season=", match[1]].join(""));
				if(match = string.match(/Player Ranking: Idle/i))
					arguments.push("idle=1");
				if(match = string.match(/Students: (\d+)/i))
					arguments.push(["students=", match[1]].join(""));
				if(match = string.match(/Genjutsu: (\d+)/i))
					arguments.push(["gen=", match[1]].join(""));
				if(match = string.match(/Ninjutsu: (\d+)/i))
					arguments.push(["nin=", match[1]].join(""));
				if(match = string.match(/Taijutsu: (\d+)/i))
					arguments.push(["tai=", match[1]].join(""));
				if(match = string.match(/Doujutsu: (\d+)/i))
					arguments.push(["dou=", match[1]].join(""));

				var snap = document.evaluate("//td[contains(translate(@bgcolor, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'008010') or contains(translate(@bgcolor, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'006000')]/text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				for(var i = 0; i < snap.snapshotLength; i++) {
					try {
						if(snap.snapshotItem(i).nodeValue.length > 0)
							if(match = StripString(snap.snapshotItem(i).nodeValue).match(/^([A-Za-z]+): (\d)$/i))
								arguments.push(["zombja[", match[1], "]=", match[2]].join(""));
					}
					catch(e) {
					}
				}

				var snap = document.evaluate("//td[contains(translate(@bgcolor, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'c0efc5') or contains(translate(@bgcolor, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'dcf8db')]/text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				for(var i = 0; i < snap.snapshotLength; i++) {
					try {
						if(snap.snapshotItem(i).nodeValue.length > 0)
							if(match = StripString(snap.snapshotItem(i).nodeValue).match(/^([A-Za-z0-9 ]+) Missions: (\d+)$/i))
								arguments.push(["mission[", match[1], "]=", match[2]].join(""));
					}
					catch(e) {
					}
				}
			}
		}
		else if(player && player.length > 0 && /\/billy\/layout\//.test(document.body.innerHTML))
			arguments.push(["deleted=", player].join(""));
		else
			analyserWindow.setText("Can't detect player's name.");

		arguments.push("page=playerinfo");
		if(player && player.length > 0)
			QueryServer(arguments.join("&"));
	}
	catch(e) {
		throw ["PlayerAnalyser(): ", e].join("");
	}
}

// ArenaAnalyser()
function ArenaAnalyser() {
	try {
		var arguments = new Array();
		var stringArray = null;
		var string = null;
		var player = null;
		var snap = document.evaluate("//td[./table/tbody/tr/td/img[@src='/billy/layout/blank.gif']]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for(var i = 0; i < snap.snapshotLength; i++) {
			try {
				stringArray = new Array();
				var snapPlayer = document.evaluate(".//text()", snap.snapshotItem(i), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				for(var j = 0; j < snapPlayer.snapshotLength; j++) {
					try {
						if(snapPlayer.snapshotItem(j).nodeValue.length > 0)
							stringArray.push(snapPlayer.snapshotItem(j).nodeValue);
					}
					catch(e) {
					}
				}
				string = StripString(stringArray.join(" ")).replace(/,/gi, "");
				var ranks = new Array("Genin", "Chunin", "Sp. Jonin \\(Gen\\)", "Sp. Jonin \\(Nin\\)", "Sp. Jonin \\(Tai\\)", "Jonin", "Sannin", "R00t", "Protagonist");
				var match = null;
				for(var k = 0; k < ranks.length; k++) {
					if(match = string.match(new RegExp(["^(.{3,10}) (BillyClub! )?(Attunement: [^ ]+ Moon ([^ ]+ )?)?Season (\\d+)! Level (\\d+) : ", ranks[k], " (.{1,30}) Village"].join(""), "i"))) {
						player = match[1];
						arguments.push(["player[", player, "][bc]=", match[2] ? 1 : 0].join(""));
						arguments.push(["player[", player, "][season]=", match[5] ? match[5] : 1].join(""));
						arguments.push(["player[", player, "][level]=", match[6]].join(""));
						arguments.push(["player[", player, "][rank]=", ranks[k]].join(""));
						arguments.push(["player[", player, "][village]=", match[7]].join(""));
						break;
					}
					else if(match = string.match(new RegExp(["^(.{3,10}) (BillyClub! )?(Attunement: [^ ]+ Moon ([^ ]+ )?)?Season (\\d+)! Level (\\d+) : ", ranks[k], " Rogue Ninja"].join(""), "i"))) {
						player = match[1];
						arguments.push(["player[", player, "][bc]=", match[2] ? 1 : 0].join(""));
						arguments.push(["player[", player, "][season]=", match[5] ? match[5] : 1].join(""));
						arguments.push(["player[", player, "][level]=", match[6]].join(""));
						arguments.push(["player[", player, "][rank]=", ranks[k]].join(""));
						break;
					}
				}

				if(player) {
					if(match = string.match(/Genjutsu: (\d+)/i))
						arguments.push(["player[", player, "][gen]=", match[1]].join(""));
					if(match = string.match(/Ninjutsu: (\d+)/i))
						arguments.push(["player[", player, "][nin]=", match[1]].join(""));
					if(match = string.match(/Taijutsu: (\d+)/i))
						arguments.push(["player[", player, "][tai]=", match[1]].join(""));
					if(match = string.match(/Doujutsu: (\d+)/i))
						arguments.push(["player[", player, "][dou]=", match[1]].join(""));
					if(match = string.match(/Ryo: (\d+)/i))
						arguments.push(["player[", player, "][ryo]=", match[1]].join(""));

					var snapItems = document.evaluate(".//td/span/text()", snap.snapshotItem(i), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
					for(var j = 0; j < snapItems.snapshotLength; j++) {
						arguments.push(["player[", player, "][items][]=", snapItems.snapshotItem(j).nodeValue.replace(/,/gi, "")].join(""));
					}
				}
			}
			catch(e) {
				throw ["ArenaAnalyser()|sub: ", e].join("");
			}
		}
		arguments.push("page=arena");
		QueryServer(arguments.join("&"));
	}
	catch(e) {
		throw ["ArenaAnalyser(): ", e].join("");
	}
}

// TopItemAnalyser()
function TopItemAnalyser() {
	try {
		var arguments = new Array();
		var snap = document.evaluate("//table[contains(translate(@bgcolor, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'e7cea9')]/tbody/tr/td/b/font/i/text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if(snap.snapshotLength == 1) {
			arguments.push(["item=", StripString(snap.snapshotItem(0).nodeValue)].join(""));

			var snapItems = document.evaluate("//table[contains(translate(@bgcolor, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'e7cea9') and contains(., 'Item Count')]/tbody/tr[position()>1]/td[1]/a/text() | //table[contains(translate(@bgcolor, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'e7cea9') and contains(., 'Item Count')]/tbody/tr[position()>1]/td[2]/text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			if(snapItems.snapshotLength == 20 || snapItems.snapshotLength == 22) {
				for(var i = 0; i < snapItems.snapshotLength; i += 2) {
					arguments.push(["itemcount[", StripString(snapItems.snapshotItem(i).nodeValue.replace(/\d+\. /i, "")), "]=", parseInt(snapItems.snapshotItem(i + 1).nodeValue)].join(""));
				}
			}
		}
		arguments.push("page=main");
		QueryServer(arguments.join("&"));
	}
	catch(e) {
		throw ["TopItemAnalyser(): ", e].join("");
	}
}

try {
	if(/animecubed.com.billy.bvs.playerstandings.html/i.test(location.href)) {
		var awesomeAnalyser = new AwesomeAnalyser();
	}

	if(/animecubed.com.billy.bvs.vlookup.html/i.test(location.href)) {
		var villageAnalyser = new VillageAnalyser();
	}

	if(/animecubed.com.billy.bvs.lookup.html/i.test(location.href)) {
		var playerAnalyser = new PlayerAnalyser();
	}

	if(/animecubed.com.billy.bvs.arena.html/i.test(location.href) || /animecubed.com.billy.bvs.bingofight.html/i.test(location.href)) {
		var arenaAnalyser = new ArenaAnalyser();
	}

	if(/animecubed.com.billy.$/i.test(location.href)) {
		var topItemAnalyser = new TopItemAnalyser();
	}
}
catch(e) {
	analyserWindow.setText(["<b>Caught exception:</b> ", e].join(""));
}