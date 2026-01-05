// ==UserScript==
// @name          1.HACKER Ram1l Feyziyev FacebOOk
// @namespace     http://userstyles.org
// @description	  Update : Added a new CSS so that it works perfectly on most screen resolutions & the background shows its best when browser is resized..!! Give your Facebook login Page a Anonymous look..!! Looks pretty cool..!! Rate it..!! Follow me at https://biswassudipta05.me/ .Connect with https://www.facebook.com/trickortips to stay updated..!! Follow me personally https://www.facebook.com/biswassudipta05 Google+ link http://www.goo.gl/GyJZB Follow me on twitter https://twitter.com/trickortips Also see :)
// @author        biswassudipta05
// @homepage      https://userstyles.org/styles/81939
// @include       https://www.facebook.com/*
// @include       https://www.facebook.com/
// @include       https://web.facebook.com/
// @include       https://www.facebook.com/index.php?stype=lo*
// @include       https://www.facebook.com/index.php*
// @run-at        document-start
// @version       0.20151026111521
// @downloadURL https://update.greasyfork.org/scripts/29686/1HACKER%20Ram1l%20Feyziyev%20FacebOOk.user.js
// @updateURL https://update.greasyfork.org/scripts/29686/1HACKER%20Ram1l%20Feyziyev%20FacebOOk.meta.js
// ==/UserScript==
(function() {var css = [
	"body.fbIndex { ",
	"background: url(\'https://i.hizliresim.com/kbl3pD.jpg\')right center fixed !important; ",
	"-webkit-background-size: cover; ",
	"-moz-background-size: 100% !important; ",
	"background-repeat: no-repeat !important;",
	"background-size: cover !important;",
	"}",
	"",
	".loggedout_menubar_container { background: url(\'https://i.hizliresim.com/kbl3pD.jpg\') !important; }",
	".fbIndex #globalContainer #dropmenu_container,",
	".fbIndex #globalContainer #content,",
	".fbIndex #globalContainer #pageFooter { display: none !important }",
	"",
	"",
	".fbIndex .loggedout_menubar_container {",
	"  position: fixed !important;",
	"  width: 420px !important;",
	"  height: 82px !important;",
	"  min-width: 0 !important;",
	"  top: 50% !important;",
	"  left: 50% !important;",
	"  margin-top: -17px !important;",
	"  margin-left: -210px !important;",
	"  z-index: -1 !important;",
	"}",
	"",
	"",
	".fbIndex .loggedout_menubar { width: auto !important }",
	".fbIndex .loggedout_menubar_container .lfloat,",
	".fbIndex .loggedout_menubar_container .rfloat { float: none !important }",
	".fbIndex .loggedout_menubar_container .lfloat img,",
	".fbIndex .loggedout_menubar_container .rfloat #login_form table { display: block !important; margin: 0 auto !important }",
	"",
	".fbIndex .loggedout_menubar_container .lfloat img { display: block; margin: -60px auto 20px !important; }",
	"",
	"._5a-- { display: none !important }",
	"",
	"",
	"#SetAsHomepage_Callout {",
	"  display: none;",
	"}"
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
