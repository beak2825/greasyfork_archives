// ==UserScript==
// @name           Pokec.sk - vylepsene zvyraznovanie sprav
// @namespace      http://
// @description    Vylepsene zvyraznovanie sprav na skle. Narozdiel od originalu su spravy zvyraznene cele namiesto maleho kusku a zaroven su odlisene odtienom spravy od teba od sprav pre teba.
// @include        http://pokec-sklo.azet.sk/miestnost/*
// @include        http://www-pokec.azet.sk/miestnost/*
// @icon           http://s.aimg.sk/pokec_base/css/favicon.ico
// @grant          GM_addStyle
// @author         MaxSVK
// @version        2.4
// @date           2015-january-06
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/3681/Pokecsk%20-%20vylepsene%20zvyraznovanie%20sprav.user.js
// @updateURL https://update.greasyfork.org/scripts/3681/Pokecsk%20-%20vylepsene%20zvyraznovanie%20sprav.meta.js
// ==/UserScript==

/* ********** Color definitions ********************************************* */

var colors = new Array();

	colors["preVsetkych"]  = "#222222";
	colors["odTeba"]       = "#4C8CD4";
	colors["preTeba"]      = "#1A5AA2";
	colors["tajneOdTeba"]  = "#D53B41";
	colors["tajnePreTeba"] = "#A3090F";
	colors["oTebe"]        = "#115511";
	colors["text"]         = "#EDEDED";
	colors["meno"]         = "#FFFFFF";
	colors["link"]         = "#777777";

	colors["popup.meno"]   = "#3878c0";
	colors["popup.sprava"] = "#000000";

/* ********** Add new CSS *************************************************** */

GM_addStyle(
	'.dd {border: 0px !important; padding-left: 177px !important;}\n' +
	'.dt {width: 169px !important; margin-left: 0px !important;}\n' +
	'.cas {color: #EDEDED !important;}\n' +
	'.sprava {color: #EDEDED !important; border-bottom: 1px solid rgba(17, 17, 17, 0.3) !important;}\n' +
	'.prispevok {border-left: 1px solid rgba(17, 17, 17, 0.3) !important; padding-left: 5px !important;}\n' +
	'.pre.teba {font-weight: bold !important;}\n' +
	'.pre.teba .hniezdo {font-weight: normal !important;}\n' +
	'#sklo #dl .hover {background-color: transparent !important;}\n' +
	'#sklo #dl .prispevok a {color: ' + colors["link"] + ';}\n' +
	'.pre .meno {color: ' + colors["meno"] + ' !important;}\n' +
	'.pre.vsetkych {background-color: transparent !important; display: none !important;}\n' +
	'.pre.teba {background-color: transparent !important;}\n' +
	'.pre.teba.tajne {background-color: transparent !important;}\n' +
	'#sklo .jehoPrispevky .jehoPrispevok {background-color: transparent !important;}\n' +
	'#sklo .jehoPrispevky .jehoPrispevok * {color: ' + colors["text"] + ';}\n' +
	'#sklo .jehoPrispevky .jehoPrispevok .cas {color: ' + colors["text"] + ' !important;}\n' +
	'#sklo .jehoPrispevky .jehoPrispevok .meno {color: ' + colors["meno"] + ' !important;}\n' +
	'#sklo .jehoPrispevok .meno a[href], #sklo .jehoPrispevky .jehoPrispevok .meno a[href], #sklo .jehoPrispevky .jehoPrispevok .pre .meno a {color: ' + colors["meno"] + ' !important;}\n' +
	'#sklo .jehoPrispevok .c_bublitka *, #sklo .jehoPrispevky .jehoPrispevok .c_bublitka * {color: #1E2830 !important;}\n' +
	'#sklo .jehoPrispevok .c_bublitka a[href], #sklo .jehoPrispevky .jehoPrispevok .c_bublitka a[href] {color: #3878C0 !important;}\n' +
	'.popupNotifikacia span.nick {color: ' + colors["popup.meno"] + ' !important;}\n' +
	'.popupNotifikacia span.sprava {color: ' + colors["popup.sprava"] + ' !important;}\n' + // message in old popup
	'.popupNotifikacia div.sprava {color: ' + colors["popup.sprava"] + ' !important;}\n' // message in new popup
);

/* ********** Get user name ************************************************* */

var nickBull = document.getElementById("nickBull");
var userName = nickBull.innerHTML;

/* ********** Helper functions ********************************************** */

function setMessageColorFromNodeWithClassPrispevok(node, colorToSet) {
	setMessageColor(node.parentNode.parentNode, colorToSet)
}

function setMessageColorFromNodeWithClassPre(node, colorToSet) {
	setMessageColor(node.parentNode.parentNode.parentNode.parentNode, colorToSet);
}

function setMessageColor(node, colorToSet) {
	node.style.position = "relative";
	node.style.setProperty('background-color', colors[colorToSet], 'important');
}

/* ********** Register new event listener *********************************** */

var sklo = document.getElementById("sklo");
sklo.addEventListener("DOMNodeInserted", function(event) {
	var nodes;
	var node;
	var text;

	nodes = event.relatedNode.getElementsByClassName("pre vsetkych");
	for(var i = 0; i < nodes.length; i++) {
		node = nodes[i];
		setMessageColorFromNodeWithClassPre(node, "preVsetkych");
	}

	// This have to be first before detecting message for you and from you.
	nodes = event.relatedNode.getElementsByClassName("prispevok");
	for(var i = 0; i < nodes.length; i++) {
		node = nodes[i];
		text = node.innerHTML;
		if(text.indexOf(userName) > -1) {
			setMessageColorFromNodeWithClassPrispevok(node, colors["oTebe"])
		}
	}

	nodes = event.relatedNode.getElementsByClassName("pre teba");
	for(var i = 0; i < nodes.length; i++) {
		node = nodes[i];
		if(node.innerHTML == "pre Teba ") {
			setMessageColorFromNodeWithClassPre(node, "preTeba");
		} else {
			setMessageColorFromNodeWithClassPre(node, "odTeba");
		}
	}

	nodes = event.relatedNode.getElementsByClassName("pre teba tajne");
	for(var i = 0; i < nodes.length; i++) {
		node = nodes[i];
		if(node.innerHTML == "tajne pre Teba ") {
			setMessageColorFromNodeWithClassPre(node, "tajnePreTeba");
		} else {
			setMessageColorFromNodeWithClassPre(node, "tajneOdTeba");
		}
	}

}, true);