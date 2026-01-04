// ==UserScript==
// @name          surviv twitch personalized
// @description	  surviv customs home screen personalization
// @author        Communist
// @run-at        document-start
// @version       0.2
// @match         https://c79geyxwmp1zpas3qxbddzrtytffta.ext-twitch.tv/c79geyxwmp1zpas3qxbddzrtytffta/1.0.2/ce940530af57d2615ac39c266fe9679d/index_twitch.html?anchor=panel&language=en&mode=viewer&state=released&platform=web&popout=true*
// @namespace     https://greasyfork.org/en/scripts/406669-surviv-twitch-personalized

// @downloadURL https://update.greasyfork.org/scripts/406669/surviv%20twitch%20personalized.user.js
// @updateURL https://update.greasyfork.org/scripts/406669/surviv%20twitch%20personalized.meta.js
// ==/UserScript==

(function() {var css = [
	"#background",
	"  {",
// replace the line below with the image of your choice for the background
	"    background-image: url(https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSekZh6-BhMRgSTNTy8lvH5iu2h4BqGzbc6Gw&usqp=CAU) !important;",
	"  }",
	" #main-play-btns {",
	"    position: relative;",
	"    top: -275px;",
	"    left: -400px;",
	"}",
	" #team-menu {",
	"    width:900px;",
	"    height: 600px;",
	"}",
	"#btn-change-mode-team {",
	"    top: 6px;",
	"}",
	"#btn-change-type-team {",
	"    top: 2px;",
	"}",
// edit the color: #xxxxxx sections to change the colors of the buttons; edit box-shadow #xxxxxx to change the box border colors.
	" #team-menu {",
	"    border-bottom: 0px !important;",
	"    color: #ff073a !important;",
	"    box-shadow: inset 0 -2px #ff073a;",
	"}",
	".menu-option {",
	"    border-radius: 0px !important;",
	"    border-color: #ff073a !important;",
	"}",
	"#btn-spectate-next-player {",
	"    background: #000000!important;",
	"    box-shadow: inset 0 -2px #ff073a;",
	"}",
	"#btn-spectate-prev-player {",
	"    background: #000000!important;",
	"    box-shadow: inset 0 -2px #ff073a;",
	"}",
	"#btn-spectate-view-stats {",
	"    background: #000000!important;",
	"    box-shadow: inset 0 -2px #ff073a;",
	"}",
	"#btn-spectate-quit {",
	"    background: #000000!important;",
	"    box-shadow: inset 0 -2px #ff073a;",
	"}",
	".ui-stats-restart {",
	"    background: #000000!important;",
	"    color: #ff073a !important;",
	"    box-shadow: inset 0 -2px #ff073a;",
	"}",
	"#btn-team-leave {",
	"    color: #ff073a !important;",
	"}",
	".modal-header {",
	"    background: #000000!important;",
	"    box-shadow: inset 0 -2px #ff073a;",
	"}",
	".btn-green {",
	"    border-bottom: 0px !important;",
	"    background: #000000!important;",
	"    color: #ff073a !important;",
	"    box-shadow: inset 0 -2px #ff073a;",
	"}",
	".btn-team-option {",
	"    border-bottom: 0px !important;",
	"    background: #000000 !important;",
	"    color: #ff073a !important;",
	"    box-shadow: inset 0 -2px #ff073a;",
	"}",
	".account-details-button-wrapper {",
	"    border-bottom: 0px !important;",
	"    background: #0b0909 !important;",
	"    color: #ff073a!important;",
	"    box-shadow: inset 0 -2px #ff073a !important;",
	"}",
	"#btn-pass-locked {",
	"    border-bottom: 0px !important;",
	"    background: #0b0909 !important;",
	"    color: #ff073a !important;",
	"    box-shadow: inset 0 -2px #ff073a;",
	"}",
	"#btn-customize {",
	"    border-bottom: 0px !important;",
	"    background: #ff073a !important;",
// the line below replaces the image on the customize emoji button
	"    background-image: url(https://e7.pngegg.com/pngimages/88/605/png-clipart-soviet-union-logo-the-communist-manifesto-communist-symbolism-hammer-and-sickle-communism-party-flag-miscellaneous-text.png) !important;",
	"    background-position: 4px 1px !important;",
	"    background-repeat: no-repeat !important;",
	"    background-size: 45px !important;",
	"    color: #ff073a !important;",
	"    box-shadow: inset 0 -2px #ff073a;",
	"}",
	"#btn-help {",
	"    border-bottom: 0px !important;",
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