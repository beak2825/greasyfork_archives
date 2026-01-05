// ==UserScript==
// @name          FBSMS2.0
// @namespace     http://userstyles.org
// @description	  Facebook Staff Mode Sprite Part Two
// @author        biswassudipta05
// @homepage      http://userstyles.org/styles/81939
// @include       https://www.facebook.com/*
// @include       https://www.facebook.com/
// @include       https://www.facebook.com/index.php?stype=lo*
// @include       https://www.facebook.com/index.php*
// @run-at        document-start
// @version 0.0.1.20150108212516
// @downloadURL https://update.greasyfork.org/scripts/12861/FBSMS20.user.js
// @updateURL https://update.greasyfork.org/scripts/12861/FBSMS20.meta.js
// ==/UserScript==
(function() {
var css = "body.fbIndex { \nbackground: url('http://i961.photobucket.com/albums/ae95/Kemal_Okan_Dikkulak/Battlefield-4-Wallpaper-HD_zpsamondczv.jpg')right center fixed !important; \n-webkit-background-size: cover; \n-moz-background-size: 100% !important; \nbackground-repeat: no-repeat !important;\nbackground-size: cover !important;\n}\n\n.loggedout_menubar_container { background: url('http://fiakka.com/images/blank_transparent.png') !important; }\n.fbIndex #globalContainer #dropmenu_container,\n.fbIndex #globalContainer #content,\n.fbIndex #globalContainer #pageFooter { display: none !important }\n\n\n.fbIndex .loggedout_menubar_container {\n  position: fixed !important;\n  width: 420px !important;\n  height: 82px !important;\n  min-width: 0 !important;\n  top: 50% !important;\n  left: 50% !important;\n  margin-top: -17px !important;\n  margin-left: -210px !important;\n  z-index: -1 !important;\n}\n\n\n.fbIndex .loggedout_menubar { width: auto !important }\n.fbIndex .loggedout_menubar_container .lfloat,\n.fbIndex .loggedout_menubar_container .rfloat { float: none !important }\n.fbIndex .loggedout_menubar_container .lfloat img,\n.fbIndex .loggedout_menubar_container .rfloat #login_form table { display: block !important; margin: 0 auto !important }\n\n.fbIndex .loggedout_menubar_container .lfloat img { display: block; margin: -60px auto 20px !important; }\n\n._5a-- { display: none !important }\n\n\n#SetAsHomepage_Callout {\n  display: none;\n}";
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