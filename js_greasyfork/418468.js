// ==UserScript==
// @name          ıllıllı⭐🌟 c͙o͙o͙l͙ b͙l͙a͙c͙k͙ a͙n͙d͙ r͙e͙d͙ b͙a͙c͙k͙g͙r͙o͙u͙n͙d͙ 🌟⭐ıllıllı
// @description	  I decided to rewrite a code for this person's background and instead of it being Anime Google Sword Art online you made it to look like a r͙e͙d͙ & b͙la͙c͙k͙ b͙a͙c͙k͙g͙r͙o͙u͙n͙d͙
// @author        MICHAEL FINGER
// @include       https://google.com/
// @include       https://www.google.*
// @include       https://images.google.*
// @include       https://news.google.*
// @include       https://books.google.*
// @include       https://support.google.*
// @include       https://play.google.*
// @include       https://drive.google.*
// @include       https://accounts.google.*
// @include       https://myaccount.google.*
// @include       https://plus.google.*
// @include       https://docs.google.*
// @run-at        document-start
// @version       0.1
// @namespace https://greasyfork.org/users/715474
// @downloadURL https://update.greasyfork.org/scripts/418468/%C4%B1ll%C4%B1ll%C4%B1%E2%AD%90%F0%9F%8C%9F%20c%CD%99o%CD%99o%CD%99l%CD%99%20b%CD%99l%CD%99a%CD%99c%CD%99k%CD%99%20a%CD%99n%CD%99d%CD%99%20r%CD%99e%CD%99d%CD%99%20b%CD%99a%CD%99c%CD%99k%CD%99g%CD%99r%CD%99o%CD%99u%CD%99n%CD%99d%CD%99%20%F0%9F%8C%9F%E2%AD%90%C4%B1ll%C4%B1ll%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/418468/%C4%B1ll%C4%B1ll%C4%B1%E2%AD%90%F0%9F%8C%9F%20c%CD%99o%CD%99o%CD%99l%CD%99%20b%CD%99l%CD%99a%CD%99c%CD%99k%CD%99%20a%CD%99n%CD%99d%CD%99%20r%CD%99e%CD%99d%CD%99%20b%CD%99a%CD%99c%CD%99k%CD%99g%CD%99r%CD%99o%CD%99u%CD%99n%CD%99d%CD%99%20%F0%9F%8C%9F%E2%AD%90%C4%B1ll%C4%B1ll%C4%B1.meta.js
// ==/UserScript==
(function() {var css = [
	"html {",
	"  background-image: url(https://futurefundies.co.za/wp-content/uploads/2020/08/wallpaperflare.com_wallpaper-33-scaled.jpg) !important;",
	"  background-size: cover !important;",
	"  background-attachment: fixed !important;",
	"  background-position: center center !important;",
	"}",
	"body {",
	"  background: none !important;",
	"}",
	"",
	"body > div:not([style]):not(#searchform):not(#prm-pt):not(#viewport) {",
	"  background-color: rgba(255, 255, 255, 0.2);",
	"}",
	"",
	"#mngb, ",
	"#lga,",
	"#most-visited {",
	"	background: none !important;",
	"}",
	"",
	"",
	"*[class*=\"background\"] {",
	"	background: none !important;",
	"}",
	"",
	"xform,",
	"#uid_0,",
	"#rhs .kp-blk,",
	".sfbg,",
	"#hdtb,",
	"#center_col {",
	"  background-color: rgba(255, 255, 255, 0.6) !important;",
	"}",
	"",
	"#appbar, .appbar,",
	"#fbar {",
	"  background-color: rgba(255, 255, 255, 0.6) !important;",
	"}",
	"",
	"#gsr .sfbgx {",
	"  background: none !important;",
	"  border-bottom: none !important;",
	"}",
	"",
	"form#tsf, ",
	"form#searchform {",
	"	background: none !important;",
	"}",
	"",
	".sfbgg {",
	"  background-color: rgba(255, 255, 255, 0.6);",
	"}",
	"",
	".sfbg .sfbgg {",
	"  background: none !important;",
	"}",
	"",
	"#hdtb.notl div {",
	"  background: none !important;",
	"}",
	"",
	"",
	"c-wiz,",
	".JXv70c {",
	"	background: none !important;",
	"}",
	".UVZlkc {",
	"  background-color: rgba(255, 255, 255, 0.6);",
	"}",
	"",
	"",
	"#nav-menu-wrapper,",
	".story {",
	"  background-color: rgba(255, 255, 255, 0.6);",
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
