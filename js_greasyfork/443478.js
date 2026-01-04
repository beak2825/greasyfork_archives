// ==UserScript==
// @name          Nitro Type Glitched Window Style!
// @namespace     http://userstyles.org
// @description	  It looks like you are on window. But way cooler!!!
// @author        Sniper Typist On YouTube
// @homepage      https://userstyles.org/styles/236719
// @include       http://nitrotype.com/*
// @include       https://nitrotype.com/*
// @include       http://*.nitrotype.com/*
// @include       https://*.nitrotype.com/*
// @include       https://*.nitrotype.com
// @run-at        document-start
// @version       1.2
// @downloadURL https://update.greasyfork.org/scripts/443478/Nitro%20Type%20Glitched%20Window%20Style%21.user.js
// @updateURL https://update.greasyfork.org/scripts/443478/Nitro%20Type%20Glitched%20Window%20Style%21.meta.js
// ==/UserScript==
(function() {var css = "";
if (false || (document.domain == "nitrotype.com" || document.domain.substring(document.domain.indexOf(".nitrotype.com") + 1) == "nitrotype.com"))
	css += [
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
		"      color: #0ff;",
		"      text-shadow: 0 0 5px #00ffec, 0 0 7px #0059ff;",
		"      font-family: \"Roboto Mono\", \"Courier New\", Courier, \"Lucida Sans Typewriter\", \"Lucida Typewriter\", monospace;",
		"      font-size: 18px;",
		"",
		"    }",
		".profile-carContainer.card.card--a.card--shadow-l {background-color:#fff0;}",
		".raceResults-awards {background:#fff0;}",
		".raceResults-close.raceResults-close--minimizer {background:#dfd612;}",
		".g.raceResults-grid {background:#fff0;}",
		"",
		"",
		"body",
		"  {",
		"    overflow-y: scroll;",
		"    background: none;",
		"    overflow-x: hidden;",
		"    position: relative;",
		"  }",
		"",
		"  .card--grit",
		"  {",
		"    background-image: url(\"https://wallpaperaccess.com/full/3296133.png\");",
		"    background: fixed;",
		"  }",
		"",
		"  html",
		"  {",
		"    background: fixed url(\"https://wallpaperfordesktop.com/wp-content/uploads/2021/11/Broken-Screen-Wallpaper.jpg\") no-repeat, #2d2e2e;",
		"    box-sizing: border-box;",
		"    color: #2d2e2e;",
		"    font-family: \"Montserrat\", sans-serif;",
		"    font-size: 16px;",
		"    font-weight: 300;",
		"    line-height: 1.6;",
		"    background-size: 100%;",
		"  }",
		"",
		" .bg--gradient {",
		"    background: fixed;",
		"}",
		".theme--pDefault .profile-bg",
		"    {",
		"      background: url(\"https://ak.picdn.net/shutterstock/videos/1030010189/thumb/4.jpg?ip=x480\") top left repeat, linear-gradient(0deg, #2d2e2e 60%, #ffffff 100%);",
		"      color: #d3d3d3;",
		"      background-size: 100%",
		"    }",
		"",
		"    .theme--pDefault .profile-bgHead",
		"    {",
		"      background: url(\"https://ak.picdn.net/shutterstock/videos/1030010189/thumb/4.jpg?ip=x480\") top left repeat, linear-gradient(0deg, #2d2e2e 10%, #ffffff 100%);",
		"      background-size: 100%",
		"    }",
		"",
		"    .theme--pDefault.is-gold .profile-bg",
		"    {",
		"      background: url(\"https://ak.picdn.net/shutterstock/videos/1030010189/thumb/4.jpg?ip=x480\") top left repeat, linear-gradient(0deg, #2d2e2e 10%, #f00 100%);",
		"      background-size: 100%",
		"    }",
		".garage",
		"{",
		"    background:url(https://wallpaperplay.com/walls/full/6/c/d/67928.jpg)",
		"}",
		"",
		"path:first-child, path:nth-child(7) {",
		"    fill: #11dfea;",
		"}"
	].join("\n");
if (false || (document.location.href.indexOf("http://example.com") == 0))
	css += [

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
