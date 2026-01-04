// ==UserScript==
// @name          KingLegend Custom Style 2.0
// @namespace     http://userstyles.org
// @description	  KingLegend Custom Style. Originally made by Nate Dogg. But I changed some of it and wrote it as an userscript
// @author        Sniper Typist
// @homepage      https://userstyles.org/styles/225447
// @match         http://www.nitrotype.com/*
// @match         https://www.nitrotype.com/*
// @match         http://*.www.nitrotype.com/*
// @match         https://*.www.nitrotype.com/*
// @run-at        document-start
// @version       2.0.2
// @downloadURL https://update.greasyfork.org/scripts/443830/KingLegend%20Custom%20Style%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/443830/KingLegend%20Custom%20Style%2020.meta.js
// ==/UserScript==
(function() {var css = [
			".dash-copyContainer",
		"    {",
		"      background:#2E3141;",
		"      -webkit-box-shadow: 2px 1px 157px 10px rgb(255, 0, 0);",
		"      box-shadow: 0px 1px 157px 10px rgb(0, 179, 255);",
		"      border-radius: 5px;",
		"      flex: 1;",
		"      overflow: hidden;",
		"      padding: 15px;",
		"      display: flex;",
		"    }",
		"",
		"    .dash-copy",
		"    {",
		"      color: #ffffff;",
		"      font-family: \"Roboto Mono\", \"Courier New\", Courier, \"Lucida Sans Typewriter\", \"Lucida Typewriter\", monospace;",
		"      font-size: 28px;",
		"",
		"    }",
		".profile-carContainer.card.card--a.card--shadow-l {background-color:#fff0;}",
		".raceResults-awards {background:#fff0;}",
		".raceResults-close.raceResults-close--minimizer {background:#dfd612;}",
		".g.raceResults-grid {background:#fff0;}",
		"",
		"",
    "body {",
	"    background: none;",
	"}",
	".card--grit {",
	"    background: none;",
	"}",
	".bg--gradient {",
	"    background: fixed;",
	"}",
	"",
	"  .card--a",
	"  {",
	"    background-color: #fff0;",
	"    color: #ffffff;",
	"  }",
	"",
	"html",
	"  {",
	"    background: fixed url(\"https://cdn.discordapp.com/attachments/779090212978032661/929196058570018866/images_7.jpeg\");",
	"    background-size: 10%;",
	"  }",
	"",
	"  .flash--beta",
	"  {",
	"    display: none;",
	"  }",
	"",
	"  .theme--pDefault .profile-bg",
	"  {",
	"    background: url(\"https://cdn.discordapp.com/attachments/779090212978032661/929207710690467891/unknown.png\") center, linear-gradient(0deg, #2d2e2e 60%, #ffffff 100%);",
	"      background-size: 90%",
	"  }",
	"",
	"  .theme--pDefault .profile-bgHead",
	"  {",
	"    background: url(\"https://cdn.discordapp.com/attachments/779090212978032661/929207710690467891/unknown.png\") center, linear-gradient(0deg, #2d2e2e 60%, #ffffff 100%);",
	"      background-size: 90%",
	"  }",
	"",
	"  .theme--pDefault.is-gold .profile-bg",
	"  {",
	"    background: url(\"https://cdn.discordapp.com/attachments/779090212978032661/929207710690467891/unknown.png\") center, linear-gradient(0deg, #2d2e2e 60%, #ffffff 100%);",
	"      background-size: 90%",
	"  }",
	"",
	"  .news-teaser",
	"  {",
	"    color: #000;",
	"  }",
	"",
	"  .card--a",
	"  {",
	"    background-color: #fff0;",
	"  }",
	"",
	"  .card--shadow-l",
	"  {",
	"    box-shadow: none;",
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
