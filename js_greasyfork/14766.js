// ==UserScript==
// @name          liChess.org Colorize Coordinates
// @namespace     http://userstyles.org
// @description	  lichesscoordinates
// @author        ceberous
// @homepage      https://creatitees.info
// @include       https://lichess.org/*
// @run-at        document-start
// @version       0.7
// @downloadURL https://update.greasyfork.org/scripts/14766/liChessorg%20Colorize%20Coordinates.user.js
// @updateURL https://update.greasyfork.org/scripts/14766/liChessorg%20Colorize%20Coordinates.meta.js
// ==/UserScript==

(function() {var css = [
	

	"@import url(http://fonts.googleapis.com/css?family=Armata);",

	"@import url(http://fonts.googleapis.com/css?family=Atomic+Age|Sigmar+One|Fontdiner+Swanky|Graduate|Luckiest+Guy|Freckle+Face|Iceland|UnifrakturMaguntia|Titan+One|Oregano|Miltonian+Tattoo|Raleway+Dots|Milonga|Pirata+One|Wellfleet|Medula+One);",

	" .ranks {text-shadow: -2px -2px 0 #FF6F00, -2px -1px 0 #FF6F00, -2px 0px 0 #FF6F00, -2px 1px 0 #FF6F00, -2px 2px 0 #FF6F00, -1px -2px 0 #FF6F00, -1px -1px 0 #FF6F00, -1px 0px 0 #FF6F00, -1px 1px 0 #FF6F00, -1px 2px 0 #FF6F00, 0px -2px 0 #FF6F00, 0px -1px 0 #FF6F00, 0px 0px 0 #FF6F00, 0px 1px 0 #FF6F00, 0px 2px 0 #FF6F00, 1px -2px 0 #FF6F00, 1px -1px 0 #FF6F00, 1px 0px 0 #FF6F00, 1px 1px 0 #FF6F00, 1px 2px 0 #FF6F00, 2px -2px 0 #FF6F00, 2px -1px 0 #FF6F00, 2px 0px 0 #FF6F00, 2px 1px 0 #FF6F00, 2px 2px 0 #FF6F00; color: #000000;}",

	" .files {text-shadow: -2px -2px 0 #FF6F00, -2px -1px 0 #FF6F00, -2px 0px 0 #FF6F00, -2px 1px 0 #FF6F00, -2px 2px 0 #FF6F00, -1px -2px 0 #FF6F00, -1px -1px 0 #FF6F00, -1px 0px 0 #FF6F00, -1px 1px 0 #FF6F00, -1px 2px 0 #FF6F00, 0px -2px 0 #FF6F00, 0px -1px 0 #FF6F00, 0px 0px 0 #FF6F00, 0px 1px 0 #FF6F00, 0px 2px 0 #FF6F00, 1px -2px 0 #FF6F00, 1px -1px 0 #FF6F00, 1px 0px 0 #FF6F00, 1px 1px 0 #FF6F00, 1px 2px 0 #FF6F00, 2px -2px 0 #FF6F00, 2px -1px 0 #FF6F00, 2px 0px 0 #FF6F00, 2px 1px 0 #FF6F00, 2px 2px 0 #FF6F00; color: #000000;}",

	".move-dest { background: radial-gradient( transparent 0% ,transparent 80% , rgba( 229 , 126 , 0 , 1 ) 80% ) !important; } ",

	"",
	
	

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
		document.documentElement.appendChild(node);
	}
}
})();




