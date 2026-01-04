// ==UserScript==
// @name          Betaseries_Tweaks
// @description	  Suppression de bordures et du bouton 'Récupéré' sur betaseries.com
// @author        Ev4si0n
// @include       http://www.betaseries.com/serie/*
// @include       https://www.betaseries.com/serie/*
// @include       http://www.betaseries.com/*
// @include       https://www.betaseries.com/*
// @include       http://*.www.betaseries.com/*
// @include       https://*.www.betaseries.com/*
// @run-at        document-start
// @namespace     https://greasyfork.org/fr/scripts/34699-betaseries-b2/
// @version       0.20171101
// @downloadURL https://update.greasyfork.org/scripts/34699/Betaseries_Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/34699/Betaseries_Tweaks.meta.js
// ==/UserScript==
(function() {var css = [
	"@namespace url(http://www.w3.org/1999/xhtml);",
    "#left > div.singlemovie-affiche.border{",
	"min-height: 0px;",
    "border: 0px;",
    "box-shadow: 0 1px 26px #000000;",
	"}",
  "#contenu #right .videos .thumbnail img {",
    "border: 0px solid #fff;",
    "box-shadow: 0 1px 2px var(--gray_hard);",
    "width: calc(100% - 6px);",
  "}",
    "#contenu #right img.illustration {",
    "border: 0px;",
    "border-radius: 0px;",
	"}",
    ".border{",
    "border: 0px;",
    "border-radius: 0px;",
	"}",
    ".homebox-content img {",
    "border-radius: 2px;",
    "}",
	".btn-dl{",
	"  display: none;",
	"}",
].join("\n");
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
