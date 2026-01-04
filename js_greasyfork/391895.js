// ==UserScript==
// @name         Badges JVC
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  POC pour les badges sur JVC
// @author       Lúthien Sofea Elenassë
// @match        http://www.jeuxvideo.com/profil/*?mode=infos
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391895/Badges%20JVC.user.js
// @updateURL https://update.greasyfork.org/scripts/391895/Badges%20JVC.meta.js
// ==/UserScript==

var list = document.getElementsByClassName("bloc-default-profil")[0].getElementsByClassName("display-line-lib")[0]
if (!list) {
	console.warn("No profile to add rank");
	return
}

function setRank(rank, title) {
	var line = document.createElement("li");
	var head = document.createElement("div");
	head.className = "info-lib";
	head.appendChild(document.createTextNode((title ? title : "Rang") + " :"));
	var value = document.createElement("div");
	value.className = "info-value";
	if (!ranks.hasOwnProperty(rank)) {
		value.title = rank;
		rank = "Indéterminé"
	}
	value.appendChild(icon(ranks[rank].author, ranks[rank].name));
	value.appendChild(document.createTextNode(rank));
	line.appendChild(head);
	line.appendChild(value);
	list.appendChild(line);
}
function icon(author, name) {
	var origin = "https://game-icons.net/icons/ffffff/000000/1x1/";
	var img = document.createElement("img");
	img.src = origin + author + "/" + name + ".svg"
	img.alt = "[" + name + "]";
	img.title = name;
	img.className = "custom-badge";
	return img;
}
var ranks = {};
function addRank(rank, author, icon) {
	ranks[rank] = {
		author: author,
		name: icon,
	}
	//setRank(rank, "Test");
}

var dim = 50;
var style = document.createElement("style");
document.head.appendChild(style);
style.appendChild(document.createTextNode([
	".custom-badge {",
	"	width: " + dim + "px;",
	"	height: " + dim + "px;",
	"	padding-right: 10px;",
	"}",
].join("\r\n")));
var data = Array.from(list.getElementsByTagName("li")).reduce(function (data, line) {
	var key = line.getElementsByClassName("info-lib")[0].innerText.replace(":", "").trim()
	if (data.hasOwnProperty(key) && typeof(data[key]) === "function") {
		data[key] = data[key](line.getElementsByClassName("info-value")[0].innerText.trim());
	} else {
		data[key] = line.getElementsByClassName("info-value")[0].innerText.trim()
	}
	return data;
}, {
	"Messages Forums" : function (text) {return parseInt(text.replace(/[^0-9]+/g, ""), 10)},
	"Commentaires" : function (text) {return parseInt(text.replace(/[^0-9]+/g, ""), 10)},
	"Membre depuis" : function (text) {return parseInt(text.split("(").pop().replace(/[^0-9]+/g, ""), 10)},
})


addRank("Indéterminé", "lorc", "uncertainty");
addRank("Carton", "delapouite", "cardboard-box");
addRank("Bronze", "delapouite", "ribbon-medal");
addRank("Argent", "lorc", "medal");
addRank("Or", "delapouite", "trophy-cup");
addRank("Rubis", "lorc", "gem-chain");
addRank("Saphir", "lorc", "saphir");
addRank("Émeraude", "lorc", "emerald");
addRank("Diamant", "lorc", "cut-diamond");

var mess = data.hasOwnProperty("Messages Forums") && typeof(data["Messages Forums"]) === "number" ? data["Messages Forums"] : 0
var comm = data.hasOwnProperty("Commentaires") && typeof(data["Commentaires"]) === "number" ? data["Commentaires"] : 0
var activite = mess + comm

var rank = "Carton";
if (activite >= 50) {
	rank = "Bronze";
}
if (activite >= 200) {
	rank = "Argent";
}
if (activite >= 1000) {
	rank = "Or";
}
if (activite >= 10000) {
	rank = "Rubis";
}
if (activite >= 30000) {
	rank = "Saphir";
}
if (activite >= 75000) {
	rank = "Émeraude";
}
if (activite >= 150000) {
	rank = "Diamant";
}

setRank(rank)