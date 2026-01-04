// ==UserScript==
// @name          Mogachess
// @namespace     http://userstyles.org
// @description	  This is a theme for Lichess intended for fans of the Monster Hunter license. Made with love by Gas.
// @author        Gas
// @homepage      https://userstyles.org/styles/195628
// @include       http://lichess.org/*
// @include       https://lichess.org/*
// @include       http://*.lichess.org/*
// @include       https://*.lichess.org/*
// @run-at        document-start
// @version       0.20210107203649
// @downloadURL https://update.greasyfork.org/scripts/419834/Mogachess.user.js
// @updateURL https://update.greasyfork.org/scripts/419834/Mogachess.meta.js
// ==/UserScript==
(function() {var css = [
	"piece.pawn.black",
	"  {",
	"    background-image: url(\"https://i.imgur.com/pNVcggc.png\")!important;",
	"  }",
	"",
	"  piece.knight.black",
	"  {",
	"    background-image: url(\"http://i.imgur.com/9VgrhnR.png\")!important;",
	"  }",
	"",
	"  piece.bishop.black",
	"  {",
	"    background-image: url(\"http://i.imgur.com/l0GbU6L.png\")!important;",
	"  }",
	"",
	"  piece.rook.black",
	"  {",
	"    background-image: url(\"http://i.imgur.com/CTTJkOm.png\")!important;",
	"  }",
	"",
	"  piece.queen.black",
	"  {",
	"    background-image: url(\"http://i.imgur.com/MyhBEBl.png\")!important;",
	"  }",
	"",
	"  piece.king.black",
	"  {",
	"    background-image: url(\"http://i.imgur.com/HNtRqrW.png\")!important;",
	"  }",
	"",
	"  piece.pawn.white",
	"  {",
	"    background-image: url(\"https://i.imgur.com/ernDA19.png\")!important;",
	"  }",
	"",
	"  piece.knight.white",
	"  {",
	"    background-image: url(\"http://i.imgur.com/ZAa9KWH.png\")!important;",
	"  }",
	"",
	"  piece.bishop.white",
	"  {",
	"    background-image: url(\"http://i.imgur.com/MyEmbHu.png\")!important;",
	"  }",
	"",
	"  piece.rook.white",
	"  {",
	"    background-image: url(\"http://i.imgur.com/Bdz5ihX.png\")!important;",
	"  }",
	"",
	"  piece.queen.white",
	"  {",
	"    background-image: url(\"http://i.imgur.com/0pumZT1.png\")!important;",
	"  }",
	"",
	"  piece.king.white",
	"  {",
	"    background-image: url(\"http://i.imgur.com/Z7LaBbh.png\")!important;",
	"  }"
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
