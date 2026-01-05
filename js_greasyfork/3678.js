// ==UserScript==
// @name           Pokec.sk - skrytie sprav od uzivatela
// @namespace      http://
// @description    Skrytie sprav na skle od vybranych uzivatelov.
// @include        http://pokec-sklo.azet.sk/miestnost/*
// @include        http://www-pokec.azet.sk/miestnost/*
// @icon           http://s.aimg.sk/pokec_base/css/favicon.ico
// @author         MaxSVK
// @version        1.2
// @date           2014-September-03
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/3678/Pokecsk%20-%20skrytie%20sprav%20od%20uzivatela.user.js
// @updateURL https://update.greasyfork.org/scripts/3678/Pokecsk%20-%20skrytie%20sprav%20od%20uzivatela.meta.js
// ==/UserScript==

/* ********** Blocked nicks ************************************************* */

var blockedNicks = new Array("blokovanyUzivatel1", "blokovanyUzivatel2", "blokovanyUzivatel3");

/* ********** Helper functions ********************************************** */

function hideMessage(currentNode) {
	currentNode.parentNode.style.display = "none";
}

/* ********** Register new event listener *********************************** */

var sklo = document.getElementById("sklo");
sklo.addEventListener("DOMNodeInserted", function(event) {
	var nodes;
	var currentNick;

	nodes = event.relatedNode.getElementsByClassName("dt");

	for(var i = 0; i < nodes.length; i++) {
		currentNick = nodes[i].getElementsByTagName("a")[1].innerHTML;
		if(blockedNicks.indexOf(currentNick) > -1) {
			hideMessage(nodes[i]);
		}
	}

	nodes = event.relatedNode.getElementsByClassName("dd");

	for(var i = 0; i < nodes.length; i++) {
		currentNick = nodes[i].getElementsByClassName("pre neho")[0].getElementsByClassName("meno")[0].innerHTML;
		if(blockedNicks.indexOf(currentNick) > -1) {
			hideMessage(nodes[i]);
		}
	}

}, true);