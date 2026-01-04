// ==UserScript==
// @name          Lichess Pieces: Go
// @namespace     http://userstyles.org
// @description	  Changes all chess pieces to Go stones of their respective color. This enables playing in a semi-blind mode.
// @author        Abraham Hinteregger
// @homepage      https://userstyles.org/styles/156409
// @include       http://lichess.org/*
// @include       https://lichess.org/*
// @include       http://*.lichess.org/*
// @include       https://*.lichess.org/*
// @run-at        document-start
// @version       0.20180301104942
// @downloadURL https://update.greasyfork.org/scripts/38979/Lichess%20Pieces%3A%20Go.user.js
// @updateURL https://update.greasyfork.org/scripts/38979/Lichess%20Pieces%3A%20Go.meta.js
// ==/UserScript==
(function() {var css = [
	"	piece.pawn.black{background-image: url(\"https://svgshare.com/i/5gv.svg\")!important;}",
	"  	piece.knight.black{background-image: url(\"https://svgshare.com/i/5gv.svg\")!important;}",
	"  	piece.bishop.black{background-image: url(\"https://svgshare.com/i/5gv.svg\")!important;}",
	"  	piece.rook.black{background-image: url(\"https://svgshare.com/i/5gv.svg\")!important;}",
	"  	piece.queen.black{background-image: url(\"https://svgshare.com/i/5gv.svg\")!important;}",
	"  	piece.king.black{background-image: url(\"https://svgshare.com/i/5gv.svg\")!important;}",
	"  	piece.pawn.white{background-image: url(\"https://svgshare.com/i/5ih.svg\")!important;}",
	"  	piece.knight.white{background-image: url(\"https://svgshare.com/i/5ih.svg\")!important;}",
	"  	piece.bishop.white{background-image: url(\"https://svgshare.com/i/5ih.svg\")!important;}",
	"  	piece.rook.white{background-image: url(\"https://svgshare.com/i/5ih.svg\")!important;}",
	"  	piece.queen.white{background-image: url(\"https://svgshare.com/i/5ih.svg\")!important;}",
	"  	piece.king.white{background-image: url(\"https://svgshare.com/i/5ih.svg\")!important;}"
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
