// ==UserScript==
// @name          19B4's Kinja Script (Classic)
// @version       2018.03.27
// @namespace     http://19B4.kinja.com/
// @description	  Works on Gawker, Jezebel, Jalopnik, Kotaku, io9, Gizmodo, Lifehacker and Deadspin
// @author        Austin "lash" Williamson
// @homepage      http://19B4.kinja.com/
// @homepage      http://19B4.kinja.com/
// @include       http://gawker.com/*
// @include       https://gawker.com/*
// @include       http://*.gawker.com/*
// @include       https://*.gawker.com/*
// @include       http://jezebel.com/*
// @include       https://jezebel.com/*
// @include       http://*.jezebel.com/*
// @include       https://*.jezebel.com/*
// @include       http://jalopnik.com/*
// @include       https://jalopnik.com/*
// @include       http://*.jalopnik.com/*
// @include       https://*.jalopnik.com/*
// @include       http://kotaku.com/*
// @include       https://kotaku.com/*
// @include       http://*.kotaku.com/*
// @include       https://*.kotaku.com/*
// @include       http://io9.com/*
// @include       https://io9.com/*
// @include       http://*.io9.com/*
// @include       https://*.io9.com/*
// @include       http://gizmodo.kinja.com/*
// @include       https://gizmodo.kinja.com/*
// @include       http://*.gizmodo.kinja.com/*
// @include       https://*.gizmodo.kinja.com/*
// @include       http://gizmodo.com/*
// @include       https://gizmodo.com/*
// @include       http://*.gizmodo.com/*
// @include       https://*.gizmodo.com/*
// @include       http://lifehacker.com/*
// @include       https://lifehacker.com/*
// @include       http://*.lifehacker.com/*
// @include       https://*.lifehacker.com/*
// @include       http://deadspin.com/*
// @include       https://deadspin.com/*
// @include       http://*.deadspin.com/*
// @include       https://*.deadspin.com/*
// @include       http://kinja.com/*
// @include       https://kinja.com/*
// @include       http://*.kinja.com/*
// @include       https://*.kinja.com/*
// @include       https://*.theroot.com/*
// @include       http://theroot.com/*
// @include       http://*.theroot.com/*
// @include       https://theroot.com/*
// @include       https://splinternews.com/*
// @include       https://splinternews.com/
// @include       https://*.splinternews.com/*
// @include       http://splinternews.com/*
// @include       http://splinternews.com/
// @include       http://*.splinternews.com/*
// @include       https://avclub.com/*
// @include       https://*.avclub.com/*
// @include       http://avclub.com/*
// @include       http://*.avclub.com/*
// @include       https://earther.com/*
// @include       https://*.earther.com/*
// @include       http://earther.com/*
// @include       http://*.earther.com/*
// @include       https://theonion.com/*
// @include       https://*.theonion.com/*
// @include       http://theonion.com/*
// @include       http://*.theonion.com/*
// @run-at        document-start
// @grant					 none
// @downloadURL https://update.greasyfork.org/scripts/12485/19B4%27s%20Kinja%20Script%20%28Classic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/12485/19B4%27s%20Kinja%20Script%20%28Classic%29.meta.js
// ==/UserScript==
if (GM_getValue("shown_alert", "") < "1") {
   GM_setValue("shown_alert", "1");
   alert("Thank you for using the Kinja Script. This script is no longer maintained and you are recommended to check out the new version posted on my Kinja blog at 19b4.kinja.com");
}
(function() {var css = [
"head, body {",
"font-size: 10pt !important;",
"}",
"",
".pe_newlayout .post .marquee-asset img {",
"height: auto !important;",
"width: 25% !important;",
"clear: both;",
"float: left;",
"}",
"",
"",
".large-12, .medium-9, .medium-6 {",
"width: 70% !important;",
"float:left;",
"}",
"",
"",
".playIcon, .video-thumb-play .play-icon {",
"width: 74px;",
"height: 74px;",
"float: left;",
"clear: both;",
"top: 30px;",
"left: 60px;",
"}",
"",
"",
		".sidebar__content {",
	"/* display: none; */",
	"    min-width: 100px !important;",
"}",
".main {",
"width: 80% !important;",
"}",
"",
".sidebar {",
"width:20% !important;",
	"position: fixed !important;",
	"left: 0px;",
	"// border: 0px !important;",
	"}",
"",
".main {",
	"/* border: 0px !important; */",
	"}",
"",
".reply__sidebar {",
"height:50px !important;",
"width:50px;",
"}",
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
}
)();

function addStyleSheet(style){
  var getHead = document.getElementsByTagName("HEAD")[0];
  var cssNode = window.document.createElement( 'style' );
  var elementStyle= getHead.appendChild(cssNode);
  elementStyle.innerHTML = style;
  return elementStyle;
}

window.addEventListener('load', function() {
addStyleSheet('@import "https://cdn.rawgit.com/tylerSmithTSS/kinjamprove/14b8d4b2/Kinjamprove/comments.css";'); 
})

addStyleSheet('@import "https://cdn.rawgit.com/tylerSmithTSS/kinjamprove/14b8d4b2/Kinjamprove/comments.css";'); 