// ==UserScript==
// @name        MH - Shaksgärt - Pogo XVI
// @namespace   MH
// @description Affiche des équipes du Pogo XVI
// @include     */MH_Play/Play_vue.php*
// @include     */MH_Play/Play_evenement.php*
// @include     */View/PJView_Events.php*
// @include     */Messagerie/MH_Messagerie.php*
// @include     */Messagerie/ViewMessage.php*
// @icon        https://xballiet.github.io/ImagesMH/MZ.png
// @version     1.3
// @grant       none
// @require     https://greasyfork.org/scripts/24178-mh-h2p-code-mutualis%C3%A9?version=161949&d=.user.js
// @downloadURL https://update.greasyfork.org/scripts/30666/MH%20-%20Shaksg%C3%A4rt%20-%20Pogo%20XVI.user.js
// @updateURL https://update.greasyfork.org/scripts/30666/MH%20-%20Shaksg%C3%A4rt%20-%20Pogo%20XVI.meta.js
// ==/UserScript==

/*
 * Script MZ :
 * Auteur : Shaksgärt (26499)
 * Date : 2017-06-16
 */

var team_1 = new Array(
	"81059",
	"108680",
	"17826",
	"32807",
	"14055",
	"109056",
	"107623",
	"107246",
	"109435",
	"107245",
	"52259",
	"69909",
	"109107",
	"109968",
	"109308",
	"2344",
	"97197",
	"86375",
	"109148",
	"109104",
	"109841",
	"26440",
	"16",
	"109149",
	"103080",
	"64443",
	"76079",
	"12421",
	"109417",
	"99187",
	"53237",
	"82193",
	"78183",
	"105112",
	"105474",
	"103105"
);

var team_2 = new Array(
	"110144",
	"14185",
	"107865",
	"109047",
	"16950",
	"109495",
	"57667",
	"62008",
	"109092",
	"18257",
	"12074",
	"32629",
	"104956",
	"26499",
	"54669",
	"76059",
	"106784",
	"108407",
	"93004",
	"76614",
	"9642",
	"52431",
	"109458",
	"88982",
	"35181",
	"106203",
	"8566",
	"104692",
	"39959",
	"105631",
	"95000",
	"89367",
	"105837",
	"103107",
	"87954"
);

var baseUrlImg = "https://utils.mh.raistlin.fr/pogo/";

var TEAM1 = {
	id: 1,
	name: "The Rolling Trolls",
	color: "rgb(255,215,0)",
	urlImg: baseUrlImg + "orange.png"
};

var TEAM2 = {
	id: 2,
	name: "Rage Against The Trolls",
	color: "rgb(245, 169, 188)",
	urlImg: baseUrlImg + "rouge.png"
};

if (isPage("MH_Play/Play_vue.php")){
	// Delay to override MZ diplo color
	window.setTimeout(function() { decorateVue() }, 250);
}
if (isPage("MH_Play/Play_evenement.php") || isPage("View/PJView_Events.php")) {
	decorateEvents();
}
if (isPage("Messagerie/MH_Messagerie.php") || isPage("Messagerie/ViewMessage.php")) {
	decorateMessagerie();
}

function whichTeam(num) {
	var ret = null;
	if (team_1.indexOf(num) !== -1) {
		ret = TEAM1;
	}
	else if (team_2.indexOf(num) !== -1) {
		ret = TEAM2;
	}
	return ret;
}

function decorateVue() {
	var trolls = document.getElementById("VueTROLL").getElementsByClassName("mh_tdpage");
	for (var i = 0 ; i < (trolls.length) ; i++) {
		var num = trolls[i].childNodes[2].textContent;
		var team = whichTeam(num);
		if (team) {
			trolls[i].style.background = team.color;
		}
	}
}

function decorateEvents() {
	var trolls = document.getElementsByClassName('mh_trolls_1');
	for (var i = 0 ; i < trolls.length ; i++) {
		// ATTENTION : sur ce lien, il y a des quotes !!
		// Transform javascript:EPV('29930') in 29930
		var num = trolls[i].href.replace("javascript:EPV('", "").replace("')", "");
		var team = whichTeam(num);
		if (team) {
			addIcone(trolls[i], team);
		}
	}
}

function decorateMessagerie() {
	var nodes = document.evaluate("//a[contains(@href,'javascript:EPV') or contains(@href,'javascript:EnterPJView')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i = 0 ; i < nodes.snapshotLength ; i++) {
		var node = nodes.snapshotItem(i);
		var link = node.getAttribute('href').replace(/'/g, "");
		var trollID = parseInt(link.substring(link.indexOf('(') + 1, link.indexOf(')')));
		var team = whichTeam("" + trollID);
		if (team) {
			addIcone(node, team);
		}
	}
}

function addIcone(node, team) {
	node.title = team.name;
	var space = document.createTextNode(" ");
	node.appendChild(space);
	var oImg = document.createElement("img");
	oImg.setAttribute('src', team.urlImg);
	node.appendChild(oImg);
}