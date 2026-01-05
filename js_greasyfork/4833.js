// ==UserScript==
// @name          Mobile SGW
// @namespace     https://github.com/doctorfoster/userscripts/mobilesgw.js
// @description	  Mobile SGW modifiziert die SGW um besser mit mobilgeräten zurechtzukommen
// @author        doctor foster
// @homepage      https://greasyfork.org
// @include       http://www.stargate-wiki.de/wiki/*
// @include       http://stargate-wiki.de/wiki/*
// @run-at        document-start
// @version       0.0.0.2
// @downloadURL https://update.greasyfork.org/scripts/4833/Mobile%20SGW.user.js
// @updateURL https://update.greasyfork.org/scripts/4833/Mobile%20SGW.meta.js
// ==/UserScript==
(function() {
var css = "#mw-panel {\n  display:none;\n}\n#mw-head > div#p-personal:nth-child(1) {\n  display: none;\n}\ndiv#p-search {\n  position: fixed;\n  top: 0px;\n  left: 30px;\n}\ndiv[style=\"margin-top: 10px; margin-bottom: 10px; border: 1px solid #aaaaaa; padding: 0.5em 0.5em 0.5em 0.5em;\"] > table > tbody > tr > td:nth-child(2) {\n  display:none;\n}\nbody > div#content, body > div#footer {\n  margin-left: auto;\n}\ndiv#mw-head > div#p-personal > ul {\n  padding-left: 0px;\n}\ndiv#mw-head > div#left-navigation {\n  left: auto;\n}\ndiv#right-navigation > div#p-views > ul > li.selected, div#left-navigation > div#p-namespaces > ul > li.selected {\n  display:none;\n}\n.mw-content-ltr > center > div > map[name=\"ImageMap_1_933563697\"] {\n  display:none;\n}\n/* Disable Image Maps */\n.mw-content-ltr > center > div > img[usemap=\"#ImageMap_1_933563697\"] {\n  width: 90%;\n  height: auto;\n}\n/* Hauptseite */\n.Hauptseite-Inhalt > div > table > tbody > tr > td:nth-child(2) {\n  display: none;\n}\n.mw-content-ltr > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > div:nth-child(3) {\n  width: 282px;\n}\n/*.mw-content-ltr > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > div:nth-child(3) > div:nth-child(2) {\n  width: calc(100% - 22px);\n}*/\n/* Diverse Seiten */\ntable.infoboxblau {\n  width: 100%;\n  min-width: 260px;\n  max-width: 420px;\n}\n/* Exzellent-Markierung entfernen */\ndiv.noprint[style=\"right: 12px; margin-top: -5px;\"] {\n  visibility: hidden;\n}\n/* Hauptseiten-fix\n  sorry, aber tables sind nur für tabellen gedacht, nicht fürs Layout */\n.mw-content-ltr > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > table:nth-child(4) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) {\n  display: none;\n}";
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node); 
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();
