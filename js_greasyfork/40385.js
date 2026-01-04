// NOTE TO USERS of McNimble's Keyboard plugin:
// You must put PE+ higher up in your Tampermonkey list of scripts than Keyboard,
// otherwise keyboard shortcuts will not work at Primary Enemy screen.

// ==UserScript==
// @name        PE+
// @author      Psydev
// @copyright   Psydev, 2018
// @license     Lesser Gnu Public License, version 3
// @description For planets.nu - Aligns and shortens primary enemy menu.
// @namespace   psydev/planets.nu
// @include     http://planets.nu/*
// @include     http://play.planets.nu/*
// @include     http://test.planets.nu/*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40385/PE%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/40385/PE%2B.meta.js
// ==/UserScript==

vgapShipScreen.prototype.primaryEnemy = function() {
	vgap.more.empty();
//	var cls = "OrdersScreen";
	var cls = "OrdersScreenSmall";
//	if (vgap.players.length > 15)
//		cls = "OrdersScreenSmall";

	var html = "<div id='" + cls + "'>";
	if (vgap.players.length <= 15)
		html += "<h1>" +  nu.t.selectprimaryenemy + "</h1><p>" + nu.t.primaryenemydef + "</p>";
	html += "<p id='Enemies'></p></div>";
	$(html).appendTo(vgap.more);

	$("<div>None</div>").tclick(function() { vgap.shipScreen.selectEnemy(0); }).appendTo("#Enemies");
	$("<table>").appendTo("#Enemies");
	function jsUcfirst(string)
	{
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	for (var i = 0; i < vgap.players.length; i++) {
		var player = vgap.players[i];
		if (player.id != vgap.player.id) {
			var race = vgap.getRace(player.raceid);
			if (race.name != "Unknown") {
				var shortName = race.name;
				if (race.name == "The Solar Federation") {shortName = "Feds";}
				if (race.name == "The Lizard Alliance") {shortName = "Lizards";}
				if (race.name == "The Empire of the Birds") {shortName = "Birds";}
				if (race.name == "The Fascist Empire") {shortName = "Fascists";}
				if (race.name == "The Privateer Bands") {shortName = "Privateer";}
				if (race.name == "The Cyborg") {shortName = "Cyborg";}
				if (race.name == "The Crystal Confederation") {shortName = "Crystals";}
				if (race.name == "The Robotic Imperium") {shortName = "Robots";}
				if (race.name == "The Evil Empire") {shortName = "Empire";}
				if (race.name == "The Rebel Confederation") {shortName = "Rebels";}
				if (race.name == "The Missing Colonies of Man") {shortName = "Colonies";}
				if (race.name == "The Horwasp Plague") {shortName = "Horwasp";}
				var newPlayerName = "new";
				if (player.username.includes("dead ") == 1) {newPlayerName  = "";}
				if (player.username.includes("open ") == 1) {newPlayerName = "(open)";}
//				if (newPlayerName == "new" && newPlayerName != "(open)") {newPlayerName = player.username.toUpperCase();}
				if (newPlayerName == "new" && newPlayerName != "(open)") {newPlayerName = jsUcfirst(player.username);}
				var select = function (id) { return function () { vgap.shipScreen.selectEnemy(id); }; }; //closure
				$("<tr><td>" + player.id.toString(36).toUpperCase() + "</td><td>&nbsp;&nbsp;&nbsp;&nbsp;" + shortName + "</td><td>&nbsp;&nbsp;&nbsp;&nbsp;" + newPlayerName + "</td></tr>").tclick(select(player.id)).appendTo("#Enemies");
			}
		}
	}
	$("</table>").appendTo("#Enemies");
	shtml.moreBack();
	vgap.showMore();
};

console.log("PE+ plugin has loaded");