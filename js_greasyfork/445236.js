// ==UserScript==
// @name          Lichess Pieces: Chess Cases
// @namespace     http://userstyles.org
// @description	  Beautiful pieces set (Chess Cases) for Liches.org.
// @author        Suleimanov Abdullakh
// @homepage      https://userstyles.world/style/4766/lichess-pieces-chess-cases
// @match    http://*.lichess.org/*
// @run-at        document-start
// @version       0.1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445236/Lichess%20Pieces%3A%20Chess%20Cases.user.js
// @updateURL https://update.greasyfork.org/scripts/445236/Lichess%20Pieces%3A%20Chess%20Cases.meta.js
// ==/UserScript==
(function() {var css = [
	"	piece.pawn.black {background-image: url(\"http://i.imgur.com/UJ4QdiR.png\")!important;}",
	"  	piece.knight.black{background-image: url(\"http://i.imgur.com/rV1XAaJ.png\")!important;}",
	"  	piece.bishop.black{background-image: url(\"http://i.imgur.com/jcM0SQk.png\")!important;}",
	"  	piece.rook.black{background-image: url(\"http://i.imgur.com/QZ09pKr.png\")!important;}",
	"  	piece.queen.black{background-image: url(\"http://i.imgur.com/s8YIwC7.png\")!important;}",
	"  	piece.king.black{background-image: url(\"http://i.imgur.com/ADYifty.png\")!important;}",
	"  	piece.pawn.white{background-image: url(\"http://i.imgur.com/3HfiC5E.png\")!important;}",
	"  	piece.knight.white{background-image: url(\"http://i.imgur.com/C5fmVrC.png\")!important;}",
	"  	piece.bishop.white{background-image: url(\"http://i.imgur.com/B6CJfBK.png\")!important;}",
	"  	piece.rook.white{background-image: url(\"http://i.imgur.com/OtZLOjh.png\")!important;}",
	"  	piece.queen.white{background-image: url(\"http://i.imgur.com/PfzevTq.png\")!important;}",
	"  	piece.king.white{background-image: url(\"http://i.imgur.com/XgYSmwD.png\")!important;}"
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