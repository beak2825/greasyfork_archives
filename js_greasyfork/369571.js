// ==UserScript==
// @name          Namulive custom colors
// @namespace     http://userstyles.org
// @description	  Namulive custom colors.
// @author        RIEN
// @homepage      https://github.com/rienriri/Namulive-Custom-Colors.git
// @include       http://namu.live/*
// @include       https://namu.live/*
// @include       http://*.namu.live/*
// @include       https://*.namu.live/*
// @run-at        document-start
// @version       0.2018060901
// @downloadURL https://update.greasyfork.org/scripts/369571/Namulive%20custom%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/369571/Namulive%20custom%20colors.meta.js
// ==/UserScript==
(function() {var css = [
	"/* navbar */",
	"  .body .navbar-wrapper {",
	"      background-color: #708090!important;",
	"  }",
	"  .body .navbar {",
	"      background-color: #708090!important;",
	"  }",
	"  .body .navbar-nav .nav-link:hover {",
	"      background-color: #778899!important;",
	"  }",
	"",
	"  /* bottom updown button */",
	"  .body .nav-control {",
	"      background-color: #708090!important;",
	"  }",
	"",
	"  .body .title-row {",
	"      background-color: #708090!important;",
    "  }",
    "",
    "  .body .leaf-info  {",
	"      background-color: #708090!important;",
    "  }",
    "",
    "  .body .tag-leaf {",
	"      background-color: #708090!important;",
    "  }",
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
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();


